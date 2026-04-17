// src/app/api/battle-hq/[id]/plans/[planId]/upload-map/route.ts
// Battle HQ V1 — Upload a battle map image to Supabase Storage.
//
// POST /api/battle-hq/[id]/plans/[planId]/upload-map
// Content-Type: multipart/form-data
// Form field: file
//
// Writes the image to the 'battle-hq-maps' private bucket under:
//   {hqId}/{planId}/{timestamp}-{random}.{ext}
//
// Then updates battle_plans.map_image_url with the Storage object PATH
// (not a public URL). Signed URLs are generated at read time from the
// client when rendering the image, since the bucket is private.
//
// If the plan already has a map, the previous Storage object is deleted
// (best-effort; failure to delete does not block the upload).
//
// Constraints:
//   - File size ≤ 10 MB
//   - MIME type: image/png, image/jpeg, image/webp
//   - File must be non-empty
//
// Permission: creator or editor.
// Blocks on: soft-deleted plan.
//
// Responses:
//   200 { success: true, plan: { id, map_image_url, updated_at } }
//   400 { error: 'missing_file' | 'file_too_large' | 'invalid_mime'
//                | 'plan_deleted' | 'empty_file' }
//   403 { error: 'not_authorized' }
//   404 { error: 'not_found' }
//   500 { error: 'storage_upload_failed' | 'Internal server error' }

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

const MAPS_BUCKET = 'battle-hq-maps';
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId, planId } = await context.params;
    if (!hqId || !planId) return notFoundResponse();

    const supabase = getServiceSupabase();

    // HQ + permission gate
    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can upload battle maps.'
      );
    }

    // Plan existence + deletion check
    const { data: plan, error: planError } = await supabase
      .from('battle_plans')
      .select('id, status, map_image_url, deleted_at')
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .maybeSingle();

    if (planError) {
      console.error('[plan upload-map] Plan lookup error:', planError);
      return internalErrorResponse();
    }
    if (!plan) return notFoundResponse();
    if (plan.status === 'deleted' || plan.deleted_at) {
      return NextResponse.json(
        {
          error: 'plan_deleted',
          message: 'Restore this plan from trash before uploading a map.',
        },
        { status: 400 }
      );
    }

    // Parse multipart body
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        {
          error: 'invalid_body',
          message: 'Request must be multipart/form-data with a "file" field.',
        },
        { status: 400 }
      );
    }

    const raw = formData.get('file');
    if (!raw || !(raw instanceof File)) {
      return NextResponse.json(
        { error: 'missing_file', message: 'Form field "file" is required.' },
        { status: 400 }
      );
    }
    const file = raw;

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'empty_file' },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: 'file_too_large',
          message: 'Battle map image must be 10 MB or smaller.',
        },
        { status: 400 }
      );
    }

    const mimeType = (file.type || '').toLowerCase();
    const ext = ALLOWED_MIME_TO_EXT[mimeType];
    if (!ext) {
      return NextResponse.json(
        {
          error: 'invalid_mime',
          message: 'Battle maps must be PNG, JPEG, or WebP images.',
        },
        { status: 400 }
      );
    }

    // Build Storage path — namespaced by HQ + plan so deletion is scoped
    // cleanly if/when an HQ is hard-deleted in the future.
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 10);
    const objectPath = `${hqId}/${planId}/${timestamp}-${random}.${ext}`;

    // Read file into a Buffer (Supabase Storage SDK accepts ArrayBuffer)
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(MAPS_BUCKET)
      .upload(objectPath, arrayBuffer, {
        contentType: mimeType,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('[plan upload-map] Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'storage_upload_failed' },
        { status: 500 }
      );
    }

    // Update plan row with the new Storage path
    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_plans')
      .update({
        map_image_url: objectPath,
        updated_at: nowIso,
      })
      .eq('id', planId)
      .eq('battle_hq_id', hqId)
      .select('id, map_image_url, updated_at')
      .single();

    if (updateError || !updated) {
      // Roll back the uploaded object so we don't orphan it.
      await supabase.storage
        .from(MAPS_BUCKET)
        .remove([objectPath])
        .catch((err) => {
          console.error(
            '[plan upload-map] Rollback cleanup failed:',
            err
          );
        });
      console.error('[plan upload-map] DB update error:', updateError);
      return internalErrorResponse();
    }

    // Best-effort: delete the previous map object. Failure does not block
    // the success response since the new map is already in place.
    if (plan.map_image_url && plan.map_image_url !== objectPath) {
      await supabase.storage
        .from(MAPS_BUCKET)
        .remove([plan.map_image_url])
        .catch((err) => {
          console.warn(
            '[plan upload-map] Previous object cleanup failed:',
            err
          );
        });
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    console.error('[plan upload-map] Route error:', err);
    return internalErrorResponse();
  }
}