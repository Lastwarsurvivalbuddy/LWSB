import '@/lib/env'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BOYD_EMAIL = process.env.BOYD_EMAIL!

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  const anonClient = createClient(supabaseUrl, supabaseAnonKey)

  let userEmail: string | null = null

  if (token) {
    const { data: { user } } = await anonClient.auth.getUser(token)
    userEmail = user?.email ?? null
  }

  if (!userEmail) {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]))
        const accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token
        if (accessToken) {
          const { data: { user } } = await anonClient.auth.getUser(accessToken)
          userEmail = user?.email ?? null
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  if (!userEmail || userEmail !== BOYD_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode') ?? 'overview'

  // ── USERS MODE ────────────────────────────────────────────────────────────
  if (mode === 'users') {
    const tierFilter = searchParams.get('tier') ?? 'all'
    const flaggedOnly = searchParams.get('flagged') === 'true'
    const page = Math.max(0, parseInt(searchParams.get('page') ?? '0'))
    const pageSize = 50

    const { data: profiles, error: profileErr } = await supabase
      .from('commander_profile')
      .select('id, commander_name, server_number, hq_level')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 })
    }

    const profileIds = (profiles ?? []).map(p => p.id)

    // Pull email + created_at from auth.users via admin API
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const authMap: Record<string, { email: string; created_at: string }> = {}
    for (const u of (authData?.users ?? [])) {
      authMap[u.id] = { email: u.email ?? '—', created_at: u.created_at }
    }

    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id, tier, banned, flagged_for_review')
      .in('user_id', profileIds)

    const subMap: Record<string, { tier: string; banned: boolean; flagged: boolean }> = {}
    for (const s of (subs ?? [])) {
      subMap[s.user_id] = {
        tier: s.tier ?? 'free',
        banned: s.banned ?? false,
        flagged: s.flagged_for_review ?? false,
      }
    }

    const { data: profilesBase } = await supabase
      .from('profiles')
      .select('id, welcomed')
      .in('id', profileIds)

    const welcomedMap: Record<string, boolean> = {}
    for (const p of (profilesBase ?? [])) {
      welcomedMap[p.id] = p.welcomed ?? false
    }

    // FIX: column is usage_date, not date
    const { data: usageDates } = await supabase
      .from('daily_usage')
      .select('user_id, usage_date')
      .in('user_id', profileIds)
      .order('usage_date', { ascending: false })

    const lastActiveMap: Record<string, string> = {}
    for (const u of (usageDates ?? [])) {
      if (!lastActiveMap[u.user_id]) lastActiveMap[u.user_id] = u.usage_date
    }

    // FIX: column is usage_date, not date
    const { data: usageTotals } = await supabase
      .from('daily_usage')
      .select('user_id, question_count')
      .in('user_id', profileIds)

    const questionTotals: Record<string, number> = {}
    for (const u of (usageTotals ?? [])) {
      questionTotals[u.user_id] = (questionTotals[u.user_id] ?? 0) + (u.question_count ?? 0)
    }

    const { data: conversions } = await supabase
      .from('affiliate_conversions')
      .select('referred_user_id, affiliate_id')
      .in('referred_user_id', profileIds)

    const referralMap: Record<string, string> = {}
    for (const c of (conversions ?? [])) {
      referralMap[c.referred_user_id] = c.affiliate_id
    }

    const affiliateIds = [...new Set(Object.values(referralMap))]
    const affiliateCodeMap: Record<string, string> = {}
    if (affiliateIds.length > 0) {
      const { data: affs } = await supabase
        .from('affiliates')
        .select('id, referral_code, name')
        .in('id', affiliateIds)
      for (const a of (affs ?? [])) {
        affiliateCodeMap[a.id] = `${a.referral_code} (${a.name})`
      }
    }

    const { data: paymentRows } = await supabase
      .from('payments')
      .select('user_id, amount_usd')
      .in('user_id', profileIds)

    const revenueMap: Record<string, number> = {}
    for (const p of (paymentRows ?? [])) {
      revenueMap[p.user_id] = (revenueMap[p.user_id] ?? 0) + Number(p.amount_usd)
    }

    let users = (profiles ?? []).map(p => {
      const sub = subMap[p.id] ?? { tier: 'free', banned: false, flagged: false }
      const affiliateId = referralMap[p.id]
      const auth = authMap[p.id] ?? { email: '—', created_at: null }
      return {
        id: p.id,
        email: auth.email,
        ign: p.commander_name ?? '—',
        server: p.server_number ?? '—',
        hq: p.hq_level ?? '—',
        tier: sub.tier,
        banned: sub.banned,
        flagged: sub.flagged,
        joined: auth.created_at,
        lastActive: lastActiveMap[p.id] ?? null,
        totalQuestions: questionTotals[p.id] ?? 0,
        lifetimeRevenue: Math.round((revenueMap[p.id] ?? 0) * 100) / 100,
        referredBy: affiliateId ? (affiliateCodeMap[affiliateId] ?? affiliateId) : null,
        welcomed: welcomedMap[p.id] ?? false,
      }
    })

    if (tierFilter !== 'all') {
      users = users.filter(u => u.tier.toLowerCase() === tierFilter.toLowerCase())
    }
    if (flaggedOnly) {
      users = users.filter(u => u.flagged || u.banned)
    }

    const { count: totalCount } = await supabase
      .from('commander_profile')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({ users, page, pageSize, total: totalCount ?? 0 })
  }

  // ── OVERVIEW MODE ─────────────────────────────────────────────────────────

  const { count: totalUsers } = await supabase
    .from('commander_profile')
    .select('*', { count: 'exact', head: true })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Pull signup dates from auth for overview chart
  const { data: authDataOverview } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const allAuthUsers = authDataOverview?.users ?? []

  const { data: subRows } = await supabase
    .from('subscriptions')
    .select('tier')

  const tierCounts: Record<string, number> = { free: 0, pro: 0, elite: 0, founding: 0, alliance: 0 }
  for (const row of (subRows || [])) {
    const t = (row.tier || 'free').toLowerCase()
    if (t in tierCounts) tierCounts[t]++
    else tierCounts['free']++
  }
  const subscribedCount = (subRows || []).length
  tierCounts['free'] = Math.max(0, (totalUsers || 0) - subscribedCount + tierCounts['free'])

  const MRR_MAP: Record<string, number> = { pro: 9.99, elite: 19.99, alliance: 19.99, founding: 0, free: 0 }
  const mrr = Object.entries(tierCounts).reduce((sum, [tier, count]) => {
    return sum + (MRR_MAP[tier] || 0) * count
  }, 0)
  const foundingLtm = tierCounts['founding'] * 99

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

  // FIX: column is usage_date, not date
  const { data: dauRows } = await supabase
    .from('daily_usage')
    .select('user_id, usage_date')
    .gte('usage_date', sevenDaysAgoStr)

  const dauByDay: Record<string, Set<string>> = {}
  for (const row of (dauRows || [])) {
    const d = row.usage_date
    if (!dauByDay[d]) dauByDay[d] = new Set()
    dauByDay[d].add(row.user_id)
  }
  const dauSeries = Object.entries(dauByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, users]) => ({ date, count: users.size }))

  const todayStr = new Date().toISOString().split('T')[0]
  const todayDau = dauByDay[todayStr]?.size || 0

  const thisMonthStart = new Date()
  thisMonthStart.setDate(1)
  thisMonthStart.setHours(0, 0, 0, 0)
  const thisMonthStartStr = thisMonthStart.toISOString().split('T')[0]

  // FIX: column is usage_date, not date
  const { data: usageRows } = await supabase
    .from('daily_usage')
    .select('question_count, screenshot_count, battle_report_count')
    .gte('usage_date', thisMonthStartStr)

  let totalQuestions = 0, totalScreenshots = 0, totalBattleReports = 0
  for (const row of (usageRows || [])) {
    totalQuestions += row.question_count || 0
    totalScreenshots += row.screenshot_count || 0
    totalBattleReports += row.battle_report_count || 0
  }

  const COST_PER_Q = 0.008
  const COST_PER_SS = 0.015
  const COST_PER_BR = 0.012
  const apiCost = (totalQuestions * COST_PER_Q) + (totalScreenshots * COST_PER_SS) + (totalBattleReports * COST_PER_BR)

  // Build signup series from auth.users created_at
  const signupsByDay: Record<string, number> = {}
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()
  for (const u of allAuthUsers) {
    if (u.created_at >= thirtyDaysAgoStr) {
      const d = u.created_at.split('T')[0]
      signupsByDay[d] = (signupsByDay[d] || 0) + 1
    }
  }

  const signupSeries: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    signupSeries.push({ date: key, count: signupsByDay[key] || 0 })
  }

  const signupsThisWeek = signupSeries.slice(-7).reduce((s, r) => s + r.count, 0)

  // ── Submissions — pending only, with submitter IGN ──
  const { data: submissions } = await supabase
    .from('community_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)

  const submitterIds = [...new Set((submissions ?? []).map(s => s.user_id).filter(Boolean))]
  const submitterIgnMap: Record<string, string> = {}
  if (submitterIds.length > 0) {
    const { data: submitterProfiles } = await supabase
      .from('commander_profile')
      .select('id, commander_name, server_number')
      .in('id', submitterIds)
    for (const p of (submitterProfiles ?? [])) {
      submitterIgnMap[p.id] = p.commander_name
        ? `${p.commander_name} (S${p.server_number})`
        : `S${p.server_number}`
    }
  }

  const enrichedSubmissions = (submissions ?? []).map(s => ({
    ...s,
    submitter_ign: submitterIgnMap[s.user_id] ?? '—',
  }))

  const { data: modQueue } = await supabase
    .from('admin_moderation')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    signupsThisWeek,
    mrr: Math.round(mrr * 100) / 100,
    foundingLtm,
    todayDau,
    apiCostThisMonth: Math.round(apiCost * 100) / 100,
    tierCounts,
    signupSeries,
    dauSeries,
    apiUsage: {
      questions: totalQuestions,
      screenshots: totalScreenshots,
      battleReports: totalBattleReports,
    },
    submissions: enrichedSubmissions,
    modQueue: modQueue || [],
  })
}