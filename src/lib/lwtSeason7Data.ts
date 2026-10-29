// src/lib/lwtSeason7Data.ts
// Season 7 (Return to the Golden Realm) — early official guide
// Injected into buildSystemPrompt() via getSeason7Summary() when player.season === 7
//
// EARLY INFO, updated as official details are released. Last updated Oct 29, 2026.
//
// Confirmed sources only (official FirstFun). Do not add community dates or numbers.
//   • Wiki 620 "Season 7: Return to the Golden Realm is coming soon!"
//     https://wiki.lastwar.com/en/show/620 — created 2026-10-18. Announcement image
//     file S_VII_Wiki620_20261027_EN.png, revision dated 2026-10-27.
//   • Wiki 623 "S VII Event Schedule"
//     https://wiki.lastwar.com/en/show/623 — created 2026-10-26.
//     Schedule image: https://wiki.lastwar.com/wiki/S_VII_Schedule_v5_EN.png
//   • Wiki 575 "Season 7 Progression Preview"
//     https://wiki.lastwar.com/en/show/575 — created 2026-08-03.
//     Later schedule (wiki 623) supersedes the August note on awakening order.
//   • @lastwarsurvival post, 2026-10-22 07:22 UTC, mirroring wiki 620:
//     https://x.com/lastwarsurvival/status/2113169065615523921
//   • Same announcement text mirrored on r/LastWarMobileGame around 2026-10-21/22.
//
// The official wiki says: if anything disagrees, use the event details shown in-game.
// The schedule image says some content is still in development and may change.
// Season days below (D3, D28, and so on) are counts from season start. They are
// not calendar dates. No official start date or server list exists in these sources.

export const SEASON7_EARLY_NOTE = `
SEASON 7 — EARLY INFO

Early info, updated as official details are released. Last updated Oct 29, 2026.

HOW TO ANSWER A SEASON 7 QUESTION:
- Use only the facts in this module. This is early official info, and the publisher says some of it is still in development and may change.
- If the question is on the Not yet confirmed list, or the answer is not written in this module, say you do not know. Do not guess. Do not invent a start date, a server group, a reward amount, a building, a tech change, a skill number, or a Combat Plan name.
- Season days (D3, D28, D49, and the rest) are counts from the day the season starts on that server. Do not turn them into a calendar date. Do not say which weekday the season starts on.
- If the player's in-game event calendar disagrees with this guide, the in-game calendar wins. Say that.
- Use official names. If the player uses a community alias, answer with the official name and mention the alias (see Naming).
- Where sources differ (Thunder Feathers vs Tesla Coil), say the sources differ. Do not pick a winner.
`;

export const SEASON7_NOT_YET_CONFIRMED = `
SEASON 7 — NOT YET CONFIRMED

If a player asks about any item on this list, say you do not know. Do not guess. Do not fill the gap with another season's numbers or with a community post.

- Official start date
- Server rollout (which servers, and in what order)
- Reward details (item lists, quantities, rank cutoffs). The only confirmed reward rule is that week 8 rewards are distributed from Alliance Goldust rankings.
- Building and tech changes (new season buildings, profession changes, season-tech trees, and their costs)
- Pre-season length and pre-season tasks
- Names, effects, and numbers for the new Alliance Skills
- Combat Plan names, categories, and any numeric effects
- Awakening shard counts, and any awakening prerequisites beyond red stars and the Global Expedition requirements described below
- Base skin and its buff
- Map layout, including whether the combined multi-warzone map from recent seasons changed
- Migration groupings and how Factions are matched
- Hero troop type (Aircraft, Missile, or Tank) for Carlie, McGregor, or Murphy — the Season 7 announcements do not state it
- A calendar date for any season day
`;

export const SEASON7_NAMING = `
SEASON 7 — OFFICIAL NAMES AND COMMUNITY ALIASES

Always use the official name. If the player says the community alias, answer the question and mention that the alias is the community wording for the official name.

| Topic | Official name | Community alias |
|---|---|---|
| Season | Season 7: Return to the Golden Realm (wiki group name: Season VII: Return to the Golden Realm) | Return to the Golden Empire |
| Mid-season war | Goldust Conquest (the schedule image header spells it GOLDDUST) | Battle for the Golden Empire |
| Shard event | Global Expedition | World Expedition |

One returning Alliance Skill name is not settled. See Alliance Skills. Do not rename Thunder Feathers to Tesla Coil, and do not drop Thunder Feathers. Say the sources differ.
`;

export const SEASON7_OVERVIEW = `
SEASON 7 — RETURN TO THE GOLDEN REALM (overview)

Official name: Season 7: Return to the Golden Realm.
Status: announced, not yet given an official start date or server list. Early info. Last updated Oct 29, 2026.
Length: 8 weeks, labeled WK1 through WK8 on the official schedule. WK8 is the Season Summary.
Day counts on the schedule are season days (day 1 is the season's first day on that server).

Theme, from the official announcement: warzones return to the desert and pyramids of the earlier golden season. Official lines: "Warzones will return to the golden sands." "Old rivalries are about to reignite, while new battlefield rules are quietly reshaping the land." "Deep beneath the pyramids, something seems to be watching."

What is new, from the official announcement (wiki 620):
- More Alliance Skills. New skills join three returning skills. See Alliance Skills.
- Combat Plans, a new system used with Tactics Cards. See Combat Plans.
- A Desert Storm battlefield upgrade. See Desert Storm.

What returns:
- Goldust Conquest (declare war, organize the alliance, push and regroup), now with the new Alliance Skills and Combat Plans.
- Hero Awakening together with Global Expedition, for Carlie, McGregor, and Murphy.
- A Faction system (Faction Awards, then Faction Duel) and Temple Conquest as the source of Alliance Skills.
- War Merit, spent in the War Merit Shop. The shop refreshes weekly and runs WK1 through WK8.

Season currency shown on the official schedule: War Merit.

Do not describe a start date, a server batch, a reward table, or a new building. Those are not in the official posts. See Not yet confirmed.
`;

export const SEASON7_WEEKLY_SCHEDULE = `
SEASON 7 — SCHEDULE BY WEEK (official labels only)

The official calendar (wiki 623, posted 2026-10-26) spans WK1–WK8. Some content is still in development and may change. Confirm the live week in the in-game event calendar.

WK1
- Purge Action, lasting 7 days. Kill zombies for First Kill Rewards, raise Resistance, and climb rankings.
- Stronghold Conquest starts. It lasts 14 days and is labeled WK1–WK2. Occupy digging sites. Capturing higher-level sites faster pays Ranking Rewards.
- War Merit Shop opens (runs through WK8). Exchange War Merit for rewards. The shop refreshes weekly.
- Hero Awakening is highlighted. All three heroes are available to choose from; this is not limited to the highlighted weeks. See Hero Awakening.

WK2
- Stronghold Conquest continues (the 14-day event is labeled WK1–WK2).
- War Merit Shop remains open.
- The schedule does not give WK2 its own extra event name. Events that fall on season days during this part of the season are listed in the day-by-day section. Do not invent a WK2-only event.

WK3
- Worm Slayer begins and runs through WK7. Kill sandworms to finish missions and claim rewards.
- Faction Awards. Choose your Faction and lead it into a Duel to win the right to invade and fight for control of Goldust.
- Hero Awakening is highlighted again.

WK4 through WK7
- Goldust Conquest. Every Wednesday and Saturday the two Factions switch who attacks and who defends. Attackers declare war on the opposing Faction's Alliance Center. Winning secures Goldust. Official battle days: D24, D27, D31, D34, D38, D41, D45, D48.
- Worm Slayer continues through WK7.
- Hero Awakening is highlighted in WK5.
- Capitol Conquest is season day 28, described as the Capitol War on Sunday of the fourth week. See the day list.

WK8
- Season Summary. Rewards are distributed based on Alliance Goldust rankings.
- The reward list itself is not published. If asked what the rewards are, say you do not know.

Other systems run across multiple weeks and are timed by season day. Use the day list for City Clash, Return of the Dead, Global Expedition, Trade Posts, Temple Conquest, and Faction Duel. Do not move those onto a week the official schedule did not name.
`;

export const SEASON7_DAILY_SCHEDULE = `
SEASON 7 — SCHEDULE BY SEASON DAY (official day numbers only)

These are season days, not calendar dates. Do not convert them. If two events share a day, both are listed because the official schedule lists both on that day.

D3 — S7 City Clash, level 1 cities. Capture cities in this warzone.
D4 — Global Expedition Phase 1 opens (runs through D17).
D6 — S7 City Clash, level 2 cities.
D9 — Return of the Dead, mummy attack 1 of 6. Defend the Alliance Center. Rewards are paid per successful defense.
D10 — S7 City Clash, level 3 cities.
D12 — Return of the Dead, mummy attack 2 of 6.
D13 — S7 City Clash, level 4 cities.
D14 — Trade Posts level 1–2 open (first of the weekly batches).
D15 — Temple Conquest, level 1. This is how alliances gain Alliance Skills.
D16 — Return of the Dead, mummy attack 3 of 6.
D17 — S7 City Clash, level 5 cities. Global Expedition Phase 1 ends.
D18 — Global Expedition Phase 2 opens (runs through D31). Trade Posts level 3–4 open (first batch).
D19 — Return of the Dead, mummy attack 4 of 6.
D20 — S7 City Clash, level 6 cities.
D21 — Trade Posts level 1–2.
D22 — Temple Conquest, levels 1–2.
D23 — Return of the Dead, mummy attack 5 of 6.
D24 — Goldust Conquest.
D25 — Trade Posts level 3–4.
D26 — Return of the Dead, mummy attack 6 of 6. These six days (D9, D12, D16, D19, D23, D26) are the full official attack list.
D27 — Goldust Conquest.
D28 — Capitol Conquest. The schedule calls this the Capitol War on Sunday of the fourth week. Trade Posts level 1–2 also open this day.
D29 — Temple Conquest, levels 1–3.
D31 — Goldust Conquest. Global Expedition Phase 2 ends.
D32 — Global Expedition Phase 3 opens (runs through D49). Trade Posts level 3–4.
D34 — Goldust Conquest.
D35 — Trade Posts level 1–2.
D36 — Temple Conquest, levels 1–4.
D38 — Goldust Conquest.
D39 — Trade Posts level 3–4.
D41 — Goldust Conquest.
D42 — Trade Posts level 1–2.
D45 — Goldust Conquest.
D46 — Trade Posts level 3–4.
D48 — Goldust Conquest. Last Goldust battle day on the official list.
D49 — Faction Duel Battle Day, the final showdown of the Factions, to "decide the fate of the Golden Realm." Global Expedition Phase 3 ends.

City Clash level days, restated: Lv1 D3, Lv2 D6, Lv3 D10, Lv4 D13, Lv5 D17, Lv6 D20.
Trade Post level 1–2 days: D14, D21, D28, D35, D42.
Trade Post level 3–4 days: D18, D25, D32, D39, D46.
Goldust Conquest days: D24, D27, D31, D34, D38, D41, D45, D48 (weeks 4–7, every Wednesday and Saturday, sides switch each battle).
Temple Conquest: D15 level 1; D22 levels 1–2; D29 levels 1–3; D36 levels 1–4.
Global Expedition: Phase 1 D4–17, Phase 2 D18–31, Phase 3 D32–49.

Events that the schedule times by week, not by a single day, stay in the week section: Purge Action (WK1, 7 days), Stronghold Conquest (WK1–WK2, 14 days), Worm Slayer (WK3–WK7), Faction Awards (WK3), War Merit Shop (WK1–WK8), Season Summary (WK8), and the Hero Awakening highlights (WK1, WK3, WK5).
`;

export const SEASON7_HERO_AWAKENING = `
SEASON 7 — HERO AWAKENING (Carlie, McGregor, Murphy)

Official heroes: Carlie, McGregor, and Murphy.
First named in the August 3, 2026 Progression Preview (wiki 575). That preview said the listing order was not the release order, and that order and timing would be announced later.
The October 26, 2026 schedule (wiki 623) is the later announcement, and it replaces that open question: all three hero awakening options are available at the same time. The player chooses which hero to focus on.
Once the requirements are met, upgrade the chosen hero to red stars to unlock a powerful Awakened Skill.
The schedule highlights Hero Awakening in WK1, WK3, and WK5. That highlight is not a limit. The official text says all three are available together, and the player picks a focus.

What is not confirmed: shard counts, any star or Exclusive Weapon prerequisite beyond "red stars," and each hero's troop type. If asked, say you do not know. Do not copy Season 6 awakening costs onto these heroes.

Global Expedition is how Awakening Shards are earned. See Global Expedition.
`;

export const SEASON7_GLOBAL_EXPEDITION = `
SEASON 7 — GLOBAL EXPEDITION

Global Expedition returns. Official name: Global Expedition. Community posts sometimes call it World Expedition. Use Global Expedition.

All three featured heroes (Carlie, McGregor, Murphy) are available each round. Choose one to focus on.
Train the designated hero in each Global Expedition, meet the requirements, and earn that hero's Awakening Shards to advance step by step.
Official advice in the announcement: "Don't miss a single Global Expedition."

Phases, from the October 26 schedule:
- Phase 1: D4–17
- Phase 2: D18–31
- Phase 3: D32–49

Do not invent phase rewards, shard payouts, or a requirement number that is not written here.
`;

export const SEASON7_ALLIANCE_SKILLS = `
SEASON 7 — ALLIANCE SKILLS

The official announcement says more Alliance Skills are coming. New skills join three returning skills, and the timing and follow-up of how they are used matters.
Temple Conquest is the schedule's source of Alliance Skills:
- D15 — level 1
- D22 — levels 1–2
- D29 — levels 1–3
- D36 — levels 1–4
Those skills then matter in Goldust Conquest, which starts on D24.

Returning skills named on the official wiki 620 image (file revision dated 2026-10-27): Tranquil Rewind, Thunder Feathers, and Warlord Missile.

SOURCES DIFFER on one of those names. The latest official image lists Thunder Feathers. Other write-ups list Tesla Coil in that slot instead. Tell the player the sources do not agree. The latest official image says Thunder Feathers, together with Tranquil Rewind and Warlord Missile. Do not state Tesla Coil as the settled official name, and do not pretend the disagreement is not there.

The names and effects of the new skills are not published. If asked what the new skills do, or for any percentage, say you do not know.
`;

export const SEASON7_COMBAT_PLANS = `
SEASON 7 — COMBAT PLANS (new system)

Combat Plans are new in Season 7. Official description only — no plan names and no numbers have been published. If asked for a plan name, a category list, or a percentage, say you do not know.

What is confirmed:
- Choose a plan that fits your role and what the alliance needs.
- Pair the plan with Tactics Cards and the other seasonal abilities.
- The same Tactics Cards play differently under different plans.
- Which plans are available shifts with the day's activity. Development-focused options are for non-combat days. Combat-focused options are for battle days.
- The announcement also describes holding the line versus chaining offensive options. It does not name those options.

Do not attach a community plan name or a community effect to this system. Those details are not in the official text.
`;

export const SEASON7_DESERT_STORM = `
SEASON 7 — DESERT STORM BATTLEFIELD CHANGES

Official announcement (wiki 620) of the Desert Storm upgrade:
- The map is more compact.
- Rallies and support are faster.
- There is a new mechanic to rescue wounded units.
- There is a battlefield achievements system.
- The roles shown are: lead the charge, garrison, move to the next objective, and rescue or reinforce.

That is the full official list. Do not add point values for rescues, and do not describe user-interface or deployment changes. Those are not in the official text. If asked for numbers, say you do not know.
`;

export const SEASON7_REWARDS = `
SEASON 7 — SEASON REWARDS

Week 8 is the Season Summary. Rewards are distributed based on Alliance Goldust rankings.
Goldust itself is won on the Goldust Conquest days (D24, D27, D31, D34, D38, D41, D45, D48), so those battles are what the ranking is built from. The schedule does not publish the ranking formula.

Reward details — items, amounts, and rank cutoffs — are not published. If asked what a rank pays, say you do not know.

War Merit is the season currency shown on the official schedule. The War Merit Shop runs WK1–WK8 and refreshes weekly. The shop's item list is not in the official posts. If asked what the shop sells, say you do not know.
`;

export const SEASON7_OTHER_CONFIRMED = `
SEASON 7 — OTHER CONFIRMED CALENDAR FACTS

Purge Action (WK1, 7 days): kill zombies for First Kill Rewards, increase Resistance, climb rankings.
Stronghold Conquest (WK1–WK2, 14 days): occupy digging sites; capturing higher-level sites faster pays Ranking Rewards.
Return of the Dead: defend the Alliance Center against mummy attacks on D9, D12, D16, D19, D23, and D26. Rewards are paid per successful defense.
Worm Slayer (WK3–WK7): kill sandworms to complete missions and claim rewards.
S7 City Clash: capture cities in this warzone. Level 1 on D3, level 2 on D6, level 3 on D10, level 4 on D13, level 5 on D17, level 6 on D20.
Capitol Conquest: D28, "on Sunday of the fourth week."
Faction Awards: WK3. Choose a Faction and lead it into a Duel for the right to invade and fight for Goldust.
Faction Duel: D49 Battle Day. The schedule calls it the final showdown that will decide the fate of the Golden Realm.
Trade Posts open in weekly batches. Level 1–2 on D14, D21, D28, D35, D42. Level 3–4 on D18, D25, D32, D39, D46.

The August 3 preview also asked for feedback on Exclusive Weapons, Tactics Cards, and Global Expedition. It did not publish Season 7 numbers for those systems. Do not invent any.

A separate October 21, 2026 notice (wiki 621, Oct Week 4 Updates) added a Crystal Shop tab on the Shop building and a Limited Time Check-In for Oct 26–Nov 1, server time. That notice is not a Season 7 feature list. Do not describe the Crystal Shop or that check-in as part of Season 7.
`;

// SUMMARY ASSEMBLER — injected into buildSystemPrompt() when player.season === 7
export function getSeason7Summary(): string {
  return `## Season 7 Guide — Return to the Golden Realm

Early info, updated as official details are released. Last updated Oct 29, 2026.
You have the confirmed Season 7 facts below, taken from the official wiki and the official account. Use them for Season 7 questions. If a fact is not written here, or it is on the Not yet confirmed list, say you do not know. Do not guess. Do not invent dates, server groups, reward amounts, buildings, tech, or skill numbers. Where sources differ, say so.

${SEASON7_EARLY_NOTE}

${SEASON7_NOT_YET_CONFIRMED}

${SEASON7_NAMING}

${SEASON7_OVERVIEW}

${SEASON7_WEEKLY_SCHEDULE}

${SEASON7_DAILY_SCHEDULE}

${SEASON7_HERO_AWAKENING}

${SEASON7_GLOBAL_EXPEDITION}

${SEASON7_ALLIANCE_SKILLS}

${SEASON7_COMBAT_PLANS}

${SEASON7_DESERT_STORM}

${SEASON7_REWARDS}

${SEASON7_OTHER_CONFIRMED}

— End of Season 7 guide data. Early info, updated as official details are released. Last updated Oct 29, 2026. —`;
}

// Returns the Season 7 summary when season === 7, otherwise an empty string.
export function getSeasonDataSummary7(season: number): string {
  return season === 7 ? getSeason7Summary() : '';
}
