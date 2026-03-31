'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TIERS = [
  {
    id: 'pro',
    name: 'Buddy Pro',
    price: '$9.99',
    period: '/mo',
    questions: 100,
    screenshots: 10,
    battle_reports: 10,
    battle_reports_label: '10/mo',
    color: 'sky',
    badge: null,
    description: 'For active players who want daily guidance.',
    features: [
      '100 questions per month',
      '10 screenshot analyses per month',
      '10 Battle Report analyses per month',
      'Full Buddy AI with profile context',
      'Pack Scanner',
      'Daily Briefing + Action Plan',
      'Desert Storm War Room',
      'Cancel anytime',
    ],
  },
  {
    id: 'elite',
    name: 'Buddy Elite',
    price: '$19.99',
    period: '/mo',
    questions: 250,
    screenshots: 20,
    battle_reports: 20,
    battle_reports_label: '20/mo',
    color: 'amber',
    badge: 'MOST POPULAR',
    description: 'For serious commanders who play to win.',
    features: [
      '250 questions per month',
      '20 screenshot analyses per month',
      '20 Battle Report analyses per month',
      'Full Buddy AI with profile context',
      'Pack Scanner',
      'Daily Briefing + Action Plan',
      'Desert Storm War Room',
      'Priority access to new features',
      'Cancel anytime',
    ],
  },
  {
    id: 'founding',
    name: 'Founding Member',
    price: '$99',
    period: ' lifetime',
    questions: 300,
    screenshots: 999,
    battle_reports: 15,
    battle_reports_label: '15/mo',
    color: 'purple',
    badge: 'LIMITED — 500 SPOTS',
    description: 'Lock in lifetime access before launch.',
    features: [
      '300 questions per month — for life',
      'Unlimited screenshot analyses',
      '15 Battle Report analyses per month',
      'Full Buddy AI with profile context',
      'Pack Scanner',
      'Daily Briefing + Action Plan',
      'Desert Storm War Room',
      'Lifetime access — pay once, never again',
      'Founding Member badge',
      'Every future feature, included',
    ],
  },
  {
    id: 'alliance',
    name: 'Alliance Premium',
    price: '$19.99',
    period: '/mo',
    questions: 250,
    screenshots: 20,
    battle_reports: 20,
    battle_reports_label: '20/mo',
    color: 'green',
    badge: 'FOR ALLIANCE LEADERS',
    description: 'Give your whole alliance daily AI guidance.',
    features: [
      '250 questions per month',
      '20 screenshot analyses per month',
      '20 Battle Report analyses per month',
      'Full Buddy AI with profile context',
      'Pack Scanner',
      'Daily Briefing + Action Plan',
      'Desert Storm War Room',
      'Built for team play and alliance coordination',
      'Cancel anytime',
    ],
  },
]

const COLOR_MAP: Record<string, Record<string, string>> = {
  sky: {
    border: 'border-sky-800/60',
    badge: 'bg-sky-900/60 text-sky-300 border-sky-800',
    btn: 'bg-sky-600 hover:bg-sky-500 text-white',
    glow: 'shadow-sky-900/20',
    accent: 'text-sky-400',
    statBg: 'bg-sky-900/20 border-sky-800/40',
  },
  amber: {
    border: 'border-amber-700/60',
    badge: 'bg-amber-900/60 text-amber-300 border-amber-800',
    btn: 'bg-amber-500 hover:bg-amber-400 text-black',
    glow: 'shadow-amber-900/20',
    accent: 'text-amber-400',
    statBg: 'bg-amber-900/20 border-amber-800/40',
  },
  purple: {
    border: 'border-purple-800/60',
    badge: 'bg-purple-900/60 text-purple-300 border-purple-800',
    btn: 'bg-purple-600 hover:bg-purple-500 text-white',
    glow: 'shadow-purple-900/20',
    accent: 'text-purple-400',
    statBg: 'bg-purple-900/20 border-purple-800/40',
  },
  green: {
    border: 'border-green-800/60',
    badge: 'bg-green-900/60 text-green-300 border-green-800',
    btn: 'bg-green-600 hover:bg-green-500 text-white',
    glow: 'shadow-green-900/20',
    accent: 'text-green-400',
    statBg: 'bg-green-900/20 border-green-800/40',
  },
}

function getRefCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('lwsb_ref='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [currentTier, setCurrentTier] = useState<string>('free')
  const [foundingSpots] = useState(500)

  useEffect(() => {
    async function loadTier() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', session.user.id)
        .single()
      if (data?.tier) setCurrentTier(data.tier)
    }
    loadTier()
  }, [])

  async function handleUpgrade(tierId: string) {
    setLoading(tierId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }

      const ref_code = getRefCookie()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tier: tierId,
          ...(ref_code ? { ref_code } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      window.location.href = data.url
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ── Header ── */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </button>
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Upgrade</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* ── Hero ── */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Unlock Full Access
          </p>
          <h1 className="text-2xl font-bold text-white mb-3">
            The smarter you play, the smarter it gets.
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Free tier gives you 20 questions a month. Upgrade for deep daily guidance, Battle Report analysis, Pack Scanner, and the full Buddy AI experience.
          </p>
        </div>

        {/* ── Battle Report Analyzer feature callout ── */}
        <div className="mb-6 bg-red-950/30 border border-red-900/50 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-900/50 border border-red-800/50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚔️</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-white">Battle Report Analyzer</h2>
                <span className="text-[10px] font-bold bg-red-900/60 border border-red-800/60 text-red-300 px-2 py-0.5 rounded-full tracking-wider">
                  PRO+
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                Upload your battle report screenshots. Get a full expert breakdown — troop type counter diagnosis, morale cascade analysis, decoration gap, Exclusive Weapon gap, hero performance, and a rematch verdict. Use it on the fights you genuinely don&apos;t understand. No other Last War tool does this.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Type Counter', icon: '🔺' },
                  { label: 'Morale Cascade', icon: '📉' },
                  { label: 'Stat Gap', icon: '📊' },
                  { label: 'EW Analysis', icon: '⚡' },
                  { label: 'Coaching', icon: '🎯' },
                  { label: 'Rematch Verdict', icon: '🔁' },
                ].map(({ label, icon }) => (
                  <div key={label} className="bg-red-950/40 border border-red-900/30 rounded-lg px-2 py-2">
                    <div className="text-base mb-0.5">{icon}</div>
                    <div className="text-[10px] text-red-300 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Desert Storm War Room feature callout ── */}
        <div className="mb-8 bg-amber-950/20 border border-amber-900/40 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-900/30 border border-amber-800/40 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏜️</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-white">Desert Storm War Room</h2>
                <span className="text-[10px] font-bold bg-green-900/50 border border-green-800/50 text-green-300 px-2 py-0.5 rounded-full tracking-wider">
                  FREE — ALL TIERS
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Build your Desert Storm battle plan in seconds. Assign roles — Roamers, East/West flanks, Hospital guards, Silo team. Generate a shareable strategy card with a compass and post it straight to alliance chat. Every card has your alliance name and LastWarSurvivalBuddy.com on it.
              </p>
            </div>
          </div>
        </div>

        {/* ── Founding Member banner ── */}
        <div className="mb-8 bg-purple-950/30 border border-purple-900/50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
          <p className="text-sm text-purple-200">
            <span className="font-bold">Founding Member offer:</span>{' '}
            {foundingSpots} lifetime spots available. 300 questions/month + unlimited screenshots — pay once, never again. Once gone, monthly-only pricing.
          </p>
        </div>

        {/* ── Tier cards ── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map(tier => {
            const c = COLOR_MAP[tier.color]
            const isCurrentTier = currentTier === tier.id
            const isLoading = loading === tier.id
            const isFoundingTier = tier.id === 'founding'

            return (
              <div
                key={tier.id}
                className={`
                  relative border rounded-xl p-5 flex flex-col
                  ${tier.id === 'elite' ? 'ring-1 ring-amber-700/50' : ''}
                  ${c.border}
                  bg-zinc-900/40 shadow-lg ${c.glow}
                `}
              >
                {tier.badge && (
                  <div className={`
                    absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border font-mono
                    ${c.badge}
                  `}>
                    {tier.badge}
                  </div>
                )}

                <div className="mb-4 mt-1">
                  <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wide mb-2">
                    {tier.name}
                  </h2>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-sm text-zinc-500">{tier.period}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  <div className="bg-zinc-800/60 rounded-lg px-1.5 py-2 text-center">
                    <div className="text-sm font-bold text-white">
                      {tier.questions}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono leading-tight">Q/mo</div>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg px-1.5 py-2 text-center">
                    <div className="text-sm font-bold text-white">
                      {isFoundingTier ? '∞' : tier.screenshots}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono leading-tight">📸/mo</div>
                  </div>
                  <div className={`border rounded-lg px-1.5 py-2 text-center ${c.statBg}`}>
                    <div className={`text-sm font-bold ${c.accent}`}>
                      {tier.battle_reports_label}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono leading-tight">⚔️ rpts</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className={`mt-0.5 flex-shrink-0 ${f.includes('War Room') ? 'text-amber-500' : 'text-green-500'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={!!loading || isCurrentTier}
                  className={`
                    w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-150 active:scale-[0.98]
                    ${isCurrentTier
                      ? 'bg-zinc-800 text-zinc-500 cursor-default border border-zinc-700'
                      : `${c.btn} shadow-md`
                    }
                    ${isLoading ? 'opacity-70 cursor-wait' : ''}
                  `}
                >
                  {isCurrentTier
                    ? '✓ Current Plan'
                    : isLoading
                    ? 'Loading...'
                    : tier.id === 'founding'
                    ? 'Claim Lifetime Access'
                    : tier.id === 'alliance'
                    ? 'Upgrade to Alliance'
                    : `Upgrade to ${tier.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* ── Comparison table ── */}
        <div className="mt-10 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="bg-zinc-900/60 px-5 py-4 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white">What&apos;s included</h3>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {[
              { feature: 'Buddy AI Chat',             free: '20/mo',  pro: '100/mo',  elite: '250/mo',  founding: '300/mo' },
              { feature: 'Screenshot Analysis',        free: '—',      pro: '10/mo',   elite: '20/mo',   founding: 'Unlimited' },
              { feature: '⚔️ Battle Report Analyzer', free: '—',      pro: '10/mo',   elite: '20/mo',   founding: '15/mo' },
              { feature: 'Pack Scanner',               free: '—',      pro: '✓',       elite: '✓',       founding: '✓' },
              { feature: 'Daily Briefing',             free: '✓',      pro: '✓',       elite: '✓',       founding: '✓' },
              { feature: 'Daily Action Plan',          free: '✓',      pro: '✓',       elite: '✓',       founding: '✓' },
              { feature: '🏜️ DS War Room',            free: '✓',      pro: '✓',       elite: '✓',       founding: '✓' },
              { feature: 'Profile Context',            free: '✓',      pro: '✓',       elite: '✓',       founding: '✓' },
              { feature: 'New Features',               free: 'Basic',  pro: 'Standard', elite: 'Priority', founding: 'All — forever' },
            ].map(({ feature, free, pro, elite, founding }) => (
              <div key={feature} className="grid grid-cols-5 px-5 py-3 text-xs items-center">
                <span className="text-zinc-300 font-medium col-span-1">{feature}</span>
                <span className="text-zinc-600 text-center">{free}</span>
                <span className="text-sky-400 text-center font-medium">{pro}</span>
                <span className="text-amber-400 text-center font-medium">{elite}</span>
                <span className="text-purple-400 text-center font-medium">{founding}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 px-5 py-2 bg-zinc-900/40 border-t border-zinc-800 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
            <span>Feature</span>
            <span className="text-center">Free</span>
            <span className="text-sky-700 text-center">Pro</span>
            <span className="text-amber-700 text-center">Elite</span>
            <span className="text-purple-700 text-center">Founding</span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-zinc-600">
            Free tier: 20 questions/month, no Battle Reports, no Pack Scanner.{' '}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-zinc-500 hover:text-zinc-300 underline transition-colors"
            >
              Stay on free
            </button>
          </p>
          <p className="text-xs text-zinc-700">
            Battle Reports reset on your billing date, not calendar month. Use them on the fights that matter.
          </p>
          <p className="text-xs text-zinc-700">
            Payments processed securely by Stripe. Cancel subscriptions anytime.
          </p>
          <p className="text-xs text-zinc-700">
            Fan-built tool. Not affiliated with FUNFLY PTE. LTD.
          </p>
        </div>
      </main>
    </div>
  )
}
