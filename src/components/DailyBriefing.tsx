'use client';
// src/components/DailyBriefing.tsx
// Watch Out strip — static, deterministic, zero Claude API cost
// Rebuilt: March 23, 2026 (session 62) — AI briefing removed entirely.
// Updated: April 23, 2026 (session 152) — Day 4 season-gated to match actionPlan.ts.
//   Three tiers: Season 0 (power up, no Exclusive Weapons) / Season 1 (power up +
//   Exclusive Weapon shards) / Season 2+ (Ghost Ops). Accepts `season` as a prop
//   from parent — same pattern actionPlan.ts uses. No round-trip on mount.
// Renders a single Watch Out alert based on current duel day. No API call. No hallucination risk.

// ─── Duel day calculation — reset always 2am UTC ──────────────────────────────
function getDuelDay(): number {
  const now = new Date()
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const utcDay = adjusted.getUTCDay()
  const dayMap: Record<number, number> = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  return dayMap[utcDay] ?? 1
}

// ─── Day 4 copy — season-gated to match actionPlan.ts ────────────────────────
function getDay4WatchOut(season: number): string {
  if (season === 0) {
    return 'Troop power up day — EXP, hero shards, and skill medals all score today. Stack these items all week and unload them today.'
  }
  if (season === 1) {
    return 'Troop power up day — EXP, hero shards, skill medals, and Exclusive Weapon shards all score today. Stack these items all week and unload them today.'
  }
  // season >= 2
  return 'Ghost Ops runs today only — 4 time windows, Thursdays only. Claim rewards manually or they\'re lost.'
}

// ─── Static Watch Out copy — confirmed game data only ────────────────────────
function getWatchOut(day: number, season: number): string | null {
  switch (day) {
    case 1: return 'Radar tasks stop accruing if they hit cap — clear them before they fill.'
    case 2: return 'Get in the Secretary of Science queue before reset tonight — it fills up fast in the minutes before. Then take the Secretary of Science role right after reset to maximize Valor points when you kick off research on Day 3.'
    case 3: return 'Secretary of Science slot fills fast today — if you\'re not in it, you\'re losing research time.'
    case 4: return getDay4WatchOut(season)
    case 5: return 'Fill your Drill Grounds with your highest available troops — every troop trained scores today.'
    case 6: return 'War day — know how your wall defense stacks up before you drop your shield.'
    case 7: return 'Send gathering squads out on runs long enough to finish after the 2am UTC reset — you\'ll collect Day 1 gathering points when they return.'
    default: return null
  }
}

interface DailyBriefingProps {
  season?: number
}

export default function DailyBriefing({ season = 2 }: DailyBriefingProps) {
  const day = getDuelDay()
  const watchOut = getWatchOut(day, season)

  if (!watchOut) return null

  return (
    <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-3">
      <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">⚠ Watch Out</p>
      <p className="text-zinc-200 text-sm leading-relaxed">{watchOut}</p>
    </div>
  )
}
