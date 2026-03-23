'use client';
// src/components/DailyBriefing.tsx
// Watch Out strip — static, deterministic, zero API cost
// Rebuilt: March 23, 2026 (session 62) — AI briefing removed entirely.
// Renders a single Watch Out alert based on current duel day. No API call. No hallucination risk.

// ─── Duel day calculation — reset always 2am UTC ──────────────────────────────
function getDuelDay(): number {
  const now = new Date()
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const utcDay = adjusted.getUTCDay()
  const dayMap: Record<number, number> = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  return dayMap[utcDay] ?? 1
}

// ─── Static Watch Out copy — confirmed game data only ────────────────────────
const WATCH_OUT: Record<number, string> = {
  1: 'Radar tasks stop accruing if they hit cap — clear them before they fill.',
  2: 'Get in the Secretary of Science queue before reset tonight — it fills up fast in the minutes before. Then take the Secretary of Science role right after reset to maximize Valor points when you kick off research on Day 3.',
  3: 'Secretary of Science slot fills fast today — if you\'re not in it, you\'re losing research time.',
  4: 'Ghost Ops runs today only — 4 time windows, Thursdays only. Claim rewards manually or they\'re lost.',
  5: 'Fill your Drill Grounds with your highest available troops — every troop trained scores today.',
  6: 'War day — know how your wall defense stacks up before you drop your shield.',
  7: 'Send gathering squads out on runs long enough to finish after the 2am UTC reset — you\'ll collect Day 1 gathering points when they return.',
}

export default function DailyBriefing() {
  const day = getDuelDay()
  const watchOut = WATCH_OUT[day] ?? null

  if (!watchOut) return null

  return (
    <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-3">
      <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">⚠ Watch Out</p>
      <p className="text-zinc-200 text-sm leading-relaxed">{watchOut}</p>
    </div>
  )
}
