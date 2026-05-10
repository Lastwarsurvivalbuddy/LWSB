// =============================================================================
// MYTHIC GEAR PRIORITY DATA
// =============================================================================
// Source: LastWarRickLe.com mythic gear priority charts (current meta)
// Last synced: May 10, 2026 (session 159)
//
// Universal priority across all troop types: Radars > Armors > Guns > Chips
// Always prioritize Radars to Lv. 5 first, even out of chart order.
//
// Per-hero gear order is the chart number 1-20 across the 4 gear slots
// (Radar / Armor / Gun / Chip) for the top 5 heroes per troop type.
// Chart numbers represent the build sequence: 1 is first, 20 is last.
// =============================================================================

// -----------------------------------------------------------------------------
// UNIVERSAL PRIORITY DOCTRINE
// -----------------------------------------------------------------------------

export const MYTHIC_GEAR_UNIVERSAL_PRIORITY = `
# Mythic Gear Priority — Universal Doctrine

This is the general priority guide for Mythic gear (Lv. 40 cap on each piece).
It may shift slightly depending on your lineup, season, and exclusive weapon priorities.

## Priority Order (all troop types):

1. **RADARS FIRST** — Get all your radars to Lv. 5 minimum.
   - Effect: 30% less critical damage taken at Lv. 5.
   - Even if you don't follow the per-hero chart order strictly, prioritize radars.
   - This is the single highest-impact mythic gear stat in the game right now.

2. **ARMORS SECOND** — After radars are at 5.
   - Effect: -15% critical hit chance taken.
   - Stacks with radars to dramatically reduce incoming crit damage.

3. **GUNS THIRD** — Situational.
   - Effect: +10% damage boost.
   - Only works when countering. If your lineup isn't built for countering,
     this slot is lower-impact than the defensive pieces above.

4. **CHIPS LAST** — Overrated.
   - Effect: -5% damage taken when countering.
   - Only works when countering, and the magnitude is small. Build this last.

## Why Defensive > Offensive:

The Mythic gear meta strongly favors survivability. Crit damage and crit chance
reduction (radars + armors) apply against ALL incoming damage. Guns and chips
only fire when your troop type is countering the attacker, so their effective
uptime is much lower.

Build defense first, offense second. Your lineup will live longer in every
matchup, and live-troop output beats dead-troop output every time.
`.trim();

// -----------------------------------------------------------------------------
// HERO ROSTERS PER TROOP TYPE (chart left-to-right order)
// -----------------------------------------------------------------------------

export const MYTHIC_GEAR_HERO_ROSTERS = {
  tank: ['Kimberly', 'Williams', 'Stetman', 'Murphy', 'Marshall'],
  missile: ['Swift', 'McGregor', 'Tesla', 'Adam', 'Fiona'],
  air: ['Dva', 'Lucius', 'Morrison', 'Schuyler', 'Carlie'],
} as const;

// -----------------------------------------------------------------------------
// PER-HERO GEAR BUILD ORDER
// -----------------------------------------------------------------------------
// Each entry is [Radar order, Armor order, Gun order, Chip order]
// Chart numbers 1-20 represent the build sequence across all 5 heroes.
// Lower number = build first.

export const MYTHIC_GEAR_BUILD_ORDER = {
  tank: {
    Kimberly:  { radar: 1, armor: 6,  gun: 11, chip: 13 },
    Williams:  { radar: 2, armor: 7,  gun: 19, chip: 16 },
    Stetman:   { radar: 3, armor: 8,  gun: 12, chip: 14 },
    Murphy:    { radar: 4, armor: 9,  gun: 20, chip: 18 },
    Marshall:  { radar: 5, armor: 10, gun: 15, chip: 17 },
  },
  missile: {
    Swift:    { radar: 1, armor: 6,  gun: 11, chip: 14 },
    McGregor: { radar: 3, armor: 8,  gun: 20, chip: 16 },
    Tesla:    { radar: 2, armor: 7,  gun: 12, chip: 15 },
    Adam:     { radar: 4, armor: 9,  gun: 19, chip: 18 },
    Fiona:    { radar: 5, armor: 10, gun: 13, chip: 17 },
  },
  air: {
    Dva:      { radar: 1, armor: 6,  gun: 11, chip: 14 },
    Lucius:   { radar: 2, armor: 7,  gun: 20, chip: 17 },
    Morrison: { radar: 3, armor: 8,  gun: 12, chip: 15 },
    Schuyler: { radar: 4, armor: 9,  gun: 13, chip: 16 },
    Carlie:   { radar: 5, armor: 10, gun: 19, chip: 18 },
  },
} as const;

// -----------------------------------------------------------------------------
// FORMATTED PER-TROOP GUIDES (for system prompt injection)
// -----------------------------------------------------------------------------

export const MYTHIC_GEAR_TANK_GUIDE = `
# Tank Mythic Gear Priority

**Top 5 Tank Heroes (build order priority):**
1. Kimberly · 2. Williams · 3. Stetman · 4. Murphy · 5. Marshall

**Build sequence (chart numbers 1-20, lowest first):**

| Hero      | Radar | Armor | Gun  | Chip |
|-----------|-------|-------|------|------|
| Kimberly  | 1     | 6     | 11   | 13   |
| Williams  | 2     | 7     | 19   | 16   |
| Stetman   | 3     | 8     | 12   | 14   |
| Murphy    | 4     | 9     | 20   | 18   |
| Marshall  | 5     | 10    | 15   | 17   |

## Reading the table:
The numbers are the order to build pieces across your full Tank lineup.
Build #1 (Kimberly's Radar) before #2 (Williams' Radar), etc.
Numbers 1-5 are all Radars (one per hero). Numbers 6-10 are all Armors.
After that, Guns and Chips interleave based on hero priority.

## Hero Substitution Note:
Some players may not be using Williams and/or Stetman (season-gated heroes).
In that case, your second Radar can go to Murphy instead, or be assigned to
the hero you're actually using — whichever is more effective for your lineup.

The per-troop ordering assumes a standard 5-hero meta lineup. If you run a
different combination, slot your gear onto the heroes you actually field
in roughly the same Radar > Armor > Gun > Chip cadence.
`.trim();

export const MYTHIC_GEAR_MISSILE_GUIDE = `
# Missile Mythic Gear Priority

**Top 5 Missile Heroes (build order priority):**
1. Swift · 2. McGregor · 3. Tesla · 4. Adam · 5. Fiona

**Build sequence (chart numbers 1-20, lowest first):**

| Hero     | Radar | Armor | Gun  | Chip |
|----------|-------|-------|------|------|
| Swift    | 1     | 6     | 11   | 14   |
| McGregor | 3     | 8     | 20   | 16   |
| Tesla    | 2     | 7     | 12   | 15   |
| Adam     | 4     | 9     | 19   | 18   |
| Fiona    | 5     | 10    | 13   | 17   |

## Reading the table:
Numbers are the build sequence across your full Missile lineup. Tesla's Radar
(2) goes before McGregor's Radar (3) despite McGregor being the #2-priority
hero overall — this reflects relative gear-piece value across the lineup, not
absolute hero ranking.

Numbers 1-5 are all Radars. Numbers 6-10 are all Armors. After that, the
Gun/Chip ordering flexes based on per-hero counter-uptime expectations.

## Hero Substitution Note:
If you're not running some of these heroes, slot the gear onto whoever you
actually field. The Radar > Armor > Gun > Chip priority order holds regardless
of which specific heroes you run.
`.trim();

export const MYTHIC_GEAR_AIR_GUIDE = `
# Air Mythic Gear Priority

**Top 5 Air Heroes (build order priority):**
1. Dva · 2. Lucius · 3. Morrison · 4. Schuyler · 5. Carlie

**Build sequence (chart numbers 1-20, lowest first):**

| Hero     | Radar | Armor | Gun  | Chip |
|----------|-------|-------|------|------|
| Dva      | 1     | 6     | 11   | 14   |
| Lucius   | 2     | 7     | 20   | 17   |
| Morrison | 3     | 8     | 12   | 15   |
| Schuyler | 4     | 9     | 13   | 16   |
| Carlie   | 5     | 10    | 19   | 18   |

## Reading the table:
Numbers are the build sequence across your full Air lineup. Numbers 1-5 are
all Radars (one per hero). Numbers 6-10 are all Armors. Then Guns and Chips
based on hero priority and counter-uptime.

## Hero Substitution Note:
If you're not running some of these heroes, slot the gear onto whoever you
actually field. The Radar > Armor > Gun > Chip priority order holds regardless
of which specific heroes you run.
`.trim();

// -----------------------------------------------------------------------------
// FAQ / COMMON QUESTIONS
// -----------------------------------------------------------------------------

export const MYTHIC_GEAR_FAQ = `
# Mythic Gear FAQ

**Q: I only have one or two Mythic gear pieces. Where do they go?**
A: Radar on your #1 hero in your strongest troop type. Always. The 30% crit
damage reduction is the highest-leverage stat in the Mythic tier.

**Q: My lineup doesn't match the chart's top 5. What do I do?**
A: Apply the same Radar > Armor > Gun > Chip priority to whoever you actually
field. The chart is a generalized meta guide — your lineup, season, and EW
priorities can shift specifics, but the priority order doesn't change.

**Q: Should I level a Radar past Lv. 5 before starting Armors?**
A: Get all your Radars to Lv. 5 first across your full lineup. After that,
move to Armors. Only after Armors are leveled should you push Radars beyond 5.
Spread the defensive baseline before deepening any single piece.

**Q: Why are Guns and Chips ranked so low if they boost damage?**
A: Both only fire when your troop type is countering the attacker. In any
given engagement, that's roughly 1-in-3 of your matchups. Defensive gear
applies in 100% of engagements. Uptime > peak.

**Q: Does this priority change in different seasons?**
A: The defensive-first doctrine holds across seasons. Specific hero
priorities within each troop type shift based on which heroes are
season-relevant or have an active EW. The chart represents current meta
top-5 lineups; substitute as your season's hero pool changes.

**Q: Mythic gear is at Lv. 40 cap, right?**
A: Each Mythic gear piece caps at Lv. 40. The "Lv. 5" priority refers to a
soft milestone within that 40-level ladder where the headline stat hits its
first major break — Radars hit -30% crit damage taken at Lv. 5, which is
why "all Radars to 5 first" is the canonical opening move.
`.trim();

// -----------------------------------------------------------------------------
// MASTER EXPORT
// -----------------------------------------------------------------------------

export function getMythicGearPrioritySummary(): string {
  return [
    MYTHIC_GEAR_UNIVERSAL_PRIORITY,
    '',
    '---',
    '',
    MYTHIC_GEAR_TANK_GUIDE,
    '',
    '---',
    '',
    MYTHIC_GEAR_MISSILE_GUIDE,
    '',
    '---',
    '',
    MYTHIC_GEAR_AIR_GUIDE,
    '',
    '---',
    '',
    MYTHIC_GEAR_FAQ,
  ].join('\n');
}