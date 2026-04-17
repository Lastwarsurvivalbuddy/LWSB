// src/app/api/battle-hq/[id]/plans/route.ts
// Battle HQ V1 — Battle Plans collection for a given HQ.
//
// POST /api/battle-hq/[id]/plans   — create new Battle Plan (creator/editor)
// GET  /api/battle-hq/[id]/plans   — list plans (member-gated, filtered by status)
//
// Query params on GET:
//   ?status=draft|published|active|archived|deleted  (optional; comma-separated allowed)
//   Default visibility:
//     - viewers       → published, active, archived
//     - creator/editor → all except 'deleted'
//     - creator only   → 'deleted' may be requested for trash view
//
// POST body (all optional except name + war_type):
//   {
//     name: string,                // required, non-empty
//     war_type: 'desert_storm' | 'warzone_duel' | 'canyon_storm'
//             | 'svs' | 'alliance_mobilization' | 'other',   // required
//     scheduled_at?: string,       // ISO timestamp, nullable in draft
//     comms_channel?: string,      // nullable; falls back to HQ default in UI
//     orders?: string,
//     brief?: string,
//     intel?: string
//   }
//
// New plans are always created with status='draft'. Publish is a separate
// state transition handled by /publish route.
//
// Responses:
//   POST 201 { id } → created
//   POST 400 { error: 'missing_field', field } / { error: 'invalid_war_type' }
//   POST 403 { error: 'not_authorized' } → not creator/editor
//   POST 404 { error: 'not_found' } → HQ missing or soft-deleted
//   GET  200 { plans: Plan[] }
//   GET  403 { error: 'not_a_member' }
//   GET  404 { error: 'not_found' }

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthedUserId,
  getServiceSupabase,
  getMembership,
  isEditorOrCreator,
  isActive,
  loadHq,
  unauthorizedResponse,
  notFoundResponse,
  notAuthorizedResponse,
  internalErrorResponse,
  invalidBodyResponse,
  coerceNullableText,
  isNonEmptyString,
} from '@/lib/battle-hq-auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_WAR_TYPES = new Set<string>([
  'desert_storm',
  'warzone_duel',
  'canyon_storm',
  'svs',
  'alliance_mobilization',
  'other',
]);

const VALID_STATUSES = new Set<string>([
  'draft',
  'published',
  'active',
  'archived',
  'deleted',
]);

// Columns returned in list + create responses. Kept narrow — editor UI
// fetches full plan detail via the single-plan GET route.
const PLAN_LIST_COLUMNS =
  'id, battle_hq_id, created_by_user_id, name, war_type, scheduled_at, status, comms_channel, map_image_url, parent_plan_id, created_at, updated_at, published_at, archived_at';

// ─────────────────────────────────────────────────────────────────────────
// POST — create new Battle Plan
// ─────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId } = await context.params;
    if (!hqId) return notFoundResponse();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return invalidBodyResponse();
    }

    if (!isNonEmptyString(body.name)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'name' },
        { status: 400 }
      );
    }
    if (!isNonEmptyString(body.war_type)) {
      return NextResponse.json(
        { error: 'missing_field', field: 'war_type' },
        { status: 400 }
      );
    }
    if (!VALID_WAR_TYPES.has(body.war_type)) {
      return NextResponse.json(
        { error: 'invalid_war_type' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // HQ existence + soft-delete gate
    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    // Permission: creator or editor
    const membership = await getMembership(supabase, hqId, userId);
    if (!isEditorOrCreator(membership)) {
      return notAuthorizedResponse(
        'Only the Battle HQ Commander or Editors can create Battle Plans.'
      );
    }

    // scheduled_at — optional on draft. If present, must parse.
    let scheduledAt: string | null = null;
    if (body.scheduled_at !== undefined && body.scheduled_at !== null) {
      if (typeof body.scheduled_at !== 'string') {
        return NextResponse.json(
          { error: 'invalid_field', field: 'scheduled_at' },
          { status: 400 }
        );
      }
      const trimmed = body.scheduled_at.trim();
      if (trimmed.length > 0) {
        const parsed = new Date(trimmed);
        if (Number.isNaN(parsed.getTime())) {
          return NextResponse.json(
            { error: 'invalid_field', field: 'scheduled_at' },
            { status: 400 }
          );
        }
        scheduledAt = parsed.toISOString();
      }
    }

    const commsChannel = coerceNullableText(body.comms_channel) ?? null;
    const orders = coerceNullableText(body.orders) ?? null;
    const brief = coerceNullableText(body.brief) ?? null;
    const intel = coerceNullableText(body.intel) ?? null;

    const { data: plan, error: insertError } = await supabase
      .from('battle_plans')
      .insert({
        battle_hq_id: hqId,
        created_by_user_id: userId,
        name: body.name.trim(),
        war_type: body.war_type,
        scheduled_at: scheduledAt,
        status: 'draft',
        comms_channel: commsChannel,
        orders,
        brief,
        intel,
      })
      .select('id')
      .single();

    if (insertError || !plan) {
      console.error('[battle-hq/plans POST] Insert error:', insertError);
      return internalErrorResponse();
    }

    return NextResponse.json({ id: plan.id }, { status: 201 });
  } catch (err) {
    console.error('[battle-hq/plans POST] Route error:', err);
    return internalErrorResponse();
  }
}

// ─────────────────────────────────────────────────────────────────────────
// GET — list plans for this HQ, scoped by caller's role
// ─────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthedUserId(req);
    if (!userId) return unauthorizedResponse();

    const { id: hqId } = await context.params;
    if (!hqId) return notFoundResponse();

    const supabase = getServiceSupabase();

    const hq = await loadHq(supabase, hqId);
    if (!hq) return notFoundResponse();

    const membership = await getMembership(supabase, hqId, userId);
    if (!isActive(membership)) {
      return NextResponse.json(
        { error: 'not_a_member' },
        { status: 403 }
      );
    }

    // Parse ?status= filter. Default depends on role.
    const url = new URL(req.url);
    const statusParam = url.searchParams.get('status');
    let requestedStatuses: string[] | null = null;
    if (statusParam) {
      const parts = statusParam
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const p of parts) {
        if (!VALID_STATUSES.has(p)) {
          return NextResponse.json(
            { error: 'invalid_status_filter', value: p },
            { status: 400 }
          );
        }
      }
      requestedStatuses = parts;
    }

    const isPrivileged =
      membership.role === 'creator' || membership.role === 'editor';
    const isCreatorCaller = membership.role === 'creator';

    // Determine effective status set
    let effectiveStatuses: string[];
    if (requestedStatuses) {
      // Viewers can never see drafts; only creator can see deleted.
      effectiveStatuses = requestedStatuses.filter((s) => {
        if (s === 'draft' && !isPrivileged) return false;
        if (s === 'deleted' && !isCreatorCaller) return false;
        return true;
      });
      // If filtering removed everything, respond with empty list rather
      // than erroring — matches the "no matches" UX.
      if (effectiveStatuses.length === 0) {
        return NextResponse.json({ plans: [] });
      }
    } else {
      effectiveStatuses = isPrivileged
        ? ['draft', 'published', 'active', 'archived']
        : ['published', 'active', 'archived'];
    }

    const { data: plans, error: plansError } = await supabase
      .from('battle_plans')
      .select(PLAN_LIST_COLUMNS)
      .eq('battle_hq_id', hqId)
      .in('status', effectiveStatuses)
      .order('scheduled_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (plansError) {
      console.error('[battle-hq/plans GET] Query error:', plansError);
      return internalErrorResponse();
    }

    return NextResponse.json({ plans: plans ?? [] });
  } catch (err) {
    console.error('[battle-hq/plans GET] Route error:', err);
    return internalErrorResponse();
  }
}