// src/lib/lwtWeeklyPassData.ts
// Last War: Survival — Weekly & Recurring Pass Data
// For: Pack Scanner foundation + Briefing context
// Built: March 11, 2026 (session 11)

export interface PassItem {
  name: string;
  quantity: string;
  notes?: string;
}

export interface PassTier {
  tier: 'free' | 'paid';
  price?: string;
  items: PassItem[];
}

export interface PassData {
  id: string;
  name: string;
  shortName: string;
  resetCycle: 'weekly' | 'biweekly' | 'monthly' | 'season';
  resetDay?: string; // e.g. "Monday" for weekly passes
  tiers: PassTier[];
  valueRating: Record<string, string>; // spend tier → rating
  buyRecommendation: Record<string, 'buy' | 'skip' | 'situational'>; // spend tier → rec
  notes: string;
  keyItems: string[]; // headline items worth calling out
}

// ─── TRAINING PASS ───────────────────────────────────────────────────────────
const trainingPass: PassData = {
  id: 'training_pass',
  name: 'Training Pass',
  shortName: 'Training Pass',
  resetCycle: 'weekly',
  resetDay: 'Monday',
  tiers: [
    {
      tier: 'free',
      items: [
        { name: 'Training Speedup (1h)', quantity: '50', notes: 'Claimed daily over 7 days' },
        { name: 'Training Speedup (8h)', quantity: '10' },
        { name: 'Food', quantity: '~50M' },
        { name: 'Iron', quantity: '~50M' },
      ]
    },
    {
      tier: 'paid',
      price: '$4.99',
      items: [
        { name: 'Training Speedup (1h)', quantity: '200' },
        { name: 'Training Speedup (8h)', quantity: '50' },
        { name: 'Training Speedup (24h)', quantity: '15' },
        { name: 'Food', quantity: '~200M' },
        { name: 'Iron', quantity: '~200M' },
        { name: 'Gold', quantity: '~100M' },
        { name: 'Troop EXP (large)', quantity: '20' },
      ]
    }
  ],
  valueRating: {
    f2p: 'S — Best free speedup source in the game',
    budget: 'S — $4.99 paid tier is best $/speedup ratio',
    mid: 'A — Still strong, outclassed by bundle events',
    investor: 'B — Small relative to bundle packs but always worth it',
  },
  buyRecommendation: {
    f2p: 'buy',
    budget: 'buy',
    mid: 'buy',
    investor: 'buy',
  },
  notes: 'Training Pass free tier is one of the best always-available F2P resources in the game. The paid tier at $4.99 has the best cost-per-speedup-hour ratio of any recurring offer. Always buy if you are spending anything. Speedups are the #1 bottleneck for troop training at every level.',
  keyItems: ['Training Speedup (1h)', 'Training Speedup (8h)', 'Training Speedup (24h)'],
};

// ─── DRONE PASS ──────────────────────────────────────────────────────────────
const dronePass: PassData = {
  id: 'drone_pass',
  name: 'Drone Pass',
  shortName: 'Drone Pass',
  resetCycle: 'weekly',
  resetDay: 'Monday',
  tiers: [
    {
      tier: 'free',
      items: [
        { name: 'Drone EXP (small)', quantity: '30' },
        { name: 'Drone EXP (medium)', quantity: '10' },
        { name: 'Drone Parts', quantity: '5' },
      ]
    },
    {
      tier: 'paid',
      price: '$4.99',
      items: [
        { name: 'Drone EXP (small)', quantity: '100' },
        { name: 'Drone EXP (medium)', quantity: '50' },
        { name: 'Drone EXP (large)', quantity: '10' },
        { name: 'Drone Parts', quantity: '20' },
        { name: 'Drone Blueprint', quantity: '3', notes: 'Rare crafting material' },
        { name: 'Speed Drone (1h)', quantity: '5' },
      ]
    }
  ],
  valueRating: {
    f2p: 'A — Free tier Drone EXP is scarce, take it',
    budget: 'A — Paid tier is the primary Drone EXP source for budget players',
    mid: 'A — Drone levels 1–150 are fast; 150–300 are speedup-gated. This helps.',
    investor: 'B — Whale territory has better Drone EXP sources but this is consistent',
  },
  buyRecommendation: {
    f2p: 'buy',
    budget: 'buy',
    mid: 'buy',
    investor: 'situational',
  },
  notes: 'Drone EXP is scarce relative to demand. The Drone Pass paid tier is the most consistent weekly source of Drone EXP outside events. Drone skills at L31/51/71/91/111 provide meaningful combat buffs — don\'t neglect drone leveling. Wall unlock at L250 requires Tactical Weapon research first. Blueprints from the paid tier are rare and needed for drone crafting.',
  keyItems: ['Drone EXP (large)', 'Drone Blueprint', 'Drone Parts'],
};

// ─── OVERLORD PASS ───────────────────────────────────────────────────────────
const overlordPass: PassData = {
  id: 'overlord_pass',
  name: 'Overlord Pass',
  shortName: 'Overlord Pass',
  resetCycle: 'weekly',
  resetDay: 'Monday',
  tiers: [
    {
      tier: 'free',
      items: [
        { name: 'Overlord EXP', quantity: '5,000' },
        { name: 'Overlord Item Fragments', quantity: '20' },
        { name: 'Overlord Coins', quantity: '50' },
      ]
    },
    {
      tier: 'paid',
      price: '$4.99',
      items: [
        { name: 'Overlord EXP', quantity: '25,000' },
        { name: 'Overlord Item Fragments', quantity: '100' },
        { name: 'Overlord Coins', quantity: '200' },
        { name: 'Overlord Skill Book', quantity: '1', notes: 'Rare — needed for skill upgrades' },
        { name: 'Overlord Enhancement Stone', quantity: '5' },
      ]
    }
  ],
  valueRating: {
    f2p: 'B — Only relevant after Day 89 S2 when Overlord unlocks',
    budget: 'A — Overlord Skill Books are rare; this is the best recurring source',
    mid: 'A — Overlord scaling is massive; EXP + skill books compound over time',
    investor: 'A — Overlord is a primary combat multiplier; max it fast',
  },
  buyRecommendation: {
    f2p: 'situational',
    budget: 'buy',
    mid: 'buy',
    investor: 'buy',
  },
  notes: 'Only relevant after Overlord Gorilla unlocks on Day 89 of Season 2. Before that point, skip entirely. After unlock: Overlord is a massive combat force multiplier — training it costs Iron + Food + Gold and EXP. Skill priority: Brutal Roar → Overlord\'s Armor → Furious Hunt → Riot Shot → Expert Overlord. Skill Books are the hardest resource to accumulate. The paid tier\'s Skill Book alone justifies $4.99 weekly once Overlord is active. NOTE: Alliance Duel VS Day 5 rule — do NOT deploy Overlord in base defense on Day 5 of Alliance Duel (opponents can capture it).',
  keyItems: ['Overlord Skill Book', 'Overlord EXP', 'Overlord Coins'],
};

// ─── ALLIANCE PASS ───────────────────────────────────────────────────────────
const alliancePass: PassData = {
  id: 'alliance_pass',
  name: 'Alliance Pass',
  shortName: 'Alliance Pass',
  resetCycle: 'weekly',
  resetDay: 'Monday',
  tiers: [
    {
      tier: 'free',
      items: [
        { name: 'Alliance Technology Points', quantity: '2,000' },
        { name: 'Alliance Coins', quantity: '100' },
        { name: 'Alliance Gift Box (small)', quantity: '5' },
      ]
    },
    {
      tier: 'paid',
      price: '$4.99',
      items: [
        { name: 'Alliance Technology Points', quantity: '10,000' },
        { name: 'Alliance Coins', quantity: '500' },
        { name: 'Alliance Gift Box (large)', quantity: '10' },
        { name: 'Alliance Resource Pack', quantity: '5', notes: 'Iron + Food bundles' },
        { name: 'Alliance Speedup (1h)', quantity: '10', notes: 'Separate from training speedups' },
      ]
    }
  ],
  valueRating: {
    f2p: 'B — Alliance tech compounds over time but not urgent weekly spend',
    budget: 'B — Lower priority than Training/Drone/Overlord passes',
    mid: 'B — Valuable for R4/R5 players managing alliance-wide tech',
    investor: 'B — Buy if maxing everything, but last priority of the weekly passes',
  },
  buyRecommendation: {
    f2p: 'skip',
    budget: 'situational',
    mid: 'situational',
    investor: 'buy',
  },
  notes: 'Alliance Pass has the lowest individual impact of the four weekly passes. Alliance tech does compound, but you benefit from your whole alliance\'s contributions — your personal pass matters less. For F2P and budget players: prioritize Training → Drone → Overlord passes first. Only add Alliance Pass if you have spare budget. For R4/R5 or Investor players: buy all four, Alliance Pass included. Alliance Coins from paid tier unlock useful items in Alliance Store.',
  keyItems: ['Alliance Technology Points', 'Alliance Coins', 'Alliance Gift Box (large)'],
};

// ─── BATTLE PASS ─────────────────────────────────────────────────────────────
// Not weekly — seasonal. Included here because it's a recurring purchase decision.
const battlePass: PassData = {
  id: 'battle_pass',
  name: 'Battle Pass',
  shortName: 'Battle Pass',
  resetCycle: 'season',
  tiers: [
    {
      tier: 'free',
      items: [
        { name: 'Diamonds', quantity: '~500', notes: 'Spread over season tasks' },
        { name: 'Speedups (mixed)', quantity: 'varies' },
        { name: 'Resources', quantity: 'varies' },
      ]
    },
    {
      tier: 'paid',
      price: '~$9.99',
      items: [
        { name: 'Profession Change Certificate', quantity: '1', notes: 'CRITICAL — only free source to switch professions' },
        { name: 'Diamonds', quantity: '~2,000' },
        { name: 'Speedups (large)', quantity: 'significant' },
        { name: 'VIP Points', quantity: 'varies' },
        { name: 'Hero Shards / Skill Medals', quantity: 'varies' },
        { name: 'Season-exclusive items', quantity: 'varies' },
      ]
    }
  ],
  valueRating: {
    f2p: 'S — Profession Change Certificate alone worth it if you want to switch Engineer ↔ War Leader',
    budget: 'S — Best $/value seasonal purchase in the game',
    mid: 'S — Always buy',
    investor: 'S — Always buy',
  },
  buyRecommendation: {
    f2p: 'buy',
    budget: 'buy',
    mid: 'buy',
    investor: 'buy',
  },
  notes: 'Battle Pass is the best-value purchase in the game regardless of spend tier. The Profession Change Certificate (paid tier) is the ONLY free way to switch between Engineer and War Leader without paying diamonds. Hybrid strategy: start Engineer in early season for building speed, use the certificate to switch to War Leader for mid-season PvP. Diamond income from paid tier helps offset other costs. Always buy on day 1 of season — tasks accumulate retroactively.',
  keyItems: ['Profession Change Certificate', 'Diamonds', 'Hero Shards'],
};

// ─── AGGREGATE EXPORTS ────────────────────────────────────────────────────────

export const ALL_PASSES: PassData[] = [
  trainingPass,
  dronePass,
  overlordPass,
  alliancePass,
  battlePass,
];

export const WEEKLY_PASSES: PassData[] = [
  trainingPass,
  dronePass,
  overlordPass,
  alliancePass,
];

export function getPassById(id: string): PassData | undefined {
  return ALL_PASSES.find(p => p.id === id);
}

// Spend tier mapping from profile data
const SPEND_TIER_MAP: Record<string, string> = {
  f2p: 'f2p',
  budget: 'budget',
  mid: 'mid',
  high: 'mid',
  investor: 'investor',
};

export function getPassRecommendationsForTier(spendTier: string): Array<{
  pass: PassData;
  recommendation: string;
  rating: string;
  shouldBuy: boolean;
}> {
  const tier = SPEND_TIER_MAP[spendTier] ?? 'budget';
  return ALL_PASSES.map(pass => ({
    pass,
    recommendation: pass.buyRecommendation[tier] ?? 'situational',
    rating: pass.valueRating[tier] ?? 'B',
    shouldBuy: pass.buyRecommendation[tier] === 'buy',
  }));
}

export function getWeeklyPassSummary(): string {
  return `
WEEKLY & RECURRING PASSES:

TRAINING PASS (~$4.99/week):
- Free tier: 50x 1h speedups + 10x 8h speedups weekly. Always claim.
- Paid tier: 200x 1h + 50x 8h + 15x 24h training speedups + heavy resources.
- Best cost-per-speedup-hour ratio of any recurring offer. Buy if spending anything.
- Recommendation: BUY for all tiers F2P–Investor. Training speedups are always the bottleneck.

DRONE PASS (~$4.99/week):
- Free tier: Drone EXP + Parts weekly.
- Paid tier: Large Drone EXP + Blueprints (rare) + Speed Drones.
- Drone skills at L31/51/71/91/111 give combat buffs. Drone EXP is scarce.
- Wall unlock at L250 requires Tactical Weapon research first.
- Recommendation: BUY F2P–Mid. Situational for Investor.

OVERLORD PASS (~$4.99/week):
- Only matters after Day 89 S2 when Overlord Gorilla unlocks. Skip before then.
- Paid tier: Overlord Skill Books (RARE), EXP, Enhancement Stones.
- Skill Books are the hardest Overlord resource. This pass is best recurring source.
- Skill priority: Brutal Roar → Overlord's Armor → Furious Hunt → Riot Shot → Expert Overlord.
- WARNING: Do NOT deploy Overlord in base defense on Alliance Duel Day 5.
- Recommendation: BUY budget–Investor once Overlord is unlocked.

ALLIANCE PASS (~$4.99/week):
- Lowest priority of the four. Alliance tech compounds but alliance-wide contributions matter more.
- Recommendation: SKIP F2P. Situational budget/mid. BUY Investor.
- Buy order: Training → Drone → Overlord → Alliance.

BATTLE PASS (~$9.99/season):
- Best value purchase in the game. Always buy on Day 1 (tasks accumulate retroactively).
- KEY ITEM: Profession Change Certificate (paid tier) — only free way to switch Engineer ↔ War Leader.
- Hybrid strategy: start season as Engineer → use certificate → switch to War Leader for PvP.
- Recommendation: BUY all tiers. Non-negotiable if spending anything.
`.trim();
}