// src/app/api/battle-hq/[id]/leave/route.ts
// Battle HQ V1 — Member voluntarily leaves a Battle HQ.
//
// POST /api/battle-hq/[id]/leave
//
// Flips the caller's own membership status to 'left'. Unlike 'revoked',
// 'left' is reversible by the user — they can rejoin via the invite URL
// (spec §3.3 status lifecycle).
//
// No body required — the caller is always the subject.
//
// Rules:
//   - Active members (viewer / editor) → flip to 'left'
//   - CREATOR CANNOT LEAVE directly. Spec §3.3 permission matrix:
//       "Leave HQ — Creator: ✓ (after transfer)"
//     Creators must transfer ownership first. If a creator hits /leave,
//     return 400 'creator_must_transfer' pointing at /transfer.
//   - Already-left caller → 200 idempotent no-op
//   - Revoked caller → 400 'revoked' (you can't "leave" what you've been
//     kicked from — the access is already gone, and surfacing this as a
//     no-op would be misleading)
//   - Non-member caller → 404 'not_a_member'
//
// Writes:
//   - battle_hq_memberships.status = 'left'
//   - battle_hq_memberships.status_changed_at = now
//
// Responses:
//   200 { success: true, membership }
//   400 { error: 'creator_must_transfer' | 'revoked' }
//   404 { error: 'not_found' | 'not_a_member' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  loadHq,
  unauthorizedResponse,
  notFoundResponse,
  internalErrorResponse,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId } = await context.params;
    if (!hqId) return notFoundResponse();

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!membership) {
      return NextResponse.json(
        { error: 'not_a_member' },
        { status: 404 }
      );
    }

    // Creator cannot leave directly — ownership must transfer first.
    if (membership.role === 'creator') {
      return NextResponse.json(
        {
          error: 'creator_must_transfer',
          message:
            'Transfer ownership to another Founding member before leaving this Battle HQ.',
        },
        { status: 400 }
      );
    }

    // Revoked caller — surface as error, not silent success.
    if (membership.status === 'revoked') {
      return NextResponse.json(
        {
          error: 'revoked',
          message: 'Your access to this Battle HQ has been revoked.',
        },
        { status: 400 }
      );
    }

    // Idempotency: already left → return current state
    if (membership.status === 'left') {
      const { data: current, error: currentError } = await supabase
        .from('battle_hq_memberships')
        .select(
          'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
        )
        .eq('battle_hq_id', hqId)
        .eq('user_id', userId)
        .single();

      if (currentError || !current) {
        console.error('[hq leave] Idempotent fetch error:', currentError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, membership: current });
    }

    // Active → left
    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_hq_memberships')
      .update({
        status: 'left',
        status_changed_at: nowIso,
      })
      .eq('battle_hq_id', hqId)
      .eq('user_id', userId)
      .select(
        'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[hq leave] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, membership: updated });
  } catch (err) {
    console.error('[hq leave] Route error:', err);
    return internalErrorResponse();
  }
}