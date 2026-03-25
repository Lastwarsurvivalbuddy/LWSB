// src/lib/lwtGeneralsTrialData.ts
// General's Trial — recurring 4-day map-based PvE challenge event
// Source: lastwartutorial.com/generals-trial — verified March 25, 2026
// Replaces prior hallucinated version (wave-based PvE, daily resets, Trial Coins store — none of that is real).
// Boyd's firsthand knowledge overrides any data here if conflicts arise.
// Cross-reference: lwtOverlordData.ts already documents that Advanced L4-5 drops
// Overlord Skill Badges + Universal Overlord Shards. Not duplicated here.

export interface GeneralsTrialLevel {
  level: number;
  mode: 'normal' | 'advanced';
  challengeCount: number;        // total challenges per level
  appearsAtOnce: number;         // enemies visible on map simultaneously
  minSquadPowerM: number | null; // suggested minimum for solo single attacks (millions). null = not documented.
  rewardMilestones: number[];    // challenge counts that trigger reward tiers
  overlordRewards: boolean;
  notes: string;
}

// ── Event Structure ──────────────────────────────────────────────────
export const GENERALS_TRIAL_STRUCTURE = {
  duration_days: 4,
  hqMinimum: 8,
  difficultyLockRule: 'CRITICAL: Only ONE difficulty level can be selected per event. Once chosen, it CANNOT be changed for the entire event duration. Choose carefully before committing.',
  progressionRule: 'Each time you complete a difficulty level, you unlock the NEXT level — but only challengeable in the NEXT General\'s Trial event, not the current one.',
  staminaCost_singleAttack: 10,
  staminaCost_rally: 20,
  mapBehavior: 'Enemies appear on the world map. Attack via the Challenge button in the event page, or tap the Marshall icon on the map above the daily task icon.',
  pacingRule: 'Spread challenges across all 4 days. Do not burn all stamina on Day 1.',
  allianceGuidance: 'Always wait for R4/R5 guidance before selecting difficulty. Alliance may ask players to hold off before a Season starts to preserve troops for the opening week.',
};

// ── Normal Mode ──────────────────────────────────────────────────────
// 9 difficulty levels. 30 challenges each. Enemies = Marshall tanks. Appear 3 at a time on map.
// Reward tiers unlock at 10 / 15 / 20 / 25 / 30 challenges completed.
// Power benchmarks from LWT source — noted as averages, vary by hero type and gear.
export const GENERALS_TRIAL_NORMAL_LEVELS: GeneralsTrialLevel[] = [
  { level: 1, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: null, rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: 'No power requirement documented.' },
  { level: 2, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: null, rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: 'No power requirement documented.' },
  { level: 3, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 7,    rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: 'Under 7M: troop loss risk. Use rallies if solo is failing.' },
  { level: 4, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 7,    rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: '7M+ for solo.' },
  { level: 5, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 10,   rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: '10M+ for solo.' },
  { level: 6, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 14,   rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: '14M+ for solo. Below this: rallies strongly recommended.' },
  { level: 7, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 16,   rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: '16M+ for solo.' },
  { level: 8, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 19.5, rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: '19.5M+ for solo.' },
  { level: 9, mode: 'normal', challengeCount: 30, appearsAtOnce: 3, minSquadPowerM: 22,   rewardMilestones: [10,15,20,25,30], overlordRewards: false, notes: '22M+ for solo. Completing Level 9 unlocks Advanced mode — available in the NEXT event cycle.' },
];

// ── Advanced Mode ────────────────────────────────────────────────────
// 9 difficulty levels. 10 challenges each. Enemies = full Marshall squads. Appear 1 at a time.
// Significantly harder per challenge than Normal mode.
// Unlocks after completing ALL 9 Normal levels AND server reaches required age.
// Reward tiers unlock at 3 / 6 / 10 challenges completed.
// OVERLORD REWARDS (Skill Badges + Universal Shards) begin at Level 4.
export const GENERALS_TRIAL_ADVANCED_LEVELS: GeneralsTrialLevel[] = [
  { level: 1, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: 30,   rewardMilestones: [3,6,10], overlordRewards: false, notes: '30M+ for solo. Much harder per challenge than Normal.' },
  { level: 2, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: 32,   rewardMilestones: [3,6,10], overlordRewards: false, notes: '32M+ for solo.' },
  { level: 3, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: 34,   rewardMilestones: [3,6,10], overlordRewards: false, notes: '34M+ for solo.' },
  { level: 4, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: 42,   rewardMilestones: [3,6,10], overlordRewards: true,  notes: '★ OVERLORD REWARDS START HERE. 42M+ for solo. Overlord Skill Badges + Universal Overlord Shards. Primary target for endgame players. Rally support strongly recommended if below 42M.' },
  { level: 5, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: 48,   rewardMilestones: [3,6,10], overlordRewards: true,  notes: '48M+ for solo. Increased Overlord rewards. Rally coordination strongly recommended.' },
  { level: 6, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: null, rewardMilestones: [3,6,10], overlordRewards: true,  notes: 'Power requirement not documented. Rally-only realistically.' },
  { level: 7, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: null, rewardMilestones: [3,6,10], overlordRewards: true,  notes: 'Power requirement not documented. Full alliance rally required.' },
  { level: 8, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: null, rewardMilestones: [3,6,10], overlordRewards: true,  notes: 'Power requirement not documented. Full alliance rally required.' },
  { level: 9, mode: 'advanced', challengeCount: 10, appearsAtOnce: 1, minSquadPowerM: null, rewardMilestones: [3,6,10], overlordRewards: true,  notes: 'Maximum level. Highest Overlord rewards. Full alliance rally required.' },
];

// ── Alliance Challenge ───────────────────────────────────────────────
export const GENERALS_TRIAL_ALLIANCE = {
  levelCount: 9,
  unlockCondition: 'R4 or R5 can launch an Alliance Challenge level once at least 10 alliance members have completed the corresponding Solo Challenge level.',
  attackType: 'Rally attacks ONLY. Solo attacks cannot be used on Alliance Challenge forces.',
  forceDuration_hours: 24,
  rewardsRule: 'ALL alliance members receive rewards via mail at event end. You do NOT need to participate in the rally to receive them.',
  coordinationTip: 'The upper-right button in the Alliance Challenge tab shows each ally\'s Solo Challenge progress — use it to see which levels are close to the 10-member unlock threshold.',
};

// ── Arms Race Double-Dip ─────────────────────────────────────────────
export const GENERALS_TRIAL_ARMS_RACE_TIP = `
GENERAL'S TRIAL × ARMS RACE — DRONE BOOST DOUBLE-DIP:
Single attacks cost 10 stamina. Rally attacks cost 20 stamina.
Stamina consumption scores points during the Arms Race DRONE BOOST phase.
Time your General's Trial attacks during the Drone Boost window to earn
Arms Race points from the same stamina spend. Confirmed tip from LWT source.
Never burn General's Trial stamina outside the Drone Boost window when Arms Race is active.
`;

// ── Summary Function ─────────────────────────────────────────────────
export function getGeneralsTrialSummary(): string {
  const normalLevels = GENERALS_TRIAL_NORMAL_LEVELS.map(l =>
    `  L${l.level}: min ${l.minSquadPowerM != null ? l.minSquadPowerM + 'M' : 'none'} power. Rewards at ${l.rewardMilestones.join('/')} challenges. ${l.notes}`
  ).join('\n');

  const advancedLevels = GENERALS_TRIAL_ADVANCED_LEVELS.map(l =>
    `  L${l.level}: min ${l.minSquadPowerM != null ? l.minSquadPowerM + 'M' : 'not documented'} power.${l.overlordRewards ? ' ★ OVERLORD REWARDS.' : ''} ${l.notes}`
  ).join('\n');

  return `
## General's Trial

### Event Structure
- Duration: ${GENERALS_TRIAL_STRUCTURE.duration_days} days. HQ minimum: ${GENERALS_TRIAL_STRUCTURE.hqMinimum}.
- Stamina cost: ${GENERALS_TRIAL_STRUCTURE.staminaCost_singleAttack} per single attack · ${GENERALS_TRIAL_STRUCTURE.staminaCost_rally} per rally.
- ${GENERALS_TRIAL_STRUCTURE.difficultyLockRule}
- ${GENERALS_TRIAL_STRUCTURE.progressionRule}
- ${GENERALS_TRIAL_STRUCTURE.allianceGuidance}
- ${GENERALS_TRIAL_STRUCTURE.pacingRule}

### Normal Mode — 9 levels · 30 challenges each · 3 enemies on map at once
Reward tiers unlock at 10/15/20/25/30 challenges. Enemies: Marshall tanks.
${normalLevels}

### Advanced Mode — 9 levels · 10 challenges each · 1 enemy on map at once
Unlocks after completing ALL 9 Normal levels + server age threshold. Available in the NEXT event cycle.
Reward tiers unlock at 3/6/10 challenges. Enemies: full Marshall squads. Significantly harder than Normal.
${advancedLevels}

### Alliance Challenge
- ${GENERALS_TRIAL_ALLIANCE.unlockCondition}
- ${GENERALS_TRIAL_ALLIANCE.attackType}
- Forces remain on map for ${GENERALS_TRIAL_ALLIANCE.forceDuration_hours} hours.
- ${GENERALS_TRIAL_ALLIANCE.rewardsRule}
- ${GENERALS_TRIAL_ALLIANCE.coordinationTip}

### Arms Race Double-Dip
${GENERALS_TRIAL_ARMS_RACE_TIP}
`.trim();
}