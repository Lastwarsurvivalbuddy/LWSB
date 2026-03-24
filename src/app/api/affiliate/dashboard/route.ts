import '@/lib/env'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const TIER_REVENUE: Record<string, number> = {
  pro: 9.99,
  elite: 19.99,
  founding: 0,
}

export async function GET(req: NextRequest) {
  try {
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

    // Fetch affiliate record
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (affError || !affiliate) {
      return NextResponse.json({ error: 'No affiliate record found.' }, { status: 404 })
    }

    // If not approved, return status only
    if (affiliate.status !== 'approved') {
      return NextResponse.json({
        status: affiliate.status,
        referral_code: null,
        conversions: [],
        stats: null,
      })
    }

    // Fetch conversions
    const { data: conversions, error: convError } = await supabase
      .from('affiliate_conversions')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('converted_at', { ascending: false })

    if (convError) {
      console.error('Conversions fetch error:', convError)
      return NextResponse.json({ error: 'Failed to fetch conversions.' }, { status: 500 })
    }

    const totalConversions = conversions?.length ?? 0
    const activeConversions = conversions?.filter(c => c.subscription_tier !== 'founding') ?? []
    const foundingConversions = conversions?.filter(c => c.subscription_tier === 'founding') ?? []

    const monthlyRecurring = activeConversions.reduce((sum, c) => {
      const revenue = TIER_REVENUE[c.subscription_tier] ?? 0
      return sum + revenue * affiliate.payout_rate
    }, 0)

    const foundingEarnings = foundingConversions.length * 99 * affiliate.payout_rate

    const stats = {
      total_conversions: totalConversions,
      active_subscriptions: activeConversions.length,
      founding_conversions: foundingConversions.length,
      payout_rate_pct: Math.round(affiliate.payout_rate * 100),
      estimated_monthly_recurring: parseFloat(monthlyRecurring.toFixed(2)),
      founding_earnings: parseFloat(foundingEarnings.toFixed(2)),
      referral_link: `https://lastwarsurvivalbuddy.com/?ref=${affiliate.referral_code}`,
    }

    return NextResponse.json({
      status: affiliate.status,
      referral_code: affiliate.referral_code,
      name: affiliate.name,
      ign: affiliate.ign,
      payout_method: affiliate.payout_method ?? null,
      payout_account: affiliate.payout_account ?? null,
      payout_country: affiliate.payout_country ?? null,
      conversions: conversions ?? [],
      stats,
    })
  } catch (err) {
    console.error('Affiliate dashboard error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}