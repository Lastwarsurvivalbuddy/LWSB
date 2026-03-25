// lwtHeroSquadData.ts
// Hero Squad Composition, Game-Stage Meta, Mixed Squads, Hero Power-Up Guide, Battle Report Analysis
// Sources: cpt-hedge.com, allclash.com, lastwarhandbook.com, packsify.com, bluestacks.com
// Session 59 — original build
// Session 72 — added: battle report formation detection, morale system deep-dive,
//   Swift/Schuyler/Sarah/Carlie non-obvious mechanics, EW tier, damage type layer,
//   hospital overflow, morale drag, reinforcer stat masking, partial rally penalty

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
    notes: 'Highest DPS in the early game and remains dominant endgame. Exceptional AoE burst with stacking energy amplification. First Tank hero to build. Non-negotiable in any Tank squad. Energy damage type — countered by Carlie/Lucius energy resistance. EW L10 adds extra rocket on tactics, L20 gives all Tank heroes +7.5% bonus.',
  },
  {
    name: 'Murphy',
    type: 'Tank',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Season 2 Exclusive Weapon; accessible early via hero pool',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Cornerstone defensive anchor. Stand Firm (17% passive) × Ironclad Barrier (29% active) × EW mitigation = multiplicative damage reduction. Effective HP 2–3x displayed stats. Pairs with Williams for near-invulnerable frontline. At EW L10+ becomes better damage sponge than Carlie in Aircraft hybrid Slot 2, enabling the Air+Murphy endgame meta. F2P viable. 4-star minimum for Super Sensing passive.',
  },
  {
    name: 'Williams',
    type: 'Tank',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays), hero pool',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Primary tank anchor. Taunt forces enemies to target him. Team-wide damage reduction aura. Williams + Murphy = the defining frontline pairing of Tank meta. EW L30 adds status immunity and up to 75% damage reduction.',
  },
  {
    name: 'Marshall',
    type: 'Tank',
    role: 'Support',
    rarity: 'UR',
    acquisitionPath: 'Hero pool, events',
    gameStageValue: 'Mid',
    tierRating: 'S',
    notes: 'Universal support hero. Speeds up allied attack rates. The ONLY UR support hero — works in Tank, Aircraft, or Missile formation without type penalty. SARAH vs MARSHALL: Marshall beats Sarah in almost all situations. Marshall\'s combat buffs are stronger, he works in any formation without sacrificing type slot. Sarah only wins for Aircraft type bonus preservation or PvE monster content.',
  },
  {
    name: 'Stetmann',
    type: 'Tank',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays), hero pool',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Tempo controller. Disrupts enemy coordinated ultimates and burst windows. Consistent energy damage-over-time that complements Kimberly burst. Slot 4 in Tank squad.',
  },
  {
    name: 'Mason',
    type: 'Tank',
    role: 'Attack',
    rarity: 'SSR-to-UR',
    acquisitionPath: 'Easy early acquisition; upgrades to UR in Season 1',
    gameStageValue: 'Early',
    tierRating: 'A',
    notes: 'Best early Tank DPS. SSR→UR in Season 1. Players report 2–4x damage vs other heroes when built correctly. Strong with Murphy + Kimberly core. Loses relevance once full UR Tank roster is mature. Bridge hero.',
  },
  {
    name: 'Scarlett',
    type: 'Tank',
    role: 'Defense',
    rarity: 'SSR-to-UR',
    acquisitionPath: 'Early game; SSR→UR in Season 3 (Golden Realm)',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Early SSR: budget frontline. UR form (S3+): one of the strongest Tank heroes — incredible team damage mitigation. IMPORTANT SYNERGY: Scarlett + Adam in Tank hybrid with Hybrid Squad Tactics Card is specifically noted as nearly unstoppable vs Aircraft.',
  },

  // ── AIRCRAFT HEROES ──
  {
    name: 'DVA',
    type: 'Aircraft',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Highest burst damage in the game. Steel Barrage AoE can eliminate priority targets before they fire. Non-negotiable in Aircraft squad or Aircraft hybrid. EW scales energy damage with Aircraft hero count. L20 = all Aircraft heroes +7.5%. Always Slot 5 backline.',
  },
  {
    name: 'Lucius',
    type: 'Aircraft',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Frontline Aircraft anchor. Knight\'s Spirit = team-wide energy damage reduction — specifically hardens squad vs Kimberly/Tesla energy-heavy Tank squads. Silver Armor reduces damage for front-row allies. Without Lucius, Aircraft squads collapse in opening seconds. Also flexes into Missile hybrid (Missile+Lucius). EW S4 W1 — highest priority EW in the game, works on any formation type.',
  },
  {
    name: 'Carlie',
    type: 'Aircraft',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'All',
    tierRating: 'S',
    notes: 'Aircraft frontline tank Slot 2. Energy Adaptation = 40% energy damage reduction, hard-counters energy-heavy opponents. 963K HP. Inferno Blaze debuffs enemy team. The Lucius+Carlie dual frontline protects DVA/Morrison backline. REPLACEMENT NOTE: At high endgame with Murphy EW L10+, Murphy replaces Carlie in Slot 2 (Air+Murphy hybrid) because Murphy multiplicative mitigation outweighs the 5% type synergy loss. Requires Hybrid Squad Tactics Card. Carlie is NOT replaced by Sarah — they occupy different slots.',
  },
  {
    name: 'Morrison',
    type: 'Aircraft',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'Mid',
    tierRating: 'S',
    notes: 'Aircraft primary DPS Slot 3. Armor Piercing Shot shreds enemy DEF, softening targets for DVA follow-up. Full-Auto Machine Gun deals physical damage (relevant vs energy-resistant targets). Engine of the Aircraft formation. Slot 3.',
  },
  {
    name: 'Schuyler',
    type: 'Aircraft',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'Mid',
    tierRating: 'A',
    notes: 'Aircraft backline threat Slot 4. CRITICAL MECHANIC: Blast Frenzy BYPASSES front row and targets 1 back-row unit directly (927% energy damage + 20% stun 2s). The stun prevents the target\'s queued tactical from firing — can stop enemy DVA from firing Steel Barrage at critical moments. Battle report: if your backline took damage while your front row was alive, opponent likely had Schuyler. She is NOT a replacement for Carlie — they occupy different slots.',
  },
  {
    name: 'Sarah',
    type: 'Aircraft',
    role: 'Support',
    rarity: 'SSR-to-UR',
    acquisitionPath: 'Hero pool; SSR→UR promotion Season 4',
    gameStageValue: 'Mid',
    tierRating: 'B',
    notes: 'DUAL ROLE: development hero (research speed) AND combat Aircraft support. As combat hero: outclassed by Marshall in most situations. Niche: (1) F2P players maintaining 5-hero Aircraft type bonus when Schuyler not built; (2) PvE monster content with backline ATK buffs and monster damage bonuses; (3) S4+ UR promotion synergy passive that scales with promoted heroes. Sarah vs Schuyler in Slot 4: Schuyler wins PvP, Sarah wins PvE monster content. Sarah vs Marshall as support: Marshall almost always better. UR form (S4) adds Promotion Synergy passive.',
  },

  // ── MISSILE HEROES ──
  {
    name: 'Tesla',
    type: 'Missile',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Strongest Missile hero. Electric Grid Lockdown targets 3 BACK-ROW units directly — bypasses front row entirely, can threaten DVA/Kimberly directly. Lightning Chain stacks energy damage. Unique: high cross-formation value in both Tank squad (finisher/precision) and Missile squad (primary DPS). EW dramatically increases his value — don\'t fully evaluate Tesla without EW.',
  },
  {
    name: 'Fiona',
    type: 'Missile',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'All',
    tierRating: 'SS',
    notes: 'Core Missile AoE damage. The entire Missile formation protects Fiona. S5 EW adds anti-Aircraft radiation — finally makes Missile competitive vs Aircraft. Slot 3. Fourth investment priority in Missile team (after Tesla → Adam → McGregor → Fiona → Swift).',
  },
  {
    name: 'Adam',
    type: 'Missile',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'Mid',
    tierRating: 'S',
    notes: 'Frontline Missile tank Slot 1. Spike Armor damage reduction + Counter Defense retaliation. EW spreads counterattack to entire team at L10 — core mechanic of Tank+Adam anti-Aircraft hybrid. Allows Tank squad to counter Aircraft. Second investment priority in Missile team.',
  },
  {
    name: 'McGregor',
    type: 'Missile',
    role: 'Defense',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'Mid',
    tierRating: 'A',
    notes: 'Missile taunt tank Slot 2. Unyielding Heart redirects ALL damage to McGregor — protects Fiona/Tesla completely while active. Double-edged: if McGregor dies, entire backline is immediately exposed. Needs DEF-priority gear + 4-star minimum. Battle report signal: McGregor died early → backline damage spike is gear/star problem, not formation problem. Third investment priority in Missile team.',
  },
  {
    name: 'Swift',
    type: 'Missile',
    role: 'Attack',
    rarity: 'UR',
    acquisitionPath: 'Ghost Ops (Thursdays)',
    gameStageValue: 'Early',
    tierRating: 'A',
    notes: 'Missile finisher Slot 5. CORE MECHANIC: Targeted Strike (auto, 408% ATK) ALWAYS targets the enemy with LOWEST HP PERCENTAGE — automatic, always. 30%+ base crit rate, bonus damage scales with upgrade. Precise Guidance stacks ATK infinitely — better in long fights, modest in short PvP. Value: in extended World Boss he becomes top damage dealer. Battle report: Swift shows low kills = not a Swift problem; means Fiona/Tesla failed to create low-HP targets for him to finish. Fifth investment priority in Missile team.',
  },
  {
    name: 'Venom',
    type: 'Missile',
    role: 'Attack',
    rarity: 'SSR-to-UR',
    acquisitionPath: 'Season 5 UR Promotion',
    gameStageValue: 'Late',
    tierRating: 'A',
    notes: 'S5 UR Promotion significantly improves viability. Enables 5-man Missile squad as serious comp alongside Fiona EW. Before S5 promotion: situational. After promotion: pair with Fiona EW for first reliable Missile vs Aircraft matchup.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GAME STAGE META PROGRESSION
// ─────────────────────────────────────────────────────────────────────────────

export const GAME_STAGE_META = {
  early: {
    label: 'Early Game (Days 1–60, HQ 1–20)',
    dominantType: 'Tank',
    reason: 'Tanks are the easiest UR heroes to acquire and upgrade early. Kimberly is the highest DPS early. Murphy and Williams provide massive damage reduction. Ghost Ops UR heroes require time to accumulate fragments.',
    priorityHeroes: ['Kimberly', 'Murphy', 'Williams', 'Mason (filler)', 'Marshall (support filler)'],
    recommendedSquad: 'Murphy · Williams · Kimberly · Stetmann · Marshall',
    budgetAlternative: 'Murphy · Violet/Scarlett · Kimberly · Mason · Marshall',
    keyTip: 'Build one strong Tank squad first. Do not split resources between types. Mason UR bridges until core UR tanks mature.',
    formationBonus: 'Run all 5 Tank for +20%. Never break it for budget off-type heroes.',
  },
  mid: {
    label: 'Mid Game (Days 60–200, HQ 20–30)',
    dominantType: 'Aircraft (transition begins)',
    reason: 'Ghost Ops fragment accumulation matures — Aircraft UR heroes become available. Aircraft beats Tanks by design. Meta shifts from Tank dominance to Aircraft as PvP king.',
    priorityHeroes: ['DVA', 'Lucius', 'Carlie', 'Morrison', 'Schuyler', 'Tesla (cross-formation)'],
    recommendedSquad: 'Lucius · Carlie · Morrison · Schuyler · DVA',
    secondarySquad: 'Keep Tank squad intact (Murphy · Williams · Kimberly · Stetmann · Marshall) as Squad 2 defense',
    keyTip: 'Do not abandon Tank squad — it becomes your defense squad. Build Aircraft as primary offensive squad. Tesla maintains value in both squads.',
    formationBonus: 'Aircraft squad: full 5 Aircraft = +20%. Tank squad: full 5 Tank = +20%. Do not mix until Hybrid Squad Tactics Card is available.',
  },
  late: {
    label: 'Late Game / Endgame (Days 200+, HQ 30–35)',
    dominantType: 'Aircraft (with hybrid options)',
    reason: 'By S3+, top players have 2–3 developed squads. Aircraft remains PvP king. Missile counter-picks emerge. Ultra Tank Wall and Aircraft hybrid formations define the competitive meta.',
    priorityHeroes: ['DVA', 'Lucius', 'Murphy (hybrid flex)', 'Tesla', 'Fiona', 'Carlie'],
    recommendedSquad: 'Aircraft Hybrid: Lucius · Murphy · DVA · Morrison · Schuyler (with Hybrid Squad Tactics Card)',
    counterPickSquad: 'Missile: Adam · McGregor · Fiona · Tesla · Venom UR (S5+)',
    ultraTankWall: 'Williams · Carlie · Adam · Murphy · Tesla — 92%+ win rate, highest in game history',
    keyTip: 'Most feared endgame squad: Air+Murphy hybrid. Murphy EW L10+ + Tactics Cards makes him a better Slot 2 tank than Carlie even dropping from +20% to +15% type bonus. The Hybrid Squad card restores full +20%. Without that card, always run pure mono-type.',
    formationBonus: 'Aircraft hybrid (4+1) retains full +20% ONLY with Hybrid Squad (4+1) Tactics Card.',
  },
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
      { position: 'Slot 2 (Secondary Tank)', hero: 'Murphy', role: 'Multiplicative mitigation', notes: 'Stand Firm × Ironclad Barrier = near-invulnerable with Williams.' },
      { position: 'Slot 3 (Primary Damage)', hero: 'Kimberly', role: 'AoE burst', notes: 'Energy damage. Countered by Carlie/Lucius energy resistance builds.' },
      { position: 'Slot 4 (Tempo Control)', hero: 'Stetmann', role: 'Disrupts burst windows + DoT', notes: 'Prevents opponent coordinated ultimates.' },
      { position: 'Slot 5 (Buffer/Finisher)', hero: 'Marshall', role: 'Attack speed buff', notes: 'Swap for Tesla if you need more offensive punch in Slot 5.' },
    ],
    strengths: ['Highest durability', 'Beats Missile squads (20% counter)', 'Williams+Murphy frontline near-uncounterable without penetration builds'],
    counters: 'Missile Vehicle squads',
    counteredBy: 'Aircraft squads',
    formationBonus: '+20% HP/ATK/DEF with all 5 Tank',
    notes: 'Dominant meta Days 1–60. Keep as defense squad when transitioning to Aircraft primary. Tesla can replace Marshall in Slot 5 for more damage output at the cost of support utility.',
  },
  {
    name: 'Standard Aircraft Squad',
    troopType: 'Aircraft',
    gameStage: 'Mid',
    slots: [
      { position: 'Slot 1 (Defensive Aircraft)', hero: 'Lucius', role: 'Frontline disruptor + energy resist', notes: 'Knight\'s Spirit gives team-wide energy reduction. Non-negotiable.' },
      { position: 'Slot 2 (Frontline Tank)', hero: 'Carlie', role: 'Energy damage sponge', notes: '40% energy reduction hardcounters Kimberly/Tesla. 963K HP. This slot transitions to Murphy at endgame.' },
      { position: 'Slot 3 (Primary DPS)', hero: 'Morrison', role: 'DEF shredder', notes: 'Softens all enemies for DVA. Physical damage complements energy damage layer.' },
      { position: 'Slot 4 (Backline Threat)', hero: 'Schuyler', role: 'Backline stun + bypass', notes: 'Bypasses front row entirely. 20% stun can prevent enemy DVA/Kimberly from firing.' },
      { position: 'Slot 5 (Burst Nuker)', hero: 'DVA', role: 'Primary burst damage', notes: 'Non-negotiable. Steel Barrage AoE. Keep protected at all costs.' },
    ],
    strengths: ['PvP king mid-to-endgame', 'Beats Tanks (20% counter)', 'Lucius+Carlie energy resistance vs Tank energy damage', 'Schuyler stun disrupts enemy burst windows', 'DVA burst can end fights instantly'],
    counters: 'Tank squads',
    counteredBy: 'Missile Vehicle squads',
    formationBonus: '+20% HP/ATK/DEF with all 5 Aircraft',
    notes: 'Primary offensive squad from mid-game onward. DVA upgrade order: DVA → Carlie → Morrison → Lucius → Schuyler. All heroes acquired via Ghost Ops fragment accumulation (Thursdays). Sarah can replace Schuyler in Slot 4 for PvE monster content ONLY.',
  },
  {
    name: 'Standard Missile Squad',
    troopType: 'Missile',
    gameStage: 'Mid',
    slots: [
      { position: 'Slot 1 (Frontline Tank)', hero: 'Adam', role: 'Absorption + counterattack', notes: 'EW spreads counterattack to team at L10.' },
      { position: 'Slot 2 (Taunt Tank)', hero: 'McGregor', role: 'Redirects ALL damage to himself', notes: 'Protects Fiona/Tesla completely. If he dies early = formation failure (gear/star problem, not formation problem).' },
      { position: 'Slot 3 (AoE Damage)', hero: 'Fiona', role: 'Core damage engine', notes: 'The squad exists to keep Fiona alive and firing.' },
      { position: 'Slot 4 (Precision Damage)', hero: 'Tesla', role: 'Single-target elimination + backline bypass', notes: 'Electric Grid Lockdown hits back row directly — can reach enemy DVA/Kimberly.' },
      { position: 'Slot 5 (Finisher)', hero: 'Swift', role: 'Execution of wounded targets', notes: 'Always attacks lowest-HP% enemy. Needs Fiona/Tesla damage to create low-HP targets. Low kills = upstream problem with Fiona/Tesla, never a Swift failure.' },
    ],
    strengths: ['Beats Aircraft squads (20% counter)', 'Tesla backline bypass is unique', 'Swift infinite-scaling damage in extended fights', 'S5 Venom UR greatly strengthens this comp'],
    counters: 'Aircraft squads',
    counteredBy: 'Tank squads',
    formationBonus: '+20% HP/ATK/DEF with all 5 Missile',
    notes: 'Counter-pick formation S1–S3. Serious primary formation option S5+ with Venom UR + Fiona EW. Investment order: Tesla → Adam → McGregor → Fiona → Swift. Swap Swift for Venom UR in S5 for maximum output.',
  },
  {
    name: 'Aircraft Hybrid (Air + Murphy)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1 (Defensive Aircraft)', hero: 'Lucius', role: 'Frontline anchor', notes: 'Mandatory even in hybrid.' },
      { position: 'Slot 2 (Hybrid Tank)', hero: 'Murphy', role: 'Superior damage sponge via EW', notes: 'EW L10+ required for full effectiveness. L1 already meaningful. Replaces Carlie here.' },
      { position: 'Slot 3 (Primary DPS)', hero: 'DVA', role: 'Burst nuker', notes: 'Morrison or DVA in 3/5 based on matchup.' },
      { position: 'Slot 4 (Damage)', hero: 'Morrison', role: 'DEF shredder', notes: 'Softens for DVA.' },
      { position: 'Slot 5 (Control)', hero: 'Schuyler', role: 'Backline stun', notes: 'PvP disruption + backline bypass.' },
    ],
    strengths: ['Most feared endgame PvP squad', 'Murphy mitigation + Aircraft burst = nearly uncounterable at full investment', 'Hybrid Squad card reduces type counter vulnerability'],
    counters: 'Tank squads',
    counteredBy: 'Pure Missile squads (partially offset by power/morale)',
    formationBonus: '+20% retained ONLY with Hybrid Squad (4+1) Tactics Card. Without card: +15%.',
    notes: 'Requires Hybrid Squad Tactics Card for full +20%. Murphy EW L10+ strongly recommended — L1 already helps. Alternative compositions: DVA + Lucius, Marshall + Morrison + Schuyler (Marshall sometimes outperforms Murphy in specific matchups) or DVA + Lucius, Marshall + Sarah UR + Schuyler (Sarah UR can surprise in specific PvE scenarios).',
  },
  {
    name: 'Tank Hybrid (Tank + Adam)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1 (Frontline Tank)', hero: 'Scarlett', role: 'Budget frontline + key synergy', notes: 'Scarlett + Adam pairing specifically called out as nearly unstoppable vs Aircraft. UR Scarlett mandatory for this to work.' },
      { position: 'Slot 2 (Secondary Tank)', hero: 'Murphy', role: 'Damage reduction core', notes: 'Core Tank durability.' },
      { position: 'Slot 3 (Hybrid)', hero: 'Adam', role: 'Missile hero in Tank squad', notes: 'EW allows survival much longer vs Aircraft. Spreads counterattack at EW L10.' },
      { position: 'Slot 4 (Support)', hero: 'Marshall', role: 'Attack speed buff', notes: '' },
      { position: 'Slot 5 (Primary DPS)', hero: 'Kimberly', role: 'AoE burst', notes: '' },
    ],
    strengths: ['Counter-picks Aircraft squads that normally shred Tank formations', 'Scarlett + Adam pairing is particularly strong', 'Best option for Tank mains who cannot switch to Aircraft primary'],
    counters: 'Aircraft squads (with Hybrid Squad card)',
    counteredBy: 'Pure Missile squads',
    formationBonus: '+20% retained ONLY with Hybrid Squad (4+1) Tactics Card. Without card: +15%.',
    notes: 'Adam EW is critical — without it Adam survives the Aircraft opening briefly but not reliably enough. UR Scarlett is important for full synergy. Requires Hybrid Squad Tactics Card.',
  },
  {
    name: 'Missile Hybrid (Missile + Lucius)',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1 (Hybrid)', hero: 'Lucius', role: 'All-rounded defensive flex', notes: 'All-rounded stats improve Missile survivability. Energy resistance buff works on this squad.' },
      { position: 'Slot 2 (Frontline)', hero: 'Swift', role: 'Finisher + frontline (with EW)', notes: 'With Swift EW, viable at frontline in this configuration.' },
      { position: 'Slot 3 (Precision)', hero: 'Tesla', role: 'Backline elimination', notes: '' },
      { position: 'Slot 4 (AoE)', hero: 'Fiona', role: 'Core damage engine', notes: '' },
      { position: 'Slot 5 (Frontline)', hero: 'Adam', role: 'Primary tank', notes: '' },
    ],
    strengths: ['Lucius all-rounded stats improve Missile squad survivability', 'Counter protection vs Aircraft', 'Good defensive platform for sustained Missile output'],
    counters: 'Aircraft squads',
    counteredBy: 'Tank squads',
    formationBonus: '+20% retained ONLY with Hybrid Squad (4+1) Tactics Card. Without card: +15%.',
    notes: 'Less common than Air+Murphy or Tank+Adam. Best as counter-pick when facing Aircraft-heavy opponents. Lucius energy resistance buffs the Missile squad against energy-heavy matchups.',
  },
  {
    name: 'Ultra Tank Wall',
    troopType: 'Mixed',
    gameStage: 'Late',
    slots: [
      { position: 'Slot 1 (Main Tank)', hero: 'Williams', role: 'Taunt + team reduction', notes: 'Primary taunt anchor.' },
      { position: 'Slot 2 (Adaptive Tank)', hero: 'Carlie', role: 'Energy resistance + flex', notes: 'Dual-role Tank/Aircraft. Formation adaptation capability.' },
      { position: 'Slot 3 (Control Tank)', hero: 'Adam', role: 'Crowd control + counterattack', notes: 'Prevents formation disruption.' },
      { position: 'Slot 4 (Elite Tank)', hero: 'Murphy', role: 'Multiplicative mitigation', notes: 'Premium survivability.' },
      { position: 'Slot 5 (Protected DPS)', hero: 'Tesla', role: 'Sustained damage from fort platform', notes: 'Backline bypass capability kept even in this quad-tank formation.' },
    ],
    strengths: ['92%+ win rate across competitive tiers — highest in game history', 'Quad-tank = 300–400% effective HP vs traditional formations', 'Extended battles (60–120s) heavily favor this', 'Built-in crowd control', 'Extremely rare to have the 90%+ penetration needed to counter'],
    counters: 'All other formation archetypes in current meta',
    counteredBy: 'Very high penetration builds (90%+ — extremely rare)',
    formationBonus: 'Mixed types — no full +20% bonus. Trades formation bonus for overwhelming individual hero durability.',
    notes: 'Most feared endgame formation in competitive play (2025). Sacrifices +20% type bonus for such overwhelming durability that the tradeoff is justified at max investment. Not viable until Williams/Carlie/Adam/Murphy/Tesla are all significantly starred and geared. High-investment endgame formation — not a beginner option.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BATTLE REPORT ANALYSIS — FORMATION DETECTION & NON-OBVIOUS INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export const BATTLE_REPORT_ANALYSIS = {
  overview: 'A Last War battle report exposes hero lineup (both sides), squad stats (ATK/DEF/HP/Morale), troop casualties by type, drone OS activation, bonuses applied, and power lost per side. Buddy uses this data to surface non-obvious insights most players never discover.',

  dataLayers: {
    layer1: 'Outcome + power lost per side',
    layer2: 'Hero lineup (both sides) — 5 heroes, types, levels, gear, star level, row placement (front 1-2 / back 3-5), per-hero kills and shields generated',
    layer3: 'Squad stats: total ATK, DEF, HP, Morale (visible in Army section), troop tier composition, march size',
    layer4: 'Troop casualties by type: survived / lightly wounded / heavily wounded / killed. Each of 3 types broken out with % damage taken.',
    layer5: 'Drone OS activation rate and hit rate',
    layer6: 'Bonuses applied — attacker offensive bonuses, defender defensive bonuses (alliance territory, reinforcer stats)',
  },

  moraleSystem: {
    mechanic: 'For every 1% morale advantage → 1% additional damage dealt. Maximum boost: up to 200–300% attack power. Morale is visible in the Army section of every battle report.',
    factors: ['Troop tier (higher tier = more morale)', 'March size / troop count (more troops = more morale)', 'Hero levels', 'Troop building levels (Tank Center, Rocket Launcher Center, Aircraft Center)', 'Special Forces research morale node', 'War Leader Inspire skill (+10%)', 'Tactics Cards (Quickstride/Battlestreak)', 'Decorations (certain ones boost march capacity)', 'VIP Survivor Agent Shirley (march capacity = morale)'],
    postBattleDrag: 'After any fight where troops were lost, the squad\'s morale drops proportionally. Sending the same squad again without returning to base = degraded morale on next engagement. Compounds badly in multi-fight sequences.',
    battleReportSignal: 'Disproportionate losses on one side despite similar power levels → check morale differential. Higher morale player wins even at lower raw power.',
  },

  nonObviousInsights: [
    {
      name: 'Morale Was the Real Killer',
      trigger: 'Disproportionate losses vs similar raw power',
      explanation: 'Back-to-back fights without returning to base degrade morale. Each 1% morale gap = 1% more damage dealt. A large morale gap at the start of round 2 can explain 50%+ extra losses that look like a formation problem.',
      actionableAdvice: 'Always return squad to base between engagements. Check morale value in Army section of report.',
    },
    {
      name: 'Counter-Pick Structural Disadvantage',
      trigger: 'Opponent\'s type was the counter to yours (e.g., you ran Aircraft, they ran Missile)',
      explanation: 'Counter matchup = 20% counter damage advantage + potential loss of your own 20% type synergy bonus = ~40% effective power deficit from formation alone, before any other factors.',
      actionableAdvice: 'Scout opponent type before committing. If counter-picked, either outpower them by 40%+ or swap to a neutral/counter formation.',
    },
    {
      name: 'Front Row Died Too Fast — Backline Exposed',
      trigger: 'Back-row damage dealers (DVA, Kimberly, Fiona, Tesla) show high damage % despite front row appearing present in report',
      explanation: 'Two causes: (1) front tanks were too low-starred/geared to survive opening burst; (2) opponent had Schuyler (bypasses front entirely) or Tesla (Electric Grid Lockdown hits back row directly). These are not the same problem.',
      actionableAdvice: 'If cause is gear/stars: invest in frontline first. If cause is Schuyler/Tesla bypass: this is intended mechanic — counter by reducing those heroes\' effectiveness before they fire.',
    },
    {
      name: 'Hospital Was Full — Lightly Wounded Became Dead',
      trigger: 'High kill count on your side but low heavily-wounded count, after fighting with a near-full hospital',
      explanation: 'When hospital is at/near capacity at time of battle, "lightly wounded" troops overflow to dead instead of hospital. What looks like battle deaths is actually a hospital management failure — completely different fix.',
      actionableAdvice: 'Check hospital % before major fights. Heal down to 70–80% capacity before important engagements. Upgrade hospital capacity. This is one of the most common and least-understood loss vectors for mid-game players.',
    },
    {
      name: 'Reinforcer Stats Are Shown, Not Defender Stats',
      trigger: 'Defender\'s shown stats look much higher than you\'d expect from their profile/rank',
      explanation: 'When a rallied base is reinforced, the defensive stats shown come from the reinforcer with the highest combined power (Research Battle + Chief War Talent + Hero Power + Gear + Badge + Aircraft Component + Hero Assignment). You may have fought a much stronger player\'s stats, not the base owner\'s.',
      actionableAdvice: 'If you attacked a base and the stats surprised you, ask: did they have a strong ally reinforcing? The stat mismatch is informational — you may have beaten the reinforcer.',
    },
    {
      name: 'Costly Victory — You Won But Lost the War',
      trigger: 'Win with high heavily-wounded count going to a near-full hospital',
      explanation: 'Resources looted may be worth less than the resources needed to heal the wounded. A net-negative victory. Healing cost is real and compounds over a session.',
      actionableAdvice: 'Before attacking: estimate potential loot vs likely casualties. If hospital near full, heal first or the victory may cost more than it returns.',
    },
    {
      name: 'Partial Rally Morale Penalty',
      trigger: 'Rally launched but fewer members than maximum capacity sent',
      explanation: 'March size affects morale. A half-full rally goes in with lower morale than a full rally. Morale gap = damage dealt gap. A well-organized full rally can win fights a partial one loses at the same total power.',
      actionableAdvice: 'Coordinate rally timing. Wait for full participation or near-full before launching if the fight is marginal.',
    },
    {
      name: 'Swift Had No Targets to Execute',
      trigger: 'Swift shows low kills in a lost Missile squad fight',
      explanation: 'Swift\'s entire value proposition is finishing low-HP enemies. If Fiona and Tesla underperformed and enemies never got to low HP%, Swift had nothing to execute. He doesn\'t create damage opportunities — he closes them.',
      actionableAdvice: 'The problem is Fiona\'s and Tesla\'s damage output, not Swift. Check if McGregor died early (backline exposed before Fiona/Tesla could work) or if type counter suppressed their output.',
    },
    {
      name: 'McGregor\'s Taunt Backfired',
      trigger: 'McGregor died early in opponent\'s Missile squad AND their backline then spiked in damage taken',
      explanation: 'McGregor taunt absorbs ALL damage. If he\'s under-invested (low star/gear), he absorbs everything and dies instantly. The moment he dies, the full fury redirects to Adam → then Fiona/Tesla. This is a gear/star problem masquerading as a formation problem.',
      actionableAdvice: 'McGregor needs DEF-priority gear and 4-star minimum. If resource-constrained, run Adam solo-tanking without McGregor rather than running a McGregor that will die instantly.',
    },
    {
      name: 'Drone OS Activation Rate Low',
      trigger: 'Report shows low drone OS activation rate',
      explanation: 'OS activation chance scales with drone star rating and OS skill rating. Low activation = drone underperforming. Can meaningfully change fight outcomes over a session.',
      actionableAdvice: 'Prioritize drone star upgrades. Push OS skill ratings in Chip Lab. Versus Mode provides 30 premium materials/day — best F2P drone investment source.',
    },
    {
      name: 'Energy Damage Was Suppressed — Lucius/Carlie Energy Resistance',
      trigger: 'Your Kimberly/Tesla/Stetmann energy damage felt suppressed against an Aircraft squad despite favorable power numbers',
      explanation: 'Carlie has 40% energy damage reduction (Energy Adaptation). Lucius gives team-wide energy resistance (Knight\'s Spirit). Aircraft squads running Lucius+Carlie are specifically hardened against energy-heavy Tank squads. This explains why Tank squads often underperform against Aircraft beyond just the type counter.',
      actionableAdvice: 'Switch to physical damage dealers against Lucius+Carlie Aircraft squads. Morrison (Aircraft physical DPS) or Murphy (physical tank) would perform better in this matchup than pure energy dealers.',
    },
  ],

  formationDetectionCheatSheet: [
    { observation: 'Opponent has DVA + Morrison + Schuyler backline', conclusion: 'Full Aircraft squad. Lucius/Carlie likely in front. Counter with Missile squad.' },
    { observation: 'Opponent has Tesla + Fiona + Swift backline', conclusion: 'Missile squad. McGregor likely taunting in Slot 2. Counter with Tank squad.' },
    { observation: 'Your back-row heroes took damage while your front row survived', conclusion: 'Opponent had Schuyler (backline bypass targeted 1 back-row hero) OR Tesla (Electric Grid Lockdown hit 3 back-row units). NOT a formation failure — intended mechanic.' },
    { observation: 'Opponent ran Murphy in what looks like an Aircraft squad', conclusion: 'Air + Murphy hybrid. They have the Hybrid Squad Tactics Card. Retains +20% type bonus.' },
    { observation: 'Opponent ran Adam in what looks like a Tank squad', conclusion: 'Tank + Adam hybrid. Counter-pick vs Aircraft. Adam EW was likely active.' },
    { observation: 'Scarlett + Adam together in what looks like a Tank squad', conclusion: 'Specifically the anti-Aircraft Tank hybrid. Scarlett+Adam synergy is noted as nearly unstoppable vs Aircraft.' },
    { observation: 'Swift shows 0 kills despite a fight lasting multiple rounds', conclusion: 'Not a Swift problem. Fiona/Tesla failed to bring enemies to low HP%. Swift had no low-HP targets to execute.' },
    { observation: 'Opponent McGregor died very early and then backline damage spiked', conclusion: 'McGregor gear/star level too low to survive own taunt. Their McGregor absorbed everything and collapsed — backline immediately exposed.' },
    { observation: 'Defender\'s stats look much stronger than their known power level', conclusion: 'A powerful ally reinforced them. The stats shown are the reinforcer\'s, not the base owner\'s.' },
    { observation: 'Your Kimberly/Tesla output felt suppressed despite winning the power comparison', conclusion: 'Opponent had Lucius (team energy resistance) + Carlie (40% personal energy reduction). Energy damage specifically weakened vs this pairing.' },
    { observation: 'High kill count but low wounded count on your side, after a fight where you had near-full hospital', conclusion: 'Hospital overflow. Lightly wounded became dead because hospital had no capacity. Not a battle problem — hospital management problem.' },
    { observation: 'You won easily but still lost significant troops to your hospital', conclusion: 'Costly victory. Healing cost likely exceeds loot value. Next fight: heal down to 70–80% hospital before re-engaging.' },
  ],

  powerLostRatio: {
    formula: 'Your power lost ÷ Opponent\'s power lost = fight efficiency ratio',
    benchmarks: {
      dominant: 'Under 0.5 — you took less than half the damage. Dominant win.',
      solid: '0.5–1.0 — you took less damage than you dealt. Solid win.',
      pyrrhic: '1.0–2.0 — you won the fight but took more damage. Marginal.',
      costly: 'Over 2.0 — even if you won, this engagement was expensive and may not be repeatable.',
    },
    note: 'Power lost is shown explicitly in every battle report for both sides. Always compute this ratio — it tells you the true cost of the fight beyond just win/loss.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO INVESTMENT PRIORITY ORDER
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_INVESTMENT_PRIORITY: HeroInvestmentRule[] = [
  { priority: 1, hero: 'Kimberly', reason: 'Highest early DPS, never wasted, Tank squad foundation.', stageUnlock: 'Day 1' },
  { priority: 2, hero: 'Murphy', reason: 'Cornerstone defense, F2P accessible, flexes into Aircraft hybrid endgame.', stageUnlock: 'Day 1' },
  { priority: 3, hero: 'Williams', reason: 'Primary tank anchor. Murphy + Williams = best defensive frontline in game.', stageUnlock: 'Day 1 (Ghost Ops fragments accumulate)' },
  { priority: 4, hero: 'DVA', reason: 'Universal offensive investment. Non-negotiable in Aircraft squad.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 5, hero: 'Fiona', reason: 'Universal missile investment. Core of Missile formation. S5 EW makes Missile comp viable.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 6, hero: 'Tesla', reason: 'Only hero with high cross-formation value in two full squad types (Tank finisher + Missile DPS). Electric Grid Lockdown bypasses front row.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 7, hero: 'Lucius', reason: 'Mandatory Aircraft frontline. Without Lucius, Air squads collapse. Also Missile hybrid option.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 8, hero: 'Carlie', reason: 'Dual-role flex. Air squad Slot 2. Energy resistance hardens vs Tank squads. Also appears in Ultra Tank Wall.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 9, hero: 'Stetmann', reason: 'Slot 4 Tank squad. Tempo control prevents opponent burst windows.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 10, hero: 'Morrison', reason: 'Aircraft primary DPS. DEF shred enables DVA burst.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 11, hero: 'Marshall', reason: 'Universal support. Works in any formation. Beats Sarah as support in almost all situations.', stageUnlock: 'Day 1 hero pool' },
  { priority: 12, hero: 'Adam', reason: 'Missile frontline + Tank hybrid counter-pick. EW enables both roles fully.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 13, hero: 'Schuyler', reason: 'PvP backline stun specialist. Bypasses front row. Slot 4 in Air squad.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 14, hero: 'McGregor', reason: 'Missile squad Slot 2 taunt. Needs solid investment (4-star + DEF gear) to not self-destruct.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 15, hero: 'Swift', reason: 'Missile finisher. Slot 5 cleanup. Execution mechanic is unique but needs upstream damage from Fiona/Tesla to function.', stageUnlock: 'Ghost Ops (Thursdays)' },
  { priority: 16, hero: 'Venom', reason: 'Situational before S5 UR Promotion. Strong after S5 — enables 5-man Missile serious comp.', stageUnlock: 'Season 5 promotion' },
  { priority: 17, hero: 'Sarah', reason: 'Development priority (research speed). Combat role: niche F2P Aircraft type-bonus filler or PvE monster content. Marshall beats Sarah for support in combat.', stageUnlock: 'Day 1 (development); S4 UR promotion (combat)' },
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
    formationBonusRetained: '+20% retained with Hybrid Squad (4+1) Tactics Card. Without card: +15%.',
    whyItWorks: 'Murphy EW + Tactics Cards makes him a better Slot 2 frontline than Carlie. Stand Firm × Ironclad Barrier × EW mitigation = multiplicative damage reduction that outweighs the 5% type synergy loss. Allows Aircraft backline more time to eliminate the enemy. The most feared endgame PvP squad. Murphy EW L10 recommended, L1 already meaningful.',
    bestUsedFor: 'High-level PvP offense, VS Day rallies. Most versatile attacking setup in the game.',
  },
  {
    name: 'Tank + Adam (Aircraft Counter)',
    basetype: 'Tank',
    hybridHero: 'Adam',
    composition: ['Scarlett (UR)', 'Murphy', 'Adam', 'Marshall', 'Kimberly'],
    requiresHybridCard: true,
    formationBonusRetained: '+20% retained with Hybrid Squad (4+1) Tactics Card. Without card: +15%.',
    whyItWorks: 'Adam EW allows survival against Aircraft much longer than standard tanks. Scarlett (UR) + Adam synergy is specifically noted as nearly unstoppable vs Aircraft. For Tank mains who need an Aircraft counter without rebuilding their roster.',
    bestUsedFor: 'Counter-picking Aircraft-heavy alliances. Best option for Tank mains who refuse to switch primary squad.',
  },
  {
    name: 'Missile + Lucius (Lucius Flex)',
    basetype: 'Missile',
    hybridHero: 'Lucius',
    composition: ['Lucius', 'Swift', 'Tesla', 'Fiona', 'Adam'],
    requiresHybridCard: true,
    formationBonusRetained: '+20% retained with Hybrid Squad (4+1) Tactics Card. Without card: +15%.',
    whyItWorks: 'Lucius all-rounded defensive stats improve Missile squad survivability. Knight\'s Spirit energy resistance benefits the Missile squad against energy-heavy opponents. Best when Missile formation needs more frontline durability.',
    bestUsedFor: 'Missile mains who need more frontline protection. Counter-pick vs Aircraft opponents.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HYBRID SQUAD TACTICS CARD — KEY RULES
// ─────────────────────────────────────────────────────────────────────────────

export const HYBRID_SQUAD_TACTICS_CARD_RULES = {
  whatItDoes: 'Allows 1 hero of a different type while maintaining the full +20% type bonus. Without this card, any mixed formation drops to the lower bonus tier.',
  whenAvailable: 'Season 4 (Evernight Isle) and Season 5 (Wild West). Not available in early seasons.',
  criticalRule: 'Only run mixed squads AFTER you have this card. Before it, full mono-type is always better to preserve the +20% bonus.',
  recommendedSetups: [
    'Air + Murphy — most versatile for attacks; fastest march + morale bonus (morale does NOT apply when garrisoning/defending)',
    'Tank + Adam — best Aircraft counter for Tank mains',
    'Missile + Lucius — improved survivability for Missile players',
  ],
  formationBonusWithoutCard: {
    '5 same type': '+20%',
    '4+1 mixed': '+15%',
    '3+2 mixed': '+10%',
    '3 same type': '+5%',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO POWER-UP LEVERS
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_POWER_UP_GUIDE = {
  overview: 'When stuck with non-meta heroes or cannot yet access top URs via Ghost Ops, these levers close the power gap significantly.',
  universalLevers: [
    {
      lever: 'Exclusive Weapon (EW)',
      impact: 'Game-changing upgrade. Each EW level provides ~10% base stat boost that scales through the hero\'s full kit. Murphy EW at L10+ transforms him into the Air+Murphy hybrid engine. DVA EW unlocks full burst potential. Lucius EW is the #1 priority weapon in the game.',
      tip: 'Priority EW order: Lucius → Murphy → DVA/Kimberly → Adam → others. EW at L1 already provides meaningful boost — do not wait for L20 before using.',
    },
    {
      lever: 'Star Rank',
      impact: 'Single biggest power multiplier. Each star unlocks passive skills and significantly boosts base stats. 3-star minimum before pushing another hero.',
      tip: 'For Ghost Ops UR heroes: 5 fragments per star. Prioritize stars on primary DPS (Kimberly/DVA) before supporting cast.',
    },
    {
      lever: 'Skill Levels',
      impact: 'Get ALL skills to level 20 on primary heroes before focusing stars on secondary heroes. Skill levels unlock new ability tiers.',
      tip: 'Follow squad-specific skill priority order. Never skip levels — each tier is meaningful.',
    },
    {
      lever: 'Formation Bonus (+20%)',
      impact: 'A same-type 5-hero squad gets +20% HP/ATK/DEF. Even weaker heroes benefit. Running 5 B-tier same-type heroes often beats 5 mixed A-tier heroes.',
      tip: 'Never break formation type for a slightly stronger off-type hero unless you have the Hybrid Squad Tactics Card.',
    },
  ],
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

  const battleInsights = BATTLE_REPORT_ANALYSIS.nonObviousInsights.map(i =>
    `[${i.name}] Trigger: ${i.trigger} | ${i.explanation} | Fix: ${i.actionableAdvice}`
  ).join('\n');

  const formationCheatSheet = BATTLE_REPORT_ANALYSIS.formationDetectionCheatSheet.map(r =>
    `Observation: "${r.observation}" → ${r.conclusion}`
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

── BATTLE REPORT ANALYSIS — NON-OBVIOUS INSIGHTS ──
MORALE SYSTEM: Each 1% morale advantage = 1% more damage dealt. Max 200–300% attack boost. Morale visible in Army section of every report. Back-to-back fights without returning to base = morale drain = compounding losses.
POWER LOST RATIO: Your power lost ÷ opponent's power lost = fight efficiency. Under 0.5 = dominant. Over 2.0 = costly.
HOSPITAL OVERFLOW: Lightly wounded troops die permanently when hospital is full at time of battle. High kills + low wounded = hospital overflow, not battle failure.
REINFORCER STATS: In reinforced base defense, the stats shown are the strongest reinforcer's, not the base owner's.

Non-obvious formation insights:
${battleInsights}

── BATTLE REPORT FORMATION DETECTION CHEAT SHEET ──
${formationCheatSheet}

── HERO POWER-UP LEVERS (making any hero comparable) ──
Key levers in order of impact: Exclusive Weapon → Star Rank → Skill Levels → Formation Bonus → Gear → Skill Chips → VIP Status
NEVER break formation type without Hybrid Squad Tactics Card — +20% bonus often outweighs one hero's individual stats.
Ghost Ops (Thursdays) is the only F2P path to exclusive UR heroes. 5 fragments per star. Attend every Thursday without fail.
`.trim();
}