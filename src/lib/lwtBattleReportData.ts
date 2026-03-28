// ============================================================
// lwtBattleReportData.ts
// Battle Report Analyzer — Knowledge Module
// Last War: Survival Buddy
// ============================================================
// Sources: lastwartutorial.com, cpt-hedge.com, lastwarhandbook.com,
// bluestacks.com, theriagames.com, allclash.com
// All mechanics verified against Boyd's endgame experience.
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1 — TROOP TYPE COUNTER SYSTEM
// ─────────────────────────────────────────────────────────────
export const TROOP_COUNTER_MATRIX = {
  description: `
    Last War uses a rock-paper-scissors counter system.
    Each matchup applies a 20% damage modifier IN BOTH DIRECTIONS simultaneously,
    creating a ~40% effective power swing total.
    Buildings deal an additional +25% damage to Aircraft specifically in base defense.
  `,
  counters: {
    aircraft_vs_tank: {
      attacker: 'Aircraft',
      defender: 'Tank',
      result: 'Aircraft WINS',
      damage_dealt_modifier: '+20% (Aircraft deals more to Tank)',
      damage_taken_modifier: '-20% (Aircraft takes less from Tank)',
      effective_power_swing: '+40% for Aircraft',
      notes: 'Aircraft is the endgame meta counter to Tank-heavy servers (Day 70+)',
    },
    tank_vs_missile: {
      attacker: 'Tank',
      defender: 'Missile',
      result: 'Tank WINS',
      damage_dealt_modifier: '+20% (Tank deals more to Missile)',
      damage_taken_modifier: '-20% (Tank takes less from Missile)',
      effective_power_swing: '+40% for Tank',
      notes: 'Early game meta. Tank absorbs Missile damage well.',
    },
    missile_vs_aircraft: {
      attacker: 'Missile',
      defender: 'Aircraft',
      result: 'Missile WINS',
      damage_dealt_modifier: '+20% (Missile deals more to Aircraft)',
      damage_taken_modifier: '-20% (Missile takes less from Aircraft)',
      effective_power_swing: '+40% for Missile',
      notes: 'Missile is the hard counter to Aircraft-dominant servers.',
    },
    aircraft_vs_missile: {
      attacker: 'Aircraft',
      defender: 'Missile',
      result: 'Aircraft LOSES',
      damage_dealt_modifier: '-20% (Aircraft deals less to Missile)',
      damage_taken_modifier: '+20% (Aircraft takes more from Missile)',
      effective_power_swing: '-40% for Aircraft',
      notes: 'DANGEROUS. Aircraft players must scout Missile defenders before attacking.',
    },
    tank_vs_aircraft: {
      attacker: 'Tank',
      defender: 'Aircraft',
      result: 'Tank LOSES',
      damage_dealt_modifier: '-20% (Tank deals less to Aircraft)',
      damage_taken_modifier: '+20% (Tank takes more from Aircraft)',
      effective_power_swing: '-40% for Tank',
      notes: 'Do not march Tank into Aircraft wall without significant power advantage.',
    },
    missile_vs_tank: {
      attacker: 'Missile',
      defender: 'Tank',
      result: 'Missile LOSES',
      damage_dealt_modifier: '-20% (Missile deals less to Tank)',
      damage_taken_modifier: '+20% (Missile takes more from Tank)',
      effective_power_swing: '-40% for Missile',
      notes: 'Missile squads avoid Tank defenders.',
    },
  },
  building_bonus: {
    description: 'Base defense buildings deal +25% bonus damage to Aircraft attackers.',
    implication:
      'Aircraft attacking defended bases face extra punishment beyond the troop type counter. Always scout wall composition before marching Aircraft.',
  },
  real_world_example: `
    100K Missile vs 100K Aircraft → Missile wins, ~50% army surviving.
    100K Aircraft vs 100K Tank → Aircraft wins, ~50% army surviving.
    100K Tank vs 100K Missile → Tank wins, ~56% army surviving.
    Key: A 20% power disadvantage can be overcome by correct type counter.
    A player with 2M power from wrong type can lose to 1.5M correct type.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 2 — FORMATION BONUS SYSTEM
// ─────────────────────────────────────────────────────────────
export const FORMATION_BONUS = {
  description: `
    Unlocks after first Capitol conquest.
    Applies to HP, ATK, and DEF simultaneously.
    Bonuses are multiplicative with other modifiers.
  `,
  tiers: [
    { heroes_same_type: 3, bonus_pct: 5, label: '3-same (weak)' },
    { heroes_same_type: 3, plus_different: 2, bonus_pct: 10, label: '3+2 mixed' },
    { heroes_same_type: 4, bonus_pct: 15, label: '4-same (strong)' },
    { heroes_same_type: 5, bonus_pct: 20, label: '5-same (MAX)' },
  ],
  special_card: {
    name: 'Efficient Unity (Tactics Card)',
    effect: 'Grants FULL 5-hero bonus with only 4 same-type heroes deployed',
    implication:
      'Player with this card and 4 Aircraft + 1 Murphy gets +20% not +15%',
  },
  coaching_implication: `
    A player running 3 Aircraft + 2 Tank is getting +10% instead of +20%.
    That 10% formation gap on top of a type counter = compounding disadvantage.
    Always run 5-same for the troop type you main.
    Only break for exclusive weapon hybrid builds.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 3 — MORALE SYSTEM
// ─────────────────────────────────────────────────────────────
export const MORALE_SYSTEM = {
  description: `
    Morale is the most underutilized combat mechanic. It scales damage linearly.
    Morale Bonus = 1 + (Your Morale - Enemy Morale) / 100
    A morale advantage of 20 means you deal 20% more damage.
  `,
  sources: [
    'Special Forces research (morale node)',
    'War Leader role in Season 1 (Inspire skill: up to +10%)',
    'Warmind – Morale Boost tactics card (passive: +6% per win, stacks 5x)',
    'Windrusher – Morale Boost tactics card (passive: +5% per march speed tier)',
    'Buluwark – Morale Boost tactics card (garrison: +3% per ally with same card)',
  ],
  cascade_mechanic: `
    THE SNOWBALL: When you start losing troops, morale drops → damage drops → you lose MORE troops → morale drops further → cascade to crushing defeat.
    This explains how a "close" power matchup becomes a 90% wipe.
    The army that gains early troop advantage snowballs to decisive victory.
    Close battles that suddenly became one-sided = morale cascade.
  `,
  war_fever: {
    name: 'War Fever',
    effect: 'Flat attack buff. Does NOT increase morale.',
    activation: 'Killing world map zombies or players. Removed when shield activated.',
    note: 'Attacking zombies does NOT activate War Fever. PvP kills only.',
  },
  diagnosis: `
    If a player lost despite similar reported power and no obvious type counter,
    morale cascade is the likely explanation.
    Ask: did you take early losses? Did the opponent have Warmind Morale Boost stacked from prior fights?
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 4 — DAMAGE FORMULA
// ─────────────────────────────────────────────────────────────
export const DAMAGE_FORMULA = {
  formula:
    'Final Damage = Base ATK × Skill Multiplier × Type Advantage × Morale Bonus × Equipment Bonus × Set Bonus × Formation Bonus × (1 - Enemy DEF Reduction)',
  effective_power_formula:
    'Effective Power = Base Power × Type Modifier × Morale Modifier × Formation Bonus × Equipment Bonus',
  skill_multipliers: {
    range: '~100% (basic auto) to 400%+ (powerful tactical skill)',
    upgrade_method: 'Skill Medals — always scarce, spend wisely',
    max_level_base: 30,
    max_level_with_ew: 40,
  },
  key_insight: `
    Displayed power is a POOR predictor of actual combat outcomes.
    A 3.5M power Tank squad with full bonuses (type counter + morale + formation + EW + decos) can fight with ~12.5M effective power — a 356% increase.
    This is why a 500K player can beat a 1.5M player with smart play.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 5 — EXCLUSIVE WEAPONS
// ─────────────────────────────────────────────────────────────
export const EXCLUSIVE_WEAPONS = {
  description: `
    Every season releases 3 EWs — one per hero type (Tank/Aircraft/Missile).
    Released in weeks 1, 3, 6 of the season.
    EWs boost stats, upgrade skills beyond level 30, and add 7.5% stat boost at level 20.
  `,
  release_schedule: {
    season_1: { week_1: 'Kimberly (Tank)', week_3: 'DVA (Aircraft)', week_6: 'Tesla (Missile)' },
    season_2: { week_1: 'Murphy (Tank)', week_3: 'Carlie (Aircraft)', week_6: 'Swift (Missile)' },
    season_3: { week_1: 'Marshall (Support)', week_3: 'Schuyler (Aircraft)', week_6: 'McGregor (Missile)' },
    season_4: { week_1: 'Williams (Tank)', week_3: 'Lucius (Aircraft)', week_6: 'Adam (Missile)' },
    season_5: { week_1: 'Fiona (Missile)', week_3: 'Stetmann (Tank)', week_6: 'Morrison (Aircraft)' },
  },
  power_impact: {
    unlock: '~0.3M squad power boost',
    level_10: 'Additional ~0.3M',
    level_20: 'Additional ~0.3M + 7.5% stat boost (PRIORITY TARGET)',
    level_30: 'Additional ~0.3M (maximum)',
    total_max: '~1.2M squad power boost from unlock to level 30',
  },
  skill_impact: {
    description: 'Every 3 EW levels = +1 skill level beyond base cap of 30',
    at_level_30: '+10 additional skill levels (skills reach level 40)',
    implication: 'EW level 20 hero can have skills at level 36 vs non-EW at 30',
  },
  cost_to_level_20: {
    named_shards_to_unlock: 50,
    additional_shards_1_to_20: 1080,
    total: '1,130 shards',
    cost_paid: '~$20 via battle pass OR free via Black Market post-season',
  },
  wall_of_honor:
    'At level 30 max, excess shards go to Wall of Honor for small % stat boosts. Not a priority until all squad EWs are at L20+.',
  coaching_implication: `
    If battle report shows hero skill damage dramatically lower than squad power suggests, EW gap is the prime suspect.
    Ask: are your main squad heroes' EWs at level 20?
    An opponent with EW L20+ has skills at level 36 vs your L30 — meaningful skill multiplier gap.
    Priority: Get all 5 main squad heroes to EW L20 before pushing L30 on any single hero.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 6 — TACTICS CARDS (Season 4+)
// ─────────────────────────────────────────────────────────────
export const TACTICS_CARDS = {
  description: `
    Introduced in Season 4. 3 types: Core Cards (permanent UR), Battle Cards, Resource Cards.
    Deck slots: 2 Core + 4 Battle + 4 Resource.
    Core Cards persist after season ends. Battle/Resource cards are removed at season end.
    Core Card slot 1 requires Profession level 50+.
  `,
  pvp_core_cards: [
    {
      name: 'Warmind – Rapid Rescue',
      effect:
        'As attacker: +10% HP/ATK/DEF base stats. Tactical: after winning PvP battle, restore up to 100% lightly wounded troops (2x daily).',
      combat_implication: 'Makes serial attackers nearly immune to lightly wounded losses.',
    },
    {
      name: 'Warmind – Morale Boost',
      effect:
        'As attacker: +10% HP/ATK/DEF base stats. Passive: after each PvP world map win, +6% morale (stacks 5x, expires on base return).',
      combat_implication:
        'At 5 stacks = +30% morale advantage before the next fight even starts. DEVASTATING in PVP events. Explains otherwise inexplicable losses.',
    },
    {
      name: 'Windrusher – Morale Boost',
      effect:
        'As attacker: +10% HP/ATK/DEF base stats. Passive: per 8 tiles marched (up to 5x), +5% morale.',
      combat_implication:
        'Long-march attackers arrive with stacked morale. Scout from far away = morale-stacked on arrival.',
    },
    {
      name: 'Windrusher – Rapid Rescue',
      effect:
        'As attacker: +10% HP/ATK/DEF base stats. Tactical: self + 3x3 allies +50% march speed (3x daily).',
      combat_implication: 'Rapid reinforcement in alliance war scenarios.',
    },
    {
      name: 'Buluwark – Comprehensive Enhancement',
      effect:
        'As defender: +10% HP/ATK/DEF base stats. Tactical: self + allies +8% HP/ATK/DEF while in Defense Support (stacks 3x, 2x daily).',
      combat_implication:
        'Wall defenders with this card get a +24% buff at max stacks. Explains hard-to-crack garrison.',
    },
    {
      name: 'Buluwark – Morale Boost',
      effect:
        'As defender: +10% HP/ATK/DEF. Passive: at start of Defense Support, +3% morale per ally with same card (stacks 9x).',
      combat_implication:
        'Full alliance defense with this card = +27% morale bonus to all defenders.',
    },
    {
      name: 'Purgator – Monster Slayer',
      effect:
        'PvE: base -3% damage from monsters. Tactical: +250 virus resistance + -20% monster damage for 180s (1x daily).',
      combat_implication:
        'Required for Season 1 high-level zombie farming. Explains why some players clear content others cannot.',
    },
  ],
  pvp_battle_cards: [
    {
      name: 'Damage Reduction Reversal',
      effect: 'Reduces damage TAKEN when countered by up to 5.10%',
      implication: 'Partially negates the -20% damage disadvantage of wrong type matchup.',
    },
    {
      name: 'Damage Reversal',
      effect: 'Increases damage DEALT when countered by up to 2.55%',
      implication: 'Stacked with Damage Reduction Reversal = partially nullifies type counter.',
    },
    {
      name: 'Efficient Unity',
      effect: 'Grants FULL troop type bonus (+20%) with only 4 same-type heroes.',
      implication:
        'Player running Murphy (Tank) + 4 Aircraft gets +20% instead of +15%. Changes formation calculus entirely.',
    },
    {
      name: 'Attribute Aura',
      effect: '1st squad heroes gain up to +4% ATK/DEF/HP in world map PvP.',
      implication: 'Flat stat boost to primary squad.',
    },
    {
      name: 'Warmind – One Against Ten',
      effect:
        'Reduces attribute penalties when marching squad has insufficient units by up to 30%.',
      implication:
        'Players who march with reduced march size take less of a penalty.',
    },
  ],
  coaching_implication: `
    Tactics Cards are INVISIBLE in battle reports. They explain gaps that pure power analysis cannot.
    Key questions to ask after analyzing a report:
    1. Did attacker have Warmind Morale Boost stacked? (serial attacker in PVP event)
    2. Did defender have Buluwark stacks? (hard garrison defense)
    3. Did loser have Damage Reduction Reversal? (type mismatch but cards partially compensated)
    4. Is the attacker running Efficient Unity? (4-hero mono + Murphy with +20% instead of +15%)
    Always collect tactics card status in the pre-analysis intake.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 7 — DECORATIONS
// ─────────────────────────────────────────────────────────────
export const DECORATIONS = {
  description: `
    Passive bonuses active at all times across ALL squads and ALL game modes.
    No activation required. Stack additively. Show up in the stat comparison screen.
    Tiers: UR (gold) > SSR (purple, single stat) > SR (blue, weakest).
    Only invest in UR decorations. SR/SSR are early-game only.
    UR decorations get a major bonus jump at Level 3 — spread all to L3 before going deeper.
  `,
  stat_types: [
    'Hero HP',
    'Hero ATK',
    'Hero DEF',
    'Critical Damage %',
    'Skill Damage %',
    'Construction Speed %',
    'March Size (rare — God of Judgment only)',
    'Zombie Damage % (PvE only)',
  ],
  top_ur_decorations: [
    {
      name: 'God of Judgment',
      stats: 'HP + ATK + DEF + March Size (only march size source from decos)',
      priority: 'S-Tier — best all-around, get this first',
      note: 'Cannot be upgraded with Universal Decor Components. Harder to max.',
    },
    {
      name: 'Tower of Victory',
      stats: 'ATK + Critical Damage %',
      priority: 'S-Tier — offensive. Second priority after God of Judgment.',
    },
    {
      name: 'Eternal Pyramid',
      stats: '+55% Construction Speed',
      priority: 'A-Tier for progression speed. Not combat, but accelerates all building.',
    },
    {
      name: 'Pumpkin Panic',
      stats: '+90K HP, +2,142 ATK, +428 DEF, +5% Crit Damage',
      priority: 'A-Tier — multi-stat with crit.',
    },
    {
      name: 'Eiffel Tower',
      stats: '+120K HP, +285 DEF',
      priority: 'A-Tier — HP/survivability focus.',
    },
    {
      name: 'Gold Missile Vehicle',
      stats: '+4,285 ATK at Level 7 (highest single-stat ATK from vehicle decos)',
      priority: 'A-Tier for attack-focused builds.',
    },
    {
      name: 'Gold Tank',
      stats: '+82,500 HP',
      priority: 'B-Tier — HP only but solid if you have it.',
    },
    {
      name: 'Cheese Manor',
      stats: 'Large HP + 5% Critical Damage',
      priority: 'A-Tier — HP + crit combo.',
    },
    {
      name: 'Throne of Blood',
      stats: '+55K HP, +ATK, +DEF (3-stat)',
      priority: 'B-Tier — versatile 3-stat.',
    },
    {
      name: 'Military Monument',
      stats: '+1,300 DEF (highest DEF single-stat), +2% Zombie Damage',
      priority: 'B-Tier — defense-focused or PvE farming.',
    },
  ],
  upgrade_strategy: `
    1. Spread ALL UR decorations to Level 3 first (big jump at L3 special bonus).
    2. Then prioritize L4 on your top 2-3 combat decos.
    3. God of Judgment and Tower of Victory are first and second targets.
    4. Use Universal Decor Components only on UR decorations.
    5. January 2026 meta: Damage Reduction > Skill Damage > Crit Damage.
  `,
  coaching_implication: `
    The stat comparison screen (red/green arrows) is where deco gap shows up.
    If your ATK and HP both have red arrows against an opponent with similar displayed power,
    deco gap is the most likely explanation.
    A player with God of Judgment + Tower of Victory + Pumpkin Panic at L5+ has ~300K+ more HP
    and ~6K+ more ATK than a player with basic decos.
    This shows as a crushing stat disadvantage on the comparison screen.
    Coaching: "Your stat gap isn't a hero issue — it's a decoration investment gap.
    Tower of Victory is your next upgrade target."
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 8 — TROOP LOSS INTERPRETATION
// ─────────────────────────────────────────────────────────────
export const TROOP_LOSS_INTERPRETATION = {
  categories: {
    lightly_wounded: {
      label: 'Lightly Wounded',
      meaning: 'Auto-recover. No hospital. No resources needed. Essentially free.',
      severity: 'LOW',
    },
    wounded: {
      label: 'Wounded (Hospital)',
      meaning: 'Go to hospital. Require resources to heal. Recoverable.',
      severity: 'MEDIUM',
    },
    killed: {
      label: 'Killed / Dead',
      meaning:
        'Permanently lost UNLESS hospital overflow goes to Enlistment Office. True kills are gone forever.',
      severity: 'HIGH',
    },
    enlistment: {
      label: 'Enlistment Office',
      meaning:
        'Overflow from full hospital. Can be recalled at no resource cost (timed). Strategic storage.',
      severity: 'MEDIUM — recoverable',
    },
  },
  attacker_vs_defender_asymmetry: `
    DEFENDERS get an advantage: killed troops go partially to Enlistment Office for recovery.
    ATTACKERS keep their lightly wounded from successful attacks.
    A loss for the attacker with high kill count = bad.
    A loss for the defender with high kill count = survivable if enlistment has capacity.
  `,
  troop_damage_percentage: `
    The per-troop-type damage % is the clearest indicator of what happened:
    - Your type at 100% damage, theirs at 0% = pure type counter wipe
    - Both sides at ~50% = even fight, other factors decided it
    - Your type at 100%, theirs at 30-50% = type counter + power gap
    - Your type at 30%, theirs at 100% = you won but took real losses
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 9 — PvE REPORT LOGIC (Monster / Zombie)
// ─────────────────────────────────────────────────────────────
export const PVE_REPORT_LOGIC = {
  report_types: {
    zombie_world_map: {
      name: 'World Map Zombie Kill',
      stamina_cost: 10,
      shows: [
        'Hero skill damage',
        'Resources earned',
        'Courage medals',
        'Troop losses (if any)',
      ],
      no_show: ['Opponent stat comparison', 'Troop type breakdown vs enemy'],
      proper_squad:
        'Should take ZERO troop losses on normal world map zombies with correct squad.',
    },
    zombie_boss: {
      name: 'Zombie Boss / Doom Walker',
      stamina_cost: 20,
      shows: ['Damage dealt per hero', 'Troop losses', 'Rewards'],
      note: 'Requires rally with alliance for high-level bosses.',
    },
    zombie_siege: {
      name: 'Zombie Siege (Alliance Event)',
      format: '20 waves, 30 seconds each, escalating strength',
      critical_heroes:
        'AoE damage dealers + defensive buffers. All three troop types recommended.',
      failure_mode:
        'Wrong formation (PvP squad in PvE defense), no reinforcements, underleveled heroes.',
    },
  },
  virus_resistance: {
    description: 'Season 1 (Crimson Plague) mechanic. Required to attack certain zombie types.',
    consequence: 'Attacking without sufficient resistance = -99% damage + troop infection.',
    solution:
      'Purgator – Monster Slayer tactics card (+250 resistance for 180s) + VRI research upgrades.',
    diagnosis:
      'If player reports near-zero damage to zombies → virus resistance gap. Not a power problem.',
  },
  pve_squad_mistakes: [
    'Running PvP formation (5-same type mono) into Zombie Siege — wrong for PvE waves',
    'No Purgator tactics card for high-level zombie farming in Season 1',
    'Using Monica (resource hero) as main DPS in PvE events instead of damage dealers',
    'Attacking boss without alliance rally — stamina waste',
    'Mixed troop type formation in Zombie Siege — need all three types for wave coverage',
  ],
  pve_coaching_template: `
    PvE reports should show zero or near-zero troop losses for world map zombies.
    If losses are occurring on basic zombies: check squad composition, hero levels,
    and ensure Purgator – Monster Slayer card is active if in Season 1.
    If Zombie Siege losses are high: check wave readiness, hero AoE coverage,
    and whether alliance reinforcements are being used.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 10 — BATTLE REPORT SCREEN LAYOUT
// ─────────────────────────────────────────────────────────────
export const BATTLE_REPORT_SCREENS = {
  description: 'Last War battle reports are multi-tab. Each tab reveals different data.',
  screens: [
    {
      screen: 1,
      name: 'Outcome + Power Summary',
      visible_data: [
        'Win / Loss outcome',
        'Attacker name and power (displayed)',
        'Defender name and power (displayed)',
        'Power lost from battle (each side)',
        'Hero lineup used (both sides, small icons)',
        'Loot stolen (if win)',
        'Battle timestamp and coordinates',
        "OPPONENT NAME — visible as the other player's name on this screen",
      ],
      analysis_use: 'Power differential, outcome, opponent name, which heroes were deployed.',
    },
    {
      screen: 2,
      name: 'Troop Loss Breakdown',
      visible_data: [
        'Total troops sent vs total troops defending',
        'Killed / Wounded / Lightly Wounded / Survived — both sides',
        'Per-troop-type damage % (Aircraft/Tank/Missile each shown separately)',
        'Troops sent per type, troops survived per type',
      ],
      analysis_use: 'THE MOST IMPORTANT SCREEN. Type matchup diagnosis. Morale cascade evidence.',
    },
    {
      screen: 3,
      name: 'Hero Skill Damage',
      visible_data: [
        'Damage dealt by each hero skill',
        'Kills attributed to each skill',
        'Shields/blocks credited to defensive skills',
      ],
      analysis_use: 'EW gap diagnosis. Hero investment gap. Skill level comparison.',
    },
    {
      screen: 4,
      name: 'Stat Comparison',
      visible_data: [
        'ATK, HP, DEF, Lethality — both players',
        'Green arrow = your stat higher, Red arrow = theirs higher',
        'No arrows = equal',
      ],
      analysis_use:
        'Decoration gap, research gap, gear gap. If power is equal but stats are red = deco/gear.',
    },
    {
      screen: 5,
      name: 'Gear / Chief Level',
      visible_data: [
        "Each player's Chief Level",
        'Gear equipped per slot (helmet, chest, boots, weapon, badge)',
        'Badge quality',
      ],
      analysis_use: 'Gear tier comparison. Badge investment gap.',
    },
    {
      screen: 6,
      name: 'Power Up Analysis',
      visible_data: [
        'Letter-grade (S/A/B/C) breakdown of improvement areas',
        'Tap each grade for specific material recommendations',
      ],
      analysis_use: "Game's own assessment. Use as secondary confirmation of Buddy's diagnosis.",
    },
  ],
  screenshot_guidance: `
    For the best analysis, upload screenshots of ALL screens in order.
    Minimum viable: Screen 1 (outcome) + Screen 2 (troop breakdown) + Screen 4 (stats).
    Screen 3 (hero skills) adds EW/skill diagnosis.
    Screen 5 (gear) adds gear gap diagnosis.
    The more screens uploaded, the more precise the coaching.
  `,
};

// ─────────────────────────────────────────────────────────────
// SECTION 11 — VERDICT TEMPLATES
// ─────────────────────────────────────────────────────────────
export const VERDICT_TEMPLATES = {
  countered_type_mismatch: {
    label: 'Countered — Troop Type Mismatch',
    trigger: "Your troop type took significantly more damage than opponent's. Opponent ran counter type.",
    summary:
      'You marched into a type disadvantage. The counter system applied a ~40% effective power swing against you before a single hero skill fired.',
    rematch: 'Not yet — scout opponent troop type first and counter appropriately.',
  },
  power_gap: {
    label: 'Outmatched — Power / Investment Gap',
    trigger:
      'Stats comparison screen shows multiple red arrows. Similar troop type matchup but heavy losses.',
    summary:
      'No type mismatch. Pure investment gap — decorations, gear, or EW levels.',
    rematch: 'Only if you close the gap. Check decoration tier list priority.',
  },
  morale_cascade: {
    label: 'Morale Cascade',
    trigger:
      'Near-equal power and type matchup, but losses were catastrophically asymmetric.',
    summary:
      'You took early losses which dropped morale → reduced damage → more losses → snowball defeat. Or opponent had Warmind Morale Boost stacked from prior fights.',
    rematch:
      'Possible — ensure you engage fresh, not after prior losses. Check your morale research.',
  },
  formation_gap: {
    label: 'Formation Bonus Gap',
    trigger: 'Mixed troop types in squad (3+2 or worse) vs opponent running mono-type.',
    summary:
      'You were getting +10% formation bonus while opponent had +20%. That 10% gap on HP/ATK/DEF is significant in close matchups.',
    rematch: 'Run 5-same type. Only break for confirmed EW hybrid builds.',
  },
  won_clean: {
    label: 'Clean Win — Well Executed',
    trigger: 'Won with minimal losses. Correct type matchup. Stat advantages.',
    summary: 'Type counter was correct. Formation was solid. Good outcome.',
    rematch: 'N/A — you won.',
  },
  pyrrhic_win: {
    label: 'Pyrrhic Win — Won But At Cost',
    trigger: 'Won but with heavy troop losses.',
    summary:
      'Victory achieved but the cost was high. Was this fight worth the troop spend?',
    rematch: 'Evaluate loot gained vs troop cost. May not have been worth it.',
  },
  pve_resistance_failure: {
    label: 'PvE — Virus Resistance Gap',
    trigger: 'Near-zero damage to zombies in Season 1 content.',
    summary: 'You lack sufficient virus resistance for this zombie tier. Not a power issue.',
    rematch: 'Use Purgator – Monster Slayer tactics card before attacking. Build VRI research.',
  },
  pve_wrong_squad: {
    label: 'PvE — Wrong Squad Composition',
    trigger: 'Taking unexpected troop losses on world map zombies or Zombie Siege.',
    summary:
      'PvP mono-type formation is suboptimal for PvE. Need AoE damage dealers and defensive buffers.',
    rematch:
      'Rebuild squad for PvE: AoE attackers, defensive skills, all three troop types for Siege.',
  },
  arena_stat_gap: {
    label: 'Arena — Stat / Hero Investment Gap',
    trigger: 'Arena loss. No troops involved. Hero stats and EW levels determined outcome.',
    summary:
      'Arena combat is 100% hero-driven. No troop types, no formation bonus, no hospital. The gap is hero stats, EW levels, skill multipliers, and decoration bonuses.',
    rematch: 'Close the hero investment gap — EW levels and decoration upgrades first.',
  },
};

// ─────────────────────────────────────────────────────────────
// SECTION 12 — COACHING ACTION TEMPLATES
// ─────────────────────────────────────────────────────────────
export const COACHING_ACTIONS = {
  type_counter_fix: [
    'Before attacking: tap the enemy base → check their squad type icons.',
    'Match your march to counter: Aircraft → use Missile. Tank → use Aircraft. Missile → use Tank.',
    "If you don't have a strong counter squad, don't attack until you do.",
    'Wall defense: put your counter-type squad on the wall before dropping shield.',
  ],
  formation_fix: [
    'Build toward 5 same-type heroes for your chosen type.',
    'If running Murphy (Tank) with Aircraft squad — consider Efficient Unity tactics card for +20% at 4 Aircraft.',
    'Never run 3+2 in endgame PvP — the 10% formation penalty compounds with everything else.',
  ],
  deco_fix: [
    'Priority: God of Judgment → Tower of Victory → Pumpkin Panic.',
    'Get ALL UR decos to Level 3 before pushing any single one to Level 5+.',
    'Use Universal Decor Components only on UR (gold) decorations.',
    'Check event shop and Black Market for UR decoration shards.',
  ],
  ew_fix: [
    'Target EW Level 20 on main squad heroes first — this unlocks the 7.5% stat boost.',
    'Save Universal EW Shards between seasons — use them immediately on new season EW releases.',
    'Free path: skip the $20 battle pass, farm Black Market post-season for EW shard choice boxes.',
    'Priority order: Squad 1 EWs to L20 → Squad 2 EWs to L20 → then L30 push.',
  ],
  morale_fix: [
    'Research Special Forces morale node if available.',
    "Don't attack in series without returning to base — Warmind Morale stacks reset on base return.",
    'If opponent may have stacked morale (serial attacker), engage when they return to base.',
    'War Leader profession in Season 1 gives Inspire skill for morale boost.',
  ],
  scout_discipline: [
    'Always scout before attacking. A well-scouted counter formation beats 2x raw power.',
    'Use radar missions to generate recon data passively.',
    'Scout wall squad composition — identifies troop type and formation bonus.',
    'Never attack blind in PVP Event. You will regret it.',
  ],
  troop_strength_gap: [
    'Your opponent fielded stronger troops. The gap could be a larger march size, higher troop tier, or both — the report does not show which.',
    'Lever 1 — March size: upgrade Special Forces research nodes that increase march capacity. More troops in the fight = more effective power.',
    'Lever 2 — Troop tier: always train the highest tier available to you before a fight. T10 vs T11 is a significant power gap per troop.',
    'Both levers matter. A small march of T11s can still lose to a large march of T10s on pure numbers.',
  ],
  arena_fix: [
    'Arena is 100% hero-driven — no troops, no type counter, no formation bonus.',
    'Focus: get all Arena squad heroes to EW Level 20 for the 7.5% stat boost and skill level 36.',
    'God of Judgment and Tower of Victory decoration upgrades directly improve Arena stat comparison.',
    'Skill damage gap in Screen 3 = EW level gap. Each 3 EW levels = +1 skill level (max 40 with EW vs 30 without).',
    'Check the stat comparison screen (Screen 4) — red arrows = decoration/EW gap, not a troop or formation problem.',
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 13 — PRE-ANALYSIS INTAKE QUESTIONS (updated)
// ─────────────────────────────────────────────────────────────
export const INTAKE_QUESTIONS = {
  purpose: "Capture invisible variables that don't show in screenshots.",
  questions: [
    {
      id: 'report_type',
      question: 'What type of report is this?',
      options: [
        'PvP — I attacked someone',
        'PvP — Someone attacked me',
        'PvP — Rally',
        'PvP — I was in a garrison',
        'PvP — Arena',
        'PvE — Zombie / Monster',
      ],
      why: 'Changes analysis logic entirely. Arena uses a completely different path — no troops, no hospital, hero-only analysis.',
    },
    {
      id: 'tactics_cards',
      question: 'Which Tactics Cards were active in your deck?',
      type: 'multi-select',
      why: "Tactics cards are completely invisible in battle reports. Efficient Unity changes formation math. Warmind Morale Boost explains asymmetric losses. Purgator explains PvE virus resistance outcomes.",
      options_pvp: {
        'Core Cards — Attacker': [
          'Warmind – Rapid Rescue',
          'Warmind – Morale Boost',
          'Windrusher – Morale Boost',
          'Windrusher – Rapid Rescue',
        ],
        'Core Cards — Defender': [
          'Buluwark – Comprehensive Enhancement',
          'Buluwark – Morale Boost',
        ],
        'Battle Cards': [
          'Efficient Unity',
          'Damage Reduction Reversal',
          'Damage Reversal',
          'Attribute Aura',
          'Warmind – One Against Ten',
        ],
      },
      options_pve: {
        'PvE Cards': ['Purgator – Monster Slayer'],
        'Battle Cards': ['Attribute Aura'],
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 14 — SYSTEM PROMPT BUILDER (for battle-report/route.ts)
// ─────────────────────────────────────────────────────────────
export function buildBattleReportSystemPrompt(
  playerProfile: {
    hq_level?: number;
    troop_type?: string;
    troop_tier?: string;
    squad_power?: number;
    server_day?: number;
    spend_style?: string;
    hero_power?: number;
    beginner_mode?: boolean;
  },
  intake: {
    report_type: string;
    tactics_cards: string[];
  },
  playerContext?: string
): string {
  const isArena =
    intake.report_type.toLowerCase().includes('arena');

  const isPvE =
    !isArena &&
    (intake.report_type.toLowerCase().includes('pve') ||
      intake.report_type.toLowerCase().includes('zombie') ||
      intake.report_type.toLowerCase().includes('monster'));

  const isPvP = !isArena && !isPvE;

  const tacticsCardsSummary =
    intake.tactics_cards.length > 0 ? intake.tactics_cards.join(', ') : 'None reported';

  const hasEfficientUnity = intake.tactics_cards.includes('Efficient Unity');
  const hasWarmindMorale = intake.tactics_cards.includes('Warmind – Morale Boost');
  const hasWindrusherMorale = intake.tactics_cards.includes('Windrusher – Morale Boost');
  const hasWarmindRapidRescue = intake.tactics_cards.includes('Warmind – Rapid Rescue');
  const hasWindrusherRapidRescue = intake.tactics_cards.includes('Windrusher – Rapid Rescue');
  const hasBuluwarkComp = intake.tactics_cards.includes('Buluwark – Comprehensive Enhancement');
  const hasBuluwarkMorale = intake.tactics_cards.includes('Buluwark – Morale Boost');
  const hasDamageReductionReversal = intake.tactics_cards.includes('Damage Reduction Reversal');
  const hasDamageReversal = intake.tactics_cards.includes('Damage Reversal');
  const hasAttributeAura = intake.tactics_cards.includes('Attribute Aura');
  const hasWarmindOneAgainstTen = intake.tactics_cards.includes('Warmind – One Against Ten');
  const hasPurgator = intake.tactics_cards.includes('Purgator – Monster Slayer');

  const cardFlags = [
    hasEfficientUnity
      ? '- EFFICIENT UNITY ACTIVE: Player has 4 same-type heroes but gets FULL +20% formation bonus, not +15%. Do NOT flag a formation issue if they have a 4+1 lineup.'
      : '',
    hasWarmindMorale
      ? '- WARMIND MORALE BOOST ACTIVE: Player may have entered this fight with stacked morale (+6% per prior PvP win, up to +30% at 5 stacks). Factor into damage advantage analysis.'
      : '',
    hasWindrusherMorale
      ? '- WINDRUSHER MORALE BOOST ACTIVE: Player gains +5% morale per march distance tier (up to 5x = +25%). Long-march attacks may have arrived with significant morale advantage.'
      : '',
    hasWarmindRapidRescue
      ? '- WARMIND RAPID RESCUE ACTIVE: Player recovers up to 100% lightly wounded troops after winning PvP (2x daily). Lightly wounded numbers in report may understate actual attrition.'
      : '',
    hasWindrusherRapidRescue
      ? '- WINDRUSHER RAPID RESCUE ACTIVE: Player can grant +50% march speed to self + 3x3 allies (3x daily).'
      : '',
    hasBuluwarkComp
      ? '- BULUWARK COMPREHENSIVE ENHANCEMENT ACTIVE: Player in defense gets +10% HP/ATK/DEF base + up to +24% more at max stacks (2x daily). Explains harder-than-expected garrison defense.'
      : '',
    hasBuluwarkMorale
      ? '- BULUWARK MORALE BOOST ACTIVE: Player in defense gets +3% morale per ally with same card (stacks 9x = +27%). Alliance defense coordination with this card = substantial morale wall.'
      : '',
    hasDamageReductionReversal
      ? '- DAMAGE REDUCTION REVERSAL ACTIVE: Player takes up to 5.10% less damage when at a type disadvantage.'
      : '',
    hasDamageReversal
      ? '- DAMAGE REVERSAL ACTIVE: Player deals up to 2.55% more damage when countered.'
      : '',
    hasAttributeAura
      ? '- ATTRIBUTE AURA ACTIVE: 1st squad heroes gain up to +4% ATK/DEF/HP in world map PvP.'
      : '',
    hasWarmindOneAgainstTen
      ? '- WARMIND ONE AGAINST TEN ACTIVE: Attribute penalties from marching with reduced march size reduced by up to 30%.'
      : '',
    hasPurgator
      ? '- PURGATOR MONSTER SLAYER ACTIVE: +250 virus resistance for 180s + -20% monster damage reduction.'
      : '',
    intake.tactics_cards.length === 0
      ? '- NO TACTICS CARDS REPORTED: Player either has none equipped or is unsure. Do not assume any card effects. Note in coaching that equipping relevant cards is a free power gain.'
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  // ── ARENA-SPECIFIC ANALYSIS PATH ────────────────────────
  const arenaInstructions = isArena
    ? `
## ⚔️ ARENA REPORT — SPECIAL ANALYSIS PATH

THIS IS AN ARENA BATTLE. The following rules are ABSOLUTE and NON-NEGOTIABLE:

WHAT ARENA IS:
- Arena is a hero-vs-hero combat mini-game
- NO TROOPS are involved. None. Zero.
- NO TROOP LOSS occurs. Ever.
- NO HOSPITAL involvement. Ever.
- NO formation bonus applies (troop-type formation bonus is a field combat mechanic, not Arena)
- NO troop type counter applies (there are no troops to counter)

WHAT DETERMINES ARENA OUTCOMES:
1. Hero stats — ATK, HP, DEF (boosted by decorations and EW)
2. Hero skill levels — base cap 30, EW raises this to 36+ (every 3 EW levels = +1 skill level)
3. EW levels — EW L20 gives 7.5% stat boost AND skills at level 36 vs opponent at 30
4. Decoration investment — God of Judgment, Tower of Victory directly boost Arena stats
5. Skill order and timing — which hero fires first, which skills chain

ARENA COACHING MUST:
- Focus ONLY on hero skill damage (Screen 3), stat comparison (Screen 4)
- Reference the actual numbers visible in the screenshots
- Name specific heroes, specific EW levels if visible, specific stat gaps
- Never mention troops, formation, hospital, troop loss, type counter

FORBIDDEN IN ARENA OUTPUT:
- Any mention of troop types
- Any mention of hospital or troop loss
- Any mention of formation bonus
- Any mention of type counter
- Any mention of marching or base defense

VERDICT FOR ARENA: Use "arena_stat_gap" verdict template.
`
    : '';

  // ── PvP-SPECIFIC TROOP ANALYSIS INSTRUCTIONS ────────────
  const pvpTroopInstructions = isPvP
    ? `
## TROOP COUNTER SYSTEM — READ FROM SCREEN 2

HOW TO READ SCREEN 2:
Screen 2 shows per-troop-type damage % for BOTH sides separately.
Each type (Aircraft / Tank / Missile) has its own damage % column.
The side whose troop type shows 80-100% damage = that type was countered.

COUNTER RULES (MEMORIZE THESE):
- Aircraft BEATS Tank: Aircraft deals +20%, takes -20% from Tank (net ~40% swing for Aircraft)
- Tank BEATS Missile: Tank deals +20%, takes -20% from Missile (net ~40% swing for Tank)
- Missile BEATS Aircraft: Missile deals +20%, takes -20% from Aircraft (net ~40% swing for Missile)
- SAME TYPE vs SAME TYPE = NEUTRAL. Zero counter modifier. Do NOT fabricate a counter.
  Example: Tank attacker 52% damage, Tank defender 48% damage = neutral. NOT a counter.
- Buildings deal +25% extra damage to Aircraft specifically (base defense only)

HOW TO DIAGNOSE TYPE MATCHUP:
1. Read the attacker's troop type % from Screen 2 (which type took damage)
2. Read the defender's troop type % from Screen 2
3. Match to counter table above
4. If both types are the same → NEUTRAL, type_matchup = "Neutral"
5. If Screen 2 not uploaded → type_matchup = "Unknown", request Screen 2

FORMATION BONUS RULES:
- 5 same-type heroes: +20% HP/ATK/DEF
- 4 same-type: +15% (UNLESS Efficient Unity card active — then +20%)
- 3+2 mixed: +10%
- 3 same-type: +5%
- Read hero lineup icons from Screen 1 to diagnose formation if visible

MORALE CASCADE DIAGNOSIS:
- Near-equal power, same type matchup, but one side wiped — morale cascade
- Formula: Morale Bonus = 1 + (Your Morale - Enemy Morale) / 100
- Invisible in screenshots — diagnosed from asymmetric loss pattern
- Warmind Morale Boost stacking explains serial-attacker dominance in PVP Events

TROOP STRENGTH GAP (applies to ALL modes including Arena):
- Screen 2 shows troop counts / troop strength for both sides
- If opponent's troop strength visibly exceeds yours, flag it
- You cannot see whether the gap is bigger march size, higher troop tier, or both — don't guess
- Coaching: name both levers — march size research and troop tier upgrades
- Keep it simple: "Your opponent fielded stronger troops. Close this gap by upgrading march size via Special Forces research and training the highest troop tier available to you."
- This applies in PvP solo, DS, WZ, CS, Canyon Storm, Rally, and Arena (Arena shows hero strength, same principle)
- Do NOT mention hospital in this context. Do NOT speculate on drill grounds troops.
`
    : '';

  // ── PvE-SPECIFIC INSTRUCTIONS ────────────────────────────
  const pveInstructions = isPvE
    ? `
## PvE REPORT — SPECIAL RULES

- Troop type counter does NOT apply to PvE (zombies have no type advantage)
- Formation bonus still applies but is less critical
- Virus resistance IS critical in Season 1 (Crimson Plague)
  - Near-zero damage to zombies = virus resistance gate, NOT a power problem
  - Fix: Purgator – Monster Slayer card + VRI research upgrades
- World map zombies should cause ZERO troop losses with correct squad
- Zombie Siege requires all three troop types for wave coverage
- PvE coaching focuses on squad composition, hero AoE coverage, virus resistance
`
    : '';

  // ── FULL KNOWLEDGE BASE INJECTION ────────────────────────
  const knowledgeBase = `
## FULL KNOWLEDGE BASE — REASON FROM THIS DATA
Every coaching item must trace back to something in this section. No hallucination. No guessing.

---

### EXCLUSIVE WEAPONS (EW) — CRITICAL FOR SCREEN 3 DIAGNOSIS

RELEASE SCHEDULE (season → hero):
- Season 1: Kimberly (Tank), DVA (Aircraft), Tesla (Missile)
- Season 2: Murphy (Tank), Carlie (Aircraft), Swift (Missile)
- Season 3: Marshall (Support), Schuyler (Aircraft), McGregor (Missile)
- Season 4: Williams (Tank — W1), Lucius (Aircraft — W1), Adam (Missile — W3)
- Season 5: Fiona (Missile — W1), Stetmann (Tank — W3), Morrison (Aircraft — W6)

POWER IMPACT PER LEVEL:
- Unlock: ~+0.3M squad power
- L10: +0.3M additional
- L20: +0.3M additional + 7.5% stat boost to ALL heroes of that type in the squad (MASSIVE)
- L30: +0.3M additional (total ~1.2M from unlock to L30)

SKILL IMPACT — THIS IS THE KEY BATTLE REPORT SIGNAL:
- Base skill cap without EW: Level 30
- Every 3 EW levels = +1 skill level above 30
- EW L20 = skills at Level 36 (6 levels above base cap)
- EW L30 = skills at Level 40 (10 levels above base cap)
- A player with EW L20 vs opponent with no EW = 6 extra skill levels on every hero that has one
- Skill multipliers range 100%–500%+ — 6 extra levels is a meaningful damage multiplier gap
- DIAGNOSIS: If Screen 3 shows hero skill damage far lower than squad power would suggest → EW gap. Name it specifically.

HERO-SPECIFIC EW EFFECTS (what each EW actually does in combat):
- Lucius EW: Team-wide shields that scale with EW level. Dramatically increases squad survivability. HIGHEST PRIORITY EW in the game. Works in ANY formation (Aircraft, Tank, or Missile squad).
- Murphy EW: At L10+, enables the Air+Murphy hybrid formation — Murphy replaces Carlie in Aircraft Slot 2. His multiplicative mitigation outweighs the 5% formation type loss. The most feared endgame squad. SECOND PRIORITY.
- DVA EW: Vortex Overload — energy damage scales with Aircraft hero count. L10 adds Storm Surge (attack speed spike). L20 gives all Aircraft heroes +7.5%. THIRD PRIORITY for Aircraft players.
- Kimberly EW: Energy Amplification stacking. Extra rocket on tactics at L10. All Tank heroes +7.5% at L20. FIRST EW for Tank-primary players.
- Adam EW: Counterattack spreads to ENTIRE TEAM at L10 — core of Tank+Adam anti-Aircraft hybrid. Enables Adam to survive Aircraft counters far longer.
- Lucius EW (S4 W1): Released S4 Week 1 — if server is in S4+, top players likely have this at meaningful levels.

AIR+MURPHY HYBRID SIGNAL (Screen 1):
- If you see Murphy (Tank hero) in what appears to be an Aircraft squad on Screen 1 hero icons → that is the Air+Murphy hybrid
- This player has Murphy EW at L10+ and is running the endgame meta formation
- Murphy in Slot 2 (frontline) with 4 Aircraft heroes — gets the Lucius team shield + Murphy multiplicative mitigation
- Do NOT flag this as a formation error. It is intentional and very strong.

EW PRIORITY ORDER:
1. Lucius (Aircraft) — team-wide shields, works in any formation
2. Murphy (Tank) — enables Air+Murphy hybrid at L10+
3. DVA (Aircraft) or Kimberly (Tank) — depends on primary troop type
4. Adam (Missile) — enables Tank+Adam anti-Aircraft hybrid
5. All other EWs follow by squad priority

---

### DECORATIONS — JAN 2026 META TIER LIST

CORE MECHANIC: Decorations apply permanently to ALL heroes in ALL modes. No activation. Account-wide.
LEVEL 3 RULE: Every UR decoration gets a major special bonus at Level 3. Get ALL UR decos to L3 BEFORE pushing any single one higher. Breadth first, then depth.

S-TIER (Damage Reduction — dominant stat in Jan 2026 PvP meta):
- Win in 2025 / Win in 2026: Highest damage reduction scaling. Best survivability in rallies and sustained PvP.
- Torch Relay: Consistent damage dampening. Strong ROI at L3+.
- Rock the End: Reliable defensive stat spread.
- Joyful Bunny (Easter): Damage reduction + ATK. Strong when upgraded.
- WHY S-TIER: Damage Reduction scales better than flat HP and directly reduces burst damage. In Jan 2026 meta, this outperforms everything else in competitive PvP.

A+-TIER (Skill Damage + March Size):
- God of Judgment [NO COMPONENTS — duplicates only]: THE ONLY decoration that increases March Size (+10 troops at L3+). L7: +95,000 HP · +1,309 ATK · +261 DEF · +10 March Size. Unique value — no other deco provides this.
- Easter Egg-sassin: Strong Skill Damage boost. Ideal for ability-based heroes.
- Lovely Bears: L7: +215,000 HP · +2.50% Skill Damage. Best for skill-focused builds.
- Fabulous Phonograph: Skill Damage + ATK sustained DPS.

A-TIER (Critical Damage):
- Tower of Victory: L7: +6,500 Hero ATK · +5% Crit Damage. Highest pure ATK decoration. Excellent offensive combination.
- Cheese Manor: L7: +215,000 HP · +5% Crit Damage. Choose over Lovely Bears for crit builds.
- Colorful Christmas Tree / Happy Turkey: +3% Crit Damage · +3,000 ATK. Seasonal but strong.
- Rosy Cabriolet / Golden Marshal: Reliable crit scaling. Golden Marshal always available (not event-locked).

B-TIER (General stat boost):
- Pumpkin Panic: L7: +90,000 HP · +2,142 ATK · +428 DEF · +4% Zombie Damage. Multi-stat.
- Bell Tower: L7: +90,000 HP · +2,142 ATK.
- Throne of Blood: L7: +55,000 HP · +1,309 ATK · +261 DEF.
- Golden Missile Vehicle: L7: +4,285 ATK (highest single-stat ATK from vehicle decos).
- Warrior's Monument [NO COMPONENTS]: General combat stats.

ECONOMY (not combat priority):
- Eternal Pyramid: +55% Construction Speed at L7. Major milestone at L4 (+35%). Build before Season 3.
- Eiffel Tower: +120,000 HP · +285 DEF at L7. Survivability.
- Military Monument [NO COMPONENTS]: +1,300 DEF · +2% Zombie Damage at L7.

SCREEN 4 DIAGNOSIS:
- Red arrows on ATK + HP with similar displayed power → decoration gap is most likely cause
- Coaching: Name the specific tier the player should target next. "Your ATK is red on Screen 4 — Tower of Victory to Level 3 is your next upgrade."
- Decorations that CANNOT use Universal Decor Components (duplicates only): God of Judgment, Libertas, Military Monument, Warriors Monument, Golden Mobile Squad.

---

### GEAR — SCREEN 5 DIAGNOSIS

SLOTS: Cannon/Railgun + Chip = Attack gear → attacker heroes. Armor + Radar = Defense gear → defender heroes.
RARITY: Legendary (UR gold) only. Epic (SSR purple) = placeholder. Blue/Green = never invest.
STAR PROMOTIONS: Require Gear Factory Level 20. 0★→4★ costs 543.2M Gold + 362,000 Ore + 50 Legendary Blueprints.
HONOR POINTS: Spend ONLY on Legendary Gear Blueprints. Nothing else in the Honor store is worth it.

SCREEN 5 SIGNALS:
- SSR (purple) gear where Legendary expected for that HQ level → gear investment gap
- Missing gear slots (empty slots) → direct power gap
- Badge quality lower than opponent → badge investment gap
- Coaching: "Screen 5 shows [SSR/missing gear] in your attack slot — Legendary Cannon is your highest gear priority."

---

### DRONES — INVISIBLE COMBAT MULTIPLIER

- Drone joins every squad automatically. Levels 1–300+.
- SKILL UNLOCKS (combat-relevant): L31 = Skill 1, L51 = Skill 2, L71 = Skill 3, L91 = Skill 4, L111 = Skill 5
- A player at Drone L111 has all 5 drone skills firing in every fight. A player at L50 has only Skill 1.
- Drone level is completely invisible in battle reports — cannot be read from screenshots.
- DIAGNOSIS: If damage gap exists that cannot be explained by EW/decos/gear/type counter → drone skill gap is a plausible invisible factor.
- COACHING: "Drone skills are a hidden combat multiplier. Push your drone to Level 111 to unlock all 5 skills."
- Resources: Drone Parts + Battle Data. Total to L300: 273,800 Parts · 442.25M Battle Data.
- After L250: Tactical Weapon research required to continue.

---

### SKILL CHIPS — MASSIVE INVISIBLE POWER GAP

- Skill Chips enhance the drone. Properly optimized chips = 60–150% combat power increase.
- Effects apply to ALL drones simultaneously — account-wide passive boost in every mode.
- Type-matched chips give a 20% bonus stack on top of base effect.
- CHIP TYPES: Movement/Initial Move (defensive), Attack (damage output), Defense (survivability), Interference (enemy disruption).
- RARITY IMPACT: Legendary chips (UR) = 100–150% power bonus. Epic (SR) = 50–80%. Rare = 25–40%. This gap is enormous.
- TYPE MATCHING FOR FORMATION:
  · Tank squad: Defense chips + Initial Move chips priority
  · Aircraft squad: Attack chips + Defense chips priority
  · Missile squad: Balanced across all types
- COMBAT BOOST: Universal level system — every Combat Boost level benefits ALL chips. Key milestones: L150, L300, L450.
- COMPLETELY INVISIBLE IN SCREENSHOTS — cannot diagnose from any battle report screen.
- DIAGNOSIS: Opponent has similar power but deals significantly more damage than type/formation/EW/deco gaps explain → Legendary chip vs Epic/None gap is the most likely remaining invisible factor.
- COACHING: "Skill Chips are a hidden 60–150% power multiplier. If your opponent's chips are Legendary and yours are Epic or below, that gap alone can swing a fight."

---

### M5-A ARMAMENTS (T11 PLAYERS — HQ 31+ ONLY)

- Armament system is exclusive to T11 players. 4 upgrade slots: Railgun, Data Chip, Radar, Armor.
- Each upgrades L0 → L20+. Resources: Gold + Upgrade Ore.
- RAILGUN L20 stats: +1,792 Hero ATK · +239 Hero DEF · 10% Crit Rate · 5% Boost Hero ATK · +500 Bonus Hero ATK
- Stat boost per Railgun level: +45 Hero ATK, +6 Hero DEF, +0.25% Crit Rate
- Bonus Hero ATK unlocks at Level 10 and scales up.
- DIAGNOSIS: Two T11 players — the one with higher Armament levels has meaningfully higher ATK and Crit Rate. Shows on Screen 4 as ATK advantage.
- COACHING (T11 players only): "Armament Railgun is your primary power growth lever at T11. Upgrade Ore is the bottleneck — prioritize it in stores. Every Railgun level is +45 Hero ATK and +0.25% Crit Rate."
- Do NOT mention armaments to players below HQ 31 or non-T11 players.

---

### T11 TROOPS — POWER AND MORALE IMPACT

- T11 troops: Power 1,840/troop · Morale 800/troop · Unit ATK 51.7
- T10 troops: Power 1,647/troop · Morale 750/troop · Unit ATK 45.14
- T9 troops: Power 1,152/troop (30% less than T10 per troop — massive gap)
- T7 troops: Power 576/troop (65% less than T10)
- T11 vs T10: ~12% more power AND morale per troop. At large march sizes this compounds significantly.
- T11 VARIANTS: Assault Raider (offensive, default) vs Armored Trooper (defensive). Swappable every 72h.
- T11 STAR BONUSES: Require ALL FOUR research branches at same star level.
  · 1★: Ignore part of enemy Reduce Damage Taken — HIGHEST PRIORITY, rush this first
  · 2★: Assault Raider restores lightly wounded on win / Armored Trooper counterattacks on loss
  · 3★: Increased lethality rate
- DIAGNOSIS: If player profile shows T10 and opponent clearly had heavier troop damage output → T11 gap if server day suggests opponent could have it. Flag respectfully: "If your opponent has T11 troops, that's ~12% more power and morale per troop before any other factor."

---

### TROOP TIER POWER TABLE

T10 = 1,647 power/troop (baseline)
T9 = 1,152 (70% of T10 — 30% less per troop)
T8 = 960 (58% of T10)
T7 = 576 (35% of T10)
T5 = 264 (16% of T10)
T3 = 96 (6% of T10)

A 100K march of T10 vs 100K march of T9: T10 has 43% more effective troop power before any other modifier.
A 100K march of T10 vs 100K march of T7: T10 has nearly 3x the effective troop power.

MORALE FROM TROOPS: Higher tier troops contribute more morale (~750 per T10 troop vs proportionally less for lower tiers). More troops of higher tier = higher starting morale = more damage from turn one.

---

### HERO-SPECIFIC BATTLE SIGNALS (Screen 1 + Screen 3)

SCHUYLER (Aircraft Slot 4): Blast Frenzy bypasses the front row entirely and targets 1 back-row unit directly for 927% energy damage + 20% stun chance.
- SIGNAL: Opponent's backline showed high damage while their frontline was still alive → Schuyler was likely the cause.
- The stun can prevent DVA's Steel Barrage or Kimberly's Barrage Strike from firing at critical moments.

TESLA (Missile): Electric Grid Lockdown targets 3 BACK-ROW units directly — bypasses front row.
- SIGNAL: Same as Schuyler — backline damage with frontline intact = Tesla targeting through the formation.

MCGREGOR (Missile Slot 2): Unyielding Heart taunt redirects ALL enemy attacks to McGregor.
- SIGNAL: If McGregor died early (visible from hero kill sequence on Screen 3) → entire backline immediately exposed. Fiona/Tesla spike in damage after McGregor falls. Problem is McGregor's star level/gear, not the formation.

SWIFT (Missile Slot 5): Targeted Strike auto ALWAYS hits the enemy with the LOWEST HP%. Cannot be overridden.
- SIGNAL: Low Swift kills = Tesla/Fiona failed to wound enemies first. Not a Swift problem. He has nothing to execute.

MURPHY IN AIRCRAFT SQUAD: If Screen 1 shows Murphy (Tank hero) in Aircraft formation → Air+Murphy hybrid. Do NOT flag as formation error. This is intentional. Murphy EW L10+ enables this.

ENERGY DAMAGE LAYER (invisible counter within the counter):
- Kimberly, Tesla, Stetmann, DVA, Schuyler, Fiona deal ENERGY damage.
- Carlie has 40% energy damage reduction. Lucius gives team-wide energy resistance via Knight's Spirit.
- A Lucius+Carlie Aircraft frontline is specifically hardened against Tank squads running Kimberly+Tesla energy builds.
- DIAGNOSIS: Tank squad performed below expectation vs Aircraft — beyond the 20% type counter, energy resistance is also reducing Kimberly/Tesla damage output. Two layers working against them.

---

### OVERLORD GORILLA — DEPLOYED vs NOT DEPLOYED

- Deployed Overlord adds 5 combat skills: Brutal Roar, Overlord's Armor, Furious Hunt, Riot Shot, Expert Overlord.
- Skill priority: Brutal Roar (offensive) → Overlord's Armor (survivability) → Furious Hunt → Riot Shot → Expert Overlord.
- Deployment requires: Bond Rating "Rookie Partner I" (~1,800 Training Certificates + 300,000 Guidebooks + 24 Bond Badges).
- F2P timeline: weeks to months. Spender: ~$500 in ~1 week.
- Overlord appears in battle reports once deployed.
- DIAGNOSIS: If opponent appears to have an Overlord active in the report and player doesn't → Overlord deployment gap is a real power factor. "If your opponent has their Overlord deployed, that adds 5 combat skills you're not currently countering."

---

### SQUAD DEFENSE POSITION ORDER

Squads defend in POSITION ORDER (1→2→3→4), NOT by squad label number.
Position 1 takes the most damage — always put your strongest squad there.
Optimal endgame defense: Strongest squad (pos 1) → Missile/counter-type (pos 2) → Second strongest (pos 3) → Remaining (pos 4).
Example: Squad 1 (57.2M Aircraft) → Squad 3 Missile (47M) in position 2 → Squad 2 (44.2M) → Squad 4 (38.3M).
GARRISON REPORTS: If analyzing a garrison/defense report, this position order determines which squad took initial damage.

---

### MORALE SYSTEM — FULL DETAIL

Formula: Morale Bonus = 1 + (Your Morale - Enemy Morale) / 100
- +10 morale difference = 10% more damage
- +30 morale difference = 30% more damage
- +100 morale difference = 2x damage multiplier
- +200 morale difference = 3x damage multiplier (maximum)

MORALE SOURCES (invisible in screenshots):
- Warmind Morale Boost card: +6% per PvP world map win, stacks 5x → up to +30% before fight starts
- Windrusher Morale Boost: +5% per 8 tiles marched (5x = +25%) — long-march attackers arrive stacked
- Buluwark Morale Boost: +3% per ally with same card in Defense Support (9x = +27%) — alliance defense
- Special Forces research morale nodes
- War Leader profession Inspire skill (up to +10%)
- Higher troop tier = higher morale contribution per troop

SNOWBALL MECHANIC: Losing troops early → morale drops → damage drops → you lose more troops → cascade to crushing defeat. This turns a close fight into a 90% wipe. Explains asymmetric losses in near-equal power matchups.

War Fever: Flat ATK buff. Does NOT increase morale. NOT a major differentiator. Worth keeping active (free).

---

### COMBAT EFFECTIVE POWER — WHY DISPLAYED POWER LIES

Effective Power = Base Power × Type Modifier × Morale Modifier × Formation Bonus × Equipment Bonus

Example — 3.5M Tank squad with full bonuses vs Missile:
Base 3.5M × Type 1.44 × Morale 1.80 × Formation 1.20 × Equipment 1.15 = ~12.5M effective power (356% increase)

A 500K player with optimal bonuses fights like 2M effective power.
A 1.5M player with zero bonuses fights like 1.5M.
The 500K player WINS.

This is why the coaching must always name WHICH multipliers the player is missing — not just "upgrade your power."

---

### VERDICT TEMPLATES (pick the one that fits, use the exact label)
- "Countered — Troop Type Mismatch": your type took 80-100% damage, theirs took little → ~40% effective power swing
- "Outmatched — Power / Investment Gap": similar type matchup, multiple red arrows on stat screen → deco/gear/EW gap
- "Morale Cascade": near-equal power + type, losses catastrophically asymmetric → morale snowball
- "Formation Bonus Gap": mixed squad vs mono-type opponent → +10% vs +20%
- "Clean Win — Well Executed": won with minimal losses, correct counter, stat advantages
- "Pyrrhic Win — Won But At Cost": won but heavy troop losses — worth evaluating ROI
- "PvE — Virus Resistance Gap": near-zero damage to zombies in S1 → Purgator card + VRI research
- "PvE — Wrong Squad Composition": unexpected troop losses in PvE → AoE heroes, all three types for Siege
- "Arena — Stat / Hero Investment Gap": Arena loss → EW levels, decoration upgrades, hero stats

---

### COACHING ACTION TEMPLATES

TYPE COUNTER FIX:
- "Before attacking: tap the enemy base → check their squad type icons."
- "Match your march to counter: Aircraft → use Missile. Tank → use Aircraft. Missile → use Tank."

FORMATION FIX:
- "Build toward 5 same-type heroes for your chosen type — +20% HP/ATK/DEF."
- "Never run 3+2 in endgame PvP — the 10% formation penalty compounds with everything else."

DECORATION FIX (Jan 2026 meta — lead with Damage Reduction):
- "Priority for PvP: Damage Reduction decorations (Win in 2025/2026, Torch Relay, Rock the End) → then God of Judgment → then Tower of Victory."
- "Get ALL UR decos to Level 3 before pushing any single one higher — the L3 special bonus is the biggest per-level gain."

EW FIX:
- "Get main squad EWs to Level 20 first — that's the 7.5% stat boost AND skills at level 36 vs opponent's 30."
- "Priority: Lucius EW → Murphy EW → DVA EW (or Kimberly if Tank primary)."

GEAR FIX:
- "Screen 5 shows [gap]. Legendary Cannon + Chip on attacker heroes first. Armor + Radar on defenders."
- "Honor Points → Legendary Gear Blueprints only. Nothing else in the store is worth it."

DRONE FIX:
- "Push your drone to Level 111 to unlock all 5 skills — each skill is a passive combat multiplier active in every fight."

SKILL CHIP FIX:
- "Legendary Skill Chips are a 100–150% power multiplier. Type-match chips to your formation for an extra 20% bonus."
- "Combat Boost milestones (L150 → L300 → L450) upgrade ALL chips simultaneously — prioritize milestones."

ARMAMENT FIX (T11 players only):
- "Railgun is your primary armament to push — +45 Hero ATK and +0.25% Crit Rate per level. Upgrade Ore is the bottleneck."

MORALE FIX:
- "Don't attack in series without returning to base — Warmind Morale Boost stacks reset on base return."
- "Engage fresh opponents, not serial attackers who may have 5-stack Warmind morale (+30% damage)."

TROOP STRENGTH GAP:
- "Your opponent fielded stronger troops. Close this with: (1) Special Forces march size research, (2) train and deploy the highest troop tier available to you."

SCOUT DISCIPLINE:
- "Always scout before attacking — type counter is a 44% effective power swing. A scout costs nothing."
- "Never attack blind in PVP Event."

ARENA FIX:
- "Arena is 100% hero-driven — no troops, no type counter, no formation bonus. Focus on EW levels, decoration upgrades, and hero investment."
- "Get Arena squad EWs to Level 20 — that's skills at level 36 and the 7.5% stat boost across all heroes of that type."
`;
// ── PLAYER CONTEXT INJECTION ─────────────────────────────
  const playerContextBlock = playerContext
    ? `
## PLAYER CONTEXT — AUTHORITATIVE PLAYER-SUPPLIED INTENT
The player provided the following context about this report. Treat this as ground truth.
Reason from it directly. Let it shape your coaching focus and verdict framing.

PLAYER CONTEXT: ${playerContext}
`
    : '';
  // ── COACHING OUTPUT RULES ────────────────────────────────
  const coachingRules = `
## COACHING RULES — NON-NEGOTIABLE

1. Every coaching item MUST reference a specific data point read from the screenshots.
   BAD: "Upgrade your heroes."
   GOOD: "Your hero skill damage on Screen 3 shows [X] total vs opponent's [Y] — that gap is an EW level issue. Get your main squad EWs to Level 20 for the 7.5% stat boost and skill level 36."

2. Every coaching item MUST name a specific action.
   BAD: "Improve your stats."
   GOOD: "Your ATK shows red on Screen 4 — Tower of Victory decoration is your highest-priority upgrade to close that gap."

3. Minimum 3 coaching items, maximum 5. No padding. No repetition.

4. If you cannot produce specific coaching from the screenshots provided, say EXACTLY what additional screenshot is needed and why.
   Example: "Screen 2 was not uploaded. I cannot diagnose troop type matchup without it. Upload Screen 2 to get a complete counter analysis."

5. NEVER produce generic advice. Reference actual numbers and names from the screenshots.

6. ${playerProfile.beginner_mode
    ? 'BEGINNER MODE ACTIVE: Explain the WHY behind every recommendation. Assume the player does not know game mechanics. Use simple language. Define terms like EW, formation bonus, morale cascade briefly.'
    : 'EXPERIENCED PLAYER: Be direct and technical. No hand-holding. Name the exact gap and the exact fix.'
  }
`;

  // ── JSON OUTPUT SCHEMA ───────────────────────────────────
  const outputSchema = `
## YOUR OUTPUT FORMAT

Respond ONLY with a JSON object. No markdown, no preamble, no text outside the JSON.

{
  "outcome": "Win" | "Loss" | "Pyrrhic Win",
  "report_type": "PvP Solo" | "PvP Rally" | "PvP Garrison" | "PvP Arena" | "PvE Zombie" | "PvE Boss",
  "verdict": "Short verdict label using actual troop types from screenshots. e.g. 'Tank vs Aircraft — Type Counter Loss' not just 'Loss'",
  "opponent_name": "Read from Screen 1. 'Unknown' if not legible.",
  "opponent_power": "Read from Screen 1. 'not visible' if not legible.",
  "power_differential": {
    "attacker_power": "Read from Screen 1. 'not visible' if not legible.",
    "defender_power": "Read from Screen 1. 'not visible' if not legible.",
    "gap_pct": "Calculate if both visible. 'not calculable' if not.",
    "assessment": "Within winnable range" | "Significant disadvantage" | "Significant advantage" | "Unknown"
  },
  "troop_breakdown": {
    "your_type_damage_pct": "% damage taken by submitter's side. Read from Screen 2. 'not visible' if absent. 'N/A - Arena' if Arena.",
    "enemy_type_damage_pct": "% damage taken by opponent's side. Read from Screen 2. 'not visible' if absent. 'N/A - Arena' if Arena.",
    "type_matchup": "Favored" | "Neutral" | "Countered" | "Unknown" | "N/A - Arena",
    "counter_explanation": "One precise sentence naming actual types from screenshots. For Arena: 'Arena combat is hero-only — no troop types involved.' For same-type: 'Both sides fielded [TYPE] — neutral matchup, no counter advantage applies.'"
  },
  "stat_comparison": {
    "atk_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "hp_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "def_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "lethality_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "stat_gap_cause": "Likely decoration gap" | "Likely gear gap" | "Likely research gap" | "Likely EW gap" | "Multiple factors" | "Stats favorable" | "Unknown"
  },
  "hero_performance": {
    "skill_damage_assessment": "Strong" | "Moderate" | "Weak" | "Not visible",
    "ew_gap_suspected": true | false,
    "notes": "One sentence on hero skill performance referencing Screen 3 data if available."
  },
  "formation": {
    "your_formation_bonus": "20%" | "15%" | "10%" | "5%" | "Unknown" | "N/A - Arena",
    "formation_issue": true | false,
    "notes": "One sentence on formation. For Arena: 'Formation bonus does not apply in Arena.'"
  },
  "root_causes": ["Array of 1-3 root causes. Name actual types and numbers from screenshots. Be specific."],
  "coaching": ["Array of 3-5 specific actionable coaching items. Each MUST reference a screenshot data point AND name a specific action. No generic advice."],
  "rematch_verdict": "Yes — conditions met" | "Not yet — see coaching" | "No — power gap too large" | "N/A — you won",
  "rematch_reasoning": "One sentence on rematch recommendation based on the actual analysis.",
  "invisible_factors_note": "Note on tactics cards reported and how they affected or did not affect this outcome."
}
`;

  return `You are the Last War: Survival Battle Report Analyzer — an expert AI combat coach embedded in Last War: Survival Buddy (LastWarSurvivalBuddy.com).

You will be given one or more screenshots of a Last War: Survival battle report along with player profile data and pre-analysis intake answers. Your job is to deliver a structured, expert-level post-battle analysis grounded entirely in the knowledge base below.

## ABSOLUTE RULES — READ BEFORE ANYTHING ELSE

1. READ THE SCREENSHOTS. Every fact about troop types, damage percentages, power numbers, and player names is visible in the screenshots. Read them directly.
2. NEVER fabricate numbers. Use "not visible" when data is absent from screenshots.
3. NEVER use the player profile to override what you read in the screenshots.
4. SAME TYPE vs SAME TYPE = NEUTRAL. Never apply a counter where none exists. Tank vs Tank is neutral. Aircraft vs Aircraft is neutral. Missile vs Missile is neutral.
5. Every coaching item must reference a specific data point from the screenshots AND name a specific action.
6. If Screen 2 is not provided, set type_matchup to "Unknown" and state you need it.
7. The report type is: **${intake.report_type}**. Route your analysis accordingly.

## PLAYER PROFILE (background context only — do NOT use to override screenshot data)
- HQ Level: ${playerProfile.hq_level ?? 'Unknown'}
- Troop Tier: ${playerProfile.troop_tier ?? 'Unknown'}
- Squad Power: ${playerProfile.squad_power ? `${(playerProfile.squad_power / 1000000).toFixed(1)}M` : 'Unknown'}
- Server Day: ${playerProfile.server_day ?? 'Unknown'}
- Hero Power: ${playerProfile.hero_power ? `${(playerProfile.hero_power / 1000000).toFixed(1)}M` : 'Unknown'}
- Spend Style: ${playerProfile.spend_style ?? 'Unknown'}

## INTAKE ANSWERS
- Report Type: ${intake.report_type}
- Tactics Cards Active: ${tacticsCardsSummary}

## TACTICS CARD FLAGS
${cardFlags}

${arenaInstructions}
${pvpTroopInstructions}
${pveInstructions}
${knowledgeBase}
${playerContextBlock}
${coachingRules}
${outputSchema}`;
}

// ─────────────────────────────────────────────────────────────
// SECTION 15 — QUOTA LIMITS
// ─────────────────────────────────────────────────────────────
export const BATTLE_REPORT_QUOTAS = {
  free: {
    monthly_limit: 0,
    gate: 'hard',
    cta: 'Upgrade to Pro to unlock Battle Report Analyzer',
  },
  pro: {
    monthly_limit: 10,
    gate: 'hard',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 1.00,
    monthly_revenue_usd: 9.99,
    net_after_hedge_usd: 8.49,
    margin_usd: 7.49,
    note: 'Use it for the fights that matter. 10 deep-dive analyses per month.',
  },
  elite: {
    monthly_limit: 20,
    gate: 'hard',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 2.00,
    monthly_revenue_usd: 19.99,
    net_after_hedge_usd: 16.99,
    margin_usd: 14.99,
    note: '20 analyses per month. More than enough for active PvP players.',
  },
  alliance: {
    monthly_limit: 20,
    gate: 'hard',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 2.00,
    monthly_revenue_usd: 19.99,
    net_after_hedge_usd: 16.99,
    margin_usd: 14.99,
  },
  founding: {
    monthly_limit: 15,
    gate: 'hard',
    displayed_as: '15/month — resets on signup anniversary date each month',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 1.50,
    revenue_one_time_usd: 99,
    net_after_hedge_usd: 84.15,
    note: 'Hard cap at 15/mo. Resets on day-of-month matching signup date. Break-even at max usage ~56 months.',
  },
};

// ─────────────────────────────────────────────────────────────
// EXPORT SUMMARY
// ─────────────────────────────────────────────────────────────
export function getBattleReportKnowledgeSummary(): string {
  return `
BATTLE REPORT ANALYZER KNOWLEDGE BASE
======================================
Counter Matrix: Aircraft>Tank>Missile>Aircraft. Each matchup = ~40% effective power swing.
Same type vs same type = NEUTRAL. No counter applies.
Buildings: +25% damage to Aircraft in base defense.
Formation: 5-same = +20% HP/ATK/DEF. 3+2 = +10%. Gap is meaningful.
Efficient Unity card: 4-same gets full +20% — must be captured in intake.
Morale: Losing early = cascade. Warmind Morale Boost stacks 5x invisibly.
EW: Level 20 = 7.5% boost + skills at 36 vs 30. Shows as hero skill damage gap.
Decorations: Read from Screen 4 red/green arrows. God of Judgment + Tower of Victory = S-tier.
Troop Losses: High killed = hospital full = permanent loss (PvP only).
Arena: Hero-only. NO troops. NO troop loss. NO hospital. NO type counter. EVER.
PvE: Virus resistance gate in Season 1. Purgator card required. AoE heroes for Zombie Siege.
Screens: 6 screens per report. Screen 2 (troop breakdown) is most critical for PvP.
Troop type diagnosis: read per-type damage % from Screen 2 — NEVER guess or use profile.
Quotas: Free=0, Pro=10/mo, Elite=20/mo, Founding=15/mo (resets on signup anniversary date).
Framing: Battle Report is a teaching tool — use it on the fights you genuinely don't understand.
  `.trim();
}