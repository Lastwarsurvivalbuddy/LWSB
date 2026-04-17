// src/app/api/battle-hq/[id]/restore/route.ts
// Battle HQ V1 — Restore a soft-deleted Battle HQ.
//
// POST /api/battle-hq/[id]/restore
//
// Reverses the soft-delete from DELETE /api/battle-hq/[id] within a 30-day
// trash window. Clears deleted_at and bumps updated_at.
//
// Creator-only. An editor who wanted to preserve an HQ shouldn't be able to
// reverse the creator's delete decision — that's a trust boundary.
//
// Slug reclaim note:
// The slug-check route filters `.is('deleted_at', null)`, so a soft-deleted
// HQ's slug is available for someone else to claim during the trash window.
// If that happens, restore becomes impossible — the unique constraint on
// battle_hqs.slug will reject the "update" because the slug already exists
// on another active row.
//
// Rather than race the active holder by attempting the update and catching
// 23505, we pre-check for slug conflict and return a specific error shape
// so the UI can explain it clearly.
//
// Blocked states:
//   - Plan not soft-deleted → 400 'not_deleted'
//   - deleted_at older than 30 days → 400 'trash_window_expired'
//   - Slug taken by another active HQ → 409 'slug_reclaimed'
//
// Responses:
//   200 { success: true, hq }
//   400 { error: 'not_deleted' | 'trash_window_expired' }
//   403 { error: 'creator_only' }
//   404 { error: 'not_found' }
//   409 { error: 'slug_reclaimed', message }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  unauthorizedResponse,
  notFoundResponse,
  internalErrorResponse,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const TRASH_WINDOW_DAYS = 30;

const HQ_FULL_COLUMNS =
  'id, creator_user_id, slug, alliance_tag, server, comms_channel, standing_intel, standing_brief, created_at, updated_at, deleted_at';

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId } = await context.params;
    if (!hqId) return notFoundResponse();

    const supabase = getServiceSupabase();

    // Load HQ with deleted rows allowed — restore needs to see them
    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select(HQ_FULL_COLUMNS)
      .eq('id', hqId)
      .maybeSingle();

    if (hqError) {
      console.error('[hq restore] HQ lookup error:', hqError);
      return internalErrorResponse();
    }
    if (!hq) return notFoundResponse();

    // Creator-only gate (soft-deleted rows are invisible to /api/battle-hq/[id]
    // GET for non-creators, so a non-creator reaching this endpoint should
    // either be the creator or get a clear 403 here).
    if (hq.creator_user_id !== userId) {
      return NextResponse.json(
        {
          error: 'creator_only',
          message: 'Only the Battle HQ Commander can restore this HQ.',
        },
        { status: 403 }
      );
    }

    // Must actually be soft-deleted
    if (!hq.deleted_at) {
      return NextResponse.json(
        {
          error: 'not_deleted',
          message: 'This Battle HQ is not in the trash.',
        },
        { status: 400 }
      );
    }

    // 30-day trash window check
    const deletedAt = new Date(hq.deleted_at);
    const windowCutoff = new Date();
    windowCutoff.setUTCDate(windowCutoff.getUTCDate() - TRASH_WINDOW_DAYS);
    if (deletedAt.getTime() < windowCutoff.getTime()) {
      return NextResponse.json(
        {
          error: 'trash_window_expired',
          message:
            'This Battle HQ was deleted more than 30 days ago and can no longer be restored.',
        },
        { status: 400 }
      );
    }

    // Slug reclaim check — is there another ACTIVE HQ holding this slug?
    const { data: conflict, error: conflictError } = await supabase
      .from('battle_hqs')
      .select('id')
      .ilike('slug', hq.slug)
      .is('deleted_at', null)
      .neq('id', hq.id)
      .maybeSingle();

    if (conflictError) {
      console.error('[hq restore] Slug conflict check error:', conflictError);
      return internalErrorResponse();
    }
    if (conflict) {
      return NextResponse.json(
        {
          error: 'slug_reclaimed',
          message:
            'The slug for this Battle HQ has been claimed by another Commander. Contact the Administrator if you need it back.',
        },
        { status: 409 }
      );
    }

    // Perform the restore
    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_hqs')
      .update({
        deleted_at: null,
        updated_at: nowIso,
      })
      .eq('id', hqId)
      .select(HQ_FULL_COLUMNS)
      .single();

    if (updateError || !updated) {
      // Handle the race case where the slug got reclaimed between our check
      // and the update (unique constraint fires here).
      const anyErr = updateError as { code?: string } | null;
      if (anyErr?.code === '23505') {
        return NextResponse.json(
          {
            error: 'slug_reclaimed',
            message:
              'The slug for this Battle HQ has been claimed by another Commander. Contact the Administrator if you need it back.',
          },
          { status: 409 }
        );
      }
      console.error('[hq restore] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, hq: updated });
  } catch (err) {
    console.error('[hq restore] Route error:', err);
    return internalErrorResponse();
  }
}