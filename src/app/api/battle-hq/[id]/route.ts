// src/app/api/battle-hq/[id]/route.ts
// Battle HQ V1 — Authenticated CRUD for a specific HQ by UUID.
//
// GET    /api/battle-hq/[id]    — active member only       → full HQ + membership
// PATCH  /api/battle-hq/[id]    — creator/editor only      → update standing content
// DELETE /api/battle-hq/[id]    — creator only             → soft-delete (30-day recovery)
//
// All three methods require Bearer token auth.
// All DB access uses the service role client; route-level permission checks
// are the real gate (matching the rest of this codebase).
//
// Immutable fields (PATCH silently ignores):
//   id · creator_user_id · slug · created_at · updated_at
//   · deleted_at · affiliate_nudge_sent_at
//
// Slug changes and ownership transfers get their own dedicated routes
// in Phase 2 — they break URLs / alliance trust and deserve explicit flows.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Shared helpers ────────────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Resolves the caller's user id from the Authorization header.
 * Returns null if missing, malformed, or invalid token.
 */
async function getAuthedUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const supabase = getServiceSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

/**
 * Optional: treat empty-string values as explicit NULL clears.
 * Missing fields → no update. `null` field → no update. Empty string → set NULL.
 */
function coerceNullableText(v: unknown): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return undefined;
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  if (trimmed.length === 0) return null;
  return trimmed;
}

/**
 * For required fields on PATCH (alliance_tag, server) — must be a non-empty
 * string if provided. Missing = no update. Empty string = invalid.
 */
function coerceRequiredText(v: unknown): string | undefined | 'invalid' {
  if (v === undefined) return undefined;
  if (typeof v !== 'string') return 'invalid';
  const trimmed = v.trim();
  if (trimmed.length === 0) return 'invalid';
  return trimmed;
}

// ───────────────────────────────────────────────────────────────────────────
// GET — return full HQ + caller's membership
// ───────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const supabase = getServiceSupabase();

    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select(
        'id, creator_user_id, slug, alliance_tag, server, comms_channel, standing_intel, standing_brief, created_at, updated_at, deleted_at'
      )
      .eq('id', id)
      .maybeSingle();

    if (hqError) {
      console.error('[battle-hq/id GET] HQ lookup error:', hqError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!hq) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Soft-deleted visibility: only the creator can see.
    if (hq.deleted_at && hq.creator_user_id !== userId) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Membership check — caller must have a row for this HQ.
    const { data: membership, error: memError } = await supabase
      .from('battle_hq_memberships')
      .select('role, status, joined_at')
      .eq('battle_hq_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (memError) {
      console.error('[battle-hq/id GET] Membership lookup error:', memError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!membership || membership.status !== 'active') {
      // Revoked, left, or never a member — all treated the same here.
      // The /cc/[slug] page surfaces the nuanced "revoked vs preview" states.
      return NextResponse.json({ error: 'not_a_member' }, { status: 403 });
    }

    return NextResponse.json({
      hq,
      membership: {
        role: membership.role,
        joined_at: membership.joined_at,
      },
    });
  } catch (err) {
    console.error('[battle-hq/id GET] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
// PATCH — update standing content (creator OR editor)
// ───────────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'invalid_body', message: 'Request body must be JSON.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Load HQ for existence + soft-delete check
    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select('id, deleted_at')
      .eq('id', id)
      .maybeSingle();

    if (hqError) {
      console.error('[battle-hq/id PATCH] HQ lookup error:', hqError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!hq || hq.deleted_at) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Membership role check — creator or editor, active only
    const { data: membership, error: memError } = await supabase
      .from('battle_hq_memberships')
      .select('role, status')
      .eq('battle_hq_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (memError) {
      console.error('[battle-hq/id PATCH] Membership lookup error:', memError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (
      !membership ||
      membership.status !== 'active' ||
      (membership.role !== 'creator' && membership.role !== 'editor')
    ) {
      return NextResponse.json(
        {
          error: 'not_authorized',
          message:
            'Only the Battle HQ Commander or Editors can update this HQ.',
        },
        { status: 403 }
      );
    }

    // Build updates object — only include fields that are present and valid
    const updates: Record<string, string | null> = {};

    const allianceTag = coerceRequiredText(body.alliance_tag);
    if (allianceTag === 'invalid') {
      return NextResponse.json(
        { error: 'invalid_field', field: 'alliance_tag' },
        { status: 400 }
      );
    }
    if (allianceTag !== undefined) updates.alliance_tag = allianceTag;

    const server = coerceRequiredText(body.server);
    if (server === 'invalid') {
      return NextResponse.json(
        { error: 'invalid_field', field: 'server' },
        { status: 400 }
      );
    }
    if (server !== undefined) updates.server = server;

    const commsChannel = coerceNullableText(body.comms_channel);
    if (commsChannel !== undefined) updates.comms_channel = commsChannel;

    const standingIntel = coerceNullableText(body.standing_intel);
    if (standingIntel !== undefined) updates.standing_intel = standingIntel;

    const standingBrief = coerceNullableText(body.standing_brief);
    if (standingBrief !== undefined) updates.standing_brief = standingBrief;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'no_fields_to_update' },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from('battle_hqs')
      .update(updates)
      .eq('id', id)
      .select(
        'id, creator_user_id, slug, alliance_tag, server, comms_channel, standing_intel, standing_brief, created_at, updated_at, deleted_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[battle-hq/id PATCH] Update error:', updateError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, hq: updated });
  } catch (err) {
    console.error('[battle-hq/id PATCH] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
// DELETE — soft-delete (creator only)
// ───────────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const supabase = getServiceSupabase();

    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select('id, creator_user_id, deleted_at')
      .eq('id', id)
      .maybeSingle();

    if (hqError) {
      console.error('[battle-hq/id DELETE] HQ lookup error:', hqError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!hq) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    if (hq.creator_user_id !== userId) {
      return NextResponse.json(
        {
          error: 'creator_only',
          message: 'Only the Battle HQ Commander can delete this HQ.',
        },
        { status: 403 }
      );
    }

    if (hq.deleted_at) {
      return NextResponse.json(
        { error: 'already_deleted' },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const { error: deleteError } = await supabase
      .from('battle_hqs')
      .update({
        deleted_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', id);

    if (deleteError) {
      console.error('[battle-hq/id DELETE] Soft-delete error:', deleteError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[battle-hq/id DELETE] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}