// src/lib/lwtSeason6Data.ts
// Season 6 (Shadow Rainforest / Lost Rainforest) guide data
// Source: cpt-hedge.com — Powered by cpt-hedge.com per partnership agreement §3.4
//
// Synced from these Hedge guides (May 5, 2026 baseline + May 23, 2026 refresh):
//   • /guides/season-6-ultimate-guide
//   • /guides/season-6-war-merit
//   • /guides/season-6-faction-war-ranks
//   • /guides/season-6-altar-conquest
//   • /guides/season-6-tactics-cards
//   • /guides/season-6-global-expedition
//   • /guides/season-6-braz-ur-promotion
//   • /guides/season-6-kim-awakening
//   • /guides/season-6-dva-awakening          ← added May 23
//   • /guides/season-6-sanctuary-duel         ← added May 23
//   • /guides/season-6-warzone-outpost        ← added May 23
//   • /guides/season-6-alliance-pact          ← added May 23
//   • /guides/hero-awakening
//
// ✅ LIVE DATA — Season 6 launched April 13, 2026 on first batch of servers.
// Hedge is a living source — re-pull every 2 weeks until season ends, plus on
// any Hedge Discord announcement that an event guide has been published.
// Last synced: May 23, 2026 (Session 159 — corresponds to ~Week 6, mid-late season)
// Injected into buildSystemPrompt() via getSeason6Summary() when player.season === 6
//
// SESSION 159 CHANGE NOTES:
//   • CORRECTED Outpost schedule (was Weeks 4-7, actually Weeks 3-6 placement / Weeks 5-7 conquest)
//   • CORRECTED Hero Trial reward detail (10 shards span Basic+Advanced+Ultimate tiers, not Basic alone)
//   • ADDED SEASON6_DVA_AWAKENING — full skill detail for Week 3 Awakening
//   • ADDED SEASON6_SANCTUARY_DUEL — battle mechanics, Cannons, IP swings, ranking rewards
//   • ADDED SEASON6_WARZONE_OUTPOST — placement schedule, eligibility, conquest, defense
//   • ADDED SEASON6_ALLIANCE_PACT — formation, handshake mechanics, cooperation features
//   • UPDATED SEASON6_WEEKLY_SCHEDULE — corrected Outpost weeks, added City Destroy mechanic
//   • Kim Awakening Stars 3-5 DR remain TBD on Hedge (unchanged in 3 weeks)
//   • Tesla Awakening guide NOT YET PUBLISHED on Hedge (Week 6 unlock May 25 — re-pull next sync)

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
Faction formation (pre-season): The two strongest servers become faction leaders. Each picks 0 or 1 — combined result (even or odd) determines which group becomes Deepwood and which becomes Wetland. Rest of the servers are auto-assigned.

CORE LOOP:
Participate → Earn War Merit → Grow personally → Strengthen your Faction → Participate again.

THREE CORE PARTICIPATION SYSTEMS:
1. War Merit — personal cumulative progression. Every season activity earns it. Drives Faction War Rank promotion (19 ranks) for Daily Stipends, stat bonuses, and end-of-season settlement rewards. Top 4 ranks are position-based competition within your warzone.
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
   - FACTION BATTLEFIELD RULES (critical):
       - Internal Faction Protection: cannot attack cities held by your own faction's alliances
       - ENEMY CITY DESTRUCTION (NEW S6 MECHANIC): attacking cities in enemy warzones DESTROYS them instead of capturing — permanent, cannot be restored. Powerful way to permanently weaken enemy Influence Points and rankings.

2. ALLIANCE PACTS (NEW — full section below)
   - Formal cooperation between two same-faction alliances
   - Unlocks shared territory, defense support, reinforcement, shared chat
   - Requires mutually adjacent territory (Handshake Point)
   - 1 pact at a time per alliance
   - See SEASON6_ALLIANCE_PACT for full mechanics

3. FISHING GROUNDS (replaces Strongholds)
   - Occupy Fishing Grounds to unlock fishing and earn catch
   - Catch is donated to Alliance Skills and Faction Technology
   - Lightweight daily activity — does not directly affect combat strength
   - Catch donations also generate Alliance Energy, which is required to activate Altar-unlocked Alliance Skills
   - Full details: cpt-hedge.com Fishing Guide

4. WAR MERIT + FACTION WAR RANKS
   - Cumulative personal score earned through every season activity
   - Promotes you through 19 Faction War Ranks (Recruit → Chieftain)
   - Each promotion grants a Daily Stipend (claimable once per day, scales with rank, unclaimed sent via Mail)
   - Each rank also provides passive stat bonuses (Hero Stat Boost % + Virus Resistance + at top ranks Damage Reduction)
   - Spending War Merit in the War Merit Shop does NOT decrease your leaderboard total — it's a one-way counter
   - Settlement Stage: when the season enters settlement, War Merit stops increasing, Rank Bonuses stop applying, and Rankings lock
   - Full details: cpt-hedge.com War Merit Guide + Faction War Ranks Guide

5. ALTAR CONQUEST (starts Week 3, every Tuesday at 12:00 server time, 1-hour window)
   - Located in the central Great River Clan zone
   - 5 Altars total — capturing one unlocks a powerful Alliance Skill for Faction Clash
   - HOLDING LIMIT: 3 Altars maximum per Alliance — pick wisely
   - MUTUALLY EXCLUSIVE PAIRS: hold at most one from each pair
       Pair 1: Snake (Fortify) ↔ Gust (Warlord Missile)
       Pair 2: Echo (Mummy Army Summon) ↔ Feather (Tesla Coil)
   - Capture rules: NO adjacent territory required — any Alliance that can reach the battle zone can attempt capture
   - Activating Alliance Skills costs Alliance Energy, sourced primarily from donating catch (ties Altar system to Fishing loop)
   - Great River Clan's Gift: after capturing, any R4+ member can summon ONCE — spawns fish-school catch pickups around the Altar for the whole Alliance
   - Abandonment: 60 minutes, cannot be initiated within 1 hour before a Conquest window
   - Duplicate skill stacking does NOT work — capturing two altars with the same skill only activates once

6. WARZONE OUTPOSTS (NEW S6 STRUCTURE — full section below)
   - Each Warzone has 4 Outposts at corners of its Sanctuary area
   - Placement weeks: 3 / 4 / 5 / 6 (one per week, on Saturday)
   - ONE-TIME RESOURCE: once destroyed, gone forever — no rebuild
   - Conquest battles run Weeks 5-7
   - Critical for Sanctuary Duel eligibility — Outpost connections open attack routes
   - See SEASON6_WARZONE_OUTPOST for full mechanics

7. SANCTUARY DUEL (Weeks 5/6/7 Saturdays — full section below)
   - Centerpiece battle event of S6
   - Highest single-event Influence Point swing in the game
   - Eligibility via territory connection, Outpost connection, OR Alliance Pact partner
   - See SEASON6_SANCTUARY_DUEL for full mechanics

8. HERO AWAKENING (NEW)
   - New upgrade system in addition to Exclusive Weapons from prior seasons
   - Replaces the hero's Expertise Skill (4th skill) with a powerful Awakening Skill that inherits the Expertise effects + adds new abilities
   - Provides large stat boosts (HP, Attack, Defense) + Damage Reduction that grows with Awakening Stars
   - Includes visual upgrade: new avatar, hero model, illustrations, dynamic battle effects
   - UNLOCK PREREQUISITES (all three required):
       1. Hero must be at 5 Stars
       2. Hero's Exclusive Weapon must be at Level 20 or above
       3. 50 named Awakening Shards for that specific hero
   - Upgrade cost (named or Universal shards):
       Star 1: +80 shards (4 tiers × 20)   — running total 130
       Star 2: +200 shards (5 tiers × 40)  — running total 330
       Star 3: +350 shards (5 tiers × 70)  — running total 680
       Stars 4–5: TBD (Hedge updating as info emerges)
   - Awakening Skill upgrades with Skill Medals like any other hero skill, max level 40
   - SHARD SOURCES (all free, paid path removed):
       1. Hero Awakening Trial — Basic + Advanced + Ultimate tiers combined yield up to 10 shards per hero
          (Basic Trial: 3 stages, each gives 2,000 Skill Medals + 1 Awakening Shard + 200 Diamonds)
       2. Global Expedition — Weeks 2, 4, 6 (see Global Expedition section)
       3. NO Battle Pass / paid pack source. Hedge confirmed: previously available, since removed.
   - S6 SCHEDULE:
       Week 1: Kimberly (first Awakening, see Hero Awakening Detail section below)
       Week 3: DVA (see DVA Awakening section below)
       Week 6: Tesla (Hedge guide pending — re-pull next sync)

9. TACTICS CARDS — S6 CHANGES (significant)
   - 4+1 (Hybrid Squad) card REMOVED — the foundation of S4/S5 mixed-squad meta is gone
   - 3 new Universal cards (PvP + Global Expedition only):
       Aftermath Burst (Missile)    — All Missile heroes gain +18.75% damage over time at battle start, +6.25% per level
       Dimensional Crit (Tank)      — Tank Hero with highest Attack gains +2.70% Crit Rate, +0.9% per level
       Frontal Suppression (Aircraft) — 3 Aircraft heroes on back row gain +1.50% Attack Speed, +0.9% per level
   - Card max level RAISED to 12 (was 7), with up to +3 levels possible from the UR "Tactics Card Level Up" attribute → cap of 15
   - Mixed-squad combos (Tank+Adam, Air+Murphy, Quickstride+Mixed, Garrison+Mixed, PvE Zombie Killer mixed) are no longer viable in the same form — pure single-type squads become standard
   - Counter Reversal becomes more important than ever — pure squads are more exposed to type counters
   - Full details: cpt-hedge.com Season 6 Tactics Cards Guide

10. EW SHARDS IN HERO RECRUITMENT (NEW)
    - Hero Recruitment in the tavern now includes Exclusive Weapon Shards for Kim, DVA, and Tesla
    - Available with regular Hero Recruitment Tickets
    - Hedge recommendation: start saving Recruitment Tickets ahead of S6 to use during the season
    - Direct support for the EW Lvl 20 prereq on Awakening unlock for those three heroes

11. CROSS-WARZONE MOVEMENT (S6 specific)
    - Week 1: teleporting allowed only within your own warzone
    - Week 2+: Advanced Teleporter allows moves to other warzones
    - Alliance Expedition Assembly Point unlocks Alliance Teleporter for cross-warzone moves
    - Returning to original warzone also requires a teleport item
    - Most Daily Events completable in ANY warzone (don't need to return home)
    - Saturday War Days have special teleport rules — free teleports if enemy server is NOT in your season grouping
    - Free cross-warzone teleportation available between different season groups

NEW SEASONAL BUILDINGS (removed at end of season — use them while available):
- Spore Factory — built using Rainforest Mushrooms. Boosts Spore output, which accelerates construction and upgrades of the Fungus Institute.
  Hedge's Tip: Level each Spore Factory to 10 first to unlock the next one. Once all are unlocked, level them equally to maximize Rainforest Mushroom efficiency.
- Fungus Institute — built using Spore. Provides Virus Resistance buffs to commanders — important defensive stat throughout the season. AT LEVEL 4, unlocks the War Merit Shop.
- Protector's Field — obtained from the Golden Realm. Summons Desert Protectors to fight alongside and defend your forces.
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

// ─────────────────────────────────────────────────────────────────────────────
// FACTION WAR RANKS — full 19-rank table from Hedge's dedicated guide
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_FACTION_WAR_RANKS = `
SEASON 6 — FACTION WAR RANKS (Powered by cpt-hedge.com)

19 ranks total. First 15 advance by hitting Total War Merit thresholds.
Final 4 (Bloodguard, Centurion, Legate, Chieftain) are POSITION-BASED — top of the warzone Total War Merit ranking.
Both factions use identical thresholds and rewards. Rank names are prefixed by faction (e.g., Deepwood Hunter I = Wetland Hunter I).

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

KEY MILESTONE: Elite I unlocks 10 Gear Blueprints (MR) at season settlement — Hedge calls this "the most important milestone for most players investing in gear progression." Elite I requires 546,000 total War Merit cumulative.

DAILY STIPEND scales with rank (claim once per day + once on each promotion; unclaimed sent via Mail):
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

WAR MERIT SOURCES (earn it across all four categories):
1. Combat & Advancement — first kill of Doom Elite or Rainforest Zombies (once per level), participating in first capture of a Fishing Grounds or City
2. Events & Rankings — Purge Action (first 2 weeks only), Beneath the Ruins daily rankings (Day 2 onward, PvP wagers added Week 2)
3. Faction Confrontation — destroying enemy Faction Cities, Faction Clash Kill Ranking, Faction Clash Defense Ranking
4. Contribution & Construction — donating Catch to Alliance Skills, donating Catch to Faction Technology

ELITE-RANK COMPETITION (key strategic doctrine):
- Below Elite III: pure accumulation, can't be lost
- Bloodguard / Centurion / Legate / Chieftain: position-based, can shift as other players catch up. Demotion possible if you slip in rankings.
- Implication: top-rank chasers must stay active week-to-week, not just frontload accumulation.

WAR MERIT SHOP unlocks once Fungus Institute reaches Level 4. Spending War Merit in the shop does NOT reduce leaderboard total. Three rank-gated shop expansions: Vanguard I, Warrior I, Elite III each unlock additional shop items.

COSMETIC REWARDS: Higher ranks unlock Title, Avatar Frame, Nameplate. Top 4 ranks get a 7-day version on rank-up + 30-day version at settlement. Chieftain gets all three; Legate gets Title + Frame; Bloodguard and Centurion get Title only.

Note: Warrior I (Wetland) settlement also includes "Emote: Playful Spray."
`;

// ─────────────────────────────────────────────────────────────────────────────
// ALLIANCE PACT — NEW SECTION (added May 23, 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_ALLIANCE_PACT = `
SEASON 6 — ALLIANCE PACT (Powered by cpt-hedge.com)

A formal cooperation agreement between two alliances IN THE SAME FACTION. The mechanism that makes coordinated faction play possible — shared territory, mutual defense, reinforcement.

WHO CAN INITIATE: Alliance Leader OR Recruiter only. Both sides must confirm before the pact is established.

PACT REQUIREMENTS (all must be met):
1. Both alliances in the same season grouping AND same faction (Deepwood↔Deepwood or Wetland↔Wetland)
2. Both alliances maintain at least one mutually adjacent territory — the HANDSHAKE POINT (borders touch in Handshake status)
3. Neither alliance has an active Alliance Pact cooldown
4. NOT a War Declaration Day (Wednesday and Saturday — cannot initiate)
5. Each alliance can only hold 1 Alliance Pact at a time

THE HANDSHAKE POINT (foundation of the entire system):
- The point where both alliances' territories are mutually adjacent
- Once the pact forms, your ally's Alliance Lands count as adjacent to yours
- Enables marching through your ally's territory — opens new strategic routes, reaches enemy areas faster
- IF THE HANDSHAKE POINT IS LOST (enemy captures the adjacent territory): Pact is IMMEDIATELY invalidated. However, this does NOT trigger the cooldown — both alliances can form a new pact as soon as adjacency is re-established.

COOLDOWN AND CANCELLATION:
- 3-day cooldown applies after SUCCESSFUL pact formation
- Either side can cancel a pact at any time, which does NOT trigger cooldown
- Losing the Handshake Point also does NOT trigger cooldown
- Only successful formation triggers the 3-day cooldown

WHEN A PACT ENDS (any reason):
- All reinforcement troops sent to allied cities are immediately recalled
- The shared Friendly Alliance Group Chat is closed

COOPERATION FEATURES UNLOCKED BY ACTIVE PACT:

1. SHARED TERRITORY CONNECTIVITY
   - Both alliances can use each other's territory as if it was theirs
   - Expands advancement routes, bypasses terrain blocks, accelerates map movement

2. DEFENSE SUPPORT
   - Pact alliances can provide Defense Support for each other's:
       • Cities occupied by the ally
       • Outposts
       • The Capitol
       • Outpost Conquest battles
   - One of the highest-value pact benefits — faction wars frequently require multiple alliances coordinating defense

3. SHARED ALLIANCE WAR INFO
   - Visibility into ally's city garrison information
   - Dedicated Friendly Alliance Pin appears on the map for allied positions
   - Critical for coordinated command — react to threats faster, avoid duplication of effort
   - Shared "alliance chat" combines both alliances into one chat, up to 200 people

4. DEFENSE SUPPORT MARCH ACCELERATION
   - When providing Defense Support for allied buildings/cities, your march speed is INCREASED
   - Applies specifically to reinforcement marches toward pact ally locations
   - Helps establish defenses quickly when the situation is urgent

5. REINFORCE MECHANISM
   - Both alliances can reinforce each other's cities and buildings directly
   - IMPORTANT: Reinforce is NOT the same as Garrison. Reinforcement troops remain under control of BOTH alliances. Either R4/R5 (sender or receiver) can recall them.
   - Requirements to initiate reinforcement:
       • Active Alliance Pact with target alliance
       • Total reinforcement cap not reached
       • Target building/city is NOT in Destroy status
       • Cross-warzone reinforcement depends on battlefield rules in effect at the time

STRATEGIC DOCTRINE:
1. PROTECT YOUR HANDSHAKE POINT — your Pact is only as strong as that connection. If your border is under threat, prioritize defending the shared territory.
2. TIME PACT FORMATIONS CAREFULLY — the 3-day cooldown is significant. Pick a partner whose territory connectivity is most valuable, not just the first ally who asks.
3. PLAN AROUND WAR DAYS — pacts cannot be initiated Wed/Sat. If you anticipate needing a new pact after one ends, plan ahead so you aren't locked out.
4. USE PACT TERRITORY FOR TACTICAL ROUTING — map out routes you gain access to when evaluating potential pact partners. Land connectivity > raw power.
5. REINFORCE PROACTIVELY — don't wait for a city to be nearly captured. The march speed bonus is a proactive tool, not reactive.
6. FACTION WAR IS WON COLLECTIVELY — even the strongest alliance can't win S6 alone. A well-coordinated pact partner in the right location can be worth more than raw power.

PACT EXTENSION FOR SANCTUARY DUEL:
A pact partner of an eligible alliance can participate in Sanctuary Conquest, BUT only the pact partner gets eligibility — not all alliances in the pact partner's warzone. Plan pacts with this in mind in the weeks leading up to Week 5.
`;

// ─────────────────────────────────────────────────────────────────────────────
// ALTAR CONQUEST — corrected from prior file (had hallucinated Lv. 0 / wrong skill names)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_ALTAR_CONQUEST = `
SEASON 6 — ALTAR CONQUEST (Powered by cpt-hedge.com)

WHEN: Every Tuesday at 12:00 server time, starting Week 3. Each Conquest phase lasts exactly 1 hour.
WHERE: Central Area held by the Great River Clan.
WHO BENEFITS: Capturing alliance — Alliance Skills usable in subsequent Faction Clash battles.

THE FIVE ALTARS:
| Level | Altar           | Buff Name        | Alliance Skill Unlocked |
|-------|-----------------|------------------|--------------------------|
| 1     | Snake Altar     | Snake Barrier    | Fortify                 |
| 2     | Echo Altar      | Night Army       | Mummy Army Summon       |
| 3     | Gust Altar      | Serpent Breath   | Warlord Missile         |
| 4     | Feather Altar   | Thunder Feathers | Tesla Coil              |
| 5     | Treehaven Altar | Tranquil Rewind  | Refresh                 |

CRITICAL RULES:
- HOLDING LIMIT: 3 Altars per Alliance maximum. Reaching the limit auto-dismisses any troops mid-capture on additional Altars.
- MUTUALLY EXCLUSIVE PAIRS — your Alliance can hold AT MOST ONE from each pair:
    Pair 1: Snake (Fortify) ↔ Gust (Warlord Missile)
    Pair 2: Echo (Mummy Army Summon) ↔ Feather (Tesla Coil)
  → If you already own one and start capturing the other, troops are automatically dismissed.
- DUPLICATE STACKING DOESN'T WORK: capturing 2 altars with the same skill only activates that skill once.
- NO ADJACENT TERRITORY required — Altars can be captured from anywhere your troops can reach.

CAPTURE LOGIC:
- Owned Altars: must push to 100% within the 1-hour window. Failure = Altar stays with current owner.
- Unowned Altars: first Alliance to 100% wins. If no one hits 100%, the Alliance with highest progress that meets holding requirements gets it. If none qualify, Altar stays Neutral.
- Capture is INTERRUPTED if: Alliance hits 3-altar cap mid-capture, Commander leaves Alliance, Alliance disbands.

ALLIANCE ENERGY:
- Required to ACTIVATE Alliance Skills from captured Altars
- Primary source: donating catch (from Fishing Grounds)
- This ties the Altar system directly into the Fishing + Faction Technology loops

GREAT RIVER CLAN'S GIFT (one-time per captured Altar):
- After successful capture, any R4+ member can summon the Gift ONCE
- Spawns large fish schools around the Altar — any Alliance member can travel to collect catch
- Catch contributes to Alliance Energy + Faction Technology + War Merit
- Single-use per Altar — does not repeat

ABANDONMENT:
- 60-minute timer, cancellable before completion
- Cannot start abandonment within 1 hour before a Conquest window
- Skills already in effect (e.g., active Fortify, active Refresh) continue until they expire naturally
- Skills currently being cast are NOT interrupted by abandonment

STRATEGIC DOCTRINE:
1. Decide your 3 Altars BEFORE Tuesday — going in without a plan wastes the window
2. Mutually exclusive pairs force a strategic split — pick which skills complement your Alliance's Faction Clash role
3. Week 3 = best capture window — all altars start Neutral; capture progress is faster than dislodging an established owner
4. Always summon Great River Clan's Gift immediately after capture — once per altar, easy to forget
5. If swapping altars between weeks, start abandonment EARLY (60-min timer + 1-hr lockout before Conquest)
`;

// ─────────────────────────────────────────────────────────────────────────────
// WARZONE OUTPOST — NEW SECTION (added May 23, 2026)
// CRITICAL: Corrects schedule errors that were in prior weekly schedule
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_WARZONE_OUTPOST = `
SEASON 6 — WARZONE OUTPOSTS (Powered by cpt-hedge.com)

S6 Outposts work DIFFERENTLY from Season 5. Each Warzone has 4 Outpost slots positioned at the corners of its Sanctuary area. ONE-TIME STRATEGIC RESOURCES: once destroyed, gone forever — no rebuild.

OUTPOST PLACEMENT SCHEDULE (one Outpost unlocks per week):
| Outpost  | Week | Season Day  |
|----------|------|-------------|
| No. 1    | 3    | Day 21-22   |
| No. 2    | 4    | Day 28-29   |
| No. 3    | 5    | Day 35-36   |
| No. 4    | 6    | Day 42-43   |

Saturday of each week = placement day. Sunday available for construction.
Outpost Conquest opens from Week 5 onward — the first Outpost placed in Week 3 sits unchallenged through Week 4 before becoming a valid target.

PLACEMENT RULES:
- Only the President of the Faction may place an Outpost during the placement phase
- Each Faction gets 1 placement per placement phase
- Restricted to the designated area of the Warzone for their Faction
- ONCE PLACED, POSITION CANNOT BE CHANGED
- Areas that have been destroyed or already had an Outpost placed cannot be used again

PLACEMENT STRATEGY:
- Outposts near the ENEMY SANCTUARY open up attack routes for Sanctuary Duel (Weeks 5-7)
- Outposts near YOUR OWN SANCTUARY anchor your defensive position
- Presidents should coordinate with Alliance leadership before committing

CONSTRUCTION:
- After placement, an Alliance in the Warzone must build the Outpost before it becomes active
- Once construction is complete:
    • Provides a territory link effect for ALL Alliances in the Warzone
    • The Alliance with the HIGHEST Construction Contribution becomes the OWNING Alliance
- Contributing is important both for the faction as a whole AND for your Alliance specifically if you want ownership

DEFENSE PARTICIPATION (one of the following required):
1. Alliance Pact with the Outpost-owning Alliance
2. Your Warzone territory connected to the Outpost
3. Member of an Alliance in another Warzone of the same Faction with a City or Stronghold connected to the Outpost

(Players must be in an Alliance to participate in attack or defense.)

OUTPOST CONQUEST — ATTACKING:
- Only ENEMY FACTION Outposts that have completed construction can be attacked
- Must first establish a CONNECTION PATH by capturing Cities or Strongholds around the Outpost
- Once a connection exists, attack rules:
    • If any Alliance in your Warzone has already connected → ALL Alliances in your Warzone can join the attack
    • If no connection yet → must Form a Pact with an Alliance with occupied nearby Strongholds, then launch a Joint Attack

COMBAT RULES:
- Outpost Conquest runs Week 5 through Week 7 in 3 battle phases (I, II, III)
- Battles only during Battle Time
- Outcomes:
    • Attacker wins if capture progress reaches 100% → Outpost permanently DESTROYED, can never be placed in that area again
    • Defender wins if attacker does not reach 100% before battle ends → ownership unchanged
    • If 100% was reached but pushed back → ownership unchanged
- OUTPOST CANNONS positioned around each Outpost — can garrison troops in them. Contributes to scoring during the event.

CAPTURE THE OUTPOST REWARDS (event runs alongside battles):
- 3 reward chests at 130,000 / 260,000 / 400,000 points
- Completing all three:
    • 7,000 Honor Points total
    • 3,000 Upgrade Ore total
    • 60 Drone Parts total
- Points come primarily from kills:
    • Fighting at a Warzone Outpost or Outpost Cannon = MOST points per kill
    • Kills on Contaminated Land = second-tier
    • Garrisoning inside an Outpost or Outpost Cannon = points over time

STRATEGIC DOCTRINE:
1. THINK WEEKS 4-6 WHEN PLACING IN WEEK 3 — the Week 3 Outpost is the only one that sits before Conquest opens. Use it to claim a position that threatens enemy Sanctuary or shores up your own.
2. PRIORITIZE CONSTRUCTION EARLY — Outpost only becomes an active asset (and a valid target) once construction is complete. Get the Warzone moving fast.
3. ALLIANCE PACTS ARE YOUR DEFENSIVE SAFETY NET — if your Alliance lacks adjacent territory to all 4 Outposts, establish Pacts with Alliances that have it. Set up BEFORE Battle Time, not during.
4. CONNECTING MULTIPLE ALLIANCES EXPANDS YOUR ATTACK OPTIONS — when any Alliance in your Warzone connects to an enemy Outpost, it unlocks the attack for the entire Warzone. Coordinate the first connection.
5. DESTROYING AN OUTPOST PERMANENTLY CLOSES THAT AREA — gone forever, cuts off territory link effects, permanently removes that placement option. Think twice before destroying if the territory link benefits your own Warzone routing.
6. DEFENDERS: FOCUS ON DENYING THE FIRST CONNECTION — hardest moment for attackers is before they establish a connection path. Defend surrounding Cities and Strongholds aggressively.

Hedge's tip: "Each Warzone Outpost is a one-time strategic resource. Once lost it cannot be recovered. Unlike Season 5 Outposts, there is no rebuild mechanic — plan accordingly and prioritize your most exposed Outposts."
`;

// ─────────────────────────────────────────────────────────────────────────────
// SANCTUARY DUEL — NEW SECTION (added May 23, 2026)
// Major battle event of S6 — Weeks 5/6/7 Saturdays
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_SANCTUARY_DUEL = `
SEASON 6 — SANCTUARY DUEL (Powered by cpt-hedge.com)

The CENTERPIECE BATTLE EVENT of Season 6: Lost Rainforest. The highest-stakes moment of each of Weeks 5, 6, and 7. Destroying an enemy Sanctuary shifts massive Influence Points between factions. Individual ranking rewards are among the best of the season.

Success depends not just on firepower — but on the territorial setup your faction and alliance have built in the weeks leading up to it.

WHEN:
- Saturdays of Weeks 5, 6, and 7
- Contest window: 13:00 to 24:00 server time (same day)
- Actions before 13:00 do NOT count retroactively toward scoring

PARTICIPATION ELIGIBILITY (NOT AUTOMATIC — must meet one of these):

Route 1: TERRITORY CONNECTION
- When any alliance in your Warzone holds territory directly connected to a Sanctuary, ALL alliances in your Warzone become eligible to participate in that Sanctuary's Conquest.

Route 2: OUTPOST CONNECTION
- When your Warzone's Outpost establishes a connection with a Sanctuary, ALL alliances in your Warzone may participate.
- This is the core strategic link between Outpost placement (Weeks 3-6) and Sanctuary Duel (Weeks 5-7).
- IF YOUR OUTPOST IS DESTROYED before the Sanctuary Duel, the connection is lost. Defending Outposts during Outpost Conquest is therefore directly preserving your attack routes into enemy Sanctuaries.

Route 3: ALLIANCE PACT EXTENSION
- A Pact partner of an eligible alliance can ALSO participate
- IMPORTANT LIMIT: only the pact partner alliance gains eligibility — NOT all alliances in the pact partner's Warzone
- Hedge's tip: forming a Pact with an alliance that holds a territory or Outpost connection to a key enemy Sanctuary is a direct path to eligibility if your own warzone doesn't have one. Plan pacts with this in mind.

BATTLE MECHANICS:
- Each Sanctuary Conquest lasts 1 hour
- If no faction successfully captures within the hour, ownership stays with whoever held it before
- Standard city-capture mechanics: fill the capture bar to take ownership
- Your faction's troops must move inside and hold it

CANNONS (capturable objectives around the Sanctuary — both offensive AND defensive tools):
- SAME FACTION AS CURRENT SANCTUARY CAPTOR: capturing the Cannon INCREASES your capture speed
- DIFFERENT FACTION FROM CURRENT CAPTOR: the Cannon DEALS DAMAGE to troops inside the Sanctuary
- On attack, capture Cannons early to accelerate progress
- On defense, contest any Cannon you're losing to deny the speed boost AND absorb the damage
- Cannons are often contested at the START of the battle before either faction has committed heavily to the Sanctuary itself
- Losing Cannons mid-fight can quickly reverse momentum

INFLUENCE POINTS IMPACT (the highest single-target IP swings in the season):

| Outcome                                  | Effect                                                                                                          |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Your faction CAPTURES the Sanctuary      | Top 60 alliances in your faction's IP ranking each gain +200,000 Influence Points                              |
| You DESTROY the enemy Sanctuary          | Top 60 alliances in your attacking faction each gain +100,000 Destruction Influence Points                     |
| Enemy DESTROYS your Sanctuary            | The 200,000 IP your faction received for the original capture are DEDUCTED from the alliances that received them|

CRITICAL DEDUCTION RULE: When your Sanctuary is destroyed, points are removed specifically from the alliances that received them at the original capture — NOT recalculated based on the current ranking. The cost is predictable, but the alliances that get hit are specifically those who benefited most from holding it.

POINT SCORING & MILESTONES (parallel individual scoring during 13:00-24:00 window):
Primary source: killing units in City or Stronghold battles. Each lost Level 1 unit earns points, scaling by unit tier.

| Points        | Alliance Pts | 5m Speed-ups | Chests | Honor Pts | Upgrade Ore | Drone Parts |
|---------------|--------------|--------------|--------|-----------|-------------|-------------|
| 125,000       | 2            | 30           | —      | 3.5K      | 800         | 8           |
| 250,000       | 2            | 30           | —      | 3.5K      | 800         | 8           |
| 375,000       | 2            | 30           | —      | 4.0K      | 800         | 8           |
| 500,000       | 3            | 40           | —      | 4.5K      | 1,000       | 10          |
| 750,000       | 3            | 40           | —      | 4.5K      | 1,000       | 10          |
| 1,000,000     | 3            | 40           | —      | 5.0K      | 1,000       | 10          |
| 1,500,000     | 4            | 50           | —      | 5.5K      | 1,200       | 12          |
| 2,000,000     | 4            | 50           | —      | 5.5K      | 1,200       | 12          |
| 3,000,000     | 5            | 60           | —      | 6.0K      | 1,500       | 15          |
| **Total**     | **28**       | **370**      | —      | **42.0K** | **9,300**   | **93**      |

RANKING REWARDS (some of the largest individual payouts of the season):

| Rank   | Survivor Tickets | Resource Choice Chests | 5m Construction | 5m Troop | War Merit |
|--------|------------------|------------------------|-----------------|----------|-----------|
| 1      | 20               | 500                    | 50              | 100      | 10,000    |
| 2      | 18               | 450                    | 45              | 90       | 9,500     |
| 3      | 16               | 400                    | 40              | 80       | 9,000     |
| 4-10   | 14               | 350                    | 35              | 70       | 8,000     |

SANCTUARY DESTRUCTION REWARDS (alliance-wide chest tied to which enemy Sanctuary you destroyed):
- 10 Hero's Return Recruitment Tickets
- 10,000 Spore
- 60 × 5m Research Speed-ups
- 60 × 5m Construction Speed-ups

STRATEGIC DOCTRINE:

1. YOUR OUTPOST PLACEMENT DETERMINES EVERYTHING
   The most important preparation for Sanctuary Duel happens WEEKS before. Outposts placed near enemy Sanctuaries in Weeks 3-4 create the attack routes that Week 5-7 battles are fought along. If your Outposts are destroyed in early Conquest windows, those routes close.
   Treat Outpost defense in the lead-up to Sanctuary Duel as DIRECT PREPARATION for the battle itself.

2. PRIORITIZE YOUR OWN SANCTUARY DEFENSE
   Losing your Sanctuary costs the top 60 alliances in your faction 200,000 IP each — the single largest point swing in the game. Even if you're in a strong attacking position, ALWAYS ensure your own Sanctuary is adequately defended before committing forces elsewhere. The point loss from a successful enemy attack outweighs almost anything else you could be doing.

3. CONTROL CANNONS EARLY
   Cannons are often contested at battle start before either faction has committed heavily to the Sanctuary itself. Securing them = accelerated capture progress + damage output against enemy troops. Losing them mid-fight quickly reverses momentum.

4. USE ALLIANCE PACTS TO EXTEND REACH
   If your alliance lacks direct eligibility for a target Sanctuary, check whether a Pact with an alliance that has a connection opens it up. Cross-Warzone coordination via Pacts is one of the strongest tools available in the later weeks of the season.

5. PUSH COMBAT DURING THE SCORING WINDOW
   Personal ranking rewards are based on point scoring during the 13:00-24:00 window only. Be actively fighting in City or Stronghold battles during this period. Even finishing in the No. 4-10 range is worth competing for.
`;

// ─────────────────────────────────────────────────────────────────────────────
// TACTICS CARDS — S6 changes (significant — 4+1 removed, 3 new universals)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_TACTICS_CARDS = `
SEASON 6 — TACTICS CARDS (Powered by cpt-hedge.com)

THE BIG CHANGE: The Hybrid Squad (4+1) card has been REMOVED from S6.
Implication: S4/S5 mixed-squad meta is gone. Tank+Adam, Air+Murphy, Quickstride+Mixed, Garrison+Mixed, the PvE Zombie Killer build all need rethinking. Pure single-type squads become the new standard.

THREE NEW UNIVERSAL CARDS (PvP + Global Expedition only — NOT PvE):

1. AFTERMATH BURST (Missile)
   - All Missile Heroes gain +18.75% damage over time at battle start (Lv. 1)
   - +6.25% per upgrade level
   - IMPORTANT: only affects damage-over-time skills, NOT regular damage
   - Among Missile heroes, this benefits Swift's burn (auto attack) and Fiona's radiation (auto attack)

2. DIMENSIONAL CRIT (Tank)
   - Tank Hero with the HIGHEST ATTACK gains +2.70% Crit Rate at battle start (Lv. 1)
   - +0.9% per upgrade level
   - Targets ONE hero — the tank with highest attack stat
   - In Tank squads this is typically Kim or Stetmann; EW level + gear determines which one benefits
   - Kim's Awakened Skills may shift which tank ends up with highest attack stat — factor this in

3. FRONTAL SUPPRESSION (Aircraft)
   - 3 Aircraft Heroes on the back row gain +1.50% Attack Speed at battle start (Lv. 1)
   - +0.9% per upgrade level
   - Back-row placement matters — fewer than 3 aircraft on back row = effect may not fully apply
   - DVA tradeoff: keep her in front (safe from back-row attacks) vs move her to back (gets attack speed buff)

CARD LEVELS RAISED: Max level is now 12 (was 7), with up to +3 levels from the UR "Tactics Card Level Up" attribute → effective cap of 15.

RANDOM ATTRIBUTE POOL (all three new cards share):
| Attribute                                 | Rarity | Value         |
|-------------------------------------------|--------|---------------|
| Tactics Card Level Up                     | UR     | +1 level      |
| PvP Defending Hero Defense                | SSR    | 2.50% – 3.00% |
| PvP Defending Hero Attack                 | SSR    | 2.50% – 3.00% |
| PvP Defending Hero HP                     | SSR    | 2.50% – 3.00% |
| Reduces Damage Taken when countered       | SSR    | 0.50%         |
| Regular attributes                        | R      | various       |

Look for cards with 3 attributes, all SSR minimum. UR "Tactics Card Level Up" is the highest-value find — adds a level on top of the cap.

COUNTER REVERSAL becomes critical in S6 — pure single-type squads are more exposed to type counters than the old mixed squads were.

EARLY-SEASON STARTING SETUPS (per Hedge — baseline to experiment from):

MISSILE / Aftermath Burst Setup:
  Cards: Aftermath Burst, Counter Reversal, Quickstride - Attribute Boost, Quickstride - Contaminated Land
  Core: Quickstride - Morale Boost, Quickstride - Quick March (or Battlestreak - Morale Boost)

TANK / Dimensional Crit Setup:
  Cards: Frontal Suppression*, Counter Reversal, Quickstride - Attribute Boost, Quickstride - Contaminated Land
  Core: Quickstride - Morale Boost, Quickstride - Quick March (or Garrison - Defensive Regroup depending on role)
  *Note: Hedge's published guide lists "Frontal Suppression" in the Tank setup — this appears to be a typo on Hedge's side; logic suggests Dimensional Crit. Verify with Hedge before treating as authoritative.

AIRCRAFT / Frontal Suppression Setup:
  Cards: Frontal Suppression, Counter Reversal, Quickstride - Attribute Boost, Quickstride - Contaminated Land
  Core: Quickstride - Morale Boost, Quickstride - Quick March (or Garrison - Defensive Regroup)

GARRISON DEFENSE Setup (any type):
  Cards: type-matched Universal (Aftermath Burst / Dimensional Crit / Frontal Suppression), Counter Reversal, Garrison - Duration, Garrison - Attribute Boost
  Core: Garrison - Defensive Regroup (active), Garrison - Morale Boost

TACTICS CARD PACKS available in the War Merit Shop (refreshes daily/weekly).

NOTE: Counter Reversal is "arguably more important in Season 6 than it was before" per Hedge — pure squads expose you to type counters more than mixed squads did.
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL EXPEDITION — primary Awakening Shard source (must-know)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_GLOBAL_EXPEDITION = `
SEASON 6 — GLOBAL EXPEDITION (Powered by cpt-hedge.com)

NEW S6 mode. THE primary FREE source of Hero Awakening Shards.

WHEN: 3 rounds × 14 days each, opening Day 1 of Week 2, Week 4, and Week 6.
WHERE: Alert Tower in your base (alongside T11 Restricted Area Training).
HOW: Set up a hero team that fights through stages automatically (similar to Armed Truck). 1 point per cleared stage.

ROUND-TO-HERO MAPPING:
- Round 1 (Week 2-3): Kimberly-specific Awakening Shards
- Round 2 (Week 4-5): DVA-specific Awakening Shards
- Round 3 (Week 6-7): Tesla-specific Awakening Shards

AREA UNLOCK SCHEDULE (per round):
- Day 1: Area 1
- Day 3: Area 2
- Day 5: Area 3
- Day 7: Area 4
First stage in Area 1 starts at 33.0M combat power. Difficulty scales up.
Auto-Challenge unlocks at stage 4 — once you significantly outpower stages, you can blaze through hundreds in seconds.
Points DON'T carry over between rounds. Push hard during each 14-day window.

AREA BUFFS (change each round — check at start of each round):
- Round 1, Area 1: After 6 damage instances from skills/Awakened Skills, hero triggers extra Energy Damage attack = 150% of Attack to all enemies. Favors heroes with frequent multi-hit skill activations.

TACTICS CARD BONUSES — only NON-CORE cards count, based on total upgrade level:
| Total Non-Core Card Level | Hero Attack | Defense |
|---------------------------|-------------|---------|
| 16 – 30                   | +5,000      | +1,200  |
| 32 – 46                   | +5,000      | +1,800  |
| 48 – 60                   | +10,000     | +2,400  |
Upgrading non-core cards before each round = meaningful power boost.

REWARDS — three tracks:

1. POINTS REWARDS (cumulative across all areas):
| Total Points       | Reward (every 50 points)              |
|--------------------|---------------------------------------|
| 1 – 750            | 2 Named Hero Awakening Shards         |
| 751 – 1,500        | 2 Universal Hero Awakening Shards     |
| 1,501 – 3,000      | 1 Universal Hero Awakening Shard      |
| 3,001 – 6,000      | 1 Universal Exclusive Weapon Shard    |
- First 750 points = NAMED shards for current round's awakening hero (Kim/DVA/Tesla)
- 6,000 points = practical reward cap

2. AREA REWARDS (per-area, refreshes per round):
   - Milestones every 10 stages cleared
   - 1 Exclusive Weapon Shard Choice Box per 50 stages cleared, up to 1,500 stages
   - Above 1,500 area stages: regular rewards only

3. RANKING REWARDS (end-of-round):
| Rank        | Rewards                                                                          |
|-------------|----------------------------------------------------------------------------------|
| 1           | Title: Global Dominator (14d), 30 Universal Awakening Shards, 5x Resource Chest UR (Coin/Iron/Food) |
| 2 – 3       | Title: Global Vanquisher (14d), 20 Universal Awakening Shards, 4x Resource Chest UR             |
| 4 – 10      | Title: Global Pioneer (14d), 15 Universal Awakening Shards, 3x Resource Chest UR                |
| 11 – 100    | 10 Universal Awakening Shards, 3x Resource Chest UR                                              |
| 101 – 5,000 | 5 Universal Awakening Shards, 2x Resource Chest UR                                               |

STRATEGIC DOCTRINE:
- Push HARD in Weeks 2, 4, 6 — points don't carry over
- Named shards (first 750 points) are most efficient — direct progress on current round's awakening hero
- Upgrade non-core Tactics Cards BEFORE each round
- Auto-Battle for fast clearing once your power outmatches stages
`;

// ─────────────────────────────────────────────────────────────────────────────
// HERO AWAKENING — Kimberly detail (first to awaken)
// CORRECTED: Hero Trial reward detail (10 shards spans Basic+Advanced+Ultimate)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_HERO_AWAKENING_DETAIL = `
SEASON 6 — HERO AWAKENING DETAIL (Powered by cpt-hedge.com)

S6 SCHEDULE:
- Week 1: Kimberly (Ember Light) — DETAILED BELOW
- Week 3: DVA — see SEASON6_DVA_AWAKENING section below
- Week 6: Tesla — Hedge guide pending publication (expected at unlock May 25); re-pull next sync

UNIVERSAL AWAKENING REQUIREMENTS (any hero):
1. Hero at 5 Stars
2. Hero's Exclusive Weapon at Level 20 or above
3. 50 named Awakening Shards (specific to that hero)
All three must be met simultaneously — no shortcuts.

UPGRADE COSTS (after unlock):
| Stage              | Shards/Tier | Tiers | Stage Total | Running Total |
|--------------------|-------------|-------|-------------|----------------|
| Unlock             | 50 named    | 1     | 50          | 50             |
| → Star 1           | 20          | 4     | 80          | 130            |
| → Star 2           | 40          | 5     | 200         | 330            |
| → Star 3           | 70          | 5     | 350         | 680            |
| → Star 4           | TBD         | TBD   | TBD         | TBD            |
| → Star 5           | TBD         | TBD   | TBD         | TBD            |
After unlock, named OR Universal Awakening Shards are interchangeable.
Awakening Skill itself upgrades with Skill Medals like a normal skill, max level 40.

SHARD SOURCES (all FREE — no paid path remaining):
1. HERO AWAKENING TRIAL — opens when hero gets Awakened form
   - Basic Trial: 3 stages — each provides 2,000 Skill Medals + 1 Awakening Shard + 200 Diamonds
   - Up to 10 shards TOTAL per hero across Basic + Advanced + Ultimate tiers combined
   - (Note: Hedge's guide notes Advanced/Ultimate per-stage rewards aren't fully published yet — total cap is 10)
2. GLOBAL EXPEDITION — Weeks 2, 4, 6 (see Global Expedition section). Currently the PRIMARY path.
3. Battle Pass / paid packs (70 + 300 shards) were available initially but have been REMOVED. Going forward, shards are entirely free-to-earn.
4. Hedge expects post-S6 Black Market may include Awakening Shards — unconfirmed.

KEY IMPLICATION: It is NO LONGER POSSIBLE to unlock an Awakening on the day it becomes available. Trial + Global Expedition don't yield enough shards on Day 1 for the 50-shard unlock threshold.

═══════════════════════════════════════════════════════════════════════════════
KIMBERLY (Ember Light) — First Awakening, Week 1
═══════════════════════════════════════════════════════════════════════════════

UNLOCK PREREQS:
- Kim at 5 Stars
- Kim's Exclusive Weapon at Level 20+
- 50 Kimberly-specific Awakening Shards

AWAKENING SKILL — PRICELESS RESOLVE (replaces Super Sensing, inherits its effects):
- Base (Lv. 1): Kim fires 10 barrages, each dealing Energy Damage = 140.04% of Attack to 1 random enemy
- For every 1 stack of Energy Amplification she has, +3 additional barrages, capped at 25 total barrages
- At maximum barrages, total damage = 3,501.09% of Attack in Energy Damage
- Maxes out at level 40 (Skill Medals)

STAR-GATED BONUSES TO PRICELESS RESOLVE:
| Stars | Bonus Unlocked                                                            |
|-------|---------------------------------------------------------------------------|
| 1     | At start of battle, Kim enters [Resolve] state                            |
| 2     | Deals 20% Extra Damage                                                    |
| 3     | On using Awakening Skill, immediately gains 2 stacks of Energy Amplification |
| 4     | Deals 40% Extra Damage                                                    |
| 5     | Launches 1 additional barrage per stack of Energy Amplification           |

The 3-Star + 5-Star bonuses pair powerfully with Kim's existing EW Energy Amplification mechanic. At 5 Stars with full Energy Amplification stacks active, she fires far more than the base 10 barrages.

DAMAGE REDUCTION FROM AWAKENING (passive):
| Awakening Stars | Damage Reduction |
|-----------------|------------------|
| 0 (unlock)      | 2.50%            |
| 1               | 3.00%            |
| 2               | 3.50%            |
| 3 – 5           | TBD              |

Awakening also grants Hero HP / Attack / Defense buffs that scale with each tier (specific values TBD per Hedge).

VERDICT (Hedge): "If Kimberly is part of your main squad, yes — the Awakening is a strong upgrade and well worth pursuing." Particularly strong if running a full Tank squad.
`;

// ─────────────────────────────────────────────────────────────────────────────
// DVA AWAKENING — NEW SECTION (added May 23, 2026, Week 3 unlock)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_DVA_AWAKENING = `
SEASON 6 — DVA AWAKENING (Powered by cpt-hedge.com)

WHEN: DVA's Awakening unlocks in WEEK 3 of Season 6 (second hero after Kimberly, before Tesla in Week 6).

UNLOCK PREREQS (universal Awakening rules):
- DVA at 5 Stars
- DVA's Exclusive Weapon at Level 20+
- 50 DVA-specific Awakening Shards

DAY-1 UNLOCK: NOT POSSIBLE. Paid packs were removed and Global Expedition Round 2 (DVA shards) doesn't open until Day 1 of Week 3 itself — and 14 days isn't enough to farm 50 shards solely from Trial + Round 2.

SHARD SOURCES FOR DVA:
1. Hero Awakening Trial (opens when DVA gets Awakened form) — Basic Trial: 3 stages, each gives 2,000 Skill Medals + 1 DVA Awakening Shard + 200 Diamonds. Up to 10 shards total across Basic+Advanced+Ultimate.
2. Global Expedition Round 2 — opens Day 1 of Week 3, runs 14 days. Primary free shard source.

═══════════════════════════════════════════════════════════════════════════════
AWAKENING SKILL — STARRED ACE
═══════════════════════════════════════════════════════════════════════════════

Energy Damage skill that REPLACES DVA's Expertise Skill (Super Sensing) while INHERITING its effects.

BASE (Lv. 1):
- DVA goes AIRBORNE for 5 seconds, gaining the Ace Boost buff during this time
- While airborne, each Auto Attack triggers a FOLLOW-UP ATTACK that prioritizes FRONT-ROW enemies
- Follow-up deals Energy Damage = 251.09% of Attack to 1 random enemy

ACE BOOST (stacking buff scaling with squad composition):
- 1 stack per Aircraft hero in your squad
- Each stack = +20% Attack Speed
- Caps at 5 stacks = +100% bonus Attack Speed with full Aircraft squad

STAR-GATED BONUSES:
| Stars   | Bonus Unlocked                                              |
|---------|-------------------------------------------------------------|
| 1 Star  | Ace Boost grants an ADDITIONAL +10% Attack Speed per stack   |
| 2 Stars | Follow-up attacks deal an EXTRA +20% damage                 |
| 3 Stars | Ace Boost grants an ADDITIONAL +5% ATTACK per stack         |
| 4 Stars | Follow-up attacks deal an EXTRA +40% damage                 |
| 5 Stars | Airborne duration EXTENDED by +1 second (6s total)          |

SCALING WITH FULL AIRCRAFT SQUAD (5 stacks active):
- Base Ace Boost: +100% Attack Speed
- + 1 Star: another +50% Attack Speed (5 stacks × +10%)
- + 3 Stars: another +25% Attack (5 stacks × +5%)
- + 2/4 Star follow-up damage boosts compound on top
- DVA's output during Starred Ace scales HEAVILY in a dedicated Aircraft squad

AWAKENING STAT BOOSTS:
Hedge: "We don't have data on this yet, stay tuned!" — TBD pending Hedge update.

UPGRADING STARRED ACE:
- Same as other UR Hero skills: Skill Medals, max level 40
- Refer to Hedge's Skill Medal Calculator for cost ladder

VERDICT (Hedge): "If DVA is part of your main squad, yes — the Awakening is a worthwhile upgrade. The stat boosts are immediate and meaningful, and Starred Ace is a strong sustained damage skill that gets significantly better the more Aircraft heroes you field alongside her. The Ace Boost mechanic rewards full air squads."

POSITIONING CONSIDERATION (with the new Frontal Suppression Tactics Card):
- Frontal Suppression buffs 3 Aircraft heroes on BACK ROW
- DVA tradeoff: keep her in FRONT (safer from back-row attacks, classic positioning) vs move her to BACK (gets the Tactics Card Attack Speed buff)
- For full Aircraft squads chasing Starred Ace damage maximization, the back-row Attack Speed boost compounds favorably with Ace Boost stacks
`;

// ─────────────────────────────────────────────────────────────────────────────
// BRAZ UR PROMOTION — Week 2 ascend → Week 3 promote
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_BRAZ_UR_PROMOTION = `
SEASON 6 — BRAZ SSR → UR HERO PROMOTION (Powered by cpt-hedge.com)

WEEK 2: Get SSR Braz to 5 Stars (preparation week)
WEEK 3: Promotion window OPENS, remains open through end of season

PROMOTION REQUIREMENTS:
1. SSR Braz at 5 Stars (no level requirement)
2. 1 UR Hero Badge — obtained from Season Goals reward track at 500,000 total War Merit

WHAT HAPPENS ON PROMOTION:
- Braz's star count resets to 3 Stars; skill levels reset to 1
- Hero Level is RETAINED
- Original SSR Wall of Honor disappears
- Skill Medals spent on skill upgrades returned by Mail
- Wall of Honor shards returned as hero-specific SSR shards by Mail
- Shards spent ascending 0→5 Stars on SSR are NOT returned
- Going forward: ascending UR Braz costs DOUBLE shards vs SSR (1,600 SSR shards to return from 3→5 Stars)
- Both original SSR Braz shards AND SSR Universal Shards work for upgrading UR

UR BRAZ SKILLS (replaces all 4):
- Rocket Blast (Auto Attack) — Physical Damage = 446.96% of Attack, single target
- Ancestral Wrath (Tactics) — Physical Damage = 366.52% of Attack to all enemies + reduces enemy attack speed by 30% for 8 seconds (AoE + debuff)
- Promotion Synergy (Passive) — In battle, +15% Physical Damage. For each promoted UR hero on squad, +6% additional Physical Damage, up to 5 stacks (max +45% total with full UR squad).
- Super Sensing (Expertise) — HP/Attack/Defense +20% each + skill cooldown speed +10%

SSR BRAZ SKILLS (for reference, replaced on promotion):
- Rocket Spread (auto, 150.25%, multi-hit, 1.55s cooldown)
- Intense Bombing (tactics, 5 rockets × 150.50%, 9s cooldown, random targets)
- Zombie Killer (passive, +28.30% damage to Monsters)
- Special Tactics (expertise, +10% HP/Atk/Def)

KEY DIFFERENCES SSR → UR:
1. Tactics: random-spread → AoE + 30% attack speed debuff for 8s (team-wide damage reduction)
2. Passive: PvE Monster damage → PvP-relevant +15% to +45% Physical Damage with promoted-hero squad
3. Expertise: doubles in value (10% → 20% all stats) + adds 10% cooldown speed
4. Auto attack: multi-hit spread → single high-damage hit

VERDICT (Hedge): "Yes" — promote if you have the prereqs. Clear upgrade for any content beyond Monster farming. Only tradeoff is the loss of Zombie Killer for PvE Monster grinding.

PROMOTION TIPS (Hedge):
- Spend spare Skill Medals BEFORE promoting (they're refunded)
- 0→5 Star ascent shards on SSR are GONE — factor this into shard planning
- Ancestral Wrath's ★★ adds another +10% attack speed reduction (40% total) — prioritize getting back to 2 Stars after promotion
- UR ascending costs double — plan ahead if rushing back to max stars
`;

// ─────────────────────────────────────────────────────────────────────────────
// 8-WEEK SCHEDULE — CORRECTED Outpost timing (was Week 4+, actually Week 3+)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_WEEKLY_SCHEDULE = `
SEASON 6 — 8-WEEK SCHEDULE (Powered by cpt-hedge.com)

⚠️ Hedge's guide is a living document. Week-by-week deep strategy is added as events unlock on live servers. The schedule below is confirmed; tactical detail expands over time.

WEEK 1 — Getting Started (Season launch week)
Key events:
- Faction War Ranks active from Day 1 — every War Merit advances rank from Recruit upward through 19 tiers, each with passive stat bonuses + Daily Stipend
- Purge Action (9 days) — kill World Map Zombies for First Kill Rewards, improve Resistance, compete on Kill Glory leaderboard
- Fishing Grounds: Stronghold Clash (14 days) — occupy Fishing Grounds to unlock fishing
- Beneath the Ruins — opens Day 2, descending challenge for Season Resources + Season-exclusive Gifts
- City Clash S6 — capturing cities grants Influence Points (Cities Lv. 1–2 available this week)
- Rainforest's Wrath (7 days) — first kill of Doom Elite to accumulate Rage Points + trigger Devouring Flower; rewards active ally support
- War Merit Shop OPENS (after Fungus Institute hits Level 4) — refreshes daily/weekly. Items: Rainforest Mushrooms, Bait, Tactics Card Packs, upgrade items
- Fishing Tournament — fishing rankings for personal + Fishing Master rewards
- Trade Post Lv. 1–4 — first opening Governors determined by War Merit rankings within the Warzone (earn War Merit fast this week)
- Faction Clash — alliances form pacts, coordinate around faction objectives
- HERO AWAKENING: KIMBERLY — first Awakening of the season unlocks
Strategic focus: Establish foundation. Earn War Merit across every system. Take Fishing Grounds to enable donations. Coordinate around faction objectives. Strong Week 1 War Merit directly determines Trade Post Governor access.

WEEK 2 — Sanctuary Opens + Global Expedition Round 1 (Kim)
Key events:
- Fishing Grounds: Stronghold Clash continues — can take neutral fishing grounds in Enemy Faction Warzones at week 2 reset. Lv. 5-7 grounds open 12 hours after reset.
- City Clash S6 — Cities Lv. 3–4 unlock
- Rainforest Walkers — small creatures that may spawn after Doom Elite Kill (similar to S5 Plague Roosters). Kill daily for First Kill Reward including SR Tactical Card Pack.
- Trade Post Lv. 1–4 — second cycle (reopens every 2 weeks)
- Beneath the Ruins — PvP mode added, allows wagers
- Sanctuary Opening — Sunday of Week 2, opens for Contest (NOT a Sanctuary Duel — that starts Week 5)
- GLOBAL EXPEDITION ROUND 1 (Kimberly) — opens Day 1 of Week 2, runs 14 days. Best free source of Kim Awakening Shards. Push hard.
- HERO PROMOTION SETUP: Get SSR Braz to 5 Stars THIS WEEK so he's ready for the Week 3 UR promotion window.
Strategic focus: Maximize Global Expedition points (named Kim Awakening Shards in first 750 points). Hit Sanctuary Opening for Influence Points. Lock Braz at 5 Stars before Week 3.

WEEK 3 — Altar Conquest + DVA Awakening + OUTPOST PLACEMENT #1
Key events:
- ALTAR CONQUEST opens — every Tuesday at 12:00 server time, 1-hour window. Continues every Tuesday for the rest of the season.
- HERO AWAKENING: DVA gets her Awakening (Starred Ace skill — see DVA Awakening section)
- GLOBAL EXPEDITION ROUND 2 (DVA) — opens Day 1 of Week 3, runs 14 days. Push for DVA-specific Awakening Shards.
- BRAZ SSR→UR PROMOTION window opens (requires SSR Braz at 5 Stars + 1 UR Hero Badge from Season Goals at 500K War Merit)
- WARZONE OUTPOST #1 — first placement on Saturday of Week 3. President places, Sunday for construction. Conquest doesn't open until Week 5 — this Outpost sits unchallenged through Week 4.
- Beneath the Ruins continues
Strategic focus: Decide your 3 target Altars BEFORE Tuesday. Mutually exclusive pairs (Snake↔Gust, Echo↔Feather) force strategic choice. Week 3 = best capture window since all altars start Neutral. Critical Outpost placement decision — position near enemy Sanctuary to open attack routes for Week 5+, or near your own to anchor defense.

WEEK 4 — Mid-Season Consolidation + Global Expedition Round 2 continues + OUTPOST PLACEMENT #2
Key events:
- GLOBAL EXPEDITION ROUND 2 (DVA) — continues from Week 3
- Altar Conquest continues every Tuesday
- Trade Post — third cycle opens
- WARZONE OUTPOST #2 — second placement on Saturday of Week 4. Construction Sunday.
Strategic focus: Push Global Expedition for DVA Awakening Shards. Consolidate War Merit gains toward Elite I (546,000 War Merit = 10 Gear Blueprints MR at settlement). Second Outpost placement — coordinate with President on whether to mirror Week 3's positioning or balance attack/defense routes.

WEEK 5 — MAJOR BATTLE EVENTS BEGIN + OUTPOST PLACEMENT #3 + FIRST CONQUEST + FIRST SANCTUARY DUEL
Key events:
- SANCTUARY DUEL #1 — Saturday of Week 5, 13:00-24:00 server time. First of three (Weeks 5, 6, 7). Eligibility via territory connection, Outpost connection, or Pact partner.
- OUTPOST CONQUEST #1 — first of three battle windows. Attack enemy Outposts (permanent destroy) or defend your own.
- WARZONE OUTPOST #3 — third placement on Saturday of Week 5. Construction Sunday.
- Altar Conquest continues every Tuesday
- Trade Post — third cycle (reopens every 2 weeks)
Strategic focus: Major battle weeks begin. Coordinate Faction Clash + Sanctuary Duel + Outpost positioning. Sanctuary Duel is THE highest IP-swing event — defend your own Sanctuary first (losing it = -200K IP from top 60 alliances). Outpost defense doubles as Sanctuary attack route preservation.

WEEK 6 — SECOND ROUND OF BATTLES + Tesla Awakening + Global Expedition Round 3 (FINAL) + OUTPOST PLACEMENT #4
Key events:
- HERO AWAKENING: TESLA gets his Awakening (guide pending publication on Hedge; re-pull when available)
- GLOBAL EXPEDITION ROUND 3 (Tesla, FINAL) — opens Day 1 of Week 6, runs 14 days. Last chance for Awakening Shards from this source.
- SANCTUARY DUEL #2 — Saturday of Week 6, 13:00-24:00 server time
- OUTPOST CONQUEST #2 — second of three battle windows
- WARZONE OUTPOST #4 — final placement on Saturday of Week 6. Construction Sunday.
- Altar Conquest continues every Tuesday
- Trade Post — final cycle
Strategic focus: Final Global Expedition push (Tesla shards). Tesla unlocks the third S6 Awakening. Consolidate Outpost positions — fourth and final placement decision. Defend critical Outposts (Sanctuary attack routes for Week 7).

WEEK 7 — FINAL BATTLES BEFORE THE DUEL + LAST SANCTUARY DUEL + LAST OUTPOST CONQUEST
Key events:
- SANCTUARY DUEL #3 — Saturday of Week 7, 13:00-24:00 server time. Third and final contest.
- OUTPOST CONQUEST #3 — third and final battle window. Destroyed Outposts gone forever.
- Altar Conquest continues every Tuesday
Strategic focus: Last chance to influence rankings before the Faction Duel. Push War Merit to lock final Faction War Rank for settlement rewards. Lock in Outpost + Sanctuary positions. Sanctuary destruction is the largest single point swing — coordinate full faction commitment.

WEEK 8 — FACTION DUEL & SEASON CONCLUSION
Key events:
- FACTION DUEL — final all-out battle between Deepwood and Wetland. Everything (War Merit, Faction Technology, territory, Outposts) culminates here.
- Season Conclusion — settlement rewards distributed based on Alliance Influence Points rankings + individual Faction War Rank.
- Settlement Stage triggers: War Merit stops increasing, Rank Bonuses stop applying, Rankings lock.
Strategic focus: Coordinate full faction. Make sure Faction War Rank is locked at desired tier before settlement (Elite I = 10 Gear Blueprints MR is the priority milestone for most players).

RECURRING EVENTS:
- Altar Conquest: every Tuesday at 12:00 server time from Week 3 onward (1-hour window each)
- Trade Post cycles: Weeks 1, 3, 5, 6 (every 2 weeks roughly)
- Sanctuary Duel: Saturdays of Weeks 5, 6, 7 (13:00-24:00 each)
- Outpost Conquest: Weeks 5, 6, 7 (3 battle phases I/II/III)
- Outpost Placement: Saturdays of Weeks 3, 4, 5, 6 (one per week, construction Sunday)
- Global Expedition: Weeks 2-3 (Kim Round 1), 3-4 (DVA Round 2), 6-7 (Tesla Round 3) — 14 days each, points reset between rounds
`;

export const SEASON6_FAQ = `
SEASON 6 — FREQUENTLY ASKED QUESTIONS

Q: When did Season 6 launch?
A: Season 6: Lost Rainforest launched April 13, 2026 on the first batch of servers.

Q: What is the core theme of Season 6?
A: Faction-based war (Deepwood vs Wetland, 4v4). All progression ties to faction cooperation + individual War Merit.

Q: What's the most important individual milestone?
A: Reaching Faction War Rank Elite I (546,000 total War Merit). It unlocks 10 Gear Blueprints (MR) at settlement — Hedge calls it "the most important milestone for most players investing in gear progression."

Q: How do I unlock a Hero Awakening?
A: Three requirements, ALL must be met:
   1. Hero at 5 Stars
   2. Hero's Exclusive Weapon at Level 20 or above
   3. 50 named Awakening Shards (specific to that hero)
S6 awakenings: Kim (Week 1), DVA (Week 3), Tesla (Week 6).
Note: Day-1 unlock is NO LONGER POSSIBLE — paid pack source removed. Plan to farm via Trial + Global Expedition.

Q: Where do I get Awakening Shards?
A: Two free sources:
   1. Hero Awakening Trial — up to 10 shards per hero across Basic+Advanced+Ultimate tiers. Basic Trial: 3 stages × (2,000 Skill Medals + 1 shard + 200 Diamonds).
   2. Global Expedition — Weeks 2 (Kim), 3 (DVA), 6 (Tesla) from the Alert Tower.
Battle Pass and paid pack shards have been REMOVED.

Q: When does the War Merit Shop open?
A: Week 1, but requires Fungus Institute Level 4. Three rank-based shop expansions at Vanguard I, Warrior I, and Elite III.

Q: Can my Faction War Rank be lost?
A: Below Elite III, no — it's pure cumulative accumulation. The top 4 ranks (Bloodguard / Centurion / Legate / Chieftain) are POSITION-BASED in your warzone — they shift as other players catch up. Demotion is possible.

Q: What happened to mixed squads (Tank+Adam, Air+Murphy)?
A: The 4+1 (Hybrid Squad) Tactics Card has been REMOVED in S6. Old mixed-squad combos still work physically but lose the type boost the off-type hero used to get. Pure single-type squads are now the standard. Counter Reversal becomes more important than ever.

Q: What are the new Tactics Cards?
A: Three Universal cards (PvP + Global Expedition only):
   - Aftermath Burst (Missile, +18.75% DoT — only affects damage-over-time skills like Swift's burn and Fiona's radiation)
   - Dimensional Crit (Tank, +2.70% Crit Rate to single Tank with highest Attack)
   - Frontal Suppression (Aircraft, +1.50% Attack Speed to 3 Aircraft on back row)
Card max level raised to 12 (was 7), with up to +3 from "Tactics Card Level Up" UR attribute → cap of 15.

Q: How does Altar Conquest work?
A: Every Tuesday at 12:00 server time from Week 3, 1-hour windows. 5 Altars in the central Great River Clan zone. Max 3 Altars per Alliance. Two mutually exclusive pairs: Snake↔Gust, Echo↔Feather. Skill activation costs Alliance Energy (sourced from donating catch).

Q: When can I promote Braz to UR?
A: Week 3 onward. Requirements: SSR Braz at 5 Stars + 1 UR Hero Badge (earned from Season Goals at 500,000 total War Merit). Get him to 5 Stars in Week 2 to be ready.

Q: How do EW Shards work in S6?
A: New: regular Hero Recruitment in the tavern now drops EW Shards for Kim, DVA, and Tesla (the three Awakening heroes). Save Recruitment Tickets ahead of season to use during S6.

Q: What's an Alliance Pact?
A: A formal cooperation agreement between two alliances in the SAME FACTION. Requires mutually adjacent territory (Handshake Point), one pact per alliance at a time, 3-day cooldown after successful formation. Unlocks shared territory connectivity, defense support, march acceleration, reinforce mechanism, and shared 200-person chat. Cannot be initiated Wed/Sat. Losing the Handshake Point invalidates the pact immediately but does NOT trigger cooldown.

Q: When do Outposts get placed?
A: One Outpost per Warzone per week, on Saturday of Weeks 3, 4, 5, and 6. President places, Sunday for construction. Each Warzone gets 4 total. ONE-TIME RESOURCES — once destroyed in Conquest, they cannot be rebuilt.

Q: When are Sanctuary Duels?
A: Saturdays of Weeks 5, 6, and 7. Contest window 13:00-24:00 server time. Eligibility via territory connection, Outpost connection, or Alliance Pact partner. Outpost defense in Weeks 5-7 directly preserves Sanctuary attack routes. Largest single IP swings in the season.

Q: What's the new "destroy" mechanic on enemy cities?
A: NEW IN S6: when attacking cities in ENEMY WARZONES, the city is not captured — it is immediately DESTROYED, permanently. Destroyed cities cannot be restored. This is a powerful way to permanently weaken enemy Influence Points and rankings. Internal Faction Protection still applies — you cannot attack cities held by your own faction.

Q: Are season strategy details complete?
A: No — Hedge's guide is a living document updated weekly as events unlock. Tesla Awakening guide is pending publication (Week 6 unlock). Always direct players to cpt-hedge.com/guides/season-6-ultimate-guide for the latest. Do NOT invent mechanics, buff values, building costs, or event details not present in this data.
`;

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns Season 6 summary for Buddy's system prompt.
 * Called from buildSystemPrompt() when player.season === 6.
 *
 * ⚠️ Hedge's guide is a living document — re-pull every 2 weeks until S6 ends,
 * plus on Hedge Discord announcements that an event guide has been published.
 *
 * When players ask about specific weekly tactics not yet detailed here,
 * direct them to cpt-hedge.com/guides/season-6-ultimate-guide for the latest.
 * Do NOT invent mechanics, buff values, building costs, or event details
 * not present in this data.
 */
export function getSeason6Summary(): string {
  return `## Season 6 Guide — Lost Rainforest (Shadow Rainforest) — Powered by cpt-hedge.com

✅ LIVE DATA: Season 6 launched April 13, 2026.
⚠️ LIVING DOCUMENT: Hedge updates weekly as events unlock. When asked about details not covered below, direct players to cpt-hedge.com/guides/season-6-ultimate-guide. Do NOT invent mechanics, values, or event details.

${SEASON6_OVERVIEW}

${SEASON6_FACTION_WAR_RANKS}

${SEASON6_ALLIANCE_PACT}

${SEASON6_ALTAR_CONQUEST}

${SEASON6_WARZONE_OUTPOST}

${SEASON6_SANCTUARY_DUEL}

${SEASON6_TACTICS_CARDS}

${SEASON6_GLOBAL_EXPEDITION}

${SEASON6_HERO_AWAKENING_DETAIL}

${SEASON6_DVA_AWAKENING}

${SEASON6_BRAZ_UR_PROMOTION}

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