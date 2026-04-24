// src/lib/touchLastActive.ts
//
// Stamps profiles.last_active_at = NOW() for a given user.
//
// Called from every "user did something meaningful" route — Buddy chat,
// Pack Scanner, TeachBuddy submissions, and anywhere else we want to
// surface activity in Mission Control.
//
// This is intentionally separate from daily_usage quota accounting.
// daily_usage.usage_date is a monthly bucket (YYYY-MM-01) for question/
// screenshot limits. last_active_at is a real TIMESTAMPTZ for "when did
// this user last do something" reporting.
//
// Fire-and-forget by design: never blocks the main response path, never
// throws. If the write fails we log and move on — the user's request
// does not care whether this succeeded.

import type { SupabaseClient } from '@supabase/supabase-js'

export async function touchLastActive(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('[touchLastActive] update failed:', error.message, 'user:', userId)
    }
  } catch (err) {
    console.error('[touchLastActive] unexpected error:', err, 'user:', userId)
  }
}