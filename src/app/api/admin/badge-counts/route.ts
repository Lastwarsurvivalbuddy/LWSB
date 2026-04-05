import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'myersboyd@gmail.com'
const LAST_VISIT_KEY = 'admin_last_visit'

export async function GET(req: NextRequest) {
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Last visit anchor — falls back to 7 days ago on first ever load
  let lastVisit: string
  try {
    const { data: metaRow } = await supabase
      .from('admin_meta')
      .select('value')
      .eq('key', LAST_VISIT_KEY)
      .single()
    lastVisit = metaRow?.value ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  } catch {
    lastVisit = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  const [flaggedRes, affiliateRes, signupRes] = await Promise.all([
    supabase
      .from('rate_limits')
      .select('user_id', { count: 'exact', head: true })
      .eq('flagged_for_review', true),

    supabase
      .from('affiliates')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('commander_profile')
      .select('id', { count: 'exact', head: true })
      .gt('created_at', lastVisit),
  ])

  const flagged = flaggedRes.count ?? 0
  const pendingAffiliates = affiliateRes.count ?? 0
  const newSignups = signupRes.count ?? 0
  const total = flagged + pendingAffiliates + newSignups

  return NextResponse.json({ flagged, pendingAffiliates, newSignups, total, lastVisit })
}

// Called when you land on /admin — resets the new-signups counter
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase
    .from('admin_meta')
    .upsert({ key: LAST_VISIT_KEY, value: new Date().toISOString() }, { onConflict: 'key' })

  return NextResponse.json({ ok: true })
}