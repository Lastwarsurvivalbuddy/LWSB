// src/app/api/battle-hq/create/route.ts
// Battle HQ V1 — Create a new Battle HQ.
//
// POST /api/battle-hq/create
// Authorization: Bearer <access_token>
//
// Founding-only. Rate-limited to 3 per 7-day rolling window
// (override via profiles.battle_hq_creation_override).
//
// Creates the battle_hqs row AND the creator's initial membership row
// (role='creator', status='active'). If the membership insert fails,
// the orphan HQ row is deleted to keep state clean.
//
// Request body:
//   {
//     slug: string,               // 3-30 chars, alphanumeric + dash, not reserved
//     alliance_tag: string,       // required, non-empty
//     server: string,             // required, non-empty
//     comms_channel?: string,     // optional, HQ-level default
//     standing_intel?: string,    // optional
//     standing_brief?: string,    // optional
//   }
//
// Responses:
//   201  { id, slug }                                                           → created
//   400  { error: 'missing_field', field: 'alliance_tag' }                      → required field blank
//   400  { error: 'invalid_slug', reason: 'too_short' | 'too_long'
//                                          | 'invalid_format' | 'reserved'
//                                          | 'taken' }                         → slug problem
//   401  { error: 'Unauthorized' }                                              → no / bad token
//   403  { error: 'founding_required', message: '...' }                         → not a founding member
//   429  { error: 'rate_limit_exceeded', message: '...' }                       → weekly cap hit
//   500  { error: 'Internal server error' }                                     → unexpected failure

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Slug validation — must stay in sync with slug-check/route.ts ───────────
const RESERVED_SLUGS = new Set<string>([
  'admin',
  'api',
  'guide',
  'signin',
  'signup',
  'dashboard',
  'mission-control',
  'upgrade',
  'affiliate',
  'contact',
  'news',
  'cc',
  'join',
  'new',
  'trash',
  'settings',
  'profile',
]);

const SLUG_PATTERN = /^[A-Za-z0-9-]+$/;

type SlugError = 'too_short' | 'too_long' | 'invalid_format' | 'reserved';

function validateSlugFormat(slug: string): SlugError | null {
  if (slug.length < 3) return 'too_short';
  if (slug.length > 30) return 'too_long';
  if (!SLUG_PATTERN.test(slug)) return 'invalid_format';
  if (RESERVED_SLUGS.has(slug.toLowerCase())) return 'reserved';
  return null;
}

// ─── Rate limit config ──────────────────────────────────────────────────────
const DEFAULT_CREATION_CAP = 3;
const RATE_LIMIT_WINDOW_DAYS = 7;
const RATE_LIMIT_MESSAGE =
  "You've created your maximum Battle HQs for this week. Contact the Administrator if you need more.";

// ─── Body typing ────────────────────────────────────────────────────────────
interface CreateHQBody {
  slug?: unknown;
  alliance_tag?: unknown;
  server?: unknown;
  comms_channel?: unknown;
  standing_intel?: unknown;
  standing_brief?: unknown;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// ─── Route handler ──────────────────────────────────────────────────────────
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

    // ─── 2. Founding-tier check ─────────────────────────────────────────────
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!sub || sub.tier !== 'founding') {
      return NextResponse.json(
        {
          error: 'founding_required',
          message:
            'Creating a Battle HQ requires Founding Member access. Upgrade at /upgrade to unlock.',
        },
        { status: 403 }
      );
    }

    // ─── 3. Parse + validate body ───────────────────────────────────────────
    let body: CreateHQBody;
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
    if (!isNonEmptyString(body.alliance_tag)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'alliance_tag' },
        { status: 400 }
      );
    }
    if (!isNonEmptyString(body.server)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'server' },
        { status: 400 }
      );
    }

    const slug = body.slug.trim();
    const allianceTag = body.alliance_tag.trim();
    const server = body.server.trim();

    const commsChannel = isNonEmptyString(body.comms_channel)
      ? body.comms_channel.trim()
      : null;
    const standingIntel = isNonEmptyString(body.standing_intel)
      ? body.standing_intel.trim()
      : null;
    const standingBrief = isNonEmptyString(body.standing_brief)
      ? body.standing_brief.trim()
      : null;

    // Slug format / reserved check
    const formatError = validateSlugFormat(slug);
    if (formatError) {
      return NextResponse.json(
        { error: 'invalid_slug', reason: formatError },
        { status: 400 }
      );
    }

    // ─── 4. Rate limit check ────────────────────────────────────────────────
    // Look up creator's override; fall back to default cap of 3.
    const { data: profile } = await supabase
      .from('profiles')
      .select('battle_hq_creation_override')
      .eq('id', user.id)
      .maybeSingle();

    const cap =
      typeof profile?.battle_hq_creation_override === 'number'
        ? profile.battle_hq_creation_override
        : DEFAULT_CREATION_CAP;

    // Count HQs this creator has made in the last 7 days.
    // Soft-deleted HQs within the window STILL COUNT — prevents create/delete bypass.
    const windowStart = new Date();
    windowStart.setUTCDate(windowStart.getUTCDate() - RATE_LIMIT_WINDOW_DAYS);

    const { count: recentCount, error: countError } = await supabase
      .from('battle_hqs')
      .select('id', { count: 'exact', head: true })
      .eq('creator_user_id', user.id)
      .gte('created_at', windowStart.toISOString());

    if (countError) {
      console.error('[battle-hq/create] Rate limit count error:', countError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if ((recentCount ?? 0) >= cap) {
      return NextResponse.json(
        { error: 'rate_limit_exceeded', message: RATE_LIMIT_MESSAGE },
        { status: 429 }
      );
    }

    // ─── 5. Slug uniqueness check (case-insensitive, ignore soft-deleted) ───
    const { data: existing } = await supabase
      .from('battle_hqs')
      .select('id')
      .ilike('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'invalid_slug', reason: 'taken' },
        { status: 400 }
      );
    }

    // ─── 6. Insert HQ ───────────────────────────────────────────────────────
    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .insert({
        creator_user_id: user.id,
        slug,
        alliance_tag: allianceTag,
        server,
        comms_channel: commsChannel,
        standing_intel: standingIntel,
        standing_brief: standingBrief,
      })
      .select('id, slug')
      .single();

    if (hqError || !hq) {
      // Unique constraint violation on slug → race condition lost.
      // Supabase returns code '23505' for unique violations.
      const anyErr = hqError as { code?: string } | null;
      if (anyErr?.code === '23505') {
        return NextResponse.json(
          { error: 'invalid_slug', reason: 'taken' },
          { status: 400 }
        );
      }

      console.error('[battle-hq/create] HQ insert error:', hqError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // ─── 7. Insert creator's membership row ─────────────────────────────────
    const { error: membershipError } = await supabase
      .from('battle_hq_memberships')
      .insert({
        battle_hq_id: hq.id,
        user_id: user.id,
        role: 'creator',
        status: 'active',
      });

    if (membershipError) {
      // Orphan HQ cleanup — best-effort rollback.
      console.error(
        '[battle-hq/create] Membership insert failed, rolling back HQ:',
        membershipError
      );
      await supabase.from('battle_hqs').delete().eq('id', hq.id);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // ─── 8. Return success ──────────────────────────────────────────────────
    return NextResponse.json({ id: hq.id, slug: hq.slug }, { status: 201 });
  } catch (err) {
    console.error('[battle-hq/create] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}