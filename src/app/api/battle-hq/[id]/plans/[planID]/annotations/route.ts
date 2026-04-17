// src/app/api/battle-hq/[id]/plans/[planId]/annotations/route.ts
// Battle HQ V1 — Save map annotation overlay JSON.
//
// PATCH /api/battle-hq/[id]/plans/[planId]/annotations
//
// Writes the full annotation overlay (react-konva shape array) to
// battle_plans.map_annotations_json. The canvas is not flattened — saved
// shapes remain re-editable on every load.
//
// Request body:
//   {
//     annotations: unknown  // JSON-serializable; typically an array of
//                           // shape objects { type, x, y, ... }
//   }
//
// Constraints:
//   - annotations must be JSON-serializable (the Next.js req.json() has
//     already validated this at parse time — anything that round-trips is OK).
//   - Payload hard-capped at 256 KB serialized (battle maps shouldn't need
//     more; prevents abuse). Counted as JSON.stringify length in chars.
//   - null is accepted → clears annotations (resets canvas).
//   - Arrays, objects, primitives all accepted — we do not prescribe shape
//     schema at the route level. The canvas component is the source of
//     truth for what's renderable. Unknown shapes render as no-ops.
//
// Permission: creator or editor.
//
// Blocks on:
//   - Plan soft-deleted → 400 'plan_deleted'
//
// Significant-edit notification trigger per spec §7 is a Phase 3 concern.
// This route does not write notifications.
//
// Responses:
//   200 { success: true, plan }
//   400 { error: 'missing_field' | 'payload_too_large' | 'plan_deleted' }
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
  invalidBodyResponse,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string; planId: string }>;
}

// Columns returned after a successful annotation save
const PLAN_ANNOTATION_COLUMNS =
  'id, battle_hq_id, name, map_image_url, map_annotations_json, updated_at';

// 256 KB cap on serialized annotation JSON
const MAX_ANNOTATION_BYTES = 256 * 1024;

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

    // The key 'annotations' must be present. null is explicit clear;
    // missing is an error.
    if (!('annotations' in body)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'annotations' },
        { status: 400 }
      );
    }

    const annotations = body.annotations;

    // Size guard — serialize once and measure. null → stored as null,
    // no size concern.
    if (annotations !== null) {
      let serialized: string;
      try {
        serialized = JSON.stringify(annotations);
      } catch {
        return NextResponse.json(
          {
            error: 'invalid_field',
            field: 'annotations',
            message: 'Annotations must be JSON-serializable.',
          },
          { status: 400 }
        );
      }
      if (serialized.length > MAX_ANNOTATION_BYTES) {
        return NextResponse.json(
          {
            error: 'payload_too_large',
            message: 'Annotation overlay exceeds the 256 KB limit.',
          },
          { status: 400 }
        );
      }
    }

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can save annotations.'
      );
    }

    // Existence + deletion check
    const { data: existing, error: existingError } = await supabase
      .from('battle_plans')
      .select('id, status, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (existingError) {
      console.error(
        '[plan annotations] Existence check error:',
        existingError
      );
      return internalErrorResponse();
    }
    if (!existing) return notFoundResponse();
    if (existing.status === 'deleted' || existing.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before editing annotations.',
        },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update({
        map_annotations_json: annotations,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select(PLAN_ANNOTATION_COLUMNS)
      .single();

    if (updateError || !updated) {
      console.error('[plan annotations] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan annotations] Route error:', err);
    return internalErrorResponse();
  }
}