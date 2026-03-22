// src/lib/lwtGearData.ts
// Gear strategy: priority by playstyle, which sets to build first, upgrade path
// Sources: lastwartutorial.com/gears, lastwarhandbook.com gear guide
// Built: March 11, 2026 (session 5) — updated March 15, 2026 (session 15): star promotion costs added
// Updated: March 22, 2026 (session 58): typo fix (Dialetric → Dielectric), blueprint sources expanded

// Gear types (4 slots per hero)
export const GEAR_SLOTS = [
  { slot: 'Cannon (Railgun)', stat_focus: 'Attack', assign_to: 'Attacker heroes first' },
  { slot: 'Chip', stat_focus: 'Attack + Crit', assign_to: 'Attacker heroes first' },
  { slot: 'Armor', stat_focus: 'Defense + HP', assign_to: 'Defender heroes first' },
  { slot: 'Radar', stat_focus: 'Defense + HP', assign_to: 'Defender heroes first' },
];

// Gear rarity tiers
export const GEAR_RARITY = [
  { rarity: 'Legendary (UR)', color: 'Gold', max_level: 40, stars: '0–5★', priority: 'ONLY rarity worth building and upgrading' },
  { rarity: 'Epic (SSR)', color: 'Purple', max_level: 30, stars: 'N/A', priority: 'Acceptable placeholder until Legendary available' },
  { rarity: 'Rare (SR)', color: 'Blue', max_level: 15, stars: 'N/A', priority: 'Skip — do not invest resources' },
  { rarity: 'Common', color: 'Green', max_level: 10, stars: 'N/A', priority: 'Never upgrade — waste of resources' },
];

// Which gears to prioritize per playstyle
export const GEAR_PRIORITY_BY_PLAYSTYLE = [
  {
    playstyle: 'Fighter (PVP)',
    priority_order: ['Cannon', 'Chip', 'Armor', 'Radar'],
    reasoning: 'Offense wins PvP. Cannon + Chip on your top attackers first. Armor/Radar on defenders after.',
    hero_assignment: 'Give Legendary Cannon + Chip to Adam, Williams, or your primary attack hero. Armor + Radar to Kimberly or Sara.',
  },
  {
    playstyle: 'Developer (PVE)',
    priority_order: ['Armor', 'Radar', 'Cannon', 'Chip'],
    reasoning: 'PvE events like Zombie Siege favor survivability. Defense gear keeps your squads alive longer in wave events.',
    hero_assignment: 'Defensive heroes fully geared first. Attackers geared as resources allow.',
  },
  {
    playstyle: 'Commander (50/50)',
    priority_order: ['Cannon', 'Armor', 'Chip', 'Radar'],
    reasoning: 'Balance attack and defense. Complete one attacker set, then one defender set, then rotate.',
    hero_assignment: 'Alternate between attack and defense heroes. Never leave a hero at 0 gear.',
  },
  {
    playstyle: 'Scout (Still Figuring It Out)',
    priority_order: ['Cannon', 'Armor', 'Chip', 'Radar'],
    reasoning: 'Early game: one good Legendary gear beats four bad ones. Get one hero fully geared before spreading.',
    hero_assignment: 'Focus your starter/free UR hero first (Sara or Kimberly). One fully geared hero > four half-geared heroes.',
  },
];

// Gear building strategy
export const GEAR_BUILD_STRATEGY = {
  core_rule: 'Only craft and upgrade Legendary (gold) gear. Epic is a placeholder only. Never invest in blue or green.',
  crafting: {
    requires: 'Gear Factory. Materials: gear blueprints + gold.',
    note: 'Legendary gear crafting is time-gated. Build Gear Factory to L20 ASAP — unlocks star promotion.',
    milestone: 'Gear Factory Level 20 is required for star promotions (1★–5★). This is a major progression gate.',
  },
  upgrade_path: [
    'Craft Legendary gear at Gear Factory (any level)',
    'Level it from 0→40 (costs gold + ore per level — see GEAR_STAR_COSTS for exact costs)',
    'At L40, promote to 1★ using Legendary Blueprints (requires Gear Factory L20)',
    'Continue 1★→2★→3★→4★ with Legendary Blueprints',
    '5★ (Mythic) requires Mythic Blueprints — endgame only',
  ],
  star_promotion_summary: {
    note: 'Each star = 5 sub-levels. Cost is the same for ALL gear types (Cannon, Chip, Armor, Radar).',
    factory_requirement: 'Gear Factory Level 20 required to begin star promotions',
    warning: 'Do NOT spend Honor Points on anything except Gear Blueprints (Legendary). They cannot be obtained any other way in comparable quantity.',
  },
  material_sources: [
    'Honor Points store — Legendary Gear Blueprints are the #1 priority. Earned from Desert Storm, Canyon Storm, and Warzone Duel PvP events.',
    'Arms Race chests — gear blueprints as drops (30–60/month with daily participation)',
    'Kingdom Clash — 8–30 blueprints per month',
    'Alliance War — 20–80 blueprints per quarter',
    'Zombie Siege — 10–40 blueprints bi-weekly',
    'Glittering Market — 10–20 blueprints (save Glitter Coins for these)',
    'Event rewards (seasonal and limited)',
    'Pack purchases (spend tier dependent)',
  ],
  mythic_blueprint_sources: [
    'Anniversary Events — 25–50 blueprints (yearly, best source)',
    'Season Finale Events — 8–30 blueprints (quarterly)',
    'Premium Packages — 10–50 blueprints (purchased)',
    'Strategy: save resources year-round for anniversary events',
  ],
};

// Star promotion costs — per star, cumulative
// Source: lastwartutorial.com/gears
// Cost is identical for all gear types
export const GEAR_STAR_COSTS = {
  note: 'Each star requires completing 5 sub-levels. Cost is the same for all gear types.',
  stars: [
    {
      star: 1,
      gold: '93.6M',
      ore: '62,500',
      dielectric_ceramic: 750,
      legendary_blueprints: 5,
      mythic_blueprints: 0,
      per_level: { gold: '23.4M (levels 1–4), 0 (level 5)', ore: '12,500 each level', ceramic: 150 },
    },
    {
      star: 2,
      gold: '121.6M',
      ore: '81,000',
      dielectric_ceramic: 975,
      legendary_blueprints: 10,
      mythic_blueprints: 0,
      per_level: { gold: '30.4M (levels 1–4), 0 (level 5)', ore: '16,200 each level', ceramic: 195 },
    },
    {
      star: 3,
      gold: '150M',
      ore: '100,000',
      dielectric_ceramic: 1200,
      legendary_blueprints: 15,
      mythic_blueprints: 0,
      per_level: { gold: '37.5M (levels 1–4), 0 (level 5)', ore: '20,000 each level', ceramic: 240 },
    },
    {
      star: 4,
      gold: '178M',
      ore: '118,500',
      dielectric_ceramic: 1425,
      legendary_blueprints: 20,
      mythic_blueprints: 0,
      per_level: { gold: '44.5M (levels 1–4), 0 (level 5)', ore: '23,700 each level', ceramic: 285 },
    },
    {
      star: 5,
      gold: '206M',
      ore: '138,000',
      dielectric_ceramic: 1650,
      legendary_blueprints: 0,
      mythic_blueprints: 10,
      note: '5★ uses Mythic Blueprints only — endgame',
      per_level: { gold: '51.5M (levels 1–4), 0 (level 5)', ore: '27,500 each level', ceramic: 330 },
    },
  ],
  cumulative_totals: {
    zero_to_four_star: {
      gold: '543.2M',
      ore: '362,000',
      dielectric_ceramic: 4350,
      legendary_blueprints: 50,
      mythic_blueprints: 0,
    },
    zero_to_five_star: {
      gold: '749.2M',
      ore: '500,000',
      dielectric_ceramic: 6000,
      legendary_blueprints: 50,
      mythic_blueprints: 10,
    },
  },
};

// Dielectric Ceramic sources and management
export const DIELECTRIC_CERAMIC_GUIDE = `
DIELECTRIC CERAMIC — Sources and Management:

DAILY SOURCES:
- Elite Stages: 50–150 per day (energy-dependent)
- Gear Factory workshop production: 50–200 per day (workshop level matters)
- Alliance Missions: 10–30 per day (consistent)
- Alliance Boss: 50–200 per victory
- Events: 200–1,000+ at milestone rewards

MONTHLY TARGET: 500–1,500 Dielectric Ceramic
TOTAL NEEDED: 0★→4★ per gear piece = 4,350 | 0★→5★ = 6,000 | Full set (4 pieces) 0→4★ = 17,400

ALLOCATION STRATEGY:
- Core 3 heroes: 60% of ceramic toward 5-star mythic
- Formation support heroes: 25% toward 3–4 star
- Counter/flex heroes: 15% toward 2–3 star

FASTEST FARMING: Maximize Elite stage runs during double-resource events.
Keep Material Workshop upgraded and producing consistently — it converts Screws → Dielectric Ceramic.

NOTE: This resource is spelled "Dielectric Ceramic" in-game (not "Dialetric").
`;

// Gear assignment rules
export const GEAR_ASSIGNMENT_RULES = [
  'Cannon + Chip → attacker heroes (boosts attack and crit)',
  'Armor + Radar → defender heroes (boosts defense and HP)',
  'Never leave your lead attack hero ungeared — it directly reduces kill event and PvP performance',
  'Do not upgrade gear on heroes you plan to replace — check hero priority before committing resources',
  'Higher-level gear on fewer heroes beats lower-level gear spread across many heroes',
  'When a hero gets promoted to UR rarity, you receive 100% medal refund — do NOT apply skill medals before UR promotion',
];

// Troop-type specific gear notes
export const GEAR_TROOP_TYPE_NOTES = [
  {
    troop_type: 'Aircraft',
    gear_note: 'Aircraft heroes (DVA, Morrison, Schuyler) benefit most from Cannon + Chip. Railgun-type gear is their primary damage source.',
  },
  {
    troop_type: 'Tank',
    gear_note: 'Tank heroes (Kimberly, Williams, Murphy) benefit from Armor + Radar. Survival in extended engagements is their strength.',
  },
  {
    troop_type: 'Missile Vehicle',
    gear_note: 'Missile heroes (Swift, Tesla, Fiona) in flex/defense position benefit from Armor + Radar to maintain their universal counter role.',
  },
];

// Dismantle and merge notes
export const GEAR_FACTORY_OPERATIONS = {
  dismantle: 'Breaking down gear returns some materials. Use to recover resources from accidentally crafted or obsolete gear.',
  merge: 'Combines lower-rarity gear into higher rarity. Generally not efficient — craft Legendary directly.',
  disintegrate: 'Converts unwanted gear into raw materials at a fixed rate.',
  recommendation: 'Focus on crafting. Only dismantle/merge if you have excess low-rarity gear taking up inventory.',
};

export function getGearDataSummary(): string {
  const playstyleGuide = GEAR_PRIORITY_BY_PLAYSTYLE.map(p =>
    `${p.playstyle}: Priority order ${p.priority_order.join(' → ')}. ${p.reasoning} Assignment: ${p.hero_assignment}`
  ).join('\n');

  const rarityGuide = GEAR_RARITY.map(r =>
    `${r.rarity}: Max L${r.max_level} — ${r.priority}`
  ).join('\n');

  const starCosts = GEAR_STAR_COSTS.stars.map(s =>
    ` ${s.star}★: ${s.gold} Gold | ${s.ore} Ore | ${s.dielectric_ceramic} Dielectric Ceramic | ${s.legendary_blueprints > 0 ? s.legendary_blueprints + ' Legendary BPs' : s.mythic_blueprints + ' Mythic BPs'}${s.note ? ' (' + s.note + ')' : ''}`
  ).join('\n');

  return `
## Gear System — Strategy Guide

### Gear Slots (4 per hero)
Cannon/Railgun + Chip = Attack gear → assign to attacker heroes first
Armor + Radar = Defense gear → assign to defender heroes first

### Gear Rarity
${rarityGuide}
Core rule: ${GEAR_BUILD_STRATEGY.core_rule}

### Gear Build Path
${GEAR_BUILD_STRATEGY.upgrade_path.join('\n')}

### Star Promotion Costs (per star, same for all gear types — requires Gear Factory L20)
${starCosts}

Totals 0★→4★: 543.2M Gold | 362,000 Ore | 4,350 Dielectric Ceramic | 50 Legendary BPs
Totals 0★→5★: 749.2M Gold | 500,000 Ore | 6,000 Dielectric Ceramic | 50 Legendary BPs + 10 Mythic BPs

### Legendary Blueprint Sources
Primary free sources (monthly): Arms Race 30–60 · Kingdom Clash 8–30 · Alliance War 20–80 · Zombie Siege 10–40 · Glittering Market 10–20
All funnel through the Honor Points store — earned from Desert Storm, Canyon Storm, and Warzone Duel PvP events.
Warning: Do NOT spend Honor Points on anything except Legendary Gear Blueprints — they have no other equivalent source.

### Dielectric Ceramic
Target 500–1,500/month. Sources: Elite Stages · Gear Factory workshop · Alliance Boss · Events.
Full set 0→4★ (4 pieces): 17,400 total Ceramic required.

### Priority by Playstyle
${playstyleGuide}

### Key Assignment Rules
${GEAR_ASSIGNMENT_RULES.join('\n')}
`.trim();
}