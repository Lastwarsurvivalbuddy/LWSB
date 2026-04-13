'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoadingRedirect() {
  const router = useRouter()

  useEffect(() => {
    async function redirect() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        await doRedirect(session.user.id)
      } else {
        // Retry once — session may still be propagating
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            await doRedirect(retrySession.user.id)
          } else {
            router.push('/signin?message=confirmed')
          }
        }, 1500)
      }
    }

    async function doRedirect(userId: string) {
      // Check if upgrade prompt has already been shown (localStorage flag)
      let upgradeShown = false
      try {
        upgradeShown = localStorage.getItem('lwsb_upgrade_shown') === 'true'
      } catch { /* Non-fatal */ }

      if (upgradeShown) {
        router.push('/dashboard')
        return
      }

      // Check if user has an active paid subscription
      const { data } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', userId)
        .single()

      const hasPaidTier = data?.tier && data.tier !== 'free'

      if (hasPaidTier) {
        // Paid subscriber — go straight to dashboard
        router.push('/dashboard')
      } else {
        // First time through — show upgrade page
        router.push('/upgrade')
      }
    }

    redirect()
  }, [router])

  return (
    <div className="min-h-screen bg-[#07080a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#e8a020] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#606878] text-sm font-mono tracking-widest uppercase">
          Activating Commander...
        </p>
      </div>
    </div>
  )
}
