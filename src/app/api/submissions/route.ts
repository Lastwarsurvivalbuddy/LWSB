import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { incrementStreak } from '@/lib/streak'
import { touchLastActive } from '@/lib/touchLastActive'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Monthly screenshot limits per tier for TeachBuddy submissions
const SCREENSHOT_LIMITS: Record<string, number> = {
  free: 5,
  pro: 20,
  elite: 20,
  founding: 20,
  alliance: 20,
}

// Monthly usage key — matches buddy route and pack-scanner route exactly.
// daily_usage.usage_date is a `date` type: requires full YYYY-MM-DD,
// anchored to the 1st of the month for one row per user per month.
//
// Previous version returned 'YYYY-MM' (7 chars) and queried a column named
// 'date' that does not exist — TeachBuddy screenshot quota was silently
// failing (currentCount always 0, users could submit past their limit).
function getCurrentMonthKey(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const monthKey = getCurrentMonthKey()
    const { data } = await supabase
      .from('daily_usage')
      .select('submission_screenshot_count')
      .eq('user_id', user.id)
      .eq('usage_date', monthKey)
      .single()

    return NextResponse.json({ count: data?.submission_screenshot_count ?? 0 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { claim, category, scope, server_number, screenshot_path } = await req.json()

    if (!claim || !category || !scope || !server_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ─── Moderator check ───
    const { data: modRow } = await supabase
      .from('moderators')
      .select('user_id')
      .eq('user_id', user.id)
      .single()
    const isModerator = !!modRow

    // ─── Get tier ───
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()
    const tier = sub?.tier ?? 'free'
    const limit = SCREENSHOT_LIMITS[tier] ?? 5

    const monthKey = getCurrentMonthKey()

    // ─── Screenshot limit check ───
    if (screenshot_path && !isModerator) {
      const { data: usage } = await supabase
        .from('daily_usage')
        .select('submission_screenshot_count')
        .eq('user_id', user.id)
        .eq('usage_date', monthKey)
        .single()

      const currentCount = usage?.submission_screenshot_count ?? 0

      if (currentCount >= limit) {
        return NextResponse.json({ error: 'Screenshot limit reached' }, { status: 429 })
      }

      await supabase
        .from('daily_usage')
        .upsert(
          {
            user_id: user.id,
            usage_date: monthKey,
            submission_screenshot_count: currentCount + 1,
          },
          { onConflict: 'user_id,usage_date' }
        )
    }

    // ─── Insert submission ───
    const { error } = await supabase
      .from('community_submissions')
      .insert({
        user_id: user.id,
        server_number,
        category,
        claim,
        scope,
        screenshot_path: screenshot_path || null,
        status: 'pending',
      })

    if (error) throw error

    // ─── Increment streak ───
    await incrementStreak(supabase, user.id)

    // Stamp real activity timestamp for Mission Control "Last Active" column.
    // Independent from daily_usage quota bucket — see src/lib/touchLastActive.ts.
    await touchLastActive(supabase, user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}