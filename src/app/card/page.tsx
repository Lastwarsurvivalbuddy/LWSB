'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Profile {
  commander_name: string
  server_number?: number
  computed_server_day?: number
  server_day?: number
  hq_level?: number
  troop_tier?: string
  troop_type?: string
  playstyle?: string
  hero_power?: number
  total_power?: number
  server_rank?: string
  subscription_tier?: string
}

function formatPower(val?: number): string {
  if (!val) return '—'
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
  return val.toString()
}

function formatTroopTier(tier?: string): string {
  if (!tier) return '—'
  const map: Record<string, string> = {
    below_t8:     'Below T8',
    t8:           'T8',
    t9:           'T9',
    t10_working:  'T10 ↑',
    t10_unlocked: 'T10',
    t11:          'T11',
    t12:          'T12',
  }
  return map[tier] ?? tier.toUpperCase()
}

function formatRank(rank?: string): string {
  if (!rank) return '—'
  const map: Record<string, string> = {
    top_5:         'Top 5',
    top_10:        'Top 10',
    top_20:        'Top 20',
    top_50:        'Top 50',
    top_100:       'Top 100',
    still_building: 'Building',
  }
  return map[rank] ?? rank
}

function formatPlaystyle(p?: string): string {
  if (!p) return '—'
  const map: Record<string, string> = {
    fighter:   '⚔️ PVP',
    developer: '🎯 PVE',
    commander: '⚖️ CMD',
    scout:     '🗺️ Scout',
  }
  return map[p] ?? p
}

function formatTroopType(t?: string): string {
  if (!t) return '—'
  const map: Record<string, string> = {
    aircraft: '✈️ Aircraft',
    tank:     '🛡️ Tank',
    missile:  '🚀 Missile',
    mixed:    '⚖️ Mixed',
  }
  return map[t] ?? t
}

// ─── The Card (fixed 1200×630 — og:image standard, also works as square crop) ───
function CommanderCard({ profile, cardRef }: { profile: Profile; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const serverDay = profile.computed_server_day ?? profile.server_day

  return (
    <div
      ref={cardRef}
      style={{
        width: 600,
        height: 315,
        background: '#080a0e',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Rajdhani", "Oswald", sans-serif',
        flexShrink: 0,
      }}
    >
      {/* Scanline texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Gold corner accent — top left */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 120, height: 3,
        background: 'linear-gradient(90deg, #c9a84c, transparent)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 3, height: 120,
        background: 'linear-gradient(180deg, #c9a84c, transparent)',
        zIndex: 2,
      }} />

      {/* Gold corner accent — bottom right */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 120, height: 3,
        background: 'linear-gradient(270deg, #c9a84c, transparent)',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 3, height: 120,
        background: 'linear-gradient(0deg, #c9a84c, transparent)',
        zIndex: 2,
      }} />

      {/* Diagonal gold slash — decorative background */}
      <div style={{
        position: 'absolute',
        top: -40, right: 80,
        width: 2, height: 420,
        background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.08), transparent)',
        transform: 'rotate(15deg)',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: -40, right: 130,
        width: 1, height: 420,
        background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.05), transparent)',
        transform: 'rotate(15deg)',
        zIndex: 1,
      }} />

      {/* Radial glow — top left behind name */}
      <div style={{
        position: 'absolute', top: -60, left: -60,
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, padding: '28px 32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Top row — rank badge + LWSB */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 4, padding: '4px 10px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Server {profile.server_number ?? '—'} · Day {serverDay ?? '—'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 18, height: 18, background: '#c9a84c', borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" fill="#080a0e" viewBox="0 0 16 16">
                <path d="M8 1L2 5v6l6 4 6-4V5L8 1z" />
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#7a6030', letterSpacing: '0.2em' }}>
              LASTWARSURVIVALBUDDY.COM
            </span>
          </div>
        </div>

        {/* Middle — Commander name + title */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6030', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>
            Commander
          </div>
          <div style={{
            fontSize: 52, fontWeight: 700, color: '#e8c96a',
            letterSpacing: '0.02em', lineHeight: 1,
            textShadow: '0 0 40px rgba(201,168,76,0.3)',
          }}>
            {profile.commander_name || 'COMMANDER'}
          </div>
        </div>

        {/* Bottom — stat grid */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
          {[
            { label: 'HQ',         value: profile.hq_level ? `HQ ${profile.hq_level}` : '—' },
            { label: 'Troops',     value: formatTroopTier(profile.troop_tier) },
            { label: 'Type',       value: formatTroopType(profile.troop_type) },
            { label: 'Hero Power', value: formatPower(profile.hero_power) },
            { label: 'Rank',       value: formatRank(profile.server_rank) },
            { label: 'Style',      value: formatPlaystyle(profile.playstyle) },
          ].map(({ label, value }) => (
            <div key={label} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: 6, padding: '8px 10px',
            }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#7a6030', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e8e6e0', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom border line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
        zIndex: 4,
      }} />
    </div>
  )
}

// ─── PAGE ───
export default function CardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }

      const { data } = await supabase
        .from('commander_profile')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) setProfile(data)
      setLoading(false)
    }
    load()
  }, [router])

  async function downloadCard() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080a0e',
        useCORS: true,
        logging: false,
      } as any)
      const link = document.createElement('a')
      link.download = `commander-${profile?.commander_name || 'card'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed', err)
    } finally {
      setDownloading(false)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText('https://lastwarsurvivalbuddy.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Profile not found.
      </div>
    )
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');`}</style>

      <div className="min-h-screen bg-zinc-950 text-white">

        {/* Header */}
        <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dashboard
            </button>
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Commander Card</span>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-8">

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              Your Commander Card
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Share it in Discord, Reddit, or anywhere you rep your server.
            </p>
          </div>

          {/* Card preview — centered, scaled to fit mobile */}
          <div className="w-full flex justify-center">
            <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }} className="max-w-full overflow-x-auto">
              <CommanderCard profile={profile} cardRef={cardRef} />
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-zinc-600 text-center max-w-sm leading-relaxed">
            Stats are self-reported — keep your profile current for accuracy.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={downloadCard}
              disabled={downloading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-black transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Rendering...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download Card
                </>
              )}
            </button>

            <button
              onClick={copyLink}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all active:scale-[0.98]"
            >
              {copied ? (
                <><span className="text-green-400">✓</span> Link copied!</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path d="M6 4H4a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-2M10 2h4v4M14 2L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copy LWSB Link
                </>
              )}
            </button>
          </div>

          {/* Update profile nudge */}
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 4v4M8 11v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Card reflects your current profile.{' '}
            <button onClick={() => router.push('/profile/edit')} className="text-amber-600 hover:text-amber-400 underline transition-colors">
              Update stats
            </button>
          </div>

        </main>
      </div>
    </>
  )
}
