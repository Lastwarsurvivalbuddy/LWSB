/**
 * gearData.ts
 * Last War: Survival — Gear Upgrade & Star Promotion Data
 *
 * Source: lastwarhandbook.com/calculators/gear (verified March 6, 2026)
 * Star promotion costs: dracgon.tech (verified March 11, 2026) ✅
 *
 * CONFIRMED facts:
 *   - UR (Legendary) max level: 40
 *   - SSR (Epic) max level: 30
 *   - SR (Rare) max level: 15
 *   - Level upgrades cost: Gold + Upgrade Ore
 *   - Star promotions cost: Gold + Upgrade Ore + Dielectric Ceramic + Blueprints
 *   - 0★→1★: 93.6M gold, 62.5K ore, 200 ceramic, 10 Legendary BP ✅
 *   - 1★→2★: 121.6M gold, 81K ore, 400 ceramic, 20 Legendary BP ✅
 *   - 2★→3★: 150M gold, 100K ore, 600 ceramic, 30 Legendary BP, 5 Mythic BP ✅
 *   - 3★→4★: 178M gold, 118.5K ore, 800 ceramic, 40 Legendary BP, 10 Mythic BP ✅
 *   - 4★→5★: 51.5M gold, 27.5K ore, 250 ceramic (Mythic tier transition) ✅
 *   - Total 0★→4★: 100 Legendary Blueprints ✅
 *   - Level 20 Gear Factory required for star promotions
 *   - UR gear: L0→L25 = 12,150,000 gold + 80,400 ore ✅
 */

// ============================================================
// GEAR TIERS
// ============================================================

export type GearTier = 'UR' | 'SSR' | 'SR';

export const GEAR_MAX_LEVEL: Record<GearTier, number> = {
  UR:  40,
  SSR: 30,
  SR:  15,
};

// ============================================================
// STAR PROMOTION BLUEPRINTS
// ============================================================

/** Legendary Blueprint cost per star promotion step ✅ confirmed dracgon.tech */
export const LEGENDARY_BP_PER_STAR: Record<number, number> = {
  1: 10,  // 0★ → 1★
  2: 20,  // 1★ → 2★
  3: 30,  // 2★ → 3★
  4: 40,  // 3★ → 4★
};

/** Total Legendary Blueprints for 0★ → 4★: 10+20+30+40 = 100 ✅ confirmed */
export const TOTAL_LEGENDARY_BP_TO_4STAR = 100;

/** 5★ promotion requires Mythic Blueprints (completely different item) */
export const MYTHIC_BP_FOR_5STAR = 10; // ✅ confirmed

/**
 * 4★ → 5★ promotion costs (Mythic tier transition) ✅ CONFIRMED dracgon.tech
 */
export const STAR_5_PROMOTION_COST = {
  gold:              51_500_000,
  upgradeOre:        27_500,
  dielectricCeramic: 250,
};

// ============================================================
// LEVEL UPGRADE COSTS — CONFIRMED ANCHOR POINTS
// ============================================================

/**
 * UR gear level upgrade costs.
 * CONFIRMED: L0→L25 = 12,150,000 gold, 80,400 ore ✅
 * All other values are ESTIMATES until per-level table is scraped.
 */
export const UR_CUMULATIVE_GOLD: Record<number, number> = {
  0:  0,
  5:  800_000,
  10: 2_100_000,
  15: 4_200_000,
  20: 7_500_000,
  25: 12_150_000,  // ✅ CONFIRMED
  30: 19_000_000,
  35: 29_000_000,
  40: 44_000_000,
};

export const UR_CUMULATIVE_ORE: Record<number, number> = {
  0:  0,
  5:  5_300,
  10: 13_800,
  15: 27_500,
  20: 50_000,
  25: 80_400,      // ✅ CONFIRMED
  30: 125_000,
  35: 190_000,
  40: 290_000,
};

export function getURGoldCost(fromLevel: number, toLevel: number): number {
  return interpolateCost(UR_CUMULATIVE_GOLD, fromLevel, toLevel);
}

export function getUROreCost(fromLevel: number, toLevel: number): number {
  return interpolateCost(UR_CUMULATIVE_ORE, fromLevel, toLevel);
}

function interpolateCost(
  table: Record<number, number>,
  from: number,
  to: number
): number {
  const levels = Object.keys(table).map(Number).sort((a, b) => a - b);

  function getCumulative(level: number): number {
    if (table[level] !== undefined) return table[level];
    const lower = levels.filter(l => l <= level).pop() ?? 0;
    const upper = levels.find(l => l >= level) ?? levels[levels.length - 1];
    if (lower === upper) return table[lower];
    const ratio = (level - lower) / (upper - lower);
    return Math.round(table[lower] + ratio * (table[upper] - table[lower]));
  }

  return Math.max(0, getCumulative(to) - getCumulative(from));
}

// ============================================================
// STAR PROMOTION COSTS — ALL CONFIRMED ✅ dracgon.tech March 11, 2026
// ============================================================

export const STAR_PROMOTION_COSTS: Record<number, {
  gold: number;
  upgradeOre: number;
  dielectricCeramic: number;
  legendaryBlueprints?: number;
  mythicBlueprints?: number;
  confirmed: boolean;
}> = {
  1: { gold: 93_600_000,  upgradeOre: 62_500,  dielectricCeramic: 200, legendaryBlueprints: 10, confirmed: true },
  2: { gold: 121_600_000, upgradeOre: 81_000,  dielectricCeramic: 400, legendaryBlueprints: 20, confirmed: true },
  3: { gold: 150_000_000, upgradeOre: 100_000, dielectricCeramic: 600, legendaryBlueprints: 30, mythicBlueprints: 5,  confirmed: true },
  4: { gold: 178_000_000, upgradeOre: 118_500, dielectricCeramic: 800, legendaryBlueprints: 40, mythicBlueprints: 10, confirmed: true },
  5: { gold: 51_500_000,  upgradeOre: 27_500,  dielectricCeramic: 250, confirmed: true },
};

// ============================================================
// RESOURCES
// ============================================================

export const GEAR_RESOURCES = {
  levelUpgrade: ['Gold', 'Upgrade Ore'],
  starPromotion: ['Gold', 'Upgrade Ore', 'Dielectric Ceramic', 'Blueprints (Legendary 1–4★ / Mythic 5★)'],
};

export const GEAR_FACTORY_NOTE = 'Level 20 Gear Factory required for star promotions.';

// ============================================================
// STRATEGY NOTES
// ============================================================

export const GEAR_STRATEGY_NOTES = [
  'UR gear is the only tier that can reach 5★ Mythic — always prioritize UR.',
  '100 Legendary Blueprints needed for 0★→4★. Plan carefully before spending.',
  'Mythic Blueprints (for 5★) are rare and different from Legendary Blueprints.',
  'Gear Factory must be level 20 before any star promotions are available.',
  'Dielectric Ceramic is required for every star promotion step.',
  '2★→3★ and 3★→4★ also require Mythic Blueprints (5 and 10 respectively).',
];

// ============================================================
// BUDDY SUMMARY
// ============================================================

export function getGearSummary(): string {
  return `
GEAR SYSTEM:
- Tiers: UR (Legendary, max L40), SSR (Epic, max L30), SR (Rare, max L15).
- Level upgrades cost Gold + Upgrade Ore only.
- Star promotions (0★–5★) cost Gold + Upgrade Ore + Dielectric Ceramic + Blueprints.
- Requires Level 20 Gear Factory for any star promotion.
- Only UR gear can reach 5★ — always prioritize UR upgrades.
- UR L0→L25 costs ~12.15M gold and ~80.4K ore.

Star promotion costs (UR) — ALL CONFIRMED:
  0★→1★: 93.6M gold · 62.5K ore · 200 ceramic · 10 Legendary BP
  1★→2★: 121.6M gold · 81K ore · 400 ceramic · 20 Legendary BP
  2★→3★: 150M gold · 100K ore · 600 ceramic · 30 Legendary BP · 5 Mythic BP
  3★→4★: 178M gold · 118.5K ore · 800 ceramic · 40 Legendary BP · 10 Mythic BP
  4★→5★: 51.5M gold · 27.5K ore · 250 ceramic (Mythic tier transition — no BPs)

Total 0★→4★: ~543M gold · ~362K ore · 2,000 ceramic · 100 Legendary BP · 15 Mythic BP
Note: 2★→3★ and 3★→4★ also require Mythic BPs — save them carefully.
Blueprint gating: save Legendary BPs for carry gear, Mythic BPs for absolute best piece.
`.trim();
}

// ============================================================
// VERIFY
// ============================================================

export function verify(): boolean {
  const totalBP = Object.values(LEGENDARY_BP_PER_STAR).reduce((a, b) => a + b, 0);
  console.log(`0★→4★ Legendary BPs: ${totalBP} | expected: 100 | ${totalBP === 100 ? '✅' : '❌'}`);

  const s1 = STAR_PROMOTION_COSTS[1];
  console.log(`0★→1★ gold: ${s1.gold.toLocaleString()} | expected: 93,600,000 | ${s1.gold === 93_600_000 ? '✅' : '❌'}`);

  const s5 = STAR_PROMOTION_COSTS[5];
  console.log(`4★→5★ gold: ${s5.gold.toLocaleString()} | expected: 51,500,000 | ${s5.gold === 51_500_000 ? '✅' : '❌'}`);

  const l0to25gold = getURGoldCost(0, 25);
  console.log(`UR L0→25 gold: ${l0to25gold.toLocaleString()} | expected: 12,150,000 | ${l0to25gold === 12_150_000 ? '✅' : '❌'}`);

  return totalBP === 100 && s1.gold === 93_600_000 && s5.gold === 51_500_000 && l0to25gold === 12_150_000;
}