// src/app/api/battle-hq/[id]/plans/[planId]/restore/route.ts
// Battle HQ V1 — Restore a soft-deleted Battle Plan from trash.
//
// POST /api/battle-hq/[id]/plans/[planId]/restore
//
// Reverses a soft-delete within the 30-day trash window. Plan returns to
// the most sensible non-deleted state based on its historical markers:
//
//   - published_at set AND scheduled_at in the past  → 'active'
//   - published_at set AND scheduled_at in the future → 'published'
//   - published_at set AND no scheduled_at            → 'published'
//                                                        (edge case —
//                                                         legacy schedule cleared)
//   - archived_at set  → 'archived'
//   - otherwise        → 'draft'
//
// Notes:
//   - If BOTH published_at and archived_at are set (plan was published,
//     then archived, then deleted), the archived state wins — that's
//     where it was when it was deleted.
//   - Clears deleted_at. Does NOT touch published_at / archived_at —
//     those are historical markers, not current state indicators.
//
// Permission: creator or editor. (Spec §4.3 says "restore from trash
// within 30 days" without restricting to creator, and membership.role
// editor owns plan editing generally.)
//
// Blocked if:
//   - Plan not found → 404
//   - Plan not currently soft-deleted → 400 'not_deleted' (idempotency:
//     restoring a non-deleted plan would be a no-op, but returning 400
//     here surfaces the caller confusion rather than hiding it)
//   - deleted_at more than 30 days ago → 400 'trash_window_expired'
//
// Responses:
//   200 { success: true, plan }
//   400 { error: 'not_deleted' | 'trash_window_expired' }
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
  params: Promise<{ id: string; planId: string }>;
}

const PLAN_FULL_COLUMNS =
  'id, battle_hq_id, created_by_user_id, name, war_type, scheduled_at, status, comms_channel, orders, brief, intel, map_image_url, map_annotations_json, parent_plan_id, created_at, updated_at, published_at, archived_at, deleted_at';

const TRASH_WINDOW_DAYS = 30;

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId, planId } = await context.params;
    if (!hqId || !planId) return notFoundResponse();

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can restore Battle Plans.'
      );
    }

    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select(
        'id, status, scheduled_at, published_at, archived_at, deleted_at'
      )
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan restore] Lookup error:', planError);
      return internalErrorResponse();
    }
    if (!plan) return notFoundResponse();

    // Must be soft-deleted to restore
    if (plan.status !== 'deleted' || !plan.deleted_at) {
      return NextResponse.json(
        {
          error: 'not_deleted',
          message: 'This plan is not in the trash.',
        },
        { status: 400 }
      );
    }

    // 30-day trash window check
    const deletedAt = new Date(plan.deleted_at);
    const windowCutoff = new Date();
    windowCutoff.setUTCDate(windowCutoff.getUTCDate() - TRASH_WINDOW_DAYS);
    if (deletedAt.getTime() < windowCutoff.getTime()) {
      return NextResponse.json(
        {
          error: 'trash_window_expired',
          message:
            'This plan was deleted more than 30 days ago and can no longer be restored.',
        },
        { status: 400 }
      );
    }

    // Determine target status from historical markers
    const now = new Date();
    let targetStatus: 'draft' | 'published' | 'active' | 'archived' = 'draft';

    if (plan.archived_at) {
      targetStatus = 'archived';
    } else if (plan.published_at) {
      if (plan.scheduled_at) {
        const scheduled = new Date(plan.scheduled_at);
        if (
          !Number.isNaN(scheduled.getTime()) &&
          scheduled.getTime() <= now.getTime()
        ) {
          targetStatus = 'active';
        } else {
          targetStatus = 'published';
        }
      } else {
        targetStatus = 'published';
      }
    }

    const nowIso = now.toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update({
        status: targetStatus,
        deleted_at: null,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select(PLAN_FULL_COLUMNS)
      .single();

    if (updateError || !updated) {
      console.error('[plan restore] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan restore] Route error:', err);
    return internalErrorResponse();
  }
}