// src/app/api/battle-hq/[id]/plans/[planId]/duplicate/route.ts
// Battle HQ V1.1 — Duplicate a Battle Plan as a new Draft.
//
// POST /api/battle-hq/[id]/plans/[planId]/duplicate
//
// Creates a new battle_plans row copying:
// - name (with " (copy)" suffix)
// - war_type
// - orders, brief, intel
// - comms_channel
// - map_image_url (re-references same Storage object — no re-upload)
// - map_annotations_json (structured overlay is cloned directly)
//
// Also copies:
// - All battle_plan_checklist_items rows (labels, defaults, enabled flags,
//   sort_order). Custom items get fresh UUIDs for their item_key so they
//   stay unique per plan. Default items keep their fixed item_keys
//   (troops_maxed, etc). Per-user toggle state does NOT carry over —
//   fresh plan means fresh check state for everyone.
//
// Clears:
// - scheduled_at → NULL (forces conscious re-entry before publishing)
// - status → 'draft'
// - published_at, archived_at, deleted_at → NULL
//
// Sets:
// - parent_plan_id → source plan id (audit trail; banner copy in editor)
// - created_by_user_id → current user (the duplicator, not the original author)
//
// Permission: creator or editor.
//
// Source plan must not be soft-deleted. Archived sources ARE duplicatable —
// that's a normal "rerun last month's SvS plan" flow.
//
// Spec copy for the editor banner (Section 10):
//   "This is a copy of [original name]. Edit freely — changes here do not
//   affect the original. Set the new scheduled time before publishing."
//
// Responses:
//   201 { id, parent_plan_id }
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

const COPY_SUFFIX = ' (copy)';

// Fixed default item_keys — preserved across duplicates so default items
// stay "the same item" conceptually. Custom items get new UUIDs.
const DEFAULT_ITEM_KEYS = new Set<string>([
  'troops_maxed',
  'backups_trained',
  'hospital_not_full',
  'teleports_stocked',
  'shields_stocked',
  'stamina_topped',
]);

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
        'Only the Battle HQ Commander or Editors can duplicate Battle Plans.'
      );
    }

    // Load source plan — need full copyable payload
    const { data: source, error: sourceError } = await supabase
      .from('battle_plans')
      .select(
        'id, battle_hq_id, name, war_type, comms_channel, orders, brief, intel, map_image_url, map_annotations_json, status, deleted_at'
      )
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (sourceError) {
      console.error('[plan duplicate] Source lookup error:', sourceError);
      return internalErrorResponse();
    }
    if (!source) return notFoundResponse();
    if (source.status === 'deleted' || source.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before duplicating.',
        },
        { status: 400 }
      );
    }

    // Build the new plan payload
    const copiedName = `${source.name}${COPY_SUFFIX}`;

    const { data: created, error: insertError } = await supabase
      .from('battle_plans')
      .insert({
        battle_hq_id: hqId,
        created_by_user_id: userId,
        name: copiedName,
        war_type: source.war_type,
        scheduled_at: null,
        status: 'draft',
        comms_channel: source.comms_channel,
        orders: source.orders,
        brief: source.brief,
        intel: source.intel,
        map_image_url: source.map_image_url,
        map_annotations_json: source.map_annotations_json,
        parent_plan_id: source.id,
      })
      .select('id, parent_plan_id')
      .single();

    if (insertError || !created) {
      console.error('[plan duplicate] Insert error:', insertError);
      return internalErrorResponse();
    }

    // Copy checklist items from source → new plan. Best-effort; if this fails
    // the new plan just falls back to auto-seeded defaults on first access.
    try {
      const { data: sourceItems, error: itemsError } = await supabase
        .from('battle_plan_checklist_items')
        .select('item_key, label, is_default, enabled, sort_order')
        .eq('battle_plan_id', source.id)
        .order('sort_order', { ascending: true });

      if (itemsError) {
        console.warn(
          '[plan duplicate] Source items lookup failed (non-fatal):',
          itemsError
        );
      } else if (sourceItems && sourceItems.length > 0) {
        const newItems = sourceItems.map((item) => ({
          battle_plan_id: created.id,
          // Defaults keep their fixed keys; customs get fresh UUIDs
          item_key: DEFAULT_ITEM_KEYS.has(item.item_key)
            ? item.item_key
            : crypto.randomUUID(),
          label: item.label,
          is_default: item.is_default,
          enabled: item.enabled,
          sort_order: item.sort_order,
          created_by_user_id: userId,
        }));

        const { error: copyError } = await supabase
          .from('battle_plan_checklist_items')
          .insert(newItems);

        if (copyError) {
          console.warn(
            '[plan duplicate] Checklist items copy failed (non-fatal):',
            copyError
          );
        }
      }
    } catch (err) {
      console.warn(
        '[plan duplicate] Checklist items copy threw (non-fatal):',
        err
      );
    }

    return NextResponse.json(
      { id: created.id, parent_plan_id: created.parent_plan_id },
      { status: 201 }
    );
  } catch (err) {
    console.error('[plan duplicate] Route error:', err);
    return internalErrorResponse();
  }
}