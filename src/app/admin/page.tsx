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
  submitter_ign: string
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
  payout_method: string | null
  payout_account: string | null
  payout_country: string | null
  created_at: string
  approved_at: string | null
  rejected_at: string | null
  affiliate_conversions: { count: number }[]
}

interface AffiliatePayoutData {
  affiliateId: string
  name: string
  payout_rate: number
  totalEarned: number
  totalPaid: number
  unpaid: number
  lastPayout: { amount_paid: number; period_end: string; note: string | null; created_at: string } | null
  payouts: { id: string; amount_paid: number; period_end: string; note: string | null; created_at: string }[]
}

interface UserRow {
  id: string
  email: string
  ign: string
  server: string | number
  hq: string | number
  tier: string
  banned: boolean
  flagged: boolean
  joined: string
  lastActive: string | null
  totalQuestions: number
  lifetimeRevenue: number
  referredBy: string | null
}

interface NewsItem {
  id: string
  created_at: string
  badge: string
  message: string
  link: string | null
  active: boolean
}

interface ContactSubmission {
  id: string
  user_id: string | null
  email: string | null
  category: string
  message: string
  screenshot_base64: string | null
  screenshot_name: string | null
  status: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

const BADGE_OPTIONS = ['KB UPDATE', 'NEW', 'FIXED', 'EVENT']

const PAYOUT_METHOD_LABELS: Record<string, string> = {
  paypal: 'PayPal',
  wise: 'Wise',
  venmo: 'Venmo',
  cashapp: 'Cash App',
  other: 'Other',
}

const CONTACT_STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'] as const
type ContactStatus = typeof CONTACT_STATUS_OPTIONS[number]

const contactStatusStyle = (status: string) => {
  if (status === 'open')        return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
  if (status === 'in_progress') return 'bg-sky-500/10 border-sky-500/30 text-sky-400'
  if (status === 'resolved')    return 'bg-green-500/10 border-green-500/30 text-green-400'
  if (status === 'closed')      return 'bg-zinc-700/30 border-zinc-600/40 text-zinc-500'
  return 'bg-zinc-800 border-zinc-700 text-zinc-400'
}

const contactCategoryStyle = (category: string) => {
  if (category === 'bug')      return 'bg-red-500/10 border-red-500/30 text-red-400'
  if (category === 'billing')  return 'bg-violet-500/10 border-violet-500/30 text-violet-400'
  if (category === 'feedback') return 'bg-sky-500/10 border-sky-500/30 text-sky-400'
  return 'bg-zinc-700/30 border-zinc-600/40 text-zinc-400'
}

const categoryLabel: Record<string, string> = {
  bug: '🐛 Bug',
  feedback: '💬 Feedback',
  billing: '💳 Billing',
  other: '📡 Other',
}

export default function MissionControlPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [statsError, setStatsError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'affiliates' | 'users' | 'news' | 'contact'>('overview')
  const [token, setToken] = useState<string | null>(null)

  const [screenshotUrls, setScreenshotUrls] = useState<Record<string, string>>({})
  const [acting, setActing] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editClaim, setEditClaim] = useState('')
  const [editScope, setEditScope] = useState('')

  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [affiliatesLoading, setAffiliatesLoading] = useState(false)
  const [affiliateActing, setAffiliateActing] = useState<string | null>(null)
  const [payoutInputs, setPayoutInputs] = useState<Record<string, string>>({})
  const [notesInputs, setNotesInputs] = useState<Record<string, string>>({})
  const [affiliateFilter, setAffiliateFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [payoutPanelId, setPayoutPanelId] = useState<string | null>(null)
  const [payoutData, setPayoutData] = useState<Record<string, AffiliatePayoutData>>({})
  const [payoutDataLoading, setPayoutDataLoading] = useState<string | null>(null)
  const [markPaidInputs, setMarkPaidInputs] = useState<Record<string, { amount: string; note: string; periodEnd: string }>>({})
  const [markPaidActing, setMarkPaidActing] = useState<string | null>(null)
  const [ledgerLoading, setLedgerLoading] = useState(false)

  const [users, setUsers] = useState<UserRow[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersPage, setUsersPage] = useState(0)
  const [usersTierFilter, setUsersTierFilter] = useState('all')
  const [usersFlaggedOnly, setUsersFlaggedOnly] = useState(false)
  const [usersSort, setUsersSort] = useState<{ col: keyof UserRow; dir: 'asc' | 'desc' }>({ col: 'joined', dir: 'desc' })
  const [unflagActing, setUnflagActing] = useState<string | null>(null)
  const [messagePanelId, setMessagePanelId] = useState<string | null>(null)
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({})
  const [messageActing, setMessageActing] = useState<string | null>(null)
  const [messageSent, setMessageSent] = useState<Record<string, boolean>>({})

  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsBadge, setNewsBadge] = useState('KB UPDATE')
  const [newsMessage, setNewsMessage] = useState('')
  const [newsLink, setNewsLink] = useState('')
  const [newsActing, setNewsActing] = useState(false)
  const [newsDeleteActing, setNewsDeleteActing] = useState<string | null>(null)
  const [newsToggleActing, setNewsToggleActing] = useState<string | null>(null)

  // ── Contact inbox state ──────────────────────────────────────────────────────
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [contactLoading, setContactLoading] = useState(false)
  const [contactFilter, setContactFilter] = useState<ContactStatus | 'all'>('all')
  const [contactExpandedId, setContactExpandedId] = useState<string | null>(null)
  const [contactNotesInputs, setContactNotesInputs] = useState<Record<string, string>>({})
  const [contactStatusInputs, setContactStatusInputs] = useState<Record<string, ContactStatus>>({})
  const [contactActing, setContactActing] = useState<string | null>(null)
  const [contactNotifyPanelId, setContactNotifyPanelId] = useState<string | null>(null)
  const [contactNotifyInputs, setContactNotifyInputs] = useState<Record<string, string>>({})
  const [contactNotifyActing, setContactNotifyActing] = useState<string | null>(null)
  const [contactNotifySent, setContactNotifySent] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/signin'); return }
      setToken(session.access_token)
      setAuthorized(true)
      setLoading(false)

      // ── Reset new-signups badge counter on Mission Control load ──
      try {
        await fetch('/api/admin/badge-counts', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
      } catch {
        // Non-fatal
      }
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
      const list: Affiliate[] = data.affiliates ?? []
      setAffiliates(list)
      const inputs: Record<string, string> = {}
      const notes: Record<string, string> = {}
      for (const a of list) {
        inputs[a.id] = String(Math.round(a.payout_rate * 100))
        notes[a.id] = a.notes ?? ''
      }
      setPayoutInputs(inputs)
      setNotesInputs(notes)

      const approved = list.filter(a => a.status === 'approved')
      if (approved.length > 0) {
        setLedgerLoading(true)
        const results = await Promise.all(
          approved.map(a =>
            fetch(`/api/admin/affiliates?mode=payouts&id=${a.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            }).then(r => r.ok ? r.json() : null)
          )
        )
        const newPayoutData: Record<string, AffiliatePayoutData> = {}
        const today = new Date().toISOString().split('T')[0]
        const newMarkPaidInputs: Record<string, { amount: string; note: string; periodEnd: string }> = {}
        for (const result of results) {
          if (result?.affiliateId) {
            newPayoutData[result.affiliateId] = result
            newMarkPaidInputs[result.affiliateId] = {
              amount: result.unpaid > 0 ? String(result.unpaid) : '',
              note: '',
              periodEnd: today,
            }
          }
        }
        setPayoutData(prev => ({ ...prev, ...newPayoutData }))
        setMarkPaidInputs(prev => ({ ...prev, ...newMarkPaidInputs }))
        setLedgerLoading(false)
      }
    }
    setAffiliatesLoading(false)
  }, [])

  const fetchPayoutData = useCallback(async (affiliateId: string, accessToken: string) => {
    setPayoutDataLoading(affiliateId)
    const res = await fetch(`/api/admin/affiliates?mode=payouts&id=${affiliateId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) {
      const data = await res.json()
      setPayoutData(prev => ({ ...prev, [affiliateId]: data }))
      const today = new Date().toISOString().split('T')[0]
      setMarkPaidInputs(prev => ({
        ...prev,
        [affiliateId]: prev[affiliateId] ?? { amount: data.unpaid > 0 ? String(data.unpaid) : '', note: '', periodEnd: today },
      }))
    }
    setPayoutDataLoading(null)
  }, [])

  const fetchUsers = useCallback(async (accessToken: string, page = 0, tier = 'all', flagged = false) => {
    setUsersLoading(true)
    const params = new URLSearchParams({ mode: 'users', page: String(page), tier })
    if (flagged) params.set('flagged', 'true')
    const res = await fetch(`/api/admin/stats?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users ?? [])
      setUsersTotal(data.total ?? 0)
      setUsersPage(data.page ?? 0)
    }
    setUsersLoading(false)
  }, [])

  const fetchNews = useCallback(async () => {
    setNewsLoading(true)
    const res = await fetch('/api/site-news')
    if (res.ok) {
      const data = await res.json()
      setNewsItems(data.news ?? [])
    }
    setNewsLoading(false)
  }, [])

  const fetchContact = useCallback(async (accessToken: string, status: ContactStatus | 'all' = 'all') => {
    setContactLoading(true)
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    const res = await fetch(`/api/contact?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) {
      const data = await res.json()
      const list: ContactSubmission[] = data.submissions ?? []
      setContactSubmissions(list)
      // Seed local state for notes + status inputs
      const notes: Record<string, string> = {}
      const statuses: Record<string, ContactStatus> = {}
      for (const s of list) {
        notes[s.id] = s.admin_notes ?? ''
        statuses[s.id] = s.status as ContactStatus
      }
      setContactNotesInputs(notes)
      setContactStatusInputs(statuses)
    }
    setContactLoading(false)
  }, [])

  async function handleContactUpdate(id: string) {
    if (!token) return
    setContactActing(id)
    const res = await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id,
        status: contactStatusInputs[id],
        admin_notes: contactNotesInputs[id] ?? '',
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setContactSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, ...data.submission } : s)
      )
    }
    setContactActing(null)
  }

  async function handleContactNotify(userId: string, submissionId: string) {
    if (!token) return
    const message = contactNotifyInputs[submissionId]?.trim()
    if (!message) return
    setContactNotifyActing(submissionId)
    const res = await fetch('/api/admin/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, message }),
    })
    if (res.ok) {
      setContactNotifySent(prev => ({ ...prev, [submissionId]: true }))
      setContactNotifyInputs(prev => ({ ...prev, [submissionId]: '' }))
      setContactNotifyPanelId(null)
      setTimeout(() => setContactNotifySent(prev => ({ ...prev, [submissionId]: false })), 3000)
    }
    setContactNotifyActing(null)
  }

  useEffect(() => {
    if (authorized && token) fetchStats(token)
  }, [authorized, token, fetchStats])

  useEffect(() => {
    if (authorized && token && activeTab === 'affiliates') fetchAffiliates(token)
  }, [authorized, token, activeTab, fetchAffiliates])

  useEffect(() => {
    if (authorized && token && activeTab === 'users') fetchUsers(token, 0, usersTierFilter, usersFlaggedOnly)
  }, [authorized, token, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authorized && activeTab === 'news') fetchNews()
  }, [authorized, activeTab, fetchNews])

  useEffect(() => {
    if (authorized && token && activeTab === 'contact') fetchContact(token, contactFilter)
  }, [authorized, token, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAction(id: string, action: 'approved' | 'rejected') {
    if (!token) return
    setActing(id)
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: action }),
    })
    setStats(prev => prev ? { ...prev, submissions: prev.submissions.filter(s => s.id !== id) } : prev)
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
      submissions: prev.submissions.map(s => s.id === id ? { ...s, claim: editClaim, scope: editScope } : s)
    } : prev)
    setEditingId(null)
    setActing(null)
  }

  function startEdit(sub: Submission) {
    setEditingId(sub.id)
    setEditClaim(sub.claim)
    setEditScope(sub.scope)
  }

  async function handleAffiliateAction(affiliateId: string, action: 'approve' | 'reject') {
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
      setAffiliates(prev => prev.map(a => a.id === affiliateId ? { ...a, ...data.affiliate } : a))
    }
    setAffiliateActing(null)
  }

  async function handleMarkPaid(affiliateId: string) {
    if (!token) return
    const inputs = markPaidInputs[affiliateId]
    if (!inputs?.amount || !inputs?.periodEnd) return
    setMarkPaidActing(affiliateId)

    const res = await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        affiliate_id: affiliateId,
        action: 'mark_paid',
        amount_paid: parseFloat(inputs.amount),
        note: inputs.note || null,
        period_end: inputs.periodEnd,
      }),
    })
    if (res.ok) {
      await fetchPayoutData(affiliateId, token)
      setMarkPaidInputs(prev => ({ ...prev, [affiliateId]: { ...prev[affiliateId], amount: '', note: '' } }))
    }
    setMarkPaidActing(null)
  }

  function togglePayoutPanel(affiliateId: string) {
    if (payoutPanelId === affiliateId) {
      setPayoutPanelId(null)
    } else {
      setPayoutPanelId(affiliateId)
      if (!payoutData[affiliateId] && token) fetchPayoutData(affiliateId, token)
    }
  }

  async function handleUnflag(userId: string) {
    if (!token) return
    setUnflagActing(userId)
    const res = await fetch('/api/admin/unflag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, flagged: false, banned: false } : u))
    }
    setUnflagActing(null)
  }

  async function handleSendMessage(userId: string) {
    if (!token) return
    const message = messageInputs[userId]?.trim()
    if (!message) return
    setMessageActing(userId)
    const res = await fetch('/api/admin/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, message }),
    })
    if (res.ok) {
      setMessageSent(prev => ({ ...prev, [userId]: true }))
      setMessageInputs(prev => ({ ...prev, [userId]: '' }))
      setMessagePanelId(null)
      setTimeout(() => setMessageSent(prev => ({ ...prev, [userId]: false })), 3000)
    }
    setMessageActing(null)
  }

  async function handleNewsPost() {
    if (!token || !newsMessage.trim()) return
    setNewsActing(true)
    const res = await fetch('/api/site-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        badge: newsBadge,
        message: newsMessage.trim(),
        link: newsLink.trim() || null,
        active: true,
      }),
    })
    if (res.ok) {
      setNewsMessage('')
      setNewsLink('')
      setNewsBadge('KB UPDATE')
      await fetchNews()
    }
    setNewsActing(false)
  }

  async function handleNewsToggle(item: NewsItem) {
    if (!token) return
    setNewsToggleActing(item.id)
    await fetch('/api/site-news', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: item.id, active: !item.active }),
    })
    setNewsItems(prev => prev.map(n => n.id === item.id ? { ...n, active: !n.active } : n))
    setNewsToggleActing(null)
  }

  async function handleNewsDelete(id: string) {
    if (!token) return
    setNewsDeleteActing(id)
    await fetch('/api/site-news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    setNewsItems(prev => prev.filter(n => n.id !== id))
    setNewsDeleteActing(null)
  }

  function sortedUsers() {
    return [...users].sort((a, b) => {
      const av = a[usersSort.col] ?? ''
      const bv = b[usersSort.col] ?? ''
      if (av < bv) return usersSort.dir === 'asc' ? -1 : 1
      if (av > bv) return usersSort.dir === 'asc' ? 1 : -1
      return 0
    })
  }

  function handleSortCol(col: keyof UserRow) {
    setUsersSort(prev => prev.col === col
      ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { col, dir: 'desc' }
    )
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
  const filteredAffiliates = affiliateFilter === 'all' ? affiliates : affiliates.filter(a => a.status === affiliateFilter)
  const approvedAffiliates = affiliates.filter(a => a.status === 'approved')

  const openContactCount = contactSubmissions.filter(s => s.status === 'open').length
  const filteredContact = contactFilter === 'all'
    ? contactSubmissions
    : contactSubmissions.filter(s => s.status === contactFilter)

  const ledgerRows = approvedAffiliates.map(a => {
    const pd = payoutData[a.id]
    return {
      id: a.id,
      name: a.name,
      code: a.referral_code,
      rate: Math.round(a.payout_rate * 100),
      conversions: a.affiliate_conversions?.[0]?.count ?? 0,
      earned: pd?.totalEarned ?? null,
      paid: pd?.totalPaid ?? null,
      owed: pd?.unpaid ?? null,
      method: a.payout_method,
    }
  })
  const totalOwed = ledgerRows.reduce((sum, r) => sum + (r.owed ?? 0), 0)
  const totalEarned = ledgerRows.reduce((sum, r) => sum + (r.earned ?? 0), 0)
  const totalPaid = ledgerRows.reduce((sum, r) => sum + (r.paid ?? 0), 0)

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

  const tierBadgeColor = (tier: string) => {
    if (tier === 'founding') return 'text-violet-400 bg-violet-500/10 border-violet-500/30'
    if (tier === 'elite') return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    if (tier === 'pro') return 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    if (tier === 'alliance') return 'text-green-400 bg-green-500/10 border-green-500/30'
    return 'text-zinc-500 bg-zinc-800/50 border-zinc-700'
  }

  const newsBadgeStyle = (badge: string) => {
    const map: Record<string, string> = {
      'KB UPDATE': 'bg-amber-500/15 border-amber-500/40 text-amber-400',
      'NEW':       'bg-sky-500/15 border-sky-500/40 text-sky-400',
      'FIXED':     'bg-green-500/15 border-green-500/40 text-green-400',
      'EVENT':     'bg-purple-500/15 border-purple-500/40 text-purple-400',
    }
    return map[badge] ?? 'bg-zinc-700/40 border-zinc-600 text-zinc-400'
  }

  const SortIcon = ({ col }: { col: keyof UserRow }) => (
    <span className="ml-0.5 text-zinc-600">
      {usersSort.col === col ? (usersSort.dir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
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

      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {(['overview', 'submissions', 'affiliates', 'users', 'news', 'contact'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-mono transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab
                  ? 'text-amber-400 border-amber-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'submissions' && `Submissions (${pending.length})`}
              {tab === 'affiliates' && `Affiliates${pendingAffiliates > 0 ? ` (${pendingAffiliates})` : ''}`}
              {tab === 'users' && `Users${usersTotal > 0 ? ` (${usersTotal})` : ''}`}
              {tab === 'news' && `News${newsItems.length > 0 ? ` (${newsItems.filter(n => n.active).length})` : ''}`}
              {tab === 'contact' && (
                <span className="flex items-center gap-1.5">
                  Contact
                  {openContactCount > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold leading-none">
                      {openContactCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <>
            {statsError && <p className="text-red-400 text-sm mb-4">{statsError}</p>}
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

        {/* ── Submissions ── */}
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
                  <div className="ml-auto flex items-center gap-2">
                    {sub.submitter_ign && sub.submitter_ign !== '—' && (
                      <span className="text-[11px] text-zinc-500 font-mono">{sub.submitter_ign}</span>
                    )}
                    <span className="text-[11px] text-zinc-600 font-mono">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
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

        {/* ── Affiliates ── */}
        {activeTab === 'affiliates' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-amber-400">🤝 Affiliate Management</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{affiliates.length} total · {pendingAffiliates} pending</p>
              </div>
              <button
                onClick={() => token && fetchAffiliates(token)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {approvedAffiliates.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl mb-6 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-zinc-300">💳 Affiliate Ledger</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Approved affiliates · earnings &amp; outstanding balances</p>
                  </div>
                  {ledgerLoading && (
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        {['Affiliate', 'Code', 'Rate', 'Conv.', 'Earned', 'Paid', 'Owed', 'Method'].map(h => (
                          <th key={h} className="text-left px-4 py-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerRows.map(row => (
                        <tr key={row.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-4 py-2.5 text-white text-xs font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-4 py-2.5 text-amber-400 text-xs font-mono">{row.code}</td>
                          <td className="px-4 py-2.5 text-zinc-300 text-xs font-mono">{row.rate}%</td>
                          <td className="px-4 py-2.5 text-zinc-400 text-xs font-mono">{row.conversions}</td>
                          <td className="px-4 py-2.5 text-xs font-mono">
                            {row.earned === null
                              ? <span className="text-zinc-700">—</span>
                              : <span className="text-zinc-300">${row.earned.toFixed(2)}</span>
                            }
                          </td>
                          <td className="px-4 py-2.5 text-xs font-mono">
                            {row.paid === null
                              ? <span className="text-zinc-700">—</span>
                              : <span className="text-zinc-400">${row.paid.toFixed(2)}</span>
                            }
                          </td>
                          <td className="px-4 py-2.5 text-xs font-mono">
                            {row.owed === null
                              ? <span className="text-zinc-700">—</span>
                              : row.owed > 0
                                ? <span className="text-amber-400 font-bold">${row.owed.toFixed(2)}</span>
                                : <span className="text-green-500 text-[11px]">✓ Clear</span>
                            }
                          </td>
                          <td className="px-4 py-2.5 text-xs text-zinc-500">
                            {row.method
                              ? <span className="text-zinc-400">{PAYOUT_METHOD_LABELS[row.method] ?? row.method}</span>
                              : <span className="text-amber-600 text-[11px]">⚠ not set</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {!ledgerLoading && ledgerRows.some(r => r.owed !== null) && (
                      <tfoot>
                        <tr className="border-t-2 border-zinc-700 bg-zinc-900/60">
                          <td colSpan={4} className="px-4 py-2.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                            Total
                          </td>
                          <td className="px-4 py-2.5 text-xs font-bold text-zinc-300 font-mono">
                            ${totalEarned.toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-bold text-zinc-400 font-mono">
                            ${totalPaid.toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-bold font-mono">
                            <span className={totalOwed > 0 ? 'text-amber-400' : 'text-green-500'}>
                              ${totalOwed.toFixed(2)}
                            </span>
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}

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
              const pd = payoutData[aff.id]
              const mpInputs = markPaidInputs[aff.id] ?? { amount: '', note: '', periodEnd: new Date().toISOString().split('T')[0] }

              return (
                <div key={aff.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-4">
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

                  <div className="bg-zinc-950/60 rounded-xl p-3 mb-4">
                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-1">How they&apos;ll promote</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{aff.promo_method}</p>
                  </div>

                  {aff.status === 'approved' && (
                    <>
                      <div className="flex items-center gap-3 mb-3 bg-zinc-950/40 rounded-xl p-3">
                        <div>
                          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-0.5">Referral Code</p>
                          <p className="text-sm font-mono text-amber-400">{aff.referral_code}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-0.5">Payout Rate</p>
                          <p className="text-sm font-bold text-green-400">{Math.round(aff.payout_rate * 100)}%</p>
                        </div>
                      </div>

                      <button
                        onClick={() => togglePayoutPanel(aff.id)}
                        className={`w-full py-2 rounded-xl border text-sm font-bold transition-colors mb-0 ${
                          payoutPanelId === aff.id
                            ? 'border-green-500/40 text-green-400 bg-green-500/5'
                            : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                        }`}
                      >
                        {payoutPanelId === aff.id ? '▲ Hide Payouts' : '💰 Manage Payouts'}
                      </button>

                      {payoutPanelId === aff.id && (
                        <div className="mt-3 border border-zinc-700/60 rounded-xl p-4 bg-zinc-950/40">
                          {payoutDataLoading === aff.id && (
                            <div className="flex items-center justify-center py-6">
                              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}

                          {pd && payoutDataLoading !== aff.id && (
                            <>
                              <div className="mb-4">
                                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-2">Send Payment To</p>
                                {aff.payout_method ? (
                                  <div className="flex items-center gap-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                                    <span className="text-xs font-bold text-zinc-300 bg-zinc-800 rounded px-2 py-0.5">
                                      {PAYOUT_METHOD_LABELS[aff.payout_method] ?? aff.payout_method}
                                    </span>
                                    <span className="text-sm font-mono text-green-400">{aff.payout_account}</span>
                                    {aff.payout_country && (
                                      <span className="text-[11px] text-zinc-600 ml-auto">{aff.payout_country}</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2.5">
                                    <span className="text-amber-500 text-xs">⚠</span>
                                    <span className="text-[12px] text-amber-500/80">Affiliate has not set a payout method yet.</span>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-3 gap-3 mb-4">
                                {[
                                  { label: 'Total Earned', value: `$${pd.totalEarned.toFixed(2)}`, color: 'text-zinc-300' },
                                  { label: 'Total Paid', value: `$${pd.totalPaid.toFixed(2)}`, color: 'text-zinc-300' },
                                  { label: 'Unpaid', value: `$${pd.unpaid.toFixed(2)}`, color: pd.unpaid > 0 ? 'text-amber-400 font-bold' : 'text-zinc-500' },
                                ].map(item => (
                                  <div key={item.label} className="bg-zinc-900/60 rounded-lg p-3 text-center">
                                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className={`text-base ${item.color}`}>{item.value}</p>
                                  </div>
                                ))}
                              </div>

                              {pd.lastPayout && (
                                <p className="text-[11px] text-zinc-600 mb-3">
                                  Last paid: <span className="text-zinc-400">${pd.lastPayout.amount_paid.toFixed(2)}</span> on {new Date(pd.lastPayout.created_at).toLocaleDateString()}
                                  {pd.lastPayout.note && <span className="text-zinc-600"> · {pd.lastPayout.note}</span>}
                                </p>
                              )}

                              <div className="border-t border-zinc-800 pt-3 mb-3">
                                <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wide mb-2">Mark as Paid</p>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <div>
                                    <label className="text-[10px] text-zinc-600 block mb-1">Amount ($)</label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      placeholder="0.00"
                                      value={mpInputs.amount}
                                      onChange={e => setMarkPaidInputs(prev => ({ ...prev, [aff.id]: { ...mpInputs, amount: e.target.value } }))}
                                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-green-500/60"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-zinc-600 block mb-1">Period End</label>
                                    <input
                                      type="date"
                                      value={mpInputs.periodEnd}
                                      onChange={e => setMarkPaidInputs(prev => ({ ...prev, [aff.id]: { ...mpInputs, periodEnd: e.target.value } }))}
                                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-green-500/60"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-zinc-600 block mb-1">Note (optional)</label>
                                    <input
                                      type="text"
                                      placeholder="Wise, PayPal..."
                                      value={mpInputs.note}
                                      onChange={e => setMarkPaidInputs(prev => ({ ...prev, [aff.id]: { ...mpInputs, note: e.target.value } }))}
                                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-green-500/60"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleMarkPaid(aff.id)}
                                  disabled={markPaidActing === aff.id || !mpInputs.amount || !mpInputs.periodEnd}
                                  className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors disabled:opacity-40"
                                >
                                  {markPaidActing === aff.id ? '…' : `✓ Mark $${mpInputs.amount || '0.00'} Paid`}
                                </button>
                              </div>

                              {pd.payouts.length > 0 && (
                                <div>
                                  <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wide mb-2">Payout History</p>
                                  <div className="space-y-1.5">
                                    {pd.payouts.map(p => (
                                      <div key={p.id} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-2">
                                        <div>
                                          <span className="text-sm font-bold text-green-400">${p.amount_paid.toFixed(2)}</span>
                                          {p.note && <span className="text-[11px] text-zinc-600 ml-2">· {p.note}</span>}
                                        </div>
                                        <div className="text-right">
                                          <p className="text-[11px] text-zinc-500">{new Date(p.created_at).toLocaleDateString()}</p>
                                          <p className="text-[10px] text-zinc-700">thru {p.period_end}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}

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

        {/* ── Users ── */}
        {activeTab === 'users' && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-amber-400">👥 User Base</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{usersTotal} total · page {usersPage + 1}</p>
              </div>
              <button
                onClick={() => token && fetchUsers(token, usersPage, usersTierFilter, usersFlaggedOnly)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap items-center">
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'free', 'pro', 'elite', 'founding', 'alliance'].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setUsersTierFilter(t)
                      if (token) fetchUsers(token, 0, t, usersFlaggedOnly)
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                      usersTierFilter === t
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  const next = !usersFlaggedOnly
                  setUsersFlaggedOnly(next)
                  if (token) fetchUsers(token, 0, usersTierFilter, next)
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors ml-auto ${
                  usersFlaggedOnly
                    ? 'bg-red-500/15 border-red-500/40 text-red-400'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                🚩 Flagged / Banned
              </button>
            </div>

            {usersLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!usersLoading && users.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-600 text-sm">No users found.</p>
              </div>
            )}

            {!usersLoading && users.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        {[
                          { label: 'IGN / Email', col: 'ign' as keyof UserRow },
                          { label: 'Tier', col: 'tier' as keyof UserRow },
                          { label: 'HQ', col: 'hq' as keyof UserRow },
                          { label: 'Joined', col: 'joined' as keyof UserRow },
                          { label: 'Last Active', col: 'lastActive' as keyof UserRow },
                          { label: 'Questions', col: 'totalQuestions' as keyof UserRow },
                          { label: 'Revenue', col: 'lifetimeRevenue' as keyof UserRow },
                          { label: 'Ref By', col: 'referredBy' as keyof UserRow },
                        ].map(({ label, col }) => (
                          <th
                            key={col}
                            onClick={() => handleSortCol(col)}
                            className="text-left px-4 py-2.5 text-[11px] font-mono text-zinc-500 uppercase tracking-wide cursor-pointer hover:text-zinc-300 transition-colors whitespace-nowrap"
                          >
                            {label}<SortIcon col={col} />
                          </th>
                        ))}
                        <th className="px-4 py-2.5 text-[11px] font-mono text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers().map((u) => (
                        <>
                          <tr
                            key={u.id}
                            className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${u.banned ? 'opacity-50' : ''}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {(u.flagged || u.banned) && (
                                  <span title={u.banned ? 'Banned' : 'Flagged'} className="text-xs">
                                    {u.banned ? '🚫' : '🚩'}
                                  </span>
                                )}
                                <div>
                                  <p className="text-white font-medium text-xs">{u.ign !== '—' ? u.ign : u.email}</p>
                                  {u.ign !== '—' && <p className="text-zinc-600 text-[10px] font-mono">{u.email}</p>}
                                  <p className="text-zinc-700 text-[10px]">S{u.server}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${tierBadgeColor(u.tier)}`}>
                                {u.tier}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-400 text-xs">{u.hq}</td>
                            <td className="px-4 py-3 text-zinc-500 text-[11px] font-mono whitespace-nowrap">
                              {new Date(u.joined).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-[11px] font-mono whitespace-nowrap">
                              {u.lastActive
                                ? <span className="text-zinc-400">{new Date(u.lastActive + 'T12:00:00').toLocaleDateString()}</span>
                                : <span className="text-zinc-700">—</span>
                              }
                            </td>
                            <td className="px-4 py-3 text-zinc-300 text-xs font-mono">{u.totalQuestions.toLocaleString()}</td>
                            <td className="px-4 py-3 text-xs font-mono">
                              {u.lifetimeRevenue > 0
                                ? <span className="text-green-400">${u.lifetimeRevenue.toFixed(2)}</span>
                                : <span className="text-zinc-700">—</span>
                              }
                            </td>
                            <td className="px-4 py-3 text-[11px] text-zinc-500 max-w-[120px] truncate">
                              {u.referredBy ?? <span className="text-zinc-700">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {(u.flagged || u.banned) && (
                                  <button
                                    onClick={() => handleUnflag(u.id)}
                                    disabled={unflagActing === u.id}
                                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-green-700/50 text-green-500 hover:text-green-300 hover:border-green-500/60 transition-colors disabled:opacity-40 whitespace-nowrap"
                                  >
                                    {unflagActing === u.id ? '…' : '✓ Unflag'}
                                  </button>
                                )}
                                <button
                                  onClick={() => setMessagePanelId(messagePanelId === u.id ? null : u.id)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                                    messageSent[u.id]
                                      ? 'border-green-700/50 text-green-400'
                                      : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                                  }`}
                                >
                                  {messageSent[u.id] ? '✓ Sent' : '✉ Message'}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {messagePanelId === u.id && (
                            <tr key={`${u.id}-msg`} className="border-b border-zinc-800/50 bg-zinc-900/40">
                              <td colSpan={9} className="px-4 py-3">
                                <div className="flex gap-2 items-start">
                                  <textarea
                                    value={messageInputs[u.id] ?? ''}
                                    onChange={e => setMessageInputs(prev => ({ ...prev, [u.id]: e.target.value }))}
                                    placeholder="Message to display on this user's dashboard..."
                                    rows={2}
                                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-amber-500/60 placeholder:text-zinc-600"
                                  />
                                  <div className="flex flex-col gap-1.5">
                                    <button
                                      onClick={() => handleSendMessage(u.id)}
                                      disabled={messageActing === u.id || !messageInputs[u.id]?.trim()}
                                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors disabled:opacity-40 whitespace-nowrap"
                                    >
                                      {messageActing === u.id ? '…' : 'Send'}
                                    </button>
                                    <button
                                      onClick={() => setMessagePanelId(null)}
                                      className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>

                {usersTotal > 50 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
                    <span className="text-[11px] text-zinc-600 font-mono">
                      {usersPage * 50 + 1}–{Math.min((usersPage + 1) * 50, usersTotal)} of {usersTotal}
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={usersPage === 0}
                        onClick={() => {
                          const p = usersPage - 1
                          setUsersPage(p)
                          if (token) fetchUsers(token, p, usersTierFilter, usersFlaggedOnly)
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Prev
                      </button>
                      <button
                        disabled={(usersPage + 1) * 50 >= usersTotal}
                        onClick={() => {
                          const p = usersPage + 1
                          setUsersPage(p)
                          if (token) fetchUsers(token, p, usersTierFilter, usersFlaggedOnly)
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── News ── */}
        {activeTab === 'news' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-amber-400">📢 Site News</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Manage what players see on the dashboard</p>
              </div>
              <button
                onClick={fetchNews}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-6">
              <p className="text-xs font-bold text-zinc-300 mb-4">Post new item</p>

              <div className="flex gap-2 mb-4 flex-wrap">
                {BADGE_OPTIONS.map(b => (
                  <button
                    key={b}
                    onClick={() => setNewsBadge(b)}
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${
                      newsBadge === b
                        ? newsBadgeStyle(b)
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <textarea
                value={newsMessage}
                onChange={e => setNewsMessage(e.target.value)}
                placeholder="e.g. Easter event pack data loaded into Buddy's knowledge base"
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm p-3 mb-3 resize-none focus:outline-none focus:border-amber-500/60 placeholder:text-zinc-600"
              />

              <input
                type="text"
                value={newsLink}
                onChange={e => setNewsLink(e.target.value)}
                placeholder="Link (optional) — e.g. /war-room or /upgrade"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm px-3 py-2 mb-4 focus:outline-none focus:border-amber-500/60 placeholder:text-zinc-600"
              />

              <button
                onClick={handleNewsPost}
                disabled={newsActing || !newsMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-40"
              >
                {newsActing ? '…' : '📢 Post to Dashboard'}
              </button>
            </div>

            {newsLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!newsLoading && newsItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-600 text-sm">No news items yet. Post the first one above.</p>
              </div>
            )}

            {!newsLoading && newsItems.map(item => (
              <div
                key={item.id}
                className={`flex items-start gap-3 bg-zinc-900/50 border rounded-xl px-4 py-3 mb-3 transition-colors ${
                  item.active ? 'border-zinc-800' : 'border-zinc-800/40 opacity-50'
                }`}
              >
                <span className={`mt-0.5 flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border whitespace-nowrap ${newsBadgeStyle(item.badge)}`}>
                  {item.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.message}</p>
                  {item.link && (
                    <p className="text-[10px] text-zinc-600 font-mono mt-0.5">→ {item.link}</p>
                  )}
                  <p className="text-[10px] text-zinc-700 font-mono mt-1">
                    {new Date(item.created_at).toLocaleDateString()} · {item.active ? 'visible' : 'hidden'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleNewsToggle(item)}
                    disabled={newsToggleActing === item.id}
                    title={item.active ? 'Hide from dashboard' : 'Show on dashboard'}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
                      item.active
                        ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                        : 'border-green-700/50 text-green-600 hover:text-green-400'
                    }`}
                  >
                    {newsToggleActing === item.id ? '…' : item.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleNewsDelete(item.id)}
                    disabled={newsDeleteActing === item.id}
                    title="Delete permanently"
                    className="text-xs px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-800/50 transition-colors disabled:opacity-40"
                  >
                    {newsDeleteActing === item.id ? '…' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Contact Inbox ── */}
        {activeTab === 'contact' && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-amber-400">📬 Contact Inbox</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {contactSubmissions.length} total · {openContactCount} open
                </p>
              </div>
              <button
                onClick={() => token && fetchContact(token, contactFilter)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {/* Status filter pills */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(f => {
                const count = f === 'all'
                  ? contactSubmissions.length
                  : contactSubmissions.filter(s => s.status === f).length
                return (
                  <button
                    key={f}
                    onClick={() => {
                      setContactFilter(f)
                      if (token) fetchContact(token, f)
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                      contactFilter === f
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {f.replace('_', ' ')} ({count})
                  </button>
                )
              })}
            </div>

            {contactLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!contactLoading && filteredContact.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-600 text-sm">
                  {contactFilter === 'all' ? 'No submissions yet.' : `No ${contactFilter.replace('_', ' ')} submissions.`}
                </p>
              </div>
            )}

            {!contactLoading && filteredContact.map(sub => {
              const isExpanded = contactExpandedId === sub.id
              return (
                <div
                  key={sub.id}
                  className={`bg-zinc-900/60 border rounded-2xl mb-3 overflow-hidden transition-colors ${
                    sub.status === 'open' ? 'border-amber-500/20' : 'border-zinc-800'
                  }`}
                >
                  {/* ── Row header — always visible ── */}
                  <button
                    onClick={() => setContactExpandedId(isExpanded ? null : sub.id)}
                    className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-zinc-800/20 transition-colors"
                  >
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${contactCategoryStyle(sub.category)}`}>
                      {categoryLabel[sub.category] ?? sub.category}
                    </span>
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${contactStatusStyle(sub.status)}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="flex-1 text-sm text-zinc-300 truncate min-w-0">
                      {sub.message}
                    </span>
                    <div className="flex-shrink-0 text-right ml-2">
                      <p className="text-[11px] text-zinc-400 font-mono">{sub.email ?? '—'}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{new Date(sub.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-zinc-600 text-xs ml-1">{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {/* ── Expanded detail panel ── */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-zinc-800/60">
                      {/* Full message */}
                      <div className="bg-zinc-950/60 rounded-xl p-4 mt-4 mb-4">
                        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-2">Message</p>
                        <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                      </div>

                      {/* Screenshot */}
                      {sub.screenshot_base64 && (
                        <div className="mb-4">
                          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide mb-2">
                            Screenshot {sub.screenshot_name && <span className="text-zinc-700">· {sub.screenshot_name}</span>}
                          </p>
                          <img
                            src={`data:image/jpeg;base64,${sub.screenshot_base64}`}
                            alt="Submitted screenshot"
                            className="max-w-full max-h-64 rounded-xl border border-zinc-800 block"
                          />
                        </div>
                      )}

                      {/* Status + notes controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide block mb-1.5">
                            Status
                          </label>
                          <select
                            value={contactStatusInputs[sub.id] ?? sub.status}
                            onChange={e => setContactStatusInputs(prev => ({ ...prev, [sub.id]: e.target.value as ContactStatus }))}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/60"
                          >
                            {CONTACT_STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide block mb-1.5">
                            Admin Notes
                          </label>
                          <input
                            type="text"
                            placeholder="Internal note..."
                            value={contactNotesInputs[sub.id] ?? ''}
                            onChange={e => setContactNotesInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/60 placeholder:text-zinc-600"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleContactUpdate(sub.id)}
                          disabled={contactActing === sub.id}
                          className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {contactActing === sub.id ? '…' : '💾 Save'}
                        </button>

                        {/* Notify button — only if we have a user_id */}
                        {sub.user_id && (
                          <button
                            onClick={() => setContactNotifyPanelId(contactNotifyPanelId === sub.id ? null : sub.id)}
                            className={`px-4 py-2.5 rounded-xl border font-bold text-sm transition-colors ${
                              contactNotifySent[sub.id]
                                ? 'border-green-700/50 text-green-400'
                                : contactNotifyPanelId === sub.id
                                  ? 'border-sky-500/40 text-sky-400 bg-sky-500/5'
                                  : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                            }`}
                          >
                            {contactNotifySent[sub.id] ? '✓ Sent' : '✉ Notify User'}
                          </button>
                        )}
                      </div>

                      {/* Notify panel */}
                      {contactNotifyPanelId === sub.id && sub.user_id && (
                        <div className="mt-3 flex gap-2 items-start">
                          <textarea
                            value={contactNotifyInputs[sub.id] ?? ''}
                            onChange={e => setContactNotifyInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            placeholder="Message to show on the user's dashboard..."
                            rows={2}
                            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-sky-500/60 placeholder:text-zinc-600"
                          />
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => handleContactNotify(sub.user_id!, sub.id)}
                              disabled={contactNotifyActing === sub.id || !contactNotifyInputs[sub.id]?.trim()}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black transition-colors disabled:opacity-40 whitespace-nowrap"
                            >
                              {contactNotifyActing === sub.id ? '…' : 'Send'}
                            </button>
                            <button
                              onClick={() => setContactNotifyPanelId(null)}
                              className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
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
