// ============================================================
// lwtBattleReportContext.ts
// Battle Report Analyzer — Lean Combat Context Module
// Last War: Survival Buddy
// ============================================================
// PURPOSE: Injected into every battle report analysis call.
// Contains ONLY data that directly explains why a fight was
// won or lost. Full KB lives in lwtData/ for Buddy chat.
// ============================================================

export const COUNTER_MATRIX = `
TROOP COUNTER RULES (rock-paper-scissors, ~40% effective power swing total):
- Aircraft BEATS Tank: +20% damage dealt, -20% damage taken (~40% net swing for Aircraft)
- Tank BEATS Missile: +20% damage dealt, -20% damage taken (~40% net swing for Tank)
- Missile BEATS Aircraft: +20% damage dealt, -20% damage taken (~40% net swing for Missile)
- SAME TYPE vs SAME TYPE = NEUTRAL. Zero modifier. Never fabricate a counter.
- Buildings deal +25% extra damage to Aircraft in base defense specifically.

HOW TO READ TROOP TYPE:
- Heroes tab > Overview > Lineup row: troop type icons (helicopter = Aircraft, tank = Tank, missile truck = Missile)
- Game shows counter text directly: "Your lineup strongly counters the enemy lineup" or "evenly matched"
- Army tab > Units > Unit Type Trait row: shows locked/unlocked trait slots, active trait icon = troop type
- There is NO per-type damage % screen. Type matchup diagnosed from lineup icons + game text + morale gap.
`;

export const FORMATION_RULES = `
FORMATION BONUS (applies to HP/ATK/DEF simultaneously):
READ FROM: Heroes tab > Overview > Lineup section — formation bonus % displayed explicitly for both sides.
- 5 same-type heroes: +20% (MAX)
- 4 same-type: +15% (UNLESS Efficient Unity card active → then +20%)
- 3+2 mixed: +10%
- 3 same-type: +5%
EFFICIENT UNITY CARD: If active in intake, 4-same gets full +20%. Do NOT flag as formation gap.
MURPHY IN AIRCRAFT SQUAD: Air+Murphy hybrid (Murphy EW L10+) = intentional endgame meta. NOT a formation error.
`;

export const MORALE_RULES = `
MORALE — THE GAME SHOWS THIS EXPLICITLY:
READ FROM: Army tab > Units section.
- Morale totals displayed per side (e.g. 2.72M vs 2.14M)
- Game shows: "Blue Side's Morale is X.XX times that of Red, inflicting XXX% damage in battle."
- READ THIS NUMBER DIRECTLY. 1.27x = 127% damage multiplier for the morale-advantaged side.

FORMULA: Morale Bonus = 1 + (Your Morale - Enemy Morale) / 100
SNOWBALL: Losing troops early → morale drops → damage drops → more losses → cascade to 90% wipe.

INVISIBLE MORALE SOURCES (not in screenshots):
- Warmind Morale Boost card: +6% per prior PvP win, stacks 5x = up to +30%
- Windrusher Morale Boost: +5% per 8 tiles marched, stacks 5x = up to +25%
- Buluwark Morale Boost: +3% per ally with same card in defense, stacks 9x = up to +27%
- Higher troop tier = higher morale contribution per troop
War Fever: Flat ATK buff only. Does NOT increase morale.
`;

export const TROOP_TIERS = `
TROOP TIER POWER (per troop):
- T11: 1,840 power · 800 morale · 51.7 unit ATK
- T10: 1,647 power · 750 morale · 45.14 unit ATK (baseline)
- T9:  1,152 power (70% of T10)
- T8:  960 power (58% of T10)
- T7:  576 power (35% of T10)

T11 STAR BONUSES: READ FROM Army tab > Units > Unit Type Trait locked/unlocked slots.
- 1★: Ignores part of enemy damage reduction (rush this first)
- 2★: Assault Raider restores lightly wounded on win
- 3★: Increased lethality rate
DIAGNOSIS: Count unlocked trait slots vs opponent. Fewer slots = lower T11 star investment.
`;

export const EW_COMBAT_SIGNAL = `
EXCLUSIVE WEAPONS:
READ FROM: Heroes tab > Hero Exclusive Weapons section — EW level per hero both sides (Lv.20, Lv.30 etc.)
- EW L20: +7.5% stat boost to ALL heroes of that type + skills at level 36
- EW L30: skills at level 40 (max)
- Base skill cap without EW: Level 30. Every 3 EW levels = +1 skill level above 30.
- EW L20 vs no EW = 6 extra skill levels per hero — meaningful damage multiplier gap.

STATISTICS TAB SIGNAL: Per-hero damage shown in Statistics > Damage section.
Low hero damage vs their EW level = skill level gap or EW missing.

EW PRIORITY: Lucius (team shields, any formation) → Murphy (Air+Murphy hybrid at L10+) → DVA/Kimberly → Adam
AIR+MURPHY HYBRID: Murphy in Aircraft squad = intentional meta. Do NOT flag as error.
LUCIUS EW: Team-wide shields. Highest priority EW in the game.
ADAM EW: Counterattack spreads to entire team at L10.
`;

export const DECO_META = `
DECORATIONS — JAN 2026 META:
READ FROM: Army tab > Decoration section — power both sides directly comparable.
Decorations apply permanently to ALL heroes in ALL modes. No activation required.
LEVEL 3 RULE: All UR decos to Level 3 before pushing any single one higher.

S-TIER (Damage Reduction — dominant Jan 2026 meta):
- Win in 2025 / Win in 2026, Torch Relay, Rock the End — damage reduction beats flat HP in sustained PvP.

A+-TIER: God of Judgment (ONLY march size source from decos), Easter Egg-sassin, Lovely Bears (skill damage).
A-TIER: Tower of Victory (+6,500 ATK +5% Crit), Cheese Manor (+215K HP +5% Crit).

DIAGNOSIS: Army tab shows decoration power gap directly (e.g. 3.6M vs 6.8M = major gap).
Coaching: Name the specific tier. "Your decoration power is [X]M vs opponent's [Y]M — Damage Reduction decos then Tower of Victory."
`;

export const COMBAT_RESEARCH_SIGNAL = `
COMBAT RESEARCH:
READ FROM: Army tab > Tech section — research % per category side by side with green/red indicators.

KEY CATEGORIES VISIBLE:
- Aircraft/Tank/Missile Hero Attack/Defense/HP Boost %
- Unit Attack/Defense/HP Boost %
- Reduce Damage Taken %
- Special Forces % (march size + morale)
- Tank/Aircraft/Missile Damage Reduction %

DIAGNOSIS: Compare your troop type's boost % vs opponent's directly.
Example: Your Aircraft Hero Attack = 74%, opponent = 60% → you have research advantage.
Example: Your Tank Hero Attack = 43.5%, opponent = 63% → opponent has meaningful tank research lead.

Research investment levels also shown: Joint Attack Lv.XXX, Defense Support Lv.XXX, Survival Training Lv.XXX.
Higher level = more investment. Read and compare directly.

COACHING: "Army tab Tech shows your [type] boost at [X]% vs opponent's [Y]% — [type] research is your highest-ROI path."
`;

export const GEAR_SIGNAL = `
GEAR:
READ FROM: Heroes tab > Gear section — 4 gear slots per hero, both sides shown side by side.
- Gold border = Legendary (UR). Purple = Epic (SSR). Endgame should be all gold.
- Gear level shown (Lv.40 etc.). Higher = better.
- Gear power also shown in Army tab overview — quick gap check.
COACHING: "Heroes tab Gear shows [hero] with [SSR/missing slot] — Legendary Cannon + Chip on attacker heroes first."
`;

export const DRONE_AND_CHIPS = `
DRONE AND SKILL CHIPS:
READ FROM: Army tab > Drone section — drone level, skill chip slots, combat boost level, chip stars.

DRONE LEVEL:
- Skills unlock at: L31, L51, L71, L91, L111 (all 5 skills)
- CRITICAL: Only recommend drone level upgrade if player's drone is BELOW L111.
  If drone is L111+, do NOT mention drone leveling. Skip this coaching item entirely.
- Drone power directly comparable in Army tab.

SKILL CHIPS:
- Chip Stars shown (e.g. 21★ vs 29★) — higher = better chip quality.
- Combat Boost Level shown (e.g. 521 vs 615) — higher = all chips more powerful.
- Gold chip borders = Legendary (100-150% power bonus). Purple = Epic (50-80%).
- DIAGNOSIS: Chip Stars gap or Combat Boost gap → chip investment behind.
- Milestones: Combat Boost L150 → L300 → L450 upgrade all chips simultaneously.

Statistics tab > Equivalent Damage Output: shows drone effectiveness comparison directly.
`;

export const INVISIBLE_MULTIPLIERS = `
REMAINING MULTIPLIERS:
- Overlord: Power in Army tab. Bond level shown (Bonded Partner I → Strategic Pillar IV etc.).
  Higher bond = more Overlord skills deployed. "Strategic Pillar IV" vs "Bonded Partner I" = significant gap.
- Alliance Tech Bonus: Army tab > Other section. Opponent 353K vs your 0 = alliance not contributing tech.
- Season Skill Bonus: Army tab > Other section. Should be comparable for same-season players.
- Armament levels (T11/HQ31+ only): Not visible in screenshots. Mention only if all other gaps are explained.
`;

export const HERO_SIGNALS = `
HERO SIGNALS (Heroes tab + Statistics tab):
- SCHUYLER: Bypasses front row, targets 1 back-row hero. Signal: Statistics shows opponent backline took heavy damage.
- TESLA: Targets 3 back-row heroes directly. Same signal as Schuyler.
- MCGREGOR: Taunt redirects ALL attacks to McGregor. Signal: McGregor highest DMG Taken in Statistics.
- SWIFT: Always hits lowest HP% enemy. Low kill count = Tesla/Fiona didn't wound enemies first.
- MURPHY IN AIRCRAFT SQUAD: Intentional Air+Murphy hybrid. EW L10+ required. Never flag as error.
- ENERGY LAYER: Kimberly/Tesla/DVA/Schuyler/Fiona deal energy damage.
  Carlie has 40% energy resistance. Lucius gives team-wide energy resistance.
  Tank with Kimberly+Tesla vs Aircraft with Lucius+Carlie = two damage layers working against tank.
`;

export const LOSS_SEVERITY = `
TROOP LOSS:
READ FROM: Statistics tab > Units section — Killed / Hospital / Injured / Survive both sides.
- Killed: Permanently lost unless hospital overflow → Enlistment Office. High killed = serious.
- Hospital: Recoverable, costs resources.
- 0 killed = excellent outcome regardless of win/loss.
- High killed as attacker = permanent loss (bad).
- High killed as defender = survivable if Enlistment has capacity.

SPEND TIER THRESHOLDS:
- F2P/Budget: Any killed troops are significant.
- Mid spender: Moderate hospital acceptable if loot justified it.
- Investor: Can absorb losses but permanent kills still matter at T11.
`;

export const DEFENSE_POSITIONS = `
DEFENSE POSITION ORDER: Squads defend in position order (1→2→3→4), NOT by squad label.
Position 1 = most damage. Always put strongest squad there.
Optimal: Strongest (pos 1) → Counter-type (pos 2) → Second strongest (pos 3) → Remaining (pos 4).
`;

export const VERDICT_LABELS = `
VERDICT LABELS (use exact label):
- "Countered — Troop Type Mismatch": lineup icons + game counter text confirm it
- "Outmatched — Power / Investment Gap": neutral/same matchup, Army tab shows decoration/research/gear gap
- "Morale Cascade": Army tab morale multiplier >1.10x for opponent + asymmetric losses
- "Formation Bonus Gap": Heroes tab Lineup shows mixed formation vs opponent mono-type
- "Clean Win — Well Executed": won with minimal losses, correct counter or comparable stats
- "Pyrrhic Win — Won But At Cost": won but Statistics tab shows high killed/hospital
- "PvE — Virus Resistance Gap": near-zero zombie damage in S1 → Purgator card + VRI research
- "PvE — Wrong Squad Composition": unexpected PvE losses → AoE heroes, all three types for Siege
- "Arena — Stat / Hero Investment Gap": Arena loss → EW levels, decoration upgrades
`;

export const COACHING_TEMPLATES = `
COACHING (always reference a screenshot data point AND name a specific action):
- TYPE COUNTER: "Heroes tab Lineup shows [type] vs [type] — scout type before marching. Counter: Aircraft→Missile, Tank→Aircraft, Missile→Tank."
- FORMATION: "Heroes tab shows [X]% formation bonus — run 5 same-type heroes for full +20%."
- MORALE: "Army tab shows opponent morale [X]x yours inflicting [Y]% damage — return to base between attacks, Warmind Morale stacks reset on return."
- DECO: "Army tab Decoration power [X]M vs opponent's [Y]M — Damage Reduction decos (Win in 2025/2026, Torch Relay) first, then Tower of Victory."
- EW: "Heroes tab EW shows [hero] at Lv.[X] — push to Level 20 for 7.5% stat boost and skills at level 36."
- GEAR: "Heroes tab Gear shows [gap] — Legendary Cannon + Chip on attacker heroes. Honor Points → Legendary Blueprints only."
- RESEARCH: "Army tab Tech shows [type] boost [X]% vs opponent's [Y]% — [type] research is highest-ROI upgrade."
- DRONE (ONLY if below L111): "Army tab shows drone at Lv.[X] — push to Level 111 for all 5 combat skills."
- CHIPS: "Army tab shows Combat Boost Level [X] vs opponent's [Y] — prioritize milestones L150→L300→L450."
- TROOP STRENGTH: "Army tab Units shows [X] troops vs opponent's [Y] — close with Special Forces march research and highest available troop tier."
- OVERLORD: "Army tab shows opponent bond rank [X] vs your [Y] — higher bond = more Overlord skills in every fight."
- T11 TRAITS: "Army tab Unit Type Trait shows [X] slots unlocked vs opponent's [Y] — T11 1★ (ignore damage reduction) is highest priority."
`;

export const SCREEN_GUIDE = `
ACTUAL SCREEN LAYOUT (3 tabs, each scrollable):

HEROES TAB:
- Scroll 1: Outcome, names, total power, hero lineup icons, troop type icons, formation bonus %, counter text, EW power totals.
- Scroll 2: EW levels per hero (Lv.20/Lv.30), gear slots per hero (4 slots, rarity + level).
- Scroll 3: Hero skill card icons and levels.

ARMY TAB:
- Scroll 1: Power by category (Drone, Tech, Decoration, Units, Wall of Honor, Overlord, Tactics Cards). Drone level, skill chip slots, combat boost level, chip stars.
- Scroll 2: Drone component details, attribute boost totals (Hero HP/DEF/ATK numbers), Overlord power + bond level + deployed skills, research levels (Joint Attack/Defense Support/Survival Training Lv.XXX).
- Scroll 3: Tech research % per category (Aircraft/Tank/Missile boosts, Damage Reduction etc.), Decoration comparison, Tactics Cards, Units section (troop counts + morale totals + morale multiplier message + Unit Type Trait), Wall of Honor levels, Alliance Tech Bonus, Season Skill Bonus.

STATISTICS TAB:
- Scroll 1: Killed/Hospital/Injured/Survive counts, per-hero Damage output, Equivalent Damage Output (drone).
- Scroll 2: Per-hero DMG Taken, Equivalent Damage Taken (drone).

MINIMUM VIABLE: Heroes Scroll 1 + Army Scroll 3 (morale + research) + Statistics Scroll 1 (losses + damage).
IDEAL: All 3 tabs fully scrolled = complete diagnosis.
`;

export function getBattleReportContext(): string {
  return [
    '## BATTLE ANALYSIS KNOWLEDGE BASE',
    '### COUNTER SYSTEM', COUNTER_MATRIX,
    '### FORMATION', FORMATION_RULES,
    '### MORALE', MORALE_RULES,
    '### TROOP TIERS', TROOP_TIERS,
    '### EXCLUSIVE WEAPONS', EW_COMBAT_SIGNAL,
    '### DECORATIONS', DECO_META,
    '### COMBAT RESEARCH', COMBAT_RESEARCH_SIGNAL,
    '### GEAR', GEAR_SIGNAL,
    '### DRONE AND CHIPS', DRONE_AND_CHIPS,
    '### INVISIBLE MULTIPLIERS', INVISIBLE_MULTIPLIERS,
    '### HERO SIGNALS', HERO_SIGNALS,
    '### TROOP LOSS', LOSS_SEVERITY,
    '### DEFENSE POSITIONS', DEFENSE_POSITIONS,
    '### VERDICT LABELS', VERDICT_LABELS,
    '### COACHING TEMPLATES', COACHING_TEMPLATES,
    '### SCREEN LAYOUT', SCREEN_GUIDE,
  ].join('\n');
}