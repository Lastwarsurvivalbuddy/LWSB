'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const TIER_NAMES: Record<string, string> = {
  pro: 'Buddy Pro',
  elite: 'Buddy Elite',
  founding: 'Founding Member',
}

const TIER_MESSAGES: Record<string, string> = {
  pro: 'You now have 30 questions and 10 screenshot analyses per day.',
  elite: 'You now have 100 questions and 20 screenshot analyses per day.',
  founding: 'Lifetime access locked in. You\'re in the founding 500.',
}

export default function UpgradeSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'pro'
  const [countdown, setCountdown] = useState(8)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-900/40 border border-green-700/60 flex items-center justify-center text-4xl animate-pulse">
            🎖️
          </div>
        </div>

        {/* Heading */}
        <div>
          <p className="text-xs font-mono text-green-500 uppercase tracking-widest mb-2">
            Payment Confirmed
          </p>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to {TIER_NAMES[tier] || 'Buddy Pro'}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {TIER_MESSAGES[tier] || 'Your account has been upgraded.'}
          </p>
        </div>

        {/* Founding Member special message */}
        {tier === 'founding' && (
          <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl px-5 py-4">
            <p className="text-sm text-purple-200 font-medium">
              You're one of the founding 500.
            </p>
            <p className="text-xs text-purple-400 mt-1">
              This app exists because you believed in it early. Thank you, Commander.
            </p>
          </div>
        )}

        {/* Redirect notice */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            Back to Dashboard
          </button>
          <p className="text-xs text-zinc-600 font-mono">
            Redirecting in {countdown}s...
          </p>
        </div>

      </div>
    </div>
  )
}
