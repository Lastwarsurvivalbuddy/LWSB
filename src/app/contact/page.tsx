'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Category = 'bug' | 'feedback' | 'billing' | 'other'

const CATEGORIES: { value: Category; label: string; icon: string; desc: string }[] = [
  { value: 'bug', label: 'Bug Report', icon: '🐛', desc: 'Something is broken' },
  { value: 'feedback', label: 'Feedback', icon: '💬', desc: 'Suggestions or ideas' },
  { value: 'billing', label: 'Billing Issue', icon: '💳', desc: 'Charges, refunds, upgrades' },
  { value: 'other', label: 'Other', icon: '📡', desc: 'Anything else' },
]

export default function ContactPage() {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [screenshot, setScreenshot] = useState<{ base64: string; name: string } | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/signin')
        return
      }
      setAccessToken(session.access_token)
      setUserEmail(session.user.email ?? '')
      setEmail(session.user.email ?? '')
      setAuthLoading(false)
    }
    init()
  }, [router])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 5MB cap
    if (file.size > 5 * 1024 * 1024) {
      setError('Screenshot must be under 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      setScreenshot({ base64, name: file.name })
      setScreenshotPreview(result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  function removeScreenshot() {
    setScreenshot(null)
    setScreenshotPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit() {
    if (!category) { setError('Pick a category.'); return }
    if (!message.trim()) { setError('Message is required.'); return }
    if (message.trim().length < 10) { setError('Give us a bit more detail.'); return }

    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          category,
          message,
          email,
          screenshot_base64: screenshot?.base64 ?? null,
          screenshot_name: screenshot?.name ?? null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Submission failed. Try again.')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError('Network error. Check your connection and try again.')
      setSubmitting(false)
    }
  }

  // ── Loading ──
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Success ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl"
            style={{ backgroundColor: 'rgba(240,165,0,0.12)', border: '1px solid rgba(240,165,0,0.3)' }}
          >
            ✅
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Transmission Received</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your message is logged. We&apos;ll follow up at{' '}
              <span className="text-amber-400">{email || userEmail}</span> if we need more intel.
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl font-bold text-sm text-black transition-all active:scale-95"
            style={{ backgroundColor: '#f0a500' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header
        className="sticky top-0 z-20 backdrop-blur-sm"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(9,9,11,0.95)' }}
      >
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
            title="Back"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-sm font-bold tracking-wide text-white">Contact Support</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">

        {/* Intro */}
        <div>
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-1">
            HQ Transmission
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Hit a bug? Have feedback? Billing question? Drop it here — submissions go straight to the Commander.
          </p>
        </div>

        {/* Category picker */}
        <div>
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-3">
            Category
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => { setCategory(cat.value); setError(null) }}
                  className="text-left rounded-xl px-3 py-3 transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: selected
                      ? 'rgba(240,165,0,0.10)'
                      : 'rgba(255,255,255,0.03)',
                    border: selected
                      ? '1px solid rgba(240,165,0,0.40)'
                      : '1px solid rgba(255,255,255,0.07)',
                    borderLeft: selected ? '3px solid #f0a500' : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className={`text-xs font-bold ${selected ? 'text-amber-400' : 'text-zinc-300'}`}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-600 pl-6">{cat.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-2">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userEmail || 'commander@example.com'}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onFocus={(e) => (e.currentTarget.style.border = '1px solid rgba(240,165,0,0.4)')}
            onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)')}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setError(null) }}
            placeholder={
              category === 'bug'
                ? 'Describe what happened and what you expected...'
                : category === 'billing'
                ? 'Describe the billing issue in detail...'
                : category === 'feedback'
                ? "What would make Buddy better for you?"
                : "What's on your mind, Commander?"
            }
            rows={5}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none resize-none transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onFocus={(e) => (e.currentTarget.style.border = '1px solid rgba(240,165,0,0.4)')}
            onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)')}
          />
          <p className="text-[10px] text-zinc-700 mt-1.5 text-right font-mono">
            {message.length} chars
          </p>
        </div>

        {/* Screenshot */}
        <div>
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-2">
            Screenshot <span className="text-zinc-700 normal-case tracking-normal font-sans">— optional</span>
          </p>

          {screenshotPreview ? (
            <div
              className="relative rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(240,165,0,0.25)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotPreview}
                alt="Screenshot preview"
                className="w-full max-h-48 object-cover"
              />
              <button
                onClick={removeScreenshot}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" viewBox="0 0 16 16">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div
                className="px-3 py-2"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              >
                <p className="text-[10px] text-zinc-500 font-mono truncate">{screenshot?.name}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl px-4 py-4 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.12)',
              }}
            >
              <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 16 16">
                <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="5.5" cy="6.5" r="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1 11l3.5-3.5 2.5 2.5 2.5-3 4.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs text-zinc-600">Attach a screenshot</span>
              <span className="text-[10px] text-zinc-700 font-mono">max 5MB</span>
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-2.5"
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <span className="text-red-400 text-sm flex-shrink-0">⚠</span>
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#f0a500' }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              Transmitting...
            </span>
          ) : (
            'Send to HQ →'
          )}
        </button>

        {/* Footer note */}
        <p className="text-center text-[10px] text-zinc-700 font-mono">
          All submissions are read by the Commander personally.
        </p>
      </main>
    </div>
  )
}
