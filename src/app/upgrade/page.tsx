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
    questions: 30,
    screenshots: 10,
    color: 'sky',
    badge: null,
    description: 'For active players who want daily guidance.',
    features: [
      '30 questions per day',
      '10 screenshot analyses per day',
      'Full Buddy AI with profile context',
      'Daily action plan',
      'Cancel anytime',
    ],
  },
  {
    id: 'elite',
    name: 'Buddy Elite',
    price: '$19.99',
    period: '/mo',
    questions: 100,
    screenshots: 20,
    color: 'amber',
    badge: 'MOST POPULAR',
    description: 'For serious commanders who play to win.',
    features: [
      '100 questions per day',
      '20 screenshot analyses per day',
      'Full Buddy AI with profile context',
      'Daily action plan',
      'Priority access to new features',
      'Cancel anytime',
    ],
  },
  {
    id: 'founding',
    name: 'Founding Member',
    price: '$99',
    period: ' lifetime',
    questions: 20,
    screenshots: 5,
    color: 'purple',
    badge: 'LIMITED — 500 SPOTS',
    description: 'Lock in lifetime access before launch.',
    features: [
      '20 questions per day',
      '5 screenshot analyses per day',
      'Full Buddy AI with profile context',
      'Daily action plan',
      'Lifetime access — pay once, never again',
      'Founding Member badge',
      'Lock in before price increases',
    ],
  },
  {
    id: 'alliance',
    name: 'Alliance Premium',
    price: '$19.99',
    period: '/mo',
    questions: 100,
    screenshots: 20,
    color: 'green',
    badge: 'FOR ALLIANCE LEADERS',
    description: 'Give your whole alliance daily AI guidance.',
    features: [
      '100 questions per day',
      '20 screenshot analyses per day',
      'Full Buddy AI with profile context',
      'Daily action plan',
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
  },
  amber: {
    border: 'border-amber-700/60',
    badge: 'bg-amber-900/60 text-amber-300 border-amber-800',
    btn: 'bg-amber-500 hover:bg-amber-400 text-black',
    glow: 'shadow-amber-900/20',
  },
  purple: {
    border: 'border-purple-800/60',
    badge: 'bg-purple-900/60 text-purple-300 border-purple-800',
    btn: 'bg-purple-600 hover:bg-purple-500 text-white',
    glow: 'shadow-purple-900/20',
  },
  green: {
    border: 'border-green-800/60',
    badge: 'bg-green-900/60 text-green-300 border-green-800',
    btn: 'bg-green-600 hover:bg-green-500 text-white',
    glow: 'shadow-green-900/20',
  },
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

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ tier: tierId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')

      window.location.href = data.url
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
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
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Unlock Full Access
          </p>
          <h1 className="text-2xl font-bold text-white mb-3">
            The smarter you play, the smarter it gets.
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Free tier gives you 5 questions a day. Upgrade to get deep daily guidance,
            screenshot analysis, and the full Buddy AI experience.
          </p>
        </div>

        <div className="mb-8 bg-purple-950/30 border border-purple-900/50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0" />
          <p className="text-sm text-purple-200">
            <span className="font-bold">Founding Member offer:</span> {foundingSpots} lifetime spots available. Once gone, monthly-only pricing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map(tier => {
            const c = COLOR_MAP[tier.color]
            const isCurrentTier = currentTier === tier.id
            const isLoading = loading === tier.id

            return (
              <div
                key={tier.id}
                className={`
                  relative border rounded-xl p-5 flex flex-col
                  ${tier.id === 'elite' ? 'ring-1 ring-amber-700/50' : ''}
                  ${c.border} bg-zinc-900/40 shadow-lg ${c.glow}
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

                <div className="flex gap-3 mb-4">
                  <div className="bg-zinc-800/60 rounded-lg px-3 py-2 flex-1 text-center">
                    <div className="text-base font-bold text-white">{tier.questions}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Q/day</div>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg px-3 py-2 flex-1 text-center">
                    <div className="text-base font-bold text-white">{tier.screenshots}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">📸/day</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
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
                      : `${c.btn} shadow-md`}
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

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            Free tier: 5 questions/day, no screenshots.{' '}
            <button onClick={() => router.push('/dashboard')} className="text-zinc-500 hover:text-zinc-300 underline transition-colors">
              Stay on free
            </button>
          </p>
          <p className="text-xs text-zinc-700 mt-2">
            Payments processed securely by Stripe. Cancel subscriptions anytime.
          </p>
        </div>
      </main>
    </div>
  )
}
