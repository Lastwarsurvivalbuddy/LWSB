/**
 * lwtCrystalEventData.ts — Crystal Event knowledge surface
 *
 * Canonical data for the Last War: Survival Crystal Event: Crystal Factory,
 * Amethyst Crystal / Crystal Ore economy, Crystal Shop, and Crystal Boss.
 *
 * SOURCE (pulled via Chrome MCP get_page_text, 2026-08-18 — never WebFetch Hedge):
 *   https://cpt-hedge.com/guides/crystal-event      (published 2026-08-18)
 *   https://cpt-hedge.com/buildings/crystal-factory (level table)
 *
 * Powered by cpt-hedge.com
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GATING NOTE — READ BEFORE WIRING THIS INTO ANY SEASON-GATED SURFACE.
 *
 * The Crystal Event is NOT season-gated in the S6 sense. It unlocks on
 * SERVER-LIFECYCLE checkpoints (Season 1 Pre-Season Day 1 / Season 1 Day 1)
 * plus Base Lv.20, and once unlocked it runs for 60 days. Any server that has
 * already passed Season 1 — including servers now in S4/S5/S6 — meets the
 * requirement. Do NOT put this behind a "current season === 6" gate; gate it on
 * the player's server having passed Season 1 and on the 60-day event window.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const CRYSTAL_EVENT_SOURCE = {
  guideUrl: 'https://cpt-hedge.com/guides/crystal-event',
  buildingUrl: 'https://cpt-hedge.com/buildings/crystal-factory',
  attribution: 'Powered by cpt-hedge.com',
  guidePublished: '2026-08-18',
  pulledAt: '2026-08-18',
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   1. AVAILABILITY
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CrystalEventAvailability {
  feature: string
  unlockCheckpoint: string
  baseLevelRequired: number
}

export const CRYSTAL_EVENT_AVAILABILITY: CrystalEventAvailability[] = [
  {
    feature: 'Crystal Factory',
    unlockCheckpoint: 'Server reaches Day 1 of the Season 1 Pre-Season',
    baseLevelRequired: 20,
  },
  {
    feature: 'Crystal Boss',
    unlockCheckpoint: 'Server reaches Day 1 of Season 1',
    baseLevelRequired: 20,
  },
]

export const CRYSTAL_EVENT_WINDOW = {
  durationDays: 60,
  checkpointType: 'server-lifecycle',
  note:
    'These are server-lifecycle checkpoints, not calendar dates. Any server that has already ' +
    'passed Season 1 — even one now in Season 4 or 5 — meets both requirements and has the ' +
    'event available. Once unlocked, the event stays available for 60 days.',
  endOfEvent:
    'When the event ends or is closed, the Crystal Boss is removed alongside it. Spend down ' +
    'Amethyst Crystal and Crystal Ore before then rather than losing unspent resources.',
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   2. CRYSTAL FACTORY
   ═══════════════════════════════════════════════════════════════════════════ */

export const CRYSTAL_FACTORY_BASICS = {
  buildMenu: 'Economy',
  buildCost: { food: 60, iron: 60 },
  buildTimeSeconds: 3,
  producesOffline: true,
  collectFrom: ['The Crystal Factory itself', 'Directly from your Base'],
  outputTrackedIn: 'The Minerals tab shows current output rate and accumulated Amethyst Crystal.',
  summary:
    'The Crystal Factory is the hub of the event. It continuously produces Amethyst Crystal ' +
    'whether or not you are online. At Lv.1 it produces +4 Amethyst Crystal every 3 hours, up ' +
    'to a maximum production window of 48 hours before it caps out and needs collecting.',
} as const

export const AMETHYST_CRYSTAL_SOURCES = [
  'Continuous Crystal Factory production',
  'Damage rewards from the Crystal Boss',
] as const

export const AMETHYST_CRYSTAL_NOTE =
  'Both sources feed the same balance, so do not ignore the Crystal Boss if you want to hit ' +
  'Crystal Shop purchase limits quickly.'

/**
 * Crystal Factory level table.
 *
 * `crystalOre` / `food` / `iron` / `buildTime` are null where Hedge has not yet
 * published the value — the building page is explicitly flagged "missing level
 * data" beyond Lv.5 for costs. Output, power and max production time ARE
 * published for all 30 levels. Do not invent the missing costs.
 */
export interface CrystalFactoryLevel {
  level: number
  crystalOre: number | null
  food: number | null
  iron: number | null
  buildTime: string | null
  outputPer3h: number
  power: number
  maxProductionTime: string
}

export const CRYSTAL_FACTORY_LEVELS: CrystalFactoryLevel[] = [
  { level: 1, crystalOre: null, food: 60, iron: 60, buildTime: '00:00:03', outputPer3h: 4, power: 700, maxProductionTime: '2d 00:00:00' },
  { level: 2, crystalOre: 2000, food: null, iron: null, buildTime: '00:01:30', outputPer3h: 8, power: 1400, maxProductionTime: '2d 01:00:00' },
  { level: 3, crystalOre: 2100, food: null, iron: null, buildTime: '00:06:00', outputPer3h: 12, power: 2100, maxProductionTime: '2d 02:00:00' },
  { level: 4, crystalOre: 2200, food: null, iron: null, buildTime: '00:24:00', outputPer3h: 16, power: 2800, maxProductionTime: '2d 03:00:00' },
  { level: 5, crystalOre: 2300, food: null, iron: null, buildTime: '00:48:00', outputPer3h: 20, power: 3500, maxProductionTime: '2d 04:00:00' },
  { level: 6, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 24, power: 4200, maxProductionTime: '2d 05:00:00' },
  { level: 7, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 28, power: 4900, maxProductionTime: '2d 06:00:00' },
  { level: 8, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 32, power: 5600, maxProductionTime: '2d 07:00:00' },
  { level: 9, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 36, power: 6300, maxProductionTime: '2d 08:00:00' },
  { level: 10, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 40, power: 7000, maxProductionTime: '2d 09:00:00' },
  { level: 11, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 44, power: 8000, maxProductionTime: '2d 10:00:00' },
  { level: 12, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 48, power: 9300, maxProductionTime: '2d 11:00:00' },
  { level: 13, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 52, power: 10600, maxProductionTime: '2d 12:00:00' },
  { level: 14, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 56, power: 12200, maxProductionTime: '2d 13:00:00' },
  { level: 15, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 60, power: 14000, maxProductionTime: '2d 14:00:00' },
  { level: 16, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 64, power: 16400, maxProductionTime: '2d 15:00:00' },
  { level: 17, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 68, power: 19200, maxProductionTime: '2d 16:00:00' },
  { level: 18, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 72, power: 22800, maxProductionTime: '2d 17:00:00' },
  { level: 19, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 76, power: 26800, maxProductionTime: '2d 18:00:00' },
  { level: 20, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 80, power: 32100, maxProductionTime: '2d 19:00:00' },
  { level: 21, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 84, power: 38400, maxProductionTime: '2d 20:00:00' },
  { level: 22, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 88, power: 45600, maxProductionTime: '2d 21:00:00' },
  { level: 23, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 92, power: 53700, maxProductionTime: '2d 22:00:00' },
  { level: 24, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 96, power: 62700, maxProductionTime: '2d 23:00:00' },
  { level: 25, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 100, power: 74300, maxProductionTime: '3d 00:00:00' },
  { level: 26, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 104, power: 88000, maxProductionTime: '3d 01:00:00' },
  { level: 27, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 108, power: 103700, maxProductionTime: '3d 02:00:00' },
  { level: 28, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 112, power: 122100, maxProductionTime: '3d 03:00:00' },
  { level: 29, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 116, power: 144000, maxProductionTime: '3d 04:00:00' },
  { level: 30, crystalOre: null, food: null, iron: null, buildTime: null, outputPer3h: 120, power: 170100, maxProductionTime: '3d 05:00:00' },
]

export const CRYSTAL_FACTORY_LV2_REQUIREMENT = {
  crystalOre: 2000,
  headquartersLevel: 20,
  outputChange: '+4 → +8 Amethyst Crystal per 3 hours',
  maxProductionChange: '+1 hour of max production time',
} as const

export const CRYSTAL_FACTORY_ADVANCED_LEVELS = {
  range: '31–35',
  requirements: [
    'The "Age of Oil" event must have started (available after Season 2)',
    'Finish the "Base Expansion" research in the Oil technology tree',
  ],
  note: 'Introduces oil as a new resource and unlocks these higher building levels.',
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   3. CRYSTAL ORE
   ═══════════════════════════════════════════════════════════════════════════ */

export const CRYSTAL_ORE = {
  purpose: 'The only currency for upgrading the Crystal Factory.',
  sources: ['Completing Daily Missions', 'Claiming Daily Tasks progress chests'],
  notBoostedBy: [
    'The "One More" profession skill does not boost Crystal Ore gains',
    'Profession skills that reduce building resource requirements do not discount Crystal Ore upgrade costs',
    'Speed-ups do not apply',
  ],
  note:
    'Crystal Ore is obtainable only through the event itself. There is no shortcut around ' +
    'farming it directly. Treat the Crystal Factory as a slow-burn upgrade and never skip ' +
    'daily task chests.',
} as const

export interface DailyTaskChest {
  chest: number
  crystalOre: number
}

/** 5 progress chests per day, unlocked by racking up stars from daily tasks. */
export const CRYSTAL_ORE_DAILY_CHESTS: DailyTaskChest[] = [
  { chest: 1, crystalOre: 600 },
  { chest: 2, crystalOre: 1000 },
  { chest: 3, crystalOre: 1200 },
  { chest: 4, crystalOre: 1600 },
  { chest: 5, crystalOre: 2000 },
]

export const CRYSTAL_ORE_DAILY_TOTAL = 6400

export const CRYSTAL_ORE_DAY_ONE_NOTE =
  'Clearing every chest gives 6,400 Crystal Ore per day — enough to get the Crystal Factory to ' +
  'Lv.4 on the first day (2,000 + 2,100 + 2,200 = 6,300 Crystal Ore).'

/* ═══════════════════════════════════════════════════════════════════════════
   4. CRYSTAL SHOP
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CrystalShopItem {
  item: string
  quantity: number
  monthlyLimit: number
  costAmethyst: number
}

export const CRYSTAL_SHOP_ITEMS: CrystalShopItem[] = [
  { item: 'Gold Brick', quantity: 500, monthlyLimit: 6, costAmethyst: 5000 },
  { item: 'Silver Brick', quantity: 5000, monthlyLimit: 12, costAmethyst: 5000 },
  { item: 'Weekly Pass [Take All] Voucher', quantity: 1, monthlyLimit: 1, costAmethyst: 20000 },
  { item: 'Mobilization Coupon', quantity: 1, monthlyLimit: 20, costAmethyst: 500 },
  { item: '100 Diamonds', quantity: 1, monthlyLimit: 80, costAmethyst: 500 },
]

export const CRYSTAL_SHOP_META = {
  location: 'Inside the Crystal Factory interface.',
  limitReset: 'All purchase limits reset on the 1st of each month.',
} as const

export const SILVER_BRICK_CAVEAT = {
  isGeneralCurrency: false,
  redeemableIn: ['Bullseye Loot', 'Glittering Market', 'Bounty Hunter Hot Deal'],
  availableFrom: 'Season 1 onward',
  advice:
    'Silver Brick only redeems for the newly added Silver Brick packs inside the Bullseye Loot, ' +
    'Glittering Market, and Bounty Hunter Hot Deal events. If you do not plan on buying into ' +
    'those packs, prioritize Gold Brick and the Weekly Pass Voucher instead.',
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   5. CRYSTAL BOSS
   ═══════════════════════════════════════════════════════════════════════════ */

export const CRYSTAL_BOSS_BASICS = {
  location: 'World Map',
  schedule: 'Monday through Saturday',
  uptimeHours: 23,
  baseLevelRequired: 20,
  accessedFrom:
    'The Crystal Boss tab in the Crystal Factory, which also has a shortcut to locate the ' +
    'nearest boss on the map.',
  phases: ['Weapon', 'Radar', 'Chip', 'Armor', 'Core'],
  phaseNote:
    'Five assault phases that must be cleared in order, with difficulty increasing each phase.',
} as const

export const CRYSTAL_BOSS_RULES = {
  challengesPerDay: 3,
  rallyAllowed: false,
  recallAllowed: false,
  ignoresTroopCounters: true,
  rules: [
    'Up to 3 challenges per day per Commander.',
    'No Rally attacks — only individual troop dispatches are supported.',
    'Once troops are dispatched, the attack cannot be recalled.',
    'The Boss ignores troop counter mechanics.',
  ],
} as const

/** Buffs explicitly DISABLED for the Crystal Boss fight. */
export const CRYSTAL_BOSS_DISABLED_BUFFS = [
  'War Fever',
  'Charge Battle Flag',
  'Tactics Card active skills',
  'Season Military Rank bonuses',
  'Fish buffs',
  'PVE Tactics Cards',
] as const

export interface CrystalBossBonus {
  bonus: string
  effect: string
  stacks: boolean
  note: string
}

export const CRYSTAL_BOSS_BONUSES: CrystalBossBonus[] = [
  {
    bonus: 'Qualifying Defense Heroes',
    effect: '+20% damage for all allied units',
    stacks: true,
    note: 'Stacks per hero deployed. The "Extra Bonus" panel shows exactly which heroes qualify each day — check it before every attack, the list can change.',
  },
  {
    bonus: '5 heroes of the same troop type',
    effect: '+30% Attack damage for all allied heroes',
    stacks: false,
    note: 'Applies on top of any hero-specific bonuses, on every attack.',
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
   6. WEEKLY DAMAGE REWARDS
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CrystalBossPhaseReward {
  phase: string
  rewardThreshold: string
  rewardRate: string
}

export const CRYSTAL_BOSS_WEEKLY_REWARDS: CrystalBossPhaseReward[] = [
  { phase: 'Weapon Destroyed', rewardThreshold: '2.0G damage', rewardRate: '+1 Crystal reward per 8.0M extra damage past 1.2G' },
  { phase: 'Radar Destroyed', rewardThreshold: '5.0G damage', rewardRate: '+1 Crystal reward per 30.0M extra damage past 2.0G' },
  { phase: 'Chip Destroyed', rewardThreshold: '7.2G damage', rewardRate: '+1 Crystal reward per 22.0M extra damage past 5.0G' },
  { phase: 'Armor Destroyed', rewardThreshold: '14.0G damage', rewardRate: '+1 Crystal reward per 68.0M extra damage past 7.2G' },
  { phase: 'Boss Battle (Core)', rewardThreshold: '24.5G damage', rewardRate: '+1 Crystal reward per 105.0M extra damage past 14.0G' },
]

export const CRYSTAL_BOSS_WEEKLY_RULES = {
  cumulative: false,
  note:
    'Only your single highest-damage hit of the week counts — this is NOT cumulative across ' +
    'your 3 daily attempts. Rewards for every phase you have unlocked can be collected with ' +
    'Claim All. Both progress and rewards reset weekly.',
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   7. ACHIEVEMENT REWARDS (SEASON-LONG)
   ═══════════════════════════════════════════════════════════════════════════ */

export const CRYSTAL_BOSS_ACHIEVEMENTS = {
  resetCadence: 'per Season (NOT weekly)',
  tracks: [
    { track: 'Damage Dealt (single hit)', tiers: [1000000] },
    { track: 'Number of Attacks', tiers: [15, 30, 60, 100, 140] },
  ],
  payouts: ['Choice Chests', 'Amethyst Crystal', 'Upgrade Ore chests'],
  note: 'These reset per Season rather than weekly, so there is no rush to hit every tier immediately.',
} as const

/**
 * ⚠️ SOURCE DISCREPANCY — FLAGGED, NOT RESOLVED (raise with Hedge).
 *
 * The guide states you will clear the 140-attack tier "in about 47 days if you use every
 * attempt, well inside the event's 60-day window." That math is 140 ÷ 3 = 46.7 attack-days.
 * But the same guide says the Crystal Boss only appears Monday through Saturday — 6 days per
 * week, not 7. At 3 attacks across 6 days/week, 140 attacks takes ~54 calendar days, not 47.
 *
 * Still inside the 60-day window, but the margin is 6 days rather than 13. Per the
 * conflicting-canonical-sources doctrine: surface both, defer to authority. Buddy should quote
 * the conservative figure until Hedge confirms.
 */
export const CRYSTAL_BOSS_ATTACK_PACE = {
  hedgeStatedDays: 47,
  recalculatedDays: 54,
  discrepancyFlagged: true,
  reason:
    'Hedge\'s ~47-day figure assumes 3 attacks every calendar day, but the Boss is only up ' +
    'Monday–Saturday (6 days/week). 140 attacks ÷ 3 per day = ~47 attack-days ≈ ~54 calendar days.',
  guidance:
    'Either way the 140-attack tier is reachable inside the 60-day window, but the buffer is ' +
    'about 6 days, not 13. Do not bank on a late start.',
} as const

/* ═══════════════════════════════════════════════════════════════════════════
   8. STRATEGY TIPS
   ═══════════════════════════════════════════════════════════════════════════ */

export const CRYSTAL_EVENT_TIPS = [
  'Do not skip Daily Missions. Crystal Ore only comes from Daily Task chests, and it is the sole gate on Crystal Factory upgrades.',
  'Check the Extra Bonus panel before every Crystal Boss attack. The named heroes that grant +20% damage can vary, so confirm your roster matches before dispatching.',
  'Bring 5 heroes of the same troop type whenever your roster allows it. That is a flat +30% damage bonus on top of any hero-specific bonuses, and it applies to every attack.',
  'Use all 3 daily Crystal Boss attempts. They are free damage toward both weekly thresholds and season achievements, and unlike Rally attacks there is no coordination needed.',
  'Only buy Silver Brick if you are already planning to spend on Bullseye Loot, Glittering Market, or Bounty Hunter Hot Deal packs. Outside those packs it has no use.',
  'Build the Crystal Factory the moment it unlocks — 60 Food, 60 Iron and 3 seconds means there is no reason to delay.',
  'Spend down Amethyst Crystal and Crystal Ore before the 60-day window closes. Unspent resources are lost when the event ends.',
] as const

/* ═══════════════════════════════════════════════════════════════════════════
   9. FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CrystalEventFaq {
  question: string
  answer: string
}

export const CRYSTAL_EVENT_FAQ: CrystalEventFaq[] = [
  {
    question: 'Is the Crystal Boss the same as a Rally target?',
    answer:
      'No. Rally attacks are not supported against the Crystal Boss. Every attack is an ' +
      'individual troop dispatch, and it cannot be recalled once sent.',
  },
  {
    question: 'Do buffs like War Fever or Season Military Rank help against the Crystal Boss?',
    answer:
      'No. Most temporary status buffs are disabled for this fight, including War Fever, Charge ' +
      'Battle Flag, Tactics Card active skills, Season Military Rank bonuses, fish buffs, and ' +
      'PVE Tactics Cards. Only the hero deployment bonuses (the named Defense Heroes and the ' +
      '5-same-type bonus) apply.',
  },
  {
    question: 'Do Weekly Damage Rewards add up across multiple attacks?',
    answer:
      'No. They are based on the highest single-hit damage you land that week, not a running ' +
      'total across your 3 daily attempts.',
  },
  {
    question: 'What happens to the Crystal Event when it ends?',
    answer:
      'It is a 60-day limited-time event. Once it ends or is closed, the Crystal Boss is removed ' +
      'alongside it. Spend down your Amethyst Crystal and Crystal Ore before then rather than ' +
      'losing unspent resources.',
  },
  {
    question: 'Can I get Crystal Ore faster with speed-ups or profession skills?',
    answer:
      'No. Crystal Ore only comes from Daily Mission and Daily Tasks progress chest rewards, and ' +
      'it explicitly is not boosted by the "One More" profession skill. Profession skills that ' +
      'reduce building resource requirements also do not discount the Crystal Ore cost of ' +
      'Crystal Factory upgrades.',
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
   10. EXPORT FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Compact Crystal Event briefing for the Buddy system prompt.
 * Kept token-lean: the level table is summarized, not dumped.
 */
export function getCrystalEventSummary(): string {
  const shop = CRYSTAL_SHOP_ITEMS.map(
    (i) => `${i.item} (x${i.quantity.toLocaleString()}) — ${i.costAmethyst.toLocaleString()} Amethyst, ${i.monthlyLimit}/month`
  ).join('; ')

  const weekly = CRYSTAL_BOSS_WEEKLY_REWARDS.map(
    (p) => `${p.phase} at ${p.rewardThreshold}`
  ).join('; ')

  const chests = CRYSTAL_ORE_DAILY_CHESTS.map((c) => c.crystalOre.toLocaleString()).join(' / ')

  return [
    `## Crystal Event (${CRYSTAL_EVENT_SOURCE.attribution})`,
    `Availability: Crystal Factory unlocks at Season 1 Pre-Season Day 1; Crystal Boss at Season 1 Day 1. Both need Base Lv.20+. These are SERVER-LIFECYCLE checkpoints, not calendar dates — any server past Season 1 (including S4/S5/S6) qualifies. Runs ${CRYSTAL_EVENT_WINDOW.durationDays} days once unlocked.`,
    `Crystal Factory: built from the Economy menu for ${CRYSTAL_FACTORY_BASICS.buildCost.food} Food + ${CRYSTAL_FACTORY_BASICS.buildCost.iron} Iron in ${CRYSTAL_FACTORY_BASICS.buildTimeSeconds}s. Lv.1 produces +4 Amethyst Crystal/3hr with a 48hr max production window; each level adds +4/3hr and +1hr of storage, up to +120/3hr at Lv.30. Produces offline.`,
    `Crystal Ore (upgrade currency): ONLY from Daily Missions and the 5 Daily Tasks progress chests (${chests} = ${CRYSTAL_ORE_DAILY_TOTAL.toLocaleString()}/day). Not boosted by the "One More" profession skill; resource-reduction skills and speed-ups do not apply. Lv.1→Lv.2 costs ${CRYSTAL_FACTORY_LV2_REQUIREMENT.crystalOre.toLocaleString()} Crystal Ore + HQ Lv.${CRYSTAL_FACTORY_LV2_REQUIREMENT.headquartersLevel}. A full chest day reaches factory Lv.4.`,
    `Crystal Shop (inside the Crystal Factory, limits reset the 1st of each month): ${shop}. Silver Brick is NOT general currency — it only redeems in ${SILVER_BRICK_CAVEAT.redeemableIn.join(', ')}. Prioritize Gold Brick and the Weekly Pass Voucher otherwise.`,
    `Crystal Boss: World Map ${CRYSTAL_BOSS_BASICS.schedule}, up ${CRYSTAL_BOSS_BASICS.uptimeHours}hrs each time. ${CRYSTAL_BOSS_RULES.challengesPerDay} challenges/day. Five phases cleared in order: ${CRYSTAL_BOSS_BASICS.phases.join(' → ')}. NO Rally, no recall, ignores troop counters. Disabled: ${CRYSTAL_BOSS_DISABLED_BUFFS.join(', ')}. Bonuses that DO apply: qualifying Defense Heroes +20% damage each (stacking, check the Extra Bonus panel daily), and 5 heroes of the same troop type for +30% Attack damage.`,
    `Weekly damage rewards use your single BEST hit of the week, not a cumulative total: ${weekly}. Resets weekly, collect with Claim All.`,
    `Achievements reset per Season, not weekly: Damage Dealt 1,000,000; Attack Count ${CRYSTAL_BOSS_ACHIEVEMENTS.tracks[1].tiers.join(' / ')}. Pays Choice Chests, Amethyst Crystal, and Upgrade Ore chests. At 3 attacks/day with the Boss up Mon–Sat, the 140-attack tier takes roughly ${CRYSTAL_BOSS_ATTACK_PACE.recalculatedDays} calendar days — inside the 60-day window, but do not start late.`,
  ].join('\n')
}

/** One-line provenance string for data-currency displays and admin surfaces. */
export function getCrystalEventDataSummary(): string {
  return `Crystal Event: ${CRYSTAL_FACTORY_LEVELS.length} factory levels, ${CRYSTAL_SHOP_ITEMS.length} shop items, ${CRYSTAL_BOSS_WEEKLY_REWARDS.length} boss phases, ${CRYSTAL_EVENT_TIPS.length} tips, ${CRYSTAL_EVENT_FAQ.length} FAQs — sourced ${CRYSTAL_EVENT_SOURCE.pulledAt} from cpt-hedge.com`
}

/** Lookup helper for factory level data. */
export function getCrystalFactoryLevel(level: number): CrystalFactoryLevel | undefined {
  return CRYSTAL_FACTORY_LEVELS.find((l) => l.level === level)
}

/**
 * Is the Crystal Event available to this player?
 * Gate on server lifecycle + Base level, NOT on current season.
 */
export function isCrystalEventAvailable(opts: {
  serverHasPassedSeason1Start: boolean
  baseLevel: number
}): boolean {
  return opts.serverHasPassedSeason1Start && opts.baseLevel >= 20
}