// src/app/api/battle-hq/[id]/plans/[planId]/route.ts
// Battle HQ V1 — Single Battle Plan CRUD.
//
// GET /api/battle-hq/[id]/plans/[planId] — load plan (member-gated; drafts editor+ only)
// PATCH /api/battle-hq/[id]/plans/[planId] — update plan (creator/editor)
// DELETE /api/battle-hq/[id]/plans/[planId] — soft-delete (creator/editor)
//
// PATCHable fields:
//   name            — non-empty string if present
//   war_type        — one of the 6 valid types if present
//   scheduled_at    — ISO string / null (empty string = null)
//   scheduled_label — free-text label / null (empty string = null)
//   comms_channel   — nullable text
//   orders          — nullable text
//   brief           — nullable text
//   intel           — nullable text
//
// Immutable fields (silently ignored on PATCH):
//   id, battle_hq_id, created_by_user_id, status, map_image_url,
//   map_annotations_json, parent_plan_id, created_at, updated_at,
//   published_at, archived_at, deleted_at
//
// Status transitions are NOT handled here — use /publish, /archive,
// /unarchive, /restore instead. Map updates go through /upload-map
// and /annotations.
//
// Viewer vs editor visibility on GET:
//   - viewer         → only status in ('published','active','archived') returned; drafts 404
//   - creator/editor → all non-deleted plans visible; deleted plans 404 to non-creator
//   - creator        → soft-deleted plans visible (for trash / restore UX)

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  isEditorOrCreator,
  isActive,
  isCreator,
  loadHq,
  unauthorizedResponse,
  notFoundResponse,
  notAuthorizedResponse,
  internalErrorResponse,
  invalidBodyResponse,
  coerceNullableText,
  coerceRequiredText,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string; planId: string }>;
}

const VALID_WAR_TYPES = new Set<string>([
  'desert_storm',
  'warzone_duel',
  'canyon_storm',
  'svs',
  'alliance_mobilization',
  'other',
]);

// Full plan columns — used on GET + PATCH return. Editor UI needs everything.
const PLAN_FULL_COLUMNS =
  'id, battle_hq_id, created_by_user_id, name, war_type, scheduled_at, scheduled_label, status, comms_channel, orders, brief, intel, map_image_url, map_annotations_json, parent_plan_id, created_at, updated_at, published_at, archived_at, deleted_at';

// Statuses viewers are allowed to see
const VIEWER_VISIBLE_STATUSES = new Set<string>([
  'published',
  'active',
  'archived',
]);

// ─────────────────────────────────────────────────────────────────────────
// GET — load single plan
// ─────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId, planId } = await context.params;
    if (!hqId || !planId) return notFoundResponse();

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isActive(membership)) {
      return NextResponse.json(
        { error: 'not_a_member' },
        { status: 403 }
      );
    }

    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select(PLAN_FULL_COLUMNS)
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan GET] Query error:', planError);
      return internalErrorResponse();
    }

    if (!plan) return notFoundResponse();

    const isPrivileged = isEditorOrCreator(membership);
    const callerIsCreator = isCreator(membership);

    // Deleted plans: only creator sees them (for trash / restore UX)
    if (plan.status === 'deleted' && !callerIsCreator) {
      return notFoundResponse();
    }

    // Draft visibility: editors/creator only. Viewers get 404.
    if (plan.status === 'draft' && !isPrivileged) {
      return notFoundResponse();
    }

    // Viewer status guard (defense in depth — we already block draft above)
    if (!isPrivileged && !VIEWER_VISIBLE_STATUSES.has(plan.status)) {
      return notFoundResponse();
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error('[plan GET] Route error:', err);
    return internalErrorResponse();
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PATCH — update plan (creator/editor only)
// ─────────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId, planId } = await context.params;
    if (!hqId || !planId) return notFoundResponse();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return invalidBodyResponse();
    }

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can update Battle Plans.'
      );
    }

    // Confirm plan exists + is not soft-deleted before allowing edits.
    const { data: existing, error: existingError } = await supabase
      .from('battle_plans')
      .select('id, status, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (existingError) {
      console.error('[plan PATCH] Existence check error:', existingError);
      return internalErrorResponse();
    }
    if (!existing) return notFoundResponse();
    if (existing.status === 'deleted' || existing.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before editing.',
        },
        { status: 400 }
      );
    }

    // Build update payload — only include fields that changed
    const updates: Record<string, string | null> = {};

    const name = coerceRequiredText(body.name);
    if (name === 'invalid') {
      return NextResponse.json(
        { error: 'invalid_field', field: 'name' },
        { status: 400 }
      );
    }
    if (name !== undefined) updates.name = name;

    if (body.war_type !== undefined) {
      if (typeof body.war_type !== 'string' || !VALID_WAR_TYPES.has(body.war_type)) {
        return NextResponse.json(
          { error: 'invalid_war_type' },
          { status: 400 }
        );
      }
      updates.war_type = body.war_type;
    }

    // scheduled_at: undefined=no change, null or ""=clear, string=parse
    if (body.scheduled_at !== undefined) {
      if (body.scheduled_at === null) {
        updates.scheduled_at = null;
      } else if (typeof body.scheduled_at !== 'string') {
        return NextResponse.json(
          { error: 'invalid_field', field: 'scheduled_at' },
          { status: 400 }
        );
      } else {
        const trimmed = body.scheduled_at.trim();
        if (trimmed.length === 0) {
          updates.scheduled_at = null;
        } else {
          const parsed = new Date(trimmed);
          if (Number.isNaN(parsed.getTime())) {
            return NextResponse.json(
              { error: 'invalid_field', field: 'scheduled_at' },
              { status: 400 }
            );
          }
          updates.scheduled_at = parsed.toISOString();
        }
      }
    }

    // scheduled_label: free-text label, nullable text
    const scheduledLabel = coerceNullableText(body.scheduled_label);
    if (scheduledLabel !== undefined) updates.scheduled_label = scheduledLabel;

    const commsChannel = coerceNullableText(body.comms_channel);
    if (commsChannel !== undefined) updates.comms_channel = commsChannel;

    const orders = coerceNullableText(body.orders);
    if (orders !== undefined) updates.orders = orders;

    const brief = coerceNullableText(body.brief);
    if (brief !== undefined) updates.brief = brief;

    const intel = coerceNullableText(body.intel);
    if (intel !== undefined) updates.intel = intel;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'no_fields_to_update' },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update(updates)
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select(PLAN_FULL_COLUMNS)
      .single();

    if (updateError || !updated) {
      console.error('[plan PATCH] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan PATCH] Route error:', err);
    return internalErrorResponse();
  }
}

// ─────────────────────────────────────────────────────────────────────────
// DELETE — soft-delete (creator/editor)
// ─────────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest, context: RouteContext) {
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
        'Only the Battle HQ Commander or Editors can delete Battle Plans.'
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from('battle_plans')
      .select('id, status')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (existingError) {
      console.error('[plan DELETE] Existence check error:', existingError);
      return internalErrorResponse();
    }
    if (!existing) return notFoundResponse();
    if (existing.status === 'deleted') {
      return NextResponse.json(
        { error: 'already_deleted' },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const { error: deleteError } = await supabase
      .from('battle_plans')
      .update({
        status: 'deleted',
        deleted_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId);

    if (deleteError) {
      console.error('[plan DELETE] Soft-delete error:', deleteError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[plan DELETE] Route error:', err);
    return internalErrorResponse();
  }
}