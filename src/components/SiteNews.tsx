'use client'
import { useState } from 'react'

interface NewsItem {
  id: string
  created_at: string
  badge: string
  message: string
  link: string | null
  active: boolean
}

const BADGE_STYLES: Record<string, string> = {
  'KB UPDATE': 'bg-amber-500/15 border-amber-500/40 text-amber-400',
  'NEW':       'bg-sky-500/15 border-sky-500/40 text-sky-400',
  'FIXED':     'bg-green-500/15 border-green-500/40 text-green-400',
  'EVENT':     'bg-purple-500/15 border-purple-500/40 text-purple-400',
}

function badgeStyle(badge: string): string {
  return BADGE_STYLES[badge.toUpperCase()] ?? 'bg-zinc-700/40 border-zinc-600 text-zinc-400'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function SiteNews() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  async function loadNews() {
    if (loaded || loading) return
    setLoading(true)
    try {
      const r = await fetch('/api/site-news')
      const data = r.ok ? await r.json() : null
      if (data?.news) setItems(data.news.filter((n: NewsItem) => n.active))
    } catch {
      // silent — news is non-critical
    } finally {
      setLoaded(true)
      setLoading(false)
    }
  }

  // Show trigger button until loaded
  if (!loaded) {
    return (
      <div className="mt-3">
        <button
          onClick={loadNews}
          disabled={loading}
          className="flex items-center gap-2 px-1 w-full text-left group"
        >
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
            {loading ? 'Loading...' : '📡 Site News'}
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </button>
      </div>
    )
  }

  // Loaded but empty — render nothing
  if (items.length === 0) return null

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Site News</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
        {items.map((item, i) => {
          const inner = (
            <div className={`
              flex items-start gap-3 px-4 py-3
              ${i < items.length - 1 ? 'border-b border-zinc-800/60' : ''}
              ${item.link ? 'hover:bg-zinc-800/30 transition-colors cursor-pointer' : ''}
            `}>
              <span className={`
                mt-0.5 flex-shrink-0 text-[10px] font-bold uppercase tracking-wider
                px-1.5 py-0.5 rounded border whitespace-nowrap
                ${badgeStyle(item.badge)}
              `}>
                {item.badge}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed flex-1">{item.message}</p>
              <span className="text-[10px] text-zinc-600 font-mono flex-shrink-0 mt-0.5 whitespace-nowrap">
                {timeAgo(item.created_at)}
              </span>
            </div>
          )

          return item.link ? (
            <a key={item.id} href={item.link} className="block">{inner}</a>
          ) : (
            <div key={item.id}>{inner}</div>
          )
        })}
      </div>
    </div>
  )
}
