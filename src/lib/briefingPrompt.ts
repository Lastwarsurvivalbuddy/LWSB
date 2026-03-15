// src/lib/briefingPrompt.ts
// Builds the system + user prompt for the Daily Briefing Card
// Rewritten: March 11, 2026 (session 11) — tight constraints, correct duel day, no hallucination
// Updated: March 15, 2026 (session 17) — beginner_mode support

// ─── Duel day — exact same logic as dashboard/page.tsx ────────────────────────

function getDuelDay(): { day: number; name: string } {
  const duelDays: Record<number, string> = {
    1: 'Radar Training',
    2: 'Base Expansion',
    3: 'Age of Science',
    4: 'Train Heroes',
    5: 'Total Mobilization',
    6: 'Enemy Buster',
    7: 'Reset',
  }
  const now = new Date()
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const utcDay = adjusted.getUTCDay()
  const dayMap: Record<number, number> = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  const day = dayMap[utcDay] ?? 1
  return { day, name: duelDays[day] ?? 'Unknown' }
}

// ─── Duel day advice — only what we know for certain ─────────────────────────

function getDuelAdvice(day: number): string {
  const advice: Record<number, string> = {
    1: 'Duel Day 1 (Radar Training) — stack radar missions, save drone chip chests, align stamina use with Drone Boost Arms Race phase.',
    2: 'Duel Day 2 (Base Expansion) — open pre-wrapped buildings, use Legendary Trade Truck if available (200K pts), align construction with City Building Arms Race phase.',
    3: 'Duel Day 3 (Age of Science) — use research speedups, click to collect pre-staged research, use Valor Badges, align with Tech Research Arms Race phase.',
    4: 'Duel Day 4 (Train Heroes) — use hero recruit tickets, spend UR/SSR shards if available, use Hero EXP, align with Hero Advancement Arms Race phase.',
    5: 'Duel Day 5 (Total Mobilization) — best triple-dip day: construction + research + training all overlap Arms Race. Stack everything.',
    6: 'Duel Day 6 (Enemy Buster) — war day, 4 alliance pts. Use healing speedups today (only day they score). Coordinate kills on opponent server. Remove wall defense or shield.',
    7: 'Duel Day 7 (Reset) — no duel today. Claim rewards, queue upgrades, prep for Monday.',
  }
  return advice[day] ?? "Check in-game calendar for today's duel day."
}

// ─── Beginner duel advice — plain English version ─────────────────────────────

function getDuelAdviceBeginner(day: number): string {
  const advice: Record<number, string> = {
    1: 'Today is Radar Training day — this means you earn alliance points by doing radar missions (the radar tower in your base). It\'s a low-point day so don\'t burn your big speedups.',
    2: 'Today is Base Expansion day — you earn points by upgrading buildings. If you have buildings ready to upgrade, today is the day to do it.',
    3: 'Today is Age of Science day — you earn points by doing research (the research lab in your base). Queue up research and use speedups today.',
    4: 'Today is Train Heroes day — you earn points by leveling up your heroes. Use any hero XP items or recruit tickets you\'ve been saving.',
    5: 'Today is Total Mobilization day — the best day of the week. Building upgrades, research, AND troop training all earn points. Do as much as you can today.',
    6: 'Today is Enemy Buster day — you earn points by fighting enemies. Attack infected zones and enemy bases. This is the highest point day.',
    7: 'Today is the weekly reset — no alliance duel today. Collect your weekly rewards and get ready for next week.',
  }
  return advice[day] ?? "Check your in-game calendar for today's event."
}

// ─── Spend tier label ─────────────────────────────────────────────────────────

function getSpendLabel(spendTier: string): string {
  const map: Record<string, string> = {
    f2p: 'F2P',
    budget: 'Budget ($1–$20/mo)',
    mid: 'Mid spender ($20–$100/mo)',
    high: 'High spender ($100–$200/mo)',
    investor: 'Investor ($200+/mo)',
    whale: 'Whale/Investor ($200+/mo)',
  }
  return map[spendTier] ?? spendTier
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function buildBriefingPrompt(profile: Record<string, unknown>): Promise<{
  systemPrompt: string;
  userPrompt: string;
}> {
  const serverDay = Number(profile.computed_server_day ?? profile.server_day ?? 1)
  const hqLevel = Number(profile.hq_level ?? 1)
  const season = Number(profile.season ?? 0)
  const spendTier = String(profile.spend_style ?? profile.spend_tier ?? 'f2p')
  const troopType = String(profile.troop_type ?? 'unknown')
  const troopTier = String(profile.troop_tier ?? 'under_t10')
  const playstyle = String(profile.playstyle ?? 'balanced')
  const rankBucket = String(profile.rank_bucket ?? 'not_top_200')
  const squadPowerTier = String(profile.squad_power_tier ?? 'under_10m')
  const commanderTag = String(profile.commander_tag ?? 'Commander')
  const serverNumber = String(profile.server_number ?? '???')
  const allianceName = profile.alliance_name ? `[${profile.alliance_name}]` : ''
  const killTier = String(profile.kill_tier ?? 'under_500k')
  const beginnerMode = profile.beginner_mode === true

  const duel = getDuelDay()
  const duelAdvice = beginnerMode ? getDuelAdviceBeginner(duel.day) : getDuelAdvice(duel.day)
  const spendLabel = getSpendLabel(spendTier)

  // ── Standard mode prompt ──────────────────────────────────────────────────

  const standardSystemPrompt = `You are Last War: Survival Buddy — a tactical AI coach for Last War: Survival.
You are generating a Daily Briefing Card for one specific player.

STRICT RULES — violations destroy the product:
- Only give advice directly supported by the profile data and duel day context provided. Nothing else.
- Do NOT reference any game mechanic, event, or feature not explicitly mentioned in the player profile or context below.
- Do NOT invent scenarios, guess at what events are happening, or infer things not in the data.
- Do NOT mention Capitol War, season-specific events, night mechanics, VP gaps, or any mechanic unless it appears in the context provided.
- Do NOT fabricate timers, countdowns, or phase names.
- Arms Race: tell the player to check their in-game calendar for today's phase and align Duel actions accordingly. That is all.
- Keep advice grounded: HQ level, troop tier, troop type, duel day, spend tier, rank, kill tier. These are your only inputs.
- Be direct, specific, and honest. If you don't have data for something, don't say it.

OUTPUT FORMAT — use exactly this structure, no deviations:
SITUATION
[One sentence: server day, today's duel day and name, one honest observation about this player's current situation]

TOP 3 MOVES
• [Action grounded in duel day context]
• [Action grounded in player's troop tier / HQ level]
• [Action grounded in spend tier or rank]

WATCH OUT
[One genuine risk or timing note for today — only if you can support it from the data provided]

Tone: direct, no fluff, no hype. Coach voice.`

  // ── Beginner mode prompt ──────────────────────────────────────────────────

  const beginnerSystemPrompt = `You are Last War: Survival Buddy — a friendly guide for players who are new to Last War: Survival.
You are generating a Daily Briefing Card for a beginner player.

STRICT RULES — violations destroy the product:
- Only give advice directly supported by the profile data and duel day context provided. Nothing else.
- Do NOT reference any game mechanic, event, or feature not explicitly mentioned in the player profile or context below.
- Do NOT invent scenarios, guess at what events are happening, or infer things not in the data.
- Do NOT fabricate timers, countdowns, or phase names.
- Keep advice grounded: HQ level, troop tier, troop type, duel day, spend tier. These are your only inputs.
- Be honest. If you don't have data for something, don't say it.

BEGINNER TONE RULES:
- Write like you're texting a friend who just started the game, not briefing a general.
- Use plain English. No jargon without explanation.
- When you use a game term, immediately explain it in parentheses. Example: "do some research (upgrade your tech tree in the lab)".
- Always explain WHY each action matters, not just what to do.
- Be encouraging. This player is learning. Make them feel capable, not overwhelmed.
- One clear priority first, then 2 supporting actions. Don't overwhelm.

OUTPUT FORMAT — use exactly this structure, no deviations:
SITUATION
[One friendly sentence: what day it is, what's happening today in the game, and one encouraging observation about where this player is]

TOP 3 MOVES
• [Most important action today — explain what it is AND why it matters, in plain English]
• [Second action grounded in their HQ level or troop tier — explain the why]
• [Third action grounded in their spend tier or rank — keep it simple]

WATCH OUT
[One simple heads-up for today — written as friendly advice, not a warning. Explain any terms used.]

Tone: friendly, clear, encouraging. Like a helpful teammate, not a drill sergeant.`

  const systemPrompt = beginnerMode ? beginnerSystemPrompt : standardSystemPrompt

  const userPrompt = `Generate today's Daily Briefing Card.

PLAYER PROFILE:
- Commander: ${commanderTag} ${allianceName}
- Server: ${serverNumber} | Server Day: ${serverDay} | Season: ${season}
- HQ: ${hqLevel} | Troop Type: ${troopType} | Troop Tier: ${troopTier}
- Squad Power: ${squadPowerTier} | Rank: ${rankBucket} | Kill Tier: ${killTier}
- Playstyle: ${playstyle} | Spend: ${spendLabel}
- Beginner Mode: ${beginnerMode ? 'ON — use plain English, explain terms, be encouraging' : 'OFF — use tactical expert tone'}

TODAY'S DUEL CONTEXT:
- Today is Duel Day ${duel.day} — ${duel.name}
- ${duelAdvice}
- Arms Race: 6 phases, random daily order. ${beginnerMode ? 'Tell the player to open their in-game calendar to see which Arms Race phase is active today, and try to match their duel actions to it.' : 'Player checks in-game calendar. 1 swap per day. Double-dip Duel actions with matching Arms Race phase.'}

Generate the briefing card now. Stay strictly within the data provided above.`

  return { systemPrompt, userPrompt }
}