// src/lib/lwtSkyBattlefrontData.ts
// Sky Battlefront — off-season cross-server airship event
// Source: lastwartutorial.com/sky-battlefront — verified March 25, 2026
// Replaces prior hallucinated version (fabricated donation point values, "attack turns",
// off-season store windows — none of that exists in the source).
// NOTE: LWT article was written as a first-pass live playthrough and is explicitly incomplete.
// Specific reward amounts and chest thresholds are NOT documented in the source — not included here.
// Boyd's firsthand knowledge overrides any data here if conflicts arise.

// ── Event Overview ───────────────────────────────────────────────────
export const SKY_BATTLEFRONT_OVERVIEW = {
  availability: 'OFF-SEASON ONLY. Appears on servers at different times. Not every server gets it on the same schedule. Check for the dedicated event icon above the Duel VS icon.',
  duration_days: 7,
  schedule: {
    donationStage: 'Days 1–4 (Monday–Thursday) — "Donation" tab',
    battleStage: 'Days 5–6 (Friday–Saturday) — "Expedition" tab',
    settlementStage: 'Day 7 (Sunday) — "Defense" tab',
  },
  coreMechanic: 'Whole server cooperates during Donation Stage to build and power up an airship. During Battle Stage, the President deploys it to bombard an enemy server while your server defends against their incoming airship.',
  presidentRole: 'The President initiates airship construction (selects location) and later deploys the airship to the enemy server. If not placed within 12 hours of event start, the system assigns a default position. If President does not deploy during Battle Stage, system auto-deploys.',
};

// ── Donation Stage (Days 1–4) ────────────────────────────────────────
export const SKY_BATTLEFRONT_DONATION = {
  goal: 'Earn Airship Tokens and donate them to advance airship construction. Construction has 3 stages — complete all 3 before Battle Stage begins.',
  tokenSources: [
    'Daily tasks via the Sky Battlefront event page (primary source)',
    'Alliance Resource Tiles: each time an Alliance chest is activated, 50% chance to discover a tile; collecting all resources from the tile grants bonus Airship Tokens (minimum gathering threshold must be met)',
  ],
  donationMechanic: 'Tap the coordinates on the event page → Sky Predator Station → gear icon → set donation amount → confirm. A scout truck is dispatched from your base visually.',
  individualProgress: 'Each token donated advances Individual Progress. Hitting milestones unlocks Individual Reward Chests (contain speed-ups and Honor points).',
  allianceProgress: 'Individual donations also contribute to Alliance Progress. Every 500 Alliance Progress points: unlocks an Alliance Reward Chest for all members + 50% chance to discover an Alliance Resource Tile + 50% chance to discover an Alliance Supply Tile.',
  allianceChestContents: 'Alliance contribution points and resource chests.',
  newMemberRule: 'Players who joined the alliance less than 24 hours ago cannot contribute to Alliance Progress and cannot unlock Alliance Reward Chests.',
  allianceSupplyTiles: 'Discovered at 50% chance when Alliance Progress milestones are hit. Found via the "Supply Tile" button in the event page. The commander who triggered the milestone becomes the discoverer — but ALL commanders in the same Warzone can claim the rewards. Act fast, they are limited.',
  rushStage: 'Once the airship construction completes all 3 stages, a Rush Stage begins (still part of Donation Stage). Keep donating during Rush — the highest donation progress reached in this stage directly determines the airship\'s combat power upgrades going into the Battle Stage. More Rush donations = stronger airship in battle.',
  constructionStages: 3,
  stageRewards: 'Completing each construction stage allows reward collection including Honor points.',
};

// ── Battle Stage (Days 5–6) ──────────────────────────────────────────
export const SKY_BATTLEFRONT_BATTLE = {
  setup: 'President selects a target location in the enemy warzone and launches the airship. It enters Teleport Mode and arrives after a countdown. Simultaneously, enemy airships target your warzone.',
  attackMechanic: 'The enemy Sky Predator is very strong. RALLY ATTACKS REQUIRED — solo attacks are not effective. Each rally attack reduces the airship\'s HP based on the number of defeated queues. Damage per commander is tracked for rankings.',
  enemyBehavior: 'The enemy Sky Predator fires at targets in your warzone randomly, burning bases and reducing Durability.',
  timeLimit: 'The Sky Predator has a time limit. If not defeated, it retreats.',
  shieldMechanic: 'When the Sky Predator\'s HP drops to certain thresholds, it activates a shield. Break the shield within the specified time window to continue dealing damage. If the shield is NOT broken in time, the airship enters BERSERK MODE — launches more powerful attacks temporarily.',
  triumphThresholds: {
    normalCombat: 'Maximum 20 consecutive wins = counts as a triumph.',
    duringShield: 'When shield is active: maximum 15 consecutive wins = counts as a triumph.',
  },
  rankingsTracked: ['Total donations (Donation Stage)', 'Total damage dealt to enemy airship (Battle Stage)'],
  individualRanking: 'Individual contribution visible via the "Individual" button in the rankings view.',
};

// ── Settlement Stage (Day 7) ─────────────────────────────────────────
export const SKY_BATTLEFRONT_SETTLEMENT = {
  description: 'All event details become accessible. Final rankings are calculated and rewards distributed.',
  rankings: 'Two rankings: Donations and Damage. Individual contribution drill-down available via "Individual" button.',
};

// ── Key Coaching Points ──────────────────────────────────────────────
export const SKY_BATTLEFRONT_COACHING = [
  'Rush Stage is not optional — the airship\'s combat power in the Battle Stage is determined by Rush donation progress. Don\'t stop donating after the 3 construction stages complete.',
  'President deployment matters — target selection and timing of the airship launch directly affect battle results.',
  'Rally attacks only during Battle Stage. Solo attacks do not work on the Sky Predator. Coordinate in alliance chat.',
  'Shield windows are critical — if the whole alliance isn\'t ready to break the shield, the airship enters berserk mode and the fight gets significantly harder.',
  'Alliance Supply Tiles expire quickly — when one is discovered, all Warzone members can claim it. Act immediately.',
  'Daily tasks are the primary Airship Token source. Missing days compounds — each missed day is tokens not donated, which is weaker Rush progress, which is a weaker airship in battle.',
  'New alliance members (joined < 24h) cannot contribute — do not rely on them for Alliance Progress milestones.',
];

// ── Summary Function ─────────────────────────────────────────────────
export function getSkyBattlefrontSummary(): string {
  const tokenSources = SKY_BATTLEFRONT_DONATION.tokenSources.map(s => `  - ${s}`).join('\n');
  const coaching = SKY_BATTLEFRONT_COACHING.map(c => `  - ${c}`).join('\n');

  return `
## Sky Battlefront

### Overview
- ${SKY_BATTLEFRONT_OVERVIEW.availability}
- Duration: ${SKY_BATTLEFRONT_OVERVIEW.duration_days} days.
- Donation Stage: ${SKY_BATTLEFRONT_OVERVIEW.schedule.donationStage}
- Battle Stage: ${SKY_BATTLEFRONT_OVERVIEW.schedule.battleStage}
- Settlement Stage: ${SKY_BATTLEFRONT_OVERVIEW.schedule.settlementStage}
- Core mechanic: ${SKY_BATTLEFRONT_OVERVIEW.coreMechanic}
- President role: ${SKY_BATTLEFRONT_OVERVIEW.presidentRole}

### Donation Stage (Days 1–4)
- Goal: ${SKY_BATTLEFRONT_DONATION.goal}
- Airship Token sources:
${tokenSources}
- Donation: ${SKY_BATTLEFRONT_DONATION.donationMechanic}
- Individual Progress: ${SKY_BATTLEFRONT_DONATION.individualProgress}
- Alliance Progress: ${SKY_BATTLEFRONT_DONATION.allianceProgress}
- Alliance chest contents: ${SKY_BATTLEFRONT_DONATION.allianceChestContents}
- New member rule: ${SKY_BATTLEFRONT_DONATION.newMemberRule}
- Alliance Supply Tiles: ${SKY_BATTLEFRONT_DONATION.allianceSupplyTiles}
- Rush Stage: ${SKY_BATTLEFRONT_DONATION.rushStage}

### Battle Stage (Days 5–6)
- ${SKY_BATTLEFRONT_BATTLE.setup}
- Attack mechanic: ${SKY_BATTLEFRONT_BATTLE.attackMechanic}
- Enemy behavior: ${SKY_BATTLEFRONT_BATTLE.enemyBehavior}
- Time limit: ${SKY_BATTLEFRONT_BATTLE.timeLimit}
- Shield mechanic: ${SKY_BATTLEFRONT_BATTLE.shieldMechanic}
- Triumph: ${SKY_BATTLEFRONT_BATTLE.triumphThresholds.normalCombat} During shield: ${SKY_BATTLEFRONT_BATTLE.triumphThresholds.duringShield}
- Rankings tracked: ${SKY_BATTLEFRONT_BATTLE.rankingsTracked.join(' · ')}

### Settlement Stage (Day 7)
- ${SKY_BATTLEFRONT_SETTLEMENT.description}

### Coaching Notes
${coaching}

### Data Completeness Note
The LWT source article for Sky Battlefront was written as a first-pass live playthrough and is explicitly marked as incomplete. Specific reward amounts, individual chest thresholds, and token earn quantities are NOT documented in the source and are not included here. Do not invent these values.
`.trim();
}