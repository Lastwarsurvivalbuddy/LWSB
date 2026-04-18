// src/app/api/battle-hq/[id]/plans/[planId]/checklist-items/route.ts
// Battle HQ V1.1 — Per-plan checklist item CRUD (commander/editor managed).
//
// GET    /api/battle-hq/[id]/plans/[planId]/checklist-items
//   → Returns enabled + disabled items in sort_order. Any active member.
//     Auto-seeds the 6 V1 defaults on first access if the plan has zero rows.
//
// POST   /api/battle-hq/[id]/plans/[planId]/checklist-items
//   → Create a custom item. Creator/editor only.
//     Body: { label: string }
//
// PATCH  /api/battle-hq/[id]/plans/[planId]/checklist-items
//   → Update one item. Creator/editor only.
//     Body: { id: string, label?: string, enabled?: boolean }
//   → Reorder one item. Creator/editor only.
//     Body: { id: string, direction: 'up' | 'down' }
//
// DELETE /api/battle-hq/[id]/plans/[planId]/checklist-items?id=<uuid>
//   → Hard delete. Cascade removes any per-user toggle rows keyed on the
//     same item_key via application-level cleanup (see below). Creator/editor only.
//
// Item key scheme:
// - Default items use fixed keys: troops_maxed, backups_trained, etc.
// - Custom items use their own UUID as item_key so `battle_plan_checklists`
//   rows (keyed by item_key TEXT) stay stable if labels change.

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
  notAuthorizedResponse,
  internalErrorResponse,
  invalidBodyResponse,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string; planId: string }>;
}

const MAX_LABEL_LENGTH = 120;
const MAX_ITEMS_PER_PLAN = 30;

// V1 default checklist items — seeded on first access for any new plan.
const DEFAULT_ITEMS: { item_key: string; label: string }[] = [
  { item_key: 'troops_maxed', label: 'Troops at max capacity' },
  { item_key: 'backups_trained', label: 'Backup troops trained and queued' },
  { item_key: 'hospital_not_full', label: 'Hospital not full' },
  { item_key: 'teleports_stocked', label: 'Teleports stocked (random + advanced)' },
  { item_key: 'shields_stocked', label: 'Shields stocked' },
  { item_key: 'stamina_topped', label: 'Stamina topped' },
];

interface ChecklistItemRow {
  id: string;
  battle_plan_id: string;
  item_key: string;
  label: string;
  is_default: boolean;
  enabled: boolean;
  sort_order: number;
  created_by_user_id: string | null;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Resolves the plan + confirms it exists under this HQ and isn't soft-deleted.
 * Returns null for any failure so callers can 404.
 */
async function resolvePlan(
  supabase: ReturnType<typeof getServiceSupabase>,
  hqId: string,
  planId: string
) {
  const { data, error } = await supabase
    .from('battle_plans')
    .select('id, status, deleted_at')
    .eq('id', planId)
    .eq('battle_hq_id', hqId)
    .maybeSingle();
  if (error) {
    console.error('[checklist-items] Plan lookup error:', error);
    return null;
  }
  if (!data) return null;
  if (data.status === 'deleted' || data.deleted_at) return null;
  return data as { id: string; status: string; deleted_at: string | null };
}

/**
 * Seeds the 6 default items for a plan if it currently has zero rows.
 * Idempotent — safe to call on every GET.
 */
async function ensureSeeded(
  supabase: ReturnType<typeof getServiceSupabase>,
  planId: string
): Promise<void> {
  const { count, error: countError } = await supabase
    .from('battle_plan_checklist_items')
    .select('id', { count: 'exact', head: true })
    .eq('battle_plan_id', planId);

  if (countError) {
    console.error('[checklist-items] Count error:', countError);
    return;
  }
  if ((count ?? 0) > 0) return;

  const rows = DEFAULT_ITEMS.map((item, idx) => ({
    battle_plan_id: planId,
    item_key: item.item_key,
    label: item.label,
    is_default: true,
    enabled: true,
    sort_order: idx,
  }));

  const { error: insertError } = await supabase
    .from('battle_plan_checklist_items')
    .insert(rows);

  if (insertError) {
    console.error('[checklist-items] Seed error:', insertError);
  }
}

async function loadItems(
  supabase: ReturnType<typeof getServiceSupabase>,
  planId: string
): Promise<ChecklistItemRow[]> {
  const { data, error } = await supabase
    .from('battle_plan_checklist_items')
    .select(
      'id, battle_plan_id, item_key, label, is_default, enabled, sort_order, created_by_user_id, created_at'
    )
    .eq('battle_plan_id', planId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('[checklist-items] Load error:', error);
    return [];
  }
  return (data ?? []) as ChecklistItemRow[];
}

// ─── GET ──────────────────────────────────────────────────────────────────

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
      return NextResponse.json({ error: 'not_a_member' }, { status: 403 });
    }

    const plan = await resolvePlan(supabase, hqId, planId);
    if (!plan) return notFoundResponse();

    // Seed defaults on first access
    await ensureSeeded(supabase, planId);

    const items = await loadItems(supabase, planId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[checklist-items GET] Route error:', err);
    return internalErrorResponse();
  }
}

// ─── POST — create custom item ────────────────────────────────────────────

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

    if (typeof body.label !== 'string') {
      return NextResponse.json(
        { error: 'missing_field', field: 'label' },
        { status: 400 }
      );
    }
    const label = body.label.trim();
    if (label.length === 0) {
      return NextResponse.json(
        { error: 'invalid_label', message: 'Label cannot be empty.' },
        { status: 400 }
      );
    }
    if (label.length > MAX_LABEL_LENGTH) {
      return NextResponse.json(
        {
          error: 'invalid_label',
          message: `Label must be ${MAX_LABEL_LENGTH} characters or fewer.`,
        },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can manage the checklist.'
      );
    }

    const plan = await resolvePlan(supabase, hqId, planId);
    if (!plan) return notFoundResponse();

    // Seed defaults first so a brand-new plan doesn't lose them when the
    // first thing the commander does is add a custom item.
    await ensureSeeded(supabase, planId);

    const existing = await loadItems(supabase, planId);
    if (existing.length >= MAX_ITEMS_PER_PLAN) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: `Maximum ${MAX_ITEMS_PER_PLAN} checklist items per plan.`,
        },
        { status: 400 }
      );
    }

    // Custom items use their own UUID as item_key. Let the DB generate it
    // via gen_random_uuid() default, then we'll update item_key to match.
    const nextSortOrder = existing.length;

    const { data: inserted, error: insertError } = await supabase
      .from('battle_plan_checklist_items')
      .insert({
        battle_plan_id: planId,
        item_key: crypto.randomUUID(),
        label,
        is_default: false,
        enabled: true,
        sort_order: nextSortOrder,
        created_by_user_id: userId,
      })
      .select(
        'id, battle_plan_id, item_key, label, is_default, enabled, sort_order, created_by_user_id, created_at'
      )
      .single();

    if (insertError || !inserted) {
      console.error('[checklist-items POST] Insert error:', insertError);
      return internalErrorResponse();
    }

    return NextResponse.json({ item: inserted }, { status: 201 });
  } catch (err) {
    console.error('[checklist-items POST] Route error:', err);
    return internalErrorResponse();
  }
}

// ─── PATCH — edit label, toggle enabled, or reorder ───────────────────────

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

    if (typeof body.id !== 'string' || body.id.trim().length === 0) {
      return NextResponse.json(
        { error: 'missing_field', field: 'id' },
        { status: 400 }
      );
    }
    const itemId = body.id.trim();

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can manage the checklist.'
      );
    }

    const plan = await resolvePlan(supabase, hqId, planId);
    if (!plan) return notFoundResponse();

    // Load target item — must belong to this plan
    const { data: target, error: targetError } = await supabase
      .from('battle_plan_checklist_items')
      .select(
        'id, battle_plan_id, item_key, label, is_default, enabled, sort_order'
      )
      .eq('id', itemId)
      .eq('battle_plan_id', planId)
      .maybeSingle();

    if (targetError) {
      console.error('[checklist-items PATCH] Target lookup error:', targetError);
      return internalErrorResponse();
    }
    if (!target) return notFoundResponse();

    // Reorder branch
    if (body.direction === 'up' || body.direction === 'down') {
      const all = await loadItems(supabase, planId);
      const idx = all.findIndex((i) => i.id === itemId);
      if (idx === -1) return notFoundResponse();

      const swapIdx = body.direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= all.length) {
        // Already at the boundary — no-op success
        return NextResponse.json({ items: all });
      }

      const a = all[idx];
      const b = all[swapIdx];

      // Swap sort_order. UNIQUE(battle_plan_id, item_key) is the only
      // unique constraint; sort_order has no unique constraint so a direct
      // swap is safe.
      const { error: err1 } = await supabase
        .from('battle_plan_checklist_items')
        .update({ sort_order: b.sort_order })
        .eq('id', a.id);
      if (err1) {
        console.error('[checklist-items PATCH] Reorder update A:', err1);
        return internalErrorResponse();
      }
      const { error: err2 } = await supabase
        .from('battle_plan_checklist_items')
        .update({ sort_order: a.sort_order })
        .eq('id', b.id);
      if (err2) {
        console.error('[checklist-items PATCH] Reorder update B:', err2);
        return internalErrorResponse();
      }

      const refreshed = await loadItems(supabase, planId);
      return NextResponse.json({ items: refreshed });
    }

    // Edit branch — label and/or enabled
    const updates: Record<string, unknown> = {};

    if (body.label !== undefined) {
      if (typeof body.label !== 'string') {
        return NextResponse.json(
          { error: 'invalid_label' },
          { status: 400 }
        );
      }
      const trimmed = body.label.trim();
      if (trimmed.length === 0) {
        return NextResponse.json(
          { error: 'invalid_label', message: 'Label cannot be empty.' },
          { status: 400 }
        );
      }
      if (trimmed.length > MAX_LABEL_LENGTH) {
        return NextResponse.json(
          {
            error: 'invalid_label',
            message: `Label must be ${MAX_LABEL_LENGTH} characters or fewer.`,
          },
          { status: 400 }
        );
      }
      updates.label = trimmed;
    }

    if (body.enabled !== undefined) {
      if (typeof body.enabled !== 'boolean') {
        return NextResponse.json(
          { error: 'invalid_enabled' },
          { status: 400 }
        );
      }
      updates.enabled = body.enabled;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'no_changes', message: 'Nothing to update.' },
        { status: 400 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from('battle_plan_checklist_items')
      .update(updates)
      .eq('id', itemId)
      .select(
        'id, battle_plan_id, item_key, label, is_default, enabled, sort_order, created_by_user_id, created_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[checklist-items PATCH] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error('[checklist-items PATCH] Route error:', err);
    return internalErrorResponse();
  }
}

// ─── DELETE — remove a custom item (or hard-delete a default) ─────────────

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId, planId } = await context.params;
    if (!hqId || !planId) return notFoundResponse();

    const url = new URL(req.url);
    const itemId = url.searchParams.get('id');
    if (!itemId) {
      return NextResponse.json(
        { error: 'missing_field', field: 'id' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can manage the checklist.'
      );
    }

    const plan = await resolvePlan(supabase, hqId, planId);
    if (!plan) return notFoundResponse();

    // Confirm target belongs to this plan and grab item_key for cleanup
    const { data: target, error: targetError } = await supabase
      .from('battle_plan_checklist_items')
      .select('id, item_key')
      .eq('id', itemId)
      .eq('battle_plan_id', planId)
      .maybeSingle();

    if (targetError) {
      console.error('[checklist-items DELETE] Target lookup error:', targetError);
      return internalErrorResponse();
    }
    if (!target) return notFoundResponse();

    // Clean up per-user toggle rows for this item_key on this plan.
    // Best-effort — if it fails we still delete the item definition.
    const { error: cleanupError } = await supabase
      .from('battle_plan_checklists')
      .delete()
      .eq('battle_plan_id', planId)
      .eq('item_key', target.item_key);
    if (cleanupError) {
      console.warn(
        '[checklist-items DELETE] Toggle-row cleanup failed (non-fatal):',
        cleanupError
      );
    }

    const { error: deleteError } = await supabase
      .from('battle_plan_checklist_items')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      console.error('[checklist-items DELETE] Delete error:', deleteError);
      return internalErrorResponse();
    }

    // Compact sort_order on remaining rows so arrows stay clean
    const remaining = await loadItems(supabase, planId);
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].sort_order !== i) {
        const { error: compactError } = await supabase
          .from('battle_plan_checklist_items')
          .update({ sort_order: i })
          .eq('id', remaining[i].id);
        if (compactError) {
          console.warn(
            '[checklist-items DELETE] Compact sort_order failed (non-fatal):',
            compactError
          );
        }
      }
    }

    const final = await loadItems(supabase, planId);
    return NextResponse.json({ items: final });
  } catch (err) {
    console.error('[checklist-items DELETE] Route error:', err);
    return internalErrorResponse();
  }
}