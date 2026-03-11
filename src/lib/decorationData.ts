/**
 * Decoration data — extracted from guardian-outfitter.com/Last_War_Data_Public.xlsx
 * Decorations provide Attack, Defense, HP, Crit Dmg, Skill Dmg, DR, and March Size bonuses.
 * Cost is in Decoration Points (Deco).
 * Each decoration has up to 7 levels.
 */

export interface DecoLevel {
  level: number;
  decoCost: number;
  attack: number | null;
  defense: number | null;
  hp: number | null;
  critDmg: number | null;     // percentage e.g. 1.5 = 1.5%
  skillDmg: number | null;
  dr: number | null;
  marchSize: number | null;
}

export interface Decoration {
  name: string;
  levels: DecoLevel[];
}

export const DECORATIONS: Decoration[] = [
  {
    name: "Happy Turkey",
    levels: [
      { level: 1, decoCost: 150,   attack: 267,  defense: null, hp: null, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 2, decoCost: 300,   attack: 535,  defense: null, hp: null, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 3, decoCost: 900,   attack: 1071, defense: null, hp: null, critDmg: 1.5,  skillDmg: null, dr: null, marchSize: null },
      { level: 4, decoCost: 2700,  attack: 2000, defense: null, hp: null, critDmg: 2,    skillDmg: null, dr: null, marchSize: null },
      { level: 5, decoCost: 8100,  attack: 3000, defense: null, hp: null, critDmg: 3,    skillDmg: null, dr: null, marchSize: null },
      { level: 6, decoCost: 24300, attack: 4750, defense: null, hp: null, critDmg: 4,    skillDmg: null, dr: null, marchSize: null },
      { level: 7, decoCost: 72900, attack: 6500, defense: null, hp: null, critDmg: 5,    skillDmg: null, dr: null, marchSize: null },
    ]
  },
  {
    name: "Colorful Christmas Tree",
    levels: [
      { level: 1, decoCost: 150,   attack: 300,  defense: null, hp: null, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 2, decoCost: 300,   attack: 600,  defense: null, hp: null, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 3, decoCost: 900,   attack: 1000, defense: null, hp: null, critDmg: 1.5,  skillDmg: null, dr: null, marchSize: null },
      { level: 4, decoCost: 2700,  attack: 2000, defense: null, hp: null, critDmg: 2,    skillDmg: null, dr: null, marchSize: null },
      { level: 5, decoCost: 8100,  attack: 3000, defense: null, hp: null, critDmg: 3,    skillDmg: null, dr: null, marchSize: null },
      { level: 6, decoCost: 24300, attack: 4750, defense: null, hp: null, critDmg: 4,    skillDmg: null, dr: null, marchSize: null },
      { level: 7, decoCost: 72900, attack: 6500, defense: null, hp: null, critDmg: 5,    skillDmg: null, dr: null, marchSize: null },
    ]
  },
  {
    name: "Bunny",
    levels: [
      { level: 1, decoCost: 150,   attack: null, defense: 267,  hp: null, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 2, decoCost: 300,   attack: null, defense: 535,  hp: null, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 3, decoCost: 900,   attack: null, defense: 1071, hp: null, critDmg: 1.5,  skillDmg: null, dr: null, marchSize: null },
      { level: 4, decoCost: 2700,  attack: null, defense: 2000, hp: null, critDmg: 2,    skillDmg: null, dr: null, marchSize: null },
      { level: 5, decoCost: 8100,  attack: null, defense: 3000, hp: null, critDmg: 3,    skillDmg: null, dr: null, marchSize: null },
      { level: 6, decoCost: 24300, attack: null, defense: 4750, hp: null, critDmg: 4,    skillDmg: null, dr: null, marchSize: null },
      { level: 7, decoCost: 72900, attack: null, defense: 6500, hp: null, critDmg: 5,    skillDmg: null, dr: null, marchSize: null },
    ]
  },
  {
    name: "Shrine",
    levels: [
      { level: 1, decoCost: 150,   attack: null, defense: null, hp: 5000,  critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 2, decoCost: 300,   attack: null, defense: null, hp: 10000, critDmg: null, skillDmg: null, dr: null, marchSize: null },
      { level: 3, decoCost: 900,   attack: null, defense: null, hp: 20000, critDmg: 1.5,  skillDmg: null, dr: null, marchSize: null },
      { level: 4, decoCost: 2700,  attack: null, defense: null, hp: 37500, critDmg: 2,    skillDmg: null, dr: null, marchSize: null },
      { level: 5, decoCost: 8100,  attack: null, defense: null, hp: 56250, critDmg: 3,    skillDmg: null, dr: null, marchSize: null },
      { level: 6, decoCost: 24300, attack: null, defense: null, hp: 89000, critDmg: 4,    skillDmg: null, dr: null, marchSize: null },
      { level: 7, decoCost: 72900, attack: null, defense: null, hp: 122000,critDmg: 5,    skillDmg: null, dr: null, marchSize: null },
    ]
  },
];

// Decoration cost tiers — same pattern across most decorations
export const DECO_COST_TIERS = [150, 300, 900, 2700, 8100, 24300, 72900];
export const DECO_TOTAL_COST_MAX = 109350; // sum L1-L7

/**
 * Key insight for Buddy: Decorations primarily give Attack, Defense, or HP —
 * each decoration specializes in one stat. Crit Dmg bonus starts at L3 for all.
 * Cost scales 3x per level (150 → 300 → 900 → 2700 → 8100 → 24300 → 72900).
 * Full max (L7) costs 72,900 deco points per decoration.
 */
export function getDecorationSummary(): string {
  return `## Decoration System
Decorations provide base stat bonuses and are placed in your base for passive combat buffs.
Each decoration specializes in one primary stat: Attack, Defense, or HP.
All decorations also add Crit Dmg starting at Level 3.

Cost pattern (same for all decorations):
- L1: 150 deco points | L2: 300 | L3: 900 | L4: 2,700 | L5: 8,100 | L6: 24,300 | L7: 72,900
- Total to max one decoration: 109,350 deco points

Stat ranges at max level (L7):
- Attack decos: +6,500 Attack, +5% Crit Dmg
- Defense decos: +6,500 Defense, +5% Crit Dmg  
- HP decos: +122,000 HP, +5% Crit Dmg

Key advice: Focus on maxing one decoration type before spreading points. 
Attack decos benefit Fighter/PVP players most. Defense/HP decos benefit developers and base defenders.
Crit Dmg from L3+ is valuable regardless of playstyle — prioritize getting decos to at least L3.`;
}