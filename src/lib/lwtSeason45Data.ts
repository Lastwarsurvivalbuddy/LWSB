// src/lib/lwtSeason45Data.ts
// Season 4 (Evernight Isle) and Season 5 (Wild West) guide data
// Source: lastwartutorial.com — Cris84
// Injected into buildSystemPrompt() via getSeasonDataSummary() for season === 4 or season === 5

// ─────────────────────────────────────────────────────────────────────────────
// SEASON 4 — EVERNIGHT ISLE
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON4_OVERVIEW = `
Season 4 – Evernight Isle (Sakura Isle)
Theme: Light vs. Darkness. Blood Night Moon descends on Sakura Isle. Commanders fight to restore light.
Map: Standard warzone map with Japanese aesthetic. Warzones divided into two factions: Kage no Sato vs Koubutai.
Duration: 8 weeks + 2 Pre-Season weeks.
Key seasonal resource: Quartz (used to upgrade Optoelectronic Lab and Quartz Workshops).
Other resources: Stone (from Doom Walkers).
New mechanic: Tactics Cards (Core, Battle, Resource) — unlock week 1, persist into off-season as Core cards only.

SEASON 4 BUILDINGS (seasonal — disappear end of week 8):
- Optoelectronic Lab: Increases Virus Resistance. Upgrade with Quartz. Required lv20+ to receive Faction Rewards.
- Quartz Workshops (I/II/III/IV): Generate Quartz passively. Unlock each by leveling previous to required level.
- Alliance Center: Alliance-wide buff building. R4/5 must initiate repair. Provides territory buffs.
- Lighthouse + Generators: Progression building for Blood Night Descend game mode.
- Protector's Field: Converts 10% of battle casualties into Desert Protectors.
- Magatama Shop: Seasonal currency shop. Unlocks day 2 week 1.

SEASON 4 GAME MODES:
- Blood Night Descend: 4-stage game mode running all season. Stage 1 (Week 1) through Stage 4 (Week 4).
- Ryōtei Restaurant: Mini-game unlocks week 2.
- Divine Tree: Recharge event unlocks week 2.
- Blood Night Hunter: Game mode unlocks week 2.
- Hunt for Wandering Oniwagons: Event week 2.
- Maneki-neko Light On: Daily collectible event, lasts 48 days from week 1 day 1. Limit 5 large per day.

EXCLUSIVE WEAPONS IN SEASON 4:
- Lucius: Day 4 of Week 1. Battle Pass available 7 days only.
- Adam: Day 4 of Week 3. Battle Pass available 7 days only.
- Williams: Day 4 of Week 6. Battle Pass available 7 days only.
All Exclusive Weapons: Levels up to 30. Boosts Hero HP/Attack/Defense + All-Damage resistance. Unlocks hero skills L31–40.
Prerequisite: Hero must be at Tier 5 to activate. Can purchase pass early and store items.

CITY LEVELS IN SEASON 4 (City Clash S4 — starts day 3 at 12:00 server time):
- Level 1: Week 1 Day 3 + 12 hours
- Level 2: Week 1 Day 6 + 12 hours
- Level 3: Week 2 Day 3 + 12 hours
- Level 4: Week 2 Day 6 + 12 hours
- Level 5: Week 3 Day 3 + 12 hours
- Level 6: Week 3 Day 6 + 12 hours
- Level 7 (Tenryu Castle): Week 4 Day 7 + 12 hours
City capture rules: Must have connected territory. Only one city targeted per alliance at a time. Virus Resistance required. Units die directly (portion) in siege. First-capture rewards + Alliance loot chests distributed by R5/R4.

TRADE POSTS IN SEASON 4:
- Trade Post levels 1–2 unlock: Week 3 Day 2
- Trade Post levels 3–4 unlock: Week 3 Day 3
- Contests start daily at 12:00 server time on Tuesdays and Fridays. Each contest runs 1 hour.
- Governor earns taxes as Golden Egg. Alliance members get discounts.
- IMPORTANT: Must be physically on Contaminated Land near Trade Post to send troops (no connected territory required).

UR PROMOTION IN SEASON 4:
- Sarah UR Promotion: Week 3 Day 1. 42 days to promote Sarah (also Mason, Scarlett, Violet).
- Do the upgrade on Thursday for Duel VS bonus points.
- Requires Legendary Hero Badge item (earned through Season Goals).
- Hero resets to 3★. All skill medals REFUNDED to mail. Shard cost doubles to re-promote (1600 shards to 5★).
- Skill medals 100% refunded when hero promoted to UR.

FACTIONS IN SEASON 4 (Week 3):
- Faction Awards event week 3 splits warzones into Kage no Sato vs Koubutai.
- Faction Duel occurs week 7 — Capitol War among Factions.
- Optoelectronic Lab must be level 20+ to receive Faction Rewards.

COPPER WAR (Weeks 4–7):
- Starts week 4. Continues through weeks 5, 6, 7.
- Warbreakerr: Defeat enemies in Copper Conquest. Goal: 1M enemies per week.
- Ruinstriker: Damage enemy Alliance Centers. Goal: 2M durability per week.
- Warlord's Atomic Breath: Use Warlord's missile (re-skinned as Atomic Breath) during war.
- Trade Baron: Capture Trade Posts and collect tax revenues. Goal: 300K tax revenue per event.
- War's Eve event: Starts week 6 Day 1. Alliance iron donation 2M to unlock.

CAPITOL CONQUEST IN SEASON 4:
- First Capitol Conquest: Week 4 Day 7 + 12 hours (City Level 7 = Tenryu Castle).
  Adjacent territory (city or stronghold) required to participate.
  Max Honor Points by attacking capitol or fighting in mud area.
- Second Capitol Conquest: Week 8 Day 6.
  No adjacent land required — ALL alliances can compete.
  President loses power when event starts. Shield breaks on first attack.

FACTION DUEL — Week 7:
- The ultimate Capitol War among factions. Kage no Sato vs Koubutai.
- Reward chest: Train 1M units.

HERO SWAP EXP — Week 3:
- Swap Hero EXP between heroes. Use swap tickets. Event persists through season.

SEASON 4 WEEK 8 (End of Season):
- Day 1: Settlement Period begins. Transfer Surge unlocks. Leaderboards lock.
- Day 6: Second Capitol Conquest (no adjacent territory required).
- Day 7 end (Sun/Mon reset): Season ends. ALL seasonal items convert.
  Seasonal buildings disappear (Alliance Center, Lighthouse, Quartz Workshop, Optoelectronic Lab).
  Protector's Field resets to level 1.
  Seasonal profession skills refunded. Battle/Resource Tactics Cards converted (Core cards persist).
  Cities stop providing buffs.

SEASON 4 ITEM CONVERSION RATES:
- 100 Quartz = 1 Profession EXP
- 100 Stone = 1 Profession EXP
- 1 Magatama item = 100 Profession EXP
- 1 Ryōtei Restaurant item = 500 Profession EXP
- 1 Magatama/Lucky Charm Golden Egg = 20,000 Profession EXP
- 1 Lucky Charm = 5,000 Profession EXP
- Combat/Resource Tactics Card = Tactical Fragment → 5 Profession EXP each
- Tactics Card Packs → Profession EXP or random Core Tactics Cards
- 10 Protectors = 1 highest-level soldier unit

SEASON 4 PROFESSIONS:
- Level cap: 100. New seasonal skills: Blood Night Hunter, Hunting Inspiration, Flare, Lightfall, Disruption Mine, Oni Summon.
- Diplomat profession NOT available in Season 4.
- Seasonal skills removed at end of season. Skill points refunded.
`;

export const SEASON4_WEEK_GUIDE: Record<number, string> = {
  1: `S4 WEEK 1 — Key actions:
- Day 1: Build Optoelectronic Lab (donate 1M food warzone goal). Build Quartz Workshops (donate 2M coins).
- Day 1: Build Alliance Center (donate 3M iron). Purge Action starts — kill highest-level zombie you can.
- Day 1: Blood Night Descend Stage 1 begins (continues all season).
- Day 1: Maneki-neko Light On starts (48 days, claim 5 large daily).
- Day 2: Tactical Cards mission unlocks (donate 1M iron). Magatama Shop opens.
- Day 3: City Level 1 unlocks at 12:00 + 12 hours. Start capturing Lv.1 cities.
- Day 4: Lucius' Exclusive Weapon Battle Pass available — 7 days only. Buy if you want Lucius EX weapon.
- Day 6: City Level 2 unlocks. Digging Stronghold Clash starts (13 days).
- Priority: Get Optoelectronic Lab up fast. Virus Resistance is critical for zombies and city captures.
- Priority: Collect Quartz — level up Quartz Workshops for passive income.
- Tactics Cards unlock — get your Core cards slotted.`,

  2: `S4 WEEK 2 — Key actions:
- Day 1: Ryōtei Restaurant mini-game unlocks (donate 3M food).
- Day 1: Blood Night Hunter game mode unlocks.
- Day 2: Divine Tree recharge event unlocks.
- Day 2: Hunt for Wandering Oniwagons begins (Oniwagons spawn from Blood Night Stage 2).
- Day 3: City Level 3 unlocks at reset + 12 hours.
- Day 6: City Level 4 unlocks.
- Priority: Complete Blood Night Hunter missions for Quartz and Stone rewards.
- Priority: Participate in Ryōtei Restaurant for seasonal resource income.
- Note: Blood Night Descend Stage 2 begins — Wandering Oniwagons now spawn on the map.`,

  3: `S4 WEEK 3 — Key actions:
- Day 1: Sarah UR Promotion event starts. 42 days to promote Sarah (and Mason, Scarlett, Violet).
  - Do upgrade on THURSDAY for Duel VS bonus points.
  - Requires Legendary Hero Badge (from Season Goals).
  - Skill medals fully refunded on UR promotion.
- Day 1: Hunt for Oni begins (Blood Night Stage 3 — Oni Legions spawn).
- Day 2: Trade Posts Lv.1–2 unlock (capture contests Tuesdays and Fridays at 12:00 server time).
- Day 2: Hero Swap EXP event starts — use swap tickets to redistribute hero EXP.
- Day 3: Trade Posts Lv.3–4 unlock. City Level 5 unlocks.
- Day 3: Faction Awards event — warzones split into Kage no Sato vs Koubutai factions.
- Day 4: Adam's Exclusive Weapon Battle Pass available — 7 days only.
- Day 6: City Level 6 unlocks.
- Week end: Copper Conquest teaser appears (starts week 4).
- Priority: Check Faction assignment. Coordinate with alliance for upcoming Copper War.
- Priority: Capture Trade Posts early — Governor earns taxes as Golden Eggs.`,

  4: `S4 WEEK 4 — Key actions:
- Day 1: Copper War / Copper Conquest begins. This is the major inter-server war phase.
  - Warbreaker: Defeat 1M enemies in Copper Conquest.
  - Ruinstriker: Damage enemy Alliance Centers (2M durability goal).
  - Warlord's Atomic Breath: Use Warlord missile during Copper War.
  - Trade Baron: Capture Trade Posts, collect 300K tax revenue.
- Day 1: Blood Night Descend Stage 4 begins.
- Day 7: City Level 7 (Tenryu Castle) unlocks + 12 hours. FIRST Capitol Conquest.
  - Must have adjacent city or stronghold to participate.
  - Max Honor Points by fighting in mud area or attacking capitol directly.
- Priority: All alliances coordinate for Copper War. Virus Resistance critical for sieges.
- Priority: Compete for Tenryu Castle. Honor Points = better end-of-season rewards.`,

  5: `S4 WEEK 5 — Key actions:
- Copper War continues (same missions as week 4: Warbreaker, Ruinstriker, Warlord, Trade Baron).
- No new city levels unlock this week.
- No new exclusive weapons this week.
- Priority: Keep fighting in Copper Conquest. Every kill contributes to rankings.
- Priority: Maintain Trade Post control. Governor tax income adds up.
- Note: Check Copper War leaderboard — faction rankings determine end-of-season rewards.`,

  6: `S4 WEEK 6 — Key actions:
- Day 1: War's Eve event starts (donate 2M iron warzone goal). Copper War continues.
- Day 1: Warbreaker, Ruinstriker, Warlord, Trade Baron missions all continue.
- Day 4: Williams' Exclusive Weapon Battle Pass available — 7 days only.
- Priority: Purchase Williams EX Weapon pass if you plan to use him — 7 days only.
- Priority: Copper War final push. Alliance Center damage is key ranking metric.
- Note: War's Eve is the pre-battle phase for major faction conflict heading into week 7.`,

  7: `S4 WEEK 7 — Key actions:
- Day 1: Copper War continues (Warbreaker, Ruinstriker, Warlord, Trade Baron).
- Day 1: Faction Duel starts — ultimate Capitol War. Kage no Sato vs Koubutai.
  - Capitol War on day determined by faction schedule.
  - Reward chest: Train 1M units.
- War's Eve events continue from week 6.
- Priority: Faction Duel is the climax of Season 4. Maximum effort on Copper War and Capitol.
- Priority: Train troops now to hit 1M unit training chest goal.
- Note: This is the last week of active combat before settlement.`,

  8: `S4 WEEK 8 — End of Season:
- Day 1: Settlement Period begins. Transfer Surge unlocks (server transfer feature).
  - Leaderboards lock. Copper rankings finalized.
  - Season tiles mostly disappear. Only Blood Night Descend (until Holy Mountain done), Divine Tree Blessings, Season Photo, Magatama Shop remain.
  - Season Battle Pass / Weekly Pass no longer available.
  - Cities/strongholds/Trade Posts cannot be attacked. Cities stop producing copper.
  - SSR → UR upgrades no longer possible.
- Day 1: Alliance Honor mission starts (7 days). Distribute Alliance Rewards via Season 4 menu → Rewards → Assign Rewards.
  - IMPORTANT: Optoelectronic Lab must be lv20+ to receive Faction Rewards.
  - Each player can only receive 1 season reward regardless of alliance hopping.
- Day 6: Second Capitol Conquest. NO adjacent territory required — all alliances compete.
  - Fight in mud area for maximum Honor Points. Shield breaks on first attack of capitol.
- Day 7 end (Sun/Mon reset): Season 4 ends. Item conversion happens automatically.
- BEFORE SEASON ENDS: Distribute all Alliance Loot Chests (they reset). Open any stored packs.
- Conversion rates: See Season 4 conversion rates section.`,
};

// ─────────────────────────────────────────────────────────────────────────────
// SEASON 5 — WILD WEST (The Golden Wasteland of the Land of Liberty)
// ─────────────────────────────────────────────────────────────────────────────

export const SEASON5_OVERVIEW = `
Season 5 – Wild West (Golden Wasteland / Land of Liberty)
Theme: CrystalGold mining empire ruled by King Spade. Wealth and war intertwined. Hero Venom leads the assault.
Map: MASSIVE — 9x the size of a Season 0 map. Multiple warzones share one giant battlefield.
Duration: 8 weeks + 2 Pre-Season weeks.
Key seasonal resources: Coffee (building upgrades), Coffee Beans (Coffee Factory upgrades), CrystalGold (currency/shop), Whiskey (trade/sell for CrystalGold).

WAR TIME SYSTEM (NEW in S5):
- Fierce fights happen only during 3 fixed war time slots per day (not 24/7).
- Alliances can set an immunity/safe time — up to 15 consecutive hours of rest guaranteed.
- During immunity you CANNOT be attacked, but you CAN still attack others.

SEASON 5 BUILDINGS (seasonal — disappear end of week 8):
- Caffeine Institute: Increases Virus Resistance. Upgrade with Coffee. Max level 60.
  IMPORTANT: Only bring to level 10 at start of season. Level 11+ requires Coffee Beans needed for other buildings.
  Level 10 gives full Desert Protectors feature access.
  Coffee Menu unlocks at institute: recipes give specific buffs (construction speed, training speed, research speed, crit damage, march speed, etc.)
- Coffee Factories (I/II/III/IV + Weekly Pass bonus factory): Generate Coffee passively. Unlock by leveling previous factory.
  Upgrade with Coffee Beans. Max level 30 each.
  OPTIMAL STRATEGY: Build Factory I → upgrade to 15 → build Factory II → upgrade to 15 → Factory III to 15 → Factory IV to 15 → then bring all up level by level equally.
  All factories give +720 Coffee/hour per level regardless of level (cost increases but output is flat per level).
- Protector's Field: Same as S4. Converts 10% of casualties into Desert Protectors.
  DO NOT go above level 10 early (requires Coffee Beans needed elsewhere).
  Skills unlock at: 500 protectors (Power of Adaptation +250 curse resistance), 750 (Giant Protector +25% attack), 1000 (Blue Flame Spell — win = 1hr blue flames on enemy), 1250 (Protector Rally).
- Tanker Bar / Pilot Bar / Missileer Bar: Boost damage for Tank/Air/Missile heroes.
  Requires Caffeine Institute level 60 to unlock. Must kill zombies to unlock. Same levels/costs for all 3.
- CrystalGold Shop: Seasonal currency shop. Build outside base walls.

HOW TO EARN SEASONAL RESOURCES:
Coffee: Kill Doom Elites (first-time rewards), Hero Return tickets (S5: Legend Returns), Season Quests, Season Goals, City first-capture reward, Coffee Factories.
Coffee Beans: Map zombie kills (first-time rewards), Doom Elite kills, Hero Return tickets, Doom Walker First Blood Kill, Visitors (appear at base wall), Season Quests/Goals, Weekly Pass, City/Bank first-capture, High Noon mini-game, CrystalGold Shop.
CrystalGold: Map zombie kills (first-time), Doom Elite kills, Cities (generate per hour for controlling alliance), Bank investments (interest), High Noon mini-game (stages + duel mode from week 3), selling Whiskey in Wasteland Trade (week 2+).
Whiskey: Visitors at base wall, Trucks, Plundering Fortune in Wasteland Trade.

VISITORS:
- Two types appear at base wall periodically.
- Simple visitor: Click to claim Coffee Beans/Whiskey.
- Visitor with radar task: Click, enter radar mode, complete quick mission for rewards.
- One visitor appears every few hours, one daily.

MAP ZOMBIES — PURGE ACTION STAGES:
- Stage 1: Dancer Zombies (lv 1–60), starts day 1 week 1.
- Stage 2: Sheriff Zombie (lv 60–90), starts day 1 week 2.
- Stage 3: Cowboy Zombies (lv 91–120), starts day 1 week 4.
Doom Elites in S5 are re-skinned as Bears. High Virus Resistance required to kill them.

EXCLUSIVE WEAPONS IN SEASON 5:
- Fiona: Day 4 of Week 1. Battle Pass available 7 days only.
- Stetmann: Day 4 of Week 3. Battle Pass available 7 days only.
- Morrison: Day 4 of Week 6. Battle Pass available 7 days only.
All EX Weapons: Up to level 30. HP/Attack/Defense + All-Damage resistance. Unlocks skills L31–40.
Requires hero at Tier 5. Buy pass early to store items.

CITY LEVELS IN SEASON 5 (City Clash S5 — starts day 3 at 12:00 server time):
- Level 1: Week 1 Day 3 + 12 hours
- Level 2: Week 1 Day 6 + 12 hours
- Level 3: Week 2 Day 3 + 12 hours
- Level 4: Week 2 Day 6 + 12 hours
- Level 5: Week 3 Day 3 + 12 hours
- Grand Nexus: Week 3 Day 7 + 12 hours (Capitol Conquest style event)
- Level 6: Week 4 Day 3 + 12 hours
- Level 7: Week 4 Day 3 + 12 hours
- Level 8: Week 4 Day 6 + 12 hours
- Level 9: Week 4 Day 6 + 12 hours
- Level 10: Week 5 Day 3 + 12 hours
City capture requires: Connected territory OR owning a Lv.1 Bank Stronghold. Virus (toxin) resistance required.
NOTE (vs S4): Number of cities/banks you can capture per day is LIMITED — scaled by how many cities you already control.

BANK STRONGHOLDS (replaces Digging Strongholds from S4):
- Classic strongholds upgraded into Banks.
- Deposit CrystalGold for interest over time. Longer deposits = greater returns.
- WARNING: If a bank falls, ALL deposits become enemy spoils. Defend your banks.
- Digging Stronghold Clash event = Bank Stronghold Conquest. Starts day 1 week 1, lasts 28 days.

TRADE POSTS IN SEASON 5:
- Lv.1–4 Trade Posts open every 2 weeks: Week 3, Week 5, Week 7.
- Contests start Tuesday at 11:00 server time. Held once every two weeks. Each contest 1 hour.
- Same Governor/tax rules as S4. Golden Egg tax rewards.

WASTELAND TRADE / TRADE TRAIN (Railroad Tycoon — NEW):
- Physical Trade Train crosses the continent, stopping at multiple stations.
- Consign Whiskey barrels for CrystalGold profit. Each station has a purchase limit (lowest price first).
- Plunder other players' trains (3 refreshes free, then costs CrystalGold). Seize 10% of consignor's goods per plunder.
- Max 100 goods consigned per day. Unused capacity accumulates up to 1500.
- Premium Sale (week 3+): Set your own price. Use Trade Logs to find stations with high limits.
- Strategy: Consign at stations with highest purchase limits. Monitor each station's buy history in Trade Logs.
- Defense: Teams protect your goods. They don't recover HP between attacks until next station.

HIGH NOON MINI-GAME (starts Week 1 Day 2 — lasts 48 days):
- Venom character. Shoot enemies before running out of bullets. Drag aim, release to fire.
- 5 stages unlock per day. Stage 5 (and 10, 15, etc.) counts for daily rankings — use fewest bullets.
- Duel Mode unlocks Week 3: Bet CrystalGold vs opponent. Win = take their bet.
- Rankings: Only the 5th stage of each day (10th, 15th, etc.) matters for daily ranking.

FINANCE TYCOON / CRYSTALGOLD TYCOON:
- Competition based on: Bank Investments, Bank Plunder, High Noon shooting, Wasteland Trade.
- Weekly and individual rankings with rewards. Alliance ranking also tracked.
- Week 3: Bank Deposits Ranking added specifically.

UR PROMOTION IN SEASON 5 — Week 3:
- Venom UR Promotion: Week 3 Day 1. 42 days to promote (also Mason, Scarlett, Violet, Sarah).
- Do upgrade on THURSDAY for Duel VS bonus.
- Requires Legendary Hero Badge (from Season Goals).
- Hero resets to 3★. ALL skill medals fully refunded. Shard cost doubles to re-promote.
- Hero Swap EXP event also starts day 1 week 3 (2 swap tickets given, old tickets also work).

WARZONE OUTPOST CONQUEST (Weeks 4–7):
- Week 4: Build the Outpost — all alliances in warzone contribute to repair. Each commander: max 3 daily contributions.
- Week 5 Day 5: Warzone Outpost Conquest unlocks. 3 total Conquest events during season.
  Battle times: Wednesday at 11:00 server time on Days 31 (W5), 38 (W6), 45 (W7).
  Any alliance connecting to Outpost enables their whole warzone to fight.
  Alliance with highest contribution wins Outpost control.
  4 cannons surround each Outpost. Mega Cannon boosts capture speed if you control the Outpost.
  Outposts grant Influence Points to ALL alliances in warzone.

GOLDEN PALACE CONQUEST (Starts Week 5):
- Located at CENTER of the massive S5 map.
- Every Saturday at 13:00 server time: Alliances with territory connected to Golden Palace fight.
- 4 cannons control. Mega Cannon boosts alliance capture speed if they control the Palace.
- Winning = Diamond Resource Tiles spawn around Palace for gathering.
- Palace holds up to 100 troops. Max 10 teams per battle.
- Troops march continuously on surrounding Contaminated Land during conquest.
- President of Golden Palace can send proclamation mail to all warzones.

WARZONE DECLARATION OF WAR (Week 3+):
- Alliance Safe Time system for cities and banks.
- War Declaration Days: Wednesday and Saturday only.
- During Safe Time: YOUR cities and strongholds CANNOT be attacked or declared upon.
- During Safe Time: You CAN still attack others (as long as they're not in their Safe Time).

SEASONS 5 GOALS:
- Individual goal: Activate the Lighthouse OR stay in the Light state → earn CrystalGold.
- Alliance goal: Capture Bank Strongholds → earn Alliance goal rewards.
- Best individual rewards: Coffee/Coffee Beans, Venom shards (for UR upgrade), Legendary Hero Badge, Tactics Cards.

SEASON 5 PASSES:
- Season Battle Pass (48 days, ~$12/$24): Coffee Beans primary reward. Luxury pass required separately from Advanced.
  Buy on DAY 1 — daily task double rewards are retroactive only from purchase date.
- Weekly Pass (~$7, 7 days): Extra Coffee Factory, +250 instant Virus Resistance, 30% march speed vs zombies, 20K Coffee Beans, 500 VIP points, daily 50K Coffee Beans + speedups.
- Coffee Beans Packs (Week 1 only): Buy progressively — each pack doubles in cost and amount (~$5/$10/$20/$50).

SEASON 5 WEEK 8 (End of Season):
- Day 1: Settlement Period. Transfer Surge unlocks. Leaderboards lock.
  CrystalGold Shop, CrystalGold Tycoon, High Noon (no new stages) still available.
  Cities/Banks/Trade Posts cannot be attacked. Cities stop producing CrystalGold.
  SSR → UR upgrades no longer possible.
- Day 6: Final Capitol Conquest — no adjacent territory required.
- Day 7 end: Season 5 ends. Item conversion.
  Caffeine Institute, Coffee Factories, Tanker/Pilot/Missileer Bars disappear.
  Protector's Field resets to level 1.
  Seasonal profession skills refunded. Battle/Resource Tactics Cards converted.

SEASON 5 ITEM CONVERSION RATES:
- 100 Coffee = 1 Profession EXP
- 100 Coffee Beans = 1 Profession EXP
- 1 CrystalGold = 1 Profession EXP
- 1 Whiskey = 40 Profession EXP
- 1 Coffee Recipe = 1,000 Profession EXP
- Desert Protectors → Recruitment Orders (higher level = better ratio)
- 1 Protector Horn = 1 Recruitment Order
- Combat/Resource Tactics Card → Tactical Fragment

SEASON 5 PROFESSIONS:
- Level cap: 100. New seasonal skills: Banker, Barista, Gunslinger Wager, Train Plunderer, Train Consigner, Train Protection.
- Diplomat profession NOT available in Season 5.
- Seasonal skills removed at end. Skill points refunded.
`;

export const SEASON5_WEEK_GUIDE: Record<number, string> = {
  1: `S5 WEEK 1 — Key actions:
- Day 1: Build Caffeine Institute (warzone donation). ONLY level to 10 — Coffee Beans needed elsewhere from level 11+.
- Day 1: Purge Action starts. Kill highest-level map zombie (Stage 1: Dancer Zombies lv 1–60).
- Day 1: Bank Stronghold Conquest event starts (28 days). Capture banks ASAP — connect territory.
- Day 1: Capture the Bank mission starts. City territory requires lv1 Bank Stronghold first.
- Day 2: High Noon mini-game unlocks (48 days). Complete 5 stages/day. Only 5th stage counts for rankings — minimize bullets.
- Day 2: Finance Tycoon / CrystalGold Tycoon competition starts. Earn CrystalGold via Bank deposits and other actions.
- Day 2: CrystalGold Shop opens.
- Day 3: City Level 1 unlocks at 12:00 + 12 hours.
- Day 4: Fiona's Exclusive Weapon Battle Pass — 7 days only. Buy if you want Fiona EX weapon.
- Day 6: City Level 2 unlocks.
- SPEND PRIORITY: Buy Weekly Pass on Day 1 if budgeting — extra Coffee Factory + instant Virus Resistance is huge.
- SPEND PRIORITY: Buy Season Battle Pass Day 1 — daily double task rewards only count from purchase date.
- SPEND PRIORITY: Coffee Beans Packs available week 1 only (progressively doubled cost).
- CRITICAL: Check Visitors at your base wall daily — they give Coffee Beans and Whiskey for free.
- First city captures give massive Coffee/Coffee Beans rewards. Prioritize participating.`,

  2: `S5 WEEK 2 — Key actions:
- Day 1: Railroad Tycoon / Wasteland Trade unlocks. The Trade Train is on the map.
  Consign Whiskey barrels for CrystalGold. Start at standard price (Premium Sales start week 3).
  Check train position. Consign when it's not at terminal. Max 100 goods/day.
- Day 1: Sheriff Zombies (lv 60–90) now spawn on map (Purge Action Stage 2).
  Kill Sheriff Zombies for first-time level rewards (Coffee Beans, CrystalGold).
- Day 1: Finance Tycoon continues. "Warzone Train Trades" now counts in CrystalGold Tycoon rankings.
- Day 1: Warzone Declaration of War teaser appears (prepares for week 3).
- Day 3: City Level 3 unlocks at reset + 12 hours.
- Day 4: Trade War teaser appears.
- Day 6: City Level 4 unlocks.
- PRIORITY: Start Wasteland Trade. First consignment of Whiskey = first CrystalGold income from train.
- PRIORITY: Buy Coffee Beans from CrystalGold Shop (new items unlock this week).
- PRIORITY: Build Coffee Factories as fast as possible. Coffee production is your bottleneck.
  Optimal: Get Factory I to lv15 → build Factory II → get both to same level step by step.`,

  3: `S5 WEEK 3 — Key actions:
- Day 1: Venom UR Promotion event starts. 42 days to promote Venom (also Mason, Scarlett, Violet, Sarah).
  - Do upgrade on THURSDAY for Duel VS bonus points.
  - Requires Legendary Hero Badge (from Season Goals).
  - ALL skill medals refunded on UR promotion — great time to promote if you have the Badge.
- Day 1: Warzone Expedition starts — capture banks in OTHER warzones.
- Day 1: Warzone Declaration of War tile becomes active. Check Alliance Safe Time settings.
  War Declaration Days: Wednesday and Saturday only.
- Day 1: Hero Swap EXP starts. Use your swap tickets. Old season tickets still work.
- Day 2: Trade Post Lv.1–2 unlock. Contest at 11:00 server time Tuesday. 1-hour window.
  Must be physically on Contaminated Land near Trade Post to send troops.
- Day 3: Trade Post Lv.3–4 unlock. City Level 5 unlocks at reset + 12 hours.
- Day 4: Stetmann's Exclusive Weapon Battle Pass — 7 days only.
- Day 7: Grand Nexus event unlocks (Capitol Conquest style). New items in CrystalGold Shop.
- High Noon: Duel Mode now unlocks. Bet CrystalGold vs opponents. High earner with skill.
- Wasteland Trade: Premium Sales now available. Set your own Whiskey price.
  Use Trade Logs to find stations with highest buy limits. Sell at those stations at a premium.
- PRIORITY: Promote Venom to UR on Thursday if you have the Legendary Hero Badge.
- PRIORITY: Capture Grand Nexus — major territory control event.
- PRIORITY: Start Trade Post contests immediately week 3. Governor earns tax Golden Eggs.`,

  4: `S5 WEEK 4 — Key actions:
- Day 1 (approx): Build the Outpost — warzone-wide repair effort. You have 3 daily contributions max.
  Go to Warzone Routes event page to send squad to repair. R4/5 initiates.
- Day 1: Warzone Expedition continues (banks in other warzones).
- Day 1: Warzone Invasion starts — capture cities in other warzones for Influence Points.
- Day 3: City Levels 6 and 7 unlock simultaneously at reset + 12 hours.
- Day 6: City Levels 8 and 9 unlock simultaneously at reset + 12 hours.
- New items in CrystalGold Shop unlock this week.
- Cowboy Zombies (lv 91–120) are NOT yet available — start day 1 week 4.
- PRIORITY: Repair Outpost — every alliance in warzone benefits from it. Don't neglect your 3 daily contributions.
- PRIORITY: Influence Points matter for end-of-season rankings. Capture cities across warzones.
- PRIORITY: Weeks 4–7 are the peak PVP phase of S5. Coordinate with alliance for territory control.
- NOTE: City capture limit per day increases with how many cities you control. Snowball effect.`,

  5: `S5 WEEK 5 — Key actions:
- Day 3: City Level 10 (final city level) unlocks at reset + 12 hours.
- Day 5: Warzone Outpost Conquest unlocks — FIRST of 3 battle events.
  Battle time: Wednesday at 11:00 server time (Day 31).
  Any alliance connecting to Outpost enables whole warzone to participate.
  Alliance with highest contribution wins control. 4 cannons to seize.
- Day 5 (approx): Capture the Outpost mission starts. Fight for warzone outpost control.
- Day 6: Golden Palace Conquest begins. Golden Palace is at CENTER of map.
  Every Saturday at 13:00 server time: Alliances with connected territory fight for it.
  Winning = Diamond Resource Tiles spawn around Palace for gathering.
  4 Cannons, Mega Cannon, max 100 troops in palace, 10 teams per battle.
- Day 1–ongoing: Warzone Invasion and Expedition continue (15M Influence Points reward chest).
- PRIORITY: Golden Palace is the crown jewel of S5. It requires connected territory — build toward center of map.
- PRIORITY: Train 1M units (Outpost reward chest goal).
- PRIORITY: Kill 1M commander units from other warzones (Golden Palace reward chest goal).
- IMPORTANT: Protect your banks. At this stage large-scale raids are happening across warzones.`,

  6: `S5 WEEK 6 — Key actions:
- Day 1: Warzone Invasion continues (20M Influence Points reward chest goal).
- Day 1: Vanquish the Enemies — kill 1M enemy (other warzone) commander units.
- Outpost Battle #2: Wednesday at 11:00 server time (Day 38). Fight for Outpost control.
- Golden Palace Battle: Saturday at 13:00 server time (weekly).
- Day 4: Morrison's Exclusive Weapon Battle Pass — 7 days only. Last exclusive weapon of S5.
- PRIORITY: Buy Morrison's EX Weapon pass if you want it — 7 days only and this is the last one.
- PRIORITY: Final Outpost battle of the mid-season push. Alliance coordination critical.
- PRIORITY: Golden Palace — key to final season rankings. Control = Diamond tile gathering income.
- NOTE: Only 2 main missions this week. Pace accelerates toward endgame.`,

  7: `S5 WEEK 7 — Key actions:
- Day 1: Warzone Invasion final push (20M Influence Points reward chest).
- Day 1: Vanquish the Enemies continues — 1M enemy kills.
- Outpost Battle #3 (FINAL): Wednesday at 11:00 server time (Day 45). Last chance to take or defend outposts.
- Golden Palace Battle: Saturday at 13:00 server time (final regular season battle).
- Trade Posts (Lv.1–4) — third and final contest window (starts week 7 Tuesday at 11:00).
- PRIORITY: Final Outpost conquest. Whoever holds outposts going into week 8 gets off-season bonuses.
- PRIORITY: Golden Palace final battle. Maximum effort — this determines season-end supremacy.
- PRIORITY: Kill 1M enemy units reward chest. Time to be aggressive.
- NOTE: This is the last week of active PVP. Settlement starts week 8. Use remaining resources now.`,

  8: `S5 WEEK 8 — End of Season:
- Day 1: Settlement Period begins. Transfer Surge (server transfer) unlocks.
  CrystalGold Shop still available. CrystalGold Tycoon continues. High Noon — no new stages but can finish old ones.
  Cities/Banks/Trade Posts cannot be attacked. Cities stop producing CrystalGold.
  SSR → UR upgrades no longer possible. Season tiles mostly disappear.
  Season Battle Pass / Weekly Pass no longer available.
- Day 1: Alliance Honor mission (7 days). Distribute Alliance Rewards AND Challenge Rewards via Season 5 menu → Rewards.
  NOTE: Challenge Rewards are new in S5 — alternative to regular rewards for highest-performing alliances. Cannot get both.
  Each player receives only 1 season reward regardless of alliance.
- Day 6: Final Capitol Conquest — NO adjacent territory required. All alliances compete.
  Fight in mud area for maximum Honor Points. Shield breaks on first attack of capitol.
  Can garrison capitol with up to 100 squads.
- Day 7 end (Sun/Mon reset): Season 5 ends. Item conversion.
  Caffeine Institute, Coffee Factories, Tanker/Pilot/Missileer Bars DISAPPEAR.
  Protector's Field resets to level 1.
  Tactical Cards battle/resource slots close. Seasonal profession skills refunded.
- BEFORE SEASON ENDS: Distribute ALL Alliance Loot Chests (they reset and are lost).
  Spend remaining CrystalGold in shop. Use Coffee Recipes if you have them (1K Profession EXP each).
  Open any Tactics Card packs. Spend Whiskey (converts 1:40 Profession EXP — best rate).
  Don't hoard — Whiskey is worth 40x more Profession EXP than Coffee/Coffee Beans (1:1 each).`,
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a compact Season 4 summary for Buddy's system prompt.
 * Call when player.season === 4.
 */
export function getSeason4Summary(): string {
  return `## Season 4 Guide — Evernight Isle

${SEASON4_OVERVIEW}

### Season 4 Week-by-Week Guide
${Object.entries(SEASON4_WEEK_GUIDE)
  .map(([week, guide]) => `**Week ${week}**\n${guide}`)
  .join('\n\n')}`;
}

/**
 * Returns a compact Season 5 summary for Buddy's system prompt.
 * Call when player.season === 5.
 */
export function getSeason5Summary(): string {
  return `## Season 5 Guide — Wild West (Golden Wasteland)

${SEASON5_OVERVIEW}

### Season 5 Week-by-Week Guide
${Object.entries(SEASON5_WEEK_GUIDE)
  .map(([week, guide]) => `**Week ${week}**\n${guide}`)
  .join('\n\n')}`;
}

/**
 * Master export — called from buildSystemPrompt() in buddy/route.ts.
 * Pass the player's season integer.
 * Returns full season guide for season 4 or 5, empty string otherwise.
 * (Seasons 0–3 are handled in lwtSeasonData.ts)
 */
export function getSeasonDataSummary45(season: number | null | undefined): string {
  if (season === 4) return getSeason4Summary();
  if (season === 5) return getSeason5Summary();
  return '';
}