// src/app/api/battle-hq/[id]/members/route.ts
// Battle HQ V1 — List members of a Battle HQ.
//
// GET /api/battle-hq/[id]/members
//
// Returns all memberships for this HQ grouped by status. Each row is
// enriched with the member's commander_name, rank, and tier (where
// available) by joining against profiles + subscriptions via service-role
// queries.
//
// Permission: creator or editor. Viewers do not see the full member list
// (alliance membership is a private concern for R4/R5s).
//
// Response shape:
//   {
//     members: {
//       active:  Member[],   // role='creator' | 'editor' | 'viewer', status='active'
//       removed: Member[],   // status='revoked' or 'left'
//     },
//     counts: { active, editors, viewers, removed, total_ever }
//   }
//
//   Member = {
//     user_id, role, status, joined_at, status_changed_at,
//     commander_name, rank, tier
//   }
//
// 'active' list is sorted: creator → editors (by joined_at) → viewers
// (by joined_at). 'removed' list is sorted by status_changed_at desc.
//
// Note: Spec §5.4 specifies Members tab shows Active · Editors · Removed.
// Editors are a subset of Active, so the dashboard filters client-side
// on `role === 'editor'`. This route returns the raw groupings.
//
// Responses:
//   200 { members, counts }
//   403 { error: 'not_authorized' }
//   404 { error: 'not_found' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  isEditorOrCreator,
  loadHq,
  unauthorizedResponse,
  notFoundResponse,
  notAuthorizedResponse,
  internalErrorResponse,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

type Role = 'creator' | 'editor' | 'viewer';
type Status = 'active' | 'revoked' | 'left';

interface MembershipRow {
  user_id: string;
  role: Role;
  status: Status;
  joined_at: string;
  status_changed_at: string;
}

interface ProfileRow {
  id: string;
  commander_name: string | null;
  rank: string | null;
}

interface SubscriptionRow {
  user_id: string;
  tier: string | null;
}

interface EnrichedMember extends MembershipRow {
  commander_name: string | null;
  rank: string | null;
  tier: string | null;
}

// Role sort weight for active list — creator first, editor next, viewer last
const ROLE_WEIGHT: Record<Role, number> = {
  creator: 0,
  editor: 1,
  viewer: 2,
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId } = await context.params;
    if (!hqId) return notFoundResponse();

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const callerMembership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can view the member list.'
      );
    }

    // 1) Load all memberships for this HQ
    const { data: memberships, error: memError } = await supabase
      .from('battle_hq_memberships')
      .select('user_id, role, status, joined_at, status_changed_at')
      .eq('battle_hq_id', hqId);

    if (memError) {
      console.error('[hq members] Memberships query error:', memError);
      return internalErrorResponse();
    }

    const rows = (memberships ?? []) as MembershipRow[];
    if (rows.length === 0) {
      return NextResponse.json({
        members: { active: [], removed: [] },
        counts: {
          active: 0,
          editors: 0,
          viewers: 0,
          removed: 0,
          total_ever: 0,
        },
      });
    }

    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));

    // 2) Load profile + subscription enrichment in parallel
    const [profilesResult, subsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, commander_name, rank')
        .in('id', userIds),
      supabase
        .from('subscriptions')
        .select('user_id, tier')
        .in('user_id', userIds),
    ]);

    if (profilesResult.error) {
      console.error('[hq members] Profiles query error:', profilesResult.error);
      return internalErrorResponse();
    }
    if (subsResult.error) {
      console.error('[hq members] Subscriptions query error:', subsResult.error);
      return internalErrorResponse();
    }

    const profileById = new Map<string, ProfileRow>();
    for (const p of (profilesResult.data ?? []) as ProfileRow[]) {
      profileById.set(p.id, p);
    }
    const tierByUserId = new Map<string, string | null>();
    for (const s of (subsResult.data ?? []) as SubscriptionRow[]) {
      tierByUserId.set(s.user_id, s.tier ?? null);
    }

    const enriched: EnrichedMember[] = rows.map((row) => {
      const profile = profileById.get(row.user_id);
      return {
        ...row,
        commander_name: profile?.commander_name ?? null,
        rank: profile?.rank ?? null,
        tier: tierByUserId.get(row.user_id) ?? null,
      };
    });

    // 3) Partition and sort
    const active = enriched
      .filter((m) => m.status === 'active')
      .sort((a, b) => {
        const roleDiff = ROLE_WEIGHT[a.role] - ROLE_WEIGHT[b.role];
        if (roleDiff !== 0) return roleDiff;
        return (
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        );
      });

    const removed = enriched
      .filter((m) => m.status === 'revoked' || m.status === 'left')
      .sort(
        (a, b) =>
          new Date(b.status_changed_at).getTime() -
          new Date(a.status_changed_at).getTime()
      );

    const editorsCount = active.filter((m) => m.role === 'editor').length;
    const viewersCount = active.filter((m) => m.role === 'viewer').length;

    return NextResponse.json({
      members: { active, removed },
      counts: {
        active: active.length,
        editors: editorsCount,
        viewers: viewersCount,
        removed: removed.length,
        total_ever: enriched.length,
      },
    });
  } catch (err) {
    console.error('[hq members] Route error:', err);
    return internalErrorResponse();
  }
}