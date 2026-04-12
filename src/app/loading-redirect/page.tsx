'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoadingRedirect() {
  const router = useRouter()

  useEffect(() => {
    async function redirect() {
      // Wait for session to be established
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        // Retry once after a short delay — session may still be propagating
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            router.push('/dashboard')
          } else {
            router.push('/signin?message=confirmed')
          }
        }, 1500)
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
