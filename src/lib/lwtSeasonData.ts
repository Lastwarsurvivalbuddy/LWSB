// lwtSeasonData.ts
// Season guides: S0 pre-season, S1 (Crimson Plague), S2 (Polar Storm), S3 (Golden Kingdom)
// Source: lastwartutorial.com (Cris84) — pending partnership
// Last updated: March 11, 2026
// NOTE: S4/S5 data already exists in the codebase from prior extraction sessions.

// ─────────────────────────────────────────────
// SEASON OVERVIEW TABLE
// ─────────────────────────────────────────────

export const SEASON_OVERVIEW = [
  {
    season: 0,
    name: 'Pre-Season',
    theme: 'Base game. No seasonal mechanics. Focus on HQ, troops, research, heroes.',
    hqRange: '1–30',
    duration: 'Ongoing until server hits Season 1 threshold',
    keyFocus: ['Grow HQ as fast as possible', 'Build T10 troop tier', 'Level heroes', 'Accumulate resources and speedups', 'Learn Arms Race and Alliance Duel double-dip'],
    newBuildings: [],
    newResources: [],
    newHeroes: [],
    topPriority: 'HQ level — gates everything else. Rush HQ above all other objectives.',
  },
  {
    season: 1,
    name: 'The Crimson Plague',
    theme: 'Virus-infected world. Alliance territory expansion. New map. Capture cities and Military Strongholds.',
    hqRange: '16–30 typical',
    duration: '2-week Pre-Season + 8 weeks + Celebration',
    keyFocus: [
      'Build and level Virus Research Institute (requires Immune Protein)',
      'Build and level Protein Farms (requires Mutant Crystals)',
      'Capture Military Strongholds to expand alliance territory',
      'Capture Cities (Levels 1–6, then Capitol at day 28)',
      'Collect Genetic Fragments — recombine for Mutant Crystals',
      'Mason upgrade to UR (Week 2 — huge power spike)',
      'Unlock Exclusive Weapons: Kimberly (W1), DVA (W3), Tesla (W6)',
    ],
    newResources: ['Immune Protein — used to upgrade Virus Research Institute + Military Bases', 'Mutant Crystals — used to upgrade Protein Farms + Military Bases', 'Gene Fragments (types I–VI) — recombined for Mutant Crystals'],
    newBuildings: ['Virus Research Institute (max L30, gated by Immune Protein)', 'Protein Farms I–V (max L30, gated by Mutant Crystals)', 'Military Bases x3 (unlock Week 3, +1% hero HP/Atk/Def per level)'],
    newHeroes: ['Mason upgrades to UR in Week 2'],
    newExclusiveWeapons: ['Kimberly — Rocket Shadow (Week 1, Day 4)', 'DVA — (Week 3, Day 4)', 'Tesla — (Week 6, Day 4)'],
    passes: ['Season Battle Pass (48 days): ~$12 Advanced / ~$24 Luxury. Mutant Crystals, profession EXP, hero return tickets.', 'Weekly Pass: +Protein Farm #5, +250 Virus Resistance, daily stamina + speedups. Expires with pass.', 'Exclusive Weapon Battle Passes: Kimberly/DVA/Tesla. 70 hero-specific weapon shards each. Buy during 7-day window only.'],
    cityUnlockSchedule: [
      'Day 4: Level 1 cities open',
      'Day 7: Level 2 cities open',
      'Day 11: Level 3 cities open',
      'Day 14: Level 4 cities open',
      'Day 18: Level 5 cities open',
      'Day 21: Level 6 cities open',
      'Day 28: Capitol (City of Apocalypse) opens',
    ],
    topPriority: 'Virus Research Institute level — determines which zombies you can fight and which Strongholds you can capture. Rush this first.',
    virusMechanics: 'Infection stacks 0–100. Higher stacks = worse debuffs. Debuffs activate at 1/20/40/60/80 stacks. Allies can cure you by sending treatments. Gene fragments type IV/V/VI earned by curing allies.',
    weekByWeek: [
      { week: 'Pre-Season W1', events: ['Season Preview unlocks', 'Season Boost shown', 'Capitol Conquest on Day 6 of W2 Pre-Season — all alliances compete, no territory required'] },
      { week: 'Pre-Season W2', events: ['Capitol Conquest — battle lasts 4 hours, winner becomes President', 'Earn Honor Points by fighting in contaminated mud area'] },
      { week: 'W1', events: ['Virus Research Institute unlocks', 'Protein Farm unlocks', 'Genetic Recombination starts (Day 2, lasts 47 days)', 'City Level 1 opens (Day 4)', 'City Level 2 opens (Day 7)', 'Kimberly Exclusive Weapon unlocks (Day 4)', 'Purge Action starts'] },
      { week: 'W2', events: ['Mason upgrade to UR — 42-day window, HIGHEST PRIORITY for power growth', 'Level Swap EXP — swap hero EXP levels between 2 heroes', 'Crimson Legion attacks your cities (Tuesdays and Fridays for 18 days)', 'City Level 3 opens (Day 4)', 'City Level 4 opens (Day 7)'] },
      { week: 'W3', events: ['Military Bases unlock — build all 3, each level = +1% hero stats', 'DVA Exclusive Weapon unlocks (Day 4)', 'City Level 5 opens (Day 4)', 'City Level 6 opens (Day 7)', 'Crimson Legion attacks continue'] },
      { week: 'W4–W5', events: ['Continue leveling Protein Farms and Virus Research Institute', 'Capitol opens at Day 28 of S1', 'City Clash continues — hold your cities vs Crimson Legion attacks'] },
      { week: 'W6', events: ['Tesla Exclusive Weapon unlocks (Day 4)', 'Continue seasonal building progression'] },
      { week: 'W7–W8', events: ['Final push — influence points for Alliance Reward tier', 'Gold tier: Rank #1 influence + 4 Level-6 cities', 'Purple tier: 8M influence + 3 Level-6 cities', 'Blue tier: 4M influence', 'Green tier: 1M influence'] },
      { week: 'Celebration', events: ['Season rewards distributed', 'Season Merit Medals earned — carry to S2 store', 'Black Market event — Universal Exclusive Weapon shards available'] },
    ],
    allianceInfluencePoints: { L1: 100000, L2: 200000, L3: 300000, L4: 400000, L5: 500000, L6: 1000000 },
  },
  {
    season: 2,
    name: 'Polar Storm',
    theme: 'Frozen world. Temperature management. Coal-powered buildings. Blizzards damage unprepared players.',
    hqRange: '20–30 typical',
    duration: '2-week Pre-Season + 8 weeks + Celebration',
    keyFocus: [
      'Build and level High-heat Furnace (fight cold debuffs)',
      'Build and level Titanium Alloy Factories (produce coal)',
      'Build Alliance Furnace (alliance-wide temperature buff)',
      'Manage base temperature to avoid Blizzard debuffs',
      'Capture Dig Sites (S2 equivalent of Military Strongholds)',
      'Capture Cities (Levels 1–7)',
      'Murphy Exclusive Weapon (Week 1)',
      'Overlord units unlock in S2 — highest priority new feature',
    ],
    newResources: ['Coal — used to upgrade Titanium Alloy Factories and fuel furnaces', 'Titanium Alloy — produced by factories, used for seasonal buildings'],
    newBuildings: ['High-heat Furnace — keeps base temperature up during Blizzards', 'Titanium Alloy Factory x5 — produces coal, max L30', 'Alliance Furnace — alliance-wide heat source, must be built collectively'],
    newHeroes: [],
    newExclusiveWeapons: ['Murphy — (Week 1, Day 4)', 'Additional heroes in later weeks'],
    temperatureMechanics: 'Base temperature drops during Blizzards (up to -50°C). Cold debuffs reduce troop effectiveness. Keep furnace running. Allies can send Recon Planes to heat your base (+2°C each). Blizzard levels 1–8, temperature drop -10°C to -50°C.',
    cityUnlockSchedule: [
      'Week 1 Day 3 +12h: Level 1',
      'Week 1 Day 6 +12h: Level 2',
      'Week 2 Day 3 +12h: Level 3',
      'Week 2 Day 6 +12h: Level 4',
      'Week 3 Day 3 +12h: Level 5',
      'Week 3 Day 6 +12h: Level 6',
      'Week 4 Day 7 +12h: Level 7',
    ],
    topPriority: 'High-heat Furnace — keeps you functional during Blizzards. Then Titanium Alloy Factories for coal production.',
    weekByWeek: [
      { week: 'W1', events: ['Cold Wave Alert — Blizzard starts 7 hours after S2 begins (-10°C first hit)', 'High-heat Furnace unlocks', 'Titanium Alloy Factory unlocks', 'Alliance Furnace repair (collective effort)', 'Murphy Exclusive Weapon (Day 4)', 'Dig Site capture starts (Day 3)', 'Level 1 cities open (Day 3)', 'Level 2 cities open (Day 6)'] },
      { week: 'W2', events: ['Level 3–4 cities open', 'Weapons of Legends event — additional Kimberly weapon shards available', 'Overlord training unlocks — HIGHEST PRIORITY: Overlord provides massive squad buff'] },
      { week: 'W3', events: ['Level 5–6 cities open', 'Another Exclusive Weapon battle pass'] },
      { week: 'W4', events: ['Level 7 cities open', 'Capitol capture window opens', 'Overlord — continue training and upgrading'] },
      { week: 'W5–W8', events: ['Hold territory', 'Alliance Influence ranking determines reward tier', 'Push Titanium Alloy production for remaining seasonal buildings'] },
      { week: 'Celebration', events: ['Season rewards', 'Season Merit Medals carry to S3', 'Mason UR upgrade available in some servers if missed S1'] },
    ],
    overlordNote: 'Overlord is a gorilla unit that joins one squad. Not a troop type — has its own slot. Provides massive stat bonuses. Unlock and upgrade it as the top priority when it appears.',
  },
  {
    season: 3,
    name: 'Golden Kingdom / Sphinx Oasis',
    theme: 'Desert world. Curse mechanics mirror S1 virus. Mithril and Sacred Water as new resources. Desert Protectors (special seasonal soldiers).',
    hqRange: '25–35 typical',
    duration: '2-week Pre-Season + 8 weeks + Celebration',
    keyFocus: [
      'Build Protector\'s Field (unlock L10 first week, don\'t go higher until you have Mithril/Sacred Water)',
      'Build Curse Research Lab (Sacred Water — mirrors Virus Research Institute)',
      'Build Blessing Fountains I–IV (Mithril — mirrors Protein Farms)',
      'Build Alliance Center (collective repair, provides alliance buffs)',
      'Train Desert Protectors (seasonal special soldiers)',
      'Capture Digging Strongholds (S3 equivalent of Strongholds/Dig Sites)',
      'Capture Cities (Levels 1–7)',
      'Marshall Exclusive Weapon (Week 1, Day 4)',
    ],
    newResources: ['Mithril — used to upgrade Blessing Fountains', 'Sacred Water — used to upgrade Curse Research Lab'],
    newBuildings: ['Protector\'s Field — trains Desert Protectors (level to 10 first, NOT higher — Mithril/Sacred Water gate)', 'Curse Research Lab — increases Curse Resistance (like Virus Resistance in S1)', 'Blessing Fountains I–IV — Mithril-powered production buildings', 'Alliance Center — alliance-wide buff building (repair collectively)'],
    newSoldiers: ['Desert Protectors — seasonal special unit trained at Protector\'s Field. Full details in Desert Protectors section.'],
    newExclusiveWeapons: ['Marshall — (Week 1, Day 4)'],
    curseMechanics: 'Mirrors S1 virus. Curse Resistance determines ability to fight Digging Stronghold protectors and Elite zombies. Level Curse Research Lab continuously.',
    cityUnlockSchedule: [
      'Week 1 Day 3 +12h: Level 1',
      'Week 1 Day 6 +12h: Level 2',
      'Week 2 Day 3 +12h: Level 3',
      'Week 2 Day 6 +12h: Level 4',
      'Week 3 Day 3 +12h: Level 5',
      'Week 3 Day 6 +12h: Level 6',
      'Week 4 Day 7 +12h: Level 7',
    ],
    topPriority: 'Curse Research Lab (Sacred Water) — same priority as Virus Research Institute in S1. Gates your ability to fight seasonal enemies and expand territory.',
    weekByWeek: [
      { week: 'W1', events: ['Protector\'s Field repairs (community donation)', 'Curse Research Lab repairs', 'Blessing Fountain I unlocks', 'Alliance Center repairs (Day 2)', 'Marshall Exclusive Weapon (Day 4)', 'Digging Stronghold capture starts', 'Level 1 cities open (Day 3)', 'Level 2 cities open (Day 6)', 'Sandworm Crisis starts', 'Build an Oasis starts (Day 3, 48-day event)', 'Alliance Compass — reveals Alliance Vault when Desert Treasure starts W2'] },
      { week: 'W2', events: ['Level 3–4 cities open', 'Desert Treasure event — use Alliance Compass to find vaults', 'Blessing Fountain II unlocks'] },
      { week: 'W3', events: ['Level 5–6 cities open', 'Blessing Fountain III unlocks', 'Oasis development continues'] },
      { week: 'W4', events: ['Level 7 cities open', 'Blessing Fountain IV unlocks', 'Capitol opens'] },
      { week: 'W5–W8', events: ['Desert Artifacts — find and capture for strong individual rewards (Levels 1–7, locations tracked at lastwartutorial.com)', 'Sphinx/Oasis locations — strategic resource points', 'Push Curse Resistance for higher-level Strongholds'] },
      { week: 'Celebration', events: ['Season rewards', 'Season Merit Medals carry to S4', 'Desert Artifact rewards finalized'] },
    ],
    desertArtifactNote: 'Desert Artifacts spawn at fixed locations by level. Level 1–7, each level harder. Capturing gives strong individual rewards. Locations documented at lastwartutorial.com (Season 3 Desert Artifacts guide).',
    oasisNote: 'Build an Oasis is a 48-day event starting W1 Day 3. Developing the oasis provides alliance-wide buffs and individual rewards throughout the season.',
  },
];

// ─────────────────────────────────────────────
// SEASON TRANSITION GUIDE
// ─────────────────────────────────────────────

export const SEASON_TRANSITIONS = {
  toS1: {
    hqTarget: 16,
    note: 'Season 1 starts server-wide regardless of individual HQ level. You need Virus Resistance ASAP — build Protein Farm and Virus Research Institute on Day 1.',
    dayOneActions: ['Kill zombies with search tool to find highest level you can beat', 'Level up Protein Farm', 'Use Protein to level Virus Research Institute', 'Donate food to warzone reward chest goal', 'Save Hero EXP — Mason upgrade to UR starts Week 2'],
    dontDo: ['Don\'t attack Corruptors without Virus Resistance — they infect regardless', 'Don\'t use auto-rally — can get you infected while offline'],
  },
  toS2: {
    note: 'Season 2 starts when server hits S2 threshold. Blizzard hits 7 hours after start — build High-heat Furnace immediately.',
    dayOneActions: ['Build High-heat Furnace', 'Donate iron to warzone goal', 'Start Titanium Alloy Factory', 'Help repair Alliance Furnace — go to Alliance > Alliance Furnace'],
    dontDo: ['Don\'t ignore temperature — cold debuffs stack fast during Blizzards'],
  },
  toS3: {
    note: 'Season 3 curse mirrors Season 1 virus. Immediately build Curse Research Lab and Protector\'s Field.',
    dayOneActions: ['Donate iron/food/coins to warzone goals', 'Build Protector\'s Field (stop at L10)', 'Build Curse Research Lab', 'Build Blessing Fountain I', 'Help repair Alliance Center (Day 2)'],
    dontDo: ['Don\'t level Protector\'s Field past L10 early — Mithril and Sacred Water are needed for other buildings first'],
  },
};

// ─────────────────────────────────────────────
// PRE-SEASON GUIDE (Before Season 1)
// ─────────────────────────────────────────────

export const PRE_SEASON_GUIDE = `
PRE-SEASON (Before Season 1 Starts):

The pre-season is a 2-week preview window. Season 1 has not started yet. Use this time to:

Week 1 of Pre-Season:
- Season 1 icons appear in UI — browse previews
- Season Boost shows upcoming hero boosts
- Season Preview: daily goals unlock preview rewards
- IMPORTANT: Capitol Conquest happens on Day 6 of Pre-Season Week 2 — all alliances compete, no territory needed

Week 2 of Pre-Season:
- Capitol Conquest: 4-hour battle for President title
- All alliances can participate regardless of territory
- Attack Capitol OR fight in the contaminated mud area for Honor Points
- Winning alliance controls Capitol + President hat for full pre-season off-period

What to prepare before S1 starts:
- Stockpile generic speedups — Virus Research Institute upgrades need them
- Level HQ as high as possible — S1 building max is L30 regardless of HQ, but HQ still gates normal buildings
- Save food/iron/gold — first donations to S1 warzone chests happen Day 1
- Farm stamina — zombie kills required for Mutant Crystals
`;

// ─────────────────────────────────────────────
// SUMMARY FUNCTION FOR BUDDY SYSTEM PROMPT
// ─────────────────────────────────────────────

export function getSeasonDataSummary(season: number): string {
  const s = SEASON_OVERVIEW.find(x => x.season === season);
  if (!s) return '';

  if (season === 0) {
    return `
## Season 0 (Pre-Season) — What To Focus On
You are in the base game before any seasonal content. This is the most important growth phase.
Top priority: HQ level. Everything else is secondary.
Daily focus: Arms Race + Alliance Duel double-dip, troops training, research, hero levels.
Milestone targets: HQ 16 unlocks T10 track. HQ 30 is the typical S1 entry point. HQ 31+ unlocks T11.
`;
  }

  if (season === 1) {
    return `
## Season 1 — The Crimson Plague
Theme: Virus-infected world. Alliance territory expansion through Military Strongholds and Cities.
Duration: 2-week Pre-Season + 8 weeks + Celebration.

New resources: Immune Protein (upgrades Virus Research Institute), Mutant Crystals (upgrades Protein Farms), Gene Fragments I–VI (recombine for crystals).

New buildings: Virus Research Institute (max L30) → Protein Farms I–V (max L30) → Military Bases x3 (unlock W3, +1% hero stats/level).

Top priority each day: Level Virus Research Institute → lets you fight stronger zombies → more Mutant Crystals → better Protein Farms → more Immune Protein → higher Virus Research Institute. It's a loop. Start it Day 1.

Virus mechanics: Infection stacks 0–100. Stacks activate debuffs at 1/20/40/60/80. Allies cure you by sending treatments. Corruptors and Infected Zombies infect you regardless of Virus Resistance. Keep infection low.

Week 1: Build Virus Research Institute + Protein Farms. Kimberly Exclusive Weapon available (Day 4).
Week 2: MASON UR UPGRADE — 42-day window. Massive power spike. Crimson Legion attacks cities starting Tuesday.
Week 3: Military Bases unlock — build all 3, level them. DVA Exclusive Weapon (Day 4).
Week 6: Tesla Exclusive Weapon (Day 4).
Week 7–8: Final influence push. Gold tier = rank #1 + 4 Level-6 cities.
Celebration: Season Merit Medals → carry to S2. Black Market has Universal Exclusive Weapon shards.

City unlock schedule: L1 Day 4, L2 Day 7, L3 Day 11, L4 Day 14, L5 Day 18, L6 Day 21, Capitol Day 28.
City influence: L1=100K, L2=200K, L3=300K, L4=400K, L5=500K, L6=1M.

Do on Day 1 of S1: Kill zombies with search tool, level Protein Farm, use protein to upgrade Virus Research Institute, donate food to warzone chest goal.
Don't: Attack Corruptors without Virus Resistance (they infect regardless). Don't use auto-rally — can infect you offline.
`;
  }

  if (season === 2) {
    return `
## Season 2 — Polar Storm
Theme: Frozen world. Temperature management. Coal-powered buildings. Blizzards debuff base.
Duration: 2-week Pre-Season + 8 weeks + Celebration.

New resources: Coal (fuels furnaces and factories). Titanium Alloy (produced by factories).
New buildings: High-heat Furnace (fights Blizzard debuffs), Titanium Alloy Factories I–V (produce coal), Alliance Furnace (alliance-wide heat, repaired collectively).

Temperature mechanics: Blizzards drop area temperature -10°C to -50°C. Cold debuffs stack. Keep High-heat Furnace running (and overdrive during Blizzards). Allies send Recon Planes to heat your base (+2°C each). Alliance Furnace heats whole alliance territory.

Top priority: High-heat Furnace → build and level immediately. Then Titanium Alloy Factories for coal.

Overlord: Gorilla unit unlocks in Season 2. Has its own squad slot (not a troop type). Provides massive stat bonuses. HIGHEST PRIORITY new feature when it appears. Upgrade continuously.

Week 1: High-heat Furnace, Titanium Alloy Factory, Alliance Furnace repair. Murphy Exclusive Weapon (Day 4). Level 1–2 cities open.
Week 2: Level 3–4 cities. Weapons of Legends event — extra Kimberly weapon shards. Overlord unlocks.
Week 3–4: Level 5–7 cities. Capitol opens.
Celebration: Merit Medals → S3. Mason UR upgrade available in some servers that missed S1.

Do on Day 1 of S2: Build High-heat Furnace immediately. Blizzard hits 7 hours after season start. Donate iron to warzone goals. Help repair Alliance Furnace.
`;
  }

  if (season === 3) {
    return `
## Season 3 — Golden Kingdom (Sphinx Oasis)
Theme: Desert world. Curse mechanic mirrors S1 virus. Mithril + Sacred Water as new resources. Desert Protectors (seasonal special soldiers).
Duration: 2-week Pre-Season + 8 weeks + Celebration.

New resources: Mithril (upgrades Blessing Fountains), Sacred Water (upgrades Curse Research Lab).
New buildings: Protector's Field (train Desert Protectors — level to 10 ONLY, stop there until you have Mithril/Sacred Water surplus), Curse Research Lab (increases Curse Resistance, powered by Sacred Water), Blessing Fountains I–IV (Mithril-powered), Alliance Center (collective repair, alliance buffs).

Curse mechanics: Identical to S1 virus in structure. Curse Resistance gates which Digging Strongholds and Elite zombies you can fight. Level Curse Research Lab as fast as possible.

Desert Protectors: Special seasonal soldiers trained at Protector's Field. Unique unit type — level field to 10 Day 1 for access. Don't go above 10 early — Mithril and Sacred Water needed elsewhere first.

Top priority: Curse Research Lab → Blessing Fountains (for Mithril) → Protector's Field (L10) → Alliance Center.

Digging Strongholds: S3 equivalent of Military Strongholds (S1) and Dig Sites (S2). Capture to expand territory.

Week 1: Build Protector's Field (L10), Curse Research Lab, Blessing Fountain I, Alliance Center (Day 2). Marshall Exclusive Weapon (Day 4). Sandworm Crisis starts. Build an Oasis starts (Day 3, 48-day event).
Week 2: Desert Treasure event — use Alliance Compass to find Alliance Vaults.
Week 5–8: Desert Artifacts (fixed spawn locations, L1–7) — capturing gives strong individual rewards.
Celebration: Merit Medals → S4.

Do on Day 1 of S3: Donate to all 3 warzone goals (iron/food/coins). Build Protector's Field → stop at L10. Build Curse Research Lab. Start Blessing Fountain I.
Don't: Go above Protector's Field L10 early. Push Curse Research Lab above your Mithril/Sacred Water income.
`;
  }

  return '';
}

export function getAllSeasonsSummary(): string {
  return [0, 1, 2, 3].map(n => getSeasonDataSummary(n)).join('\n\n');
}