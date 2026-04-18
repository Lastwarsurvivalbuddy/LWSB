// src/app/api/battle-hq/[id]/plans/[planId]/checklist/route.ts
// Battle HQ V1.1 — Per-user Pre-War Checklist toggle.
//
// POST /api/battle-hq/[id]/plans/[planId]/checklist
//
// Upserts a battle_plan_checklists row for (plan, user, item_key). Per-user
// state — every active member has their own independent checklist per plan.
//
// Request body:
//   { item_key: string, checked: boolean }
//
// item_key is validated against battle_plan_checklist_items for this plan.
// Any item_key that exists on the plan is valid — whether it's a default or
// a custom commander-added item. Disabled items are rejected (viewers can't
// toggle items the commander turned off).
//
// Behavior:
// - checked === true  → set checked_at = now (or keep existing if already set)
// - checked === false → set checked_at = NULL
// - Row may not exist yet → insert on first toggle
// - Row already matches target state → idempotent no-op, 200 with current state
//
// Permission: any active member of the HQ (including viewers). The checklist
// is a viewer-facing tool — that's its entire purpose.
//
// Plan must be visible to the caller:
// - viewers can toggle against published / active / archived
// - creator / editor can toggle against draft as well
// - deleted plans → 404 to everyone
//
// Responses:
//   200 { item_key, checked_at }
//   400 { error: 'invalid_item_key' | 'missing_field' | 'invalid_body' }
//   403 { error: 'not_a_member' }
//   404 { error: 'not_found' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  isActive,
  isEditorOrCreator,
  loadHq,
  unauthorizedResponse,
  notFoundResponse,
  internalErrorResponse,
  invalidBodyResponse,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string; planId: string }>;
}

// Statuses a viewer can see → also the statuses a viewer can toggle on
const VIEWER_VISIBLE_STATUSES = new Set<string>([
  'published',
  'active',
  'archived',
]);

export async function POST(req: NextRequest, context: RouteContext) {
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

    if (typeof body.item_key !== 'string' || body.item_key.trim().length === 0) {
      return NextResponse.json(
        { error: 'missing_field', field: 'item_key' },
        { status: 400 }
      );
    }
    const itemKey = body.item_key.trim();

    if (typeof body.checked !== 'boolean') {
      return NextResponse.json(
        { error: 'missing_field', field: 'checked' },
        { status: 400 }
      );
    }
    const targetChecked = body.checked;

    const supabase = getServiceSupabase();

    // HQ + membership gate
    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isActive(membership)) {
      return NextResponse.json(
        { error: 'not_a_member' },
        { status: 403 }
      );
    }

    // Plan visibility gate
    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select('id, status, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan checklist] Plan lookup error:', planError);
      return internalErrorResponse();
    }
    if (!plan) return notFoundResponse();
    if (plan.status === 'deleted' || plan.deleted_at) return notFoundResponse();

    const isPrivileged = isEditorOrCreator(membership);
    if (!isPrivileged && !VIEWER_VISIBLE_STATUSES.has(plan.status)) {
      // Viewers can't toggle on drafts
      return notFoundResponse();
    }

    // item_key validation — must exist on this plan AND be enabled.
    // Disabled items "vanish" for viewers (commander disables = item
    // disappears from list, existing user toggle state preserved in DB).
    const { data: itemDef, error: itemDefError } = await supabase
      .from('battle_plan_checklist_items')
      .select('id, item_key, enabled')
      .eq('battle_plan_id', planId)
      .eq('item_key', itemKey)
      .maybeSingle();

    if (itemDefError) {
      console.error('[plan checklist] Item def lookup error:', itemDefError);
      return internalErrorResponse();
    }
    if (!itemDef) {
      return NextResponse.json(
        { error: 'invalid_item_key' },
        { status: 400 }
      );
    }
    if (!itemDef.enabled) {
      return NextResponse.json(
        { error: 'invalid_item_key', message: 'This checklist item is disabled.' },
        { status: 400 }
      );
    }

    // Load existing toggle row (if any) to make toggle idempotent
    const { data: existing, error: existingError } = await supabase
      .from('battle_plan_checklists')
      .select('id, checked_at')
      .eq('battle_plan_id', planId)
      .eq('user_id', userId)
      .eq('item_key', itemKey)
      .maybeSingle();

    if (existingError) {
      console.error(
        '[plan checklist] Existing row lookup error:',
        existingError
      );
      return internalErrorResponse();
    }

    const targetCheckedAt = targetChecked ? new Date().toISOString() : null;

    // No row yet
    if (!existing) {
      const { data: inserted, error: insertError } = await supabase
        .from('battle_plan_checklists')
        .insert({
          battle_plan_id: planId,
          user_id: userId,
          item_key: itemKey,
          checked_at: targetCheckedAt,
        })
        .select('checked_at')
        .single();

      if (insertError || !inserted) {
        console.error('[plan checklist] Insert error:', insertError);
        return internalErrorResponse();
      }

      return NextResponse.json({
        item_key: itemKey,
        checked_at: inserted.checked_at,
      });
    }

    // Row exists — idempotent check
    const currentlyChecked = existing.checked_at !== null;
    if (currentlyChecked === targetChecked) {
      return NextResponse.json({
        item_key: itemKey,
        checked_at: existing.checked_at,
      });
    }

    // State mismatch → update. When unchecking, null out. When checking for
    // the first time after a previous uncheck, set a fresh timestamp.
    const { data: updated, error: updateError } = await supabase
      .from('battle_plan_checklists')
      .update({ checked_at: targetCheckedAt })
      .eq('id', existing.id)
      .select('checked_at')
      .single();

    if (updateError || !updated) {
      console.error('[plan checklist] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({
      item_key: itemKey,
      checked_at: updated.checked_at,
    });
  } catch (err) {
    console.error('[plan checklist] Route error:', err);
    return internalErrorResponse();
  }
}