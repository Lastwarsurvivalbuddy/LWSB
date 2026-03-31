// ============================================================
// lwtBattleReportContext.ts
// Battle Report Analyzer — Lean Combat Context Module
// Last War: Survival Buddy
// ============================================================
// PURPOSE: Injected into every battle report analysis call.
// Contains ONLY data that directly explains why a fight was
// won or lost. Full KB lives in lwtData/ for Buddy chat.
// Target: ~800-1200 tokens injected per call.
// ============================================================

// ─────────────────────────────────────────────────────────────
// TROOP COUNTER SYSTEM
// ─────────────────────────────────────────────────────────────
export const COUNTER_MATRIX = `
TROOP COUNTER RULES (rock-paper-scissors, ~40% effective power swing total):
- Aircraft BEATS Tank: +20% damage dealt, -20% damage taken (~40% net swing for Aircraft)
- Tank BEATS Missile: +20% damage dealt, -20% damage taken (~40% net swing for Tank)
- Missile BEATS Aircraft: +20% damage dealt, -20% damage taken (~40% net swing for Missile)
- SAME TYPE vs SAME TYPE = NEUTRAL. Zero modifier. Never fabricate a counter.
- Buildings deal +25% extra damage to Aircraft in base defense specifically.

SCREEN 2 DIAGNOSIS: Read per-type damage % for both sides.
- One side at 80-100% damage taken = that type was countered.
- Both sides ~50% = neutral matchup, other factors decided it.
- Missing Screen 2 = set type_matchup to "Unknown", request it.
`;

// ─────────────────────────────────────────────────────────────
// FORMATION BONUS
// ─────────────────────────────────────────────────────────────
export const FORMATION_RULES = `
FORMATION BONUS (applies to HP/ATK/DEF simultaneously):
- 5 same-type heroes: +20% (MAX)
- 4 same-type: +15% (UNLESS Efficient Unity card active → then +20%)
- 3+2 mixed: +10%
- 3 same-type: +5%
- Unlocks after first Capitol conquest.

EFFICIENT UNITY CARD: If active in intake, 4-same gets full +20%. Do NOT flag as formation gap.
MURPHY IN AIRCRAFT SQUAD: Air+Murphy hybrid (Murphy EW L10+) = intentional endgame meta. NOT a formation error.
`;

// ─────────────────────────────────────────────────────────────
// MORALE SYSTEM
// ─────────────────────────────────────────────────────────────
export const MORALE_RULES = `
MORALE FORMULA: Morale Bonus = 1 + (Your Morale - Enemy Morale) / 100
- +30 morale difference = 30% more damage
- +100 morale difference = 2x damage
- +200 morale difference = 3x damage (max)

SNOWBALL: Losing troops early → morale drops → damage drops → more losses → cascade to 90% wipe.
Explains near-equal power matchups that become one-sided crushes.

INVISIBLE MORALE SOURCES (not visible in screenshots):
- Warmind Morale Boost card: +6% per prior PvP win, stacks 5x = up to +30%
- Windrusher Morale Boost: +5% per 8 tiles marched, stacks 5x = up to +25%
- Buluwark Morale Boost: +3% per ally with same card in defense, stacks 9x = up to +27%
- Higher troop tier = higher morale contribution per troop
- Special Forces research morale nodes

War Fever: Flat ATK buff only. Does NOT increase morale.
`;

// ─────────────────────────────────────────────────────────────
// TROOP TIER POWER TABLE
// ─────────────────────────────────────────────────────────────
export const TROOP_TIERS = `
TROOP TIER POWER (per troop):
- T11: 1,840 power · 800 morale · 51.7 unit ATK
- T10: 1,647 power · 750 morale · 45.14 unit ATK (baseline)
- T9:  1,152 power (70% of T10 — 30% less per troop)
- T8:  960 power (58% of T10)
- T7:  576 power (35% of T10)

T11 vs T10: ~12% more power AND morale per troop — compounds at large march sizes.
T10 vs T9: 100K T10 march has 43% more effective power than 100K T9 march.
T11 STAR BONUSES: 1★ = ignores part of enemy damage reduction (rush this first).
T11 VARIANTS: Assault Raider (offensive) vs Armored Trooper (defensive) — swappable every 72h.
`;

// ─────────────────────────────────────────────────────────────
// EXCLUSIVE WEAPONS — BATTLE SIGNAL ONLY
// ─────────────────────────────────────────────────────────────
export const EW_COMBAT_SIGNAL = `
EXCLUSIVE WEAPONS — WHAT MATTERS FOR BATTLE ANALYSIS:
- EW Level 20: +7.5% stat boost to ALL heroes of that type in the squad + skills at level 36
- EW Level 30: skills at level 40 (max)
- Base skill cap without EW: Level 30
- Every 3 EW levels = +1 skill level above 30
- EW L20 vs no EW = 6 extra skill levels on every hero with one

SCREEN 3 SIGNAL: Hero skill damage far lower than squad power suggests = EW gap. Name it.
PRIORITY EW ORDER: Lucius (team shields, any formation) → Murphy (enables Air+Murphy hybrid at L10+) → DVA or Kimberly (by troop type) → Adam

AIR+MURPHY HYBRID (Screen 1 signal): Murphy (Tank hero) visible in Aircraft squad = intentional meta formation. Murphy EW L10+ enables it. Do NOT flag as error.

LUCIUS EW: Team-wide shields that scale with EW level. Works in any formation. Highest priority EW in the game.
ADAM EW: Counterattack spreads to entire team at L10 — core of Tank+Adam anti-Aircraft hybrid.
`;

// ─────────────────────────────────────────────────────────────
// DECORATIONS — JAN 2026 META (BATTLE-RELEVANT ONLY)
// ─────────────────────────────────────────────────────────────
export const DECO_META = `
DECORATION META — JANUARY 2026 PvP:
Decorations apply permanently to ALL heroes in ALL modes. Account-wide. No activation required.
LEVEL 3 RULE: Get ALL UR decos to Level 3 before pushing any single one higher — biggest per-level gain.

S-TIER (Damage Reduction — dominant Jan 2026 meta):
- Win in 2025 / Win in 2026: Highest damage reduction scaling. Best PvP survivability.
- Torch Relay: Consistent damage dampening. Strong ROI at L3+.
- Rock the End: Reliable defensive stat spread.
WHY S-TIER: Damage Reduction scales better than flat HP in sustained/rally PvP as of Jan 2026.

A+-TIER:
- God of Judgment: ONLY decoration that increases March Size. +10 troops at L3+. Cannot use Universal Components — duplicates only.
- Easter Egg-sassin / Lovely Bears: Strong Skill Damage boost.

A-TIER:
- Tower of Victory: +6,500 Hero ATK + 5% Crit Damage at L7. Highest pure ATK decoration.
- Cheese Manor: +215,000 HP + 5% Crit Damage at L7.

SCREEN 4 DIAGNOSIS:
- Red arrows on ATK + HP with similar displayed power = decoration gap most likely cause.
- Coaching: name the specific decoration target. "Tower of Victory to Level 3 closes your ATK gap."
- Decorations that CANNOT use Universal Components: God of Judgment, Libertas, Military Monument, Warriors Monument, Golden Mobile Squad.
`;

// ─────────────────────────────────────────────────────────────
// COMBAT RESEARCH — BATTLE-RELEVANT SUMMARY
// ─────────────────────────────────────────────────────────────
export const COMBAT_RESEARCH_SIGNAL = `
COMBAT RESEARCH — BATTLE SIGNAL ONLY:
Research is invisible in screenshots but explains stat gaps on Screen 4.
Key combat research branches that directly affect battle outcomes:
- Special Forces: March size (more troops = more effective power) + morale nodes
- Troop ATK/DEF/HP research: Each tier of research adds % bonuses to all troops of that type
- Higher HQ level = access to higher research nodes = compounding invisible power
- T11 Armament research (HQ 31+): Railgun upgrades add Hero ATK + Crit Rate per level

DIAGNOSIS: Two players with same displayed power but one has multiple red arrows on Screen 4 →
research investment gap is a primary suspect alongside decorations and gear.

COACHING: "Screen 4 red arrows on [stat] alongside similar displayed power suggests a research or
decoration gap. Prioritize [specific action] to close it."
Do NOT cite specific research node names unless player profile confirms their HQ level enables it.
`;

// ─────────────────────────────────────────────────────────────
// GEAR — SCREEN 5 SIGNAL
// ─────────────────────────────────────────────────────────────
export const GEAR_SIGNAL = `
GEAR — SCREEN 5 DIAGNOSIS:
- Attacker slots: Cannon/Railgun + Chip → attack heroes
- Defender slots: Armor + Radar → defender heroes
- Rarity: Legendary (UR gold) only. SSR purple = placeholder. Never invest in blue/green.
- Missing slots or SSR where Legendary expected = direct power gap.
- Badge quality lower than opponent = badge investment gap.
- Coaching: "Screen 5 shows [gap] — Legendary Cannon is your highest gear priority."
`;

// ─────────────────────────────────────────────────────────────
// INVISIBLE COMBAT MULTIPLIERS
// ─────────────────────────────────────────────────────────────
export const INVISIBLE_MULTIPLIERS = `
INVISIBLE MULTIPLIERS (cannot be read from any screenshot):
- Drone level: L111 unlocks all 5 combat skills. L50 = only 1 skill. Gap is massive.
- Skill Chips: Legendary chips = 100-150% power bonus. Epic = 50-80%. Type-matched chips get +20%.
- Armament levels (T11/HQ31+ only): Railgun +45 Hero ATK + 0.25% Crit Rate per level.
- Overlord Gorilla (if deployed): adds 5 combat skills. Visible in report if active.

DIAGNOSIS: Damage gap that cannot be explained by type counter / EW / decos / gear →
drone skill gap or Legendary chip gap is the most plausible remaining invisible factor.
Mention only if other visible factors don't fully explain the outcome.
`;

// ─────────────────────────────────────────────────────────────
// HERO-SPECIFIC BATTLE SIGNALS
// ─────────────────────────────────────────────────────────────
export const HERO_SIGNALS = `
HERO-SPECIFIC SIGNALS (read from Screen 1 + Screen 3):
- SCHUYLER: Blast Frenzy bypasses front row, hits 1 back-row unit for 927% energy damage + 20% stun.
  Signal: opponent backline took heavy damage while frontline intact = Schuyler targeting through.
- TESLA: Electric Grid Lockdown targets 3 back-row units directly. Same signal as Schuyler.
- MCGREGOR: Unyielding Heart taunt redirects ALL enemy attacks to McGregor.
  Signal: McGregor died early → entire backline immediately exposed → spike in Tesla/Fiona damage.
- SWIFT: Targeted Strike always hits lowest HP% enemy. Low kills = Tesla/Fiona failed to wound first.
- MURPHY IN AIRCRAFT SQUAD: Air+Murphy hybrid. Intentional. EW L10+ required. Never flag as error.
- ENERGY DAMAGE LAYER: Kimberly/Tesla/DVA/Schuyler/Fiona deal energy damage.
  Carlie has 40% energy resistance. Lucius gives team-wide energy resistance via Knight's Spirit.
  Tank squads running Kimberly+Tesla vs Lucius+Carlie Aircraft = two damage layers working against them.
`;

// ─────────────────────────────────────────────────────────────
// TROOP LOSS INTERPRETATION
// ─────────────────────────────────────────────────────────────
export const LOSS_SEVERITY = `
TROOP LOSS CATEGORIES:
- Lightly Wounded: Auto-recover. Free. No hospital. No resources.
- Wounded: Hospital. Require resources to heal. Recoverable.
- Killed: Permanently lost UNLESS hospital overflow → Enlistment Office.
- Enlistment Office: Overflow from full hospital. Recalled at no cost (timed).

SEVERITY:
- High kill count as attacker = bad (permanent loss).
- High kill count as defender = survivable if Enlistment has capacity.
- Warmind Rapid Rescue card: recovers up to 100% lightly wounded after PvP win (2x daily).

LOSS SEVERITY THRESHOLDS BY SPEND TIER:
- F2P / Budget: Any killed troops are significant. Even wounded is painful to heal.
- Mid spender: Moderate wounded acceptable if loot justified it.
- Investor: Can absorb more losses but permanent kills still matter at T11.
`;

// ─────────────────────────────────────────────────────────────
// SQUAD DEFENSE POSITION ORDER
// ─────────────────────────────────────────────────────────────
export const DEFENSE_POSITIONS = `
SQUAD DEFENSE POSITION ORDER: Squads defend in position order (1→2→3→4), NOT by squad label.
Position 1 = most damage. Always put strongest squad there.
Optimal endgame: Strongest (pos 1) → Missile/counter-type (pos 2) → Second strongest (pos 3) → Remaining (pos 4).
GARRISON REPORTS: Position order determines which squad absorbed initial damage.
`;

// ─────────────────────────────────────────────────────────────
// VERDICT TEMPLATES
// ─────────────────────────────────────────────────────────────
export const VERDICT_LABELS = `
VERDICT LABELS (use exact label in output):
- "Countered — Troop Type Mismatch": your type took 80-100% damage, counter applied (~40% swing)
- "Outmatched — Power / Investment Gap": similar type, multiple red arrows → deco/gear/EW gap
- "Morale Cascade": near-equal power + type, losses catastrophically asymmetric → snowball
- "Formation Bonus Gap": mixed squad vs mono-type → +10% vs +20%
- "Clean Win — Well Executed": won with minimal losses, correct counter, stat advantages
- "Pyrrhic Win — Won But At Cost": won but heavy troop losses — evaluate ROI
- "PvE — Virus Resistance Gap": near-zero damage to zombies in S1 → Purgator card + VRI research
- "PvE — Wrong Squad Composition": unexpected troop losses → AoE heroes, all three types for Siege
- "Arena — Stat / Hero Investment Gap": Arena loss → EW levels, decoration upgrades, hero stats
`;

// ─────────────────────────────────────────────────────────────
// COACHING ACTION TEMPLATES (condensed)
// ─────────────────────────────────────────────────────────────
export const COACHING_TEMPLATES = `
COACHING TEMPLATES (always reference a screenshot data point + name a specific action):
- TYPE COUNTER: "Scout opponent type before marching. Match counter: Aircraft→Missile, Tank→Aircraft, Missile→Tank."
- FORMATION: "Run 5 same-type heroes for +20% HP/ATK/DEF. 3+2 costs you 10% on every stat."
- DECORATION (Jan 2026 meta first): "Damage Reduction decorations (Win in 2025/2026, Torch Relay) are S-tier in current meta. Then God of Judgment → Tower of Victory. Get all UR decos to Level 3 before pushing any single one deeper."
- EW: "Get main squad EWs to Level 20 — 7.5% stat boost + skills at level 36 vs opponent's 30. Priority: Lucius → Murphy → DVA/Kimberly."
- GEAR: "Legendary Cannon + Chip on attacker heroes first. Honor Points → Legendary Blueprints only."
- MORALE: "Don't attack in series without returning to base. Warmind Morale Boost resets on base return."
- TROOP STRENGTH: "Opponent fielded stronger troops. Close with: (1) Special Forces march size research, (2) train highest troop tier available."
- SCOUT: "Always scout before attacking — type counter is a ~40% effective power swing. Free intel."
- DRONE: "Push drone to Level 111 to unlock all 5 combat skills — passive multiplier in every fight."
- SKILL CHIPS: "Legendary chips are a 100-150% power multiplier. Type-match chips for +20% bonus. Prioritize Combat Boost milestones L150→L300→L450."
- ARENA: "Arena is 100% hero-driven. EW to Level 20 + decoration upgrades are the only levers."
`;

// ─────────────────────────────────────────────────────────────
// BATTLE REPORT SCREEN LAYOUT (quick reference)
// ─────────────────────────────────────────────────────────────
export const SCREEN_GUIDE = `
BATTLE REPORT SCREENS — WHAT TO READ FROM EACH:
Screen 1: Outcome, attacker/defender power, opponent name, hero lineup icons, loot.
Screen 2: THE MOST IMPORTANT. Per-type damage % both sides, troop counts, killed/wounded/lightly wounded.
Screen 3: Hero skill damage per hero. EW gap diagnosis. Skill level comparison.
Screen 4: ATK/HP/DEF/Lethality comparison, green/red arrows. Decoration + research + gear gap.
Screen 5: Gear slots and rarity both sides. Badge quality. Chief level.
Screen 6: Letter-grade improvement areas. Game's own assessment — use as secondary confirmation.
Minimum viable upload: Screen 1 + Screen 2. Screen 4 adds stat diagnosis. Screen 3 adds EW diagnosis.
`;

// ─────────────────────────────────────────────────────────────
// ASSEMBLED CONTEXT BLOCK — injected into system prompt
// ─────────────────────────────────────────────────────────────
export function getBattleReportContext(): string {
  return [
    '## BATTLE ANALYSIS KNOWLEDGE BASE',
    '### COUNTER SYSTEM',
    COUNTER_MATRIX,
    '### FORMATION',
    FORMATION_RULES,
    '### MORALE',
    MORALE_RULES,
    '### TROOP TIERS',
    TROOP_TIERS,
    '### EXCLUSIVE WEAPONS — BATTLE SIGNAL',
    EW_COMBAT_SIGNAL,
    '### DECORATIONS — JAN 2026 META',
    DECO_META,
    '### COMBAT RESEARCH',
    COMBAT_RESEARCH_SIGNAL,
    '### GEAR',
    GEAR_SIGNAL,
    '### INVISIBLE MULTIPLIERS',
    INVISIBLE_MULTIPLIERS,
    '### HERO SIGNALS',
    HERO_SIGNALS,
    '### TROOP LOSS SEVERITY',
    LOSS_SEVERITY,
    '### DEFENSE POSITIONS',
    DEFENSE_POSITIONS,
    '### VERDICT LABELS',
    VERDICT_LABELS,
    '### COACHING TEMPLATES',
    COACHING_TEMPLATES,
    '### SCREEN GUIDE',
    SCREEN_GUIDE,
  ].join('\n');
}