// src/app/api/battle-hq/[id]/promote/route.ts
// Battle HQ V1 — Promote a viewer to editor.
//
// POST /api/battle-hq/[id]/promote
//
// Upgrades a member's role from 'viewer' to 'editor'. Creator-only —
// editors cannot promote other editors (that would let editors spread
// editor access unchecked, undermining the creator's role).
//
// Request body:
//   { user_id: string }
//
// Rules:
//   - Target must be an ACTIVE member (cannot promote a revoked / left user;
//     restore them first)
//   - Target must currently have role='viewer' → else 400
//   - Promoting an existing editor → 200 idempotent no-op
//   - Cannot target the creator (creators are the top role already)
//   - Cannot target self (creators are already above editor; viewers can't
//     self-promote)
//
// Writes:
//   - battle_hq_memberships.role = 'editor'
//   - status_changed_at intentionally NOT touched — this is a role change,
//     not a status change. The "status_changed_at" field is for tracking
//     the active/revoked/left transition timestamps.
//
// Responses:
//   200 { success: true, membership }
//   400 { error: 'missing_field' | 'invalid_body'
//                | 'member_not_active' | 'already_editor_or_above'
//                | 'cannot_target_creator' | 'cannot_target_self' }
//   403 { error: 'not_authorized' }   // caller is not creator
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
          message: 'You cannot promote yourself.',
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
        'Only the Battle HQ Commander can promote members to Editor.'
      );
    }

    const { data: target, error: targetError } = await supabase
      .from('battle_hq_memberships')
      .select('id, user_id, role, status')
      .eq('battle_hq_id', hqId)
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (targetError) {
      console.error('[hq promote] Target lookup error:', targetError);
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
          message: 'The Battle HQ Commander is already the top role.',
        },
        { status: 400 }
      );
    }

    if (target.status !== 'active') {
      return NextResponse.json(
        {
          error: 'member_not_active',
          message:
            'Restore this member before promoting them.',
        },
        { status: 400 }
      );
    }

    // Idempotency: already editor → no-op
    if (target.role === 'editor') {
      const { data: current, error: currentError } = await supabase
        .from('battle_hq_memberships')
        .select(
          'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
        )
        .eq('id', target.id)
        .single();
      if (currentError || !current) {
        console.error('[hq promote] Idempotent fetch error:', currentError);
        return internalErrorResponse();
      }
      return NextResponse.json({ success: true, membership: current });
    }

    // At this point role must be 'viewer' — the CHECK constraint enforces
    // the full enum, and we've already filtered out creator + non-active.
    const { data: updated, error: updateError } = await supabase
      .from('battle_hq_memberships')
      .update({ role: 'editor' })
      .eq('id', target.id)
      .select(
        'id, battle_hq_id, user_id, role, status, joined_at, status_changed_at'
      )
      .single();

    if (updateError || !updated) {
      console.error('[hq promote] Update error:', updateError);
      return internalErrorResponse();
    }

    return NextResponse.json({ success: true, membership: updated });
  } catch (err) {
    console.error('[hq promote] Route error:', err);
    return internalErrorResponse();
  }
}