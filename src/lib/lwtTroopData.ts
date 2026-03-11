// src/lib/lwtTroopData.ts
// Troop data: composition, counter strategy, march sizing, upgrade path
// Source: lastwartutorial.com/troops + game knowledge
// Built: March 11, 2026 (session 5)

export interface TroopTierInfo {
  tier: string;
  barracksLevel: number;
  notes: string;
}

export const TROOP_TIER_REQUIREMENTS: TroopTierInfo[] = [
  { tier: 'T1', barracksLevel: 1, notes: 'Starting troops' },
  { tier: 'T2', barracksLevel: 4, notes: 'Early game' },
  { tier: 'T3', barracksLevel: 6, notes: 'Early game' },
  { tier: 'T4', barracksLevel: 10, notes: 'Early-mid game' },
  { tier: 'T5', barracksLevel: 14, notes: 'Mid game' },
  { tier: 'T6', barracksLevel: 17, notes: 'Mid game' },
  { tier: 'T7', barracksLevel: 20, notes: 'Mid game' },
  { tier: 'T8', barracksLevel: 24, notes: 'Mid-late game. Substantial power jump.' },
  { tier: 'T9', barracksLevel: 27, notes: 'Late game' },
  { tier: 'T10', barracksLevel: 30, notes: 'HQ 30+. Requires Special Forces research in Tech Center. Major unlock.' },
  { tier: 'T11', barracksLevel: 35, notes: 'HQ 35. Season 4+. Requires Armament Institute research. Highest tier.' },
];

// Counter triangle — locked in from MasterBrief
export const TROOP_COUNTER_TRIANGLE = {
  summary: 'Aircraft beats Infantry. Infantry beats Tank. Tank beats Aircraft. Missile Vehicle counters all three but has lower sustained power.',
  counters: [
    { attacker: 'Aircraft', beats: 'Infantry', note: 'Aircraft have high alpha damage vs Infantry' },
    { attacker: 'Infantry', beats: 'Tank', note: 'Infantry overwhelm Tank with numbers' },
    { attacker: 'Tank', beats: 'Aircraft', note: 'Tank anti-air capability' },
    { attacker: 'Missile Vehicle', beats: 'all', note: 'Universal counter but lower sustained DPS. Good for mixed defense.' },
  ],
  specialization_note: 'Specialization matters more than raw numbers after Day 70+. Mixed armies perform worse than a fully specialized force of equal power.',
};

// Troop type strategy guide
export const TROOP_TYPE_GUIDE = [
  {
    type: 'Aircraft',
    playstyle_fit: ['Fighter', 'Commander'],
    strengths: [
      'Highest alpha strike damage',
      'Excellent vs Infantry-heavy servers',
      'Top PvP performance at T10+',
    ],
    weaknesses: [
      'Vulnerable to Tank counters',
      'Resource-intensive to maintain at T11',
    ],
    beginner_friendly: false,
    notes: 'Best for players who want to dominate PvP and kill events. Requires good hero lineup (Adam, Williams). Strong at HQ 30+.',
  },
  {
    type: 'Tank',
    playstyle_fit: ['Developer', 'Scout', 'Commander'],
    strengths: [
      'Forgiving playstyle — defensive synergy',
      'Strong sustained combat',
      'Best beginner choice',
      'Counters Aircraft (common troop type)',
    ],
    weaknesses: [
      'Vulnerable to Infantry counters',
      'Lower alpha strike than Aircraft',
    ],
    beginner_friendly: true,
    notes: 'Recommended for beginners and developers. Pairs well with Kimberly, Sara. Defensive playstyle is forgiving of mistakes.',
  },
  {
    type: 'Infantry',
    playstyle_fit: ['Fighter', 'Commander'],
    strengths: [
      'Counters Tank',
      'High troop count — good for wall defense',
      'Strong in zombie events',
    ],
    weaknesses: [
      'Weakest vs Aircraft (most common opponent type)',
    ],
    beginner_friendly: false,
    notes: 'Situationally strong. Better in servers where Tank is dominant. Less common at endgame.',
  },
  {
    type: 'Missile Vehicle',
    playstyle_fit: ['Commander', 'Developer'],
    strengths: [
      'Universal counter — no hard weakness',
      'Good for mixed-squad defensive setups',
      'Reliable in events with unknown opponent types',
    ],
    weaknesses: [
      'Lower sustained DPS vs specialized troops',
      'Not optimal for pure PvP',
    ],
    beginner_friendly: false,
    notes: 'Strong in position 2 of defense lineup as a flex counter. Common endgame defensive choice (see founder: Squad 3 Missile in position 2).',
  },
];

// March sizing guide
export const MARCH_SIZE_GUIDE = {
  summary: 'March size determines how many troops you can send in a single attack or gather. Larger marches = more damage and resource collection.',
  key_milestones: [
    { unlock: 'VIP 15', benefit: '5th march slot — major PvP upgrade' },
    { unlock: 'Special Forces research', benefit: 'T10 training + march capacity increases' },
    { unlock: 'HQ upgrades', benefit: 'Base march capacity increases per HQ level' },
    { unlock: 'Military research tree', benefit: 'March size % bonuses — upgrade steadily' },
  ],
  tips: [
    'Always fill all march slots when attacking — never send partial marches',
    'In Kill Event, deploy maximum troops across all squads',
    'During gathering, send largest march to most valuable resource (Oil at HQ 25+)',
    'For rally attacks, march size of rally leader determines total army size cap',
  ],
};

// Troop upgrade / laddering strategy
export const TROOP_UPGRADE_STRATEGY = {
  key_concept: 'Laddering',
  explanation: 'Stagger barracks levels deliberately so not all barracks upgrade simultaneously. This reduces resource spikes and keeps training queues full at the highest tier you can sustain.',
  rules: [
    'Always train the highest tier you can unlock — never train low tiers once higher are available',
    'Use training speedups on Day 5 Alliance Duel (Total Mobilization) for double points',
    'T8 is a major power jump — prioritize reaching it before focusing on heroes',
    'T10 requires Special Forces research in Tech Center — this is the main gate',
    'T11 requires Armament Institute research — Season 4+ only, HQ 35',
    'Equal troop tiers eliminate laddering advantage — time your promotions carefully',
  ],
  operation_falcon: 'Special Ops in Operation Falcon give free troops at your highest trainable tier. Always upgrade at least one barracks to max before running Special Ops.',
  drill_grounds: 'Troops live in Drill Grounds once trained. More Drill Grounds = larger standing army. Unlock via HQ progression.',
};

// Squad composition guide
export const SQUAD_COMPOSITION = {
  squads: 4,
  defense_position_rule: 'Squads defend in POSITION ORDER (1→2→3→4), not by squad label. Always build defense around position, not squad number.',
  recommended_defense_setup: {
    position_1: 'Your strongest squad — first line takes most damage',
    position_2: 'Missile Vehicle or counter-type — flex counter position',
    position_3: 'Second strongest squad',
    position_4: 'Remaining power',
    example: 'Founder setup: Squad 1 (57.2M) → Squad 3 Missile (47M) in position 2 → Squad 2 (44.2M) → Squad 4 (38.3M)',
  },
  offense_note: 'In PvP attacks, counter your opponent\'s troop type. Check their troop type before attacking if possible.',
};

// Training speedup optimization
export const TRAINING_SPEEDUP_GUIDE = {
  best_days_to_use: [
    { day: 'Alliance Duel Day 5 (Total Mobilization)', reason: 'Training speedups earn VS points + Arms Race Unit Progression phase overlap = double dip' },
    { day: 'Pre-Kill Event', reason: 'Maximize troop count before Enemy Buster / kill events' },
  ],
  avoid: [
    'Do NOT use training speedups randomly throughout the week — save for Day 5 double-dip',
    'Do NOT train low-tier troops when higher are available (wasted resources)',
  ],
  tip: 'Upgrading troops (promoting existing T9→T10) also counts as training on Day 5 and is faster than training from scratch.',
};

export function getTroopDataSummary(): string {
  const tierList = TROOP_TIER_REQUIREMENTS.map(t =>
    `${t.tier}: Barracks L${t.barracksLevel} — ${t.notes}`
  ).join('\n');

  const counterList = TROOP_COUNTER_TRIANGLE.counters.map(c =>
    `${c.attacker} beats ${c.beats}: ${c.note}`
  ).join('\n');

  const typeGuide = TROOP_TYPE_GUIDE.map(t =>
    `${t.type}: ${t.beginner_friendly ? 'Beginner-friendly' : 'Advanced'}. Strengths: ${t.strengths.join(', ')}. Note: ${t.notes}`
  ).join('\n');

  return `
## Troop System

### Troop Tier Requirements (Barracks Level Gates)
${tierList}

### Counter Triangle
${TROOP_COUNTER_TRIANGLE.summary}
${counterList}
${TROOP_COUNTER_TRIANGLE.specialization_note}

### Troop Type Guide
${typeGuide}

### Squad Composition & Defense
${SQUAD_COMPOSITION.defense_position_rule}
Defense position order: ${SQUAD_COMPOSITION.recommended_defense_setup.position_1} (pos 1) → ${SQUAD_COMPOSITION.recommended_defense_setup.position_2} (pos 2) → ${SQUAD_COMPOSITION.recommended_defense_setup.position_3} (pos 3) → ${SQUAD_COMPOSITION.recommended_defense_setup.position_4} (pos 4)
Example: ${SQUAD_COMPOSITION.recommended_defense_setup.example}

### Training Speedup Strategy
Best days to train: ${TRAINING_SPEEDUP_GUIDE.best_days_to_use.map(d => `${d.day} (${d.reason})`).join(' | ')}
Key rule: ${TROOP_UPGRADE_STRATEGY.rules[0]}
Laddering: ${TROOP_UPGRADE_STRATEGY.key_concept} — ${TROOP_UPGRADE_STRATEGY.explanation}

### March Size Key Milestones
${MARCH_SIZE_GUIDE.key_milestones.map(m => `${m.unlock}: ${m.benefit}`).join('\n')}
`.trim();
}