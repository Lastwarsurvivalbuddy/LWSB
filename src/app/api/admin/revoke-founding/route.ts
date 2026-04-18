// src/app/api/admin/revoke-founding/route.ts
// Mission Control — Revoke Founding comp.
//
// POST /api/admin/revoke-founding
// Body: { userId: string }
//
// Admin-only (myersboyd@gmail.com). Revokes a user's Founding comp by
// setting tier='free' and stamping revoked_at. comped_at is preserved
// for audit trail — so the history is always retrievable.
//
// Safety check: this route refuses to revoke tier on users where comped_at
// IS NULL. That means it won't accidentally revoke a PAID Founding subscriber.
// If the UI makes this impossible already, the check is defense-in-depth.
//
// Response:
//   200 { success: true, subscription } → revoked successfully
//   400 { error: 'userId required' | 'not_comped' }
//   401 { error: 'Unauthorized' }
//   403 { error: 'Forbidden' }
//   404 { error: 'subscription_not_found' }
//   500 { error: string }

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

  // Safety: confirm this user was actually comped before revoking.
  // Protects against accidentally yanking a paid Founding subscriber.
  const { data: existing, error: lookupError } = await supabase
    .from('subscriptions')
    .select('user_id, tier, comped_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (lookupError) {
    console.error('[revoke-founding] Lookup error:', lookupError)
    return NextResponse.json({ error: 'Database lookup failed' }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: 'subscription_not_found' }, { status: 404 })
  }
  if (!existing.comped_at) {
    return NextResponse.json(
      {
        error: 'not_comped',
        message: 'This subscription was not granted as a comp. Revoke is only valid for comped subscriptions.',
      },
      { status: 400 }
    )
  }

  const nowIso = new Date().toISOString()

  const { data: updated, error: updateError } = await supabase
    .from('subscriptions')
    .update({
      tier: 'free',
      revoked_at: nowIso,
      // comped_at preserved intentionally — audit trail
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError || !updated) {
    console.error('[revoke-founding] Update error:', updateError)
    return NextResponse.json({ error: 'Failed to revoke comp' }, { status: 500 })
  }

  return NextResponse.json({ success: true, subscription: updated })
}