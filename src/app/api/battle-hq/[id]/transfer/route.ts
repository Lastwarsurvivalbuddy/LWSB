// src/app/api/battle-hq/[id]/transfer/route.ts
// Battle HQ V1 — Transfer Battle HQ ownership to another member.
//
// POST /api/battle-hq/[id]/transfer
//
// Hands the creator role to another active member. Target MUST currently
// have Founding tier — creators are always Founding (spec §2, §3.3). This
// is a strict invariant: violating it would let a non-Founding user hold
// the creator role, bypassing the Founding-only creation gate.
//
// Request body:
//   { user_id: string }   // target user (must be an active member)
//
// Effects (all-or-nothing: rolled back on any intermediate failure):
//   - battle_hqs.creator_user_id → target user
//   - battle_hqs.updated_at      → now
//   - target membership.role     → 'creator'  (was editor or viewer)
//   - caller membership.role     → 'editor'   (self-demote so creator can
//                                                keep editing until they
//                                                choose to leave)
//
// After transfer, the previous creator is left as an editor — not removed.
// Spec §3.3: "Leave HQ — Creator: ✓ (after transfer)". They must call
// /api/battle-hq/[id]/leave separately if they want to step away.
//
// Rules:
//   - Creator only (source role = creator)
//   - Target must be ACTIVE member of this HQ
//   - Target cannot be self
//   - Target must have subscriptions.tier = 'founding'
//   - HQ must not be soft-deleted
//
// Rollback strategy:
//   - Three writes: HQ.creator_user_id, target.role, caller.role
//   - If any fails, restore the original values from the snapshot we captured
//     before the first write. Best-effort — log noisily on rollback failure
//     so the Administrator can clean up manually if needed.
//
// Spec copy (§10):
//   Transfer picker header:
//     "Battle HQ ownership requires Founding access. Below are members of
//      this Battle HQ who qualify."
//   Empty state:
//     "No members of this Battle HQ currently have Founding access.
//      To transfer ownership, invite a Founding member or encourage an
//      Editor to upgrade."
//
// Notification to new owner (spec §7):
//   "You are now the Battle HQ Commander of [Alliance Tag]"
//   Phase 3 will wire this — this route does not insert notifications yet.
//
// Responses:
//   200 { success: true, hq, new_creator_membership, previous_creator_membership }
//   400 { error: 'missing_field' | 'invalid_body' | 'cannot_target_self'
//                | 'target_not_active' | 'target_not_founding'
//                | 'hq_deleted' }
//   403 { error: 'creator_only' }
//   404 { error: 'not_found' | 'member_not_found' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  isCreator,
  unauthorizedResponse,
  notFoundResponse,
  notAuthorizedResponse,
  internalErrorResponse,
  invalidBodyResponse,
  isNonEmptyString,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const HQ_FULL_COLUMNS =
  'id, creator_user_id, slug, alliance_tag, server, comms_channel, standing_intel, standing_brief, created_at, updated_at, deleted_at';
const MEMBERSHIP_FULL_COLUMNS =
  'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at';

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const callerId = await getAuthedUserId(req);
    if (!callerId) return unauthorizedResponse();

    const { id: hqId } = await context.params;
    if (!hqId) return notFoundResponse();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return invalidBodyResponse();
    }

    if (!isNonEmptyString(body.user_id)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'user_id' },
        { status: 400 }
      );
    }
    const targetUserId = body.user_id.trim();

    if (targetUserId === callerId) {
      return NextResponse.json(
        {
          error: 'cannot_target_self',
          message: 'You are already the Battle HQ Commander.',
        },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Load HQ directly — transfer must NOT run on a soft-deleted HQ
    const { data: hq, error: hqError } = await supabase
      .from('battle_hqs')
      .select(HQ_FULL_COLUMNS)
      .eq('id', hqId)
      .maybeSingle();

    if (hqError) {
      console.error('[hq transfer] HQ lookup error:', hqError);
      return internalErrorResponse();
    }
    if (!hq) return notFoundResponse();
    if (hq.deleted_at) {
      return NextResponse.json(
        {
          error: 'hq_deleted',
          message: 'Restore this Battle HQ before transferring ownership.',
        },
        { status: 400 }
      );
    }

    // Caller must be the current creator
    const callerMembership = await getMembership(supabase, hqId, callerId);
    if (!isCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander can transfer ownership.'
      );
    }

    // Load target membership
    const { data: targetMembership, error: targetError } = await supabase
      .from('battle_hq_memberships')
      .select(MEMBERSHIP_FULL_COLUMNS)
      .eq('battle_hq_id', hqId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (targetError) {
      console.error('[hq transfer] Target lookup error:', targetError);
      return internalErrorResponse();
    }
    if (!targetMembership) {
      return NextResponse.json(
        { error: 'member_not_found' },
        { status: 404 }
      );
    }
    if (targetMembership.status !== 'active') {
      return NextResponse.json(
        {
          error: 'target_not_active',
          message:
            'Restore this member before transferring ownership to them.',
        },
        { status: 400 }
      );
    }

    // Target must be Founding tier
    const { data: targetSub, error: subError } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (subError) {
      console.error('[hq transfer] Subscription lookup error:', subError);
      return internalErrorResponse();
    }
    if (!targetSub || targetSub.tier !== 'founding') {
      return NextResponse.json(
        {
          error: 'target_not_founding',
          message:
            'Battle HQ ownership requires Founding access. This member does not currently have Founding.',
        },
        { status: 400 }
      );
    }

    // Snapshot original values for rollback
    const originalHqCreator = hq.creator_user_id;
    const originalTargetRole = targetMembership.role;
    const originalCallerRole = callerMembership!.role; // 'creator' — confirmed by isCreator
    const callerMembershipId = callerMembership!.user_id; // for clarity below

    // ─── Three-step write with manual rollback ─────────────────────────
    const nowIso = new Date().toISOString();

    // Step 1: update HQ.creator_user_id
    const { error: hqUpdateError } = await supabase
      .from('battle_hqs')
      .update({
        creator_user_id: targetUserId,
        updated_at: nowIso,
      })
      .eq('id', hqId);

    if (hqUpdateError) {
      console.error('[hq transfer] Step 1 (HQ) error:', hqUpdateError);
      return internalErrorResponse();
    }

    // Step 2: promote target to creator
    const { error: targetUpdateError } = await supabase
      .from('battle_hq_memberships')
      .update({ role: 'creator' })
      .eq('id', targetMembership.id);

    if (targetUpdateError) {
      console.error(
        '[hq transfer] Step 2 (target role) error:',
        targetUpdateError
      );
      // Rollback step 1
      await supabase
        .from('battle_hqs')
        .update({ creator_user_id: originalHqCreator })
        .eq('id', hqId)
        .then(
          () => {},
          (err) => console.error('[hq transfer] Step 1 rollback failed:', err)
        );
      return internalErrorResponse();
    }

    // Step 3: demote caller to editor
    const { error: callerUpdateError } = await supabase
      .from('battle_hq_memberships')
      .update({ role: 'editor' })
      .eq('battle_hq_id', hqId)
      .eq('user_id', callerId);

    if (callerUpdateError) {
      console.error(
        '[hq transfer] Step 3 (caller role) error:',
        callerUpdateError
      );
      // Rollback step 2
      await supabase
        .from('battle_hq_memberships')
        .update({ role: originalTargetRole })
        .eq('id', targetMembership.id)
        .then(
          () => {},
          (err) => console.error('[hq transfer] Step 2 rollback failed:', err)
        );
      // Rollback step 1
      await supabase
        .from('battle_hqs')
        .update({ creator_user_id: originalHqCreator })
        .eq('id', hqId)
        .then(
          () => {},
          (err) => console.error('[hq transfer] Step 1 rollback failed:', err)
        );
      return internalErrorResponse();
    }

    // ─── Success — fetch updated rows for the response ─────────────────
    const { data: finalHq, error: finalHqError } = await supabase
      .from('battle_hqs')
      .select(HQ_FULL_COLUMNS)
      .eq('id', hqId)
      .single();

    const { data: finalTarget, error: finalTargetError } = await supabase
      .from('battle_hq_memberships')
      .select(MEMBERSHIP_FULL_COLUMNS)
      .eq('id', targetMembership.id)
      .single();

    const { data: finalCaller, error: finalCallerError } = await supabase
      .from('battle_hq_memberships')
      .select(MEMBERSHIP_FULL_COLUMNS)
      .eq('battle_hq_id', hqId)
      .eq('user_id', callerId)
      .single();

    if (
      finalHqError ||
      finalTargetError ||
      finalCallerError ||
      !finalHq ||
      !finalTarget ||
      !finalCaller
    ) {
      // All three writes succeeded; the fetch is just for the response.
      // Log but don't claim failure — return 200 with whatever we have.
      console.warn('[hq transfer] Post-transfer readback partial failure', {
        finalHqError,
        finalTargetError,
        finalCallerError,
      });
    }

    return NextResponse.json({
      success: true,
      hq: finalHq,
      new_creator_membership: finalTarget,
      previous_creator_membership: finalCaller,
      _audit: {
        transferred_from: callerMembershipId,
        transferred_to: targetUserId,
        previous_target_role: originalTargetRole,
        previous_caller_role: originalCallerRole,
      },
    });
  } catch (err) {
    console.error('[hq transfer] Route error:', err);
    return internalErrorResponse();
  }
}