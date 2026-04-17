// src/app/api/battle-hq/[id]/plans/[planId]/unarchive/route.ts
// Battle HQ V1 — Unarchive a Battle Plan.
//
// POST /api/battle-hq/[id]/plans/[planId]/unarchive
//
// Reverses an archive. The plan returns to the correct non-archived state
// based on its scheduled_at:
//
//   - scheduled_at in the future (or NULL) → 'published'
//   - scheduled_at in the past              → 'active'
//     (matches the auto-transition logic: once scheduled_at passes, the plan
//      is an active war, not an upcoming one)
//
// Clears archived_at. Touches updated_at.
//
// Permission: creator or editor.
// Idempotent for non-archived states: returns current state unchanged.
// Blocked for 'deleted'.
//
// Responses:
//   200 { success: true, plan }
//   400 { error: 'plan_deleted' }
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
        'Only the Battle HQ Commander or Editors can unarchive Battle Plans.'
      );
    }

    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select('id, status, scheduled_at, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan unarchive] Lookup error:', planError);
      return internalErrorResponse();
    }
    if (!plan) return notFoundResponse();

    if (plan.status === 'deleted' || plan.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before unarchiving.',
        },
        { status: 400 }
      );
    }

    // Idempotency: already in a non-archived state → no-op, return current
    if (plan.status !== 'archived') {
      const { data: existing, error: fetchError } = await supabase
        .from('battle_plans')
        .select(PLAN_FULL_COLUMNS)
        .eq('id', planId)
        .eq('battle_hq_id', hqId)
        .single();

      if (fetchError || !existing) {
        console.error('[plan unarchive] Idempotent fetch error:', fetchError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, plan: existing });
    }

    // Determine target state based on scheduled_at
    const now = new Date();
    let targetStatus: 'published' | 'active' = 'published';

    if (plan.scheduled_at) {
      const scheduled = new Date(plan.scheduled_at);
      if (!Number.isNaN(scheduled.getTime()) && scheduled.getTime() <= now.getTime()) {
        targetStatus = 'active';
      }
    }

    const nowIso = now.toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update({
        status: targetStatus,
        archived_at: null,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select(PLAN_FULL_COLUMNS)
      .single();

    if (updateError || !updated) {
      console.error('[plan unarchive] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan unarchive] Route error:', err);
    return internalErrorResponse();
  }
}