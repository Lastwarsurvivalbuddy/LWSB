// src/app/api/battle-hq/my/route.ts
// Battle HQ V1 — List HQs the current user runs + is a member of.
//
// GET /api/battle-hq/my
// Authorization: Bearer <access_token>
//
// Powers the two dashboard cards per spec §5.9:
//   - "Battle HQs I Run"  → creator of (active, not soft-deleted)
//   - "Battle HQs I'm In" → active non-creator member of (viewer or editor)
//
// Response shape:
//   {
//     i_run: [
//       {
//         id, slug, alliance_tag, server, role: 'creator',
//         member_count, next_plan: { id, name, scheduled_label } | null
//       },
//       ...
//     ],
//     i_am_in: [
//       {
//         id, slug, alliance_tag, server, role: 'viewer' | 'editor',
//         member_count, next_plan: { id, name, scheduled_label } | null
//       },
//       ...
//     ]
//   }
//
// Notes:
// - Soft-deleted HQs are filtered out (deleted_at IS NULL).
// - Revoked/left memberships are filtered out (status = 'active').
// - "Next plan" = the most recent published/active plan by scheduled_at DESC NULLS LAST,
//   OR by updated_at DESC if no scheduled_at exists. scheduled_label is free-form
//   text (spec §3.4) — we pass it straight through.
// - Returns 200 with empty arrays when user has no HQs — never 404.

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/battle-hq-auth';

// ---------- Types ----------

interface HqListItem {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  role: 'creator' | 'editor' | 'viewer';
  member_count: number;
  next_plan: {
    id: string;
    name: string;
    scheduled_label: string | null;
  } | null;
}

interface MembershipRow {
  battle_hq_id: string;
  role: 'creator' | 'editor' | 'viewer';
  status: 'active' | 'revoked' | 'left';
  battle_hqs: {
    id: string;
    slug: string;
    alliance_tag: string;
    server: string;
    deleted_at: string | null;
  } | null;
}

interface PlanRow {
  id: string;
  battle_hq_id: string;
  name: string;
  scheduled_label: string | null;
  scheduled_at: string | null;
  updated_at: string;
  status: string;
}

// ---------- Route handler ----------

export async function GET(req: NextRequest) {
  try {
    // ── 1. Auth ────────────────────────────────────────────────────────
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const supabase = getServiceSupabase();

    // ── 2. Fetch all active memberships for this user, with HQ joined ──
    // One query gets everything we need — role, status, and the HQ itself.
    const { data: memberships, error: membershipsError } = await supabase
      .from('battle_hq_memberships')
      .select(
        `
          battle_hq_id,
          role,
          status,
          battle_hqs:battle_hq_id (
            id,
            slug,
            alliance_tag,
            server,
            deleted_at
          )
        `
      )
      .eq('user_id', userId)
      .eq('status', 'active');

    if (membershipsError) {
      console.error('[battle-hq/my] Memberships query error:', membershipsError);
      return internalErrorResponse();
    }

    // Filter to memberships whose HQ is still alive (not soft-deleted).
    const liveMemberships = ((memberships ?? []) as unknown as MembershipRow[])
      .filter((m) => m.battle_hqs && !m.battle_hqs.deleted_at);

    // Early return if nothing to enrich
    if (liveMemberships.length === 0) {
      return NextResponse.json({ i_run: [], i_am_in: [] });
    }

    const hqIds = liveMemberships.map((m) => m.battle_hq_id);

    // ── 3. Fetch member counts per HQ (active only) ────────────────────
    // Count active memberships across all HQs this user belongs to.
    // Supabase doesn't have GROUP BY aggregates in the JS client cleanly,
    // so we pull rows and tally in memory — these lists will be small.
    const { data: allActiveMembers, error: countError } = await supabase
      .from('battle_hq_memberships')
      .select('battle_hq_id')
      .in('battle_hq_id', hqIds)
      .eq('status', 'active');

    if (countError) {
      console.error('[battle-hq/my] Member count error:', countError);
      return internalErrorResponse();
    }

    const memberCounts: Record<string, number> = {};
    for (const row of allActiveMembers ?? []) {
      const id = (row as { battle_hq_id: string }).battle_hq_id;
      memberCounts[id] = (memberCounts[id] ?? 0) + 1;
    }

    // ── 4. Fetch next upcoming plan per HQ ─────────────────────────────
    // Plans that are live (published or active) and not deleted.
    // Sort: scheduled_at ASC NULLS LAST, then updated_at DESC as fallback.
    const { data: planRows, error: plansError } = await supabase
      .from('battle_plans')
      .select('id, battle_hq_id, name, scheduled_label, scheduled_at, updated_at, status')
      .in('battle_hq_id', hqIds)
      .in('status', ['published', 'active'])
      .order('scheduled_at', { ascending: true, nullsFirst: false })
      .order('updated_at', { ascending: false });

    if (plansError) {
      console.error('[battle-hq/my] Plans query error:', plansError);
      return internalErrorResponse();
    }

    // Pick the first plan per HQ (the sort above guarantees it's the "next one up").
    const nextPlanByHq: Record<string, PlanRow> = {};
    for (const p of (planRows ?? []) as PlanRow[]) {
      if (!nextPlanByHq[p.battle_hq_id]) {
        nextPlanByHq[p.battle_hq_id] = p;
      }
    }

    // ── 5. Assemble response ───────────────────────────────────────────
    const i_run: HqListItem[] = [];
    const i_am_in: HqListItem[] = [];

    for (const m of liveMemberships) {
      const hq = m.battle_hqs!;
      const nextPlan = nextPlanByHq[m.battle_hq_id] ?? null;

      const item: HqListItem = {
        id: hq.id,
        slug: hq.slug,
        alliance_tag: hq.alliance_tag,
        server: hq.server,
        role: m.role,
        member_count: memberCounts[hq.id] ?? 0,
        next_plan: nextPlan
          ? {
              id: nextPlan.id,
              name: nextPlan.name,
              scheduled_label: nextPlan.scheduled_label,
            }
          : null,
      };

      if (m.role === 'creator') {
        i_run.push(item);
      } else {
        i_am_in.push(item);
      }
    }

    // Stable ordering: by alliance_tag alphabetical within each bucket
    // so the dashboard cards don't reshuffle between refreshes.
    i_run.sort((a, b) => a.alliance_tag.localeCompare(b.alliance_tag));
    i_am_in.sort((a, b) => a.alliance_tag.localeCompare(b.alliance_tag));

    return NextResponse.json({ i_run, i_am_in });
  } catch (err) {
    console.error('[battle-hq/my] Route error:', err);
    return internalErrorResponse();
  }
}