// src/app/api/battle-hq/[id]/plans/[planId]/publish/route.ts
// Battle HQ V1 — Publish a Battle Plan (draft → published).
//
// POST /api/battle-hq/[id]/plans/[planId]/publish
//
// Transitions plan.status from 'draft' to 'published'. Requires scheduled_at
// to be set (publish without a schedule is meaningless for the viewer UX).
//
// Permission: creator or editor.
//
// Idempotency: re-publishing an already-published plan is a no-op success.
// 'active' plans (auto-transitioned from published once scheduled_at passes)
// are also accepted silently — no status change, just returns the plan.
//
// Archived, deleted plans → 400 (must unarchive/restore first).
//
// Notification fan-out (publish → all active members) lives in Phase 3
// integration. This route writes no notifications yet — that's intentional
// per spec §7 "verify notifications infra before layering inserts."
//
// Responses:
//   200 { success: true, plan } → published (or already published/active)
//   400 { error: 'scheduled_at_required' } → can't publish without schedule
//   400 { error: 'plan_archived' | 'plan_deleted' }
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
        'Only the Battle HQ Commander or Editors can publish Battle Plans.'
      );
    }

    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select('id, status, scheduled_at, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan publish] Lookup error:', planError);
      return internalErrorResponse();
    }
    if (!plan) return notFoundResponse();

    // Blocked states
    if (plan.status === 'deleted' || plan.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before publishing.',
        },
        { status: 400 }
      );
    }
    if (plan.status === 'archived') {
      return NextResponse.json(
        {
          error: 'plan_archived',
          message: 'Unarchive this plan before publishing.',
        },
        { status: 400 }
      );
    }

    // Idempotency: already-published or auto-advanced to active → no-op
    if (plan.status === 'published' || plan.status === 'active') {
      const { data: existing, error: fetchError } = await supabase
        .from('battle_plans')
        .select(PLAN_FULL_COLUMNS)
        .eq('id', planId)
        .eq('battle_hq_id', hqId)
        .single();

      if (fetchError || !existing) {
        console.error('[plan publish] Idempotent fetch error:', fetchError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, plan: existing });
    }

    // Only 'draft' reaches here.
    if (!plan.scheduled_at) {
      return NextResponse.json(
        {
          error: 'scheduled_at_required',
          message:
            'Set a scheduled time before publishing this Battle Plan.',
        },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update({
        status: 'published',
        published_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select(PLAN_FULL_COLUMNS)
      .single();

    if (updateError || !updated) {
      console.error('[plan publish] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan publish] Route error:', err);
    return internalErrorResponse();
  }
}