import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BOYD_EMAIL = process.env.BOYD_EMAIL!

export async function GET(req: NextRequest) {
  // Verify session from Authorization header or cookie
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  const anonClient = createClient(supabaseUrl, supabaseAnonKey)

  // Get user from token if present, otherwise fall back to cookie-based session
  let userEmail: string | null = null

  if (token) {
    const { data: { user } } = await anonClient.auth.getUser(token)
    userEmail = user?.email ?? null
  }

  if (!userEmail) {
    // Try reading the cookie-based session
    const cookieHeader = req.headers.get('cookie') || ''
    // Extract sb-access-token from cookies
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

  // Use service role for unrestricted data access
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // --- Total users ---
  const { count: totalUsers } = await supabase
    .from('commander_profile')
    .select('*', { count: 'exact', head: true })

  // --- Signups last 30 days ---
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentProfiles } = await supabase
    .from('commander_profile')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // --- Subscription tier counts ---
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

  // --- MRR ---
  const MRR_MAP: Record<string, number> = { pro: 9.99, elite: 19.99, alliance: 19.99, founding: 0, free: 0 }
  const mrr = Object.entries(tierCounts).reduce((sum, [tier, count]) => {
    return sum + (MRR_MAP[tier] || 0) * count
  }, 0)
  const foundingLtm = tierCounts['founding'] * 99

  // --- DAU last 7 days ---
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: dauRows } = await supabase
    .from('daily_usage')
    .select('user_id, date')
    .gte('date', sevenDaysAgo.toISOString().split('T')[0])

  const dauByDay: Record<string, Set<string>> = {}
  for (const row of (dauRows || [])) {
    const d = row.date
    if (!dauByDay[d]) dauByDay[d] = new Set()
    dauByDay[d].add(row.user_id)
  }
  const dauSeries = Object.entries(dauByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, users]) => ({ date, count: users.size }))

  const todayStr = new Date().toISOString().split('T')[0]
  const todayDau = dauByDay[todayStr]?.size || 0

  // --- API usage this month ---
  const thisMonthStart = new Date()
  thisMonthStart.setDate(1)
  thisMonthStart.setHours(0, 0, 0, 0)

  const { data: usageRows } = await supabase
    .from('daily_usage')
    .select('question_count, screenshot_count, battle_report_count')
    .gte('date', thisMonthStart.toISOString().split('T')[0])

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

  // --- Signups by day ---
  const signupsByDay: Record<string, number> = {}
  for (const p of (recentProfiles || [])) {
    const d = p.created_at.split('T')[0]
    signupsByDay[d] = (signupsByDay[d] || 0) + 1
  }

  const signupSeries: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    signupSeries.push({ date: key, count: signupsByDay[key] || 0 })
  }

  const signupsThisWeek = signupSeries.slice(-7).reduce((s, r) => s + r.count, 0)

  // --- Community submissions ---
  const { data: submissions } = await supabase
    .from('community_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

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
    submissions: submissions || [],
    modQueue: modQueue || [],
  })
}