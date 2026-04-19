import '@/lib/env'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BOYD_EMAIL = process.env.BOYD_EMAIL!

async function verifyBoyd(token: string): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: { user } } = await supabase.auth.getUser(token)
  return user?.email === BOYD_EMAIL
}

function getToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1]
  return null
}

// Referral code rules: alphanumeric + dash, 3-30 chars
const REFERRAL_CODE_REGEX = /^[A-Za-z0-9-]{3,30}$/

function validateReferralCode(raw: unknown): { code: string } | { error: string } {
  if (typeof raw !== 'string') return { error: 'referral_code must be a string' }
  const trimmed = raw.trim()
  if (!REFERRAL_CODE_REGEX.test(trimmed)) {
    return { error: 'referral_code must be 3–30 chars, letters / numbers / dashes only' }
  }
  return { code: trimmed }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isCodeTaken(supabase: any, code: string, excludeId?: string): Promise<boolean> {
  const query = supabase
    .from('affiliates')
    .select('id')
    .ilike('referral_code', code)
  const { data } = excludeId
    ? await query.neq('id', excludeId)
    : await query
  return (data ?? []).length > 0
}

// ── GET ──────────────────────────────────────────────────────────────────────
// ?mode=list         → all affiliates (existing behaviour)
// ?mode=payouts&id=X → payout history + unpaid balance for one affiliate
export async function GET(req: NextRequest) {
  const token = getToken(req)
  if (!token || !(await verifyBoyd(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode') ?? 'list'

  // ── Payout history for one affiliate ──
  if (mode === 'payouts') {
    const affiliateId = searchParams.get('id')
    if (!affiliateId) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    // Fetch affiliate + conversions
    const { data: aff, error: affErr } = await supabase
      .from('affiliates')
      .select('id, name, payout_rate')
      .eq('id', affiliateId)
      .single()

    if (affErr || !aff) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }

    // All conversions (each = one subscription created)
    const { data: conversions } = await supabase
      .from('affiliate_conversions')
      .select('id, subscription_tier, converted_at')
      .eq('affiliate_id', affiliateId)
      .order('converted_at', { ascending: false })

    // Revenue per tier (monthly recurring, not lifetime)
    const TIER_VALUE: Record<string, number> = {
      pro: 9.99,
      elite: 19.99,
      alliance: 19.99,
      founding: 99,
      free: 0,
    }

    const totalEarned = (conversions ?? []).reduce((sum, c) => {
      const tierVal = TIER_VALUE[c.subscription_tier?.toLowerCase() ?? ''] ?? 0
      return sum + tierVal * aff.payout_rate
    }, 0)

    // All past payouts
    const { data: payouts } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })

    const totalPaid = (payouts ?? []).reduce((sum, p) => sum + Number(p.amount_paid), 0)
    const unpaid = Math.max(0, totalEarned - totalPaid)

    const lastPayout = payouts && payouts.length > 0 ? payouts[0] : null

    return NextResponse.json({
      affiliateId,
      name: aff.name,
      payout_rate: aff.payout_rate,
      totalEarned: Math.round(totalEarned * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      unpaid: Math.round(unpaid * 100) / 100,
      lastPayout,
      payouts: payouts ?? [],
      conversions: conversions ?? [],
    })
  }

  // ── List all affiliates (default) ──
  const { data, error } = await supabase
    .from('affiliates')
    .select('*, affiliate_conversions(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ affiliates: data })
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
// action: 'approve' | 'reject'  → approve/reject (approve accepts optional referral_code override)
// action: 'update_code'         → change referral_code on an existing affiliate
// action: 'mark_paid'           → log a payout, reduce unpaid balance
export async function PATCH(req: NextRequest) {
  const token = getToken(req)
  if (!token || !(await verifyBoyd(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const body = await req.json()
  const { affiliate_id, action, payout_rate, notes } = body

  if (!affiliate_id || !action) {
    return NextResponse.json({ error: 'affiliate_id and action required' }, { status: 400 })
  }

  // ── Mark paid ──
  if (action === 'mark_paid') {
    const { amount_paid, note, period_end } = body

    if (!amount_paid || isNaN(parseFloat(amount_paid))) {
      return NextResponse.json({ error: 'amount_paid required (numeric)' }, { status: 400 })
    }
    if (!period_end) {
      return NextResponse.json({ error: 'period_end required (YYYY-MM-DD)' }, { status: 400 })
    }

    const { data: payout, error: payoutErr } = await supabase
      .from('affiliate_payouts')
      .insert({
        affiliate_id,
        amount_paid: parseFloat(amount_paid),
        note: note ?? null,
        period_end,
      })
      .select()
      .single()

    if (payoutErr) return NextResponse.json({ error: payoutErr.message }, { status: 500 })
    return NextResponse.json({ success: true, payout })
  }

  // ── Update referral code (post-approval edits) ──
  if (action === 'update_code') {
    const result = validateReferralCode(body.referral_code)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    if (await isCodeTaken(supabase, result.code, affiliate_id)) {
      return NextResponse.json({ error: 'referral_code already in use' }, { status: 409 })
    }
    const { data, error } = await supabase
      .from('affiliates')
      .update({ referral_code: result.code })
      .eq('id', affiliate_id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, affiliate: data })
  }

  // ── Approve / reject ──
  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'action must be approve, reject, update_code, or mark_paid' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    status: action === 'approve' ? 'approved' : 'rejected',
    notes: notes ?? null,
  }

  if (action === 'approve') {
    updates.approved_at = new Date().toISOString()
    if (payout_rate !== undefined) {
      const rate = parseFloat(payout_rate)
      if (isNaN(rate) || rate < 0 || rate > 1) {
        return NextResponse.json(
          { error: 'payout_rate must be 0–1 (e.g. 0.25 for 25%)' },
          { status: 400 }
        )
      }
      updates.payout_rate = rate
    }
    // Optional custom referral code override at approval time
    if (body.referral_code !== undefined && body.referral_code !== null && body.referral_code !== '') {
      const result = validateReferralCode(body.referral_code)
      if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      if (await isCodeTaken(supabase, result.code, affiliate_id)) {
        return NextResponse.json({ error: 'referral_code already in use' }, { status: 409 })
      }
      updates.referral_code = result.code
    }
  } else {
    updates.rejected_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('affiliates')
    .update(updates)
    .eq('id', affiliate_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, affiliate: data })
}