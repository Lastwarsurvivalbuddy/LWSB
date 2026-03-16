'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

export default function ContactPage() {
  const router = useRouter()
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitState('sending')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xjgaapnb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSubmitState('success')
      } else {
        setSubmitState('error')
      }
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Nav ── */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-sm flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1L2 5v6l6 4 6-4V5L8 1z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wide text-white">Contact</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-2xl font-bold text-white mb-2">Talk to the Builder</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Built by an active Last War player — 500+ days, Server 1032. I read every message.
          </p>
        </div>

        {/* Reason pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Bug / Wrong Data', 'Feature Request', 'Partnership', 'Just Saying Hi'].map(r => (
            <span key={r} className="text-[11px] font-mono text-zinc-500 border border-zinc-800 rounded-full px-3 py-1">
              {r}
            </span>
          ))}
        </div>

        {/* Form */}
        {submitState === 'success' ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 16 16">
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-bold text-white">Message received.</p>
            <p className="text-xs text-zinc-500">I&apos;ll get back to you — usually within 24 hours.</p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-xs text-amber-600 hover:text-amber-400 transition-colors underline underline-offset-2"
            >
              Back to dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest" htmlFor="name">
                Name / IGN
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name or in-game name"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest" htmlFor="reason">
                Reason
              </label>
              <select
                id="reason"
                name="reason"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-600 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors appearance-none"
              >
                <option value="">Select a reason...</option>
                <option value="bug">Bug / Wrong Game Data</option>
                <option value="feature">Feature Request</option>
                <option value="partner">Partnership / Data Integration</option>
                <option value="press">Press / Content Creator</option>
                <option value="community">Alliance / Community</option>
                <option value="other">Just Saying Hi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="What's on your mind?"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-600 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {submitState === 'error' && (
              <p className="text-xs text-red-400">Something went wrong. Try again or email directly.</p>
            )}

            <button
              type="submit"
              disabled={submitState === 'sending'}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm px-6 py-3 rounded-xl transition-colors active:scale-95"
            >
              {submitState === 'sending' ? 'Sending...' : 'Send Message →'}
            </button>

          </form>
        )}
      </main>
    </div>
  )
}
