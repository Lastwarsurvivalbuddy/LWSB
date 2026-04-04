'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DailyActionPlan from '@/components/DailyActionPlan'
import DailyBriefing from '@/components/DailyBriefing'
import SiteNews from '@/components/SiteNews'
import PackScanner from '@/components/PackScanner'
import TeachBuddy from '@/components/TeachBuddy'
import ServerPulse from '@/components/ServerPulse'
import BattleReportAnalyzer from '@/components/BattleReportAnalyzer'
import WarfighterBanner from '@/components/WarfighterBanner'
import ErrorBoundary from '@/components/ErrorBoundary'
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

interface BattleReportQuota {
  used_this_period: number
  limit: number
  display_limit: string
  remaining: number | string
  can_analyze: boolean
  resets_on: string
}

interface Notification {
  id: string
  message: string
  read: boolean
  created_at: string
}

// Alliance Duel day helper — reset is always 2am UTC
function getDuelDay(): { day: number; name: string; points: number } {
  const duelDays: Record<number, { name: string; points: number }> = {
    1: { name: 'Radar Training', points: 1 },
    2: { name: 'Base Expansion', points: 2 },
    3: { name: 'Age of Science', points: 2 },
    4: { name: 'Train Heroes', points: 2 },
    5: { name: 'Total Mobilization', points: 2 },
    6: { name: 'Enemy Buster', points: 4 },
    7: { name: 'Reset', points: 0 },
  }
  const now = new Date()
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const utcDay = adjusted.getUTCDay()
  const dayMap: Record<number, number> = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  const day = dayMap[utcDay] ?? 1
  return { day, ...duelDays[day] }
}

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

function troopTierDisplay(tier: string): string {
  const map: Record<string, string> = {
    under_t10: 'Under T10',
    t10: 'T10',
    t11: 'T11',
  }
  return map[tier] ?? tier ?? '—'
}

// ─────────────────────────────────────────────────────────────
// ROOKIE COMMANDER CARD
// Shown for players with server_day <= 60
// ─────────────────────────────────────────────────────────────

function RookieCommanderCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3 flex-wrap"
      style={{
        backgroundColor: 'rgba(240,165,0,0.06)',
        border: '1px solid rgba(240,165,0,0.2)',
        borderLeft: '3px solid #f0a500',
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-mono tracking-widest text-amber-500 uppercase mb-1">
          New Commander
        </p>
        <p className="text-sm font-bold text-white mb-0.5">
          New LW Commander? Start here →
        </p>
        <p className="text-xs text-zinc-500 leading-snug">
          The Rookie Commander Guide walks you through exactly what to focus on first.
          No overwhelm. Shareable with new alliance members too.
        </p>
      </div>
      <button
        onClick={onNavigate}
        className="flex-shrink-0 text-[12px] font-bold px-4 py-2 rounded-lg transition-colors active:scale-95"
        style={{ backgroundColor: '#f0a500', color: '#0d1117' }}
      >
        Open guide
      </button>
    </div>
  )
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [battleReportOpen, setBattleReportOpen] = useState(false)
  const [accessToken, setAccessToken] = useState<string>('')
  const [battleReportQuota, setBattleReportQuota] = useState<BattleReportQuota>({
    used_this_period: 0,
    limit: 0,
    display_limit: '0',
    remaining: 0,
    can_analyze: false,
    resets_on: '',
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [affiliateStatus, setAffiliateStatus] = useState<'approved' | 'pending' | 'none'>('none')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()
  const duel = getDuelDay()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/signin'); return }
        setAccessToken(session.access_token)

        const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
        if (adminUserId && session.user.id === adminUserId) {
          setIsAdmin(true)
        }

        const { data, error } = await supabase
          .from('commander_profile')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (error) throw error
        if (!data?.onboarding_complete) { router.push('/onboarding'); return }

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

        const tier = data.subscription_tier ?? 'free'
        if (tier !== 'free') {
          try {
            const quotaRes = await fetch('/api/battle-report', {
              headers: { Authorization: `Bearer ${session.access_token}` },
            })
            if (quotaRes.ok) {
              const quotaData = await quotaRes.json()
              const q = quotaData.quota
              setBattleReportQuota({
                used_this_period: q.used_this_period ?? 0,
                limit: q.limit ?? 0,
                display_limit: q.display_limit ?? '0',
                remaining: q.remaining ?? 0,
                can_analyze: q.can_analyze ?? false,
                resets_on: q.resets_on ?? '',
              })
            }
          } catch {
            // Non-fatal
          }
        }

        try {
          const affiliateRes = await fetch('/api/affiliate/dashboard', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          if (affiliateRes.ok) {
            setAffiliateStatus('approved')
          } else if (affiliateRes.status === 403) {
            setAffiliateStatus('pending')
          } else {
            setAffiliateStatus('none')
          }
        } catch {
          setAffiliateStatus('none')
        }

        // ── Fetch unread notifications ──
        try {
          const notifRes = await fetch('/api/notifications', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          if (notifRes.ok) {
            const notifData = await notifRes.json()
            setNotifications(notifData.notifications ?? [])
          }
        } catch {
          // Non-fatal
        }

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [router])

  async function dismissNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ id }),
      })
    } catch {
      // Non-fatal
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  function handleReportComplete() {
    setBattleReportQuota((prev: BattleReportQuota) => {
      const newUsed = prev.used_this_period + 1
      const newRemaining =
        typeof prev.remaining === 'number'
          ? Math.max(0, prev.remaining - 1)
          : prev.remaining
      const canStillAnalyze =
        typeof newRemaining === 'number' ? newRemaining > 0 : true
      return { ...prev, used_this_period: newUsed, remaining: newRemaining, can_analyze: canStillAnalyze }
    })
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
  const subscriptionTier = profile.subscription_tier ?? 'free'
  const isFree = subscriptionTier === 'free'
  const isFounding = subscriptionTier === 'founding'

  const showRookieCard = (profile.server_day ?? 0) <= 60

  const statsGrid = [
    { label: 'HQ Level', value: profile.hq_level ?? '—' },
    { label: 'Troop Tier', value: troopTierDisplay(profile.troop_tier) },
    { label: 'Squad 1 Type', value: profile.troop_type || '—' },
    {
      label: 'Squad 1 Power',
      value: profile.squad_power_tier
        ? SQUAD_POWER_TIER_LABELS[profile.squad_power_tier]
        : '—',
    },
    {
      label: 'Server Rank',
      value: profile.rank_bucket ? RANK_BUCKET_LABELS[profile.rank_bucket] : '—',
    },
    {
      label: 'Kill Tier',
      value: profile.kill_tier ? KILL_TIER_TITLES[profile.kill_tier] : '—',
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ── Warfighter mode banner ── */}
      <ErrorBoundary label="Warfighter Banner">
        <WarfighterBanner />
      </ErrorBoundary>

      {/* ── Top nav bar ── */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-sm flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1L2 5v6l6 4 6-4V5L8 1z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wide text-white">LWSB</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Duel day badge */}
            <div className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider
              ${duel.day === 6
                ? 'bg-red-900/60 text-red-300 border border-red-800'
                : duel.day === 7
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                : 'bg-amber-900/40 text-amber-300 border border-amber-800/60'}
            `}>
              <div className={`w-1.5 h-1.5 rounded-full ${duel.day === 6 ? 'bg-red-400 animate-pulse' : duel.day === 7 ? 'bg-zinc-500' : 'bg-amber-400'}`} />
              DAY {duel.day} · {duel.name.toUpperCase()}
            </div>

            {/* Streak counter */}
            <div
              title={hasActiveStreak
                ? `${streak}-day streak — ask Buddy or submit intel daily to keep it alive`
                : 'No active streak — ask Buddy or submit intel to start one'}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold font-mono transition-colors
                ${hasActiveStreak
                  ? 'bg-orange-900/40 text-orange-300 border border-orange-800/60'
                  : 'bg-zinc-800/60 text-zinc-600 border border-zinc-700/60'}
              `}
            >
              <span className={hasActiveStreak ? '' : 'grayscale opacity-50'}>🔥</span>
              <span>{streak}</span>
            </div>

            {/* How to Use */}
            <button
              onClick={() => router.push('/how-to')}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              title="How to use Buddy"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5c0 .67-.4 1.23-1 1.46V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.6" fill="currentColor"/>
              </svg>
            </button>

            {/* Mission Control — Boyd only */}
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="text-zinc-500 hover:text-amber-500 transition-colors"
                title="Mission Control"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M4 8h2M10 8h2M8 4v2M8 10v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </button>
            )}

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

        {/* ── User Notifications ── */}
        {notifications.map(n => (
          <div
            key={n.id}
            className="mt-4 flex items-start justify-between gap-3 rounded-xl px-4 py-3"
            style={{
              backgroundColor: 'rgba(234,179,8,0.06)',
              border: '1px solid rgba(234,179,8,0.25)',
              borderLeft: '3px solid #ca8a04',
            }}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠️</span>
              <div className="min-w-0">
                <p className="text-xs text-amber-200/80 leading-snug">{n.message}</p>
                <a
                  href="mailto:support@lastwarsurvivalbuddy.com"
                  className="text-[11px] text-amber-600 hover:text-amber-400 transition-colors mt-1 inline-block"
                >
                  Contact support →
                </a>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="flex-shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors mt-0.5"
              title="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}

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

        {/* ── Free tier upgrade nudge ── */}
        {isFree && (
          <button
            onClick={() => router.push('/upgrade')}
            className="mt-4 w-full flex items-center justify-between gap-3 bg-gradient-to-r from-amber-950/60 to-zinc-900/60 border border-amber-700/50 hover:border-amber-600 rounded-xl px-4 py-3 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg flex-shrink-0">⚡</span>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                  You&apos;re on Free — 20 questions/month, no Battle Reports, no Pack Scanner
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Pro · $9.99/mo — 100 questions/month · Battle Report Analyzer · Pack Scanner
                </p>
              </div>
            </div>
            <span className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-400 text-black transition-colors whitespace-nowrap">
              Upgrade →
            </span>
          </button>
        )}

        {/* ── Rookie Commander Card — sub-Day-60 only ── */}
        {showRookieCard && (
          <RookieCommanderCard onNavigate={() => router.push('/guide')} />
        )}

        {/* ── Today's Orders + Watch Out + Site News ── */}
        <section className="pt-6">
          <ErrorBoundary label="Daily Action Plan">
            <DailyActionPlan profile={profile} />
          </ErrorBoundary>
          <div className="mt-3">
            <ErrorBoundary label="Watch Out">
              <DailyBriefing />
            </ErrorBoundary>
          </div>
          <ErrorBoundary label="Site News">
            <SiteNews />
          </ErrorBoundary>
        </section>

        {/* ── BATTLE REPORT ANALYZER CARD ── */}
        <section className="pt-4">
          <ErrorBoundary label="Battle Report Analyzer">
            {isFree ? (
              <button onClick={() => router.push('/upgrade')} className="w-full group">
                <div className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-800/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⚔️</span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">Battle Report Analyzer</span>
                          <span className="text-[10px] font-bold bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-1.5 py-0.5 rounded tracking-wider">
                            PRO
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Upload battle screenshots. Get an expert breakdown — type counter, morale cascade, stat gap, rematch verdict.
                        </p>
                      </div>
                    </div>
                    <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800/60">
                    <p className="text-[11px] text-amber-600 font-semibold group-hover:text-amber-500 transition-colors">
                      Unlock with Pro → $9.99/mo
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <button onClick={() => setBattleReportOpen(true)} className="w-full group">
                <div className={`
                  border rounded-2xl p-5 transition-all
                  ${battleReportQuota.can_analyze
                    ? 'bg-gradient-to-br from-red-950/40 to-zinc-900/60 border-red-800/50 hover:border-red-700/70 hover:from-red-950/60'
                    : 'bg-zinc-900/50 border-zinc-800 opacity-60'}
                `}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                        ${battleReportQuota.can_analyze
                          ? 'bg-red-900/50 border border-red-700/50 group-hover:bg-red-900/70'
                          : 'bg-zinc-800 border border-zinc-700'}
                      `}>
                        <span className="text-xl">⚔️</span>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">Battle Report Analyzer</span>
                          {isFounding && (
                            <span className="text-[10px] font-bold bg-purple-500/20 border border-purple-500/40 text-purple-400 px-1.5 py-0.5 rounded tracking-wider">
                              FOUNDING
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Upload your battle report screenshots. Get expert coaching on exactly why you won or lost.
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors mt-1" fill="none" viewBox="0 0 16 16">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Quota bar */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {isFounding
                          ? `${battleReportQuota.used_this_period} of 16 used this month`
                          : `${battleReportQuota.used_this_period} of ${battleReportQuota.limit} used this month`}
                      </span>
                      <span className={`text-[11px] font-bold ${battleReportQuota.can_analyze ? 'text-red-400' : 'text-zinc-600'}`}>
                        {battleReportQuota.can_analyze
                          ? `${battleReportQuota.remaining} left →`
                          : battleReportQuota.resets_on
                          ? `Resets ${battleReportQuota.resets_on}`
                          : 'Limit reached'}
                      </span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          battleReportQuota.used_this_period >= battleReportQuota.limit
                            ? 'bg-zinc-600'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (battleReportQuota.used_this_period / Math.max(battleReportQuota.limit, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            )}
          </ErrorBoundary>
        </section>

        {/* ── WAR ROOM CARD ── */}
        <section className="pt-4">
          <button onClick={() => router.push('/war-room')} className="w-full group">
            <div className="bg-zinc-900/50 border border-zinc-800 hover:border-amber-800/60 rounded-2xl p-5 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-900/20 border border-amber-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🗺️</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">War Room</span>
                      <span className="text-[10px] font-bold bg-green-500/15 border border-green-500/30 text-green-400 px-1.5 py-0.5 rounded tracking-wider">
                        FREE
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Build shareable battle plans for your alliance/server. Assign roles, write orders, post to alliance chat.
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">🏜️ Desert Storm</span>
                      <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">⚔️ Warzone Duel</span>
                      <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">⚡ Canyon Storm</span>
                    </div>
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </button>
        </section>

        {/* ── Pack Scanner ── */}
        <section className="pt-4">
          <ErrorBoundary label="Pack Scanner">
            <PackScanner subscriptionTier={subscriptionTier} />
          </ErrorBoundary>
        </section>

        {/* ── TeachBuddy ── */}
        <section className="pt-4 pb-2">
          <ErrorBoundary label="TeachBuddy">
            <TeachBuddy serverNumber={Number(profile.server_number)} />
          </ErrorBoundary>
        </section>

        {/* ── Server Pulse ── */}
        <section className="mt-6">
          <ErrorBoundary label="Server Pulse">
            <ServerPulse serverNumber={Number(profile.server_number ?? 1032)} />
          </ErrorBoundary>
        </section>

        <div className="my-6 h-px bg-zinc-800" />

        {/* ── Commander Profile Snapshot ── */}
        <section>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Commander Profile
          </p>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
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
                  ${subscriptionTier === 'elite'
                    ? 'bg-amber-900/60 text-amber-300 border border-amber-800'
                    : subscriptionTier === 'pro'
                    ? 'bg-sky-900/60 text-sky-300 border border-sky-800'
                    : subscriptionTier === 'founding'
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-800'
                    : subscriptionTier === 'alliance'
                    ? 'bg-green-900/60 text-green-300 border border-green-800'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}
                `}>
                  {subscriptionTier.toUpperCase()}
                </span>
                {isFree && (
                  <button
                    onClick={() => router.push('/upgrade')}
                    className="text-[10px] text-amber-600 hover:text-amber-400 transition-colors font-mono underline underline-offset-2"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {statsGrid.map(({ label, value }) => (
                <div key={label} className="bg-zinc-950/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm font-semibold text-zinc-200 truncate">{String(value)}</p>
                </div>
              ))}
            </div>

            <div className="pt-1 border-t border-zinc-800 flex items-center">
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

          {/* ── Quick links below card ── */}
          <div className="mt-3 flex items-center gap-5 flex-wrap px-1">
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
              onClick={() => router.push('/how-to')}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 5c0-.55.45-1 1-1s1 .45 1 1c0 .42-.27.78-.67.92V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="6" cy="9.5" r="0.5" fill="currentColor"/>
              </svg>
              How to use
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                <path d="M1 2.5h10a.5.5 0 01.5.5v6a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 3l5 4 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Contact
            </button>
            {affiliateStatus === 'approved' && (
              <button
                onClick={() => router.push('/affiliate/dashboard')}
                className="text-xs text-green-700 hover:text-green-500 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                Affiliate Dashboard
              </button>
            )}
            {affiliateStatus === 'none' && (
              <button
                onClick={() => router.push('/affiliate')}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 4v4M4 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Become an Affiliate
              </button>
            )}
          </div>

          {/* ── Data attribution ── */}
          <div className="mt-5 flex justify-center">
            <a
              href="https://cpt-hedge.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors tracking-wider uppercase"
            >
              <span className="text-[9px]">⬡</span>
              Data powered by cpt-hedge.com
            </a>
          </div>
        </section>
      </main>

      {/* ── Battle Report Analyzer Modal ── */}
      <ErrorBoundary
        label="Battle Report Modal"
        fallback={
          battleReportOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-8 text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <h2 className="text-xl font-bold text-white">Something went wrong</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The Battle Report Analyzer hit an unexpected error. Your quota was not charged.
                </p>
                <p className="text-gray-600 text-xs">
                  Try again with clearer, cropped screenshots. If this keeps happening, contact support.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBattleReportOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => { setBattleReportOpen(false); setTimeout(() => setBattleReportOpen(true), 50); }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Try Again →
                  </button>
                </div>
              </div>
            </div>
          ) : null
        }
      >
        <BattleReportAnalyzer
          isOpen={battleReportOpen}
          onClose={() => setBattleReportOpen(false)}
          userTier={subscriptionTier}
          reportsUsedThisPeriod={battleReportQuota.used_this_period}
          reportsLimitThisPeriod={battleReportQuota.limit}
          resetsOn={battleReportQuota.resets_on}
          accessToken={accessToken}
          onReportComplete={handleReportComplete}
        />
      </ErrorBoundary>

      {/* ── Floating Buddy button ── */}
      <div className="fixed bottom-6 right-4 z-30">
        <button
          onClick={() => router.push('/buddy')}
          className="flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-5 py-3 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-200 active:scale-95"
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
