// src/lib/lwtSkillChipData.ts
// Skill Chip System — complete knowledge module
// Source: lastwarhandbook.com/guides/skill-chip-system-master-guide
// Introduced: October 2024
// Built: March 22, 2026 (session 58)

export const SKILL_CHIP_OVERVIEW = `
SKILL CHIP SYSTEM — OVERVIEW:
- Introduced October 2024 — one of the most significant drone enhancement mechanics in the game
- Skill Chips are specialized drone enhancements that provide significant combat bonuses across ALL battle scenarios
- Unlike most upgrades, skill chips benefit ALL drones simultaneously, not individual ones
- Effects are stackable — multiple chips can be combined for compound benefits
- Type-specific bonuses: enhanced effectiveness when matched to your hero formation type

CHIP LAB BUILDING:
- Unlocks at HQ Level 15 (basic chip crafting, Legendary Initial Move Chip access)
- Maximum level 20 (all Legendary Chips become available, maximum efficiency bonuses)
- PRIORITY: Rush to Level 15 for Legendary chip access. Upgrade to Level 20 as resources permit.

WHY SKILL CHIPS MATTER:
- 60–150% combat power increase when properly optimized
- Better ROI than traditional drone upgrades at equivalent resource investment
- Benefits apply to every hero in every game mode — permanent passive boost
- Compound with formation bonuses, gear, and research for multiplied effectiveness
`;

export const SKILL_CHIP_TYPES = `
SKILL CHIP TYPES (4 categories):

1. MOVEMENT / INITIAL MOVE CHIPS
   - Primary function: defensive shielding at battle start
   - Key benefit: absorbs initial enemy attack waves for first ~10 seconds
   - Best for: survivability-focused builds, Tank formations
   - Example effects: 25–40% damage reduction during initial phase, enhanced positioning

2. ATTACK SKILL CHIPS
   - Primary function: damage output enhancement
   - Key benefit: boosts rear-row drone attack power
   - Best for: DPS-focused formations, Aircraft types
   - Example effects: 20–35% increased damage output, multi-target at higher star levels, piercing damage

3. DEFENSE SKILL CHIPS
   - Primary function: survivability enhancement
   - Key benefit: team-wide defensive bonuses
   - Best for: balanced formations, Tank and Missile Vehicle types
   - Example effects: 30–50% increased HP and armor, damage resistance, healing over time

4. INTERFERENCE SKILL CHIPS
   - Primary function: enemy disruption
   - Key benefit: extends damage duration and intensity
   - Best for: control-oriented strategies, support/utility heroes
   - Example effects: damage over time extensions, enemy accuracy reduction, crowd control
`;

export const SKILL_CHIP_RARITIES = `
SKILL CHIP RARITIES:

| Rarity | Power Bonus | Crafting Cost | Recommendation |
|--------|-------------|---------------|----------------|
| Common (Green) | 10–20% | — | Never craft — use immediately as Combat Boost fuel |
| Rare (Blue) | 25–40% | — | Replace with Epic/Legendary ASAP |
| Epic (Purple/SR) | 50–80% | 400–800 Basic Chip Materials | Use until Legendary available |
| Legendary (Gold/UR) | 100–150% | 800 Premium Chip Materials each | Primary long-term goal — permanent investment |

CRAFTING COSTS BREAKDOWN:
Epic Chips: Initial Move = 800 Basic Materials · Attack/Defense/Interference = 400 Basic Materials each
Legendary Chips: All types = 800 Premium Chip Materials each

RARITY STRATEGY:
- Never craft Common chips — use them directly as Combat Boost upgrade fuel
- Replace Rare chips as soon as Epic alternatives are available
- Save Premium Materials for Legendary chips — the 100–150% bonus is worth waiting for
- Legendary chips provide approximately 2–3x the power of Epic at comparable resource investment
`;

export const SKILL_CHIP_COMBAT_BOOST = `
SKILL CHIP — COMBAT BOOST SYSTEM:

The Combat Boost system replaces individual chip level upgrades with a UNIFIED progression system.
Every Combat Boost level benefits ALL active drone skill chips simultaneously — not just one.

KEY MILESTONES:
- Level 150: Unlock additional chip sets · Medium resource investment
- Level 300: Enhanced star bonuses · High resource investment
- Level 450: Maximum efficiency unlocked · Elite resource investment

STRATEGY:
- Keep all chip levels equal for maximum efficiency
- Focus resources on reaching key breakpoints (150 → 300 → 450)
- Every chip you equip benefits from your Combat Boost level
- Prioritize milestone achievement over gradual incremental progress — certain levels provide disproportionate benefits

PROGRESSION ORDER:
Priority 1: Reach Combat Boost Level 150 (foundation)
Priority 2: Advance to Level 300 (power spike)
Priority 3: Achieve Level 450 (elite performance)
`;

export const SKILL_CHIP_FARMING = `
SKILL CHIP — ACQUISITION AND FARMING:

PRIMARY MATERIAL TYPES:
- Basic Chip Materials: used for Epic Skill Chips. Sources: Campaign Store, special events. More limited than Premium.
- Premium Chip Materials: used for Legendary Skill Chips. Multiple daily sources. Easier to obtain than Basic.

F2P DAILY FARMING ROUTE (15–20 minutes):
1. Complete Versus Mode — up to 30 Premium Materials/day (BEST free source)
2. Campaign Store purchases (refresh if needed)
3. Alliance Exercise (Marshal's Guard) participation
4. Ghost Ops completion
5. Event participation when available

MATERIAL DROP RATES:
- Versus Mode: ~15 Premium Materials/hour · High reliability · Fully F2P
- Campaign Store: ~8 Premium Materials/hour · Medium reliability · Fully F2P
- Events: ~25 Premium Materials/hour · Low frequency · Fully F2P
- Chest Purchases: ~40 Premium Materials/hour · High reliability · Limited access

F2P WEEKLY INCOME: ~210+ Premium Materials (from daily Versus Mode alone)
F2P TIMELINE FOR FIRST LEGENDARY CHIP: approximately 4–5 weeks of consistent daily farming

CHEST COSTS:
- Legendary Chip Chest: 100 Premium Materials
- Epic Chip Chest: 30 Premium Materials
- Rare Chip Chest: 5 Premium Materials
- Common Chip Chest: 1 Premium Material
`;

export const SKILL_CHIP_PRIORITY = `
SKILL CHIP — PRIORITY AND PROGRESSION PATH:

TYPE SYNERGY — CRITICAL:
Match your chip focus to your hero formation type for a 20% bonus stack:
- Tank formations: prioritize Defense chips + Initial Move chips
- Aircraft formations: prioritize Attack chips + Defense chips
- Missile Vehicle formations: prioritize Defense chips + Initial Move chips + Attack chips (balanced)

CHIP CONFIGURATION BY FORMATION:
Tank Heroes (Williams, Murphy, Kimberly):
  60% Defense chips · 30% Initial Move chips · 10% Interference chips
  → Maximum survivability and team protection

DPS/Aircraft Heroes (DVA, Schuyler, Morrison):
  70% Attack chips · 20% Defense chips · 10% Interference chips
  → Maximum damage output with basic survivability

Support/Missile Vehicle Heroes (Swift, Tesla, Fiona):
  40% Defense chips · 30% Initial Move chips · 20% Attack chips · 10% Interference chips
  → Balanced performance across all scenarios

PROGRESSION PHASES:

Phase 1 — Foundation (Month 1):
- Priority: Memory Ultra Fission Chip for main heroes (Legendary — 800 Premium Materials)
- Secondary: Gravitational Resonance Armor (Defense Legendary — 800 Premium Materials)
- Resource split: 60% Premium on Memory Ultra Fission · 25% on Defense chip · 15% on Epic alternatives
- Attack chip over Initial Move until both reach 5 stars

Phase 2 — Specialization (Months 2–3):
- Complete Legendary set for main squad
- Begin secondary squad chip development
- Achieve Combat Boost Level 150
- Type-match chips to hero formations

Phase 3 — Optimization (Months 4–6):
- Combat Boost Level 300
- Multiple configuration setups (PvP vs PvE)
- Event-timed major upgrades
- Target: 120–180% power increase from chip system

Phase 4 — Mastery (6+ Months):
- Combat Boost Level 450
- Multiple Legendary configurations
- Server-competitive chip builds

F2P FIRST LEGENDARY PRIORITY ORDER:
1. Memory Ultra Fission Chip (main heroes)
2. Gravitational Resonance Armor (Defense Legendary)
3. Attack-focused Legendary chip
4. Support/utility chips as needed

STAR LEVEL BREAKPOINTS (hidden bonuses):
- Levels 2 and 5 often unlock special bonuses
- Attack chips gain multi-target capability at specific star levels
- Plan upgrades to hit these breakpoints efficiently
`;

export const SKILL_CHIP_COMMON_MISTAKES = `
SKILL CHIP — COMMON MISTAKES:

❌ Crafting Common chips instead of using them as Combat Boost fuel
   → Common chips have no long-term value as equipped chips. Feed them straight to Combat Boost.

❌ Not matching chip type to hero formation
   → Mono-type teams get 20% bonus. A chip build that doesn't match your formation loses this multiplier.

❌ Spreading Premium Materials across too many chip types
   → Concentration wins. Get one Legendary chip to full stars before expanding.

❌ Ignoring Versus Mode as a daily material source
   → 30 Premium Materials/day from VS = most efficient free source in the game. Never skip it.

❌ Upgrading chips outside of event bonus windows
   → Major upgrades timed during chip upgrade events (20–30% bonus) save significant materials.

❌ Treating Combat Boost as a secondary priority
   → Combat Boost upgrades benefit EVERY chip. Reach milestones first, then polish individual chips.
`;

export function getSkillChipDataSummary(): string {
  return `
=== SKILL CHIP SYSTEM (Drone Enhancement) ===

${SKILL_CHIP_OVERVIEW}

${SKILL_CHIP_TYPES}

${SKILL_CHIP_RARITIES}

${SKILL_CHIP_COMBAT_BOOST}

${SKILL_CHIP_FARMING}

${SKILL_CHIP_PRIORITY}

${SKILL_CHIP_COMMON_MISTAKES}
`;
}