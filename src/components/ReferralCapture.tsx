'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Drop this component into your root layout or splash page.
// It silently captures ?ref=CODE from any URL and sets a 30-day cookie.
// No render output — purely a side-effect component.

export default function ReferralCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return

    // Validate format: letters, numbers, hyphens only
    if (!/^[a-zA-Z0-9-_]{3,32}$/.test(ref)) return

    // Set cookie for 30 days — don't overwrite if already set
    const existing = document.cookie
      .split('; ')
      .find(row => row.startsWith('lwsb_ref='))

    if (!existing) {
      const expires = new Date()
      expires.setDate(expires.getDate() + 30)
      document.cookie = `lwsb_ref=${encodeURIComponent(ref)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    }
  }, [searchParams])

  return null
}

// ── UTILITY: read ref cookie on client ──────────────────────
export function getRefCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('lwsb_ref='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}
