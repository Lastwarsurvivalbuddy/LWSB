// src/lib/lwtSeason6Data.ts
// Season 6 (Shadow Rainforest / Lost Rainforest) guide data
// Source: cpt-hedge.com — Powered by cpt-hedge.com per partnership agreement §3.4
//
// Synced from these Hedge guides (all pulled May 5, 2026):
//   • /guides/season-6-ultimate-guide
//   • /guides/season-6-war-merit
//   • /guides/season-6-faction-war-ranks
//   • /guides/season-6-altar-conquest
//   • /guides/season-6-tactics-cards
//   • /guides/season-6-global-expedition
//   • /guides/season-6-braz-ur-promotion
//   • /guides/season-6-kim-awakening
//   • /guides/hero-awakening
//
// ✅ LIVE DATA — Season 6 launched April 13, 2026 on first batch of servers.
// Hedge is a living source — re-pull every 2 weeks until season ends, plus on
// any Hedge Discord announcement that an event guide has been published.
// Last synced: May 5, 2026 (corresponds to ~Week 4, mid-season)
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

2. FISHING GROUNDS (replaces Strongholds)
   - Occupy Fishing Grounds to unlock fishing and earn catch
   - Catch is donated to Alliance Skills and Faction Technology
   - Lightweight daily activity — does not directly affect combat strength
   - Catch donations also generate Alliance Energy, which is required to activate Altar-unlocked Alliance Skills
   - Full details: cpt-hedge.com Fishing Guide

3. WAR MERIT + FACTION WAR RANKS
   - Cumulative personal score earned through every season activity
   - Promotes you through 19 Faction War Ranks (Recruit → Chieftain)
   - Each promotion grants a Daily Stipend (claimable once per day, scales with rank, unclaimed sent via Mail)
   - Each rank also provides passive stat bonuses (Hero Stat Boost % + Virus Resistance + at top ranks Damage Reduction)
   - Spending War Merit in the War Merit Shop does NOT decrease your leaderboard total — it's a one-way counter
   - Settlement Stage: when the season enters settlement, War Merit stops increasing, Rank Bonuses stop applying, and Rankings lock
   - Full details: cpt-hedge.com War Merit Guide + Faction War Ranks Guide

4. ALLIANCE PACTS (NEW)
   - Same-faction alliances can form pacts
   - Shared Territory: use pact partner's land to stage attacks on nearby cities
   - Coordinated Defense: support partners with reinforcements and defensive cooperation
   - Pacts only between alliances within the same faction (Deepwood ↔ Deepwood, Wetland ↔ Wetland)
   - Full details: cpt-hedge.com Alliance Pact Guide

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

6. HERO AWAKENING (NEW)
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
   - SHARD SOURCES (all free):
       1. Hero Awakening Trial — Basic tier opens when the hero gets their Awakened form. 3 stages × ~1 shard. Up to 10 shards total per hero.
       2. Global Expedition — Weeks 2, 4, 6 (see Global Expedition section)
       3. NO Battle Pass / paid pack source. Hedge confirmed: previously available, since removed.
   - S6 SCHEDULE:
       Week 1: Kimberly (first Awakening, see Hero Awakening Detail section below)
       Week 3: DVA
       Week 6: Tesla

7. TACTICS CARDS — S6 CHANGES (significant)
   - 4+1 (Hybrid Squad) card REMOVED — the foundation of S4/S5 mixed-squad meta is gone
   - 3 new Universal cards (PvP + Global Expedition only):
       Aftermath Burst (Missile)    — All Missile heroes gain +18.75% damage over time at battle start, +6.25% per level
       Dimensional Crit (Tank)      — Tank Hero with highest Attack gains +2.70% Crit Rate, +0.9% per level
       Frontal Suppression (Aircraft) — 3 Aircraft heroes on back row gain +1.50% Attack Speed, +0.9% per level
   - Card max level RAISED to 12 (was 7), with up to +3 levels possible from the UR "Tactics Card Level Up" attribute → cap of 15
   - Mixed-squad combos (Tank+Adam, Air+Murphy, Quickstride+Mixed, Garrison+Mixed, PvE Zombie Killer mixed) are no longer viable in the same form — pure single-type squads become standard
   - Counter Reversal becomes more important than ever — pure squads are more exposed to type counters
   - Full details: cpt-hedge.com Season 6 Tactics Cards Guide

8. EW SHARDS IN HERO RECRUITMENT (NEW)
   - Hero Recruitment in the tavern now includes Exclusive Weapon Shards for Kim, DVA, and Tesla
   - Available with regular Hero Recruitment Tickets
   - Hedge recommendation: start saving Recruitment Tickets ahead of S6 to use during the season
   - Direct support for the EW Lvl 20 prereq on Awakening unlock for those three heroes

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
- First 750 points = NAMED shards for current week's awakening hero (Kim/DVA/Tesla)
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
- Named shards (first 750 points) are most efficient — direct progress on current week's awakening hero
- Upgrade non-core Tactics Cards BEFORE each round
- Auto-Battle for fast clearing once your power outmatches stages
`;

// ─────────────────────────────────────────────────────────────────────────────
// HERO AWAKENING — Kimberly detail (first to awaken)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON6_HERO_AWAKENING_DETAIL = `
SEASON 6 — HERO AWAKENING DETAIL (Powered by cpt-hedge.com)

S6 SCHEDULE:
- Week 1: Kimberly (Ember Light) — DETAILED BELOW
- Week 3: DVA — Hedge guide pending; pull on next sync
- Week 6: Tesla — Hedge guide pending; pull on next sync

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
1. Hero Awakening Trial — opens when hero gets Awakened form. Basic tier = 3 stages × 1 shard. Up to 10 shards total per hero across Basic/Advanced/Ultimate.
2. Global Expedition — Weeks 2, 4, 6 (see Global Expedition section). Currently the primary path.
3. Battle Pass / paid packs were available initially (70 + 300 shards) but have been REMOVED. Going forward, shards are entirely free-to-earn.
4. Hedge expects post-S6 Black Market may include Awakening Shards — unconfirmed.

═══════════════════════════════════════════════════════════════════════════════
KIMBERLY (Ember Light) — First Awakening, Week 1
═══════════════════════════════════════════════════════════════════════════════

UNLOCK PREREQS:
- Kim at 5 Stars
- Kim's Exclusive Weapon at Level 20+
- 50 Kimberly-specific Awakening Shards
- NOTE per Hedge: it's no longer possible to unlock Kim's Awakening on day 1 because the Battle Pass and paid pack shard sources were removed. Players must accumulate via Trial + Global Expedition.

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
// 8-WEEK SCHEDULE — updated with sub-guide cross-references
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

WEEK 2 — Sanctuary Opens + Global Expedition Round 1
Key events:
- Fishing Grounds: Stronghold Clash continues (final days)
- City Clash S6 — Cities Lv. 3–4 unlock
- Trade Post Lv. 1–4 — second cycle (reopens every 2 weeks)
- Beneath the Ruins — PvP mode added, allows wagers
- Sanctuary Opening — Sunday of Week 2, opens for Contest
- GLOBAL EXPEDITION ROUND 1 — opens Day 1 of Week 2, runs 14 days. Best free source of Hero Awakening Shards. Push hard.
- HERO PROMOTION SETUP: Get SSR Braz to 5 Stars THIS WEEK so he's ready for the Week 3 UR promotion window.
Strategic focus: Maximize Global Expedition points (named Awakening Shards in first 750 points). Hit Sanctuary Opening for Influence Points. Lock Braz at 5 Stars before Week 3.

WEEK 3 — Altar Conquest Begins
Key events:
- ALTAR CONQUEST opens — every Tuesday at 12:00 server time, 1-hour window. Continues every Tuesday for the rest of the season.
- HERO AWAKENING: DVA gets her Awakening
- BRAZ SSR→UR PROMOTION window opens (requires SSR Braz at 5 Stars + 1 UR Hero Badge from Season Goals at 500K War Merit)
- Beneath the Ruins continues
Strategic focus: Decide your 3 target Altars BEFORE Tuesday. Mutually exclusive pairs (Snake↔Gust, Echo↔Feather) force strategic choice. Week 3 = best capture window since all altars start Neutral.

WEEK 4 — Mid-Season Consolidation + Global Expedition Round 2
Key events:
- GLOBAL EXPEDITION ROUND 2 — opens Day 1 of Week 4, runs 14 days. Fresh round, new Area Buffs.
- Altar Conquest continues every Tuesday
- Trade Post — third cycle opens
Strategic focus: Push Global Expedition for another batch of Awakening Shards + EW Shard Choice Boxes. Consolidate War Merit gains toward Elite I (546,000 War Merit = 10 Gear Blueprints MR at settlement).

WEEK 5 — Major Battle Events Begin
Key events:
- Sanctuary Conquest — enemy faction Sanctuaries open Saturday of Week 5. First of three (Weeks 5, 6, 7).
- Outpost Conquests — first of three windows. Offense-and-defense around enemy Outposts.
- Altar Conquest continues every Tuesday
- Trade Post — third cycle (reopens every 2 weeks)
Strategic focus: Major battle weeks begin. Coordinate Faction Clash + Sanctuary + Outpost positioning. Faction Technology contributions matter increasingly.

WEEK 6 — Second Round of Battles + Global Expedition Round 3 (FINAL)
Key events:
- HERO AWAKENING: TESLA gets his Awakening
- GLOBAL EXPEDITION ROUND 3 (FINAL) — opens Day 1 of Week 6, runs 14 days. Last chance for Awakening Shards from this source.
- Sanctuary Conquest — Saturday of Week 6 (second contest)
- Outpost Conquests — second window
- Altar Conquest continues every Tuesday
- Trade Post — final cycle
Strategic focus: Final Global Expedition push. Tesla unlocks the third S6 Awakening. Consolidate Outpost positions for final stretch.

WEEK 7 — Final Battles Before the Duel
Key events:
- Sanctuary Conquest — Saturday of Week 7, third and final contest
- Outpost Conquests — third and final window
- Altar Conquest continues every Tuesday
Strategic focus: Last chance to influence rankings before the Faction Duel. Push War Merit to lock final Faction War Rank for settlement rewards. Lock in Outpost + Sanctuary positions.

WEEK 8 — Faction Duel & Season Conclusion
Key events:
- FACTION DUEL — final all-out battle between Deepwood and Wetland. Everything (War Merit, Faction Technology, territory, Outposts) culminates here.
- Season Conclusion — settlement rewards distributed based on Alliance Influence Points rankings + individual Faction War Rank.
- Settlement Stage triggers: War Merit stops increasing, Rank Bonuses stop applying, Rankings lock.
Strategic focus: Coordinate full faction. Make sure Faction War Rank is locked at desired tier before settlement (Elite I = 10 Gear Blueprints MR is the priority milestone for most players).

RECURRING EVENTS:
- Altar Conquest: every Tuesday at 12:00 server time from Week 3 onward (1-hour window each)
- Trade Post cycles: Weeks 1, 3, 5, 7
- Sanctuary Conquest: Saturdays of Weeks 5, 6, 7
- Outpost Conquests: Weeks 5, 6, 7
- Global Expedition: Weeks 2, 4, 6 (3 rounds × 14 days each)
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

Q: Where do I get Awakening Shards?
A: Two free sources — Hero Awakening Trial (up to 10 shards per hero from Basic/Advanced/Ultimate tiers) and Global Expedition (Weeks 2, 4, 6 from the Alert Tower). Battle Pass and paid pack shards have been REMOVED.

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

Q: Are season strategy details complete?
A: No — Hedge's guide is a living document updated weekly as events unlock. Some weekly tactical detail (Weeks 2, 4, 5, 6, 7, 8 deep tactics) is still expanding. Always direct players to cpt-hedge.com/guides/season-6-ultimate-guide for the latest. Do NOT invent mechanics, buff values, building costs, or event details not present in this data.
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

${SEASON6_ALTAR_CONQUEST}

${SEASON6_TACTICS_CARDS}

${SEASON6_GLOBAL_EXPEDITION}

${SEASON6_HERO_AWAKENING_DETAIL}

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