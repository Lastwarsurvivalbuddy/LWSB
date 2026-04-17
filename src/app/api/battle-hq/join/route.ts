// src/app/api/battle-hq/join/route.ts
// Battle HQ V1 — Authenticated user joins a Battle HQ via slug.
//
// POST /api/battle-hq/join
// Authorization: Bearer <access_token>
// Body: { slug: string }
//
// Handles four cases:
//   1. New member           → insert membership row, role='viewer', status='active'
//                           → insert signup tracking row (first-time only)
//   2. Previously `left`    → flip membership row status back to 'active'
//   3. Already `active`     → idempotent success (no-op)
//   4. `revoked`            → 403, cannot self-restore
//
// Responses:
//   200  { success: true, hq_id, role }
//   400  { error: 'missing_field', field: 'slug' }
//   401  { error: 'Unauthorized' }
//   403  { error: 'revoked', message: '...' }
//   404  { error: 'not_found' }
//   500  { error: 'Internal server error' }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const REVOKED_MESSAGE =
  'Your access to this Battle HQ has been revoked. Contact your alliance leadership if you believe this is a mistake.';

interface JoinBody {
  slug?: unknown;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Auth ────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ─── 2. Parse body ──────────────────────────────────────────────────────
    let body: JoinBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'invalid_body', message: 'Request body must be JSON.' },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(body.slug)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'slug' },
        { status: 400 }
      );
    }
    const slug = body.slug.trim();

    // ─── 3. Look up HQ by slug ──────────────────────────────────────────────
    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select('id')
      .ilike('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (hqError) {
      console.error('[battle-hq/join] HQ lookup error:', hqError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!hq) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // ─── 4. Check existing membership ───────────────────────────────────────
    const { data: existing, error: memLookupError } = await supabase
      .from('battle_hq_memberships')
      .select('id, role, status')
      .eq('battle_hq_id', hq.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (memLookupError) {
      console.error('[battle-hq/join] Membership lookup error:', memLookupError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // ─── 5. Revoked → hard block ────────────────────────────────────────────
    if (existing?.status === 'revoked') {
      return NextResponse.json(
        { error: 'revoked', message: REVOKED_MESSAGE },
        { status: 403 }
      );
    }

    // ─── 6. Already active → idempotent success ─────────────────────────────
    if (existing?.status === 'active') {
      return NextResponse.json({
        success: true,
        hq_id: hq.id,
        role: existing.role,
      });
    }

    // ─── 7. Previously left → flip back to active ───────────────────────────
    if (existing?.status === 'left') {
      const nowIso = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('battle_hq_memberships')
        .update({
          status: 'active',
          status_changed_at: nowIso,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('[battle-hq/join] Rejoin update error:', updateError);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        hq_id: hq.id,
        role: existing.role,
      });
    }

    // ─── 8. New member — insert viewer membership ───────────────────────────
    const { error: insertError } = await supabase
      .from('battle_hq_memberships')
      .insert({
        battle_hq_id: hq.id,
        user_id: user.id,
        role: 'viewer',
        status: 'active',
      });

    if (insertError) {
      console.error('[battle-hq/join] Membership insert error:', insertError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // ─── 9. Signup tracking — first time only (UNIQUE constraint enforces) ──
    // Ignore failures: if this row already exists (user rejoined after leaving
    // before the tracking table was populated), the UNIQUE constraint fires.
    // That's fine — tracking should count first-time joins, not rejoins.
    await supabase
      .from('battle_hq_signup_tracking')
      .insert({
        battle_hq_id: hq.id,
        signed_up_user_id: user.id,
      })
      .select()
      .maybeSingle();

    return NextResponse.json({
      success: true,
      hq_id: hq.id,
      role: 'viewer',
    });
  } catch (err) {
    console.error('[battle-hq/join] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}