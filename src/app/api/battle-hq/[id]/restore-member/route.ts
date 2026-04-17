// src/app/api/battle-hq/[id]/restore-member/route.ts
// Battle HQ V1 — Restore a revoked member's access.
//
// POST /api/battle-hq/[id]/restore-member
//
// Flips a revoked member's status back to 'active'. Their previous role
// (viewer / editor) is preserved — we never downgraded it during revoke.
//
// Request body:
//   { user_id: string }
//
// Permission rules:
//   - creator may restore anyone (viewer or editor)
//   - editor may restore viewers only (cannot restore editors)
//     (mirrors revoke permissions: editors can't promote/demote each other
//      through the revoke/restore side door)
//   - creator can never be the target (creators are never in 'revoked' state
//     by construction; guard defensively anyway)
//
// Status transitions accepted:
//   - 'revoked' → 'active'  (the intended flow)
//   - 'left'    → 400 'member_not_revoked' (left members rejoin via invite URL,
//                                            not by admin restore — prevents
//                                            forcing someone back in)
//   - 'active'  → 200 idempotent no-op
//
// Writes:
//   - battle_hq_memberships.status = 'active'
//   - battle_hq_memberships.status_changed_at = now
//
// Responses:
//   200 { success: true, membership }
//   400 { error: 'missing_field' | 'member_not_revoked' | 'invalid_body' }
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

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const callerMembership = await getMembership(supabase, hqId, callerId);
    if (!isEditorOrCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can restore members.'
      );
    }

    const { data: target, error: targetError } = await supabase
      .from('battle_hq_memberships')
      .select('id, user_id, role, status')
      .eq('battle_hq_id', hqId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (targetError) {
      console.error('[hq restore-member] Target lookup error:', targetError);
      return internalErrorResponse();
    }
    if (!target) {
      return NextResponse.json(
        { error: 'member_not_found' },
        { status: 404 }
      );
    }

    // Editors can only restore viewers
    if (target.role === 'editor' && !isCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander can restore Editors.'
      );
    }

    // Idempotency: already active → no-op, return current
    if (target.status === 'active') {
      const { data: current, error: currentError } = await supabase
        .from('battle_hq_memberships')
        .select(
          'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
        )
        .eq('id', target.id)
        .single();
      if (currentError || !current) {
        console.error(
          '[hq restore-member] Idempotent fetch error:',
          currentError
        );
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, membership: current });
    }

    // Only revoked → active is allowed here. Left members must rejoin
    // themselves via the invite URL.
    if (target.status !== 'revoked') {
      return NextResponse.json(
        {
          error: 'member_not_revoked',
          message:
            'This member is not in a revoked state. They can rejoin via the invite link.',
        },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from('battle_hq_memberships')
      .update({
        status: 'active',
        status_changed_at: nowIso,
      })
      .eq('id', target.id)
      .select(
        'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[hq restore-member] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, membership: updated });
  } catch (err) {
    console.error('[hq restore-member] Route error:', err);
    return internalErrorResponse();
  }
}