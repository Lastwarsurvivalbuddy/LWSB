// src/app/api/admin/grant-founding/route.ts
// Mission Control — Grant Founding comp.
//
// POST /api/admin/grant-founding
// Body: { userId: string }
//
// Admin-only (myersboyd@gmail.com). Grants a user Founding tier by writing
// directly to subscriptions.tier and stamping comped_at. Stripe is not
// touched — comp records bypass the billing system entirely.
//
// If a subscriptions row doesn't exist for this user yet (rare but possible
// for brand-new accounts that haven't hit the Stripe webhook), we insert one.
//
// Response:
//   200 { success: true, subscription } → granted successfully
//   400 { error: 'userId required' }
//   401 { error: 'Unauthorized' } → no Bearer token
//   403 { error: 'Forbidden' } → token valid but not admin
//   500 { error: string } → DB error

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'myersboyd@gmail.com'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.slice(7)

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
  if (authError || !user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const nowIso = new Date().toISOString()

  // Check if subscriptions row exists for this user.
  const { data: existing, error: lookupError } = await supabase
    .from('subscriptions')
    .select('user_id, tier')
    .eq('user_id', userId)
    .maybeSingle()

  if (lookupError) {
    console.error('[grant-founding] Lookup error:', lookupError)
    return NextResponse.json({ error: 'Database lookup failed' }, { status: 500 })
  }

  let subscription
  if (existing) {
    // UPDATE existing row. Clear revoked_at in case this user was previously
    // comped-then-revoked and is now being re-granted.
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        tier: 'founding',
        comped_at: nowIso,
        revoked_at: null,
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error || !data) {
      console.error('[grant-founding] Update error:', error)
      return NextResponse.json({ error: 'Failed to grant comp' }, { status: 500 })
    }
    subscription = data
  } else {
    // INSERT new row. Covers brand-new users who don't have a subscriptions
    // row yet (Stripe webhook hasn't fired).
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        tier: 'founding',
        comped_at: nowIso,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('[grant-founding] Insert error:', error)
      return NextResponse.json({ error: 'Failed to grant comp' }, { status: 500 })
    }
    subscription = data
  }

  return NextResponse.json({ success: true, subscription })
}