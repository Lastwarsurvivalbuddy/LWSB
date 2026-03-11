// lwtEventData.ts
// Arms Race + Alliance Duel VS data
// Source: lastwartutorial.com (Cris84) — pending partnership
// Last updated: March 11, 2026

// ─────────────────────────────────────────────
// ARMS RACE
// ─────────────────────────────────────────────

export const ARMS_RACE_PHASES = [
  {
    name: 'Base Building',
    description: 'Upgrade buildings. Points awarded when you open the gift box on a completed building — NOT when construction finishes. Pre-finish buildings and leave them wrapped to open during this phase.',
    tasks: [
      { action: 'Increases Building Power by 1 point', tip: 'Open pre-wrapped completed buildings during this phase only' },
      { action: 'Use 1-min Construction Speedup', tip: 'Any speedup length counts — generic speedups work' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Unit Progression',
    description: 'Train and upgrade troops. Points based on arrival level — upgrading T4→T5 gives T5 points same as training T5 from scratch. Pre-stage lower tier troops ready to upgrade as an assembly line.',
    tasks: [
      { action: 'Train a Lv.1–10 unit', tip: 'Points scale by level: T10 = highest. Upgrade chains for efficiency.' },
      { action: 'Use 1-min Training Speedup', tip: 'Any speedup length counts — generic speedups work' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Tech Research',
    description: 'Complete research in the Technology Center. Points awarded when you click the completed research icon — start long researches ahead of time and click to complete during this phase.',
    tasks: [
      { action: 'Increases Tech Power by 1 point', tip: 'Start long research before this phase, click to collect during it' },
      { action: 'Use 1-min Research Speedup', tip: 'Any speedup length counts — generic speedups work' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Drone Boost',
    description: 'Use Drone Combat Data and stamina. Radar missions consume stamina and count here.',
    tasks: [
      { action: 'Use 10 Drone Combat Data points', tip: 'Go to Drone Center → Data Training. Drone parts required at certain levels.' },
      { action: 'Use 1 Stamina', tip: 'Attack zombies/bases, rallies, or complete radar missions all count' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Hero Advancement',
    description: 'Level up heroes and recruit. Save recruit tickets and hero EXP for this phase.',
    tasks: [
      { action: 'Elite Recruit 1 time', tip: 'Use Legendary Recruitment Tickets or New Era Tickets — save them all week' },
      { action: "Season 1 Hero's Return Recruit", tip: "Use Hero's Return Recruitment Tickets during this phase" },
      { action: 'Use at least 2,000 Hero EXP at a time', tip: 'Use the Upgrade button on any hero' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'City Building',
    description: 'Upgrade city buildings and use construction speedups. Overlaps heavily with Alliance Duel Days 2 and 5.',
    tasks: [
      { action: 'Upgrade city buildings', tip: 'Open pre-wrapped completed buildings during this phase' },
      { action: 'Use 1-min Construction Speedup', tip: 'Any speedup length counts' },
    ],
  },
];

export const ARMS_RACE_STRATEGY = `
Arms Race runs every day in six 4-hour phases. Key rules:
- Each phase has different scoring actions — check the calendar icon in the event to see today's phase schedule
- The same phase schedule applies to ALL servers — you can plan globally
- Pre-wrap completed buildings and hold them to open during Base Building phase
- Start long research before Tech Research phase, click to collect during it
- Stack radar missions the day before Drone Boost
- Save Hero EXP and recruit tickets for Hero Advancement phase
- Stage Swap: 1 swap per day, can only swap to a LATER phase, points reset after swap — use only if badly mismatched
- Opening 3 phase chests = 6 Arms Race Badges. Total of 18 Badges = Gold Daily Reward Chest
- HQ level determines your Contest Segment — higher HQ = harder point thresholds but better rewards
- Actions that do NOT score Arms Race points (can do anytime): Use skill medals, synthesize drone components
`;

export const ARMS_RACE_BADGE_SYSTEM = `
Arms Race Badges unlock Daily Reward Chests:
- 2 Badges → Blue chest
- 8 Badges → Purple chest  
- 18 Badges → Gold chest (target every day)
Each phase: Chest 1 = 1 Badge, Chest 2 = 2 Badges, Chest 3 = 3 Badges
Complete 3 full phases = 18 Badges = Gold chest guaranteed
Daily Ranking Chests: Top 3 individual scorers get additional rewards at day reset
`;

// ─────────────────────────────────────────────
// ALLIANCE DUEL VS
// ─────────────────────────────────────────────

export const DUEL_DAYS = [
  {
    day: 1,
    name: 'Radar Training',
    alliancePoints: 1,
    armsRaceOverlap: ['Drone Boost'],
    tasks: [
      { action: 'Complete 1 radar task', points: 25000, tip: 'Stack radar missions the day before for max points' },
      { action: 'Use 1 stamina', points: 300, tip: 'Attacks, rallies, or radar missions all count' },
      { action: 'Use at least 660 Hero EXP', points: 6, tip: 'Use Upgrade button on any hero' },
      { action: 'Use 10 Drone Combat Data points', points: null, tip: 'Drone Center → Data Training' },
      { action: 'Use 1 Drone Part', points: null, tip: 'Automatically used during drone training at certain levels' },
      { action: 'Gather 100/100/60 food/iron/coins', points: 40, tip: 'Start gathering the day before — points awarded when troops return' },
      { action: 'Open Drone Data Chip Chest', points: 2000, tip: 'Available from server Day 85+. Very high value — save chip chests for Day 1' },
    ],
    armRaceOverlapTip: 'Do stamina and drone data during Drone Boost phase. Use Hero EXP during Hero Advancement phase.',
    prepDay: 'Stack radar missions to maximum the day before',
  },
  {
    day: 2,
    name: 'Base Expansion',
    alliancePoints: 2,
    armsRaceOverlap: ['City Building'],
    tasks: [
      { action: 'Use 1-min Construction Speedup', points: 120, tip: 'Generic speedups work' },
      { action: 'Increases building power by 1 point', points: 21, tip: 'Open pre-wrapped buildings — power only updates when gift box opened' },
      { action: 'Dispatch Legendary Trade Truck 1 time', points: 200000, tip: 'HIGHEST VALUE. Use dice button to reroll until yellow/UR background appears' },
      { action: 'Perform 1 Legendary Secret Task', points: 150000, tip: 'HIGH VALUE. Use Refresh + secret order items to find gold missions. Save orders all week for Day 2 and 6.' },
      { action: 'Recruit survivor 1 time', points: 3000, tip: 'Use golden survivor recruit tickets — save all week, use Day 2 only' },
      { action: 'Use 1 Armament Material', points: 2.5, tip: 'Available after Season 4 Celebration. Use in Armament Institute.' },
      { action: 'Use 1 Armament Core', points: 6250, tip: 'HIGH VALUE. Available after Season 4 Celebration. Use in Armament Institute.' },
    ],
    armRaceOverlapTip: 'Construction speedups and building power score during City Building Arms Race phase.',
    prepDay: 'Leave completed buildings gift-wrapped from previous days. Keep secret order items all week.',
  },
  {
    day: 3,
    name: 'Age of Science',
    alliancePoints: 2,
    armsRaceOverlap: ['Tech Research'],
    tasks: [
      { action: 'Complete 1 radar mission', points: 23000, tip: 'Stack radar missions the day before' },
      { action: 'Use 1-min Research Speedup', points: 120, tip: 'Generic speedups work' },
      { action: 'Increases Technological Power by 1 point', points: 21, tip: 'Start long research day before, click to collect on Day 3' },
      { action: 'Use 1 Valor Badge', points: 600, tip: 'Go to Research Center → Alliance Duel section. Use valor badges here.' },
      { action: 'Open Drone Component Chest (any level)', points: null, tip: 'Save drone component chests — open during Day 3 only. Different from Drone Data Chip chests.' },
    ],
    armRaceOverlapTip: 'Research speedups and tech power score during Tech Research Arms Race phase.',
    prepDay: 'Stack radar missions. Start a long research so it completes on Day 3. Save drone component chests.',
  },
  {
    day: 4,
    name: 'Train Heroes',
    alliancePoints: 2,
    armsRaceOverlap: ['Hero Advancement'],
    tasks: [
      { action: 'Elite Recruit 1 time', points: 3750, tip: 'Save ALL recruit tickets during the week — use only on Day 4' },
      { action: 'Use at least 660 Hero EXP', points: 6, tip: 'Use Upgrade on any hero' },
      { action: 'Use 1 Legendary shard (UR)', points: 20000, tip: 'HIGHEST VALUE per action. Use UR shards to promote hero class.' },
      { action: 'Use 1 Epic shard (SSR)', points: 7000, tip: 'Use SSR shards to promote hero class' },
      { action: 'Use 1 Rare shard (SR)', points: 2000, tip: 'Use SR shards to promote hero class' },
      { action: 'Use 1 skill medal', points: 20, tip: 'Upgrade any hero skill' },
      { action: 'Use 1 Exclusive Weapon shard', points: 20000, tip: 'Available from Season 1+. Universal or hero-specific shards both count.' },
    ],
    armRaceOverlapTip: 'Hero recruits and EXP use score during Hero Advancement Arms Race phase.',
    prepDay: 'Save ALL hero recruit tickets during the week. Save UR/SSR shards for this day.',
  },
  {
    day: 5,
    name: 'Total Mobilization',
    alliancePoints: 2,
    armsRaceOverlap: ['City Building', 'Tech Research', 'Unit Progression'],
    tasks: [
      { action: 'Complete 1 radar mission', points: 23000, tip: 'Stack missions the day before' },
      { action: 'Use 1-min Construction Speedup', points: 120 },
      { action: 'Increases building power by 1 point', points: 21 },
      { action: 'Use 1-min Research Speedup', points: 120 },
      { action: 'Increases Technological Power by 1 point', points: 21 },
      { action: 'Use 1-min Training Speedup', points: 122, tip: 'Best day to use training speedups — triple overlap' },
      { action: 'Train a Level 1 soldier', points: 46 },
      { action: 'Train a Level 2 soldier', points: 70 },
      { action: 'Train a Level 3 soldier', points: 93 },
      { action: 'Train a Level 4 soldier', points: 117 },
      { action: 'Train a Level 5 soldier', points: 140 },
      { action: 'Train a Level 6 soldier', points: 164 },
      { action: 'Train a Level 7 soldier', points: 197 },
      { action: 'Train a Level 8 soldier', points: 211 },
      { action: 'Train a Level 9 soldier', points: 234 },
      { action: 'Train a Level 10 soldier', points: 258, tip: 'Upgrade lower tier troops to T10 — points based on arrival level' },
      { action: 'Use Overlord items (Bond Badge, Training Cert, Training Guidebook, universal shard, skill badge)', points: null, tip: 'Available after Season 2 Celebration' },
    ],
    armRaceOverlapTip: 'Day 5 is the BEST triple-dip day: construction during City Building, research during Tech Research, training during Unit Progression. All three Arms Race phases overlap.',
    prepDay: 'Stack radar missions. Prepare lower-tier troops ready to upgrade. Start research day before.',
  },
  {
    day: 6,
    name: 'Enemy Buster',
    alliancePoints: 4,
    armsRaceOverlap: ['City Building', 'Tech Research', 'Unit Progression'],
    tasks: [
      { action: 'Dispatch Legendary Trade Truck 1 time', points: 200000, tip: 'Save second legendary truck for Day 6' },
      { action: 'Perform 1 Legendary Secret Task', points: 150000, tip: 'Save remaining secret order items for Day 6' },
      { action: 'Use 1-min Construction Speedup', points: 120 },
      { action: 'Use 1-min Research Speedup', points: 120 },
      { action: 'Use 1-min Training Speedup', points: 122 },
      { action: 'Use 1-min Healing Speedup', points: 122, tip: 'Only day healing speedups score points — save them for Day 6' },
      { action: 'Kill Level 1–10 unit from OPPONENT alliance', points_range: '25–138', tip: 'x5 points vs opponent alliance vs non-opponent. Use Duel VS teleport to attack opponent server.' },
      { action: 'Kill Level 1–10 unit from any OTHER alliance on opponent server', points_range: '5–28', tip: 'Only if opponent alliance is shielded. Much lower value.' },
      { action: 'Each Level 1–10 unit YOU lose', points_range: '6–20', tip: 'You earn points for your own troop losses too. If winning by a lot, consider sacrificing some troops.' },
    ],
    armRaceOverlapTip: 'Construction, research, and training speedups all overlap with their respective Arms Race phases.',
    prepDay: 'Upgrade barracks to highest level. Train as many troops as possible during Day 5 Total Mobilization. Buy shields for the 24h war period. REMOVE troops from wall defense so you lose fewer if attacked.',
    criticalWarning: 'Low-level bases MUST shield for the full 24 hours of Day 6. Removing wall defenses is strongly recommended — you lose fewer troops if hit without a defense lineup active.',
  },
  {
    day: 7,
    name: 'Reset',
    alliancePoints: 0,
    armsRaceOverlap: [],
    tasks: [],
    prepDay: 'Claim all rewards. Queue new upgrades. Check next phase schedule. Start prep for Day 1.',
  },
];

export const DUEL_STRATEGY = `
Alliance Duel VS runs Monday–Saturday, resets at 2am UTC daily.
Day 7 (Sunday) = Reset, no duel activities.

CRITICAL RULES:
- Sync Alliance Duel actions with overlapping Arms Race phases — this is the highest efficiency move in the game
- Do NOT execute all duel actions immediately at daily reset — wait for the correct Arms Race phase to overlap
- Wait 5 minutes after reset before starting activities — points don't award during the reset window

WEEKLY PREP HABITS:
- Monday (Day 1): Stack radar missions Sunday night. Save drone data chip chests.
- Tuesday (Day 2): Keep buildings pre-wrapped. Save secret order items all week. Legendary truck = 200K points.
- Wednesday (Day 3): Start long research Tuesday night. Save drone component chests all week.
- Thursday (Day 4): Save ALL recruit tickets and UR shards for this day. UR shard = 20,000 points.
- Friday (Day 5): Best triple-dip day — construction + research + training all score simultaneously.
- Saturday (Day 6): War day. 4 alliance points. Kill opponent troops for 5x points. Shield up or remove wall defense.

VALOR BADGES:
- Earned only through duel chest victories
- Used in Research Center → Alliance Duel section to unlock more chests and boost points
- Use badges immediately after opening chests on Day 3 to boost that day's research points
- First 3 chests available by default. 2 additional research unlocks add 3 chests each.

REWARD TYPES:
1. Current Phase Points Chests (individual, daily)
2. Daily Individual Ranking Rewards (compete vs both alliances)
3. Daily Victory Rewards (alliance wins the day)
4. Weekly Tier Rewards (both alliances get these regardless of outcome)
`;

export const DUEL_DOUBLE_DIP_SUMMARY = `
DOUBLE-DIP CHEAT SHEET — Do these actions during their Arms Race phase:

Day 1 (Radar Training):
  → Use stamina + drone data during DRONE BOOST phase
  → Use Hero EXP during HERO ADVANCEMENT phase

Day 2 (Base Expansion):
  → Construction speedups + building power during CITY BUILDING phase

Day 3 (Age of Science):
  → Research speedups + tech power during TECH RESEARCH phase

Day 4 (Train Heroes):
  → Hero recruits + EXP during HERO ADVANCEMENT phase

Day 5 (Total Mobilization) — BEST DAY:
  → Construction during CITY BUILDING
  → Research during TECH RESEARCH
  → Training during UNIT PROGRESSION
  → Triple dip — three overlapping phases

Day 6 (Enemy Buster):
  → Construction during CITY BUILDING
  → Research during TECH RESEARCH
  → Training during UNIT PROGRESSION
`;

// ─────────────────────────────────────────────
// SUMMARY FUNCTION FOR BUDDY SYSTEM PROMPT
// ─────────────────────────────────────────────

export function getEventDataSummary(): string {
  return `
## Arms Race & Alliance Duel — Exact Point Values

### Arms Race
Daily event, six 4-hour phases. Same phase schedule on all servers.
Key rules:
- Leave completed buildings GIFT-WRAPPED — open during Base Building phase only
- Start long research ahead of time — click to collect during Tech Research phase
- Stack radar missions the day before Drone Boost
- Save recruit tickets and Hero EXP for Hero Advancement phase
- 18 Arms Race Badges = Gold Daily Reward Chest (3 badges/phase × 3 phases = 18)
- Stage Swap: 1/day, only to later phases, points reset — emergency use only
- Skill medals and drone component synthesis do NOT score Arms Race points

### Alliance Duel VS Schedule (Mon–Sat, reset 2am UTC)
Day 1 — Radar Training (1 alliance pt): Radar missions ~25K pts. Open Drone Chip Chests ~2K pts each (server Day 85+). Start gathering day before.
Day 2 — Base Expansion (2 pts): Legendary Trade Truck ~200K pts. Legendary Secret Task ~150K pts. Armament Core ~6,250 pts. BEST DAY for big point actions.
Day 3 — Age of Science (2 pts): Radar mission ~23K pts. Valor Badge ~600 pts. Open Drone Component Chests. Start research day before.
Day 4 — Train Heroes (2 pts): UR shard use ~20K pts. Exclusive Weapon shard ~20K pts. SSR shard ~7K pts. Save ALL recruit tickets for this day.
Day 5 — Total Mobilization (2 pts): TRIPLE DIP day. T10 soldier training ~258 pts each. All construction + research + training overlap Arms Race.
Day 6 — Enemy Buster (4 pts): HIGHEST VALUE DAY. Kill opponent troops for 25–138 pts each (5x vs non-opponent). Healing speedups score today only. SHIELD UP or REMOVE wall defense.
Day 7 — Reset (0 pts): Claim rewards, prep for next week.

### Double-Dip Rule
ALWAYS time duel actions to overlap with their matching Arms Race phase.
Day 5 is the best day — 3 Arms Race phases overlap simultaneously.
Never rush duel actions at reset — wait for the right Arms Race phase.
`;
}