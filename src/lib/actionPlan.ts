// lib/actionPlan.ts
// Rules-based daily action plan engine
// No API cost — pure logic from commander profile

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low'
export type ActionCategory = 'arms_race' | 'alliance_duel' | 'troops' | 'heroes' | 'research' | 'spend' | 'defense' | 'general'

export interface DailyAction {
  id: string
  title: string
  description: string
  priority: ActionPriority
  category: ActionCategory
  points?: string        // Arms Race points value if applicable
  timeRequired?: string  // "5 min" | "15 min" | "30 min"
  buddyPrompt?: string   // Pre-filled Buddy AI prompt for going deeper
}

export interface DailyPlan {
  greeting: string
  dutyReport: string       // "Today is Alliance Duel Day 4 (Heroes)"
  actions: DailyAction[]
  insight?: string         // One key strategic insight for today
}

// Alliance Duel day info
const DUEL_DAYS: Record<number, { name: string; points: number; description: string }> = {
  1: { name: 'Drones', points: 1, description: 'Upgrade drones for alliance points' },
  2: { name: 'Building', points: 2, description: 'Complete building upgrades' },
  3: { name: 'Research', points: 2, description: 'Complete research tasks' },
  4: { name: 'Heroes', points: 2, description: 'Level up heroes' },
  5: { name: 'Training', points: 2, description: 'Train troops' },
  6: { name: 'Enemy Buster', points: 4, description: 'Fight enemy server — highest value day' },
  7: { name: 'Reset', points: 0, description: 'Duel resets tonight' },
}

function getDuelDay(): number {
  // Alliance Duel resets at 8pm CT (2am UTC standard / 1am UTC DST)
  // Sun=1(Drones) Mon=2(Building) Tue=3(Research) Wed=4(Heroes) Thu=5(Training) Fri=6(EnemyBuster) Sat=7(Reset)
  const now = new Date()
  // Use UTC day adjusted for 2am UTC reset
  const utcHour = now.getUTCHours()
  const utcDay = now.getUTCDay() // 0=Sun, 1=Mon, ..., 6=Sat

  // If before 2am UTC, we're still on the previous duel day
  const adjustedDay = utcHour < 2 ? (utcDay === 0 ? 6 : utcDay - 1) : utcDay

  // Map UTC day of week to duel day
  // Sun(0)→1, Mon(1)→2, Tue(2)→3, Wed(3)→4, Thu(4)→5, Fri(5)→6, Sat(6)→7
  const dayMap: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }
  return dayMap[adjustedDay] ?? 1
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export function generateDailyPlan(profile: {
  commander_name: string
  hq_level: number
  troop_tier: string
  troop_type: string
  playstyle: string
  spend_style: string
  server_rank?: number
  hero_power?: number
  goals?: string[]
  server_number?: number
  server_day?: number
}): DailyPlan {
  const duelDay = getDuelDay()
  const duelInfo = DUEL_DAYS[duelDay]
  const timeOfDay = getTimeOfDay()
  const actions: DailyAction[] = []

  const isEndgame = profile.hq_level >= 30
  const isMidgame = profile.hq_level >= 20 && profile.hq_level < 30
  const isEarlyGame = profile.hq_level < 20
  const isT11 = profile.troop_tier?.toLowerCase().includes('t11') || profile.troop_tier?.toLowerCase().includes('t12')
  const isT10 = profile.troop_tier?.toLowerCase().includes('t10')
  const isFighter = profile.playstyle?.toLowerCase().includes('fighter') || profile.playstyle?.toLowerCase().includes('pvp')
  const isDeveloper = profile.playstyle?.toLowerCase().includes('developer') || profile.playstyle?.toLowerCase().includes('pve') || profile.playstyle?.toLowerCase().includes('event')
  const isScout = profile.playstyle?.toLowerCase().includes('scout') || profile.playstyle?.toLowerCase().includes('figuring')
  const isSpender = ['investor', 'whale', 'mega whale', 'moderate'].some(s => profile.spend_style?.toLowerCase().includes(s))
  const isAircraft = profile.troop_type?.toLowerCase().includes('aircraft')

  // ─── ARMS RACE DOUBLE-DIP (Always top priority if applicable) ───
  if (duelDay >= 2 && duelDay <= 5) {
    const duelActionMap: Record<number, string> = {
      2: 'building upgrades',
      3: 'research tasks',
      4: 'hero level-ups',
      5: 'troop training',
    }
    actions.push({
      id: 'arms_race_double_dip',
      title: `⚡ Double-Dip: Arms Race + Duel Day ${duelDay}`,
      description: `Today is Duel Day ${duelDay} (${duelInfo.name}). Every ${duelActionMap[duelDay]} scores BOTH Alliance Duel points AND Arms Race points. This is the highest efficiency move in the game — don't skip it.`,
      priority: 'critical',
      category: 'arms_race',
      points: `${duelInfo.points} Duel pts + Arms Race pts`,
      timeRequired: '15 min',
      buddyPrompt: `Today is Duel Day ${duelDay} (${duelInfo.name}). What are the highest-scoring specific ${duelActionMap[duelDay]} I should focus on right now to maximize both Arms Race and Alliance Duel points?`,
    })
  }

  // ─── ENEMY BUSTER DAY (Day 6 — highest value) ───
  if (duelDay === 6) {
    actions.push({
      id: 'enemy_buster',
      title: '🔥 Enemy Buster Day — 4 Alliance Points',
      description: 'This is the highest-value Alliance Duel day. Fight enemy server targets for 4 alliance points. Coordinate with alliance for maximum impact. Also scores Arms Race points.',
      priority: 'critical',
      category: 'alliance_duel',
      points: '4 Duel pts (highest)',
      timeRequired: '30 min',
      buddyPrompt: 'It\'s Enemy Buster Day (Duel Day 6). What targets should I prioritize on the enemy server given my troop type and power level? Any specific strategy for maximum alliance points?',
    })
  }

  // ─── DRONE DAY (Day 1 — lowest value, still worth noting) ───
  if (duelDay === 1) {
    actions.push({
      id: 'drone_day',
      title: '🚁 Drone Day — Lowest Duel Value',
      description: 'Duel Day 1 (Drones) is worth only 1 alliance point — the lowest day. Still complete it, but save your big resource spends for Days 2–6.',
      priority: 'medium',
      category: 'alliance_duel',
      points: '1 Duel pt',
      timeRequired: '5 min',
      buddyPrompt: 'It\'s Duel Day 1 (Drones). What drone upgrades are worth doing today vs saving for a higher-value duel day?',
    })
  }

  // ─── RESET DAY (Day 7) ───
  if (duelDay === 7) {
    actions.push({
      id: 'duel_reset',
      title: '🔄 Alliance Duel Resets Tonight',
      description: 'Duel resets tonight. Use any remaining alliance points, check final standings, and prepare for next cycle starting tomorrow (Drone Day).',
      priority: 'high',
      category: 'alliance_duel',
      timeRequired: '5 min',
      buddyPrompt: 'Alliance Duel resets tonight. What should I do before the reset to maximize my final standing?',
    })
  }

  // ─── ARMS RACE DAILY ───
  actions.push({
    id: 'arms_race_daily',
    title: '🏆 Check Arms Race Standing',
    description: isEndgame
      ? 'Check your current Arms Race rank. With your power level, every action today should be mapped to Arms Race scoring. Don\'t waste actions that don\'t score.'
      : isEarlyGame
      ? 'Open Arms Race and complete the 2–3 highest-scoring actions for your HQ level. Don\'t burn resources chasing points you can\'t afford.'
      : 'Review Arms Race categories and focus spend on whichever category gives you the most points per resource spent today.',
    priority: 'high',
    category: 'arms_race',
    timeRequired: '5 min',
    buddyPrompt: `What are the highest Arms Race scoring actions available to me today at HQ ${profile.hq_level} with ${profile.troop_tier} troops?`,
  })

  // ─── HERO POWER (if Duel Day 4 or rank-based goal) ───
  if (duelDay === 4) {
    actions.push({
      id: 'hero_leveling',
      title: '⭐ Hero Day — Level Up Heroes Now',
      description: 'Duel Day 4 is Heroes. Level up, skill up, and promote heroes today. Every hero action scores Duel points AND Arms Race points. Best hero efficiency day of the week.',
      priority: 'critical',
      category: 'heroes',
      points: '2 Duel pts',
      timeRequired: '20 min',
      buddyPrompt: 'It\'s Hero Day (Duel Day 4). Which specific heroes should I level up or promote first to maximize both my hero power ranking and alliance duel points?',
    })
  }

  // ─── TROOP TRAINING (Duel Day 5) ───
  if (duelDay === 5) {
    actions.push({
      id: 'troop_training',
      title: `🪖 Training Day — Queue ${profile.troop_type || 'Troops'} Now`,
      description: `Duel Day 5 is Training. Queue up ${profile.troop_type || 'troop'} training now — every troop trained scores both Alliance Duel and Arms Race points. Don't let your barracks sit idle today.`,
      priority: 'critical',
      category: 'troops',
      points: '2 Duel pts',
      timeRequired: '10 min',
      buddyPrompt: `It's Training Day (Duel Day 5). What troops should I train and how many given my current ${profile.troop_tier} tier and ${profile.troop_type} specialization?`,
    })
  }

  // ─── T11 SPECIFIC (endgame) ───
  if (isT11 && isEndgame) {
    actions.push({
      id: 't11_armament',
      title: '⚔️ T11 Armament Research — Check Progress',
      description: 'Review your T11 Armament Research branches. Prioritize the branch that unlocks your next Aircraft accessory or weapon. Every day without queued Armament Research is a day wasted.',
      priority: 'high',
      category: 'research',
      timeRequired: '10 min',
      buddyPrompt: 'Where should I focus my T11 Armament Research today? My Accessories are 89% complete. What\'s the highest-impact branch to prioritize next?',
    })
  }

  // ─── T10 PATH (midgame) ───
  if (isT10 && isMidgame) {
    actions.push({
      id: 't10_research',
      title: '🔬 T10 Research Queue — Keep It Moving',
      description: 'Check your T10 research queue. Never let it go idle. If you\'re close to unlocking the next tier, prioritize those prerequisites above all other research.',
      priority: 'high',
      category: 'research',
      timeRequired: '5 min',
      buddyPrompt: `I'm HQ ${profile.hq_level} working towards T10. What research should I be prioritizing right now to unlock T10 as fast as possible?`,
    })
  }

  // ─── EARLY GAME FOCUS ───
  if (isEarlyGame) {
    actions.push({
      id: 'hq_upgrade',
      title: '🏗️ HQ Upgrade — Your #1 Priority',
      description: `At HQ ${profile.hq_level}, upgrading your HQ unlocks new buildings, troops, and research. Everything else is secondary. If your HQ can be upgraded today, do it first.`,
      priority: 'critical',
      category: 'general',
      timeRequired: '5 min',
      buddyPrompt: `I'm at HQ ${profile.hq_level}. What do I need to do to upgrade my HQ to the next level as fast as possible?`,
    })

    actions.push({
      id: 'early_game_guide',
      title: '📋 Daily Essentials Checklist',
      description: 'Complete your daily basics: collect all resource buildings, run Marshal\'s Guard, complete Zombie Siege, check General\'s Trial. These compound over time.',
      priority: 'high',
      category: 'general',
      timeRequired: '15 min',
      buddyPrompt: `I'm on Day ${profile.server_day || 'unknown'} at HQ ${profile.hq_level}. What are my absolute must-do daily tasks I shouldn't miss?`,
    })
  }

  // ─── FIGHTER-SPECIFIC ───
  if (isFighter && isEndgame) {
    actions.push({
      id: 'fighter_prep',
      title: '⚔️ PvP Readiness Check',
      description: 'Review your march lineup and defense squads. Check Warzone activity on your server. If Kill Event is within 3 days, start stacking troops and preparing RSS caches.',
      priority: 'medium',
      category: 'defense',
      timeRequired: '10 min',
      buddyPrompt: 'What\'s the current PvP threat level on my server and what should I be doing to prepare my defenses and march power for Kill Event?',
    })
  }

  // ─── SPEND ALERT (Investor+) ───
  if (isSpender) {
    actions.push({
      id: 'hot_deal_check',
      title: '💰 Check Today\'s Hot Deals',
      description: 'New Hot Deals may have refreshed. Screenshot any active deals and ask Buddy — it will analyze the pack contents against your current bottleneck and upcoming events to tell you if it\'s worth buying.',
      priority: 'medium',
      category: 'spend',
      timeRequired: '5 min',
      buddyPrompt: 'I\'m checking Hot Deals today. Can you remind me what my current biggest resource/material bottleneck is so I know what pack types to prioritize?',
    })
  }

  // ─── AIRCRAFT-SPECIFIC ───
  if (isAircraft && isEndgame) {
    actions.push({
      id: 'aircraft_counter',
      title: '🛩️ Aircraft Advantage — Check Enemy Composition',
      description: 'Aircraft beats Infantry. If you\'re planning any PvP or Enemy Buster action today, scout for Infantry-heavy targets. Your Aircraft specialization is most effective against Infantry defenders.',
      priority: 'low',
      category: 'general',
      timeRequired: '5 min',
      buddyPrompt: 'What\'s the best way to leverage my Aircraft specialization in today\'s events? Any specific target types or formations I should be looking for?',
    })
  }

  // Sort: critical first, then high, then medium, then low
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // Cap at 6 actions max to avoid overwhelm
  const topActions = actions.slice(0, 6)

  // Build greeting
  const greetingMap = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  }
  const greeting = `${greetingMap[timeOfDay]}, Commander ${profile.commander_name || ''}`

  // Duty report
  const dutyReport = duelDay === 7
    ? `Alliance Duel resets tonight. Server ${profile.server_number || ''} · Day ${profile.server_day || ''}`
    : `Alliance Duel Day ${duelDay} — ${duelInfo.name} (${duelInfo.points} pt${duelInfo.points !== 1 ? 's' : ''}). Server ${profile.server_number || ''} · Day ${profile.server_day || ''}`

  // Strategic insight
  let insight: string | undefined
  if (duelDay >= 2 && duelDay <= 5) {
    insight = `Double-dip day: every ${duelInfo.name.toLowerCase()} action scores both Duel and Arms Race points simultaneously.`
  } else if (duelDay === 6) {
    insight = `Enemy Buster is worth 4× more alliance points than Drone Day. This is the most important Duel day of the week.`
  } else if (isT11) {
    insight = `T11 Armament Research is the #1 long-term power multiplier at your level. Keep it queued every day.`
  }

  return {
    greeting,
    dutyReport,
    actions: topActions,
    insight,
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                           