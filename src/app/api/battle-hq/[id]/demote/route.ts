// src/app/api/battle-hq/[id]/demote/route.ts
// Battle HQ V1 — Demote an editor back to viewer.
//
// POST /api/battle-hq/[id]/demote
//
// Downgrades a member's role from 'editor' to 'viewer'. Creator-only —
// mirrors the promote route's auth rules (editors can't touch each other's
// roles; that's the creator's exclusive power).
//
// Request body:
//   { user_id: string }
//
// Rules:
//   - Target must be an ACTIVE member. A revoked or left editor retains
//     'editor' on their row (role is preserved through status transitions),
//     and we don't touch their role here — restore them first, then demote.
//   - Target must currently have role='editor' → else 400
//   - Cannot target the creator (must transfer ownership first — there's
//     no path that downgrades the creator role)
//   - Cannot target self (creators can't self-demote; viewers can't self-
//     anything)
//   - Demoting an existing viewer → 200 idempotent no-op
//
// Writes:
//   - battle_hq_memberships.role = 'viewer'
//   - status_changed_at intentionally NOT touched (role change, not status)
//
// Responses:
//   200 { success: true, membership }
//   400 { error: 'missing_field' | 'invalid_body'
//                | 'member_not_active' | 'cannot_target_creator'
//                | 'cannot_target_self' | 'not_an_editor' }
//   403 { error: 'not_authorized' }
//   404 { error: 'not_found' | 'member_not_found' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
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
          error: 'cannot_target_self',
          message: 'You cannot demote yourself.',
        },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    // Creator-only gate
    const callerMembership = await getMembership(supabase, hqId, callerId);
    if (!isCreator(callerMembership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander can demote Editors.'
      );
    }

    const { data: target, error: targetError } = await supabase
      .from('battle_hq_memberships')
      .select('id, user_id, role, status')
      .eq('battle_hq_id', hqId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (targetError) {
      console.error('[hq demote] Target lookup error:', targetError);
      return internalErrorResponse();
    }
    if (!target) {
      return NextResponse.json(
        { error: 'member_not_found' },
        { status: 404 }
      );
    }

    if (target.role === 'creator') {
      return NextResponse.json(
        {
          error: 'cannot_target_creator',
          message:
            'The Battle HQ Commander cannot be demoted. Transfer ownership first.',
        },
        { status: 400 }
      );
    }

    if (target.status !== 'active') {
      return NextResponse.json(
        {
          error: 'member_not_active',
          message: 'Restore this member before demoting them.',
        },
        { status: 400 }
      );
    }

    // Idempotency: already viewer → no-op
    if (target.role === 'viewer') {
      const { data: current, error: currentError } = await supabase
        .from('battle_hq_memberships')
        .select(
          'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
        )
        .eq('id', target.id)
        .single();
      if (currentError || !current) {
        console.error('[hq demote] Idempotent fetch error:', currentError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, membership: current });
    }

    // Must be editor at this point (creator + viewer both filtered above,
    // and the CHECK constraint limits the enum)
    if (target.role !== 'editor') {
      return NextResponse.json(
        {
          error: 'not_an_editor',
          message: 'Only Editors can be demoted to Viewer.',
        },
        { status: 400 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from('battle_hq_memberships')
      .update({ role: 'viewer' })
      .eq('id', target.id)
      .select(
        'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[hq demote] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, membership: updated });
  } catch (err) {
    console.error('[hq demote] Route error:', err);
    return internalErrorResponse();
  }
}