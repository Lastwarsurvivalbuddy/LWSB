// src/app/api/battle-hq/slug-check/route.ts
// Battle HQ V1 — Real-time slug availability check.
//
// GET /api/battle-hq/slug-check?slug=example-slug
//
// Returns whether a slug is available for use as a Battle HQ URL.
// Public endpoint — slugs are not secret, they're meant to be shared via /cc/[slug].
// Rate limiting is handled by middleware.ts.
//
// Response shape:
//   { available: true }                          → slug is valid and unclaimed
//   { available: false, reason: "taken" }        → slug already exists (case-insensitive)
//   { available: false, reason: "too_short" }    → < 3 chars
//   { available: false, reason: "too_long" }     → > 30 chars
//   { available: false, reason: "invalid_format" } → contains non-alphanumeric/dash chars
//   { available: false, reason: "reserved" }     → slug is on the reserved blocklist
//
// Validation rules (per spec §3.2):
//   - 3–30 characters
//   - Alphanumeric + dash only
//   - Case-insensitive uniqueness (store original case, compare lowercase)
//   - Blocklist: cannot use reserved route names

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Reserved slugs — match app routes and common paths to avoid collisions.
// Stored lowercase for comparison. Keep this list in sync with spec §3.2.
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

// Allowed charset: a-z, A-Z, 0-9, and dash. No underscores, no spaces, no other punctuation.
const SLUG_PATTERN = /^[A-Za-z0-9-]+$/;

type UnavailableReason =
  | 'too_short'
  | 'too_long'
  | 'invalid_format'
  | 'reserved'
  | 'taken';

function validateSlugFormat(slug: string): UnavailableReason | null {
  if (slug.length < 3) return 'too_short';
  if (slug.length > 30) return 'too_long';
  if (!SLUG_PATTERN.test(slug)) return 'invalid_format';
  if (RESERVED_SLUGS.has(slug.toLowerCase())) return 'reserved';
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get('slug');

    if (!rawSlug || typeof rawSlug !== 'string') {
      return NextResponse.json(
        { available: false, reason: 'invalid_format' },
        { status: 400 }
      );
    }

    const slug = rawSlug.trim();

    // Format / length / reserved check — before hitting the DB.
    const formatError = validateSlugFormat(slug);
    if (formatError) {
      return NextResponse.json({ available: false, reason: formatError });
    }

    // DB uniqueness check — case-insensitive.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('battle_hqs')
      .select('id')
      .ilike('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      console.error('[slug-check] DB error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (data) {
      return NextResponse.json({ available: false, reason: 'taken' });
    }

    return NextResponse.json({ available: true });
  } catch (err) {
    console.error('[slug-check] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}