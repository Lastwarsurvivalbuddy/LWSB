/**
 * M5-A Armament System — T11 exclusive upgrade system
 * Extracted from guardian-outfitter.com/Last_War_Data_Public.xlsx
 *
 * 4 armament slots: Railgun, Data Chip, Radar, Armor
 * Each has its own upgrade track with Gold + Upgrade Ore costs.
 * Provides Hero Attack, Hero Defense, Crit Rate bonuses.
 * Bonus Hero Attack and Bonus Crit Rate unlock at higher levels.
 *
 * REQUIRES: T11 troops unlocked (HQ 31+)
 */

export interface ArmamentLevel {
  level: number;
  power: number;
  gold: number;
  upgradeOre: number;
  heroAttack: number;
  heroDefense: number;
  critRate: number;        // as decimal e.g. 0.05 = 5%
  boostHeroAttack: number; // as decimal
  bonusHeroAttack?: number;
  bonusCritRate?: number;
}

export const M5A_RAILGUN: ArmamentLevel[] = [
  { level: 0,  power: 31059,  gold: 0,       upgradeOre: 0,    heroAttack: 895,  heroDefense: 119, critRate: 0.050, boostHeroAttack: 0.0250 },
  { level: 1,  power: 32612,  gold: 225000,  upgradeOre: 1500, heroAttack: 940,  heroDefense: 125, critRate: 0.0525,boostHeroAttack: 0.0262 },
  { level: 2,  power: 34165,  gold: 225000,  upgradeOre: 1500, heroAttack: 985,  heroDefense: 131, critRate: 0.055, boostHeroAttack: 0.0275 },
  { level: 3,  power: 35718,  gold: 225000,  upgradeOre: 1500, heroAttack: 1030, heroDefense: 137, critRate: 0.0575,boostHeroAttack: 0.0288 },
  { level: 4,  power: 37270,  gold: 225000,  upgradeOre: 1500, heroAttack: 1075, heroDefense: 143, critRate: 0.060, boostHeroAttack: 0.0300 },
  { level: 5,  power: 38824,  gold: 337500,  upgradeOre: 2200, heroAttack: 1119, heroDefense: 149, critRate: 0.0625,boostHeroAttack: 0.0312 },
  { level: 6,  power: 40377,  gold: 337500,  upgradeOre: 2200, heroAttack: 1164, heroDefense: 155, critRate: 0.065, boostHeroAttack: 0.0325 },
  { level: 7,  power: 41929,  gold: 337500,  upgradeOre: 2200, heroAttack: 1209, heroDefense: 161, critRate: 0.0675,boostHeroAttack: 0.0338 },
  { level: 8,  power: 43482,  gold: 337500,  upgradeOre: 2200, heroAttack: 1254, heroDefense: 167, critRate: 0.070, boostHeroAttack: 0.0350 },
  { level: 9,  power: 45035,  gold: 450000,  upgradeOre: 3000, heroAttack: 1299, heroDefense: 173, critRate: 0.0725,boostHeroAttack: 0.0362 },
  { level: 10, power: 49713,  gold: 450000,  upgradeOre: 3000, heroAttack: 1343, heroDefense: 179, critRate: 0.075, boostHeroAttack: 0.0375, bonusHeroAttack: 250 },
  { level: 11, power: 51266,  gold: 450000,  upgradeOre: 3000, heroAttack: 1388, heroDefense: 185, critRate: 0.0775,boostHeroAttack: 0.0388, bonusHeroAttack: 250 },
  { level: 12, power: 52819,  gold: 450000,  upgradeOre: 3000, heroAttack: 1433, heroDefense: 191, critRate: 0.080, boostHeroAttack: 0.0400, bonusHeroAttack: 250 },
  { level: 13, power: 54372,  gold: 562500,  upgradeOre: 3700, heroAttack: 1478, heroDefense: 197, critRate: 0.0825,boostHeroAttack: 0.0412, bonusHeroAttack: 250 },
  { level: 14, power: 55925,  gold: 562500,  upgradeOre: 3700, heroAttack: 1522, heroDefense: 203, critRate: 0.085, boostHeroAttack: 0.0425, bonusHeroAttack: 250 },
  { level: 15, power: 57489,  gold: 562500,  upgradeOre: 3700, heroAttack: 1567, heroDefense: 209, critRate: 0.0875,boostHeroAttack: 0.0438, bonusHeroAttack: 250 },
  { level: 16, power: 59042,  gold: 562500,  upgradeOre: 3700, heroAttack: 1612, heroDefense: 215, critRate: 0.090, boostHeroAttack: 0.0450, bonusHeroAttack: 250 },
  { level: 17, power: 60595,  gold: 675000,  upgradeOre: 4500, heroAttack: 1657, heroDefense: 221, critRate: 0.0925,boostHeroAttack: 0.0462, bonusHeroAttack: 250 },
  { level: 18, power: 62148,  gold: 675000,  upgradeOre: 4500, heroAttack: 1702, heroDefense: 227, critRate: 0.095, boostHeroAttack: 0.0475, bonusHeroAttack: 250 },
  { level: 19, power: 63701,  gold: 675000,  upgradeOre: 4500, heroAttack: 1747, heroDefense: 233, critRate: 0.0975,boostHeroAttack: 0.0488, bonusHeroAttack: 250 },
  { level: 20, power: 65254,  gold: 675000,  upgradeOre: 4500, heroAttack: 1792, heroDefense: 239, critRate: 0.100, boostHeroAttack: 0.0500, bonusHeroAttack: 500 },
];

// Cost totals for Railgun L0→L20
export const RAILGUN_TOTAL = {
  gold: 9675000,
  upgradeOre: 64300,
};

/**
 * Summary for Buddy system prompt injection
 */
export function getArmamentSummary(): string {
  return `## M5-A Armament System (T11 Only — HQ 31+)
The M5-A Armament system is exclusive to T11 players. It has 4 upgrade slots:
- M5-A "Thor" Railgun — Hero Attack + Crit Rate focused
- M5-A Data Chip — secondary stats
- M5-A Radar — secondary stats  
- M5-A Armor — Hero Defense focused

Each armament upgrades from Level 0 to 20+.
Resources required: Gold + Upgrade Ore.

Railgun cost reference (most important slot):
- L0→L4: 225,000 gold + 1,500 ore per level
- L5→L8: 337,500 gold + 2,200 ore per level
- L9→L12: 450,000 gold + 3,000 ore per level
- L13→L16: 562,500 gold + 3,700 ore per level
- L17→L20: 675,000 gold + 4,500 ore per level
- Total L0→L20: ~9.7M gold + 64,300 Upgrade Ore

Railgun stat gains per level: +45 Hero Attack, +6 Hero Defense, +0.25% Crit Rate.
Bonus Hero Attack unlocks at Level 10 (+250 flat attack, scaling up).

For T11 players: Armament upgrades are the primary power growth lever after T11 troops are training.
Upgrade Ore is the bottleneck — same resource used for gear upgrades. Prioritize Railgun first.`;
}