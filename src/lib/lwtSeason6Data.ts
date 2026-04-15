// src/lib/lwtSeason6Data.ts
// Season 6 (Shadow Rainforest / Lost Rainforest) guide data
// Source: cpt-hedge.com/guides/season-6-ultimate-guide — published April 13, 2026
// ✅ LIVE DATA — Season 6 launched April 13, 2026 on first batch of servers.
// This guide is a living document. Hedge updates weekly as events unlock.
// Last synced: April 15, 2026 (Weeks 3–8 strategy detail pending — update as Hedge publishes)
// Injected into buildSystemPrompt() via getSeason6Summary() when player.season === 6

// @ts-nocheck

// ─────────────────────────────────────────────────────────────────────────────
// SEASON 6 — SHADOW RAINFOREST / LOST RAINFOREST
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_OVERVIEW = `
Season 6 – Lost Rainforest (Shadow Rainforest)
Status: LIVE — launched April 13, 2026
Duration: 8 weeks
Map: Shadow Rainforest Mega Map — 8 Warzones + 1 Central Area on a single connected map (no separate warzone maps)
Layout: 100% mirror-symmetrical. Deepwood territory on one side, Wetland on the other. Identical starting positions.
Factions: Deepwood Clan (4 warzones) vs Wetland Clan (4 warzones). Neutral Great River Clan controls the center.
Faction assignment: Each Warzone is assigned to Deepwood or Wetland before the season begins. Assignment is permanent for all 8 weeks.

CORE LOOP:
Participate → Earn War Merit → Grow personally → Strengthen your Faction → Participate again.

THREE CORE PARTICIPATION SYSTEMS:
1. War Merit — personal progression track. Every action (kills, captures, reinforcements, donations, rankings) earns War Merit, advancing your personal Tier for better stipends and stat bonuses. At higher Tiers, promotion shifts from accumulation to weekly ranking competition.
2. Fishing Grounds — replaces Strongholds from prior seasons. Controlling Fishing Grounds lets your alliance fish for catch that can be donated to Alliance Skills and Faction Technology. Lightweight daily activity.
3. Faction Technology — shared faction-wide growth system. All members contribute together to unlock features and provide faction-wide buffs.

NEW SYSTEMS IN S6:

1. FACTIONS (4v4)
   - 8 Warzones split into Deepwood (4) and Wetland (4)
   - Same-faction alliances can collaborate, form pacts, share territory
   - Faction Technology: collective contributions boost faction-wide battle power
   - Faction Influence Points raise faction level, unlocking progressively stronger buffs
   - Anti-snowball mechanic ("United As One"): warzones falling behind receive additional buffs to stay competitive
   - Map is mirror-symmetrical — both factions have identical starting positions

2. FISHING GROUNDS (replaces Strongholds)
   - Occupy Fishing Grounds to unlock fishing and earn catch
   - Catch is donated to Alliance Skills and Faction Technology
   - Lightweight daily activity — does not directly affect combat strength
   - Full details: cpt-hedge.com Fishing Guide

3. WAR MERIT
   - Individual contribution system — earns through every activity in the season
   - Drives personal Tier growth → better stipends and stat bonuses
   - Higher Tiers: promotion shifts from pure accumulation to weekly ranking competition
   - Governs Trade Post access: the 10 Trade Post Governors of your Warzone are determined by War Merit rankings within the Warzone
   - Full details: cpt-hedge.com War Merit Guide

4. ALLIANCE PACTS (NEW)
   - Same-faction alliances can form pacts
   - Shared Territory: use pact partner's land to stage attacks on nearby cities
   - Coordinated Defense: support partners with reinforcements and defensive cooperation
   - Pacts only between alliances within the same faction (Deepwood ↔ Deepwood, Wetland ↔ Wetland)
   - Full details: cpt-hedge.com Alliance Pact Guide

5. ALTAR CONQUEST (starts Week 3, every Tuesday)
   - Occupy Altars to gain powerful faction buffs
   - 5 Altar tiers (Levels 0–5), each unlocking a unique Alliance skill when captured:
     Level 0 — Faction Skill Activated → Alliance Skill: Frog's Gift (Small Alliance Gift)
     Level 1 — Snake Altar → Snake Barrier → Alliance Skill: Reinforced Structures
     Level 2 — Echo Altar → Night Army → Alliance Skill: Mummy Army Summon
     Level 3 — Gust Altar → Serpent Breath → Alliance Skill: Warlord Missile
     Level 4 — Feather Altar → Thunder Feathers → Alliance Skill: Tesla Coil
     Level 5 — Treehaven Altar → Tranquil Rewind → Alliance Skill: Refresh (Cooldown Reset)

6. HERO AWAKENING (NEW)
   - New upgrade system in addition to Exclusive Weapons from prior seasons
   - Designated heroes can be upgraded to an Awakened stage once conditions are met
   - Awakening Skill replaces the original fourth skill (inherits its effects) + adds new powerful abilities
   - Greatly increases hero Power stat and overall performance
   - S6 Hero Awakening schedule:
     Week 1: Kimberly
     Week 3: DVA
     Week 6: Tesla

NEW SEASONAL BUILDINGS (removed at end of season — use them while available):
- Spore Factory — built using Rainforest Mushrooms. Boosts Spore output, which accelerates construction and upgrades of the Fungus Institute
- Fungus Institute — built using Spore. Provides Virus Resistance buffs to commanders — important defensive stat throughout the season
- Protector's Field — obtained from the Golden Realm. Summons Desert Protectors to fight alongside and defend your forces
- Bear Totem — boosts damage of Tank Heroes
- Eagle Totem — boosts damage of Aircraft Heroes
- Jaguar Totem — boosts damage of Missile Vehicle Heroes

SEASON BOOSTS (acquire before or at season start):
- Enchanted Fungus (Base Skin) — grants Hero Attack +5% and unlocks Mushroom Puff Base skill while held in Stock Attributes. Available from the Glittering Market for 1,500 Glitter Coins
- Rock the End (Decoration) — increases chance of receiving a Golden Fish Chest while fishing by up to +2.5% (0.5% per level). Available in the Decorate Your Dream event's decoration choice box

PRE-SEASON NOTES:
- Faction Selection: Faction Leader chooses which faction their group of 4 Warzones joins. Decision is permanent for the season.
- Alliance Safe Time: Configure before the season if not already done.
`;

export const SEASON6_WEEKLY_SCHEDULE = `
SEASON 6 — 8-WEEK SCHEDULE

⚠️ Week-by-week deep strategy is being added by Hedge as events unlock. The schedule below is confirmed. Detailed tactics will be updated as published.

WEEK 1 — Getting Started (Season launch week)
Key events:
- Purge Action (9 days) — kill World Map Zombies for First Kill Rewards, improve Resistance, compete on Kill Glory leaderboard
- Fishing Grounds: Stronghold Clash (14 days) — occupy Fishing Grounds to unlock fishing and begin earning catch for donations
- Beneath the Ruins — starting Day 2, break through descending challenge stages to earn Season Resources and Season-exclusive Gifts
- City Clash S6 — capturing cities grants Influence Points for your alliance and improves Season Total Rankings. War days are your window to advance
- Rainforest's Wrath (7 days) — achieve first kill of a Doom Elite to accumulate Rage Points and trigger the Devouring Flower. Rewards commanders who actively support allies
- Merit Store — opens Week 1, refreshes every week. Redeem War Merit for rewards
- Fishing Tournament — compete in fishing rankings for personal and Fishing Master rewards
- Trade Post — Lv. 1–4 Trade Posts available. First opening Governors determined by War Merit rankings within the Warzone (earn War Merit fast this week)
- Faction Clash — alliances form pacts, provide defense support, coordinate advances around faction objectives
- Hero Awakening: KIMBERLY — once requirements met, Kimberly can be upgraded to Awakened stage
Strategic focus: Establish your foundation. Earn War Merit across every system. Take Fishing Grounds to enable fishing and donations. Coordinate around faction objectives. A strong Week 1 War Merit performance directly determines Trade Post Governor access.

WEEK 2 — Sanctuary Opens
Key events:
- Fishing Grounds: Stronghold Clash continues (final days)
- Sanctuary Opening — Sanctuary opens for Contest on Sunday of Week 2
- Hero Promotion: Braz — upgrade SSR Braz to 5 Stars to promote to UR
Strategic focus: Deep strategy TBD as week unlocks on live servers.

WEEK 3 — Altar Conquest Begins
Key events:
- Altar Conquest — opens every Tuesday from Week 3 through end of season. Occupy Altars for powerful faction buffs
- Hero Awakening: DVA — DVA gets her Hero Awakening
- Beneath the Ruins — PvP mode added, allows for wagers
- Trade Post — second cycle opens
Strategic focus: Deep strategy TBD as week unlocks on live servers.

WEEK 4 — Mid-Season Consolidation
Key events:
- Altar Conquest continues (every Tuesday)
- Ranking events continue building toward back-half battles
Strategic focus: Consolidation week. Deep strategy TBD as week unlocks.

WEEK 5 — Major Battle Events Begin
Key events:
- Sanctuary Conquest — enemy faction Sanctuaries open for contest on Saturday of Week 5. First of three Sanctuary Conquest battles (Weeks 5, 6, 7)
- Outpost Conquests — offense-and-defense battle around enemy Outposts. Protect your Alliance Outpost, destroy the enemy's. First of three windows (Weeks 5, 6, 7)
- Trade Post — third cycle opens
- Altar Conquest continues (every Tuesday)
Strategic focus: Deep strategy TBD. Guides for Sanctuary Conquest and Outpost Conquests will be added as season progresses.

WEEK 6 — Second Round of Battles
Key events:
- Sanctuary Conquest — returns Saturday of Week 6 (second contest)
- Outpost Conquests — second window
- Hero Awakening: TESLA — Tesla gets his Hero Awakening
- Altar Conquest continues (every Tuesday)
Strategic focus: Deep strategy TBD as week unlocks.

WEEK 7 — Final Battles Before the Duel
Key events:
- Sanctuary Conquest — Saturday of Week 7, third and final contest
- Outpost Conquests — third and final window
- Trade Post — final cycle opens
- Altar Conquest continues (every Tuesday)
Strategic focus: Last chance to influence rankings before the Faction Duel. Push War Merit, finalize Faction Technology contributions, lock in Outpost and Sanctuary positions.

WEEK 8 — Faction Duel & Season Conclusion
Key events:
- Faction Duel — final all-out battle between Deepwood and Wetland factions. Everything built over 8 weeks (War Merit, Faction Technology, territory, Outposts) comes together here
- Season Conclusion — rewards distributed based on Alliance Influence Points rankings. Maximize Influence Points heading into settlement
Strategic focus: Deep strategy TBD. This is the climax — coordinate your entire faction.

RECURRING EVENTS:
- Altar Conquest: every Tuesday from Week 3 onward
- Trade Post cycles: Week 1, Week 3, Week 5, Week 7
- Sanctuary Conquest: Saturdays of Weeks 5, 6, 7
- Outpost Conquests: Weeks 5, 6, 7
`;

export const SEASON6_FAQ = `
SEASON 6 — FREQUENTLY ASKED QUESTIONS

Q: When did Season 6 launch?
A: Season 6: Lost Rainforest launched April 13, 2026 on the first batch of servers.

Q: What is the core theme of Season 6?
A: Season 6 shifts from server-vs-server conflict to faction-based war. 8 Warzones split into Deepwood and Wetland factions (4v4). All progression is tied to faction cooperation and individual War Merit accumulation.

Q: What are the major new features?
A: Factions (4v4), Alliance Pacts, Fishing Grounds (replacing Strongholds), War Merit system, Altar Conquest, Sanctuary Conquest, Outpost Conquest, Hero Awakening, new seasonal buildings (Spore Factory, Fungus Institute, Protector's Field, Totems), and a Faction Duel finale in Week 8.

Q: How do factions work?
A: 8 Warzones are assigned to Deepwood or Wetland before the season — assignment is permanent. Alliances within the same faction can form Alliance Pacts, share territory, and contribute to Faction Technology. Influence Points raise faction level for stronger buffs.

Q: What are Fishing Grounds?
A: They replace Strongholds from prior seasons. Occupy them to unlock fishing. Catch is donated to Alliance Skills and Faction Technology. It's a lightweight daily activity that ties into progression without directly affecting combat strength.

Q: What is War Merit?
A: Your personal contribution score for the season. Earned through kills, city captures, reinforcements, donations, and rankings. Drives personal Tier growth (better stipends and stat bonuses). Also determines Trade Post Governor eligibility — the top 10 War Merit earners in your Warzone become Governors when Trade Posts open.

Q: What are Alliance Pacts?
A: Same-faction alliances can form pacts to cooperate — use each other's territory to attack nearby cities and reinforce each other's defenses. Only within the same faction (Deepwood ↔ Deepwood or Wetland ↔ Wetland).

Q: What are Altars?
A: Capturable buildings unlocked in Week 3, active every Tuesday. 5 levels. Occupying them grants powerful Alliance skills:
Level 1: Reinforced Structures | Level 2: Mummy Army Summon | Level 3: Warlord Missile | Level 4: Tesla Coil | Level 5: Refresh (Cooldown Reset)

Q: What is Hero Awakening?
A: A new upgrade system. Designated heroes can reach an Awakened stage. The Awakening Skill replaces their fourth skill (inheriting its effects) and adds new powerful abilities. Greatly increases hero Power. S6 schedule: Kimberly (Week 1), DVA (Week 3), Tesla (Week 6).

Q: What are the new seasonal buildings?
A: Spore Factory (built with Rainforest Mushrooms — boosts Spore output), Fungus Institute (built with Spore — provides Virus Resistance buffs), Protector's Field (from Golden Realm — summons Desert Protectors). Plus Bear Totem (Tank Hero damage), Eagle Totem (Aircraft Hero damage), Jaguar Totem (Missile Vehicle Hero damage). All removed at season end.

Q: What are the key season boosts to get?
A: Enchanted Fungus base skin (1,500 Glitter Coins from Glittering Market — grants Hero Attack +5%) and Rock the End decoration (from Decorate Your Dream event — up to +2.5% Golden Fish Chest chance while fishing).

Q: When are the key battle events?
A: Sanctuary Opening: Sunday of Week 2. Altar Conquest: every Tuesday from Week 3. Outpost Conquests and Sanctuary Conquests: Saturdays of Weeks 5, 6, and 7. Trade Posts: Weeks 1, 3, 5, 7. Faction Duel: Week 8.

Q: Is the weekly strategy guide complete?
A: No — Hedge's guide is a living document updated weekly as events unlock. Week 1 strategy is available. Weeks 2–8 deep strategy will be added as the season progresses. Check cpt-hedge.com/guides/season-6-ultimate-guide for the latest.
`;

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns Season 6 summary for Buddy's system prompt.
 * Called from buildSystemPrompt() when player.season === 6.
 *
 * ⚠️ Week-by-week deep strategy is a living document — Hedge updates weekly.
 * When players ask about specific weekly tactics not yet detailed here,
 * direct them to cpt-hedge.com/guides/season-6-ultimate-guide for the latest.
 * Do NOT invent mechanics, buff values, or event details not present in this data.
 */
export function getSeason6Summary(): string {
  return `## Season 6 Guide — Lost Rainforest (Shadow Rainforest)

✅ LIVE DATA: Season 6 launched April 13, 2026.
⚠️ WEEKLY STRATEGY NOTE: Hedge's week-by-week deep strategy is updated as events unlock on live servers. Weeks 3–8 detailed tactics are still being published. When a player asks about specific tactics not covered here, acknowledge what's confirmed and direct them to cpt-hedge.com/guides/season-6-ultimate-guide for the latest. Do NOT invent mechanics, buff values, building costs, or event details not present in this data.

${SEASON6_OVERVIEW}

${SEASON6_WEEKLY_SCHEDULE}

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