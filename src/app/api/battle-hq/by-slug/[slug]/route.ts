// src/app/api/battle-hq/by-slug/[slug]/route.ts
// Battle HQ V1 — Public slug lookup for the /cc/[slug] invite page.
//
// GET /api/battle-hq/by-slug/<slug>
// Authorization: Bearer <access_token>  (optional)
//
// Returns the data the public invite page needs, with a `state` field
// that tells the page which of Cases A–E to render. Auth is optional —
// logged-out visitors get the preview payload without error.
//
// Response variants:
//
//   404  { error: 'not_found' }
//        → slug doesn't exist or the HQ is soft-deleted
//
//   200  { state: 'preview',
//          hq: { alliance_tag, server, creator_name } }
//        → Case A (logged out) OR Case B/E (authed, not an active member)
//
//   200  { state: 'member',
//          membership: { role, joined_at },
//          hq: { id, alliance_tag, server, creator_name,
//                comms_channel, standing_intel, standing_brief },
//          plans: [ { id, name, war_type, status,
//                     scheduled_at, scheduled_label,
//                     published_at, archived_at } ] }
//        → Case C (authed, active member). Plans: published/active/archived.
//          Drafts and deleted plans excluded. Sorted upcoming-first.
//
//   200  { state: 'revoked' }
//        → Case D (authed, revoked member). No HQ info returned — privacy.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug: rawSlug } = await context.params;

    if (!rawSlug || typeof rawSlug !== 'string') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    const slug = rawSlug.trim();
    if (slug.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ─── 1. Look up the HQ by slug (case-insensitive, not soft-deleted) ────
    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select(
        'id, creator_user_id, slug, alliance_tag, server, comms_channel, standing_intel, standing_brief'
      )
      .ilike('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (hqError) {
      console.error('[by-slug] HQ lookup error:', hqError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!hq) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // ─── 2. Resolve creator display name ───────────────────────────────────
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('commander_name')
      .eq('id', hq.creator_user_id)
      .maybeSingle();

    const creatorName =
      (creatorProfile?.commander_name as string | undefined)?.trim() ||
      'Battle HQ Commander';

    // ─── 3. Resolve the caller's auth state (optional) ─────────────────────
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }

    // Not authenticated → Case A preview.
    if (!userId) {
      return NextResponse.json({
        state: 'preview',
        hq: {
          alliance_tag: hq.alliance_tag,
          server: hq.server,
          creator_name: creatorName,
        },
      });
    }

    // ─── 4. Check membership state ─────────────────────────────────────────
    const { data: membership, error: memError } = await supabase
      .from('battle_hq_memberships')
      .select('role, status, joined_at')
      .eq('battle_hq_id', hq.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (memError) {
      console.error('[by-slug] Membership lookup error:', memError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Case D — revoked. No HQ info returned.
    if (membership?.status === 'revoked') {
      return NextResponse.json({ state: 'revoked' });
    }

    // Case C — active member (creator, editor, or viewer).
    if (membership && membership.status === 'active') {
      // ─── 5. Fetch visible plans for this HQ ─────────────────────────────
      // Exclude drafts (only creator/editor see those via /manage) and
      // deleted rows. Include published, active, and archived so the member
      // view can show both upcoming battles and historical record.
      //
      // Sort priority: upcoming battles first (scheduled_at ASC, NULLs last),
      // then most-recently-published, so the section renders with the next
      // battle at the top and older content below.
      const { data: plansData, error: plansError } = await supabase
        .from('battle_plans')
        .select(
          'id, name, war_type, status, scheduled_at, scheduled_label, published_at, archived_at'
        )
        .eq('battle_hq_id', hq.id)
        .in('status', ['published', 'active', 'archived'])
        .order('scheduled_at', { ascending: true, nullsFirst: false })
        .order('published_at', { ascending: false });

      if (plansError) {
        console.error('[by-slug] Plans lookup error:', plansError);
        // Non-fatal — return member state with empty plans array rather
        // than failing the whole response.
      }

      return NextResponse.json({
        state: 'member',
        membership: {
          role: membership.role,
          joined_at: membership.joined_at,
        },
        hq: {
          id: hq.id,
          alliance_tag: hq.alliance_tag,
          server: hq.server,
          creator_name: creatorName,
          comms_channel: hq.comms_channel,
          standing_intel: hq.standing_intel,
          standing_brief: hq.standing_brief,
        },
        plans: plansData ?? [],
      });
    }

    // Case B (no membership row) OR Case E (`left` member) → both render as preview.
    return NextResponse.json({
      state: 'preview',
      hq: {
        alliance_tag: hq.alliance_tag,
        server: hq.server,
        creator_name: creatorName,
      },
    });
  } catch (err) {
    console.error('[by-slug] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}