import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/admin/founding-count
// Public endpoint — no auth required. Returns:
//   { sold: number, remaining: number, cap: number }
//
// Source of truth: subscriptions table WHERE tier = 'founding'.
// Stripe is authoritative for payments; Supabase is kept in sync
// by the webhook. We read Supabase here — fast, no Stripe API latency.
//
// Cap is 500 — hardcoded to match business rules.

const FOUNDING_CAP = 500

export async function GET(_req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  try {
    const { count, error } = await supabase
      .from('subscriptions')
      .select('user_id', { count: 'exact', head: true })
      .eq('tier', 'founding')
      .eq('status', 'active')

    if (error) {
      console.error('founding-count error:', error)
      // Fail gracefully — return cap so UI doesn't break
      return NextResponse.json({ sold: 0, remaining: FOUNDING_CAP, cap: FOUNDING_CAP })
    }

    const sold = count ?? 0
    const remaining = Math.max(0, FOUNDING_CAP - sold)

    return NextResponse.json(
      { sold, remaining, cap: FOUNDING_CAP },
      {
        headers: {
          // Cache for 60s — good enough for a counter display, avoids hammering DB
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (err) {
    console.error('founding-count exception:', err)
    return NextResponse.json({ sold: 0, remaining: FOUNDING_CAP, cap: FOUNDING_CAP })
  }
}