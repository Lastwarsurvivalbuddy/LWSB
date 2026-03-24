import '@/lib/env'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const VALID_METHODS = ['paypal', 'wise', 'venmo', 'cashapp', 'other']

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { payout_method, payout_account, payout_country } = body

  if (!payout_method || !VALID_METHODS.includes(payout_method)) {
    return NextResponse.json({ error: 'Invalid payout_method' }, { status: 400 })
  }
  if (!payout_account || String(payout_account).trim().length === 0) {
    return NextResponse.json({ error: 'payout_account is required' }, { status: 400 })
  }

  // Verify affiliate exists and is approved
  const { data: affiliate, error: affErr } = await supabase
    .from('affiliates')
    .select('id, status')
    .eq('user_id', user.id)
    .single()

  if (affErr || !affiliate) {
    return NextResponse.json({ error: 'Affiliate record not found' }, { status: 404 })
  }
  if (affiliate.status !== 'approved') {
    return NextResponse.json({ error: 'Only approved affiliates can set payout method' }, { status: 403 })
  }

  const { error: updateErr } = await supabase
    .from('affiliates')
    .update({
      payout_method: payout_method.trim(),
      payout_account: String(payout_account).trim(),
      payout_country: payout_country ? String(payout_country).trim() : null,
    })
    .eq('id', affiliate.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}