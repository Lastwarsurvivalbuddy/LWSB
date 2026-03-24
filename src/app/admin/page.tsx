'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface StatsData {
  totalUsers: number
  signupsThisWeek: number
  mrr: number
  foundingLtm: number
  todayDau: number
  apiCostThisMonth: number
  tierCounts: Record<string, number>
  signupSeries: { date: string; count: number }[]
  dauSeries: { date: string; count: number }[]
  apiUsage: { questions: number; screenshots: number; battleReports: number }
  submissions: Submission[]
  modQueue: ModItem[]
}

interface Submission {
  id: string
  user_id: string
  server_number: number
  category: string
  claim: string
  scope: string
  status: string
  screenshot_path: string | null
  created_at: string
}

interface ModItem {
  id: string
  created_at: string
  submission_id?: string
  content: string
  status?: string
}

interface Affiliate {
  id: string
  user_id: string
  name: string
  ign: string
  server: string
  promo_method: string
  status: string
  payout_rate: number
  referral_code: string
  notes: string | null
  created_at: string
  approved_at: string | null
  rejected_at: string | null
  affiliate_conversions: { count: number }[]
}

export default function MissionControlPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [statsError, setStatsError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'affiliates'>('overview')
  const [token, setToken] = useState<string | null>(null)

  // Submissions state
  const [screenshotUrls, setScreenshotUrls] = useState<Record<string, string>>({})
  const [acting, setActing] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editClaim, setEditClaim] = useState('')
  const [editScope, setEditScope] = useState('')

  // Affiliates state
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [affiliatesLoading, setAffiliatesLoading] = useState(false)
  const [affiliateActing, setAffiliateActing] = useState<string | null>(null)
  const [payoutInputs, setPayoutInputs] = useState<Record<string, string>>({})
  const [notesInputs, setNotesInputs] = useState<Record<string, string>>({})
  const [affiliateFilter, setAffiliateFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/signin'); return }
      setToken(session.access_token)
      setAuthorized(true)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const fetchStats = useCallback(async (accessToken: string) => {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.status === 403) { router.replace('/dashboard'); return }
    if (!res.ok) { setStatsError('Failed to load stats.'); return }
    const data = await res.json()
    setStats(data)

    const urls: Record<string, string> = {}
    for (const sub of (data.submissions ?? []) as Submission[]) {
      if (sub.screenshot_path) {
        const { data: urlData } = await supabase.storage
          .from('submission-screenshots')
          .createSignedUrl(sub.screenshot_path, 3600)
        if (urlData?.signedUrl) urls[sub.id] = urlData.signedUrl
      }
    }
    setScreenshotUrls(urls)
  }, [router])

  const fetchAffiliates = useCallback(async (accessToken: string) => {
    setAffiliatesLoading(true)
    const res = await fetch('/api/admin/affiliates', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) {
      const data = await res.json()
      setAffiliates(data.affiliates ?? [])
      // Pre-fill payout inputs with current rates
      const inputs: Record<string, string> = {}
      const notes: Record<string, string> = {}
      for (const a of (data.affiliates ?? []) as Affiliate[]) {
        inputs[a.id] = String(Math.round(a.payout_rate * 100))
        notes[a.id] = a.notes ?? ''
      }
      setPayoutInputs(inputs)
      setNotesInputs(notes)
    }
    setAffiliatesLoading(false)
  }, [])

  useEffect(() => {
    if (authorized && token) fetchStats(token)
  }, [authorized, token, fetchStats])

  useEffect(() => {
    if (authorized && token && activeTab === 'affiliates') {
      fetchAffiliates(token)
    }
  }, [authorized, token, activeTab, fetchAffiliates])

  async function handleAction(id: string, action: 'approved' | 'rejected') {
    if (!token) return
    setActing(id)
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: action }),
    })
    setStats(prev => prev ? {
      ...prev,
      submissions: prev.submissions.filter(s => s.id !== id)
    } : prev)
    setActing(null)
  }

  async function handleSaveEdit(id: string) {
    if (!token) return
    setActing(id)
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, claim: editClaim, scope: editScope }),
    })
    setStats(prev => prev ? {
      ...prev,
      submissions: prev.submissions.map(s =>
        s.id === id ? { ...s, claim: editClaim, scope: editScope } : s
      )
    } : prev)
    setEditingId(null)
    setActing(null)
  }

  function startEdit(sub: Submission) {
    setEditingId(sub.id)
    setEditClaim(sub.claim)
    setEditScope(sub.scope)
  }

  async function handleAffiliateAction(
    affiliateId: string,
    action: 'approve' | 'reject'
  ) {
    if (!token) return
    setAffiliateActing(affiliateId)
    const payoutRaw = payoutInputs[affiliateId]
    const payout_rate = payoutRaw ? parseFloat(payoutRaw) / 100 : 0.15
    const notes = notesInputs[affiliateId] ?? null

    const res = await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ affiliate_id: affiliateId, action, payout_rate, notes }),
    })

    if (res.ok) {
      const data = await res.json()
      setAffiliates(prev =>
        prev.map(a => a.id === affiliateId ? { ...a, ...data.affiliate } : a)
      )
    }
    setAffiliateActing(null)
  }

  const enterWarfighter = () => {
    document.cookie = 'mc_warfighter=1; path=/; max-age=3600'
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-mono">Loading Mission Control...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  const pending = (stats?.submissions ?? []) as Submission[]
  const pendingAffiliates = affiliates.filter(a => a.status === 'pending').length

  const filteredAffiliates = affiliateFilter === 'all'
    ? affiliates
    : affiliates.filter(a => a.status === affiliateFilter)

  const tierConfig = [
    { key: 'free', label: 'Free', color: '#71717a', mrr: 0 },
    { key: 'pro', label: 'Buddy Pro', color: '#38bdf8', mrr: 9.99 },
    { key: 'elite', label: 'Buddy Elite', color: '#f59e0b', mrr: 19.99 },
    { key: 'alliance', label: 'Alliance Premium', color: '#22c55e', mrr: 19.99 },
    { key: 'founding', label: 'Founding Member', color: '#a78bfa', mrr: 0 },
  ]

  const maxTierCount = Math.max(...tierConfig.map(t => stats?.tierCounts?.[t.key] || 0), 1)
  const maxDau = Math.max(...(stats?.dauSeries.map(d => d.count) || [1]), 1)
  const maxSignup = Math.max(...(stats?.signupSeries.map(s => s.count) || [1]), 1)

  const statusColor = (status: string) => {
    if (status === 'approved') return { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' }
    if (status === 'rejected') return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' }
    return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Top nav ── */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-amber-500 rounded-sm flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1L2 5v6l6 4 6-4V5L8 1z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wide">Mission Control</span>
            <span className="text-zinc-600 text-xs font-mono">· Boyd</span>
          </div>
          <button
            onClick={enterWarfighter}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          >
            Warfighter mode →
          </button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 flex gap-0">
          {(['overview', 'submissions', 'affiliates'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-mono transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-amber-400 border-amber-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'submissions' && `Submissions (${pending.length})`}
              {tab === 'affiliates' && `Affiliates${pendingAffiliates > 0 ? ` (${pendingAffiliates})` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {statsError && (
              <p className="text-red-400 text-sm mb-4">{statsError}</p>
            )}

            {!stats && !statsError && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {stats && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
                  {[
                    { label: 'Total users', value: stats.totalUsers.toLocaleString(), delta: `+${stats.signupsThisWeek} this week`, up: true },
                    { label: 'MRR', value: `$${stats.mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, delta: `+$${stats.foundingLtm} LTM`, up: true },
                    { label: 'DAU today', value: stats.todayDau.toLocaleString(), delta: `${stats.totalUsers ? Math.round(stats.todayDau / stats.totalUsers * 100) : 0}% of base`, up: true },
                    { label: 'API spend (mo)', value: `$${stats.apiCostThisMonth.toFixed(2)}`, delta: 'est. from usage', up: false },
                  ].map(card => (
                    <div key={card.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                      <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wide mb-2">{card.label}</p>
                      <p className="text-2xl font-bold text-white">{card.value}</p>
                      <p className={`text-[11px] mt-1 ${card.up ? 'text-green-400' : 'text-zinc-500'}`}>{card.delta}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-zinc-300 mb-1">Signups — last 30 days</p>
                  <p className="text-[11px] text-zinc-600 mb-3">Daily new users</p>
                  <div className="flex items-end gap-0.5 h-16">
                    {stats.signupSeries.map((s, i) => (
                      <div
                        key={i}
                        title={`${s.date}: ${s.count}`}
                        className="flex-1 bg-amber-500/60 hover:bg-amber-500 rounded-sm transition-colors"
                        style={{ height: `${Math.max(2, Math.round((s.count / maxSignup) * 64))}px` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-zinc-700">30 days ago</span>
                    <span className="text-[10px] text-zinc-700">today</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-zinc-300 mb-1">DAU — last 7 days</p>
                    <p className="text-[11px] text-zinc-600 mb-3">Unique active users</p>
                    <div className="flex items-end gap-1.5 h-16">
                      {(stats.dauSeries.length > 0 ? stats.dauSeries : Array(7).fill({ date: '', count: 0 })).map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            title={`${d.date}: ${d.count}`}
                            className="w-full bg-sky-500/60 hover:bg-sky-500 rounded-sm transition-colors"
                            style={{ height: `${Math.max(2, Math.round((d.count / maxDau) * 52))}px` }}
                          />
                          <span className="text-[9px] text-zinc-700">
                            {d.date ? new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-zinc-300 mb-1">Revenue by tier</p>
                    <p className="text-[11px] text-zinc-600 mb-3">Subscribers + MRR</p>
                    {tierConfig.map(tier => {
                      const count = stats.tierCounts?.[tier.key] || 0
                      const rev = tier.key === 'founding' ? `$${count * 99} LTM` : `$${(count * tier.mrr).toFixed(0)}/mo`
                      const barPct = Math.round((count / maxTierCount) * 100)
                      return (
                        <div key={tier.key} className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-zinc-400 w-28 truncate">{tier.label}</span>
                          <span className="text-[11px] text-zinc-600 w-5 text-right">{count}</span>
                          <div className="flex-1 h-1 bg-zinc-800 rounded-full">
                            <div className="h-1 rounded-full" style={{ width: `${barPct}%`, background: tier.color }} />
                          </div>
                          <span className="text-[11px] font-bold text-zinc-300 w-16 text-right">{rev}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs font-bold text-zinc-300 mb-1">API usage — this month</p>
                  <p className="text-[11px] text-zinc-600 mb-4">Calls by route + estimated cost</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Buddy AI', calls: stats.apiUsage.questions, cost: (stats.apiUsage.questions * 0.008).toFixed(2) },
                      { label: 'Battle Report', calls: stats.apiUsage.battleReports, cost: (stats.apiUsage.battleReports * 0.012).toFixed(2) },
                      { label: 'Screenshots', calls: stats.apiUsage.screenshots, cost: (stats.apiUsage.screenshots * 0.015).toFixed(2) },
                    ].map(item => (
                      <div key={item.label} className="bg-zinc-950/50 rounded-lg p-3">
                        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-lg font-bold text-white">{item.calls.toLocaleString()}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">est. ${item.cost}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === 'submissions' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-amber-400">🧠 Submission Queue</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{pending.length} pending review</p>
              </div>
            </div>

            {pending.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-600 text-sm">Queue is clear. Buddy is up to date. ✓</p>
              </div>
            )}

            {pending.map(sub => (
              <div key={sub.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-4">
                <div className="flex gap-2 mb-4 flex-wrap items-center">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    {sub.category}
                  </span>
                  {editingId === sub.id ? (
                    <button
                      onClick={() => setEditScope(editScope === 'global' ? 'server_specific' : 'global')}
                      className="rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider border cursor-pointer transition-colors"
                      style={{
                        background: editScope === 'global' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                        color: editScope === 'global' ? '#3b82f6' : '#22c55e',
                        borderColor: editScope === 'global' ? 'rgba(59,130,246,0.3)' : 'rgba(34,197,94,0.3)',
                      }}
                    >
                      {editScope === 'global' ? '🌐 Global' : `🎯 Server ${sub.server_number}`} ⇄
                    </button>
                  ) : (
                    <span
                      className="rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider border"
                      style={{
                        background: sub.scope === 'global' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                        color: sub.scope === 'global' ? '#3b82f6' : '#22c55e',
                        borderColor: sub.scope === 'global' ? 'rgba(59,130,246,0.3)' : 'rgba(34,197,94,0.3)',
                      }}
                    >
                      {sub.scope === 'global' ? '🌐 Global' : `🎯 Server ${sub.server_number}`}
                    </span>
                  )}
                  <span className="ml-auto text-[11px] text-zinc-600 font-mono">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                </div>

                {editingId === sub.id ? (
                  <textarea
                    value={editClaim}
                    onChange={e => setEditClaim(e.target.value)}
                    className="w-full min-h-20 bg-zinc-950 border border-amber-500/40 rounded-xl text-white text-sm p-3 mb-4 resize-y focus:outline-none focus:border-amber-500/80"
                  />
                ) : (
                  <p className="text-white text-sm leading-relaxed mb-4">{sub.claim}</p>
                )}

                {screenshotUrls[sub.id] && (
                  <img
                    src={screenshotUrls[sub.id]}
                    alt="Submission screenshot"
                    className="max-w-full max-h-48 rounded-xl border border-zinc-800 mb-4 block"
                  />
                )}

                {editingId === sub.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(sub.id)}
                      disabled={acting === sub.id}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      {acting === sub.id ? '…' : '💾 Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white font-bold text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(sub.id, 'approved')}
                      disabled={acting === sub.id}
                      className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      {acting === sub.id ? '…' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => startEdit(sub)}
                      className="px-5 py-2.5 rounded-xl border border-amber-500/40 text-amber-400 hover:border-amber-500 font-bold text-sm transition-colors"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleAction(sub.id, 'rejected')}
                      disabled={acting === sub.id}
                      className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      {acting === sub.id ? '…' : '✕ Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── AFFILIATES TAB ── */}
        {activeTab === 'affiliates' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-amber-400">🤝 Affiliate Applications</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{affiliates.length} total · {pendingAffiliates} pending</p>
              </div>
              <button
                onClick={() => token && fetchAffiliates(token)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAffiliateFilter(f)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    affiliateFilter === f
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f} {f !== 'all' && `(${affiliates.filter(a => a.status === f).length})`}
                </button>
              ))}
            </div>

            {affiliatesLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!affiliatesLoading && filteredAffiliates.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-600 text-sm">No {affiliateFilter === 'all' ? '' : affiliateFilter} affiliates.</p>
              </div>
            )}

            {!affiliatesLoading && filteredAffiliates.map(aff => {
              const sc = statusColor(aff.status)
              const convCount = aff.affiliate_conversions?.[0]?.count ?? 0
              return (
                <div key={aff.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-4">

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold text-sm">{aff.name}</span>
                        <span className="text-zinc-500 text-xs">·</span>
                        <span className="text-zinc-400 text-xs font-mono">{aff.ign}</span>
                        <span className="text-zinc-500 text-xs">·</span>
                        <span className="text-zinc-400 text-xs">S{aff.server}</span>
                      </div>
                      <div className="text-[11px] text-zinc-600 font-mono">
                        Applied {new Date(aff.created_at).toLocaleDateString()} · {convCount} conversions
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                      style={{ background: sc.bg, borderColor: sc.border, color: sc.text }}
                    >
                      {aff.status}
                    </span>
                  </div>

                  {/* Promo method */}
                  <div className="bg-zinc-950/60 rounded-xl p-3 mb-4">
                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-1">How they'll promote</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{aff.promo_method}</p>
                  </div>

                  {/* Referral code (approved) */}
                  {aff.status === 'approved' && (
                    <div className="flex items-center gap-3 mb-4 bg-zinc-950/40 rounded-xl p-3">
                      <div>
                        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-0.5">Referral Code</p>
                        <p className="text-sm font-mono text-amber-400">{aff.referral_code}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-0.5">Payout Rate</p>
                        <p className="text-sm font-bold text-green-400">{Math.round(aff.payout_rate * 100)}%</p>
                      </div>
                    </div>
                  )}

                  {/* Action controls — only show for pending */}
                  {aff.status === 'pending' && (
                    <div className="border-t border-zinc-800 pt-4 mt-2">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide block mb-1.5">
                            Payout Rate (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={payoutInputs[aff.id] ?? '15'}
                            onChange={e => setPayoutInputs(prev => ({ ...prev, [aff.id]: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-amber-500/60"
                          />
                          <p className="text-[10px] text-zinc-600 mt-1">10–15 standard · 20 active · 25 partner</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide block mb-1.5">
                            Internal Notes
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. R5 on S1032, YouTube..."
                            value={notesInputs[aff.id] ?? ''}
                            onChange={e => setNotesInputs(prev => ({ ...prev, [aff.id]: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/60"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAffiliateAction(aff.id, 'approve')}
                          disabled={affiliateActing === aff.id}
                          className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {affiliateActing === aff.id ? '…' : `✓ Approve @ ${payoutInputs[aff.id] ?? 15}%`}
                        </button>
                        <button
                          onClick={() => handleAffiliateAction(aff.id, 'reject')}
                          disabled={affiliateActing === aff.id}
                          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {affiliateActing === aff.id ? '…' : '✕ Reject'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

      </main>
    </div>
  )
}
