// lwtHeroSquadData.ts
// Hero Squad Composition, Game-Stage Meta, Mixed Squads, and Hero Power-Up Guide
// Sources: cpt-hedge.com, allclash.com, lastwarhandbook.com, packsify.com, bluestacks.com
// Session 59 — wired into buddy/route.ts via getHeroSquadDataSummary()

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroProfile {
  name: string;
  type: 'Tank' | 'Aircraft' | 'Missile';
  role: 'Attack' | 'Defense' | 'Support';
  rarity: 'SSR' | 'UR' | 'SSR-to-UR';
  acquisitionPath: string;
  gameStageValue: 'Early' | 'Mid' | 'Late' | 'All';
  tierRating: 'SS' | 'S' | 'A' | 'B' | 'C';
  notes: string;
}

export interface SquadFormation {
  name: string;
  troopType: 'Tank' | 'Aircraft' | 'Missile' | 'Mixed';
  gameStage: 'Early' | 'Mid' | 'Late' | 'All';
  slots: { position: string; hero: string; role: string; notes: string }[];
  strengths: string[];
  counters: string;
  counteredBy: string;
  formationBonus: string;
  notes: string;
}

export interface HeroInvestmentRule {
  priority: number;
  hero: string;
  reason: string;
  stageUnlock: string;
}

export interface MixedSquadOption {
  name: string;
  basetype: 'Tank' | 'Aircraft' | 'Missile';
  hybridHero: string;
  composition: string[];
  requiresHybridCard: boolean;
  formationBonusRetained: string;
  whyItWorks: string;
  bestUsedFor: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO PROFILES — All Named Heroes
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_PROFILES: HeroProfile[] = [
  // ── TANK HEROES ──
  {
    name: 'Kimberly',
    type: 'Tank',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Recruitment events, hero pool pulls',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Highest DPS in the early game and remains dominant endgame. Exceptional AoE burst. First Tank hero to build. Non-negotiable in any Tank squad. With Exclusive Weapon she gains massive stat bonuses that keep her competitive at every stage.'
  },
  {
    name: 'Murphy',
    type: 'Tank',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Season 2 Exclusive Weapon; accessible early via hero pool',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Cornerstone defensive anchor. Ironclad Barrier + Stand Firm passive = multiplicative damage reduction. Effective HP pool 2–3x displayed stats. Pairs with Williams for near-invulnerable frontline. Also flexes into Aircraft hybrid squads at high EW levels. F2P viable. 4-star minimum for Super Sensing passive.'
  },
  {
    name: 'Williams',
    type: 'Tank',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays), hero pool',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Primary tank anchor. Taunt forces enemies to target him. Team-wide damage reduction. Williams + Murphy = the defining frontline pairing of the Tank meta. Remains strong at endgame. Core of any serious Tank formation.'
  },
  {
    name: 'Marshall',
    type: 'Tank',
    role: 'Support',
    rarity: 'UR',
    acquisitionPath: 'Hero pool, events',
    gameStageValue: 'Mid',
    tierRating: 'S',
    notes: 'Endgame general of the Tank class. Wins through scaling and squad-wide buffs rather than raw toughness. Speeds up allied attacks. Great in extended PvP battles. Less critical early but crucial mid-to-late. Versatile — appears in early budget squads as support filler.'
  },
  {
    name: 'Stetmann',
    type: 'Tank',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays), hero pool',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Tempo controller. Disrupts enemy coordinated ultimates and burst windows. Consistent damage-over-time that complements Kimberly burst. Slot 4 in Tank squad. Valuable in prolonged fights.'
  },
  {
    name: 'Mason',
    type: 'Tank',
    role: 'Attack',
    rarity: 'SSR-to-UR',
    acquisitionPath: 'Easy early acquisition; upgrades to UR in Season 1',
    gameStageValue: 'Early',
    tierRating: 'A',
    notes: 'Best early Tank damage dealer. SSR→UR upgrade costs resources but provides strong early-game carry potential. At max SSR, outperforms many heroes in raw damage (players report 2–4x other heroes in early game). Loses relevance once top UR heroes are built, especially if opponents have DVA/Kimberly EW. Use as filler until core UR tank squad is complete.'
  },
  {
    name: 'Scarlett',
    type: 'Tank',
    role: 'Defense',
    rarity: 'SSR',
    acquisitionPath: 'Early game, budget hero pool',
    gameStageValue: 'Early',
    tierRating: 'B',
    notes: 'Budget early frontline. Use as placeholder until Williams or Murphy available. Important synergy note: Scarlett + Adam in Tank hybrid squad with Hybrid Squad Tactics Card is surprisingly powerful vs Aircraft. Swap out once core UR tanks are built.'
  },
  {
    name: 'Monica',
    type: 'Tank',
    role: 'Support',
    rarity: 'SSR',
    acquisitionPath: 'Early game',
    gameStageValue: 'Early',
    tierRating: 'B',
    notes: 'Decent beginner support. Use as filler until better alternatives appear, then deprioritize. No meaningful endgame role.'
  },

  // ── AIRCRAFT HEROES ──
  {
    name: 'DVA',
    type: 'Aircraft',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Pinnacle of Aircraft damage. Highest burst damage in the game. Can eliminate priority targets in seconds. Non-negotiable in any Aircraft squad. Universal offensive investment — relevant in Aircraft formation AND Aircraft hybrid (Air + Murphy). With Exclusive Weapon, stat boost is multiplicative across her entire kit.'
  },
  {
    name: 'Morrison',
    type: 'Aircraft',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'Mid',
    tierRating: 'S',
    notes: 'Engine of the Aircraft formation. Breaks through enemy defenses and softens targets. Often tops damage charts in both PvE and PvP when paired correctly. Slot 3 primary damage in Air squad. Mid-game investment that stays relevant late.'
  },
  {
    name: 'Lucius',
    type: 'Aircraft',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Frontline defensive Aircraft. Absorbs opening damage and disrupts enemy formations. Slot 1 anchor in Air squad. All-rounded stats make him a flex option in Missile hybrid squads (Missile + Lucius). Without Lucius, Air squads collapse in the opening seconds of engagements.'
  },
  {
    name: 'Carlie',
    type: 'Aircraft',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Dual-role flexibility (tank/aircraft). Reinforces frontline with durability and squad support. Slot 2 in Air squad paired with Lucius. Also appears in Ultra Tank Wall formation as adaptive tank. Exceptional Aircraft hero — solid defensive stats plus above-average attack.'
  },
  {
    name: 'Schuyler',
    type: 'Aircraft',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'Mid',
    tierRating: 'A',
    notes: 'Backline threat specialist. Paralyzes enemy movement via stun abilities. Great PvP addition — disrupts opponent squads that rely on protected damage dealers. Slot 4 in Air squad targeting high-priority backline threats.'
  },

  // ── MISSILE HEROES ──
  {
    name: 'Tesla',
    type: 'Missile',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Strongest missile hero. Uncontested. Melts waves, nukes bosses, anchors most top missile formations. If you build only one missile hero, it is Tesla. High cross-formation value — appears as finisher in Tank squad AND precision damage in Missile squad. The only hero who crosses two full formation types at high impact.'
  },
  {
    name: 'Fiona',
    type: 'Missile',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Top-tier area damage. Primary damage dealer in Missile squad. Devastating cluster attacks. The entire Missile formation is built to protect and enable Fiona. Season 5 Exclusive Weapon makes Missile squads finally competitive vs Aircraft. Universal investment — high return regardless of primary troop type.'
  },
  {
    name: 'Adam',
    type: 'Missile',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'Mid',
    tierRating: 'S',
    notes: 'Frontline Missile tank. Absorbs fire and delivers counterattacks. Slot 1 in Missile squad. Also the key hybrid hero for Tank squads (Tank + Adam counters Aircraft — Adam EW allows him to survive much longer vs Aircraft than standard tanks). Advanced crowd control. Appears in Ultra Tank Wall formation.'
  },
  {
    name: 'McGregor',
    type: 'Missile',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'Mid',
    tierRating: 'A',
    notes: 'Taunt tank in Missile squad. Redirects damage away from Fiona and Tesla, allowing backline to operate uncontested. Slot 2. Note: Taunt can be self-destructive if McGregor lacks defensive stats — needs solid gear and star level to survive. Missile-formation-specific specialist.'
  },
  {
    name: 'Swift',
    type: 'Missile',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays) — exclusive UR path for F2P',
    gameStageValue: 'Early',
    tierRating: 'A',
    notes: 'Finisher role in Missile squad. Finishes off weakened targets that survive the Fiona/Tesla damage pass. Strong early when burst damage dominates. Loses relevance as fights extend and enemies become more durable. Slot 5.'
  },
  {
    name: 'Venom',
    type: 'Missile',
    role: 'Attack',
    rarity: 'SSR-to-UR',
    acquisitionPath: 'Season 5 UR Promotion unlock',
    gameStageValue: 'Late',
    tierRating: 'A',
    notes: 'Season 5 (Wild West) UR Promotion makes Venom significantly more viable. Poison-based damage works in drawn-out fights. Before S5 UR upgrade, underperforms vs burst dealers. After S5 upgrade, enables 5-man Missile squad as a serious comp. Situational before promotion, much more relevant after.'
  },
  {
    name: 'Richard',
    type: 'Missile',
    role: 'Attack',
    rarity: 'SSR',
    acquisitionPath: 'Hero pool',
    gameStageValue: 'Early',
    tierRating: 'B',
    notes: 'Decent multi-target damage but lacks durability for frontline. Niche use in specific compositions. Best as filler in early Missile squads. Not a long-term investment.'
  },
  {
    name: 'Kane',
    type: 'Missile',
    role: 'Attack',
    rarity: 'SSR',
    acquisitionPath: 'Hero pool',
    gameStageValue: 'Early',
    tierRating: 'C',
    notes: 'Low damage potential, minimal utility. Only use if no better alternatives exist. Replace immediately when possible.'
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GAME STAGE META PROGRESSION
// ─────────────────────────────────────────────────────────────────────────────

export const GAME_STAGE_META = {
  early: {
    label: 'Early Game (Days 1–60, HQ 1–20)',
    dominantType: 'Tank',
    reason: 'Tanks are the easiest UR heroes to acquire and upgrade early. Kimberly is the highest DPS early. Murphy and Williams provide massive damage reduction. UR Aircraft/Missile heroes are locked behind Ghost Ops which requires time to accumulate fragments.',
    priorityHeroes: ['Kimberly', 'Murphy', 'Williams', 'Mason (filler)', 'Marshall (support filler)'],
    recommendedSquad: 'Murphy · Williams · Kimberly · Stetmann · Marshall',
    budgetAlternative: 'Murphy · Violet/Scarlett · Kimberly · Mason · Marshall — covers frontline until Williams available',
    keyTip: 'Build one strong Tank squad first. Do not split resources between types early. Mason is a strong budget DPS until you have core UR tanks built.',
    formationBonus: 'Run all 5 Tank for +20% HP/ATK/DEF bonus. Do not break it for budget heroes from other types.'
  },
  mid: {
    label: 'Mid Game (Days 60–200, HQ 20–30)',
    dominantType: 'Aircraft (transition begins)',
    reason: 'As Ghost Ops fragment accumulation matures, Aircraft UR heroes become available. Aircraft beat Tanks by design. The meta shifts from Tank dominance to Aircraft becoming the new king of PvP. Most serious players begin transitioning their primary squad to Aircraft.',
    priorityHeroes: ['DVA', 'Lucius', 'Carlie', 'Morrison', 'Schuyler', 'Tesla (cross-formation)'],
    recommendedSquad: 'Lucius · Carlie · Morrison · Schuyler · DVA',
    secondarySquad: 'Keep Tank squad intact (Murphy · Williams · Kimberly · Stetmann · Marshall) as Squad 2 for defense',
    keyTip: 'Do not abandon your Tank squad — it becomes your defense squad. Build Aircraft as primary offensive squad. Tesla is worth maintaining in Tank squad as finisher since he crosses both formation types.',
    formationBonus: 'Aircraft squad runs full 5 Air for +20%. Tank squad remains full 5 Tank. Do not mix until you have the Hybrid Squad Tactics Card.'
  },
  late: {
    label: 'Late Game / Endgame (Days 200+, HQ 30–35)',
    dominantType: 'Aircraft (with hybrid options)',
    reason: 'By S3+, most top-tier players have 2–3 developed squads. Aircraft remains king of PvP. Missile squads become counter-picks against Aircraft-heavy alliances. The ultra-tank wall and Aircraft hybrid formations emerge as the dominant endgame meta.',
    priorityHeroes: ['DVA', 'Lucius', 'Murphy (hybrid flex)', 'Tesla', 'Fiona', 'Carlie'],
    recommendedSquad: 'Aircraft Hybrid: Lucius · Murphy · DVA · Morrison · Schuyler (with Hybrid Squad Tactics Card)',
    counterPickSquad: 'Missile: Adam · McGregor · Fiona · Tesla · Venom UR (S5+)',
    ultraTankWall: 'Williams · Carlie · Adam · Murphy · Tesla — 92% win rate in current meta per LW Handbook',
    keyTip: 'Endgame is about flexibility. The most feared squad is Aircraft hybrid borrowing Murphy from Tank. Murphy EW + high-level Tactics Cards makes him a better damage sponge than Carlie in Slot 2, even though you drop from +20% to +15% formation bonus. Murphy\'s individual tankiness compensates for the stat loss.',
    formationBonus: 'Aircraft hybrid (4+1) retains full +20% IF you have the Hybrid Squad Tactics Card. Without it, a mixed squad drops to +15% or lower. Always clarify card availability.'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SQUAD FORMATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SQUAD_FORMATIONS: SquadFormation[] = [
  {
    name: 'Standard Tank Squad',
    troopType: 'Tank',
    gameStage: 'Early',
    slots: [
      { position: 'Slot 1 (Primary Tank)', hero: 'Williams', role: 'Frontline anchor', notes: 'Taunt + team damage reduction. Non-negotiable.' },
      { position: 'Slot 2 (Secondary Tank)', hero: 'Murphy', role: 'Durability reinforcement', notes: 'Multiplicative damage reduction with Williams. Near-invulnerable frontline together.' },
      { position: 'Slot 3 (Primary Damage)', hero: 'Kimberly', role: 'AoE burst damage', notes: 'Offensive pivot. Area burst behind the wall Williams/Murphy create.' },
      { position: 'Slot 4 (Secondary Damage)', hero: 'Stetmann', role: 'Tempo control + DoT', notes: 'Disrupts enemy burst windows. Consistent damage over time.' },
      { position: 'Slot 5 (Finisher)', hero: 'Marshall', role: 'Squad buffer + finisher', notes: 'Speeds up allied attack rates. Stabilizes team in extended PvP.' },
    ],
    strengths: ['Highest durability of any formation', 'Beats Missile squads by design (20% counter advantage)', 'Williams + Murphy frontline extremely hard to crack'],
    counters: 'Aircraft squads (Aircraft beats Tank)',
    counteredBy: 'Missile Vehicle squads',
    formationBonus: '+20% HP/ATK/DEF with all 5 Tank',
    notes: 'Dominant meta in first 60 days of any server. Keep this as your defense squad even after transitioning primary to Aircraft. Swap Marshall for Tesla if you want more damage output from Slot 5 — Tesla appears in both Tank and Missile formations and adds offensive edge.'
  },
  {
    name: 'Standard Aircraft Squad',
    troopType: 'Aircraft',
    gameStage: 'Mid',
    slots: [
      { position: 'Slot 1 (Defensive Aircraft)', hero: 'Lucius', role: 'Frontline disruptor', notes: 'Without Lucius this formation collapses in opening seconds. Non-negotiable.' },
      { position: 'Slot 2 (Support Tank)', hero: 'Carlie', role: 'Frontline durability', notes: 'Dual-role flexibility. Lucius + Carlie pairing is what lets DVA/Morrison run offense safely.' },
      { position: 'Slot 3 (Primary Damage)', hero: 'Morrison', role: 'Defense breaker', notes: 'Engine of the formation. Softens targets for DVA follow-up.' },
      { position: 'Slot 4 (Backline Threat)', hero: 'Schuyler', role: 'Stun + backline targeting', notes: 'Paralyzes enemies, dismantles protected backline heroes in PvP.' },
      { position: 'Slot 5 (Burst Damage)', hero: 'DVA', role: 'Primary burst nuker', notes: 'Non-negotiable. The burst output is what makes this formation viable at high levels.' },
    ],
    strengths: ['King of mid-to-late PvP', 'Beats Tank squads by design (20% counter advantage)', 'DVA burst can end engagements before opponent stabilizes'],
    counters: 'Tank squads (Aircraft beats Tank)',
    counteredBy: 'Missile Vehicle squads',
    formationBonus: '+20% HP/ATK/DEF with all 5 Aircraft',
    notes: 'Primary offensive squad from mid-game onward for most players. Transition to this from Tank squad as your Ghost Ops fragment accumulation matures (DVA, Lucius, Carlie, Morrison, Schuyler all require Ghost Ops fragments for stars).'
  },
  {
    name: 'Standard Missile Squad',
    troopType: 'Missile',
    gameStage: 'Mid',
    slots: [
      { position: 'Slot 1 (Frontline Tank)', hero: 'Adam', role: 'Shield for backline', notes: 'Absorbs fire, delivers counterattacks. EW allows survival vs Aircraft much longer than standard tanks.' },
      { position: 'Slot 2 (Taunt Tank)', hero: 'McGregor', role: 'Redirects damage to himself', notes: 'When functional, Fiona and Tesla operate completely uncontested. Needs solid defensive gear to survive his own taunt.' },
      { position: 'Slot 3 (Primary Damage)', hero: 'Fiona', role: 'AoE cluster damage', notes: 'The entire formation is built to enable Fiona. The whole squad exists to keep her alive and firing.' },
      { position: 'Slot 4 (Precision Damage)', hero: 'Tesla', role: 'Single-target elimination', notes: 'Complements Fiona AoE with focused target elimination. Valuable in PvP for priority target removal.' },
      { position: 'Slot 5 (Finisher)', hero: 'Swift', role: 'Cleanup', notes: 'Finishes weakened targets that survive Fiona/Tesla. Ensures full eliminations, not just heavy damage.' },
    ],
    strengths: ['Long-range damage before enemies close the gap', 'Beats Aircraft squads by design (20% counter advantage)', 'S5 UR Venom significantly strengthens this comp'],
    counters: 'Aircraft squads (Missile beats Aircraft)',
    counteredBy: 'Tank squads',
    formationBonus: '+20% HP/ATK/DEF with all 5 Missile',
    notes: 'More niche "counter-pick" formation in S1–S3. Becomes a serious primary formation option in S5 with Venom UR Promotion and Fiona EW. If your server is Aircraft-heavy, a high-star Missile squad will shut them down. Still struggles against common Tank squads — adjust or counter-swap frontline when facing heavy tanks. Swap Swift for Venom UR in S5+ for maximum output.'
  },
  {
    name: 'Aircraft Hybrid (Air + Murphy)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1 (Defensive Aircraft)', hero: 'Lucius', role: 'Frontline anchor', notes: 'Remains mandatory even in hybrid.' },
      { position: 'Slot 2 (Hybrid Tank)', hero: 'Murphy', role: 'Superior damage sponge', notes: 'Murphy EW + Tactics Cards makes him better than Carlie here at high investment levels. Requires Hybrid Squad Tactics Card to retain +20%.' },
      { position: 'Slot 3 (Primary Damage)', hero: 'DVA', role: 'Burst nuker', notes: 'Morrison or DVA in Slot 3/5 depending on matchup.' },
      { position: 'Slot 4 (Damage)', hero: 'Morrison', role: 'Defense breaker', notes: 'Softens for DVA.' },
      { position: 'Slot 5 (Control)', hero: 'Schuyler', role: 'Backline stun', notes: 'PvP disruption.' },
    ],
    strengths: ['Most feared endgame squad in high-level PvP', 'Murphy durability + Aircraft burst = nearly uncounterable at full investment', 'Counter protection via Hybrid Squad card reduces troop type disadvantage vulnerability'],
    counters: 'Tank squads',
    counteredBy: 'Pure Missile squads (though morale/power offsets this)',
    formationBonus: 'Full +20% retained ONLY with Hybrid Squad (4+1) Tactics Card active',
    notes: 'Without the Hybrid Squad Tactics Card, mixed type formation drops to +15% (4 Aircraft) and you lose the bonus advantage. Run this only when the card is available and invested. Murphy at Exclusive Weapon level 10+ strongly recommended — level 1 EW already helps significantly. This is a late-game endgame squad, not a beginner option.'
  },
  {
    name: 'Tank Hybrid (Tank + Adam)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1', hero: 'Scarlett', role: 'Budget frontline tank', notes: 'Scarlett + Adam synergy is specifically called out as nearly unstoppable vs Aircraft. Important pairing.' },
      { position: 'Slot 2', hero: 'Murphy', role: 'Damage reduction anchor', notes: 'Core tank durability.' },
      { position: 'Slot 3 (Hybrid)', hero: 'Adam', role: 'Missile hero in Tank squad', notes: 'Counter pick vs Aircraft. Adam EW allows survival much longer vs Aircraft than pure tanks. Requires Hybrid Squad Tactics Card to retain +20%.' },
      { position: 'Slot 4', hero: 'Marshall', role: 'Squad buffer', notes: 'Attack speed scaling.' },
      { position: 'Slot 5', hero: 'Kimberly', role: 'AoE burst', notes: 'Primary Tank DPS.' },
    ],
    strengths: ['Specifically designed to counter Aircraft squads that normally shred Tank formations', 'Scarlett + Adam synergy is a notably strong pairing', 'Useful for Tank mains who refuse to or cannot switch to Aircraft'],
    counters: 'Aircraft squads (when using Hybrid Squad card)',
    counteredBy: 'Pure Missile squads',
    formationBonus: 'Full +20% retained ONLY with Hybrid Squad (4+1) Tactics Card active',
    notes: 'For Tank-main players who need an Aircraft counter without rebuilding their whole roster. Adam\'s Exclusive Weapon is critical for this to work effectively. Without EW investment, Adam survives the opening Aircraft engagement briefly but not reliably enough to change the outcome.'
  },
  {
    name: 'Missile Hybrid (Missile + Lucius)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1 (Hybrid)', hero: 'Lucius', role: 'All-rounded defensive flex', notes: 'Provides good all-round stats and defensive presence for the Missile backline.' },
      { position: 'Slot 2', hero: 'Swift', role: 'Finisher', notes: 'Cleanup on weakened targets.' },
      { position: 'Slot 3', hero: 'Tesla', role: 'Precision damage', notes: 'Single target elimination.' },
      { position: 'Slot 4', hero: 'Fiona', role: 'AoE damage', notes: 'Core Missile damage engine.' },
      { position: 'Slot 5', hero: 'Adam', role: 'Frontline tank', notes: 'Absorbs fire for backline.' },
    ],
    strengths: ['Lucius all-rounded stats improve Missile squad survivability', 'Counter protection against Aircraft matchups', 'Good defensive platform for sustained Missile output'],
    counters: 'Aircraft squads',
    counteredBy: 'Tank squads',
    formationBonus: 'Full +20% retained ONLY with Hybrid Squad (4+1) Tactics Card active',
    notes: 'Less commonly seen than Air + Murphy or Tank + Adam hybrids. Lucius brings solid stats to a Missile squad that otherwise lacks defensive depth. Best as a counter-pick option when facing Aircraft-heavy opponents and your core Missile squad needs more survivability.'
  },
  {
    name: 'Ultra Tank Wall (Meta Formation)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Front Row Slot 1', hero: 'Williams', role: 'Main Tank anchor', notes: 'Taunt + team damage reduction.' },
      { position: 'Front Row Slot 2', hero: 'Carlie', role: 'Adaptive Tank', notes: 'Dual-role Tank/Aircraft flex. Formation adaptation capability.' },
      { position: 'Front Row Slot 3', hero: 'Adam', role: 'Control Tank', notes: 'Advanced crowd control + tank survivability, prevents formation disruption.' },
      { position: 'Back Row Slot 4', hero: 'Murphy', role: 'Elite Tank/Control', notes: 'Premium survivability with control specialization.' },
      { position: 'Back Row Slot 5', hero: 'Tesla', role: 'Sustained Damage', notes: 'Protected damage output from the quad-tank platform.' },
    ],
    strengths: [
      '92%+ win rate across all competitive tiers per LW Handbook data (highest in game history)',
      'Quad-tank provides 300–400% effective HP vs traditional formations',
      'Extended 60–120 second battles heavily favor this formation',
      'Built-in crowd control prevents enemy disruption',
      'Extremely rare to have 90%+ penetration needed to counter it'
    ],
    counters: 'All other formation archetypes in current meta',
    counteredBy: 'Very high penetration builds (90%+ — extremely rare)',
    formationBonus: 'Mixed types — no full +20% bonus. Trades formation bonus for overwhelming individual hero durability.',
    notes: 'The most feared endgame formation in competitive play as of 2025. Sacrifices the +20% formation type bonus entirely for such overwhelming individual hero durability that the tradeoff is justified at max investment. This is a high-investment endgame formation — not viable until Williams, Carlie, Adam, Murphy, and Tesla are all significantly starred and geared. Not a formation to rush. Build toward it once your primary mono-type squads are mature.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HERO INVESTMENT PRIORITY ORDER
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_INVESTMENT_PRIORITY: HeroInvestmentRule[] = [
  { priority: 1, hero: 'Kimberly', reason: 'Highest early DPS, never wasted, Tank squad foundation. First hero to build.', stageUnlock: 'Day 1' },
  { priority: 2, hero: 'Murphy', reason: 'Cornerstone defense, F2P accessible, flexes into Aircraft hybrid endgame. Second hero to build.', stageUnlock: 'Day 1' },
  { priority: 3, hero: 'Williams', reason: 'Primary tank anchor. Murphy + Williams together = best defensive frontline in game.', stageUnlock: 'Day 1 (Ghost Ops fragments accumulate)' },
  { priority: 4, hero: 'DVA', reason: 'Universal offensive investment. Non-negotiable in Aircraft squad. High-return burst damage in any offensive formation.', stageUnlock: 'Ghost Ops (Thursdays) — build frags over time' },
  { priority: 5, hero: 'Fiona', reason: 'Universal missile investment. High return regardless of your primary type. Core of the Missile formation.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 6, hero: 'Tesla', reason: 'Only hero who crosses two full formation types at high value (Tank finisher + Missile precision). High ROI.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 7, hero: 'Lucius', reason: 'Mandatory Aircraft frontline. Without Lucius, Air squads fold instantly. Also useful in Missile hybrid.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 8, hero: 'Carlie', reason: 'Dual-role flex. Air squad Slot 2, also appears in Ultra Tank Wall. Solid defensive investment.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 9, hero: 'Stetmann', reason: 'Slot 4 in Tank squad. Tempo control prevents opponent burst windows.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 10, hero: 'Morrison', reason: 'Aircraft primary damage dealer. High-priority once Aircraft squad is under construction.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 11, hero: 'Marshall', reason: 'Squad buffer and scaling support. Great in Tank squad and as budget filler.', stageUnlock: 'Day 1 hero pool' },
  { priority: 12, hero: 'Adam', reason: 'Missile frontline AND Tank hybrid counter-pick. Unique dual-squad role. Later priority since requires EW to shine in hybrid.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 13, hero: 'Schuyler', reason: 'PvP backline threat and stun specialist. Slot 4 in Air squad. Good mid-game investment.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 14, hero: 'McGregor', reason: 'Missile squad Slot 2. Missile-specific specialist — invest after core cross-formation heroes are established.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 15, hero: 'Swift', reason: 'Missile finisher. Lower priority — Slot 5 cleanup role.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 16, hero: 'Venom', reason: 'Situational before S5 UR Promotion. Strong after S5 unlock — enables 5-man Missile. Plan around S5 timing.', stageUnlock: 'Season 5 promotion' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MIXED SQUAD GUIDE
// ─────────────────────────────────────────────────────────────────────────────

export const MIXED_SQUAD_GUIDE: MixedSquadOption[] = [
  {
    name: 'Air + Murphy (Aircraft Hybrid)',
    basetype: 'Aircraft',
    hybridHero: 'Murphy',
    composition: ['Lucius', 'Murphy', 'DVA', 'Morrison', 'Schuyler'],
    requiresHybridCard: true,
    formationBonusRetained: '+20% retained with Hybrid Squad (4+1) Tactics Card. Without card: drops to +15%.',
    whyItWorks: 'Murphy EW + high-level Tactics Cards makes him a better damage sponge than Carlie at Slot 2. Even losing the 5-hero type bonus (20% → 15%), Murphy\'s individual tankiness allows your Aircraft backline more time to eliminate the enemy. The most feared endgame PvP squad.',
    bestUsedFor: 'High-level PvP offense, VS Day rallies, any matchup where you need Aircraft burst output with superior frontline survivability'
  },
  {
    name: 'Tank + Adam (Aircraft Counter)',
    basetype: 'Tank',
    hybridHero: 'Adam',
    composition: ['Scarlett', 'Murphy', 'Adam', 'Marshall', 'Kimberly'],
    requiresHybridCard: true,
    formationBonusRetained: '+20% retained with Hybrid Squad (4+1) Tactics Card. Without card: drops to +15%.',
    whyItWorks: 'Adam\'s Exclusive Weapon allows him to survive against Aircraft formations much longer than standard tanks. Scarlett + Adam synergy is specifically noted as nearly unstoppable vs Aircraft. The Tank squad\'s natural Missile counter weakness becomes manageable because you still have full Tank formation bonuses on the remaining 4.',
    bestUsedFor: 'Counter-picking Aircraft-heavy alliances or opponents. Best option for Tank mains who cannot or will not switch to an Aircraft primary squad.'
  },
  {
    name: 'Missile + Lucius (Lucius Flex)',
    basetype: 'Missile',
    hybridHero: 'Lucius',
    composition: ['Lucius', 'Swift', 'Tesla', 'Fiona', 'Adam'],
    requiresHybridCard: true,
    formationBonusRetained: '+20% retained with Hybrid Squad (4+1) Tactics Card. Without card: drops to +15%.',
    whyItWorks: 'Lucius is all-rounded and provides good stats to the team. Improves Missile squad survivability significantly. Useful when Missile heroes lack the defensive depth to protect Fiona.',
    bestUsedFor: 'Missile mains who need more frontline durability. Counter-pick vs Aircraft opponents.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HYBRID SQUAD TACTICS CARD — KEY RULES
// ─────────────────────────────────────────────────────────────────────────────

export const HYBRID_SQUAD_TACTICS_CARD_RULES = {
  whatItDoes: 'Allows 1 hero of a different type while maintaining the full +20% type bonus. Without this card, any mixed type formation drops to the lower formation bonus tier (3+2 = +10%, 4+1 = +15%, etc).',
  whenAvailable: 'Season 4 (Evernight Isle) and Season 5 (Wild West). Not available in early seasons.',
  criticalRule: 'Only run mixed squads AFTER you have this card. Before it, you are always better off with full mono-type to preserve the +20% bonus.',
  recommendedSetups: [
    'Air + Murphy — most versatile for attacks; fastest march speed + morale bonus',
    'Tank + Adam — best Aircraft counter for Tank mains',
    'Missile + Lucius — improved survivability for Missile players'
  ],
  quickstrikeNote: 'The Quickstride + Hybrid Squad setup is the most versatile for attacking — provides counter protection, faster speed, and higher morale. Morale bonus does NOT apply when defending (garrisoned) — better for mobile offensive squads.',
  formationBonusWithoutCard: {
    '5 same type': '+20%',
    '4 same type': '+15%',
    '3+2 mixed': '+10%',
    '3 same type': '+5%',
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POWERING UP NON-META HEROES — MAKING THEM COMPARABLE
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_POWER_UP_GUIDE = {
  overview: 'When a player is stuck with non-meta heroes or cannot yet access top UR heroes via Ghost Ops, the following levers close the power gap significantly.',

  universalLevers: [
    {
      lever: 'Star Rank',
      impact: 'Single biggest power multiplier. Each star unlocks passive skills and significantly boosts base stats. Getting any hero to 3-star before pushing another to 5-star is standard advice.',
      tip: 'For Ghost Ops UR heroes (DVA, Lucius, etc.): 5 fragments per star. Prioritize stars on your primary DPS (Kimberly, then DVA) before supporting cast.'
    },
    {
      lever: 'Exclusive Weapon (EW)',
      impact: 'Game-changing upgrade. Each EW level provides ~10% base stat boost that scales through the hero\'s full kit. Murphy EW at level 10+ transforms him from a solid tank into a near-indestructible anchor. DVA EW unlocks her full burst potential. Second biggest power lever after stars.',
      tip: 'Priority EW order: Kimberly EW first → Murphy EW second → then primary Aircraft hero (DVA or Lucius based on squad). EW at level 1 already provides meaningful boost — do not wait for level 20 before using.'
    },
    {
      lever: 'Skill Levels',
      impact: 'Get ALL skills to level 20 on your primary heroes before focusing stars on secondary heroes. Skill levels provide substantial stat boosts and unlock new ability tiers. See lwtHeroData.ts for squad-specific skill priority order per troop type.',
      tip: 'Skill investment is often more efficient than star-chasing for mid-game power gain. Exception: certain passive skills (like Murphy\'s Super Sensing at 4-star) require stars, not skill levels.'
    },
    {
      lever: 'Gear',
      impact: 'Epic/Legendary tier gear with the right substats provides significant power multipliers. Focus gear investment on your primary formation first — do not spread across all heroes equally.',
      tip: 'For defensive heroes (Williams, Murphy, Carlie): prioritize Armor + Radar with HP% and Defense substats. For offensive heroes (Kimberly, DVA, Fiona): prioritize Attack% and Crit substats. Never upgrade blue/green rarity gear — only Epic/Legendary.'
    },
    {
      lever: 'Skill Chips',
      impact: 'Combat Boost activates all chips simultaneously at milestones (150 → 300 → 450). Versus Mode provides 30 premium mats/day — best F2P source. Chip Lab unlocks at HQ 15.',
      tip: 'All heroes in your active squad benefit from Combat Boost. Prioritize Chip Lab investment alongside hero investment.'
    },
    {
      lever: 'Formation Bonus (same-type squad)',
      impact: 'A same-type 5-hero squad gets +20% HP/ATK/DEF. Even weaker heroes get this bonus. Running 5 B-tier heroes of the same type with full formation bonus often beats 5 mixed A-tier heroes.',
      tip: 'Never break your formation type for a slightly stronger off-type hero unless you have the Hybrid Squad Tactics Card. The +20% formation bonus is often worth more than one hero\'s individual stats.'
    },
    {
      lever: 'Mason SSR→UR Upgrade',
      impact: 'In Season 1, maxed Mason can be promoted to UR. Stats increase significantly. Early-game players report Mason doing 2–4x the damage of other heroes in their squad when built correctly.',
      tip: 'Cost consideration: upgrading a maxed SSR Mason to UR requires starting his star rank over from scratch (you get resources back but must re-invest). If you plan to build top UR heroes eventually, Mason UR is a bridge — good for early, diminishing returns when DVA/Kimberly EW are fully built.'
    },
    {
      lever: 'VIP Status',
      impact: 'VIP activation bonuses apply to all hero development actions started during the active window. VIP Level milestones unlock key buffs (VIP 11 = +7.5% hero stats).',
      tip: '30-day VIP activation (10k diamonds) = 333 diamonds/day cost but 2,000 diamonds for the buff window. Better ROI than daily 200-diamond activations. Plan hero upgrade sessions around active VIP status for maximum efficiency.'
    }
  ],

  makingBudgetHeroesCompetitive: {
    scenario: 'Player has SSR heroes or early UR heroes and cannot yet access top Ghost Ops URs',
    approach: [
      '1. Run full mono-type squad for +20% formation bonus — this alone makes a B-tier squad competitive against a mixed A-tier squad',
      '2. Max skill levels on your best 3 heroes before distributing',
      '3. Star up primary DPS (Kimberly/DVA/Fiona depending on type) to 3-star minimum before pushing others',
      '4. Get Exclusive Weapon on primary DPS to level 5+ immediately — level 1 EW already helps',
      '5. Focus gear on top 2 heroes — do not spread across all 5 equally',
      '6. Use Mason UR promotion in S1 as bridge DPS until true UR roster matures',
      '7. Attend Ghost Ops every Thursday without fail — UR fragments accumulate steadily over weeks'
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — BUDDY SUMMARY FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function getHeroSquadDataSummary(): string {
  const heroList = HERO_PROFILES.map(h =>
    `${h.name} (${h.type} · ${h.role} · ${h.rarity} · ${h.tierRating}-tier · Best: ${h.gameStageValue}): ${h.notes}`
  ).join('\n');

  const formationList = SQUAD_FORMATIONS.map(f =>
    `[${f.name} — ${f.gameStage}] Slots: ${f.slots.map(s => `${s.hero}(${s.position})`).join(' → ')} | Beats: ${f.counters} | Weak to: ${f.counteredBy} | Bonus: ${f.formationBonus} | ${f.notes}`
  ).join('\n');

  const mixedList = MIXED_SQUAD_GUIDE.map(m =>
    `[${m.name}] Composition: ${m.composition.join(' · ')} | Hybrid Card Required: ${m.requiresHybridCard} | ${m.whyItWorks} | Best for: ${m.bestUsedFor}`
  ).join('\n');

  const investmentList = HERO_INVESTMENT_PRIORITY.map(r =>
    `#${r.priority}. ${r.hero} — ${r.reason}`
  ).join('\n');

  const stageMeta = Object.values(GAME_STAGE_META).map(s =>
    `[${s.label}] Dominant: ${s.dominantType} | Squad: ${s.recommendedSquad} | ${s.keyTip}`
  ).join('\n');

  return `
=== HERO SQUAD COMPOSITION & META GUIDE ===

── HERO PROFILES (All named heroes) ──
${heroList}

── GAME STAGE META PROGRESSION ──
${stageMeta}

── CANONICAL SQUAD FORMATIONS ──
${formationList}

── MIXED SQUAD OPTIONS (require Hybrid Squad Tactics Card in S4/S5) ──
${mixedList}

── HYBRID SQUAD TACTICS CARD RULES ──
Formation bonuses WITHOUT Hybrid Card: 5-same=+20% | 4+1=+15% | 3+2=+10% | 3-same=+5%
Hybrid Squad (4+1) card: preserves full +20% with 1 off-type hero. Available S4+.
Morale bonus does NOT apply when defending/garrisoned — use hybrid for mobile offensive squads.
Best hybrid combos: Air+Murphy (best PvP offense) | Tank+Adam (Aircraft counter) | Missile+Lucius (durability)

── HERO INVESTMENT PRIORITY ──
${investmentList}

── HERO POWER-UP LEVERS (making any hero comparable) ──
Key levers in order of impact: Exclusive Weapon → Star Rank → Skill Levels → Gear → Formation Bonus → Skill Chips → VIP Status
NEVER break formation type without Hybrid Squad Tactics Card — the +20% bonus often outweighs one hero's individual stats.
Ghost Ops (Thursdays) is the only F2P path to exclusive UR heroes (DVA, Lucius, Morrison, Carlie, Schuyler, McGregor, Stetmann, Adam, Fiona, Tesla, Swift). 5 fragments per star. Attend every Thursday without fail.
Mason SSR→UR in S1 is a strong budget bridge — 2–4x damage of SSR peers, but loses relevance once top URs are built with EW.
`.trim();
}