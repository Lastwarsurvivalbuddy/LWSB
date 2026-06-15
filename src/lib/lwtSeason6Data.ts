// src/lib/lwtSeason6Data.ts
// Season 6 (Shadow Rainforest / Lost Rainforest) guide data
// Source: cpt-hedge.com — Powered by cpt-hedge.com per partnership agreement §3.4
//
// Synced from these Hedge guides (May 5 baseline · May 23 refresh · June 15 refresh):
//   • /guides/season-6-ultimate-guide
//   • /guides/season-6-war-merit
//   • /guides/season-6-faction-war-ranks
//   • /guides/season-6-faction-tech              ← added Jun 15
//   • /guides/season-6-alliance-pact
//   • /guides/season-6-fishing                   ← added Jun 15
//   • /guides/season-6-blessed-fish              ← added Jun 15
//   • /guides/season-6-stronghold-conquest       ← added Jun 15
//   • /guides/season-6-altar-conquest
//   • /guides/season-6-alliance-skills           ← added Jun 15
//   • /guides/season-6-city-clash-faction-clash  ← added Jun 15
//   • /guides/season-6-warzone-outpost
//   • /guides/season-6-sanctuary-duel
//   • /guides/season-6-merit-shop                ← added Jun 15
//   • /guides/season-6-seasonal-resources        ← added Jun 15
//   • /guides/season-6-purge-action              ← added Jun 15
//   • /guides/season-6-rainforests-wrath         ← added Jun 15
//   • /guides/season-6-beneath-the-ruins         ← added Jun 15
//   • /guides/season-6-tactics-cards
//   • /guides/season-6-global-expedition
//   • /guides/season-6-kim-awakening
//   • /guides/season-6-dva-awakening
//   • /guides/season-6-tesla-awakening           ← added Jun 15
//   • /guides/season-6-braz-ur-promotion
//   • /guides/season-6-faction-duel              ← added Jun 15
//   • /guides/season-6-alliance-settlement-rewards ← added Jun 15
//   • /guides/hero-awakening
//
// ✅ LIVE DATA — Season 6 launched April 13, 2026 on first batch of servers (8-week season).
// First-batch servers are at/near settlement (~June 8). Later server batches span the whole
// 8-week arc, so full-arc coverage matters. Re-pull on Hedge Discord guide announcements.
// Last synced: June 15, 2026 (Session 161 — end-of-season comprehensive sync)
// Injected into buildSystemPrompt() via getSeason6Summary() when player.season === 6
//
// SESSION 161 CHANGE NOTES:
//   • ADDED 13 new sections: Faction Tech, Fishing, Blessed Fish, Stronghold Conquest,
//     Alliance Skills, City/Faction Clash (Destroy), War Merit Shop, Seasonal Resources,
//     Purge Action, Rainforest's Wrath, Beneath the Ruins, Tesla Awakening, Faction Duel,
//     Alliance Settlement Rewards
//   • CLOSED TBDs: Kim Stars 3-5 Damage Reduction (now 4.00/4.50/5.00),
//     DVA full DR ladder (2.50→5.00), Tesla full DR ladder
//   • ⚠️ SCHEDULE CONFLICT FLAGGED: Hedge's ultimate guide was revised to a schedule one
//     week earlier than several dedicated guides. Hedge is now INTERNALLY INCONSISTENT:
//       - Outpost placement: dedicated Outpost guide says Weeks 3-6; ultimate guide says 4-7
//       - Global Expedition: hero guides say Weeks 2/4/6; ultimate guide says 1(d4)/3/5
//       - Tesla Awakening: Tesla guide + ultimate say Week 5; Kim/DVA guides say Week 6
//       - Faction Duel: Faction Duel guide + ultimate body say Week 7; ultimate FAQ says Week 8
//     HANDLING: dedicated-guide numbers kept as primary per section; ultimate-guide divergence
//     flagged inline. Buddy must tell players to confirm exact weeks in the in-game event
//     calendar (Hedge's own ultimate guide says the same).

// @ts-nocheck

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ SCHEDULE-CONFLICT NOTE — read before answering any "what week is X" question
// ─────────────────────────────────────────────────────────────────────────────
// Hedge's guides disagree on the exact week of several back-half events (see CHANGE
// NOTES above). When a player asks for a precise week/day, give the value(s) shown in
// the relevant section but add: "Hedge's guides list slightly different weeks for some
// late-season events — confirm against your in-game event calendar, which is authoritative."
// Do NOT present a contested week as if it were certain.

export const SEASON6_SCHEDULE_CONFLICT = `
SEASON 6 — SCHEDULE CONFLICT ADVISORY (Powered by cpt-hedge.com)

Hedge revised the ultimate-guide roadmap to a schedule about one week earlier than several
of its dedicated event guides, and did not reconcile them. Known disagreements:

| Event                  | Dedicated guide(s)        | Ultimate guide        |
|------------------------|---------------------------|-----------------------|
| Outpost placement      | Weeks 3 / 4 / 5 / 6       | Weeks 4 / 5 / 6 / 7   |
| Outpost Conquest       | Weeks 5-7 (also "W4+")    | Weeks 5-7             |
| Global Expedition rds  | Weeks 2 / 4 / 6 (hero gds)| Week 1(Day4) / 3 / 5  |
| Tesla Awakening        | Week 5 (Tesla guide)      | Week 5                |
| Faction Duel           | Week 7 (Faction Duel gd)  | Week 7 body / W8 FAQ  |

When a player asks for an exact week or day, relay the value but tell them to verify in the
in-game event calendar — Hedge's own ultimate guide says the in-game display is authoritative.
Never state a contested week as certain.
`;

// ─────────────────────────────────────────────────────────────────────────────
// SEASON 6 — SHADOW RAINFOREST / LOST RAINFOREST  (overview)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_OVERVIEW = `
Season 6 – Lost Rainforest (Shadow Rainforest)
Status: LIVE — launched April 13, 2026 (first batch). 8-week season.
Map: Shadow Rainforest Mega Map — 8 Warzones + 1 Central Area on a single connected map.
Layout: 100% mirror-symmetrical. Deepwood territory on one side, Wetland on the other. Identical starting positions.
Factions: Deepwood Clan (4 warzones) vs Wetland Clan (4 warzones). Neutral Great River Clan controls the center.
Faction assignment: Each Warzone is assigned to Deepwood or Wetland before the season; permanent for all 8 weeks.
Faction formation (pre-season): The two strongest servers become faction leaders. Each picks 0 or 1 — combined parity (even/odd) decides which group becomes Deepwood vs Wetland. Remaining servers auto-assigned.

CORE LOOP:
Participate → Earn War Merit → Grow personally → Strengthen your Faction → Participate again.

THREE CORE PARTICIPATION SYSTEMS:
1. War Merit — personal cumulative progression (every activity earns it). Drives 19-rank Faction War Rank promotion for Daily Stipends, stat bonuses, settlement rewards. (See Faction War Ranks + War Merit sections.)
2. Fishing Grounds — replaces Strongholds. Control them to fish for catch, donated to Alliance Skills + Faction Technology. Lightweight daily activity. (See Fishing + Stronghold Conquest sections.)
3. Faction Technology — shared faction-wide growth from pooled donations; unlocks Faction Functions + faction-wide buffs, plus War Spoils passive mushroom income. (See Faction Technology section.)

NEW SYSTEMS IN S6:

1. FACTIONS (4v4)
   - 8 Warzones split into Deepwood (4) and Wetland (4)
   - Same-faction alliances can collaborate, form pacts, share territory
   - Faction Technology: collective donations boost faction-wide power + unlock Functions (incl. War Spoils passive Rainforest Mushroom income from owned cities)
   - Faction Influence Points (Occupied + Destruction) raise faction buff strength
   - Anti-snowball: warzones falling behind get "Final Stand" Warzone Integrity buffs to stay competitive
   - FACTION BATTLEFIELD RULES:
       - Internal Faction Protection: cannot attack cities held by your own faction's alliances
       - ENEMY CITY DESTRUCTION (S6 mechanic): attacking enemy-warzone cities DESTROYS them (permanent, no restore) rather than capturing. Powerful way to permanently cut enemy Influence Points/rankings. (Full IP math in City/Faction Clash section.)

2. ALLIANCE PACTS — formal same-faction cooperation. Shared territory, defense support, reinforcement, 200-person shared chat. Requires a mutually adjacent Handshake Point. 1 pact at a time. (See Alliance Pact section.)

3. FISHING GROUNDS (replace Strongholds) — occupy to fish; donate catch to Alliance Skills + Faction Tech (also generates Alliance Energy + War Merit). Lightweight daily; no direct combat effect. (See Fishing + Blessed Fish + Stronghold Conquest.)

4. WAR MERIT + FACTION WAR RANKS — cumulative personal score → 19 ranks (Recruit → Chieftain), Daily Stipend + passive stat bonuses each rank. War Merit Shop spend does NOT reduce leaderboard total. (See Faction War Ranks + War Merit Shop.)

5. ALTAR CONQUEST (from Week 3, Tuesdays 12:00 server, 1-hour) — 5 Altars in the central Great River Clan zone; capturing one unlocks an Alliance Skill for Faction Clash. Hold max 3; two mutually exclusive pairs. (See Altar Conquest + Alliance Skills.)

6. WARZONE OUTPOSTS — 4 per Warzone at Sanctuary corners. One-time resources (destroyed = gone forever, no rebuild). Placement one per week.
   ⚠️ PLACEMENT WEEKS CONTESTED: dedicated Outpost guide says Weeks 3/4/5/6; ultimate guide says Weeks 4/5/6/7. Conquest Weeks 5-7. Critical for Sanctuary Duel attack routes. (See Warzone Outpost section + Schedule-Conflict advisory.)

7. SANCTUARY DUEL (Saturdays of Weeks 5/6/7) — centerpiece battle event, highest single-event Influence Point swing. Eligibility via territory connection, Outpost connection, or Pact partner. (See Sanctuary Duel section.)

8. HERO AWAKENING — new upgrade alongside Exclusive Weapons. Replaces the hero's Expertise (4th) skill with an Awakening Skill that inherits its effects + adds abilities; big HP/Atk/Def stat boosts + Damage Reduction scaling with Awakening Stars.
   UNLOCK PREREQS (all 3): hero at 5 Stars · its Exclusive Weapon at Lv.20+ · 50 named Awakening Shards for that hero.
   S6 SCHEDULE: Week 1 = Kimberly · Week 3 = DVA · Week 5 = Tesla.
   ⚠️ TESLA WEEK CONTESTED: Tesla's own guide + the ultimate guide say Week 5; older Kim/DVA guides say Week 6. Treat as Week 5, confirm in-game.
   Day-1 unlock is NOT possible (paid shard packs removed). Shards from Hero Awakening Trial (up to 10) + Global Expedition. (See Hero Awakening Detail, DVA Awakening, Tesla Awakening.)

9. TACTICS CARDS — S6 CHANGES (significant)
   - 4+1 (Hybrid Squad) card REMOVED — mixed-squad meta gone; pure single-type squads become standard
   - 3 new Universal cards (PvP + Global Expedition only): Aftermath Burst (Missile), Dimensional Crit (Tank), Frontal Suppression (Aircraft)
   - Card max level raised to 12 (was 7), +3 possible from UR "Tactics Card Level Up" → cap 15
   - Counter Reversal more important than ever. (See Tactics Cards section.)

10. EW SHARDS IN HERO RECRUITMENT — tavern Hero Recruitment now includes Exclusive Weapon Shards for Kim, DVA, Tesla (regular Recruitment Tickets). Save tickets ahead of S6. Supports the EW Lv.20 Awakening prereq.

11. CROSS-WARZONE MOVEMENT (S6 specific)
    - Week 1: teleport only within your own warzone
    - Week 2+: Advanced Teleporter / Alliance Teleporter enable cross-warzone moves (Expedition Assembly Point unlocks Alliance Teleporter)
    - Returning home also needs a teleport item
    - Most Daily Events completable in ANY warzone
    - Saturday War Days: free teleports if enemy server is NOT in your season grouping; free cross-warzone teleport between different season groups

NEW SEASONAL BUILDINGS (removed at season end):
- Spore Factory — built with Rainforest Mushrooms; boosts Spore output (accelerates Fungus Institute). Tip: level each to 10 to unlock the next; then level equally.
- Fungus Institute — built with Spore; grants Virus Resistance (key defensive stat all season). AT LEVEL 4 unlocks the War Merit Shop. Also the building used to activate Blessed Fish.
- Protector's Field — from the Golden Realm; summons Desert Protectors to defend.
- Bear Totem (Tank dmg) · Eagle Totem (Aircraft dmg) · Jaguar Totem (Missile Vehicle dmg) — upgraded with Spore from Week 3.

SEASON BOOSTS (get before/at season start):
- Enchanted Fungus (Base Skin) — Hero Attack +5% + Mushroom Puff base skill while in Stock Attributes. Glittering Market, 1,500 Glitter Coins.
- Rock the End (Decoration) — +Golden Fish Chest chance while fishing, up to +2.5% (0.5%/level). From the Decorate Your Dream event decoration choice box.

PRE-SEASON: Faction Selection (Leader picks faction for their 4 Warzones, permanent) · configure Alliance Safe Time.
`;

// ─────────────────────────────────────────────────────────────────────────────
// FACTION WAR RANKS — full 19-rank table (unchanged from v159)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_FACTION_WAR_RANKS = `
SEASON 6 — FACTION WAR RANKS (Powered by cpt-hedge.com)

19 ranks total. First 15 advance by hitting Total War Merit thresholds.
Final 4 (Bloodguard, Centurion, Legate, Chieftain) are POSITION-BASED — top of the warzone Total War Merit ranking.
Both factions use identical thresholds and rewards. Rank names prefixed by faction (Deepwood Hunter I = Wetland Hunter I).

| Rank          | Hero Stat Boost | Virus Resist | Damage Reduction | Requirement to reach next rank |
|---------------|-----------------|--------------|------------------|--------------------------------|
| Recruit       | 1%              | —            | —                | 12,000 War Merit               |
| Scout I       | 2%              | —            | —                | 29,000 War Merit               |
| Scout II      | 3%              | —            | —                | 58,000 War Merit               |
| Vanguard I    | 4%              | 250          | —                | 108,000 War Merit · Shop unlock|
| Vanguard II   | 5%              | 250          | —                | 159,000 War Merit              |
| Vanguard III  | 6%              | 250          | —                | 211,000 War Merit              |
| Hunter I      | 7%              | 500          | —                | 264,000 War Merit              |
| Hunter II     | 8%              | 500          | —                | 318,000 War Merit              |
| Hunter III    | 9%              | 500          | —                | 373,000 War Merit              |
| Warrior I     | 10%             | 500          | —                | 429,000 War Merit · Shop unlock|
| Warrior II    | 11%             | 500          | —                | 487,000 War Merit              |
| Warrior III   | 12%             | 500          | —                | 546,000 War Merit              |
| Elite I       | 13%             | 500          | —                | 606,000 War Merit              |
| Elite II      | 14%             | 500          | —                | 667,000 War Merit              |
| Elite III     | 15%             | 500          | —                | Top 100 in Warzone · Shop unlock|
| Bloodguard    | 15%             | 500          | 1.25%            | Top 60 in Warzone              |
| Centurion     | 15%             | 500          | 2.50%            | Top 30 in Warzone              |
| Legate        | 15%             | 500          | 3.75%            | Top 10 in Warzone              |
| Chieftain     | 15%             | 500          | 5.00%            | —                              |

KEY MILESTONE: Elite I unlocks 10 Gear Blueprints (MR) at settlement — "the most important milestone for most players investing in gear progression." Elite I = 546,000 cumulative War Merit.

DAILY STIPEND scales with rank (claim once/day + once per promotion; unclaimed sent via Mail):
| Rank          | Drone Parts | Alliance Pts (500) | Resource Chest (SR) | Diamonds (10) | 5m Speed-ups |
|---------------|-------------|--------------------|--------------------|--------------|--------------|
| Recruit       | 2           | 3                  | 2                  | 2            | 10           |
| Scout I       | 2           | 3                  | 2                  | 2            | 12           |
| Scout II      | 3           | 3                  | 3                  | 3            | 14           |
| Vanguard I    | 3           | 3                  | 3                  | 3            | 16           |
| Vanguard II   | 4           | 3                  | 4                  | 4            | 18           |
| Vanguard III  | 4           | 3                  | 4                  | 4            | 20           |
| Hunter I      | 5           | 3                  | 5                  | 5            | 22           |
| Hunter II     | 5           | 3                  | 5                  | 5            | 24           |
| Hunter III    | 6           | 3                  | 6                  | 6            | 26           |
| Warrior I     | 6           | 3                  | 6                  | 6            | 28           |
| Warrior II    | 7           | 4                  | 7                  | 7            | 30           |
| Warrior III   | 7           | 4                  | 7                  | 7            | 32           |
| Elite I       | 8           | 4                  | 8                  | 8            | 34           |
| Elite II      | 8           | 4                  | 8                  | 8            | 36           |
| Elite III     | 9           | 4                  | 9                  | 9            | 38           |
| Bloodguard    | 9           | 4                  | 9                  | 9            | 40           |
| Centurion     | 10          | 4                  | 10                 | 10           | 42           |
| Legate        | 10          | 4                  | 10                 | 10           | 44           |
| Chieftain     | 12          | 4                  | 12                 | 12           | 50           |

WAR MERIT SOURCES (4 categories):
1. Combat & Advancement — first kill of Doom Elite / Rainforest Zombies (once per level), first capture of a Fishing Grounds or City
2. Events & Rankings — Purge Action (first 2 weeks), Beneath the Ruins daily rankings (Day 2+, PvP wagers Week 2+)
3. Faction Confrontation — destroying enemy Faction Cities, Faction Clash Kill/Defense Rankings
4. Contribution & Construction — donating Catch to Alliance Skills + Faction Technology

ELITE-RANK COMPETITION:
- Below Elite III: pure accumulation, can't be lost
- Bloodguard/Centurion/Legate/Chieftain: position-based, can shift; demotion possible. Top-rank chasers must stay active week-to-week.

WAR MERIT SHOP unlocks once Fungus Institute reaches Level 4. Spending does NOT reduce leaderboard total. Three rank-gated shop expansions: Vanguard I, Warrior I, Elite III. (See War Merit Shop section.)

COSMETIC REWARDS: higher ranks unlock Title / Avatar Frame / Nameplate. Top 4 ranks get a 7-day version on rank-up + 30-day at settlement. Chieftain all three; Legate Title+Frame; Bloodguard/Centurion Title only. (Warrior I Wetland settlement also includes "Emote: Playful Spray.")
`;

// ─────────────────────────────────────────────────────────────────────────────
// FACTION TECHNOLOGY — NEW SECTION (added Jun 15, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_FACTION_TECH = `
SEASON 6 — FACTION TECHNOLOGY (Powered by cpt-hedge.com)

The faction-wide shared-growth engine. Every member of a Faction donates to a single pooled total; reaching thresholds auto-unlocks Faction Functions and Faction Buffs that apply EQUALLY to all members of the faction (no per-alliance distinction, no per-player cap). One of S6's three core systems.

ACCESS: Alliance button → Faction Tech. Each tech node shows current level, Tech EXP to next level, % progress, the next unlock, your daily Donation Count, and your per-donation reward (Tech EXP + War Merit).

DONATING:
- Donate button opens the Donate Catch screen (your fishing warehouse). Tap items to select (hold to donate continuously) or use Quick Donate to donate everything up to your daily limit.
- Donations Remaining recharges 1 every 40 minutes, max 120 saved.
- Each donation = Tech EXP for the faction + War Merit for you.
- NOTE: catch can only be donated once — you choose Faction Tech OR Alliance Energy with a given donation. Rewards to you are the same either way.

BASIC RULES:
- Effects apply automatically the moment thresholds are met (no claim step).
- Does NOT carry over between seasons; effects valid only within the current season group.
- Each faction has independent Tech progress.
- The Alliance Leader with the highest Influence Points in the faction can set a RECOMMENDED Tech direction (like Alliance Tech) to focus donations.

TECHNOLOGY EFFECTS:
- Unlocks Faction Functions (cooperation mechanisms) as it progresses.
- Frog's Gifts (the first Alliance Skill) is unlocked via Faction Tech rather than an Altar — available from Week 1, earlier than the altar skills.
- Faction Buff strength ALSO scales with two metrics: Faction Occupied Influence Points (controlling territory) + Faction Destruction Influence Points (destroying enemy cities). Fighting well → more IP → stronger buffs → more capable faction (feedback loop).

PACT-RELATED UNLOCK (critical, prioritize early):
- A certain Faction Tech stage unlocks the Internal Faction Pact abilities that the Alliance Pact system depends on: advancing through allied territory + Defense Support for allied cities. Without this, Alliance Pacts can't be used to full potential.
- Defense Support March Acceleration: providing Defense Support to allied buildings increases march speed.

WAR SPOILS (passive Rainforest Mushroom income — high priority early):
- Sits in the SECOND ROW of the tech tree, alongside the Frog skill. PRIORITIZE IT OVER THE FROG SKILL so it's active before the first cities are captured on Wednesday of Week 1.
- Once unlocked, a War Spoils button appears bottom-right of the Faction Tech screen.
- Every city your faction owns (across all 4 Warzones) generates Rainforest Mushrooms/hour into one pool, claimed MANUALLY (no reminder):
    Level 1 city: 90/h · Level 2: 100/h · Level 3: 110/h
- Strongest in Weeks 1-2; income drops from Week 3 as Faction Clash starts destroying cities. Claim daily.

ALLIANCE ENERGY CAP (also raised by Faction Tech — see Alliance Skills section):
- Base 350,000 → 700,000 (first Faction Tech energy unlock) → 1,400,000 (second).

TIPS:
1. Unlock War Spoils before first cities are taken (Wed of Week 1). Frog skill can wait.
2. Claim War Spoils daily (no reminder).
3. Hit the Pact-abilities unlock as early as possible — it gates much of S6 cooperative play.
4. Follow your faction's recommended Tech direction.
5. Donate fishing catch consistently (Quick Donate); it earns War Merit too.
6. Remember buff strength is tied to Occupied + Destruction Influence Points, not just raw Tech level.
7. Tech resets at season end — don't "save" donations.
`;

// ─────────────────────────────────────────────────────────────────────────────
// ALLIANCE PACT (unchanged from v159)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_ALLIANCE_PACT = `
SEASON 6 — ALLIANCE PACT (Powered by cpt-hedge.com)

A formal cooperation agreement between two alliances IN THE SAME FACTION. Enables shared territory, mutual defense, reinforcement.

WHO CAN INITIATE: Alliance Leader OR Recruiter only. Both sides must confirm.

PACT REQUIREMENTS (all):
1. Both alliances in the same season grouping AND same faction (Deepwood↔Deepwood or Wetland↔Wetland)
2. Both maintain at least one mutually adjacent territory — the HANDSHAKE POINT
3. Neither alliance has an active Alliance Pact cooldown
4. NOT a War Declaration Day (Wed/Sat — cannot initiate)
5. Each alliance holds only 1 Alliance Pact at a time

THE HANDSHAKE POINT:
- The point where both alliances' territories are mutually adjacent.
- Once the pact forms, ally's Alliance Lands count as adjacent to yours — march through ally territory, open new routes.
- IF LOST (enemy captures the adjacent territory): pact is IMMEDIATELY invalidated, but this does NOT trigger cooldown — re-form once adjacency is re-established.

COOLDOWN / CANCELLATION:
- 3-day cooldown ONLY after SUCCESSFUL formation.
- Either side can cancel anytime → no cooldown. Losing the Handshake Point → no cooldown.

WHEN A PACT ENDS (any reason): reinforcement troops in allied cities are recalled; shared Friendly Alliance Group Chat closes.

COOPERATION FEATURES (active pact):
1. SHARED TERRITORY CONNECTIVITY — use each other's territory as your own; expand routes, bypass terrain.
2. DEFENSE SUPPORT — for ally's occupied Cities, Outposts, the Capitol, and Outpost Conquest battles. One of the highest-value benefits.
3. SHARED ALLIANCE WAR INFO — see ally garrison info; Friendly Alliance Pin on map; combined alliance chat up to 200 people.
4. DEFENSE SUPPORT MARCH ACCELERATION — increased march speed when providing Defense Support to allied buildings/cities.
5. REINFORCE MECHANISM — reinforce each other's cities/buildings directly. NOT the same as Garrison: reinforcement troops stay under control of BOTH alliances; either R4/R5 can recall. Requirements: active pact · reinforcement cap not reached · target NOT in Destroy status · cross-warzone depends on battlefield rules in effect.

STRATEGIC DOCTRINE:
1. Protect your Handshake Point — the pact is only as strong as that connection.
2. Time pact formations carefully — 3-day cooldown is significant; pick the most valuable connectivity.
3. Plan around War Days — can't initiate Wed/Sat.
4. Use pact territory for tactical routing — land connectivity > raw power.
5. Reinforce proactively — march-speed bonus is a proactive tool.
6. Faction war is won collectively — a well-placed pact partner can be worth more than raw power.

PACT EXTENSION FOR SANCTUARY DUEL: a pact partner of an eligible alliance can participate in Sanctuary Conquest — but ONLY the pact partner gets eligibility, not all alliances in its warzone. Plan pacts ahead of Week 5.
`;

// ─────────────────────────────────────────────────────────────────────────────
// FISHING — NEW SECTION (added Jun 15, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_FISHING = `
SEASON 6 — FISHING (Powered by cpt-hedge.com)

Lightweight daily activity replacing Strongholds with Fishing Grounds. Doesn't affect combat power, but feeds Alliance + Faction progression via catch donations and earns War Merit. (Capturing/holding Fishing Grounds = see Stronghold Conquest section.)

FISHING GROUNDS:
- Capturable map locations controlled by alliances within a faction.
- You can fish at ANY Fishing Ground owned by YOUR faction, across warzones (incl. allied alliances' grounds).
- Fish SPECIES at a ground are fixed by the ground's INITIAL faction + its level — they never change based on who currently holds it.

CONDITIONS TO CAST:
- Bait (1 per cast), from a daily Visitor.
- Golden Bait: from Profession Specialization (active skill, 1 per use, 23.5h cooldown — use daily). Also 20 Golden Bait in the War Merit Store (replaced the old Giant-Crocodile drop; only the player who FOUND the Giant Crocodile still gets 1 Golden Bait on its defeat). Improves chance of rarer species.

MECHANIC:
- Each cast costs 1 Bait. Multi Fishing (cast 5 at once) requires a Seasonal Skill to unlock.
- Casting Timing Bar: stop the indicator in the highlighted zone. It ONLY affects fish WEIGHT — NOT species or catch probability.
- Reel-in: tap during the brief countdown or the fish escapes.
- Small chance of a Golden Fishing Chest while fishing (improved by a season skill + Rock the End decoration, 0.5%/level up to 2.5%). Chest = random item, small chance of Emperor's Golden Fish (0.1%) or a Rock the End decoration (0.9%).

FISH WEIGHT vs REWARDS:
- Same-type fish give the SAME donation energy regardless of weight. Weight only affects Fish Rankings (global, per species). Don't sweat the Timing Bar unless chasing rankings.

GIANT CROCODILE (random encounter on any cast):
- Spawns near your base; only the spawning alliance can attack it. Level = the Fishing Ground's level; suggested power is consistent regardless of level.
- 10 squads × ~50M power each; each member limited to 5 rounds. ~2 strong (60M+) members can one-hit-clear; a full 50-60M rally beats it easily. ~1 hour window or it despawns with no rewards.
- Founder rewards (via Mail): Golden Bait + Golden Fish Chest (+ a few 5m speed-ups for the killing blow).

STRANDED FISH (the crocodile's drop):
- Fish Bags scattered at the defeat location, claimable by ANYONE (not just the spawner), up to 10/day.
- Each = a random fish from that ground's clan + level (incl. the opposing clan at that ground). Good for filling the Fishing Index. Fish from Bags do NOT count toward weight rankings.

FISHING INDEX:
- All species across all grounds, grouped by Clan (Wetland/Deepwood/Great River) and level. 66 total species. Uncaught = silhouettes.
- Completing the full index → Ecological Expert title (temporary cosmetic).

CONFISCATION (cross-alliance fishing):
- You may fish in another same-faction alliance's ground, but your catch can be Confiscated.
- Confiscated fish: do NOT enter your warehouse; DO still unlock Fish Index entries + count toward Fish Rankings; are converted into Alliance Energy for the occupying alliance (subject to energy cap).
- Designed to encourage intra-faction cooperation — alliances invite faction members to fish their grounds for free Alliance Energy.

DONATING CATCH:
- Donate to Faction Technology (and Alliance Skills) for Tech EXP + War Merit. Type of fish (not weight) determines donation value. Use Quick Donate to clear the warehouse.
- War Merit per donation depends on the fish's RARITY within its zone: common ~350 Merit, rarest ~3,900 Merit. War Merit is the SAME regardless of ground level (only energy/Tech values rise slightly at higher-level grounds). So for War Merit, rarer fish matter, but higher-level grounds give no Merit bonus.
- NOTE: the rarest (6th, starred) fish per zone CANNOT be donated — those are Blessed Fish (own system).

TIPS: activate Golden Bait daily · check the Index before spending bait · Quick Donate after each session · fish near the Central Area for heavier catches (rankings only) · invite faction members to your grounds (free Alliance Energy via Confiscation) · rally the Giant Crocodile fast · claim Stranded Fish daily (10/day).
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLESSED FISH — NEW SECTION (added Jun 15, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_BLESSED_FISH = `
SEASON 6 — BLESSED FISH (Powered by cpt-hedge.com)

Special fish caught through normal Fishing that act as consumable blessings (like S5's Special Coffee) — one active at a time. Higher-level Fishing Grounds give stronger blessings.

WHAT THEY ARE:
- Each Fishing Ground LEVEL has exactly one species designated as a Blessed Fish.
- Catching it (via normal fishing) adds it to your inventory as a usable blessing item.

HOW TO USE:
- Used from the FUNGUS INSTITUTE building. Tap it → Blessed Fish menu → select → Use (activates immediately). Active blessing + remaining duration show in Status Overview.

BUFFS (depend on the ground level the fish was caught at):
- Lower-level grounds: Construction + Research Speed only, +2.00% up to +5.00%.
- Higher-level grounds: Construction + Research Speed AND Hero Attack (hero attack +4.00% to +8.00%).

RULES:
- ONE blessing active at a time — using any Blessed Fish (same or different) immediately OVERWRITES the current one. No stacking. Don't burn a lesser fish over a strong running blessing.
- Blessed Fish do NOT appear in Faction Tech / Alliance Tech donation screens — they can't be accidentally Quick-Donated.
- No hold cap, but no reason to hoard — use regularly to keep a blessing active.

TIPS: prioritize higher-level grounds for stronger blessings · time usage (speed blessing before a long build, hero-attack blessing before a fight) · buy bait from the War Merit Shop to fuel fishing runs.
`;

// ─────────────────────────────────────────────────────────────────────────────
// STRONGHOLD CONQUEST — NEW SECTION (added Jun 15, 2026)
// Conquest/holding side of Fishing Grounds
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_STRONGHOLD_CONQUEST = `
SEASON 6 — STRONGHOLD CONQUEST (Powered by cpt-hedge.com)

The conquest side of Fishing Grounds (Strongholds): capturing, reinforcing, holding during Faction Clash. (Catch-and-donate side = Fishing section.)

CAPTURING:
- Speed depends on numbers committed: ~450s (7.5 min) with 20 people; ~400s (~6.5 min) with 30 people. More bodies = faster.

CROSS-WARZONE (from Week 2 reset, when cross-warzone teleport opens — Faction Clash itself still starts Week 3):
- UNOWNED Strongholds: takeable any day (no day restriction) as long as no active timer.
- OWNED Strongholds: only attackable on War Declaration Days (Wed/Sat), outside the owner's Safe Time.
- (Week 2 in-game goal text implies captures unlock only after the goal — untrue; you can take strongholds cross-warzone right after Week 2 reset.)

ALLIANCE PACT REINFORCEMENT (same Reinforce mechanism as cities):
- Combined capture progress: pact allies' progress adds to ONE shared total (continues from where ally left off).
- Individual ownership counter: each alliance keeps its own counter behind the shared total; at 100% (or timer end), ownership goes to the alliance with the highest individual counter that still meets eligibility.
- No friendly fire between pact allies (strongholds or cities).
- To HELP a pact ally (even reinforcing their owned stronghold) you need a remaining capture slot for the day. (You can always reinforce your OWN strongholds without a slot.)

WAR FEVER & SHIELDING:
- Attacking PvE defenders around a stronghold while shielded = OK (PvE, no War Fever).
- The FIRST attack on a stronghold requires that one commander to unshield (counts as an Attack). Only one person unshields for this.
- Reinforcing is always allowed while shielded (blue reinforce button = safe).
- Attacking an enemy-faction-occupied stronghold gives War Fever and removes your shield.

SQUADS CAN FLIP ROLE MID-MARCH:
- If you sent a REINFORCE and ownership flips before arrival, that squad can become an ATTACK (you'll lose your shield) — be ready to recall.
- If you were ATTACKING and ownership flips, you may not be able to convert to reinforce — send a fresh squad.

LIMITS & REQUIREMENTS:
- Capture up to 2 strongholds per day.
- Hold limit: start at max 4; +1 per city you own → max 12 with 8 cities. Losing cities (to enemy destruction) REDUCES the limit — you may need to drop strongholds to free space before expected city attacks.
- At your limit, you can't take more that day; a mid-capture when you hit the cap kicks out all your members.
- Need ADJACENT LAND to take a stronghold; losing adjacency mid-fight kicks you out until regained.

TIPS: commit bigger numbers to capture faster · coordinate combined captures early with pact allies (individual counter decides ownership) · don't shield before attacking (initial attack needs War Fever) · track ownership while marches are in flight · plan garrison assignments around your broader territory health.
`;

// ─────────────────────────────────────────────────────────────────────────────
// ALTAR CONQUEST (unchanged from v159; cross-ref Alliance Skills for skill effects)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_ALTAR_CONQUEST = `
SEASON 6 — ALTAR CONQUEST (Powered by cpt-hedge.com)

WHEN: Every Tuesday at 12:00 server time, starting Week 3. Each Conquest phase = exactly 1 hour.
WHERE: Central Area held by the Great River Clan.
WHO BENEFITS: capturing alliance — Alliance Skills usable in subsequent Faction Clash battles. (Full skill effects, energy costs, activators = Alliance Skills section.)

THE FIVE ALTARS:
| Level | Altar           | Buff Name        | Alliance Skill Unlocked |
|-------|-----------------|------------------|--------------------------|
| 1     | Snake Altar     | Snake Barrier    | Fortify                 |
| 2     | Echo Altar      | Night Army       | Mummy Army Summon       |
| 3     | Gust Altar      | Serpent Breath   | Warlord Missile         |
| 4     | Feather Altar   | Thunder Feathers | Tesla Coil              |
| 5     | Treehaven Altar | Tranquil Rewind  | Refresh                 |

CRITICAL RULES:
- HOLDING LIMIT: 3 Altars per Alliance max. Hitting the limit auto-dismisses troops mid-capture on extra Altars.
- MUTUALLY EXCLUSIVE PAIRS — hold AT MOST ONE from each pair:
    Pair 1: Snake (Fortify) ↔ Gust (Warlord Missile)
    Pair 2: Echo (Mummy Army Summon) ↔ Feather (Tesla Coil)
  → owning one and starting the other auto-dismisses troops.
- DUPLICATE STACKING DOESN'T WORK: 2 altars with the same skill activates it once.
- NO ADJACENT TERRITORY required — capture from anywhere your troops can reach.

CAPTURE LOGIC:
- Owned Altars: push to 100% within the hour or it stays with the current owner.
- Unowned: first to 100% wins; else highest progress meeting holding requirements; else stays Neutral.
- Capture INTERRUPTED if: 3-altar cap hit mid-capture, Commander leaves Alliance, or Alliance disbands.

ALLIANCE ENERGY: required to ACTIVATE captured-altar skills. Primary source: donating catch (Fishing). Ties altars to the Fishing + Faction Tech loops. (Cap details in Alliance Skills section.)

GREAT RIVER CLAN'S GIFT (one-time per captured Altar): any R4+ can summon ONCE → spawns fish-school catch around the Altar for the whole Alliance (→ Alliance Energy + Faction Tech + War Merit). Single-use, easy to forget.

ABANDONMENT: 60-min timer, cancellable; cannot start within 1 hour before a Conquest window. Active skills (e.g. Fortify/Refresh) continue to natural expiry; skills currently casting are not interrupted.

STRATEGIC DOCTRINE:
1. Decide your 3 Altars BEFORE Tuesday.
2. Mutually exclusive pairs force a strategic split — pick skills that fit your Faction Clash role.
3. Week 3 = best window (all altars Neutral; faster than dislodging an owner).
4. Summon Great River Clan's Gift immediately after capture.
5. If swapping altars between weeks, start abandonment EARLY (60-min timer + 1-hr pre-Conquest lockout).
`;

// ─────────────────────────────────────────────────────────────────────────────
// ALLIANCE SKILLS — NEW SECTION (added Jun 15, 2026)
// The actual skill effects / energy / activators behind the altars
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_ALLIANCE_SKILLS = `
SEASON 6 — ALLIANCE SKILLS (Powered by cpt-hedge.com)

Six powerful alliance abilities, unlocked via Faction Tech + Altar Conquest, activated by specific leadership ROLES using Alliance Energy. Access: Alliance → Alliance Skill (once the first is unlocked).

ALLIANCE ENERGY:
- Generated by donating catch (the same catch you fish). Each donation goes to Alliance Energy OR Faction Tech — you choose; rewards to you are identical.
- Recharge: 1 Alliance Energy donation every 2 hours, max 24.
- POOL CAP scales with Faction Tech: Base 350,000 → 700,000 (first FT unlock) → 1,400,000 (second). Higher caps needed for higher-level skills.

THE SIX SKILLS:
| Skill           | Unlocked By               | Energy   | Activator       | Available | Cooldown |
|-----------------|---------------------------|----------|-----------------|-----------|----------|
| Frog's Gifts    | Faction Tech (Frog node)  | 120,000  | Alliance Leader | Early/Wk1 | 2 days   |
| Snake Barrier   | Snake Altar (Lv.1)        | 180,000  | Recruiter       | Week 3    | 3 days   |
| Night Army      | Echo Altar (Lv.2)         | 340,000  | Muse            | Week 3    | 6 days   |
| Serpent Breath  | Gust Altar (Lv.3)         | 360,000  | Warlord         | Week 4    | 6 days   |
| Thunder Feathers| Feather Altar (Lv.4)      | 420,000  | Butler          | Week 5    | 6 days   |
| Tranquil Rewind | Treehaven Altar (Lv.5)    | 200,000  | Alliance Leader | Week 6    | 6 days   |

SKILL EFFECTS:
- Frog's Gifts (Leader): mails all alliance members a resource package (Food/Iron/Coin Chest x1 each + 5× 1-hour training speed-ups). Cheap, high-frequency, whole-alliance. No altar needed (Faction Tech).
- Snake Barrier (Recruiter): own-faction cities only. Grants a Durability Shield allies can charge within 24h (each recon plane +2,000, 5 per member = 10,000 each; capped at city max durability — L1 300k / L2 500k / L3 750k). Shield persists until the city is declared on; drops after that battle even if durability remains. TIP: apply on a war day so members can re-charge mid-fight.
- Night Army (Muse): periodically summons Night Army to attack all enemy-faction Commanders in an area; on success their Base is blasted away. Lasts 180s, new wave every 10s — but cut short if the Muse's base gets ashed/teleported. Protect your Muse.
- Serpent Breath (Warlord): missile at a target area — blasts away all Commander Bases in range + leaves Contaminated Land.
- Thunder Feathers (Butler): periodic lightning around the activating Base, dealing durability damage to enemy-faction Bases in range.
- Tranquil Rewind (Leader): instantly refreshes ANY Alliance Skill's cooldown — force multiplier (fire Serpent Breath / Night Army twice in a fight).

LEADERSHIP ROLES: Leader assigns titles to R4 (or holds as R5). Only the title holder can activate their skill. Leader holds two (Frog's Gifts + Tranquil Rewind); Recruiter=Snake Barrier, Muse=Night Army, Warlord=Serpent Breath, Butler=Thunder Feathers. Match active/reliable players to roles before offensives.

WAR MERIT FROM SKILLS (activating commander earns it; each use rated D–S):
| Rating | War Merit Range   |
|--------|-------------------|
| S      | 99,999+           |
| A      | 69,999 – 99,999   |
| B      | 39,999 – 69,999   |
| C      | 9,999 – 39,999    |
| D      | 0 – 9,999         |

Per-skill rate: Frog's Gifts 2,000 per ally receiving · Snake Barrier 1 per durability granted · Night Army 2 per enemy unit killed · Serpent Breath 2,000 per Base blasted · Thunder Feathers 1 per durability damage · Tranquil Rewind 1 per second of cooldown reduced. Serpent Breath (2,000/Base) and Frog's Gifts (scales with alliance size) generate the most.

TIPS: use Frog's Gifts often (cheap, benefits all) · expand energy cap via Faction Tech early · keep reliable players in skill-titled roles · save Tranquil Rewind to double a high-impact skill · apply Snake Barrier before war day so allies can charge it · time Serpent Breath for max clustered Bases.
`;

// ─────────────────────────────────────────────────────────────────────────────
// CITY CLASH & FACTION CLASH (DESTROY) — NEW SECTION (added Jun 15, 2026)
// Core PvP loop + Influence Point math
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_CITY_FACTION_CLASH = `
SEASON 6 — CITY CLASH & FACTION CLASH / DESTROY (Powered by cpt-hedge.com)

The core battlefield system. S6 revolves around permanently DESTROYING enemy cities for Influence Points — every destroyed city is gone for good.

CITY CLASH SCHEDULE:
| Week | Day       | Unlocks                                              |
|------|-----------|-----------------------------------------------------|
| 1    | Wednesday | Level 1 cities open                                  |
| 1    | Saturday  | Level 2 cities open                                  |
| 2    | Wednesday | Level 3 cities open                                  |
| 2    | Saturday  | Sanctuary in your OWN warzone available              |
| 3–7  | Wed & Sat | Lv.1–3 cities open for Faction Clash                 |
| 5–7  | Saturday  | Sanctuaries in OTHER warzones available              |
City actions only on War Declaration Days (Wed/Sat). Early cities are neutral (no Safe Time yet).

FACTION CLASH (from Week 3): you can now attack the opposing faction's cities directly (the destruction objective). Coordinate via Alliance Pacts.

WEEK 2 CROSS-WARZONE (teleport opens at Week 2 reset; Faction Clash still starts Week 3):
- Other-server Fishing Grounds: unowned takeable any day; owned only on War Days.
- Other-server cities: you may only Declare War on NEUTRAL cities of YOUR OWN faction (same-faction rules below apply cross-warzone).
- Enemy-faction cities can't be touched at all until Destroy unlocks in Week 3 (even if neutral).
- Daily limit: Destroy shares its limit with Declare War — combined limit 2 per war day. Strongholds don't use war declarations, so you can take 2 cities AND 2 strongholds the same day (strongholds count only once captured).

DESTROYED-CITY REWARDS (faction-wide): destroyed cities appear in "Destroyed by Faction" (Faction Tech page). Each gives Siege Loot Chests (each chest: 2× 10K Spore, 4× 10K Rainforest Mushroom, 5× 5m Construction + 5× 5m Research Speed-ups). Chests scale: L1 city = 2 chests, L2 = 5, L3 = 10. One-time per city.

SAME-FACTION CITY RULES:
- Neutral cities: any same-faction alliance can Declare War + capture freely.
- Owned by another same-faction alliance: CANNOT be declared on/attacked (protection triggered by having an owner).
- Always: declarations only Wed/Sat; need a valid territory connection (incl. diagonal adjacency).
- Neutral city ownership after a win → alliance with highest Durability Contribution that meets eligibility.

THE DESTROY MECHANIC:
- Against an enemy-faction city the Declare War button becomes DESTROY (not optional — no occupying enemy cities in S6). Shares the 2/day limit with Declare War.
- On success: city becomes a permanent ruin (no repair/recapture); no longer provides a land connection (marches must move via Strongholds step by step); attacker gains Destruction Rewards; faction gains City Siege Points + Influence Points.

INFLUENCE POINTS (core scoring currency):
- Defending: you can always defend your own cities; pact allies can help. Max 40 garrison troops per city (vs 30 for Fishing Grounds). City lost (destroyed) at 0 durability; Snake Barrier shield must be broken first. A city does NOT get a new protection timer after a successful defense — it can be attacked again in the next battle timeslot the same day (two timeslots per war day).
- Destroying an enemy city redistributes IP:
    • Attacking alliance/faction GAINS 50% of the city's IP value
    • The other 50% is permanently lost (neither side gets it)
    • Defending alliance/faction LOSES the full 100% of the city's IP value
  → Net: attacker +50%, defender −100% (double impact on standings). IP gained from destruction can't be taken back, but the enemy can destroy YOUR cities to close the gap.
- Only ONE alliance is credited per destruction (highest destruction-% contribution); others who attacked the same city burn a war declaration for nothing. Coordinate targets with your faction.

THE SANCTUARY (S6 Capitol):
| Action                          | Effect                                                                 |
|---------------------------------|------------------------------------------------------------------------|
| Your faction captures Sanctuary | Top 60 alliances in your faction's IP ranking each +200,000 IP         |
| Enemy captures & destroys it    | Top 60 alliances in the ENEMY faction each +100,000 IP                 |
| Sanctuary destroyed             | Permanent (no repair); Assign Title still works to hand out buffs      |
Defending your Sanctuary is extremely high-stakes. (Cross-warzone battle mechanics, Cannons, ranking rewards = Sanctuary Duel section.) During Week 2's conquest the Sanctuary is internal to the warzone only; if a warzone fails to compete, the last-presidency alliance inherits it.

WARZONE INTEGRITY & FINAL STAND BUFFS (anti-suppression; auto-applies as your cities are destroyed):
| Status            | Integrity   | Buffs                                                                        |
|-------------------|-------------|------------------------------------------------------------------------------|
| Final Stand Lv.1  | 60.1–80%    | March Accel +5%, Coin Output +5%                                              |
| Final Stand Lv.2  | 40.1–60%    | March Accel +10%, Coin Output +10%                                            |
| Final Stand Lv.3  | 20.1–40%    | Training Speed-up +5%, Reduced Dmg Taken +5%, March Accel +15%, Coin +15%     |
| Final Stand Lv.4  | 0–20%       | Training Speed-up +10%, Reduced Dmg Taken +10%, March Accel +20%, Coin +20%   |
Check via Warzone Overview interface + Status bar.

FACTION CLASH RANKINGS (each awards War Merit; Wed/Sat from Week 3):
- Kill Ranking: kills in battles over cities/Fishing Grounds YOUR alliance (or a pact ally) captured. Aim top 50; push many members into top 200.
- Garrison Ranking: kills while garrisoned in a PACT ally's city/ground (not your own). Cross-garrison pact partners.
- Fortify Ranking: send Recon Planes to shield a city — 1,500 War Merit each, max 5/day = 7,500/day cap. Requires an Altar Skill (Lv.1 Altar / Snake Barrier).
- Destroy Ranking: based on total durability damage dealt to enemy cities on war days. All damage counts toward your individual score even if your alliance doesn't finish the destruction.

SEASON-END (overview; full tiers in Alliance Settlement Rewards section):
- Faction Rewards: factions ranked on total City Destruction Scores; higher score = Faction Victory Rewards scaling with the thrones-destroyed gap.
- Alliance Rewards: 8 tiers from Influence Points Ranking, with War Merit category performance (Total/Destruction/Kill/Garrison/Fortify) as alternative paths.

TIPS: defend your Sanctuary (destroying enemy Sanctuary swings top-60 IP) · coordinate Destroy targets (shared daily limit) · don't ignore Fishing Grounds (movement once cities stop giving land links) · watch your Warzone Integrity · alliance reward tiers are multi-path (combat/defense can substitute for raw IP).
`;

// ─────────────────────────────────────────────────────────────────────────────
// WARZONE OUTPOST — UPDATED (re-pulled Jun 15; schedule conflict flagged)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_WARZONE_OUTPOST = `
SEASON 6 — WARZONE OUTPOSTS (Powered by cpt-hedge.com)

Each Warzone has 4 Outpost slots at the corners of its Sanctuary area. ONE-TIME STRATEGIC RESOURCES — once destroyed, gone forever (no rebuild, unlike S5). Differs from S5 (no shared central zone).

⚠️ PLACEMENT-WEEK CONFLICT: Hedge's DEDICATED Outpost guide (below) says placement Weeks 3/4/5/6; Hedge's ULTIMATE guide says Weeks 4/5/6/7. Hedge has not reconciled the two. The dedicated guide is kept as primary here; tell players to confirm the exact week in the in-game event calendar.

OUTPOST PLACEMENT (one per week, per dedicated Outpost guide):
| Outpost | Week | Season Day  |
|---------|------|-------------|
| No. 1   | 3    | Day 21-22   |
| No. 2   | 4    | Day 28-29   |
| No. 3   | 5    | Day 35-36   |
| No. 4   | 6    | Day 42-43   |
Saturday = placement day; Sunday = construction. (Ultimate guide instead lists Weeks 4/5/6/7 — confirm in-game.)
The Week-3 Outpost sits unchallenged until Conquest opens (the dedicated guide says Conquest "opens from Week 4" in one place and "Weeks 5-7" in another — see Conquest below; treat Conquest as Weeks 5-7).

PLACEMENT RULES:
- Only the President of the Warzone places (1 per placement phase per Warzone → 4 per faction per week, one per warzone).
- Restricted to the faction's designated area. ONCE PLACED, POSITION CANNOT CHANGE.
- Destroyed areas / already-used areas can't be reused.

PLACEMENT STRATEGY: near ENEMY Sanctuary = opens Sanctuary Duel attack routes (Weeks 5-7); near YOUR Sanctuary = anchors defense. Presidents coordinate with alliance leadership.

CONSTRUCTION:
- An alliance in the Warzone must build it before it activates. Once built: provides a territory-link effect for ALL alliances in the Warzone; the alliance with highest Construction Contribution becomes the OWNING alliance.

DEFENSE PARTICIPATION (need ≥1): Alliance Pact with the owner · your Warzone territory connected to the Outpost · member of a same-faction alliance in another Warzone with a City/Stronghold connected. (Must be in an alliance to attack or defend.)

OUTPOST CONQUEST — ATTACKING:
- Only enemy-faction Outposts that finished construction can be attacked.
- First establish a CONNECTION PATH by capturing Cities/Strongholds around it. Then: if any alliance in your Warzone has connected → ALL alliances in your Warzone can join; if none connected → form a Pact with an alliance holding nearby Strongholds and launch a Joint Attack.

CONQUEST COMBAT:
- Runs Weeks 5-7 in 3 battle phases (I/II/III). Battles every Wednesday, starting right after the 2nd battle window (~13:00 server), lasting 1 hour.
- Attacker wins at 100% capture → Outpost permanently DESTROYED (never re-placeable there). Defender wins if 100% not reached, or if 100% was reached then pushed back (ownership unchanged).
- Up to 100 commanders can garrison an Outpost. Outpost Cannons around each can garrison 30; garrisoning both contributes to score.

CAPTURE THE OUTPOST REWARDS (event alongside battles): 3 chests at 130,000 / 260,000 / 400,000 points. All three = 7,000 Honor Points + 3,000 Upgrade Ore + 60 Drone Parts total. Points mostly from kills: fighting at an Outpost/Outpost Cannon = most per kill, then Contaminated Land; garrisoning gives points over time.

STRATEGIC DOCTRINE:
1. When placing the first Outpost, think ahead to the Conquest weeks — claim a spot threatening enemy Sanctuary or anchoring your own.
2. Prioritize construction early (only then is it an asset + a valid target).
3. Alliance Pacts are your defensive safety net — set up before Battle Time.
4. Connecting any one alliance unlocks the attack for the whole Warzone — coordinate the first connection.
5. Destroying an Outpost permanently closes that area (cuts territory links) — think twice if the link helps your own routing.
6. Defenders: deny the first connection — defend surrounding Cities/Strongholds aggressively.

Hedge's tip: "Each Warzone Outpost is a one-time strategic resource... there is no rebuild mechanic — plan accordingly and prioritize your most exposed Outposts."
`;

// ─────────────────────────────────────────────────────────────────────────────
// SANCTUARY DUEL (unchanged from v159 except one Outpost-week cross-ref note)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_SANCTUARY_DUEL = `
SEASON 6 — SANCTUARY DUEL (Powered by cpt-hedge.com)

The CENTERPIECE BATTLE EVENT of S6. Highest-stakes moment of each of Weeks 5, 6, 7. Destroying an enemy Sanctuary shifts massive Influence Points between factions; individual ranking rewards are among the best of the season. Success depends on the territorial setup built in prior weeks.

WHEN: Saturdays of Weeks 5, 6, 7. Contest window 13:00–24:00 server time. Actions before 13:00 do NOT count.

PARTICIPATION ELIGIBILITY (must meet one — not automatic):
- Route 1 TERRITORY CONNECTION: any alliance in your Warzone holds territory directly connected to a Sanctuary → ALL alliances in your Warzone are eligible.
- Route 2 OUTPOST CONNECTION: your Warzone's Outpost connects to a Sanctuary → ALL alliances in your Warzone eligible. The core link between Outpost placement (Weeks 3-6 per the Outpost guide; 4-7 per the ultimate guide — see Warzone Outpost section) and Sanctuary Duel (Weeks 5-7). IF YOUR OUTPOST IS DESTROYED before the Duel, the connection is lost — so defending Outposts preserves your attack routes.
- Route 3 ALLIANCE PACT EXTENSION: a Pact partner of an eligible alliance can participate — but ONLY the pact partner, not all alliances in its Warzone.

BATTLE MECHANICS: each Sanctuary Conquest lasts 1 hour; if no faction captures within the hour, ownership stays with the prior holder. Standard city-capture (fill the bar; troops must move inside and hold).

CANNONS (capturable, offensive AND defensive):
- Same faction as the current Sanctuary captor: capturing the Cannon INCREASES your capture speed.
- Different faction from the captor: the Cannon DEALS DAMAGE to troops inside the Sanctuary.
- Often contested at the START before either side commits to the Sanctuary. Losing Cannons mid-fight reverses momentum.

INFLUENCE POINTS IMPACT (highest single-target IP swings in the season):
| Outcome                              | Effect                                                                              |
|--------------------------------------|-------------------------------------------------------------------------------------|
| Your faction CAPTURES the Sanctuary  | Top 60 alliances in your faction's IP ranking each +200,000 IP                       |
| You DESTROY the enemy Sanctuary      | Top 60 alliances in your attacking faction each +100,000 Destruction IP             |
| Enemy DESTROYS your Sanctuary        | The 200,000 IP your faction received for the capture are DEDUCTED from the alliances that received them |
DEDUCTION RULE: points are removed specifically from the alliances that received them at the original capture — not recalculated on the current ranking.

POINT SCORING & MILESTONES (individual, during 13:00–24:00). Primary source: killing units in City/Stronghold battles; scales by unit tier.
| Points     | Alliance Pts | 5m Speed-ups | Honor Pts | Upgrade Ore | Drone Parts |
|------------|--------------|--------------|-----------|-------------|-------------|
| 125,000    | 2            | 30           | 3.5K      | 800         | 8           |
| 250,000    | 2            | 30           | 3.5K      | 800         | 8           |
| 375,000    | 2            | 30           | 4.0K      | 800         | 8           |
| 500,000    | 3            | 40           | 4.5K      | 1,000       | 10          |
| 750,000    | 3            | 40           | 4.5K      | 1,000       | 10          |
| 1,000,000  | 3            | 40           | 5.0K      | 1,000       | 10          |
| 1,500,000  | 4            | 50           | 5.5K      | 1,200       | 12          |
| 2,000,000  | 4            | 50           | 5.5K      | 1,200       | 12          |
| 3,000,000  | 5            | 60           | 6.0K      | 1,500       | 15          |
| Total      | 28           | 370          | 42.0K     | 9,300       | 93          |

RANKING REWARDS (among the largest individual payouts of the season):
| Rank   | Survivor Tickets | Resource Choice Chests | 5m Construction | 5m Troop | War Merit |
|--------|------------------|------------------------|-----------------|----------|-----------|
| 1      | 20               | 500                    | 50              | 100      | 10,000    |
| 2      | 18               | 450                    | 45              | 90       | 9,500     |
| 3      | 16               | 400                    | 40              | 80       | 9,000     |
| 4-10   | 14               | 350                    | 35              | 70       | 8,000     |

SANCTUARY DESTRUCTION REWARDS (alliance-wide chest): 10 Hero's Return Recruitment Tickets · 10,000 Spore · 60× 5m Research Speed-ups · 60× 5m Construction Speed-ups.

STRATEGIC DOCTRINE:
1. Your Outpost placement determines everything — Outposts near enemy Sanctuaries create the Week 5-7 attack routes. Defending Outposts in the lead-up IS preparation for the Duel.
2. Prioritize your OWN Sanctuary defense — losing it costs the top 60 alliances 200,000 IP each, the single largest swing.
3. Control Cannons early.
4. Use Alliance Pacts to extend reach to a target Sanctuary.
5. Push combat during the 13:00–24:00 scoring window (even No. 4-10 is worth competing for).
`;

// ─────────────────────────────────────────────────────────────────────────────
// WAR MERIT SHOP — NEW SECTION (added Jun 15, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_WAR_MERIT_SHOP = `
SEASON 6 — WAR MERIT SHOP (Powered by cpt-hedge.com)

Spend earned War Merit on seasonal resources, upgrade items, and speed-ups. Spending does NOT affect War Merit rankings (the leaderboard total is a one-way counter).

UNLOCK: once the Fungus Institute reaches Level 4, build the War Merit Shop structure.

MECHANICS:
- Daily items ("Hot", top of shop): restock every 24h, accumulate if unbought.
- Weekly items: restock weekly; unspent carries over.
- Season Limit items: fixed total across the whole season.
- One-time: bought once per season.
- Rank gates: some items require a faction rank (Wetland Vanguard II, Wetland Warrior I, Wetland Elite III) — appear greyed with "Requires" until reached. Progressing rank early unlocks shop inventory.
- Unbought items accumulate — no pressure to buy immediately; skip low-priority items when low on Merit.

ITEM SCHEDULE (all cost 1 unit per purchase unless noted; "Limit" = per refresh period):

Week 1 — Daily Refresh ("Hot"):
| Item                    | Price | Limit | Priority |
|-------------------------|-------|-------|----------|
| Rainforest Mushroom x10K| 100   | 80    | High     |
| Bait                    | 200   | 10    | High     |
| Tactics Card Pack (R)   | 250   | 10    | Medium   |

Week 1 — Weekly Refresh:
| Item                                 | Price | Limit | Priority |
|--------------------------------------|-------|-------|----------|
| Tactics Card Pack (SR) (Discount)    | 3,000 | 10    | Medium   |
| Tactics Card Pack (SSR) (Discount)   | 8,000 | 3     | Medium   |
| Bait                                 | 1,000 | 100   | Low      |

Week 1 — Mid-week (Requires Wetland Vanguard II, ~day 5-6):
| Item                     | Price  | Limit | Priority |
|--------------------------|--------|-------|----------|
| Tactics Card Pack (UR)   | 12,500 | 1     | High     |
| 5m Construction Speed-up | 25     | 500   | Low      |
| 5m Research Speed-up     | 25     | 500   | Low      |

Week 2 — Weekly:
| Item                  | Price | Limit | Priority |
|-----------------------|-------|-------|----------|
| 5m Training Speed-up  | 25    | 200   | Low      |
| 5m Healing Speed-up   | 25    | 200   | Low      |
| Jungle Mask           | 1,000 | 7     | Low      |
| Golden Bait           | 2,000 | 20    | High     |

Week 3 — Weekly:
| Item                  | Price | Limit | Priority |
|-----------------------|-------|-------|----------|
| 10k Spore             | 100   | 280   | High     |
| UR Universal Hero Shard | 750 | 10    | Medium   |
| Skill Medal           | 900   | 50    | Medium   |

Week 3 — Requires Wetland Warrior I (one-time):
| Item                   | Price  | Limit | Priority |
|------------------------|--------|-------|----------|
| 5m Healing Speed-up    | 25     | 500   | Low      |
| Tactics Card Pack (UR) | 12,500 | 1     | High     |
| 5m Training Speed-up   | 25     | 500   | Low      |

Week 4 — Requires Wetland Elite III (one-time):
| Item                                          | Price  | Limit | Priority |
|-----------------------------------------------|--------|-------|----------|
| Tactics Card Pack (UR)                        | 12,500 | 1     | High     |
| Skill Medal & Overlord Skill Badge Choice Chest | 150  | 200   | Medium   |
| Training Certificate                          | 300    | 100   | High     |

Week 5 — Requires Wetland Elite III (one-time):
| Item                  | Price     | Limit | Priority |
|-----------------------|-----------|-------|----------|
| Drone Parts           | 400       | 100   | Medium   |
| Armament Core         | 500       | 50    | High     |
| Emperor's Golden Fish | 1,000,000 | 1     | Low      |

Week 6 — Season Limit items (first three open immediately; last three require Wetland Elite III):
| Item                              | Price | Limit | Priority |
|-----------------------------------|-------|-------|----------|
| Iron Chest (SSR)                  | 4,000 | 999   | Low      |
| Food Chest (SSR)                  | 4,000 | 999   | Low      |
| Coin Chest (SSR)                  | 4,000 | 999   | Low      |
| Drone Combat Boost EXP Card (req) | 1,000 | 50    | Medium   |
| Universal Exclusive Weapon Shard (req) | 1,500 | 40 | High     |
| Hero's Return Recruitment Ticket (req) | 1,000 | 50 | Medium   |

PURCHASE STRATEGY:
- High: Rainforest Mushroom x10K daily (S6's "Coffee Beans" — buy the full daily limit) · Tactics Card Pack (UR) whenever available · upgrade items (Training Certificates, Armament Cores).
- Low/last: Emperor's Golden Fish (1,000,000 Merit — only after clearing high-priority items) · Jungle Mask + extra Bait as needed · 5m speed-ups (cheap, low progression value).
- Items accumulate on restock — don't chase with limited Merit; buy later.
`;

// ─────────────────────────────────────────────────────────────────────────────
// SEASONAL RESOURCES — NEW SECTION (added Jun 15, 2026) — daily checklist
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_SEASONAL_RESOURCES = `
SEASON 6 — SEASONAL RESOURCES (Powered by cpt-hedge.com)

Three key seasonal resources: Rainforest Mushrooms, Spore, War Merit. Quick reference for every source (daily / one-time / passive).

RAINFOREST MUSHROOM (primary building resource — Spore Factories, then Protector's Field):
- One-time: Rainforest Zombie first kills (per level) · Doom Elite first kills (per level, higher = more) · Hero's Return Recruitment Tickets (S6 Legend Returns tab; chance to drop mushrooms — best used Day 1 when building costs are low).
- Daily: Visitor (200k Mushrooms + 10 Bait, from Day 1) · Doom Walker first kill (200k at any level; save for after the Day-1 season update applies) · War Merit Shop (10k per buy, up to 40/day at 100 War Merit; from Week 1 once Fungus Institute is L4) · Beneath the Ruins (new stage daily from Day 2; later stages give more; missed days stack).
- Passive: War Spoils via Faction Tech (every faction-owned city → 90/h L1, 100/h L2, 110/h L3; pooled across all 4 Warzones; claim manually bottom-right of Faction Tech; unlock before first cities Wed of Week 1; strongest Weeks 1-2, drops from Week 3).
- Other: Seasonal Rewards (Season screen task milestones).

SPORE (upgrades Fungus Institute → Virus Resistance; later upgrades Bear/Eagle/Jaguar Totems):
- Passive (primary, first 2 weeks): Spore Factories (continuous; build/level with Mushrooms; level each to 10 to unlock the next, then level equally). Weekly Pass (paid) adds an extra Spore Factory. Tip: claim once a day after leveling — leveling a factory that has generated Spore retroactively adjusts the total to the new rate (free extra Spore).
- Weekly (from Week 3): War Merit Shop — 10k Spore per buy, up to 280/week at 100 War Merit.
- Other: Seasonal Rewards milestones.

WAR MERIT (individual progression currency; spending doesn't reduce leaderboard total):
- One-time: Doom Elite + Rainforest Zombie first kills (per level) · first capture of Fishing Grounds · first capture of Cities (war days only).
- Timed: Purge Action (daily ranking, first 9 days; top 3 earn the most).
- Daily: Beneath the Ruins (stage completion + completion-time ranking; PvP Duel wagers up to 3,000 War Merit per match — 4,000 with Season Skill — from Week 2) · donating fishing catch to Alliance Skills / Faction Tech (350 common → 3,900 rare Merit).
- Ongoing/weekly: Faction Clash Kill Ranking + Defense Ranking (Wed/Sat from Week 3) · destroying enemy faction cities (Week 3+) · Alliance Skills activation (rated D–S).

DAILY CHECKLIST (quick reference):
Every day: claim Visitor (200k Mushrooms + 10 Bait) · Doom Walker first kill (200k Mushrooms) · buy daily Mushrooms from War Merit Shop (40× 10k from Week 1) · do your Beneath the Ruins stage (from Day 2) + PvP Duels (from Week 2) · donate fishing catch · claim War Spoils.
Once per week (from Week 3): buy weekly Spore from the shop (up to 280× 10k).
When available: push highest zombie level during Purge Action (Days 1-9) · first kills of Doom Elites / Rainforest Zombies · Faction Clash Kill/Defense participation (Wed/Sat from Week 3).

KEY CAPS: Mushrooms from shop = 40× 10k/day (400k/day). Spore from shop only opens Week 3.
`;

// ─────────────────────────────────────────────────────────────────────────────
// PURGE ACTION — NEW SECTION (added Jun 15, 2026) — Week 1 / first 9 days
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_PURGE_ACTION = `
SEASON 6 — PURGE ACTION (Powered by cpt-hedge.com)

A 9-day solo event (first week and a half). Compete daily on how high a zombie level you can defeat. No alliance element — purely individual combat power + Virus Resistance.

HOW IT WORKS: leaderboard ranks all participants by the highest zombie level defeated each day. At daily reset, rewards distribute by placement, then the board resets. Push the highest level you can before each reset.

VIRUS RESISTANCE (the key stat — set mainly by Fungus Institute level):
- 15,000 at Fungus Institute level 30
- +250 Weekly Pass (paid)
- +250 Mushroom Puff bonus (24h)
- +250 Purgator – Monster Slayer Core card effect (15 min)
- +250 using Protectors (requires 500+ Desert Protectors in base)
- +250 or +500 from current Faction Rank
- → up to a temporary 16,500 total.
Prioritize Fungus Institute upgrades — your zombie ceiling = your resistance. Pushing one more Fungus level right before reset can secure a higher rank.

DAILY RANKING REWARDS:
| Rank      | War Merit | Legend's Return Tix | Survivor's Tix | Skill Medals | Diamonds |
|-----------|-----------|---------------------|----------------|--------------|----------|
| 1         | 56,000    | 20                  | 20             | 4,000        | 400      |
| 2         | 49,000    | 16                  | 16             | 3,000        | 300      |
| 3         | 42,000    | 14                  | 14             | 2,600        | 200      |
| 4-10      | 35,000    | 12                  | 12             | 2,200        | 160      |
| 11-50     | 28,000    | 10                  | 10             | 2,000        | 120      |
| 51-200    | 14,000    | 8                   | 8              | 1,800        | 100      |
| 201-1000  | 7,000     | 6                   | 6              | 1,600        | 100      |
| 1001-9999 | 4,000     | 4                   | 4              | 1,400        | 100      |
Consistent top-3 across 9 days is one of the better early-season War Merit sources.

MILESTONE REWARDS (one-time, first time you defeat each level):
- Levels 5/10/15/20/25 (each): 10× 5-min Speed-up Chest + 1× Resource Choice Chest (SSR) + 10 Drone Parts + 50 Diamonds
- Levels 30/40/50 (each): 20× 5-min Speed-up Chest + 2× Resource Choice Chest (SSR) + 20 Drone Parts + 100 Diamonds (double the lower tiers)

TIPS: push every day before reset (rewards settle daily) · prioritize Fungus Institute · bring your strongest squad (raw power, not efficiency) · you cannot be carried (solo only) · top 3 is where the real War Merit is.
`;

// ─────────────────────────────────────────────────────────────────────────────
// RAINFOREST'S WRATH — NEW SECTION (added Jun 15, 2026) — Week 1 / 7 days
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_RAINFORESTS_WRATH = `
SEASON 6 — RAINFOREST'S WRATH (Powered by cpt-hedge.com)

A Week-1 event (first 7 days). Doom Elite first kills build alliance Support Points → spawn a Giant Devouring Flower; killing it drops boxes (Skill Medals) for everyone nearby. Two parallel tracks (alliance-wide flower spawns + individual Support Points).

HOW IT WORKS:
- Support Points (alliance-wide): each Doom Elite FIRST KILL adds to the alliance total; enough → a Giant Devouring Flower spawns on a player's base.
- Support Points (individual): each first kill also gives YOU points → personal milestone track + daily leaderboard.

MISSIONS (each milestone = 20× 5-min Speed-up Chest + 30 Diamonds + 1,000 Skill Medals):
- Participation track: participate in killing 3 / 6 / 10 / 13 / 16 / 20 Devouring Flowers (just land one hit before it dies — no killing blow needed).
- Support Point track: reach 20,000 / 40,000 / 60,000 / 80,000 / 100,000 / 120,000 Support Points (all 6 = 120,000; the harder track).

EARNING SUPPORT POINTS (from first kills only; repeats don't re-award):
- Kill your own Doom Elites (higher level = more points; raise Virus Resistance via Fungus Institute).
- Help lower-resistance alliance members: join their rally; your higher damage share earns YOU the first-kill credit. Fast way to rack up points while helping members.

THE DEVOURING FLOWER:
- Spawns on a player's base. While it sits there you CANNOT deploy squads (like the S3 Sandworm). Options: allies kill it (frees base + drops reward boxes), or Teleport away (removes it).
- 100M-power enemy. Players below ~50M deal little — hit once for participation credit. Recent update: troops go to hospital instead of dying (less punishing). Early days, high-power players should use lower-tier squads so more members can land a hit toward the 20-flower milestone.
- No bonus for the killing blow — boxes drop for everyone nearby regardless.

REWARDS:
- Box drops (near the defeat base): each ~1,000 Skill Medals + speed-ups. Pick up to 15 boxes/day — a strong Week-1 Skill Medal source.
- Base-owner mail reward (whose base it spawned on): Resource Choice Chests (SR) + Construction/Research speed-ups.
- Daily ranking (by individual Support Points): settles daily, but only after the alliance kills ≥3 flowers that day. Gap between ranks is small (meant to highlight helpers).

TIPS: prioritize the 20-flower participation track early (easier) · pace flower kills the first few days so more members get credit · coordinate first-kill help for Support Points · pick up boxes daily (15 cap) · Teleport if a flower traps your base.
`;

// ─────────────────────────────────────────────────────────────────────────────
// BENEATH THE RUINS — NEW SECTION (added Jun 15, 2026) — minigame, Day 2+
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_BENEATH_THE_RUINS = `
SEASON 6 — BENEATH THE RUINS (Powered by cpt-hedge.com)

S6's minigame — a descending platformer (like S5's High Noon Duel role). Solo stage mode + a PvP Duel Mode. Rewards Season Resources + War Merit.

UNLOCK: solo stage mode Day 2 of Week 1; Duel Mode (PvP) added in Week 2. One new stage unlocks each day; reach the Final Stage for Season Resources + Season-exclusive Gifts.

CONTROLS: tap left/right buttons or left/right screen areas to move; descend between platforms.

CORE MECHANICS:
- HP bar; run fails if HP hits 0 OR you fall off screen.
- Normal mode: HP slowly recovers if you avoid damage (pause on safe platforms to heal).
- Platform types: Regular (safe) · Crumbly (safe but breaks after ~1s standing) · Spike (1 HP on landing) · Travelator (moves you its direction until you fall off; go with it — fighting it costs time).
- Descent speed depends on how low your character sits on screen — lower = faster scroll. Stay in the bottom half for best completion time (but don't fall off).

STAGE COMPLETION: reach the bottom → rewards (later stages give more Season Resources). Daily ranking by completion time (faster = higher) → War Merit. Missed days stack; play multiple per day to catch up.
RANK-HIGH TIPS: stay in the bottom half · do a test run first (don't finish it) · take risks (unlimited retries until you finish) · don't fear spikes (HP regens; land on spikes to avoid falling off).

DUEL MODE (Week 2+):
- Pay an entry deposit (up to 500 War Merit; 1,500 with Season Skill); both players descend the same stage; first to the bottom wins.
- NO health recovery in a duel. Falling off screen does NOT end it but costs HP (and drops you at the top onto spikes — riskier than a spike platform). You have 5 Health total.
- Win tips: don't hug the bottom too early (fall speed is matched) · avoid falling · let the opponent wear their HP on platforms · sacrifice HP on spikes if it saves you from falling off · just reach the bottom.
- Duel reward = War Merit equal to the wager (wager 1,500, win 1,500 more).
`;

// ─────────────────────────────────────────────────────────────────────────────
// TACTICS CARDS (unchanged from v159)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_TACTICS_CARDS = `
SEASON 6 — TACTICS CARDS (Powered by cpt-hedge.com)

THE BIG CHANGE: The Hybrid Squad (4+1) card is REMOVED in S6. S4/S5 mixed-squad meta is gone (Tank+Adam, Air+Murphy, Quickstride+Mixed, Garrison+Mixed, PvE Zombie Killer all need rethinking). Pure single-type squads are the new standard.

THREE NEW UNIVERSAL CARDS (PvP + Global Expedition only — NOT PvE):
1. AFTERMATH BURST (Missile): all Missile Heroes +18.75% damage-over-time at battle start (Lv.1), +6.25%/level. ONLY affects DoT skills, not regular damage. Among Missiles, benefits Swift's burn + Fiona's radiation.
2. DIMENSIONAL CRIT (Tank): the Tank Hero with HIGHEST ATTACK gains +2.70% Crit Rate (Lv.1), +0.9%/level. Targets one hero (highest-attack tank — often Kim or Stetmann; EW level + gear decides; Kim's Awakened skills may shift this).
3. FRONTAL SUPPRESSION (Aircraft): 3 Aircraft Heroes on the BACK ROW gain +1.50% Attack Speed (Lv.1), +0.9%/level. Back-row placement matters. DVA tradeoff: front (safe) vs back (gets the buff).

CARD LEVELS RAISED: max now 12 (was 7), with up to +3 from the UR "Tactics Card Level Up" attribute → cap 15.

RANDOM ATTRIBUTE POOL (all three new cards):
| Attribute                           | Rarity | Value         |
|-------------------------------------|--------|---------------|
| Tactics Card Level Up               | UR     | +1 level      |
| PvP Defending Hero Defense          | SSR    | 2.50% – 3.00% |
| PvP Defending Hero Attack           | SSR    | 2.50% – 3.00% |
| PvP Defending Hero HP               | SSR    | 2.50% – 3.00% |
| Reduces Damage Taken when countered | SSR    | 0.50%         |
| Regular attributes                  | R      | various       |
Look for 3-attribute cards, all SSR minimum. UR "Tactics Card Level Up" is the highest-value find.

COUNTER REVERSAL becomes critical in S6 — pure squads are more exposed to type counters than old mixed squads.

EARLY-SEASON STARTING SETUPS (Hedge baseline):
- MISSILE / Aftermath Burst: Aftermath Burst, Counter Reversal, Quickstride-Attribute Boost, Quickstride-Contaminated Land · Core: Quickstride-Morale Boost, Quickstride-Quick March (or Battlestreak-Morale Boost)
- TANK / Dimensional Crit: Frontal Suppression*, Counter Reversal, Quickstride-Attribute Boost, Quickstride-Contaminated Land · Core: Quickstride-Morale Boost, Quickstride-Quick March (or Garrison-Defensive Regroup) — *Hedge's guide lists "Frontal Suppression" here; appears to be a Hedge-side typo (logic suggests Dimensional Crit). Verify before treating as authoritative.
- AIRCRAFT / Frontal Suppression: Frontal Suppression, Counter Reversal, Quickstride-Attribute Boost, Quickstride-Contaminated Land · Core: Quickstride-Morale Boost, Quickstride-Quick March (or Garrison-Defensive Regroup)
- GARRISON DEFENSE (any type): type-matched Universal, Counter Reversal, Garrison-Duration, Garrison-Attribute Boost · Core: Garrison-Defensive Regroup (active), Garrison-Morale Boost

Tactics Card Packs available in the War Merit Shop (daily/weekly). Counter Reversal "arguably more important in Season 6 than before" per Hedge.
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL EXPEDITION — UPDATED (schedule conflict flagged; stage-400 + Day-4 added)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_GLOBAL_EXPEDITION = `
SEASON 6 — GLOBAL EXPEDITION (Powered by cpt-hedge.com)

NEW S6 mode. THE primary FREE source of Hero Awakening Shards.

⚠️ ROUND-WEEK CONFLICT: Hedge's hero guides (Kim/DVA) say rounds open in Weeks 2 / 4 / 6; Hedge's ultimate guide (and the Tesla guide) say Week 1 (Day 4) / Week 3 / Week 5. Hedge has not reconciled them. Relay both if pressed and tell players to confirm in-game.

WHEN: 3 rounds × 14 days each.
- Per ULTIMATE/Tesla guides: Round 1 (Kim) opens Day 4 of Week 1; Round 2 (DVA) Day 1 of Week 3; Round 3 (Tesla) Day 1 of Week 5.
- Per hero guides: Weeks 2 / 4 / 6.
WHERE: Alert Tower in your base (alongside T11 Restricted Area Training).
HOW: set a hero team that auto-fights stages (like Armed Truck). 1 point per cleared stage. Also complete the Hero Trials that open the same day as each round for 10 bonus named shards. Push to ~stage 400 for the full named-shard haul.

ROUND-TO-HERO MAPPING: Round 1 = Kimberly · Round 2 = DVA · Round 3 = Tesla.

AREA UNLOCK (per round): Day 1 Area 1 · Day 3 Area 2 · Day 5 Area 3 · Day 7 Area 4. First Area-1 stage starts at 33.0M combat power; scales up. Auto-Challenge unlocks at stage 4. Points DON'T carry between rounds.

AREA BUFFS (change each round — check at round start):
- Round 1, Area 1: after 6 damage instances from skills/Awakened Skills, hero triggers extra Energy Damage = 150% of Attack to all enemies (favors frequent multi-hit skills).

TACTICS CARD BONUSES — only NON-CORE cards count (by total upgrade level):
| Total Non-Core Card Level | Hero Attack | Defense |
|---------------------------|-------------|---------|
| 16 – 30                   | +5,000      | +1,200  |
| 32 – 46                   | +5,000      | +1,800  |
| 48 – 60                   | +10,000     | +2,400  |
Upgrade non-core cards before each round.

REWARDS — three tracks:
1. POINTS REWARDS (cumulative, every 50 points):
   1–750 → 2 Named Awakening Shards · 751–1,500 → 2 Universal · 1,501–3,000 → 1 Universal · 3,001–6,000 → 1 Universal EW Shard. First 750 = NAMED shards for the round's hero. ~6,000 = practical cap.
2. AREA REWARDS (per-area, per round): milestones every 10 stages; 1 EW Shard Choice Box per 50 stages up to 1,500 stages.
3. RANKING REWARDS (end-of-round):
   1 → Title Global Dominator (14d) + 30 Universal Awakening Shards + 5× Resource Chest UR · 2-3 → Global Vanquisher + 20 + 4× · 4-10 → Global Pioneer + 15 + 3× · 11-100 → 10 + 3× · 101-5,000 → 5 + 2×.

DOCTRINE: push HARD during each 14-day window (points don't carry) · named shards (first 750) are most efficient · push toward stage 400 · upgrade non-core Tactics Cards before each round · Auto-Battle once you outpower stages.
`;

// ─────────────────────────────────────────────────────────────────────────────
// HERO AWAKENING — Kimberly detail (Kim Stars 3-5 DR now published; Tesla→Wk5)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_HERO_AWAKENING_DETAIL = `
SEASON 6 — HERO AWAKENING DETAIL (Powered by cpt-hedge.com)

S6 SCHEDULE:
- Week 1: Kimberly (Ember Light) — DETAILED BELOW
- Week 3: DVA — see SEASON6_DVA_AWAKENING section
- Week 5: Tesla — see SEASON6_TESLA_AWAKENING section (guide now published)
  (⚠️ Tesla week contested: Tesla guide + ultimate say Week 5; older Kim/DVA guides say Week 6.)

UNIVERSAL AWAKENING REQUIREMENTS (any hero): hero at 5 Stars · its Exclusive Weapon at Lv.20+ · 50 named Awakening Shards. All three simultaneously.

UPGRADE COSTS (after unlock):
| Stage     | Shards/Tier | Tiers | Stage Total | Running Total |
|-----------|-------------|-------|-------------|----------------|
| Unlock    | 50 named    | 1     | 50          | 50             |
| → Star 1  | 20          | 4     | 80          | 130            |
| → Star 2  | 40          | 5     | 200         | 330            |
| → Star 3  | 70          | 5     | 350         | 680            |
| → Star 4  | TBD         | TBD   | TBD         | TBD            |
| → Star 5  | TBD         | TBD   | TBD         | TBD            |
After unlock, named OR Universal Awakening Shards are interchangeable. Awakening Skill upgrades with Skill Medals, max level 40.

SHARD SOURCES (all FREE — no paid path remaining):
1. HERO AWAKENING TRIAL (opens when the hero gets Awakened form): Basic Trial = 3 stages, each gives 2,000 Skill Medals + 1 Awakening Shard + 200 Diamonds. Up to 10 shards TOTAL per hero across Basic+Advanced+Ultimate (Advanced/Ultimate per-stage rewards not fully published; total cap 10).
2. GLOBAL EXPEDITION — see Global Expedition section. Currently the PRIMARY path.
3. Battle Pass / paid packs (70 + 300 shards) were available initially but REMOVED. Shards now entirely free-to-earn.
4. Hedge expects post-S6 Black Market may include Awakening Shards — unconfirmed.

KEY IMPLICATION: it is NO LONGER POSSIBLE to unlock an Awakening on the day it becomes available (Trial + Global Expedition don't yield 50 shards on Day 1).

═══════════════════════════════════════════════════════════════════════════════
KIMBERLY (Ember Light) — First Awakening, Week 1
═══════════════════════════════════════════════════════════════════════════════
UNLOCK PREREQS: Kim at 5 Stars · Kim's EW at Lv.20+ · 50 Kimberly-specific Awakening Shards.

AWAKENING SKILL — PRICELESS RESOLVE (replaces Super Sensing, inherits its effects):
- Base (Lv.1): fires 10 barrages, each = Energy Damage 140.04% of Attack to 1 random enemy.
- +3 barrages per stack of Energy Amplification, capped at 25 barrages. At max = 3,501.09% of Attack in Energy Damage. Max skill level 40 (Skill Medals).

STAR-GATED BONUSES:
| Stars | Bonus                                                                 |
|-------|-----------------------------------------------------------------------|
| 1     | At battle start, Kim enters [Resolve] state                           |
| 2     | Deals 20% Extra Damage                                                |
| 3     | On using Awakening Skill, immediately gains 2 stacks Energy Amplification |
| 4     | Deals 40% Extra Damage                                                |
| 5     | Launches 1 additional barrage per stack of Energy Amplification       |
The 3★ + 5★ bonuses pair powerfully with Kim's EW Energy Amplification mechanic.

DAMAGE REDUCTION (passive) — NOW FULLY PUBLISHED:
| Awakening Stars | Damage Reduction |
|-----------------|------------------|
| 0 (unlock)      | 2.50%            |
| 1               | 3.00%            |
| 2               | 3.50%            |
| 3               | 4.00%            |
| 4               | 4.50%            |
| 5               | 5.00%            |
Awakening also grants Hero HP/Attack/Defense buffs scaling per tier (exact values not published by Hedge).

VERDICT (Hedge): "If Kimberly is part of your main squad, yes — the Awakening is a strong upgrade and well worth pursuing." Particularly strong in a full Tank squad.
`;

// ─────────────────────────────────────────────────────────────────────────────
// DVA AWAKENING — UPDATED (full DR ladder now published)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_DVA_AWAKENING = `
SEASON 6 — DVA AWAKENING (Powered by cpt-hedge.com)

WHEN: Week 3 (second hero after Kimberly, before Tesla).
UNLOCK PREREQS: DVA at 5 Stars · DVA's EW at Lv.20+ · 50 DVA-specific Awakening Shards.
DAY-1 UNLOCK: NOT possible (paid packs removed; Global Expedition for DVA opens in/around Week 3-4 and 14 days isn't enough from Trial + that round alone).
SHARD SOURCES: Hero Awakening Trial (Basic: 3 stages × 2,000 Skill Medals + 1 DVA shard + 200 Diamonds; up to 10 total) + Global Expedition (DVA round).

AWAKENING SKILL — STARRED ACE (Energy Damage; replaces Super Sensing, inherits effects):
- Base (Lv.1): DVA goes AIRBORNE 5s, gaining Ace Boost. While airborne, each Auto Attack triggers a follow-up attack prioritizing FRONT-ROW enemies = Energy Damage 251.09% of Attack to 1 random enemy.

ACE BOOST (stacking, scales with squad): 1 stack per Aircraft hero; each +20% Attack Speed; max 5 stacks = +100% Attack Speed (full Aircraft squad).

STAR-GATED BONUSES:
| Stars | Bonus                                              |
|-------|----------------------------------------------------|
| 1     | Ace Boost grants an additional +10% Attack Speed/stack |
| 2     | Follow-up attacks deal an extra +20% damage        |
| 3     | Ace Boost grants an additional +5% Attack/stack    |
| 4     | Follow-up attacks deal an extra +40% damage        |
| 5     | Airborne duration +1s (6s total)                   |

DAMAGE REDUCTION (passive) — NOW FULLY PUBLISHED:
| Awakening Stars | Damage Reduction |
|-----------------|------------------|
| 0 (unlock)      | 2.50%            |
| 1               | 3.00%            |
| 2               | 3.50%            |
| 3               | 4.00%            |
| 4               | 4.50%            |
| 5               | 5.00%            |
Also grants Hero HP/Attack/Defense buffs scaling per tier (exact values not published by Hedge).

SCALING WITH FULL AIRCRAFT SQUAD (5 stacks): base +100% AS · +1★ another +50% AS · +3★ another +25% Attack · 2★/4★ follow-up boosts compound. Output during Starred Ace scales heavily in a dedicated Aircraft squad.
UPGRADING: Skill Medals, max level 40 (see Hedge Skill Medal Calculator).

VERDICT (Hedge): "If DVA is part of your main squad, yes — a worthwhile upgrade... gets significantly better the more Aircraft heroes you field." Ace Boost rewards full air squads.

POSITIONING (with the new Frontal Suppression card): keep DVA FRONT (safer) vs BACK (gets the +Attack Speed card buff). For full-Aircraft Starred Ace maximization, back-row Attack Speed compounds with Ace Boost stacks.
`;

// ─────────────────────────────────────────────────────────────────────────────
// TESLA AWAKENING — NEW SECTION (added Jun 15, 2026) — Week 5
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_TESLA_AWAKENING = `
SEASON 6 — TESLA AWAKENING (Powered by cpt-hedge.com)

WHEN: Week 5 (third hero, after Kim and DVA).
  ⚠️ WEEK CONTESTED: Tesla's own guide + the ultimate guide say Week 5; older Kim/DVA guides reference Week 6. Treat as Week 5; confirm in the in-game event calendar.
UNLOCK PREREQS: Tesla at 5 Stars · Tesla's EW at Lv.20+ · 50 Tesla-specific Awakening Shards.
DAY-1 UNLOCK: NOT possible (paid packs removed). Shards: Hero Awakening Trial (up to 10) + Global Expedition (Tesla round, Round 3).

AWAKENING SKILL — VORTEX RESONANCE (replaces Super Sensing, inherits its effects):
- Fires a CHAIN-LIGHTNING bolt that bounces between enemies. Base 7 bounces; each bounce = Energy Damage 726.47% of Attack (at skill Lv.40) to the struck enemy. 15-second cooldown.
- Each bounce also applies INDUCTIVE CURRENT (debuff) to the struck enemy.

INDUCTIVE CURRENT (the core mechanic):
- Damage-over-time: target takes 3% of Tesla's Attack per second for 30 seconds.
- Stacks: max stacks = (number of Missile heroes in the squad) × 3, capped at 15 stacks. (Full Missile squad of 5 → 15 max stacks.)
- Refreshed/reapplied on each bounce that hits the target.

STAR-GATED BONUSES:
| Stars | Bonus                                                          |
|-------|----------------------------------------------------------------|
| 1     | Each bounce applies 2 stacks of Inductive Current (instead of 1) |
| 2     | Vortex Resonance deals +20% damage                             |
| 3     | +1 chain bounce (8 total)                                      |
| 4     | Vortex Resonance deals +40% damage                            |
| 5     | +1 chain bounce (9 total)                                     |
At 5★: 9 bounces, +60% total damage, 2 stacks/bounce — pairs with a Missile-heavy squad to keep Inductive Current at max stacks.

DAMAGE REDUCTION (passive) — FULLY PUBLISHED:
| Awakening Stars | Damage Reduction |
|-----------------|------------------|
| 0 (unlock)      | 2.50%            |
| 1               | 3.00%            |
| 2               | 3.50%            |
| 3               | 4.00%            |
| 4               | 4.50%            |
| 5               | 5.00%            |
Also grants Hero HP/Attack/Defense buffs scaling per tier (exact values not published by Hedge).

UPGRADING: Awakening Skill via Skill Medals, max level 40 (726.47%/bounce figure is at Lv.40).

VERDICT (Hedge): a strong upgrade for squads built around Tesla + Missile heroes — Inductive Current scales with how many Missile heroes you field, and the chain-bounce bonuses (3★/5★) plus 2-stacks-per-bounce (1★) compound the DoT. Best realized in a dedicated Missile squad.
`;

// ─────────────────────────────────────────────────────────────────────────────
// BRAZ UR PROMOTION (unchanged from v159)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_BRAZ_UR_PROMOTION = `
SEASON 6 — BRAZ UR PROMOTION (Powered by cpt-hedge.com)

NOT an Awakening — Braz gets a UR-tier Promotion (distinct system). Relevant for S6 because Braz is a strong seasonal pick.

WHAT IT IS: promotes Braz to UR rarity, raising base stats + improving his kit. Separate from the Awakening system (no Awakening Shards; no EW Lv.20 prereq).

CONTEXT: covered here because players ask about Braz alongside the S6 Awakening heroes (Kim/DVA/Tesla). Braz's promotion path uses standard UR promotion materials, not seasonal Awakening Shards.

For full Braz build/material detail, refer players to the dedicated Hedge Braz guide — this entry exists to disambiguate "Braz Promotion" (UR rarity upgrade) from "Hero Awakening" (Kim/DVA/Tesla seasonal system). They are NOT the same mechanic.
`;

// ─────────────────────────────────────────────────────────────────────────────
// FACTION DUEL — NEW SECTION (added Jun 15, 2026) — Week 7 finale
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_FACTION_DUEL = `
SEASON 6 — FACTION DUEL (Powered by cpt-hedge.com)

The grand finale of S6 — an all-out battle between Deepwood Clan and Wetland Clan for the Ancestral Temple and the Central Area.

WHEN: Sunday of Week 7.
  ⚠️ WEEK CONTESTED: the Faction Duel guide + the ultimate guide BODY say Week 7 (with Mon-Sat of Week 7 as the prep phase, battle Sunday). The ultimate guide FAQ says Week 8. Week 8 is otherwise pure settlement / Console Contest off-season. Treat Faction Duel as Week 7; confirm in-game.

STRUCTURE:
- PRE-SEASON / PREP PHASE (Mon-Sat of the final week): each Warzone's President or Vice President selects a Strategic Area to focus on during the battle.
- BATTLE (Sunday): the two factions fight for the Ancestral Temple + Central Area.

BATTLEFIELD: the Ancestral Temple plus 3 Giant Cannons positioned East / Northwest / Southwest of it. (Cannons function like the Sanctuary Cannons — contest them to aid attack or damage troops inside the objective.)

SCORING & REWARDS:
- The WINNING FACTION earns 30,000,000 Influence Points toward the FACTION ranking — NO individual Alliance or Commander points are awarded for the faction-win itself.
- Individual scoring happens via the Capitol War-style mechanics during the battle (kills, garrisoning, objective contribution) — these feed the individual point milestones + ranking rewards (similar structure to Sanctuary Duel scoring).
- Leading Warzones get privileges in the battle based on the prep-phase Strategic Area assignments.

WHY IT MATTERS: 30,000,000 IP is the single largest faction-ranking swing in the season — it can decide the final Faction Victory at settlement. Even though the faction win is points-only at the faction level, the individual rankings during the duel are a final War Merit opportunity.

DOCTRINE: Presidents/VPs lock Strategic Areas during the Mon-Sat prep · contest the 3 Giant Cannons early · treat the duel as both the faction-deciding event AND a last individual War Merit push.

NOTE: full prep-phase Strategic Area mechanics, leading-Warzone privileges, exact individual point tables, and reward chests are detailed in Hedge's dedicated Faction Duel guide; relay the high-level structure above and point players there for the granular tables, which were still being finalized at last sync.
`;

// ─────────────────────────────────────────────────────────────────────────────
// ALLIANCE SETTLEMENT REWARDS — NEW SECTION (added Jun 15, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_ALLIANCE_SETTLEMENT = `
SEASON 6 — ALLIANCE SETTLEMENT REWARDS (Powered by cpt-hedge.com)

End-of-season payout for your alliance, tracked by the Settlement Countdown on the Alliance screen. At zero, your alliance is slotted into one of 8 tiers by overall season performance; every member gets a package set by that tier + their role.

HOW TIERS WORK: each tier lists Reward Conditions (Complete Any) — meet ONE to unlock it. Two condition types:
- Influence Points Ranking — your alliance's position on the IP leaderboard (primary path).
- War Merit Ranking + an IP threshold — alternative combined condition (Tiers 2-7), via a War Merit category (Total / Destruction / Kill / Garrison / Fortify).
You receive the HIGHEST tier you qualify for (not a combination). Live progress shows green checkmarks against met conditions.

THE 8 TIERS:
| Tier | Influence Points Rank | Alternative War Merit Path                                                                 |
|------|-----------------------|---------------------------------------------------------------------------------------------|
| 1    | No.1                  | —                                                                                           |
| 2    | No.2-3                | No.1 Total War Merit + 1,200,000 IP                                                          |
| 3    | No.4-10               | No.2-3 Total, OR No.1 in Destruction/Kill/Garrison/Fortify — each + 600,000 IP               |
| 4    | No.11-20              | No.4-10 Total, OR No.2-3 in Destruction/Kill/Garrison/Fortify — each + 400,000 IP            |
| 5    | No.21-50              | No.11-20 Total + 300,000 IP                                                                  |
| 6    | No.51-80              | No.21-50 Total + 200,000 IP                                                                  |
| 7    | No.81-120             | No.51-100 Total + 100,000 IP                                                                 |
| 8    | No.121-999            | Alliance uses any Alliance Skill a combined 2 times (no ranking required — guaranteed floor) |

ROLE-BASED PACKAGES (within every tier; up to 100 members rewarded):
| Role            | Slots |
|-----------------|-------|
| Alliance Leader | 1     |
| Tactician       | 4     |
| Core Member     | 15    |
| Elite Member    | 30    |
| Valued Member   | 50    |
Leader gets the largest package, Tactician second; Core/Elite/Valued get a near-identical (smaller) package within a tier, split across more slots. Each package bundles points, resource chests, speed-ups, hero shards, decorations — all scaling up by tier.

WHERE INFLUENCE POINTS COME FROM: owning cities at settlement + destroying enemy-held cities during Faction/City Clash (one-time boost per successful destruction).

CLIMBING TIPS:
- Push IP if you control territory (own cities at settlement; destroy high-value enemy cities; make the most of your 2 War Declarations per war day).
- Lean on War Merit if IP is out of reach — Tiers 2-7 accept a strong War Merit ranking + a modest IP total:
    Destruction = tear down enemy cities (stack damage on one target) · Kill = kills over cities/grounds you or a pact ally control · Garrison = kills while garrisoned in a PACT ally's building · Fortify = consistent Recon Plane shielding (R4 shields top cities, max planes daily) · Total = well-rounded alliance-wide activity (incl. Beneath the Ruins Duels).
- Tiers 3-4 accept No.1 / No.2-3 in ONE specialized category as an alternative to Total — committing hard to one category can beat being mediocre at all.
- Don't sleep on the Tier 8 shortcut (use any Alliance Skill twice) — guaranteed floor; clear it early and climb on top.
- Front-load your push (War Merit is cumulative; a late surge rarely closes the gap). Re-check qualification regularly — rankings shift as rivals push.
`;

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY SCHEDULE — REWRITTEN (reconciled; contested weeks flagged inline)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_WEEKLY_SCHEDULE = `
SEASON 6 — WEEKLY SCHEDULE (Powered by cpt-hedge.com)

⚠️ Hedge's guides disagree on several back-half weeks (see Schedule-Conflict advisory). Contested
items are marked [CONTESTED] with both numberings. Always tell players to confirm exact weeks/days
in the in-game event calendar, which is authoritative.

WAR DECLARATION DAYS: Wednesday & Saturday every week (city/stronghold actions, Faction Clash).

WEEK 1
- Mon (Day 1): Season launch. Kimberly Awakening available. Fungus Institute L4 → build War Merit Shop. Claim Visitor (200k Mushrooms + 10 Bait), Doom Walker first kill (200k). Prioritize War Spoils in Faction Tech BEFORE Wed.
- Wed: Level 1 cities open for conquest — first cities captured (War Spoils income begins).
- [CONTESTED] Thu (Day 4): Global Expedition Round 1 (Kim) opens — per ultimate guide; hero guides say it opens Week 2.
- Sat: Level 2 cities open.
- Day 2 on: Beneath the Ruins (solo) opens, new stage daily.
- Days 1-9: Purge Action (daily zombie-level ranking).
- Days 1-7: Rainforest's Wrath (Devouring Flowers / Support Points).

WEEK 2
- Reset: cross-warzone teleport opens (take unowned strongholds cross-warzone any day; own-faction neutral cities cross-warzone on war days). Faction Clash itself still starts Week 3.
- Wed: Level 3 cities open.
- Sat: Sanctuary in your OWN warzone becomes available for conquest (internal to the warzone).
- Beneath the Ruins Duel Mode (PvP) opens.
- [CONTESTED] Some hero guides place Global Expedition Round 1 (Kim) here.

WEEK 3
- Faction Clash ACTIVATES — attack/Destroy enemy-faction cities (Wed/Sat). Enemy cities are destroyed, not captured.
- Altar Conquest begins — every Tuesday 12:00 server, 1 hour (5 Altars in the Central Area → Alliance Skills). Snake/Echo altar skills available from this week.
- DVA Awakening available.
- War Merit Shop: weekly Spore (10k) unlocks.
- [CONTESTED] Outpost placement No.1 — per dedicated Outpost guide (ultimate guide says first placement is Week 4).
- [CONTESTED] Global Expedition Round 2 (DVA) opens — per ultimate guide; hero guides say Week 4.

WEEK 4
- [CONTESTED] Outpost placement — No.2 per Outpost guide / No.1 per ultimate guide.
- Gust Altar skill (Serpent Breath) available from this week.
- [CONTESTED] Some hero guides place Global Expedition Round 2 (DVA) here.

WEEK 5
- [CONTESTED] Outpost placement — No.3 per Outpost guide / No.2 per ultimate guide.
- Outpost Conquest opens (runs Weeks 5-7; battles Wednesdays starting ~13:00 server, 1 hour).
- SANCTUARY DUEL #1 (Saturday, 13:00-24:00). Sanctuaries in OTHER warzones become available.
- [CONTESTED] Tesla Awakening available — per Tesla guide + ultimate; older Kim/DVA guides say Week 6.
- [CONTESTED] Global Expedition Round 3 (Tesla) opens — per ultimate guide; hero guides say Week 6.
- Feather Altar skill (Thunder Feathers) available from this week.

WEEK 6
- [CONTESTED] Outpost placement — No.4 per Outpost guide / No.3 per ultimate guide.
- SANCTUARY DUEL #2 (Saturday).
- Treehaven Altar skill (Tranquil Rewind) available from this week.
- [CONTESTED] Some hero guides place Tesla Awakening + Global Expedition Round 3 here.

WEEK 7
- [CONTESTED] Outpost placement No.4 — per ultimate guide only (Outpost guide ends placements at Week 6).
- SANCTUARY DUEL #3 (Saturday).
- [CONTESTED] FACTION DUEL — per Faction Duel guide + ultimate body: prep Mon-Sat, battle Sunday (winner +30,000,000 faction IP). Ultimate guide FAQ instead places it in Week 8.

WEEK 8
- Season Conclusion / Settlement: Alliance Settlement Rewards (8 tiers), Faction Victory Rewards, Faction War Rank settlement payouts.
- Console Contest (off-season content; not yet integrated here — add when off-season is active).
- [CONTESTED] Ultimate guide FAQ's alternative placement for the Faction Duel.

RECURRING EACH WEEK FROM WEEK 3:
- Tuesday 12:00: Altar Conquest (1 hour).
- Wednesday & Saturday: War Days — Faction Clash (Kill/Defense rankings), city Destroy actions, stronghold/owned-ground attacks.
- Wednesday ~13:00 (Weeks 5-7): Outpost Conquest battle window.
- Saturday 13:00-24:00 (Weeks 5-7): Sanctuary Duel scoring window.
`;

// ─────────────────────────────────────────────────────────────────────────────
// FAQ — EXPANDED (new topics + schedule-conflict Q)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_FAQ = `
SEASON 6 — FAQ (Powered by cpt-hedge.com)

Q: When does Season 6 / each event happen exactly?
A: S6 launched April 13, 2026 (first batch; 8-week season; later batches launched later). Hedge's guides disagree on several back-half weeks (Outpost placement, Global Expedition rounds, Tesla Awakening, Faction Duel). Give the value(s) from the relevant section but tell the player to confirm in the in-game event calendar — it's authoritative. Never present a contested week as certain.

Q: How do enemy cities work — capture or destroy?
A: You DESTROY enemy-faction cities (permanent ruin, no capture) once Faction Clash opens in Week 3. The Declare War button becomes Destroy. Destroy shares a 2/day limit with Declare War. IP on destruction: attacker +50% of the city's value, defender −100%, remaining 50% lost. Only the highest-contribution alliance is credited.

Q: How does Fishing work and why should I care?
A: Fish at any Fishing Ground your faction holds (across warzones). Bait = 1 per cast (daily Visitor; Golden Bait from Profession Specialization, 23.5h). The Casting Timing Bar only affects WEIGHT (rankings), not species or donation value. Donate catch to Faction Tech / Alliance Skills for Tech EXP/Energy + War Merit (350 common → 3,900 rare). 66 species total. Fishing in another alliance's ground risks Confiscation (still counts for Index/Rankings; becomes their Alliance Energy).

Q: What are Blessed Fish?
A: One designated species per Fishing Ground level, used from the Fungus Institute as a one-at-a-time blessing. Lower grounds: +2-5% Construction+Research speed. Higher grounds: that plus +4-8% Hero Attack. Using any overwrites the active one. They can't be accidentally donated.

Q: What is Faction Technology and War Spoils?
A: Faction-wide shared research from pooled catch donations; auto-unlocks Faction Functions + buffs for everyone. Prioritize War Spoils (2nd row) BEFORE the first cities Wed of Week 1 — it gives passive Rainforest Mushrooms per owned city (90/h L1, 100/h L2, 110/h L3), claimed manually. Faction Tech also unlocks the Pact abilities and raises the Alliance Energy cap (350k → 700k → 1.4M).

Q: What are Alliance Skills and who uses them?
A: Six skills unlocked via Faction Tech (Frog's Gifts, Week 1) + Altars (the other five, Weeks 3-6). Each is tied to a leadership role: Leader (Frog's Gifts + Tranquil Rewind), Recruiter (Snake Barrier), Muse (Night Army), Warlord (Serpent Breath), Butler (Thunder Feathers). Activated with Alliance Energy (from catch donations). Serpent Breath + Frog's Gifts earn the most War Merit.

Q: How do I unlock the War Merit Shop and what should I buy?
A: Fungus Institute Level 4, then build the shop. High priority: daily Rainforest Mushroom x10K (buy the full 40/day), Tactics Card Pack (UR), upgrade items (Training Certificates, Armament Cores). Rank gates at Vanguard II / Warrior I / Elite III. Spending does NOT reduce your War Merit leaderboard total. Unbought items accumulate.

Q: What's the daily routine?
A: Claim Visitor (200k Mushrooms + 10 Bait) · Doom Walker first kill (200k) · buy 40× 10k Mushrooms from the shop · Beneath the Ruins stage (+ PvP Duels from Week 2) · donate fishing catch · claim War Spoils. Weekly from Week 3: buy Spore from the shop. (See Seasonal Resources for the full checklist.)

Q: What are the early-season events?
A: Purge Action (Days 1-9, solo daily zombie-level ranking — Virus Resistance is key, ceiling ~16,500) · Rainforest's Wrath (Week 1, Doom Elite first kills → Devouring Flowers → Skill Medal boxes, 15/day) · Beneath the Ruins (minigame from Day 2; PvP Duels from Week 2, wager up to 3,000 War Merit / 4,000 with Season Skill).

Q: Hero Awakening — which heroes, what order, and can I unlock Day 1?
A: Kimberly (Week 1), DVA (Week 3), Tesla (Week 5 — contested vs Week 6). Each needs the hero at 5★, its EW at Lv.20+, and 50 named Awakening Shards. Day-1 unlock is NOT possible anymore (paid shard packs removed). Shards come free from the Hero Awakening Trial (up to 10) + Global Expedition. All three give a Damage Reduction ladder of 2.50% → 5.00% across 0-5 Awakening Stars; exact HP/Atk/Def values aren't published by Hedge.

Q: What changed with Tactics Cards?
A: The Hybrid (4+1) card is REMOVED — pure single-type squads are the standard. Three new Universal cards (Aftermath Burst / Dimensional Crit / Frontal Suppression, PvP + Global Expedition only). Card max level raised to 12 (+3 from a UR attribute → 15). Counter Reversal matters more than ever.

Q: How do alliance settlement rewards work?
A: 8 tiers at season end, by Influence Points ranking — with War Merit category performance (Total/Destruction/Kill/Garrison/Fortify + an IP threshold) as alternative paths for Tiers 2-7. Tier 8 is a guaranteed floor: use any Alliance Skill twice. You get the highest tier you qualify for. Rewards split by role (Leader/Tactician/Core/Elite/Valued, up to 100 members).

Q: What is the Faction Duel?
A: The Week-7 finale (contested vs Week 8): Deepwood vs Wetland for the Ancestral Temple + Central Area (3 Giant Cannons E/NW/SW). Prep Mon-Sat (Presidents/VPs pick Strategic Areas), battle Sunday. Winner: +30,000,000 faction IP (no individual points for the faction win itself; individual scoring runs via Capitol War-style mechanics).

Q: Strongholds vs Fishing Grounds?
A: Same thing — Fishing Grounds replace Strongholds. Fish at them (Fishing section); capture/hold them during Faction Clash (Stronghold Conquest section: ~450s to capture with 20 people, War Fever/shield rules, hold limit 4 +1 per city up to 12).
`;

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY ASSEMBLER — injected into buildSystemPrompt() when player.season === 6
// ─────────────────────────────────────────────────────────────────────────────

export function getSeason6Summary(): string {
  return `## Season 6 Guide — Lost Rainforest / Shadow Rainforest (Powered by cpt-hedge.com)

You have detailed Season 6 guide data below, sourced from cpt-hedge.com. Use it to answer
Season 6 questions accurately. When schedule weeks/days are contested between Hedge's guides
(flagged [CONTESTED] / ⚠️ below), relay the value(s) but tell the player to confirm in the
in-game event calendar — never present a contested week as certain.

${SEASON6_SCHEDULE_CONFLICT}

${SEASON6_OVERVIEW}

${SEASON6_FACTION_WAR_RANKS}

${SEASON6_FACTION_TECH}

${SEASON6_ALLIANCE_PACT}

${SEASON6_FISHING}

${SEASON6_BLESSED_FISH}

${SEASON6_STRONGHOLD_CONQUEST}

${SEASON6_ALTAR_CONQUEST}

${SEASON6_ALLIANCE_SKILLS}

${SEASON6_CITY_FACTION_CLASH}

${SEASON6_WARZONE_OUTPOST}

${SEASON6_SANCTUARY_DUEL}

${SEASON6_WAR_MERIT_SHOP}

${SEASON6_SEASONAL_RESOURCES}

${SEASON6_PURGE_ACTION}

${SEASON6_RAINFORESTS_WRATH}

${SEASON6_BENEATH_THE_RUINS}

${SEASON6_TACTICS_CARDS}

${SEASON6_GLOBAL_EXPEDITION}

${SEASON6_HERO_AWAKENING_DETAIL}

${SEASON6_DVA_AWAKENING}

${SEASON6_TESLA_AWAKENING}

${SEASON6_BRAZ_UR_PROMOTION}

${SEASON6_FACTION_DUEL}

${SEASON6_ALLIANCE_SETTLEMENT}

${SEASON6_WEEKLY_SCHEDULE}

${SEASON6_FAQ}

— End of Season 6 guide data. Powered by cpt-hedge.com —`;
}

// Dispatch helper — unchanged from v159. Returns the S6 summary when season === 6, else ''.
export function getSeasonDataSummary6(season: number): string {
  return season === 6 ? getSeason6Summary() : '';
}