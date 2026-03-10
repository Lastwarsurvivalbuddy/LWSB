'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DailyActionPlan from '@/components/DailyActionPlan'
import TeachBuddy from '@/components/TeachBuddy'
import ServerPulse from '@/components/ServerPulse'
import {
  RANK_BUCKET_LABELS,
  SQUAD_POWER_TIER_LABELS,
  KILL_TIER_TITLES,
  SEASON_LABELS,
  type RankBucket,
  type SquadPowerTier,
  type PowerBucket,
  type KillTier,
} from '@/lib/profileTypes'

interface Profile {
  id: string
  commander_name: string
  hq_level: number
  troop_tier: string
  troop_type: string
  playstyle: string
  spend_style: string
  season?: number
  rank_bucket?: RankBucket
  squad_power_tier?: SquadPowerTier
  power_bucket?: PowerBucket
  kill_tier?: KillTier
  server_number?: number
  server_day?: number
  computed_server_day?: number
  subscription_tier?: string
  onboarding_complete?: boolean
  last_profile_update?: string
  update_reminder_frequency?: string
  streak_count?: number
  last_checkin_date?: string
  alliance_name?: string
  alliance_tag?: string
}

// Alliance Duel day helper — reset is always 2am UTC
function getDuelDay(): { day: number; name: string; points: number } {
  const duelDays: Record<number, { name: string; points: number }> = {
    1: { name: 'Radar Training',     points: 1 },
    2: { name: 'Base Expansion',     points: 2 },
    3: { name: 'Age of Science',     points: 2 },
    4: { name: 'Train Heroes',       points: 2 },
    5: { name: 'Total Mobilization', points: 2 },
    6: { name: 'Enemy Buster',       points: 4 },
    7: { name: 'Reset',              points: 0 },
  }
  const now = new Date()
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const utcDay = adjusted.getUTCDay()
  const dayMap: Record<number, number> = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  const day = dayMap[utcDay] ?? 1
  return { day, ...duelDays[day] }
}

// Returns days since last_profile_update, or null if never set
function daysSinceUpdate(lastUpdate?: string): number | null {
  if (!lastUpdate) return null
  const diff = Date.now() - new Date(lastUpdate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function shouldShowStaleBanner(profile: Profile): boolean {
  const freq = profile.update_reminder_frequency || 'weekly'
  if (freq === 'off') return false
  const days = daysSinceUpdate(profile.last_profile_update)
  if (days === null) return true
  if (freq === 'daily') return days >= 1
  if (freq === 'weekly') return days >= 7
  return false
}

// Troop tier display for new 3-tier model
function troopTierDisplay(tier: string): string {
  const map: Record<string, string> = {
    under_t10: 'Under T10',
    t10:       'T10',
    t11:       'T11',
  }
  return map[tier] ?? tier ?? '—'
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const duel = getDuelDay()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/signin'); return }

        const { data, error } = await supabase
          .from('commander_profile')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error
        if (!data?.onboarding_complete) { router.push('/onboarding'); return }

        // Fetch streak separately from profiles (not in view yet)
        const { data: streakData } = await supabase
          .from('profiles')
          .select('streak_count, last_checkin_date')
          .eq('id', session.user.id)
          .single()

        setProfile({
          ...data,
          streak_count: streakData?.streak_count ?? 0,
          last_checkin_date: streakData?.last_checkin_date ?? null,
        })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  // ─── LOADING ───
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-mono">Loading Intel...</p>
        </div>
      </div>
    )
  }

  // ─── ERROR ───
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">{error || 'Profile not found'}</p>
          <button onClick={() => router.push('/signin')} className="text-zinc-400 text-xs underline">
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  const showStaleBanner = shouldShowStaleBanner(profile)
  const staleDays = daysSinceUpdate(profile.last_profile_update)
  const displayServerDay = profile.computed_server_day ?? profile.server_day
  const streak = profile.streak_count ?? 0
  const hasActiveStreak = streak > 0

  // Stats grid — new bucket fields
  const statsGrid = [
    {
      label: 'HQ Level',
      value: profile.hq_level ?? '—',
    },
    {
      label: 'Troop Tier',
      value: troopTierDisplay(profile.troop_tier),
    },
    {
      label: 'Squad 1 Type',
      value: profile.troop_type || '—',
    },
    {
      label: 'Squad 1 Power',
      value: profile.squad_power_tier
        ? SQUAD_POWER_TIER_LABELS[profile.squad_power_tier]
        : '—',
    },
    {
      label: 'Server Rank',
      value: profile.rank_bucket
        ? RANK_BUCKET_LABELS[profile.rank_bucket]
        : '—',
    },
    {
      label: 'Kill Tier',
      value: profile.kill_tier
        ? KILL_TIER_TITLES[profile.kill_tier]
        : '—',
    },
  ]

  // ─── DASHBOARD ───
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Top nav bar ── */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">

          {/* Left — logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-sm flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1L2 5v6l6 4 6-4V5L8 1z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wide text-white">LWSB</span>
          </div>

          {/* Right — controls */}
          <div className="flex items-center gap-3">

            {/* Duel day badge */}
            <div className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider
              ${duel.day === 6 ? 'bg-red-900/60 text-red-300 border border-red-800' :
                duel.day === 7 ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' :
                'bg-amber-900/40 text-amber-300 border border-amber-800/60'}
            `}>
              <div className={`w-1.5 h-1.5 rounded-full ${duel.day === 6 ? 'bg-red-400 animate-pulse' : duel.day === 7 ? 'bg-zinc-500' : 'bg-amber-400'}`} />
              DAY {duel.day} · {duel.name.toUpperCase()}
            </div>

            {/* Streak counter */}
            <div
              title={hasActiveStreak ? `${streak}-day streak — ask Buddy or submit intel daily to keep it alive` : 'No active streak — ask Buddy or submit intel to start one'}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold font-mono
                transition-colors
                ${hasActiveStreak
                  ? 'bg-orange-900/40 text-orange-300 border border-orange-800/60'
                  : 'bg-zinc-800/60 text-zinc-600 border border-zinc-700/60'}
              `}
            >
              <span className={hasActiveStreak ? '' : 'grayscale opacity-50'}>🔥</span>
              <span>{streak}</span>
            </div>

            {/* Commander Card */}
            <button
              onClick={() => router.push('/card')}
              className="text-zinc-500 hover:text-amber-500 transition-colors"
              title="Commander Card"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M4 7h3M4 9.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24">

        {/* ── Profile staleness banner ── */}
        {showStaleBanner && (
          <div className="mt-4 flex items-center justify-between gap-3 bg-amber-950/40 border border-amber-800/60 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-amber-400 text-base flex-shrink-0">⚠️</span>
              <p className="text-amber-200/80 text-xs leading-snug">
                {staleDays === null
                  ? 'Update your stats so Buddy stays accurate.'
                  : `Your profile is ${staleDays} day${staleDays === 1 ? '' : 's'} old — update your stats so Buddy stays accurate.`}
              </p>
            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors active:scale-95"
            >
              Update
            </button>
          </div>
        )}

        {/* ── Daily Action Plan ── */}
        <section className="pt-6 pb-2">
          <DailyActionPlan profile={profile} />
          <TeachBuddy serverNumber={Number(profile.server_number)} />
        </section>

       {/* ── Server Pulse ── */}
        <section className="mt-6">
          <ServerPulse serverNumber={Number(profile.server_number ?? 1032)} />
        </section>

        {/* Divider */}
        <div className="my-6 h-px bg-zinc-800" />

        {/* ── Commander Profile Snapshot ── */}
        <section>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Commander Profile
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">

            {/* Name + tier + season */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{profile.commander_name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Server {profile.server_number} · Day {displayServerDay}
                  {profile.season !== undefined && profile.season !== null && (
                    <span className="ml-1 text-zinc-600">· {SEASON_LABELS[profile.season] ?? `S${profile.season}`}</span>
                  )}
                </p>
                {profile.alliance_name && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {profile.alliance_tag && (
                      <span className="text-amber-500 font-semibold">{profile.alliance_tag} </span>
                    )}
                    {profile.alliance_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`
                  text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded font-mono
                  ${profile.subscription_tier === 'elite'    ? 'bg-amber-900/60 text-amber-300 border border-amber-800' :
                    profile.subscription_tier === 'pro'      ? 'bg-sky-900/60 text-sky-300 border border-sky-800' :
                    profile.subscription_tier === 'founding' ? 'bg-purple-900/60 text-purple-300 border border-purple-800' :
                    'bg-zinc-800 text-zinc-500 border border-zinc-700'}
                `}>
                  {profile.subscription_tier ? profile.subscription_tier.toUpperCase() : 'FREE'}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {statsGrid.map(({ label, value }) => (
                <div key={label} className="bg-zinc-950/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm font-semibold text-zinc-200 truncate">{String(value)}</p>
                </div>
              ))}
            </div>

            {/* Edit profile + Commander Card links */}
            <div className="pt-1 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => router.push('/profile/edit')}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Edit profile
              </button>
              <button
                onClick={() => router.push('/card')}
                className="text-xs text-amber-700 hover:text-amber-500 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M1 3a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M3 5h2M3 7h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Commander Card
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── Floating Buddy button ── */}
      <div className="fixed bottom-6 right-4 z-30">
        <button
          onClick={() => router.push('/buddy')}
          className="
            flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400
            text-black font-bold text-sm px-5 py-3 rounded-full
            shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50
            transition-all duration-200 active:scale-95
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M14 8c0 3.314-2.686 6-6 6a5.97 5.97 0 01-3.2-.928L2 14l.928-2.8A5.97 5.97 0 012 8c0-3.314 2.686-6 6-6s6 2.686 6 6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Ask Buddy
        </button>
      </div>

    </div>
  )
}
