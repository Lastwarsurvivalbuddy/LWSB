// src/lib/actionPlan.ts
// Rules engine for daily action plan — zero API cost
// Updated: March 8, 2026 — profile data model redesign (buckets replace raw stats)
// Updated: March 9, 2026 — corrected Alliance Duel day mapping + real game labels
// Updated: March 17, 2026 — beginner_mode support
// Updated: March 17, 2026 — hero upgrades locked to Day 4 only, greeting uses commander_name
// Updated: March 17, 2026 — full day-by-day beginner plan rewrite with correct per-day actions

import type { SquadPowerTier, RankBucket, PowerBucket, KillTier } from '@/lib/profileTypes'
import { SQUAD_POWER_TIER_LABELS, RANK_BUCKET_LABELS, KILL_TIER_TITLES } from '@/lib/profileTypes'

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low'

export type ActionCategory =
  | 'arms_race'
  | 'alliance_duel'
  | 'troops'
  | 'heroes'
  | 'research'
  | 'spend'
  | 'defense'
  | 'general'

export interface DailyAction {
  id: string
  category: ActionCategory
  priority: ActionPriority
  title: string
  detail: string
  description?: string
  buddyPrompt: string
  points?: number
  timeRequired?: string
}

export interface ActionPlanResult {
  actions: DailyAction[]
  duelDay: number
  duelDayLabel: string
  duelDayPoints: number
  strategicInsight: string
  greeting: string
  dutyReport: string
  insight: string
}

// ─── Hero EXP Breakpoints ──────────────────────────────────────────────────────
export const HERO_EXP_BREAKPOINTS: Record<number, { expFromL1: number; label: string; hqRequired: number }> = {
  50:  { expFromL1: 2_500_000,   label: 'Early game milestone',          hqRequired: 10 },
  68:  { expFromL1: 4_500_000,   label: 'Major power spike begins',      hqRequired: 14 },
  69:  { expFromL1: 4_500_000,   label: 'Major power spike',             hqRequired: 14 },
  70:  { expFromL1: 4_900_000,   label: 'Skill unlock tier',             hqRequired: 14 },
  72:  { expFromL1: 5_900_000,   label: 'Ultimate enhancement unlock',   hqRequired: 15 },
  100: { expFromL1: 33_000_000,  label: 'Mid-game milestone',            hqRequired: 20 },
  175: { expFromL1: 999_999_999, label: 'Max level',                     hqRequired: 35 },
}

export const HQ_HERO_LEVEL_UNLOCK: Record<number, number> = {
  1: 1, 5: 30, 10: 50, 14: 70, 15: 72, 16: 75, 18: 80, 20: 100, 25: 120, 30: 150, 35: 175,
}

export function getMaxHeroLevelForHQ(hqLevel: number): number {
  const keys = Object.keys(HQ_HERO_LEVEL_UNLOCK)
    .map(Number)
    .filter(k => k <= hqLevel)
    .sort((a, b) => b - a)
  return keys.length > 0 ? HQ_HERO_LEVEL_UNLOCK[keys[0]] : 1
}

export function getNextHeroMilestone(hqLevel: number): { targetHQ: number; heroLevel: number } | null {
  const entries = Object.entries(HQ_HERO_LEVEL_UNLOCK)
    .map(([hq, lvl]) => ({ targetHQ: Number(hq), heroLevel: lvl }))
    .filter(e => e.targetHQ > hqLevel)
    .sort((a, b) => a.targetHQ - b.targetHQ)
  return entries.length > 0 ? entries[0] : null
}

export function getNextExpBreakpoint(currentHeroLevel: number): { level: number; label: string; expNeeded: number } | null {
  const entry = Object.entries(HERO_EXP_BREAKPOINTS)
    .map(([lvl, data]) => ({ level: Number(lvl), ...data }))
    .filter(e => e.level > currentHeroLevel)
    .sort((a, b) => a.level - b.level)[0]
  return entry ? { level: entry.level, label: entry.label, expNeeded: entry.expFromL1 } : null
}

// ─── Alliance Duel Day Calculation ─────────────────────────────────────────────
// Reset is always 2am UTC — no DST adjustment ever applied
//
// 2am UTC Mon → Day 1: Radar Training      (1 pt)
// 2am UTC Tue → Day 2: Base Expansion      (2 pts)
// 2am UTC Wed → Day 3: Age of Science      (2 pts)
// 2am UTC Thu → Day 4: Train Heroes        (2 pts)  ← ONLY day for hero upgrades
// 2am UTC Fri → Day 5: Total Mobilization  (2 pts)
// 2am UTC Sat → Day 6: Enemy Buster        (4 pts)
// 2am UTC Sun → Day 7: Reset               (0 pts)

interface DuelDayResult {
  day: number
  label: string
  points: number
}

export function getDuelDay(now: Date = new Date()): DuelDayResult {
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  const utcDay = adjusted.getUTCDay()
  const schedule: Record<number, DuelDayResult> = {
    0: { day: 7, label: 'Reset',              points: 0 },
    1: { day: 1, label: 'Radar Training',     points: 1 },
    2: { day: 2, label: 'Base Expansion',     points: 2 },
    3: { day: 3, label: 'Age of Science',     points: 2 },
    4: { day: 4, label: 'Train Heroes',       points: 2 },
    5: { day: 5, label: 'Total Mobilization', points: 2 },
    6: { day: 6, label: 'Enemy Buster',       points: 4 },
  }
  return schedule[utcDay]
}

// ─── Profile Types ─────────────────────────────────────────────────────────────
export interface CommanderProfile {
  hq_level: number
  commander_name?: string
  server_day?: number
  season?: number
  spend_style: string
  playstyle: string
  troop_type: string
  troop_tier: string // under_t10 | t10 | t11
  rank_bucket?: RankBucket
  squad_power_tier?: SquadPowerTier
  power_bucket?: PowerBucket
  kill_tier?: KillTier
  tier?: string
  beginner_mode?: boolean
}

// ─── Friendly display helpers ──────────────────────────────────────────────────
function squadPowerLabel(tier?: SquadPowerTier): string {
  if (!tier) return 'unknown'
  return SQUAD_POWER_TIER_LABELS[tier] ?? tier
}

function rankLabel(bucket?: RankBucket): string {
  if (!bucket) return 'unknown rank'
  return RANK_BUCKET_LABELS[bucket] ?? bucket
}

function killTitle(tier?: KillTier): string {
  if (!tier) return ''
  return KILL_TIER_TITLES[tier] ?? tier
}

function getGreeting(profile: CommanderProfile): string {
  const name = profile.commander_name?.trim()
  return name ? `Commander ${name}` : 'Commander'
}

// ─── Beginner Action Plan Generator ────────────────────────────────────────────
// HARD RULES:
//   - Hero upgrades: Day 4 ONLY. Never any other day.
//   - Troop training: Day 5 ONLY.
//   - No HQ push action on any day.
//   - Radar tasks: open Days 1, 3, 5 only. Save all other days.
//   - Survivor cards: open Day 2 only. Never mention saving them.
//   - Gold tasks/trucks: Day 2 and Day 6 only.
//   - Never mention starting builds or saving survivors.

function generateBeginnerActionPlan(profile: CommanderProfile): ActionPlanResult {
  const actions: DailyAction[] = []
  const { day, label, points } = getDuelDay()
  const hq = profile.hq_level || 1
  const maxHeroLevel = getMaxHeroLevelForHQ(hq)
  const nextBreakpoint = getNextExpBreakpoint(maxHeroLevel)

  switch (day) {

    // ── DAY 1: Radar Training ──────────────────────────────────────────────────
    case 1:
      actions.push({
        id: 'day1_drone',
        category: 'general',
        priority: 'critical',
        title: '🚁 Upgrade Drone Data & Parts',
        detail: 'Use your drone data and drone parts to upgrade your drone today. This is the primary scoring action for Radar Training day (1 pt). Check all available drone upgrade slots.',
        buddyPrompt: `Today is Alliance Duel Day 1 — Radar Training. I'm at HQ ${hq}. How do I upgrade my drone efficiently? What data and parts should I prioritize?`,
        points: 1,
      })
      actions.push({
        id: 'day1_radar',
        category: 'general',
        priority: 'high',
        title: '📡 Clear Your Radar Tasks',
        detail: 'Today is one of three days this week where radar tasks score VS points (Days 1, 3, 5). Open and complete your radar tasks now.',
        buddyPrompt: `Today is Day 1 — radar tasks score today. I'm at HQ ${hq}. Which radar tasks should I prioritize and how do I complete them efficiently?`,
      })
      actions.push({
        id: 'day1_gather',
        category: 'general',
        priority: 'medium',
        title: '🌾 Send Out Gatherers',
        detail: 'Send your troops out to gather resources on the map. Keep your marches busy all day. Focus on whatever resource is your current bottleneck.',
        buddyPrompt: `I'm at HQ ${hq} on server day ${profile.server_day ?? '?'}. What resources should I be gathering today and what's the most efficient gathering setup for my level?`,
      })
      break

    // ── DAY 2: Base Expansion ──────────────────────────────────────────────────
    case 2:
      actions.push({
        id: 'day2_builds',
        category: 'alliance_duel',
        priority: 'critical',
        title: '🏗️ Complete Building Upgrades — Scores Today',
        detail: 'Today is Base Expansion — finishing building upgrades earns alliance points (2 pts). Complete anything in queue and keep your builders busy all day.',
        buddyPrompt: `Today is Alliance Duel Day 2 — Base Expansion. I'm at HQ ${hq}, server day ${profile.server_day ?? '?'}. What buildings should I prioritize upgrading today to score the most alliance points?`,
        points: 2,
      })
      actions.push({
        id: 'day2_survivors',
        category: 'general',
        priority: 'high',
        title: '🃏 Open Your Survivor Recruitment Tickets',
        detail: 'Survivor Recruitment Tickets score VS points on Day 2 only. Open all your tickets now to earn points for your alliance.',
        buddyPrompt: `Today is Day 2 — survivor tickets score today. I'm at HQ ${hq}. How do I get the most out of my survivor tickets and what survivors should I be looking for at my level?`,
      })
      actions.push({
        id: 'day2_tasks',
        category: 'general',
        priority: 'medium',
        title: '✅ Deploy Gold Tasks & Gold Trucks Only',
        detail: 'Only use gold (high-value) tasks and gold trucks today — they score the most VS points. Skip silver and bronze tasks. Save radar tasks — today is not a radar scoring day.',
        buddyPrompt: `Today is Day 2. I'm at HQ ${hq}. How do I identify gold tasks vs lower-tier tasks, and how do I maximize VS points from tasks today?`,
      })
      break

    // ── DAY 3: Age of Science ──────────────────────────────────────────────────
    case 3:
      actions.push({
        id: 'day3_research',
        category: 'research',
        priority: 'critical',
        title: '🔬 Complete Research — Scores Today',
        detail: 'Today is Age of Science — completing research earns alliance points (2 pts). Finish anything in queue and start new research. Use Secretary of Science to cut time. Focus on Military tree.',
        buddyPrompt: `Today is Alliance Duel Day 3 — Age of Science. I'm at HQ ${hq}, troop type ${profile.troop_type}. What research should I complete today for the most alliance points and best long-term progression?`,
        points: 2,
      })
      actions.push({
        id: 'day3_drone_chests',
        category: 'general',
        priority: 'high',
        title: '📦 Open Drone Component Chests',
        detail: 'Open your drone component chests today — these score VS points on Day 3. Check your inventory for any drone component chests and open them all.',
        buddyPrompt: `Today is Day 3 — drone component chests score today. I'm at HQ ${hq}. How do I get more drone component chests and what components should I prioritize?`,
      })
      actions.push({
        id: 'day3_radar',
        category: 'general',
        priority: 'high',
        title: '📡 Open Radar Tasks — Scores Today',
        detail: 'Today is one of three radar scoring days (Days 1, 3, 5). Open and complete your radar tasks now to earn VS points.',
        buddyPrompt: `Today is Day 3 — radar tasks score today. I'm at HQ ${hq}. Which radar tasks give the most points and how should I complete them?`,
      })
      break

    // ── DAY 4: Train Heroes ────────────────────────────────────────────────────
    case 4:
      actions.push({
        id: 'day4_heroes',
        category: 'heroes',
        priority: 'critical',
        title: '🦸 Hero Day — Use Your EXP Items NOW',
        detail: `Today is Train Heroes — the ONLY day of the week to spend Hero EXP items. Every hero level scores alliance points (2 pts). Your heroes can reach level ${maxHeroLevel}. ${nextBreakpoint ? `Push toward level ${nextBreakpoint.level} for a power spike.` : 'Push your main hero as high as you can.'} Use everything you have saved.`,
        buddyPrompt: `Today is Alliance Duel Day 4 — Train Heroes, the only day hero EXP scores. I'm at HQ ${hq}, max hero level ${maxHeroLevel}. Which heroes should I prioritize and how do I maximize alliance points today?`,
        points: 2,
      })
      actions.push({
        id: 'day4_radar_save',
        category: 'general',
        priority: 'medium',
        title: '📡 Save Radar Tasks — Not a Scoring Day',
        detail: 'Today is NOT a radar scoring day. Hold your radar tasks — use them on Days 1, 3, and 5 only.',
        buddyPrompt: `Today is Day 4. I'm at HQ ${hq}. What else can I do today alongside hero leveling to maximize my progress?`,
      })
      break

    // ── DAY 5: Total Mobilization ──────────────────────────────────────────────
    case 5:
      actions.push({
        id: 'day5_troops',
        category: 'troops',
        priority: 'critical',
        title: `🪖 Train ${getTroopTypeLabel(profile.troop_type)} Troops All Day`,
        detail: `Today is Total Mobilization — every troop you train scores alliance points (2 pts). Keep your barracks running non-stop. Focus on ${getTroopTypeLabel(profile.troop_type)} troops at the highest tier you can train.`,
        buddyPrompt: `Today is Alliance Duel Day 5 — Total Mobilization. I'm at HQ ${hq} with ${profile.troop_type} troops at ${profile.troop_tier}. How do I maximize troop training today for the most alliance points?`,
        points: 2,
      })
      actions.push({
        id: 'day5_radar',
        category: 'general',
        priority: 'high',
        title: '📡 Open Radar Tasks — Scores Today',
        detail: 'Today is one of three radar scoring days (Days 1, 3, 5). Open and complete your radar tasks now to earn VS points alongside troop training.',
        buddyPrompt: `Today is Day 5 — radar tasks score today. I'm at HQ ${hq}. Which radar tasks give the best return and how do I complete them alongside troop training?`,
      })
      break

    // ── DAY 6: Enemy Buster ────────────────────────────────────────────────────
    case 6:
      actions.push({
        id: 'day6_battle',
        category: 'alliance_duel',
        priority: 'critical',
        title: '⚔️ Alliance Battle Day — Coordinate with Your Leader',
        detail: 'Today is Enemy Buster — the highest-value alliance day of the week (4 pts). Your whole alliance attacks another server together. Check your alliance chat for instructions from your leader and participate.',
        buddyPrompt: `Today is Alliance Duel Day 6 — Enemy Buster, worth 4 alliance points. I'm at HQ ${hq}. How can I contribute to my alliance today and what should I be doing during the battle?`,
        points: 4,
      })
      actions.push({
        id: 'day6_tasks',
        category: 'general',
        priority: 'high',
        title: '✅ Deploy Gold Tasks & Gold Trucks Only',
        detail: 'Only use gold (high-value) tasks and gold trucks today — they score the most VS points. Skip silver and bronze tasks.',
        buddyPrompt: `Today is Day 6. I'm at HQ ${hq}. How do I tell which tasks are gold tier, and how do I maximize VS points from tasks alongside the alliance battle?`,
      })
      break

    // ── DAY 7: Reset ───────────────────────────────────────────────────────────
    case 7:
      actions.push({
        id: 'day7_gather',
        category: 'general',
        priority: 'medium',
        title: '🌾 Start Long Gather Runs Before Reset',
        detail: 'Before the 2am UTC reset, send your troops out on long gathering runs. They\'ll complete after the reset and resources count toward Day 1 gathering points.',
        buddyPrompt: `Today is Alliance Duel reset day. I'm at HQ ${hq}. How do I set up gathering runs before the reset to maximize my Day 1 resources? What should I be gathering?`,
      })
      actions.push({
        id: 'day7_radar_save',
        category: 'general',
        priority: 'medium',
        title: '📡 Save Radar Tasks — Use Tomorrow on Day 1',
        detail: 'Today is NOT a radar scoring day. Hold your radar tasks and use them tomorrow on Day 1 when they score VS points.',
        buddyPrompt: `Today is the reset day. I'm at HQ ${hq}. What should I do to set myself up well for the new week?`,
      })
      break
  }

  const priorityOrder: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const strategicInsight = getBeginnerStrategicInsight(day, hq)

  return {
    actions: actions.slice(0, 4),
    duelDay: day,
    duelDayLabel: label,
    duelDayPoints: points,
    strategicInsight,
    greeting: getGreeting(profile),
    dutyReport: `Server Day ${profile.server_day || '—'} · Today's Alliance Event: ${label}`,
    insight: strategicInsight,
  }
}

function getTroopTypeLabel(troopType: string): string {
  const map: Record<string, string> = { aircraft: 'Aircraft', tank: 'Tank', missile: 'Missile' }
  return map[troopType] ?? troopType
}

function getBeginnerStrategicInsight(day: number, hq: number): string {
  const insights: Record<number, string> = {
    1: `Today is Radar Training — upgrade your drone, clear radar tasks, and send gatherers out. Low-key scoring day.`,
    2: `Today is Base Expansion — complete building upgrades and open your survivor tickets. Gold tasks and trucks only. Save radar tasks.`,
    3: `Today is Age of Science — complete research and open drone component chests. Open your radar tasks today, they score now.`,
    4: `Today is Train Heroes — the ONLY day to use Hero EXP items. Every level scores alliance points. Save radar tasks.`,
    5: `Today is Total Mobilization — train troops non-stop and open your radar tasks. Both score alliance points today.`,
    6: `Today is Enemy Buster — biggest alliance day of the week (4 pts). Coordinate with your leader. Gold tasks and trucks only.`,
    7: `Today is reset day — no scoring. Start gather runs before the 2am UTC reset and save your radar tasks for tomorrow.`,
  }
  return insights[day] ?? `HQ ${hq} — keep building and stay consistent.`
}

// ─── Main Action Plan Generator ────────────────────────────────────────────────
export function generateActionPlan(profile: CommanderProfile): ActionPlanResult {
  if (profile.beginner_mode) {
    return generateBeginnerActionPlan(profile)
  }

  const actions: DailyAction[] = []
  const { day, label, points } = getDuelDay()

  const isDoubleDay      = day >= 2 && day <= 5
  const isEnemyBusterDay = day === 6
  const isDroneDay       = day === 1
  const isResetDay       = day === 7

  const hq          = profile.hq_level || 1
  const isEarlyGame = hq < 16
  const isMidGame   = hq >= 16 && hq < 30
  const isEndGame   = hq >= 30

  const isT11      = profile.troop_tier === 't11'
  const isT10      = profile.troop_tier === 't10'
  const isBelowT10 = profile.troop_tier === 'under_t10'
  const isSpender  = ['investor', 'whale', 'mega_whale'].includes(profile.spend_style)

  const maxHeroLevel      = getMaxHeroLevelForHQ(hq)
  const nextHeroMilestone = getNextHeroMilestone(hq)
  const nextBreakpoint    = getNextExpBreakpoint(maxHeroLevel)

  if (isDoubleDay) {
    actions.push({
      id: 'double_dip',
      category: 'alliance_duel',
      priority: 'critical',
      title: `⚡ Double-Dip Day — Duel Day ${day}: ${label} + Arms Race`,
      detail: `Today is Alliance Duel Day ${day} (${label}, ${points} pts). Every action you take for the Duel ALSO scores Arms Race points. Focus: ${getDuelFocusDetail(day, profile)}.`,
      buddyPrompt: `Today is Alliance Duel Day ${day} (${label}). Help me maximize both my Duel score AND Arms Race points. My HQ is ${hq}, troop tier is ${profile.troop_tier}, playstyle is ${profile.playstyle}.`,
      points,
    })
  }

  if (isEnemyBusterDay) {
    actions.push({
      id: 'enemy_buster',
      category: 'alliance_duel',
      priority: 'critical',
      title: '🔥 Enemy Buster Day — 4 Alliance Points (Max Value)',
      detail: 'Day 6 of Alliance Duel is the highest-value day of the week (4 pts). Coordinate with alliance, maximize kills, use march buffs.',
      buddyPrompt: `Today is Alliance Duel Day 6 — Enemy Buster, worth 4 alliance points. My HQ is ${hq}, Squad 1 power is ${squadPowerLabel(profile.squad_power_tier)}, troop type is ${profile.troop_type}, rank is ${rankLabel(profile.rank_bucket)}.`,
      points: 4,
    })
  }

  if (isDroneDay) {
    actions.push({
      id: 'radar_training_day',
      category: 'alliance_duel',
      priority: 'medium',
      title: '🚁 Radar Training Day — Alliance Duel Day 1 (1 Point)',
      detail: 'Lowest-value Duel day. Focus on development tasks. Complete drone upgrades if available.',
      buddyPrompt: `Today is Alliance Duel Day 1 (Radar Training, 1 point). What should I focus on to set up for the week? HQ ${hq}, troop tier ${profile.troop_tier}.`,
      points: 1,
    })
  }

  // HARD RULE: Hero upgrades Day 4 ONLY
  if (day === 4) {
    actions.push({
      id: 'hero_exp_duel',
      category: 'heroes',
      priority: 'critical',
      title: '🦸 Train Heroes Day — Level Up Heroes for Duel + Arms Race',
      detail: `Duel Day 4 is Train Heroes. Every hero level scores Alliance Duel AND Arms Race simultaneously. At HQ ${hq} heroes can reach level ${maxHeroLevel}. ${nextBreakpoint ? `Next power spike: level ${nextBreakpoint.level} (${nextBreakpoint.label}).` : 'Push to max level.'}`,
      buddyPrompt: `Today is Duel Day 4 — Train Heroes. HQ ${hq}, max hero level ${maxHeroLevel}. ${nextBreakpoint ? `Next breakpoint: level ${nextBreakpoint.level}: ${nextBreakpoint.label}.` : ''} What heroes should I prioritize?`,
      points: 2,
    })
  }

  if (day === 5) {
    actions.push({
      id: 'troop_training_duel',
      category: 'troops',
      priority: 'high',
      title: '🪖 Total Mobilization — Max Troop Training for Duel + Arms Race',
      detail: `Every troop trained scores Alliance Duel AND Arms Race simultaneously. Queue max ${profile.troop_type} training. ${isBelowT10 ? 'Focus on highest tier available.' : isT10 ? 'Push T10 training.' : 'T11 maximizes point value.'}`,
      buddyPrompt: `Today is Duel Day 5 — Total Mobilization. Troop type ${profile.troop_type}, tier ${profile.troop_tier}, HQ ${hq}. What's the optimal training strategy?`,
    })
  }

  if (day === 3) {
    actions.push({
      id: 'research_duel',
      category: 'research',
      priority: 'high',
      title: '🔬 Age of Science — Complete Research for Duel + Arms Race',
      detail: `Completing research scores both Duel and Arms Race. ${isT11 ? 'Focus on T11 Armament Research.' : isT10 ? 'Push military research toward T11.' : 'Complete highest available military research.'}`,
      buddyPrompt: `Today is Duel Day 3 — Age of Science. HQ ${hq}, troop tier ${profile.troop_tier}, troop type ${profile.troop_type}. What research maximizes both Duel and Arms Race scoring?`,
    })
  }

  if (day === 2) {
    actions.push({
      id: 'building_duel',
      category: 'alliance_duel',
      priority: 'high',
      title: '🏗️ Base Expansion — Upgrade Buildings for Duel + Arms Race',
      detail: `Complete building upgrades to score Duel and Arms Race points. ${isEarlyGame ? 'Prioritize Barracks and Military Academy.' : isMidGame ? 'Focus on production and military buildings.' : 'Push high-level military buildings and Overlord.'}`,
      buddyPrompt: `Today is Duel Day 2 — Base Expansion. HQ ${hq}, server day ${profile.server_day}. What buildings maximize both Duel and Arms Race scoring?`,
    })
  }

  if (isBelowT10 && !isDoubleDay && !isResetDay) {
    actions.push({
      id: 't10_path',
      category: 'troops',
      priority: 'high',
      title: '🎯 T10 Unlock Path — Check Your Prerequisites',
      detail: `${hq < 16 ? `HQ ${hq} — focus on reaching HQ 16 as your primary goal.` : 'You have the HQ level — check research prerequisites in the Military tree.'}`,
      buddyPrompt: `Working toward T10. HQ ${hq}, server day ${profile.server_day}, troop tier ${profile.troop_tier}. What are my exact prerequisites and what should I do today?`,
    })
  }

  if (isT11 && !isDoubleDay && !isResetDay) {
    actions.push({
      id: 't11_armament',
      category: 'troops',
      priority: 'high',
      title: '⚙️ T11 Armament Research — Check Branch Progress',
      detail: 'T11 Armament Research has multiple branches (Ground, Air, Missile, Accessories). Review current branch completion and queue next materials.',
      buddyPrompt: `T11 Armament Research. Troop type ${profile.troop_type}, HQ ${hq}. Which branches should I focus on and what materials do I need next?`,
    })
  }

  if (isSpender && !isResetDay) {
    actions.push({
      id: 'hot_deal_check',
      category: 'spend',
      priority: 'medium',
      title: "💰 Check Today's Hot Deals",
      detail: `Check today's Hot Deals for time-limited offers. Screenshot any active deal and ask Buddy if it's worth buying.`,
      buddyPrompt: `${profile.spend_style} player at HQ ${hq}, ${profile.troop_tier} troops, Squad 1 power ${squadPowerLabel(profile.squad_power_tier)}. Evaluate today's Hot Deals — what's my biggest bottleneck a pack could solve?`,
    })
  }

  if (isEndGame && !isDoubleDay && !isResetDay) {
    actions.push({
      id: 'defense_review',
      category: 'defense',
      priority: 'low',
      title: '🛡️ Defense Review — Check Squad Position Balance',
      detail: 'Squads engage in position order (1→2→3→4). Ensure your strongest squad is in position 1. Consider troop type counter advantages.',
      buddyPrompt: `Defense review. Troop type ${profile.troop_type}, HQ ${hq}, Squad 1 power ${squadPowerLabel(profile.squad_power_tier)}, rank ${rankLabel(profile.rank_bucket)}${profile.kill_tier ? `, kill tier: ${killTitle(profile.kill_tier)}` : ''}. Is my defense optimal?`,
    })
  }

  const strategicInsight = getStrategicInsight(day, label, points, profile, maxHeroLevel, isDoubleDay)
  const priorityOrder: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return {
    actions: actions.slice(0, 6),
    duelDay: day,
    duelDayLabel: label,
    duelDayPoints: points,
    strategicInsight,
    greeting: getGreeting(profile),
    dutyReport: `Server Day ${profile.server_day || '—'} · Duel Day ${day}: ${label}`,
    insight: strategicInsight,
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDuelFocusDetail(day: number, profile: CommanderProfile): string {
  switch (day) {
    case 2: return 'complete building upgrades — every completion scores both Duel + Arms Race'
    case 3: return 'complete research — queue and finish military research for double points'
    case 4: return 'level up heroes — every hero level scores Duel + Arms Race simultaneously'
    case 5: return `train ${profile.troop_type} troops — every troop trained scores Duel + Arms Race`
    default: return 'check alliance duel requirements'
  }
}

function getStrategicInsight(
  day: number,
  label: string,
  points: number,
  profile: CommanderProfile,
  maxHeroLevel: number,
  isDoubleDay: boolean
): string {
  if (isDoubleDay) {
    if (day === 4) {
      return `Today is Train Heroes Day — the ONLY day to spend Hero EXP items. Every hero level scores both Alliance Duel and Arms Race simultaneously.`
    }
    return `Double-dip day — every action for Alliance Duel Day ${day} (${label}) simultaneously scores Arms Race points. Highest efficiency play in the game.`
  }
  if (day === 6) return `Enemy Buster Day — 4 Alliance Duel points, highest of the week. Coordinate with alliance leadership for maximum kills.`
  if (day === 7) return `Reset day — no scoring today. Start gather runs before the 2am UTC reset and save radar tasks for tomorrow.`
  if (day === 1) return `Radar Training — lowest-value Duel day (1 point). Upgrade drones, gather resources, clear radar tasks.`
  const nextMilestone = getNextHeroMilestone(profile.hq_level)
  return nextMilestone
    ? `HQ ${profile.hq_level} unlocks hero level ${maxHeroLevel}. Reach HQ ${nextMilestone.targetHQ} to unlock hero level ${nextMilestone.heroLevel}.`
    : `Heroes at max unlock level ${maxHeroLevel}. Focus on Armament Research and troop tier progression.`
}

export const generateDailyPlan = generateActionPlan