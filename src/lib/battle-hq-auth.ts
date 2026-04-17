// src/lib/battle-hq-auth.ts
// Battle HQ V1 — shared auth + membership helpers.
//
// Centralizes the patterns Phase 1 routes repeated inline, so Phase 2 routes
// stay short and consistent:
//
//   - getServiceSupabase()      → service role client (existing codebase pattern)
//   - getAuthedUserId(req)       → resolves user from Authorization: Bearer <token>
//   - getMembership(hqId, user)  → returns membership row or null
//   - isEditorOrCreator(m)       → role gate for plan + member management
//   - assertHqExists(supabase, id, { allowDeleted? })
//                               → returns HQ row or a NextResponse 404
//
// All callers still use service role for writes — RLS is defense-in-depth,
// not the primary gate. Route-level permission checks are the real lock.

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Types ───────────────────────────────────────────────────────────────

export type BattleHqRole = 'creator' | 'editor' | 'viewer';
export type BattleHqMembershipStatus = 'active' | 'revoked' | 'left';

export interface BattleHqMembership {
  battle_hq_id: string;
  user_id: string;
  role: BattleHqRole;
  status: BattleHqMembershipStatus;
  joined_at: string;
  status_changed_at: string;
}

export interface BattleHqRow {
  id: string;
  creator_user_id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  comms_channel: string | null;
  standing_intel: string | null;
  standing_brief: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ─── Service role client ─────────────────────────────────────────────────

export function getServiceSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Auth: resolve user id from Bearer token ─────────────────────────────

/**
 * Returns the caller's user id from the Authorization header, or null if
 * missing / malformed / invalid. Callers are expected to short-circuit with
 * a 401 when null.
 */
export async function getAuthedUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabase = getServiceSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user.id;
}

// ─── Membership lookup ───────────────────────────────────────────────────

/**
 * Loads the caller's membership row for a given HQ. Returns null when no row
 * exists (never a member) OR on internal error — callers should treat both
 * the same way unless they explicitly care (see `getMembershipOrError`).
 */
export async function getMembership(
  supabase: SupabaseClient,
  battleHqId: string,
  userId: string
): Promise<BattleHqMembership | null> {
  const { data, error } = await supabase
    .from('battle_hq_memberships')
    .select('battle_hq_id, user_id, role, status, joined_at, status_changed_at')
    .eq('battle_hq_id', battleHqId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[battle-hq-auth] Membership lookup error:', error);
    return null;
  }
  return (data as BattleHqMembership) ?? null;
}

// ─── Role gates ──────────────────────────────────────────────────────────

export function isActive(m: BattleHqMembership | null): m is BattleHqMembership {
  return !!m && m.status === 'active';
}

export function isEditorOrCreator(m: BattleHqMembership | null): boolean {
  return isActive(m) && (m.role === 'creator' || m.role === 'editor');
}

export function isCreator(m: BattleHqMembership | null): boolean {
  return isActive(m) && m.role === 'creator';
}

// ─── HQ existence + soft-delete check ────────────────────────────────────

/**
 * Loads an HQ by id. Returns the row, or `null` if not found / soft-deleted
 * (with `allowDeleted` false). Logs internal errors and returns null.
 *
 * Phase 2 callers typically do:
 *   const hq = await loadHq(supabase, hqId);
 *   if (!hq) return NextResponse.json({ error: 'not_found' }, { status: 404 });
 */
export async function loadHq(
  supabase: SupabaseClient,
  hqId: string,
  opts: { allowDeleted?: boolean } = {}
): Promise<BattleHqRow | null> {
  const { data, error } = await supabase
    .from('battle_hqs')
    .select(
      'id, creator_user_id, slug, alliance_tag, server, comms_channel, standing_intel, standing_brief, created_at, updated_at, deleted_at'
    )
    .eq('id', hqId)
    .maybeSingle();

  if (error) {
    console.error('[battle-hq-auth] HQ lookup error:', error);
    return null;
  }
  if (!data) return null;
  if (data.deleted_at && !opts.allowDeleted) return null;
  return data as BattleHqRow;
}

// ─── Standard error responses ────────────────────────────────────────────
// Kept centralized so error shapes stay consistent across 18 routes.

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function notFoundResponse(): NextResponse {
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}

export function notAuthorizedResponse(message?: string): NextResponse {
  return NextResponse.json(
    {
      error: 'not_authorized',
      message:
        message ??
        'You do not have permission to perform this action on this Battle HQ.',
    },
    { status: 403 }
  );
}

export function internalErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function invalidBodyResponse(): NextResponse {
  return NextResponse.json(
    { error: 'invalid_body', message: 'Request body must be JSON.' },
    { status: 400 }
  );
}

// ─── Common text coercion helpers ────────────────────────────────────────
// Same semantics as the PATCH helpers in /api/battle-hq/[id]/route.ts —
// kept here so plan PATCH + other routes behave identically.

/**
 * Missing / null / non-string → undefined (no change).
 * Empty string → null (explicit clear).
 * Non-empty string → trimmed string.
 */
export function coerceNullableText(v: unknown): string | null | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * For required fields on PATCH — must be a non-empty string if present.
 * Missing → undefined. Present but empty or non-string → 'invalid'.
 */
export function coerceRequiredText(
  v: unknown
): string | undefined | 'invalid' {
  if (v === undefined) return undefined;
  if (typeof v !== 'string') return 'invalid';
  const trimmed = v.trim();
  return trimmed.length === 0 ? 'invalid' : trimmed;
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}