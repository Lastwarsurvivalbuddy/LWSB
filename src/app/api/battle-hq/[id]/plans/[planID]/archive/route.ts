// src/app/api/battle-hq/[id]/plans/[planId]/archive/route.ts
// Battle HQ V1 — Archive a Battle Plan.
//
// POST /api/battle-hq/[id]/plans/[planId]/archive
//
// Transitions plan.status to 'archived'. Valid source states:
//   - 'published' → archived (manual archive before auto-trigger)
//   - 'active'    → archived (normal post-war archive)
//   - 'draft'     → archived (rare, but allowed — lets an editor park
//                              an unpublished plan without deleting it)
//
// Idempotency: archiving an already-archived plan is a no-op success.
//
// Blocked states:
//   - 'deleted' → 400 'plan_deleted'
//
// Permission: creator or editor.
//
// Auto-archive cron (scheduled_at + 7 days) also calls this path logic
// via direct DB update; routes are the manual path.
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
        'Only the Battle HQ Commander or Editors can archive Battle Plans.'
      );
    }

    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select('id, status, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan archive] Lookup error:', planError);
      return internalErrorResponse();
    }
    if (!plan) return notFoundResponse();

    if (plan.status === 'deleted' || plan.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before archiving.',
        },
        { status: 400 }
      );
    }

    // Idempotency: already archived → no-op, return current state
    if (plan.status === 'archived') {
      const { data: existing, error: fetchError } = await supabase
        .from('battle_plans')
        .select(PLAN_FULL_COLUMNS)
        .eq('id', planId)
        .eq('battle_hq_id', hqId)
        .single();

      if (fetchError || !existing) {
        console.error('[plan archive] Idempotent fetch error:', fetchError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, plan: existing });
    }

    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update({
        status: 'archived',
        archived_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select(PLAN_FULL_COLUMNS)
      .single();

    if (updateError || !updated) {
      console.error('[plan archive] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan archive] Route error:', err);
    return internalErrorResponse();
  }
}