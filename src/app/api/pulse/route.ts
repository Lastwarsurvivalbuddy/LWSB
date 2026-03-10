import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get('scope') // 'server' | 'global'
    const serverNumber = searchParams.get('server_number')

    // --- Top Streaks ---
    let streakQuery = supabase
      .from('profiles')
      .select('commander_name, streak_count, server_number')
      .gt('streak_count', 0)
      .order('streak_count', { ascending: false })
      .limit(5)

    if (scope === 'server' && serverNumber) {
      streakQuery = streakQuery.eq('server_number', parseInt(serverNumber))
    }

    const { data: streakData, error: streakError } = await streakQuery

    if (streakError) throw streakError

    // --- Most Active (approved submissions) ---
    let submissionQuery = supabase
      .from('community_submissions')
      .select('user_id, server_number')
      .eq('status', 'approved')

    if (scope === 'server' && serverNumber) {
      submissionQuery = submissionQuery.eq('server_number', parseInt(serverNumber))
    }

    const { data: submissionData, error: submissionError } = await submissionQuery

    if (submissionError) throw submissionError

    // Count submissions per user_id
    const countMap: Record<string, number> = {}
    for (const row of submissionData ?? []) {
      countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1
    }

    // Get top 5 user_ids by count
    const topUserIds = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId]) => userId)

    // Fetch commander names for those user_ids
    let topContributors: { commander_name: string; count: number; server_number: number }[] = []

    if (topUserIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, commander_name, server_number')
        .in('id', topUserIds)

      if (profileError) throw profileError

      topContributors = topUserIds.map((userId) => {
        const profile = profileData?.find((p) => p.id === userId)
        return {
          commander_name: profile?.commander_name ?? 'Unknown',
          server_number: profile?.server_number ?? 0,
          count: countMap[userId],
        }
      })
    }

    return NextResponse.json({
      streaks: streakData ?? [],
      contributors: topContributors,
    })
  } catch (err) {
    console.error('Pulse API error:', err)
    return NextResponse.json({ error: 'Failed to load pulse data' }, { status: 500 })
  }
}