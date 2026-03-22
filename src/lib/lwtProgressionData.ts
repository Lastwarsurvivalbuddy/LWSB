// src/lib/lwtProgressionData.ts
// Mid-game and overall account progression guide
// Sources: lastwarhandbook.com/guides/mid-game-progression-guide, beginner-mistakes-guide
// Built: March 22, 2026 (session 58)

export const PROGRESSION_OVERVIEW = `
ACCOUNT PROGRESSION — OVERVIEW:
Last War: Survival rewards players who understand the systems over players who simply react to events.
The biggest mistakes are all structural — hero spreading, wrong research order, bad speedup timing.
Fixing these early compounds into massive advantages over months.

THREE RULES THAT DEFINE EFFICIENT PROGRESSION:
1. Focus over breadth — 5 maxed heroes > 10 mediocre heroes. 1 maxed gear piece > 4 half-built.
2. Never use speedups outside of scoring events — always wait for Arms Race or Alliance Duel phases.
3. The research queue is never allowed to sit empty — an idle queue is permanently wasted time.
`;

export const PROGRESSION_EARLY_GAME = `
PROGRESSION — EARLY GAME (HQ 1–15, Days 1–60):

PRIORITY ORDER:
1. Join an alliance on Day 1 — no benefit to waiting. Every day solo = progress permanently lost.
2. Level HQ as fast as possible — follow the prerequisite chain, never sit on a ready upgrade.
3. Development heroes first: Shirley (VIP 8) → Violet → Sarah. Construction and research speed compound daily.
4. Get Tactical Drone upgraded consistently from unlock — permanent passive combat power, no active management required.
5. Keep research queue running at ALL times. An idle queue is wasted time.
6. Do not spend diamonds on instant completions. Use speedup items.

WHAT NOT TO DO EARLY:
- Do NOT upgrade resource buildings before core combat/research buildings
- Do NOT level 8+ heroes — 5 same-type heroes at max beats 10 mediocre ones
- Do NOT mix hero types in your squad — formation bonus (+20% all stats) requires 5 same type
- Do NOT join an established server — find a "New" or "Recommended" server

BUILDING HQ CHAIN RULE:
Before starting ANY long upgrade, check requirements for your next TWO HQ levels.
Start the slowest prerequisite building first in your second build slot.
This keeps the chain moving during long windows and prevents stall.
`;

export const PROGRESSION_MID_GAME = `
PROGRESSION — MID GAME (HQ 15–30, T10 path):

KEY MILESTONES IN ORDER:
- HQ 15: Component Factory + Chip Lab unlock → start Skill Chip system immediately
- HQ 16: Second Drill Ground → +33% troop capacity
- HQ 20: Special Forces research becomes accessible → START IT IMMEDIATELY
- HQ 24: T8 troops unlock → substantial PvP improvement
- HQ 25: Gateway to endgame — nearly every competitive system available
- HQ 30: T10 unlock (if Special Forces research is complete) · Hero cap 150

RESEARCH PRIORITY ORDER (mid-game):
1. Development tree — finish it. Every % of construction/research speed saves time on everything else.
2. Alliance Duel research — starts the badge income flywheel. Duel Expert first.
3. Special Forces research — required path to T10 troops. Do NOT delay this.
4. Economy tree — background progress. Low badge cost, compound returns.

⚠️ CRITICAL: Do NOT spend Valor Badges on Intercity Truck, Defense Fortification, or other trees
until Alliance Duel research is complete and T10 path is clear. Those can wait.

BARRACKS STAGGERING STRATEGY (waterfall/ladder method):
Instead of training highest tier directly (slow, expensive), stagger Barracks levels:
- One Barracks at L15 → trains T5
- One Barracks at L18 → trains T6
- One Barracks at L21 → trains T7
- One Barracks at L24 → trains T8
Then PROMOTE through tiers (T5→T6→T7→T8) during Arms Race Unit Progression phase.
Promoting existing troops = same points as training that tier from scratch.
Result: dramatically more event points per resource spent vs training T8 directly.

SECOND TECH CENTER:
- Doubles research capacity — one queue for badge-heavy research, one for resource research
- Unlock: clear District 102 in campaign, then purchase (~$9.99)
- Considered essential for competitive mid-to-late game play
- F2P: accept slower timeline, prioritize badge research over resource research when forced to choose

RESOURCE CHEST HOARDING STRATEGY:
Do NOT open resource chests unless you need resources immediately.
Chest contents SCALE with your HQ level when opened.
Opening at HQ 15 = small amount. Opening at HQ 25 = significantly more.
Hold chests until you actually need them. This is one of the most overlooked efficiency gains.
`;

export const PROGRESSION_LATE_GAME = `
PROGRESSION — LATE GAME (HQ 30–35, T10/T11):

RESEARCH PRIORITIES SHIFT:
- Special Forces complete → T10 unlocked
- Alliance Duel research → Duel Expert to Level 20 (doubles all VS points) is the crown priority
- Alliance Tech research → Valor Badges here after Alliance Duel is maxed
- T11 path: requires Season 4 off-season completion, HQ 27+, Armament Institute, all 4 research branches

HQ 30 REALITY CHECK:
HQ 30 base timer = 101 days. This is designed as a long-term goal.
Accelerants: consistent alliance helps, VIP build speed, event timing, speedups on scoring days.
Begin treating HQ 30 as a months-long project from HQ 25 — do not rush it.

OIL PHASE (HQ 31–35):
- Age of Oil unlocks after Season 2 Celebration via Base Expansion research
- Oil is required for HQ 31–35 AND their prerequisite buildings
- Your real timeline in this phase = determined by Oil production rate, NOT build timers
- Begin Oil infrastructure investment BEFORE you need it — while HQ 30 is building
- Total Oil for HQ 31–35 upgrades alone: ~28.81M. Full phase including prerequisites: substantially higher.
- Never spend Oil on non-chain buildings while HQ chain is incomplete.

GEAR FACTORY PRIORITY:
- Level 20 gates star promotion on all gear (1★ through 5★)
- Push to Level 20 as a mid-game milestone — do not wait until late game
- Star promotion costs: 50 Legendary Blueprints + 10 Mythic per piece for 5★. This takes months.
- Honor Points from PvP events → spend exclusively on Legendary Gear Blueprints
`;

export const PROGRESSION_SPEEDUP_STRATEGY = `
PROGRESSION — SPEEDUP TIMING STRATEGY:

THE GOLDEN RULE: Never use speedups randomly. Always wait for the matching event phase.
Using a speedup outside of its event phase returns only the time reduction.
Using it during the matching event phase returns: time reduction + event points + chest rewards.

MINIMUM STOCKPILE TARGETS:
- Generic speedups: 50+ hours (highest flexibility, use on biggest priority)
- Construction speedups: 30+ hours (Day 2 and Day 5)
- Research speedups: 30+ hours (Day 3 and Day 5)
- Training speedups: 50+ hours (Day 5 — 4x multiplier)
- Healing speedups: 20+ hours (Day 6 only)
- Hero Advancement speedups: 10+ hours (Arms Race Hero phase ONLY — never during VS)

PRE-START STRATEGY (most important technique):
Start a building/research 7 hours before the scoring phase begins.
Use speedups to FINISH it during the scoring window.
You get credit for the full upgrade but used minimal speedups.
Points are awarded on COMPLETION, not on how much time was sped up.

WHEN TO BREAK THE RULE (HQ rush exceptions):
Acceptable to use speedups outside events ONLY when:
- You're within 1–2 hours of a major HQ milestone (e.g. HQ 20, HQ 25, HQ 30)
- The unlock will meaningfully accelerate your progression
- The upgrade won't complete before the next matching event phase anyway
`;

export const PROGRESSION_HERO_FOCUS = `
PROGRESSION — HERO INVESTMENT FOCUS:

THE CORE PRINCIPLE: Five heroes, fully developed, always outperform ten heroes spread thin.

INVESTMENT ARITHMETIC:
100,000 Hero EXP across 10 heroes = 10,000 each = no one crosses meaningful thresholds
100,000 Hero EXP across 5 heroes = 20,000 each = meaningful skill and level unlocks

THE 4-STAR THRESHOLD:
3★ → 4★ is the most impactful star upgrade in the game per shard spent.
It unlocks the hero's 4-star passive ability and delivers a large stat increase.
Reach 4★ on priority heroes BEFORE pushing any hero to 5★.

FORMATION BONUS — NEVER SACRIFICE IT:
5 same-type heroes = +20% HP, ATK, DEF to ALL stats simultaneously.
A lower-rarity hero of the CORRECT TYPE almost always beats a higher-rarity hero of the WRONG TYPE.
Type discipline > rarity chasing in early and mid game.

SSR-TO-UR PROMOTION:
When an SSR hero promotes to UR, their star count resets BUT base stats increase substantially.
The hero is STRONGER after promotion, not weaker.
All skill medals are refunded (100%) on promotion — early investment is never truly wasted.

RECOMMENDED STARTING SQUAD (Tank — most accessible F2P):
Murphy + Kimberly + Williams + Mason + Marshall
Tank squad unlocks its 5th UR hero earliest, formation bonus easiest to achieve.
`;

export const PROGRESSION_DAILY_HABITS = `
PROGRESSION — MANDATORY DAILY HABITS:

These activities are non-negotiable for F2P players. Missing them compounds over weeks into significant gaps.

ALWAYS DO DAILY:
- Claim Daily VIP Chest (200 VIP points — permanently lost if not claimed)
- Complete all Secret Tasks (Yours/Assist/Loot) — diamonds + resources
- Give 3 likes in 3v3 Arena — 90 FREE diamonds per day
- Win 5 3v3 Arena matches — additional rewards
- 2 free 50-stamina refreshes — claim both
- 1 hero + 1 survivor recruitment (free daily pulls)
- Armored Truck missions — complete and collect
- Radar missions — initiate and claim
- Kill at least 1 zombie (event zombies when active — better rewards per stamina)
- Check VIP Store, Mall, and Hot Deals for time-limited free chests
- Check alliance help requests — every click reduces their timers

WEEKLY HABITS:
- Stack radar missions Sunday night for Monday (Day 1)
- Thursday: use all saved recruit tickets and hero shards (Day 4 — Train Heroes)
- Friday: deploy biggest speedup stockpile (Day 5 — 4x training multiplier)
- Saturday: shield before Enemy Buster if you are going offline

STAMINA MANAGEMENT:
- Never burn stamina on random world map zombies when a stamina event is imminent
- Know the weekly event schedule — protect your stamina reserves for high-value windows
- Event zombies (Zombie Invasion, Marshal's Guard) provide dramatically better reward quality per stamina
`;

export function getProgressionDataSummary(): string {
  return `
=== ACCOUNT PROGRESSION GUIDE ===

${PROGRESSION_OVERVIEW}

${PROGRESSION_EARLY_GAME}

${PROGRESSION_MID_GAME}

${PROGRESSION_LATE_GAME}

${PROGRESSION_SPEEDUP_STRATEGY}

${PROGRESSION_HERO_FOCUS}

${PROGRESSION_DAILY_HABITS}
`;
}