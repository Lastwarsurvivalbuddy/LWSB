// src/lib/streak.ts
// Shared streak increment logic — called by Buddy API + Submissions API
// A streak day = ask Buddy OR submit community intel
// Miss one calendar day = streak resets to zero
// Last updated: March 8, 2026

import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Increments the streak for a user on a successful check-in action.
 * Safe to call multiple times per day — only increments once per calendar day.
 */
export async function incrementStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_count, last_checkin_date')
      .eq('id', userId)
      .single()

    if (!profile) return

    const lastCheckin = profile.last_checkin_date as string | null
    const currentStreak = (profile.streak_count as number) || 0

    // Already checked in today — nothing to do
    if (lastCheckin === today) return

    // Calculate yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak: number
    if (lastCheckin === yesterdayStr) {
      // Consecutive day — increment
      newStreak = currentStreak + 1
    } else {
      // Missed at least one day — reset to 1
      newStreak = 1
    }

    await supabase
      .from('profiles')
      .update({
        streak_count: newStreak,
        last_checkin_date: today,
      })
      .eq('id', userId)

  } catch (err) {
    // Streak failure is non-fatal — never block the main action
    console.error('[streak] increment failed:', err)
  }
}