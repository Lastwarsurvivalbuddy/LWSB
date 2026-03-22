// src/lib/lwtCombatFormulasData.ts
// Combat math, damage formulas, morale system, effective power calculation
// Source: lastwarhandbook.com/guides/combat-formulas-power-optimization-guide
// Built: March 22, 2026 (session 58)

export const COMBAT_FORMULAS_OVERVIEW = `
COMBAT MATH — WHY IT MATTERS:
Understanding the formulas behind combat lets you win battles against opponents with higher displayed power.

KEY INSIGHT: A 3.5M power player with optimal bonuses fights like 12.5M effective power (356% increase).
Smart players maximize effective power through type advantage, morale management, lineup bonuses, and equipment.

DISPLAYED POWER ≠ EFFECTIVE POWER.
The player who understands the math wins — not necessarily the player with the bigger number.
`;

export const COMBAT_DAMAGE_FORMULA = `
COMBAT — COMPLETE DAMAGE FORMULA:

Final Damage = Base ATK × Skill Multiplier × Type Advantage × Morale Bonus × Equipment Bonus × Set Bonus × (1 - Enemy DEF Reduction)

COMPONENT BREAKDOWN:
| Component | Typical Range | Description |
|-----------|--------------|-------------|
| Base ATK | 1,000–50,000+ | Hero base ATK + (Troop ATK × Troop Count) |
| Skill Multiplier | 100%–500%+ | Hero skill damage percentage — increases with skill level |
| Type Advantage | 0.8x–1.2x | Troop type counter bonus/penalty |
| Morale Bonus | 1.0x–3.0x | Morale advantage multiplier (see morale section) |
| Equipment Bonus | 1.0x–2.0x+ | Gear stat contributions |
| Set Bonus | 1.0x–1.2x | Troop type lineup bonuses |
| DEF Reduction | 0%–50%+ | Enemy defense mitigation |

TOTAL STAT FORMULAS:
- Total HP = Hero Base HP + (Troop HP × Number of Troops)
- Total ATK = Hero Base ATK + (Troop ATK × Number of Troops)
- Total DEF = Hero Base DEF + (Troop DEF × Number of Troops)

EXAMPLE — Missile hero attacking Tank enemy:
Base ATK: 10,000 · Skill Multiplier: 3.0 (300%) · Type Advantage: 0.8x (Missile vs Tank = disadvantage)
Morale Bonus: 1.2x · Equipment Bonus: 1.15x · Set Bonus: 1.20x (5 same-type heroes)
Calculation: 10,000 × 3.0 × 0.8 × 1.2 × 1.15 × 1.2 = 39,744 damage
`;

export const COMBAT_TYPE_ADVANTAGE = `
COMBAT — TROOP TYPE COUNTER SYSTEM:

COUNTER TRIANGLE:
Tank → beats → Missile Vehicle
Missile Vehicle → beats → Aircraft  
Aircraft → beats → Tank

ADVANTAGE BONUSES (when you have the counter):
- +20% damage DEALT to the countered type
- -20% damage TAKEN from the countered type
- Combined effect: 1.2 × 1.2 = 1.44x effective multiplier for attacker

DISADVANTAGE PENALTIES (when you are being countered):
- -20% damage DEALT
- +20% damage TAKEN
- Combined effect: 0.8 × 0.8 = 0.64x effective multiplier for defender

EFFECTIVE POWER SWING FROM TYPE ADVANTAGE:
Example: 100K Missile vs 100K Tank
- Tank (has advantage): 100K × 1.2 × 1.2 = 144K effective
- Missile (disadvantaged): 100K × 0.8 × 0.8 = 64K effective
- Result: Tank wins with ~56% of army surviving
- The swing: 144K vs 64K = 2.25x difference in effective power

KEY RULE: Always scout before attacking. Type advantage is a 44% effective power swing.
A scout costs almost nothing. The combat penalty for wrong type is massive.

BUILDINGS BONUS: Buildings deal +25% bonus damage to Aircraft in base defense.
⚠️ Aircraft troop type players defending a base take extra damage from defensive buildings.
`;

export const COMBAT_LINEUP_BONUS = `
COMBAT — TROOP TYPE LINEUP BONUSES:

Unlocks after your server completes its FIRST Capitol conquest.
Applies when you deploy multiple heroes of the same troop type in one squad.

| Formation | Bonus | Stats Affected |
|-----------|-------|---------------|
| 3 heroes same type | +5% | HP, Attack, Defense |
| 3 same + 2 different | +10% | HP, Attack, Defense |
| 4 heroes same type | +15% | HP, Attack, Defense |
| 5 heroes same type | +20% | HP, Attack, Defense |

WHY 5 SAME-TYPE WINS:
+20% to HP, ATK, and DEF simultaneously — always active, never situational.
A squad with this bonus fights like it has 20% more of everything.

EFFICIENT UNITY TACTIC CARD EXCEPTION:
If you have the Efficient Unity tactic card, 4 same-type heroes get the FULL +20% bonus (not +15%).

MATH IMPACT:
Base power 1,000,000 with 5 same-type squad = fights like 1,200,000+ power
Over time this 20% advantage compounds with every other bonus for massive differentials.

| Team Composition | Combined Effect |
|-----------------|----------------|
| Mixed types (0%) | Baseline |
| 3 same type (+5% all) | ~15% stronger overall |
| 5 same type (+20% all) | ~60% stronger overall |
`;

export const COMBAT_MORALE_SYSTEM = `
COMBAT — MORALE SYSTEM:

Morale is the most underutilized powerful combat mechanic in the game.
A skilled player with lower power CAN defeat a stronger opponent through morale advantage alone.

MORALE DAMAGE FORMULA:
Morale Bonus = 1 + (Your Morale - Enemy Morale) / 100

Key points:
- Each 1% morale advantage = 1% additional damage
- Maximum boost: up to +200% attack bonus (3x damage) at max morale lead
- Equal morale = no bonus (1.0x multiplier)
- Lower morale = reduced damage AND increased damage taken (double penalty)

MORALE ADVANTAGE EXAMPLES:
| Your Morale | Enemy Morale | Difference | Damage Multiplier |
|-------------|-------------|-----------|------------------|
| 100% | 100% | 0% | 1.0x (baseline) |
| 110% | 100% | +10% | 1.1x |
| 130% | 100% | +30% | 1.3x |
| 150% | 100% | +50% | 1.5x |
| 200% | 100% | +100% | 2.0x |
| 300% | 100% | +200% | 3.0x (MAX) |

HOW MORALE IS CALCULATED:
- Troop Count & Tier: primary driver (~700 morale points per T10 troop; lower tiers proportionally less)
- Tech Research: Special Forces research nodes boost morale
- War Leader Profession: Inspire skill grants up to +10% morale
- VIP Survivors: certain survivors provide morale bonuses

MORALE LOSS DURING BATTLE (snowball mechanic):
1. Initial clash → you deal high damage
2. Enemy loses troops → enemy morale drops
3. Your relative morale increases → you deal MORE damage
4. Snowball effect → decisive victory
Early damage output is crucial — reducing enemy troop count quickly triggers this cascade.

WAR FEVER — WHAT IT ACTUALLY DOES (common misconception):
- War Fever provides a FLAT attack buff, NOT a morale increase
- Does NOT affect morale in any way
- Does NOT stack — refreshing resets the 15-minute timer only
- Activate by initiating an attack/rally · Lasts 15 minutes · Small flat bonus
- Worth keeping active (it's free) but NOT a major combat differentiator
- ⚠️ Activating War Fever REMOVES any active shield
`;

export const COMBAT_EFFECTIVE_POWER = `
COMBAT — EFFECTIVE POWER CALCULATION:

Effective Power = Base Power × Type Bonus × Morale × Lineup Bonus × Equipment

EXAMPLE — 3.5M power Tank squad with optimal bonuses vs Missile enemy:
| Factor | Value | Explanation |
|--------|-------|-------------|
| Base Power | 3,500,000 | Displayed power |
| Type Advantage (vs Missile) | ×1.44 | 1.2 × 1.2 |
| Morale Advantage (+80%) | ×1.80 | Significant morale lead |
| Lineup Bonus (5 Tanks) | ×1.20 | Full same-type team |
| Equipment Bonuses | ×1.15 | Good gear |

Calculation: 3,500,000 × 1.44 × 1.80 × 1.20 × 1.15 = ~12,468,000
Result: A 3.5M power player fights like 12.5M — a 356% increase!

WHY LOWER POWER CAN WIN:
| Player | Base Power | Multipliers | Effective Power | Result |
|--------|-----------|-------------|----------------|--------|
| Smart player | 500K | ×4.0 (optimal) | 2,000,000 | WINS |
| Strong player | 1,500K | ×1.0 (no bonuses) | 1,500,000 | LOSES |

MULTIPLIER IMPACT REFERENCE:
| Bonus | Multiplier | Impact Level |
|-------|-----------|-------------|
| Type Advantage | ×1.44 | ★★★★★ |
| Morale (+100%) | ×2.00 | ★★★★★ |
| Lineup (5 same) | ×1.20 | ★★★★☆ |
| Equipment | ×1.15 | ★★★☆☆ |
| War Fever | Small flat buff | ★☆☆☆☆ |
`;

export const COMBAT_TROOP_POWER = `
COMBAT — TROOP POWER BY TIER:

| Troop Tier | Power/Troop | Example (1,000 troops) | % of T10 |
|------------|------------|----------------------|---------|
| T1 | 24 | 24,000 | 1.5% |
| T3 | 96 | 96,000 | 5.8% |
| T5 | 264 | 264,000 | 16% |
| T7 | 576 | 576,000 | 35% |
| T9 | 1,152 | 1,152,000 | 70% |
| T10 | 1,647 | 1,647,000 | 100% |

TOTAL POWER COMPONENTS:
- Troop Power: ~50–60% of total (largest component — scales with tier and count)
- Hero Power: ~20–25% (hero levels, skills, stars)
- Building Power: ~10–15% (sum of all building levels)
- Research Power: ~5–10% (Tech Center completions)
- Gear Power: ~5–10% (equipment quality and enhancement)

KEY INSIGHT: Troop tier is the single most important stat for competitive play.
A T10 troop is ~7x more powerful per unit than a T5. This is why T10 is the mid-game inflection point.
`;

export const COMBAT_PRE_BATTLE_CHECKLIST = `
COMBAT — PRE-BATTLE OPTIMIZATION CHECKLIST:

1. Scout first — know enemy troop type composition
2. Counter-pick your formation — 44% effective power swing
3. Use mono-type squad — +20% to all stats
4. Check morale levels — up to 200% damage increase available
5. Activate War Fever — free flat attack buff (remember: drops your shield)
6. Verify gear — correct slot assignments for your role (Cannon+Chip = attack, Armor+Radar = defense)
7. Check formation bonus — 5 same-type heroes equipped?

LONG-TERM OPTIMIZATION PRIORITY:
1. Hero Levels ★★★★★ — increases all stats and march size
2. Skill Upgrades ★★★★☆ — direct damage multiplier increase
3. Troop Tier ★★★★☆ — higher power and morale
4. Equipment ★★★☆☆ — consistent stat bonuses
5. Tech Research ★★★☆☆ — unlocks and enhances capabilities
`;

export function getCombatFormulasDataSummary(): string {
  return `
=== COMBAT MATH & FORMULAS ===

${COMBAT_FORMULAS_OVERVIEW}

${COMBAT_DAMAGE_FORMULA}

${COMBAT_TYPE_ADVANTAGE}

${COMBAT_LINEUP_BONUS}

${COMBAT_MORALE_SYSTEM}

${COMBAT_EFFECTIVE_POWER}

${COMBAT_TROOP_POWER}

${COMBAT_PRE_BATTLE_CHECKLIST}
`;
}