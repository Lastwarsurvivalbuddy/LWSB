// src/lib/lwtAllianceDuelData.ts
// Alliance Duel VS — granular point values, prep strategy, double-dip timing
// Source: lastwartutorial.com/duel-vs + game knowledge
// Built: March 11, 2026 (session 5)
// Note: lwtEventData.ts already has the broad strokes. This module goes deeper on prep and strategy.

export interface DuelDayDetail {
  day: number;
  name: string;
  victory_points: number;
  theme: string;
  key_actions: string[];
  arms_race_overlap: string[];
  prep_day_before: string[];
  save_for_this_day: string[];
  double_dip_rating: 'excellent' | 'good' | 'moderate' | 'low';
  notes: string;
}

export const DUEL_DAY_DETAILS: DuelDayDetail[] = [
  {
    day: 1,
    name: 'Radar Training',
    victory_points: 1,
    theme: 'Gathering + Drone + Radar missions',
    key_actions: [
      'Send troops gathering on food/iron/gold fields (start day BEFORE, end in Day 1)',
      'Use Drone Combat Data points and Drone Parts',
      'Open Drone Data Chip chests from inventory',
      'Perform radar missions that consume stamina',
      'Stamina consumption from attacks/rally',
      'Hero EXP boost',
    ],
    arms_race_overlap: ['Boost Drone phase', 'Hero Advancement phase'],
    prep_day_before: [
      'Stack radar missions to maximum before day resets',
      'Send gathering troops before reset — time gathering to END after reset (not before)',
      'Do NOT open Drone Data Chip chests — save them for Day 1',
    ],
    save_for_this_day: [
      'Drone Parts and Drone Combat Data',
      'Drone Data Chip chests (NOT Drone Component chests)',
      'Radar mission stamina',
    ],
    double_dip_rating: 'good',
    notes: 'Lowest victory point day (1 VP). Stack radar missions Sunday. Gatherings that start before reset but end after = counts. Drone chests are the hidden point source many miss.',
  },
  {
    day: 2,
    name: 'Base Expansion',
    victory_points: 2,
    theme: 'Building + Construction',
    key_actions: [
      'Upgrade / level up buildings (power increase counts when gift package opened)',
      'Use construction speedups (any length)',
      'Dispatch Legendary Trade Truck',
      'Start Legendary Secret Mission',
      'Recruit survivors (Tavern)',
      'Use T11 Armament material and cores (Season 4+ only)',
    ],
    arms_race_overlap: ['City Building phase'],
    prep_day_before: [
      'Start long building upgrades the day before so they complete on Day 2',
      'Gift-wrap buildings in advance — points trigger when you OPEN the gift package, not when upgrade completes',
      'Queue gift-wrapped buildings to open on Day 2 for a burst of points',
    ],
    save_for_this_day: [
      'Construction speedups',
      'Gift-wrapped buildings',
      'Legendary Truck dispatch',
      'Armament materials (T11 players)',
    ],
    double_dip_rating: 'excellent',
    notes: 'Gift-wrapping is the key mechanic. Start builds days before, leave them gift-wrapped, open them all on Day 2 = massive point burst. Aligns with City Building Arms Race phase.',
  },
  {
    day: 3,
    name: 'Age of Science',
    victory_points: 2,
    theme: 'Research + Valor badges',
    key_actions: [
      'Complete research in Tech Center',
      'Use research/science speedups (any length)',
      'Consume Valor badges via Alliance Duel, Intercity Truck, or Special Forces research',
      'Open Drone Component chests from inventory (NOT Drone Chip chests)',
      'Perform radar missions',
    ],
    arms_race_overlap: ['Technological Research phase'],
    prep_day_before: [
      'Start long research the day(s) before — points trigger when research COMPLETES (when you click the completed icon)',
      'Unlock chests 4–6 and 7–9 via Premium Rewards research on this day to maximize Valor badge efficiency',
    ],
    save_for_this_day: [
      'Science/research speedups',
      'Valor badges (Alliance Duel, Intercity Truck, Special Forces research)',
      'Drone Component chests (NOT Drone Chip chests)',
    ],
    double_dip_rating: 'excellent',
    notes: 'Research that COMPLETES on Day 3 gives points. Start a long research on Day 1 or 2. Valor badge research on this day gets double benefit: research points + unlocks premium chests. Never unlock chests 4–6 on other days — do it here.',
  },
  {
    day: 4,
    name: 'Train Heroes',
    victory_points: 2,
    theme: 'Hero progression',
    key_actions: [
      'Use Legendary Recruitment Tickets in Tavern',
      'Use New Era Recruitment Tickets',
      'Use Hero Return Recruitment Tickets',
      'Use hero shards to increase hero class/rarity',
      'Use skill medals to increase hero skills',
      'Use Exclusive Weapon shards (Season 1+)',
      'Hero EXP boost',
    ],
    arms_race_overlap: ['Hero Advancement phase'],
    prep_day_before: [
      'Save ALL hero recruitment tickets for this day — never use on other days',
      'Save hero shards if you are close to a rarity promotion',
      'Save skill medals — especially if you have UR heroes to promote (wait until after promotion for 100% refund)',
      'Save Exclusive Weapon shards',
    ],
    save_for_this_day: [
      'Legendary, New Era, Hero Return recruitment tickets',
      'Hero shards (if close to rarity promotion)',
      'Skill medals',
      'Exclusive Weapon shards',
    ],
    double_dip_rating: 'excellent',
    notes: 'The hero day. Every hero ticket, every shard, every EW shard should be hoarded for this day. Do NOT promote heroes or use skill medals on other days — full points here. Thursday = Day 4 = Train Heroes on Server 1032.',
  },
  {
    day: 5,
    name: 'Total Mobilization',
    victory_points: 2,
    theme: 'Troop training + Research',
    key_actions: [
      'Train troops (highest tier available)',
      'Use training speedups',
      'Upgrade barracks (building power = Day 2 too)',
      'Use Overlord Gorilla Bond badges (Season 2+ Celebration)',
      'Complete research',
      'Use research speedups',
      'Perform radar missions',
    ],
    arms_race_overlap: ['Unit Progression phase', 'City Building phase', 'Technological Research phase'],
    prep_day_before: [
      'Save ALL training speedups for this day',
      'Have troops queued and ready to train',
      'Leave buildings gift-wrapped if you missed Day 2 (construction counts here too)',
    ],
    save_for_this_day: [
      'Training speedups (most important day for troops)',
      'Overlord Bond badges',
      'Research speedups (secondary priority)',
    ],
    double_dip_rating: 'excellent',
    notes: 'BEST day to use training speedups. Triple Arms Race phase overlap. Training, building, and research all score on Day 5. Upgrading existing troops (T9→T10) is faster than training from scratch and counts equally. Friday = Day 5 = Total Mobilization on Server 1032.',
  },
  {
    day: 6,
    name: 'Enemy Buster',
    victory_points: 4,
    theme: 'Combat + Healing',
    key_actions: [
      'Kill enemy troops (5x points vs duel opponent alliance)',
      'Kill enemy troops from any alliance (1x base points)',
      'Use training speedups (Unit Progression overlap)',
      'Use construction speedups (City Building overlap)',
      'Use research speedups (Tech Research overlap)',
      'Use healing speedups to heal wounded troops',
      'Dispatch Legendary Trade Truck',
      'Start Legendary Secret Mission',
      'Gather on enemy territory',
    ],
    arms_race_overlap: ['City Building phase', 'Technological Research phase', 'Unit Progression phase'],
    prep_day_before: [
      'Train max troops on Day 5',
      'Buy shields for 24 hours (or spare 1500 diamonds for 8-hour shield)',
      'REMOVE troops from defense lineup — if attacked, you lose far fewer troops',
      'Stockpile healing speedups all week',
      'Upgrade barracks during the week to unlock higher-tier troops',
    ],
    save_for_this_day: [
      'Healing speedups',
      'Any remaining training speedups',
      'Any remaining construction/research speedups (all Arms Race phases overlap)',
    ],
    double_dip_rating: 'excellent',
    notes: 'Highest VP day (4 VP). Shield before war. Remove troops from defense lineup to minimize losses if attacked. 5x points for killing duel opponent troops. TvT (tent wars) against non-opponents wounds without killing — point-efficient but coordinate carefully. If alliance is leading, you can sacrifice troops against strong HQs to hit personal chest milestones.',
  },
];

// Victory point structure
export const VICTORY_POINT_STRUCTURE = {
  total_days: 6,
  schedule: 'Monday (Day 1) through Saturday (Day 6)',
  reset_time: '2am UTC always — DST-proof',
  points_per_day: [1, 2, 2, 2, 2, 4],
  total_possible: 13,
  winning_rule: 'Win each day by having more individual points than opponent alliance that day. Alliance with more total VPs at end of week wins.',
  strategy_note: 'Secure victory day-by-day rather than relying solely on Day 6. Day 1 = only 1 VP but free with minimal effort.',
};

// Research investment guide
export const DUEL_RESEARCH_GUIDE = {
  badge_source: 'Valor badges from opening duel chests (can also be purchased)',
  priority_order: [
    'Premium Rewards (unlocks chests 4–6) — do first, use Valor badges on Day 3',
    'Incentive researches (increase points earned per action)',
    'Additional Premium Rewards (unlocks chests 7–9)',
  ],
  timing_tip: 'Unlock chests on Day 3 (Age of Science) — Valor badge consumption scores research points AND unlocks higher reward chests. Never do on other days.',
  note: 'Research bonuses increase points earned per activity. Long-term investment. Do Alliance Duel research before other badge-heavy research trees.',
};

// Advanced tips
export const DUEL_ADVANCED_TIPS = [
  'IMPORTANT: During server reset for 5 minutes, no points are awarded. Check event detail page first to confirm new day started before acting.',
  'Stack radar missions on Sunday (Day 7/reset day) so you start Day 1 with maximum stacked missions.',
  'Gift-wrapping buildings: start builds before Day 2, leave gift-wrapped, open on Day 2 for burst of building points.',
  'Research completion timing: start long research 1-2 days before Day 3 so it completes on Day 3.',
  'TvT tent war strategy: wounded (not killed) troops still give points on Day 6. Wound without killing by using weaker heroes — no annihilation.',
  '5x point bonus: killing your specific duel OPPONENT alliance\'s troops = 5x points. Prioritize their members over anyone else on Day 6.',
  'Defense lineup removal: uncheck all squads from wall defense on Day 6. Prevents troop loss if you get hit while attacking.',
  'Save individual vs alliance points: in the chest unlock screen, focus on hitting chest milestones (3rd, 6th, 9th) then stop if you\'re winning.',
  'Asia/America time advantage: these servers can play when European players are asleep. European alliances need ~52-58% lead at midnight.',
];

export function getAllianceDuelDetailSummary(): string {
  const dayBreakdown = DUEL_DAY_DETAILS.map(d => {
    const actions = d.key_actions.slice(0, 4).join(', ');
    const save = d.save_for_this_day.slice(0, 3).join(', ');
    return `Day ${d.day} — ${d.name} (${d.victory_points} VP | Double-dip: ${d.double_dip_rating})\n  Key actions: ${actions}\n  Save for this day: ${save}\n  Prep day before: ${d.prep_day_before[0]}\n  Note: ${d.notes}`;
  }).join('\n\n');

  const tips = DUEL_ADVANCED_TIPS.slice(0, 5).join('\n');

  return `
## Alliance Duel VS — Deep Strategy Guide

### Schedule
${VICTORY_POINT_STRUCTURE.schedule}. Reset ${VICTORY_POINT_STRUCTURE.reset_time}.
VP per day: Day 1=1, Day 2=2, Day 3=2, Day 4=2, Day 5=2, Day 6=4 (total 13 possible)

### Day-by-Day Breakdown
${dayBreakdown}

### Research Priority
${DUEL_RESEARCH_GUIDE.priority_order.join('\n')}
Timing: ${DUEL_RESEARCH_GUIDE.timing_tip}

### Advanced Tips
${tips}
`.trim();
}