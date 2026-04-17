// src/app/api/battle-hq/[id]/revoke/route.ts
// Battle HQ V1 — Revoke a member's access to a Battle HQ.
//
// POST /api/battle-hq/[id]/revoke
//
// Flips a member's status to 'revoked'. The user loses access immediately
// and sees the revoked page when they visit /cc/[slug] (Case D, privacy:
// no alliance info leaked).
//
// Request body:
//   { user_id: string }
//
// Permission rules:
//   - creator may revoke any editor or viewer
//   - editor may revoke viewers only (cannot touch other editors or the creator)
//   - NOBODY may revoke the creator (transfer ownership first)
//   - Revoking self → 400 'cannot_revoke_self' (use /leave instead)
//   - Revoking an already-revoked member → 200 idempotent no-op
//   - Revoking a member whose status is 'left' → 200 flipped to revoked
//     (prevents a voluntarily-left member from rejoining via invite URL)
//
// Writes:
//   - battle_hq_memberships.status = 'revoked'
//   - battle_hq_memberships.status_changed_at = now
//
// Notifications for the revoked user are a Phase 3 concern (per spec §7,
// the notifications infrastructure still needs an integration pass).
//
// Responses:
//   200 { success: true, membership }
//   400 { error: 'missing_field' | 'cannot_revoke_creator'
//                | 'cannot_revoke_self' | 'invalid_body' }
//   403 { error: 'not_authorized' }
//   404 { error: 'not_found' | 'member_not_found' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  isEditorOrCreator,
  isCreator,
  loadHq,
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
          error: 'cannot_revoke_self',
          message: 'Use the Leave option to step away from a Battle HQ.',
        },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    // Caller must be active creator or editor
    const callerMembership = await getMembership(supabase, hqId, callerId);
    if (!isEditorOrCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can revoke members.'
      );
    }

    // Load target membership
    const { data: target, error: targetError } = await supabase
      .from('battle_hq_memberships')
      .select('id, user_id, role, status')
      .eq('battle_hq_id', hqId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (targetError) {
      console.error('[hq revoke] Target lookup error:', targetError);
      return internalErrorResponse();
    }
    if (!target) {
      return NextResponse.json(
        { error: 'member_not_found' },
        { status: 404 }
      );
    }

    // Creator is untouchable — ownership must transfer first
    if (target.role === 'creator') {
      return NextResponse.json(
        {
          error: 'cannot_revoke_creator',
          message:
            'The Battle HQ Commander cannot be revoked. Transfer ownership first.',
        },
        { status: 400 }
      );
    }

    // Editors can only revoke viewers. Creator can revoke editors + viewers.
    if (target.role === 'editor' && !isCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander can revoke Editors.'
      );
    }

    // Idempotency: already revoked → return current state
    if (target.status === 'revoked') {
      const { data: current, error: currentError } = await supabase
        .from('battle_hq_memberships')
        .select(
          'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
        )
        .eq('id', target.id)
        .single();
      if (currentError || !current) {
        console.error('[hq revoke] Idempotent fetch error:', currentError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, membership: current });
    }

    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_hq_memberships')
      .update({
        status: 'revoked',
        status_changed_at: nowIso,
      })
      .eq('id', target.id)
      .select(
        'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[hq revoke] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, membership: updated });
  } catch (err) {
    console.error('[hq revoke] Route error:', err);
    return internalErrorResponse();
  }
}