// lwtEventData.ts
// Arms Race + Alliance Duel VS data
// Sources: lastwartutorial.com (Cris84), lastwarhandbook.com
// Last updated: March 22, 2026 (session 58)
//
// ⚠️ IMPORTANT — November 2025 update:
// Arms Race phases now align with VS Days across ALL servers (previously server-specific random).
// The schedule still shifts by one slot each day, but the VS Day alignment is now standardized.
// Slot swap feature added — see ARMS_RACE_SLOT_SWAP below.
//
// ⚠️ Alliance Victory Points per day — values from lastwarhandbook (Jan 2026):
// Day 1=1, Day 2=1, Day 3=2, Day 4=2, Day 5=3, Day 6=4
// Previous data had Day 2=2 and Day 5=2 — corrected below. Verify in-game if needed.

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
    description: 'Train and upgrade troops. Points based on arrival level — upgrading T4→T5 gives T5 points same as training T5 from scratch. Pre-stage lower tier troops ready to upgrade as an assembly line. Friday alignment gives 4x training point multiplier — most valuable day of the week.',
    tasks: [
      { action: 'Train a Lv.1–10 unit', tip: 'Points scale by level: T10 = highest. Upgrade chains for efficiency.' },
      { action: 'Use 1-min Training Speedup', tip: 'Any speedup length counts — generic speedups work' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Tech Research',
    description: 'Complete research in the Technology Center. Points awarded when research completes — NOT from progress. Start long researches hours before this phase so they complete during scoring window.',
    tasks: [
      { action: 'Increases Tech Power by 1 point', tip: 'Start long research before this phase, click to collect during it' },
      { action: 'Use 1-min Research Speedup', tip: 'Any speedup length counts — generic speedups work' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Drone Boost',
    description: 'Use Drone Combat Data and stamina. Radar missions consume stamina and count here. Save stamina throughout the day and spend it during this phase.',
    tasks: [
      { action: 'Use 10 Drone Combat Data points', tip: 'Go to Drone Center → Data Training. Drone parts required at certain levels.' },
      { action: 'Use 1 Stamina', tip: 'Attack zombies/bases, rallies, or complete radar missions all count' },
      { action: 'Buy packs containing Diamonds', tip: 'Purchase diamond packs during this phase if you need to spend' },
    ],
  },
  {
    name: 'Hero Advancement',
    description: 'Level up heroes and recruit. Save recruit tickets and hero EXP for this phase. Use Hero Advancement speedups HERE — never during Alliance Duel VS as they do not score VS points.',
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

export const ARMS_RACE_VS_DAY_ALIGNMENT = `
ARMS RACE — VS DAY ALIGNMENT (November 2025 update):

Since November 2025, Arms Race phases are standardized across ALL servers and align directly with Alliance Duel VS Days.
Each VS Day begins and ends with the Arms Race phase that matches its theme.

| VS Day | Theme | Aligned Arms Race Phase |
|--------|-------|------------------------|
| Monday (Day 1) | Radar Training | Drone Boost |
| Tuesday (Day 2) | Base Expansion | City Building |
| Wednesday (Day 3) | Age of Science | Tech Research |
| Thursday (Day 4) | Train Heroes | Hero Advancement |
| Friday (Day 5) | Total Mobilization | Unit Progression |
| Saturday (Day 6) | Enemy Buster | Normal rotation (no direct equivalent) |

WHY THIS MATTERS — "Golden Hour" windows:
During alignment windows a single action scores in BOTH Arms Race AND Alliance Duel simultaneously:
- Tuesday (Day 2): Construction speedups → City Building phase = double value
- Wednesday (Day 3): Research completions → Tech Research phase = double value
- Thursday (Day 4): Hero EXP/recruit tickets → Hero Advancement phase = double value
- Friday (Day 5): Training speedups → Unit Progression phase = 4x training multiplier + VS points

FRIDAY IS THE MOST VALUABLE DAY:
- Total Mobilization awards points for ALL activities
- 4x training point multiplier on VS Day 5
- Unit Progression phase alignment
- Training speedups on Friday = maximum possible returns in the entire week

DAILY SCHEDULE SHIFT:
The schedule advances by one slot each day. Each phase eventually cycles through every time slot over the course of a week.
Check the calendar icon in the Arms Race event to see today's exact phase schedule and times.
`;

export const ARMS_RACE_SLOT_SWAP = `
ARMS RACE — SLOT SWAP (added November 2025):

Slot swap lets you complete two different Arms Race phases during a single time period — scheduling flexibility only, no extra rewards.

HOW IT WORKS:
1. Complete your current active phase (recommended)
2. Tap the blue icon on any future slot that hasn't started
3. Earn rewards for the swapped phase immediately
4. Original slot shows previous progress when its time arrives

RULES:
- One swap per day — cannot chain multiple swaps
- Future slots only — cannot swap back to past phases
- No extra rewards — same 36 max badges regardless of timing
- Swap is permanent — cannot undo until next day

WHEN TO USE SLOT SWAP:
- A phase you need (e.g. Unit Progression) is scheduled at 3am — swap it to afternoon
- VS Day alignment window exists but your matching phase is at an inconvenient time
- Work schedule conflict with a high-value phase
- Weekend gaming session — complete two phases back to back
`;

export const ARMS_RACE_STRATEGY = `
Arms Race runs every day in six 4-hour phases. Key rules:

PHASE NAMES: Base Building · Unit Progression · Tech Research · Drone Boost · Hero Advancement · City Building

SCHEDULE (post-November 2025 update):
- Phases now align with VS Days across all servers — see VS Day alignment table
- Schedule shifts by one slot each day — check the calendar icon each morning
- Slot swap: once per day, swap current phase with any future phase (no extra rewards — timing flexibility only)

PRE-START STRATEGY (most important technique):
- Start long upgrades/research BEFORE the matching phase begins
- Use speedups to FINISH during the scoring window
- The game awards points based on COMPLETION, not on how much you sped up
- Example: HQ upgrade takes 8 hours. Start it 7 hours before the phase. Use 1 hour of speedups to finish during scoring. Get full upgrade points using only 1 hour of speedups.

PHASE-SPECIFIC RULES:
- Base Building / City Building: Points come from OPENING the gift box, NOT from construction finishing. Pre-wrap buildings.
- Tech Research: Points from COMPLETION only — 99% done outside window = 0 points. Start 6–12 hours before phase.
- Unit Progression: Points based on arrival tier. Promoting T5→T6 = same points as training T6 from scratch. Ladder/waterfall your barracks.
- Drone Boost: Save stamina throughout the day, spend it all during this phase.
- Hero Advancement: Use Hero Advancement speedups HERE only. They do NOT score Alliance Duel VS points.

BADGE SYSTEM:
- Each phase has 3 chests: Chest 1 = 1 badge · Chest 2 = 2 badges · Chest 3 = 3 badges → 6 badges per complete phase
- 6 phases per day = 36 badges maximum daily
- Target: complete at least 3 full phases = 18 badges = Gold Chest guaranteed

DAILY GOAL CHESTS (unlock with badges):
- Bronze Chest: 2 badges
- Silver Chest: 8 badges
- Gold Chest: 18 badges (target every day — contains UR fragments, legendary tickets, skill medals, speedups)

ACTIONS THAT DO NOT SCORE ARMS RACE POINTS (can do anytime):
- Use skill medals
- Synthesize drone components
- Gathering resources on world map

DOUBLE-DIP: Always time Alliance Duel actions to coincide with the matching Arms Race phase. 
Post-November 2025: this is now predictable — each VS Day aligns with its matching phase.
`;

export const ARMS_RACE_BADGE_SYSTEM = `
Arms Race Badges unlock Daily Reward Chests:
- 2 Badges → Bronze chest
- 8 Badges → Silver chest
- 18 Badges → Gold chest (target every day)

Each phase: Chest 1 = 1 Badge, Chest 2 = 2 Badges, Chest 3 = 3 Badges
Complete 3 full phases = 18 Badges = Gold chest guaranteed

Daily Ranking Chests: Top 10 individual scorers get additional rewards at day reset
Consistent participation in 3–4 phases typically lands top 50 without excessive resource expenditure
`;

// ─────────────────────────────────────────────
// ALLIANCE DUEL VS
// ─────────────────────────────────────────────

export const DUEL_DAYS = [
  {
    day: 1,
    name: 'Radar Training',
    alliancePoints: 1,
    victoryPoints: 1,
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
    alliancePoints: 1,
    victoryPoints: 1,
    // ⚠️ Note: previous data had alliancePoints=2. Corrected to 1 per lastwarhandbook Jan 2026.
    // Verify in-game — Boyd to confirm.
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
    victoryPoints: 2,
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
    victoryPoints: 2,
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
    alliancePoints: 3,
    victoryPoints: 3,
    // ⚠️ Note: previous data had alliancePoints=2. Corrected to 3 per lastwarhandbook Jan 2026.
    // Verify in-game — Boyd to confirm.
    armsRaceOverlap: ['City Building', 'Tech Research', 'Unit Progression'],
    tasks: [
      { action: 'Complete 1 radar mission', points: 23000, tip: 'Stack missions the day before' },
      { action: 'Use 1-min Construction Speedup', points: 120 },
      { action: 'Increases building power by 1 point', points: 21 },
      { action: 'Use 1-min Research Speedup', points: 120 },
      { action: 'Increases Technological Power by 1 point', points: 21 },
      { action: 'Use 1-min Training Speedup', points: 122, tip: 'BEST DAY for training speedups — 4x multiplier + Unit Progression phase alignment' },
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
    armRaceOverlapTip: 'Day 5 is the BEST triple-dip day + 4x training multiplier: construction during City Building, research during Tech Research, training during Unit Progression. All three Arms Race phases overlap. Training speedups on Day 5 score as if used 4x — save them all week for this day.',
    prepDay: 'Stack radar missions. Prepare lower-tier troops ready to upgrade. Start research day before. Save your biggest stockpile of training speedups for Day 5.',
  },
  {
    day: 6,
    name: 'Enemy Buster',
    alliancePoints: 4,
    victoryPoints: 4,
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
    victoryPoints: 0,
    armsRaceOverlap: [],
    tasks: [],
    prepDay: 'Claim all rewards. Queue new upgrades. Check next Arms Race phase schedule. Start prep for Day 1.',
  },
];

export const DUEL_CHEST_THRESHOLDS = `
ALLIANCE DUEL — DAILY CHEST POINT THRESHOLDS:

| Chest | Points Required | Research Required |
|-------|----------------|-------------------|
| Chest 1 | 40,000 | No — available to all |
| Chest 2 | 150,000 | No — available to all |
| Chest 3 | 540,000 | No — available to all |
| Chest 4 | 660,000 | Yes — Premium Rewards I |
| Chest 5 | 1,000,000 | Yes — Premium Rewards II |
| Chest 6 | 2,300,000 | Yes — Premium Rewards III |
| Chest 7 | 2,600,000 | Yes — Super Bonus I |
| Chest 8 | 3,600,000 | Yes — Super Bonus II |
| Chest 9 | 7,200,000 | Yes — Super Bonus III |

Research "Premium Rewards" (3 levels) unlocks Chests 4–6.
Research "Super Bonus" (3 levels) unlocks Chests 7–9.
Alliance Duel research (Duel Expert, 20 levels) can increase all points earned by up to 150%.
`;

export const DUEL_VICTORY_POINTS = `
ALLIANCE DUEL — WEEKLY VICTORY POINTS PER DAY:

Day 1 (Radar Training): 1 victory point
Day 2 (Base Expansion): 1 victory point
Day 3 (Age of Science): 2 victory points
Day 4 (Train Heroes): 2 victory points
Day 5 (Total Mobilization): 3 victory points
Day 6 (Enemy Buster): 4 victory points

KEY INSIGHT: Days 5 and 6 are worth more than the first four days COMBINED (7 VP vs 6 VP).
Focus your biggest resource pushes on these days for maximum alliance victory contribution.
`;

export const DUEL_STRATEGY = `
Alliance Duel VS runs Monday–Saturday, resets at 2am UTC daily (NO DST adjustment — always 2am UTC).
Day 7 (Sunday) = Reset, no duel activities.

CRITICAL RULES:
- Sync Alliance Duel actions with overlapping Arms Race phases — post-November 2025 this is now predictable
- Do NOT execute all duel actions immediately at daily reset — wait for the correct Arms Race phase to overlap
- Wait 5 minutes after reset before starting activities — points don't award during the reset window
- Check the in-game calendar each morning for today's exact Arms Race phase schedule and times

VS DAY ALLIANCE POINT VALUES (victory contribution):
Day 1=1pt · Day 2=1pt · Day 3=2pt · Day 4=2pt · Day 5=3pt · Day 6=4pt
Days 5 and 6 together = 7 of 13 total points available (54% of the week)

WEEKLY PREP HABITS:
- Monday (Day 1): Stack radar missions Sunday night. Save drone data chip chests.
- Tuesday (Day 2): Keep buildings pre-wrapped. Save secret order items all week. Legendary truck = 200K points.
- Wednesday (Day 3): Start long research Tuesday night. Save drone component chests all week.
- Thursday (Day 4): Save ALL recruit tickets and UR shards for this day. UR shard = 20,000 points.
- Friday (Day 5): BEST DAY OF THE WEEK. Triple-dip (construction + research + training) AND 4x training multiplier. Save your biggest training speedup stockpile for this day.
- Saturday (Day 6): War day. 4 alliance points. Kill opponent troops for 5x points. Shield up or remove wall defense.

VALOR BADGES:
- Earned only through duel chest victories (50–400 badges per chest depending on chest number)
- Used in Research Center → Alliance Duel section to unlock more chests and boost points
- Use badges immediately after opening chests on Day 3 to boost that day's research points
- Priority: Duel Expert research (up to +100% all VS points at level 20) → Premium Rewards unlock → Super Bonus unlock

REWARD TYPES:
1. Current Phase Points Chests (individual, daily)
2. Daily Individual Ranking Rewards (compete vs both alliances)
3. Daily Victory Rewards (alliance wins the day)
4. Weekly Tier Rewards (both alliances get these regardless of outcome)
`;

export const DUEL_DOUBLE_DIP_SUMMARY = `
DOUBLE-DIP CHEAT SHEET — Post-November 2025 (VS Day alignment is now standardized):

Day 1 (Radar Training) → Arms Race: DRONE BOOST phase
  Use stamina + drone data during Drone Boost window
  Use Hero EXP during Hero Advancement phase (separate window)

Day 2 (Base Expansion) → Arms Race: CITY BUILDING phase
  Construction speedups + building power gift boxes during City Building window

Day 3 (Age of Science) → Arms Race: TECH RESEARCH phase
  Research speedups + tech power + valor badges during Tech Research window

Day 4 (Train Heroes) → Arms Race: HERO ADVANCEMENT phase
  Hero recruits + EXP items + Hero Advancement speedups during Hero Advancement window
  ⚠️ Hero Advancement speedups score Arms Race — NOT Alliance Duel. Use here, not on other days.

Day 5 (Total Mobilization) — BEST DAY OF THE WEEK:
  → Construction during CITY BUILDING phase
  → Research during TECH RESEARCH phase
  → Training during UNIT PROGRESSION phase (4x training multiplier!)
  Triple dip — three overlapping phases PLUS 4x training bonus
  Save your biggest speedup stockpile all week for Friday

Day 6 (Enemy Buster):
  → Construction during CITY BUILDING
  → Research during TECH RESEARCH
  → Training during UNIT PROGRESSION
  → Healing speedups ONLY score on Day 6 — save them all week
  → PvP combat scores only today — coordinate alliance attacks

Day 7 (Reset/Sunday): Claim rewards, queue upgrades, prep for Day 1.
`;

// ─────────────────────────────────────────────
// SUMMARY FUNCTION FOR BUDDY SYSTEM PROMPT
// ─────────────────────────────────────────────

export function getEventDataSummary(): string {
  return `
## Arms Race & Alliance Duel — Complete Strategy Guide

### Arms Race (Updated November 2025)
Daily event, six 4-hour phases. Phases now align with VS Days across ALL servers.
The 6 phases are: Base Building · Unit Progression · Tech Research · Drone Boost · Hero Advancement · City Building

VS DAY ALIGNMENT (standardized Nov 2025):
- Monday: Drone Boost phase aligned
- Tuesday: City Building phase aligned
- Wednesday: Tech Research phase aligned
- Thursday: Hero Advancement phase aligned
- Friday: Unit Progression phase aligned (4x training multiplier — most valuable day)
- Saturday: Normal rotation

SLOT SWAP: Once per day, swap current phase with any future phase. No extra rewards — scheduling flexibility only.

PRE-START STRATEGY (most important technique):
Start long upgrades/research BEFORE the matching phase. Use speedups to FINISH during scoring.
Game awards points based on COMPLETION — not how much you sped up. Start early, finish during the window.

Key rules:
- Base Building / City Building: Points from OPENING the gift box, NOT construction finishing. Pre-wrap buildings.
- Tech Research: Points from COMPLETION only. Start 6–12 hours before phase.
- Unit Progression: Promoting tiers = same points as training. Ladder/waterfall barracks.
- Hero Advancement speedups: Use ONLY during Hero Advancement phase — they do NOT score Alliance Duel VS points.
- 18 Arms Race Badges = Gold Daily Reward Chest (3 badges/phase × 3 complete phases = 18)
- ALWAYS double-dip: time Alliance Duel actions to overlap with matching Arms Race phase. Now predictable.

### Alliance Duel VS Schedule (Mon–Sat, reset 2am UTC — no DST)

VICTORY POINTS: Day 1=1 · Day 2=1 · Day 3=2 · Day 4=2 · Day 5=3 · Day 6=4

DAILY CHEST THRESHOLDS: Chest 1=40K · Chest 2=150K · Chest 3=540K · Chests 4–9 require research (up to 7.2M for Chest 9)

Day 1 — Radar Training (1 VP): Radar missions ~25K pts. Open Drone Chip Chests ~2K pts each (server Day 85+). Start gathering day before.

Day 2 — Base Expansion (1 VP): Legendary Trade Truck ~200K pts. Legendary Secret Task ~150K pts. Armament Core ~6,250 pts.

Day 3 — Age of Science (2 VP): Radar mission ~23K pts. Valor Badge ~600 pts. Open Drone Component Chests (saved all week). Start research day before.

Day 4 — Train Heroes (2 VP): UR shard use ~20K pts. Exclusive Weapon shard ~20K pts. SSR shard ~7K pts. Save ALL recruit tickets for this day.

Day 5 — Total Mobilization (3 VP): BEST DAY. Triple-dip construction + research + training. 4x training multiplier with Unit Progression alignment. Save biggest speedup stockpile for today. T10 soldier training ~258 pts each.

Day 6 — Enemy Buster (4 VP): HIGHEST ALLIANCE VALUE. Kill opponent alliance troops for 25–138 pts each (5x vs non-opponent). Healing speedups score TODAY ONLY — save all week. SHIELD UP or REMOVE wall defense. Legendary truck + secret task if saved.

Day 7 — Reset (0 VP): Claim rewards, prep for Day 1.

### Double-Dip Rule
Post-November 2025: VS Day alignment with Arms Race is now standardized across all servers.
Day 5 remains the best day — 3 Arms Race phases overlap + 4x training multiplier.
Never rush duel actions at reset — wait for the right Arms Race phase window.
Hero Advancement speedups do NOT score Alliance Duel VS — use them during Arms Race Hero phase only.
`;
}