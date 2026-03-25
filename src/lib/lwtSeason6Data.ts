// src/lib/lwtSeason6Data.ts
// Season 6 (Shadow Rainforest) guide data
// Source: cpt-hedge.com/guides/season-6-first-look — published March 25, 2026
// ⚠️ FIRST LOOK DATA — these are preliminary details. Specifics may change before release.
// No official release date announced. Update this file as more concrete details emerge.
// Injected into buildSystemPrompt() via getSeason6Summary() when player.season === 6

// ─────────────────────────────────────────────────────────────────────────────
// SEASON 6 — SHADOW RAINFOREST
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_OVERVIEW = `
Season 6 – Shadow Rainforest
Theme: Faction-based warfare in a rainforest world split between three clans: Deepwood, Wetland, and Great River.
Map: 8 Warzones + central Great River area on a single massive map (continues S5 multi-warzone format).
Landscapes: Deepwood and Wetland areas — different aesthetics, mirrored resources across the map.
Duration: Not yet announced.

⚠️ FIRST LOOK — All details below are official but preliminary. May change before release.

MAJOR NEW FEATURES IN S6:

1. FACTIONS (4v4)
   - 8 Warzones split into two factions: Deepwood (4 warzones) and Wetland (4 warzones)
   - Alliances within the same faction can collaborate, form pacts, and share territory
   - Faction Technology: Members collectively contribute resources to boost faction-wide battle power
   - Faction Levels: Influence Points raise your faction's level, unlocking progressively stronger buffs
   - Map Mirroring: Deepwood and Wetland areas look different but contain the same resources

2. ALTARS & CENTRAL ZONE
   - Central area held by the Great River Clan (neutral) — packed with resources and capturable Altars
   - 5 Altar tiers (levels 0–5), each unlocking a unique Alliance skill when captured
   - Altar Buff Table:
     Level 0 — Faction Skill Activated → Alliance Skill: Frog's Gift (Small Alliance Gift)
     Level 1 — Snake Altar → Snake Barrier → Alliance Skill: Reinforced Structures
     Level 2 — Echo Altar → Night Army → Alliance Skill: Mummy Army Summon
     Level 3 — Gust Altar → Serpent Breath → Alliance Skill: Warlord Missile
     Level 4 — Feather Altar → Thunder Feathers → Alliance Skill: Tesla Coil
     Level 5 — Treehaven Altar → Tranquil Rewind → Alliance Skill: Refresh (Cooldown Reset)
   - Note: Some of these skills are familiar from prior seasons. Exact mechanics not yet specified.

3. CITY CAPTURE & DESTRUCTION (NEW)
   - Cities can now be fully DESTROYED after being captured
   - Once destroyed, cities cannot be restored — permanently impacting Alliance Influence Points
   - City destruction directly affects Alliance rankings and competitive standings
   - Total War: Combat is no longer confined to the center zone — all 8 areas are active battlefields

4. ALLIANCE PACTS (NEW)
   - Same-faction alliances can form pacts to cooperate
   - Shared Territory: Use a pact partner's land to stage attacks on nearby cities
   - Coordinated Defense: Support pact partners with reinforcements and defensive cooperation
   - Pacts can only be formed between alliances within the same faction (Deepwood or Wetland)

5. FACTION INFLUENCE TIERS
   - Accumulate Capture and Destruction Influence Points to upgrade your faction's Tier
   - Each Tier level unlocks stronger Faction Buffs for all faction members
   - Anti-Snowball Mechanic — "United As One": Warzones that fall behind receive additional buffs
     to enhance their ability to counterattack, ensuring every battle remains competitive

6. HERO AWAKENING (NEW — PROMOTE PROGRESSION SYSTEM)
   - A new advancement path for designated heroes (not all heroes — specific ones TBD)
   - Awakening Stage: Heroes meeting certain conditions can be upgraded to an Awakened form
   - Awakening Skills: Replaces the original fourth skill while inheriting its effects, plus new powerful abilities
   - Major Power Boost: Greatly increases both the hero's Power stat and overall performance
   - Note: Which specific heroes qualify and what the conditions are — not yet announced

WHAT WE DON'T KNOW YET:
- Official release date
- Which heroes are eligible for Awakening and what the exact upgrade conditions are
- Exact Altar skill mechanics and numbers
- Seasonal buildings, new resources, and construction priorities
- Week-by-week schedule, city unlock timing, Exclusive Weapons
- Faction Technology contribution mechanics and buff values
- City Destruction Influence Point values and ranking weights
- Alliance Pact formation requirements and limits
`;

export const SEASON6_FAQ = `
SEASON 6 — FREQUENTLY ASKED QUESTIONS

Q: When does Season 6 release?
A: No official release date announced. This is a first-look preview only.

Q: How do factions work?
A: 8 Warzones split into Deepwood and Wetland factions (4v4). Alliances within the same faction
can collaborate, form Alliance Pacts, share territory, and contribute to Faction Technology.
Influence Points raise your faction's level, unlocking progressively stronger buffs.

Q: What are Altars?
A: A new building type in the central zone. 5 levels. Capturing them unlocks powerful Alliance skills:
Level 1: Reinforced Structures | Level 2: Mummy Army Summon | Level 3: Warlord Missile
Level 4: Tesla Coil | Level 5: Refresh (Cooldown Reset). Exact mechanics not yet detailed.

Q: What is City Destruction?
A: For the first time in Last War, cities can be fully destroyed after capture. Once destroyed,
they cannot be restored. This permanently reduces enemy Influence Points and affects rankings.

Q: What are Alliance Pacts?
A: Same-faction alliances can form pacts allowing them to use each other's territory to attack
nearby cities and support each other with reinforcements. Deepwood alliances can only pact
with other Deepwood alliances. Same for Wetland.

Q: What is Hero Awakening?
A: A new Promote Progression system allowing designated heroes to reach an Awakened stage.
The Awakening Skill replaces their original fourth skill (while inheriting its effects) and adds
new powerful abilities. Greatly increases hero Power. Which heroes qualify — TBD.

Q: Are these details final?
A: No. Official preliminary details only. Specifics may change before the actual release.
`;

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns Season 6 summary for Buddy's system prompt.
 * Called from buildSystemPrompt() when player.season === 6.
 * 
 * ⚠️ Always include the FIRST LOOK caveat — Buddy must not present unconfirmed
 * details as established fact. These are official previews, not finalized mechanics.
 */
export function getSeason6Summary(): string {
  return `## Season 6 Guide — Shadow Rainforest (First Look)

⚠️ IMPORTANT — FIRST LOOK DATA ONLY: Season 6 details are official but preliminary.
Mechanics, schedules, and specifics may change before release. No release date announced.
When discussing S6 with players, present these as "what's been announced so far" — not confirmed final mechanics.
Do NOT invent city unlock schedules, seasonal building names, resource names, week-by-week events, or Exclusive Weapon schedules.
If a player asks about something not in this data, say it hasn't been announced yet.

${SEASON6_OVERVIEW}

${SEASON6_FAQ}`;
}

/**
 * Master export — called from buildSystemPrompt() in buddy/route.ts.
 * Returns full Season 6 guide when player.season === 6, empty string otherwise.
 * (Seasons 0–3: lwtSeasonData.ts | Seasons 4–5: lwtSeason45Data.ts)
 */
export function getSeasonDataSummary6(season: number | null | undefined): string {
  if (season === 6) return getSeason6Summary();
  return '';
}