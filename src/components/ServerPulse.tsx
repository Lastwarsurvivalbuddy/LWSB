'use client'

import { useEffect, useState } from 'react'

interface StreakEntry {
  commander_name: string
  streak_count: number
  server_number: number
}

interface ContributorEntry {
  commander_name: string
  count: number
  server_number: number
}

interface PulseData {
  streaks: StreakEntry[]
  contributors: ContributorEntry[]
}

interface ServerPulseProps {
  serverNumber: number
}

type Tab = 'server' | 'global'

export default function ServerPulse({ serverNumber }: ServerPulseProps) {
  const [activeTab, setActiveTab] = useState<Tab>('server')
  const [data, setData] = useState<PulseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchPulse(activeTab)
  }, [activeTab])

  async function fetchPulse(scope: Tab) {
    setLoading(true)
    setError(false)
    try {
      const params =
        scope === 'server'
          ? `?scope=server&server_number=${serverNumber}`
          : `?scope=global`
      const res = await fetch(`/api/pulse${params}`)
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      setData(json)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const isEmpty =
    !data || (data.streaks.length === 0 && data.contributors.length === 0)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          {/* Pulse dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <h2 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase">
            Server Pulse
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5">
          {(['server', 'global'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-amber-500 text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab === 'server' ? `S-${serverNumber}` : 'Global'}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-8 rounded-md bg-zinc-800 animate-pulse"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-xs text-zinc-500 text-center py-4">
            Could not load pulse data.
          </p>
        ) : isEmpty ? (
          <p className="text-xs text-zinc-500 text-center py-4">
            No activity yet on{' '}
            {activeTab === 'server' ? `Server ${serverNumber}` : 'any server'}.
            Be the first.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top Streaks */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                🔥 Top Streaks
              </p>
              {data.streaks.length === 0 ? (
                <p className="text-xs text-zinc-600 italic">No active streaks</p>
              ) : (
                <ol className="flex flex-col gap-1.5">
                  {data.streaks.map((entry, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-bold w-4 text-right shrink-0 ${
                            i === 0
                              ? 'text-amber-400'
                              : i === 1
                              ? 'text-zinc-300'
                              : i === 2
                              ? 'text-amber-700'
                              : 'text-zinc-600'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-xs text-zinc-200 truncate">
                          {entry.commander_name}
                        </span>
                        {activeTab === 'global' && (
                          <span className="text-[10px] text-zinc-600 shrink-0">
                            S-{entry.server_number}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-amber-400 shrink-0">
                        {entry.streak_count}d
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Most Active */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                🏆 Most Active
              </p>
              {data.contributors.length === 0 ? (
                <p className="text-xs text-zinc-600 italic">No submissions yet</p>
              ) : (
                <ol className="flex flex-col gap-1.5">
                  {data.contributors.map((entry, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-bold w-4 text-right shrink-0 ${
                            i === 0
                              ? 'text-amber-400'
                              : i === 1
                              ? 'text-zinc-300'
                              : i === 2
                              ? 'text-amber-700'
                              : 'text-zinc-600'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-xs text-zinc-200 truncate">
                          {entry.commander_name}
                        </span>
                        {activeTab === 'global' && (
                          <span className="text-[10px] text-zinc-600 shrink-0">
                            S-{entry.server_number}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-amber-400 shrink-0">
                        {entry.count} intel
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
