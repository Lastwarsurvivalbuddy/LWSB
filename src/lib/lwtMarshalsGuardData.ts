// src/lib/lwtMarshalsGuardData.ts
// Marshal's Guard (Alliance Exercise) — complete knowledge module
// Source: lastwarhandbook.com/guides/marshals-guard-complete-guide
// Built: March 22, 2026 (session 58)

export const MARSHALS_GUARD_OVERVIEW = `
MARSHAL'S GUARD (ALLIANCE EXERCISE) — OVERVIEW:
- Recurring alliance event that returns every 2–3 days as part of the standard event cycle
- 30-minute cooperative rally marathon — alliance races to destroy 5 armored tanks
- Zero stamina cost — only uses hero march capacity and healing
- One of the most rewarding recurring events for: blueprints, speedups, hero EXP, alliance contribution
- Every player can contribute regardless of power level

UNLOCK: Available once your alliance has the Alliance Exercise feature (standard mid-game unlock)

WHY IT MATTERS:
- Primary source of Legendary Gear Blueprints outside of major events
- Strong alliance contribution income (500 per construction part donation)
- Hero EXP, speedups, and resource packs as rewards
- Scales with difficulty — Levels 1–12 with exponentially increasing HP and rewards
`;

export const MARSHALS_GUARD_PHASES = `
MARSHAL'S GUARD — THREE PHASES:

PHASE 1: SELECTION (Officer Setup)
- R4 and R5 officers choose the difficulty level (Levels 1–12)
- Higher levels = dramatically more tank HP + better rewards
- Officers MUST set a start time before 22:00 server time on the final day of the cycle or the opportunity expires
- Place the platform NEAR your alliance rally point — shorter march time = more rally cycles during the 30-minute window
- CHOOSING DIFFICULTY: pick a level your alliance can realistically clear with 5–10 minutes remaining
  Overreaching wastes troops and leaves rewards on the table

DIFFICULTY GUIDELINES:
- Levels 1–3: Beginner — easy clears, modest rewards. Good for learning mechanics.
- Levels 4–6: Intermediate — balanced challenge and strong payouts. Target range for most alliances.
- Levels 7–10: Advanced — high coordination required, optimized hero lineups needed.
- Levels 11–12: Elite — only attempt after consistently clearing Level 10 with time to spare. Rewards marginally better than Level 10.
- If your alliance cuts less than 50% of total tank HP → drop a level next rotation
- Target clears with 5–10 minutes remaining

PHASE 2: PREPARATION (Countdown Window)
- CONSTRUCTION PART DONATIONS: access via Drill Field → Event Hub → Alliance Exercise → Build
  Every 100 parts donated = +5% rally damage (caps at 500 parts = +25% total bonus)
  Each donation also awards 500 alliance contribution
  ⚠️ DONATE IMMEDIATELY — no reason to save parts, early donations boost damage sooner
- RECALL ALL TROOPS: pull squads from gathering, mines, expeditions at least 5–10 minutes before start
  Cannot initiate rallies while squads are deployed elsewhere — this is the #1 avoidable mistake
- POSITION YOUR BASE near the platform or alliance rally point
  Shorter march = dramatically more rally cycles over 30 minutes
  Difference between 30-second and 3-minute march = multiple extra rallies over the event
- WAR FEVER (optional): scout an unaffiliated base a few minutes before start for +1% damage
  ⚠️ War Fever breaks shields — do NOT scout if you are shielded

PHASE 3: BATTLE (30-Minute Damage Push)
- R4/R5 officers start the event manually — 5 tanks spawn instantly
- ALL attacks MUST be 3-minute rallies. Solo attacks and 1-minute rallies do NOT work.
- Each player can run only ONE rally at a time but may JOIN unlimited rallies from other players
`;

export const MARSHALS_GUARD_ROTATION = `
MARSHAL'S GUARD — RALLY ROTATION STRATEGY:

CORE ROTATION (2 squads):
- Squad 1 (WEAKER): starts rallies — sits idle during countdown anyway
- Squad 2 (STRONGER): joins rallies — maximizes damage output
Your strongest squad should ALWAYS be joining, never starting

ROTATION (3+ squads):
- Weakest squad: handles starting rallies only
- Strongest 2 squads: join rallies only — keep them cycling through damage phases continuously

RALLY PRIORITIES (in order):
1. Join R5-led rallies first — R5 officers provide +5% damage bonus
2. Join R4-led rallies second — R4 officers provide +2.5% damage bonus
3. Fill rallies with the shortest timers — keeps cycles tight, more attacks per 30 minutes
4. Remove distant marchers — rally leaders can kick marchers with red arrow (>5 min travel) to speed up cycles

PARTICIPANT MANAGEMENT:
- Enable Offline Participation so your best squad auto-joins rallies in the final 20 seconds if you disconnect
- Rally leaders: kick distant marchers (red arrow) if their travel time exceeds 5 minutes
- Keep squads active constantly — launch or join the moment your troops return
`;

export const MARSHALS_GUARD_HEALING = `
MARSHAL'S GUARD — TROOP MANAGEMENT AND HEALING:

HEALING CYCLE (critical for sustained participation):
1. After each rally, open hospital and queue healing for ~25–30 minutes worth of troops
2. Request alliance help IMMEDIATELY — collective assistance finishes heals in seconds
3. Repeat after every rally for near-continuous squad uptime
⚠️ You are NOT trying to fully heal between every attack — you're managing the queue so troops are available when needed

TROOP LOSS AND RECOVERY:
- Train troops daily so lower tiers refill losses automatically (T5→T4→T3→T2→T1 backfill chain)
- Expect troop losses — rewards more than compensate when you reach personal reward tiers
- Hospital mechanics keep costs manageable

WHEN TO STOP ATTACKING:
- Personal target met: after hitting desired reward tier (10k, 20k, etc.), help fill others' rallies or stand down
- Alliance objectives achieved: once Phase 5 rewards and personal caps are secured
- Excessive casualties: if healing cannot keep pace, focus exclusively on joining R5/R4 rallies
- Underperforming difficulty: if tanks stay above 50% HP, stop. Drop a level next cycle.
`;

export const MARSHALS_GUARD_HEROES = `
MARSHAL'S GUARD — HERO COMPOSITION:

MUST-HAVE SUPPORT:
- Marshall (hero): backline support — Command Strategy boosts allied attack across all formation types
  If you build only ONE support hero, make it Marshall. He fits Tank, Aircraft, and Missile formations.

TOP DAMAGE DEALERS:
Mason · Tesla · Kimberly · Morrison · Stetmann · DVA · Schuyler · Fiona
(use whichever you have developed — role is to maximize sustained damage output)

FRONTLINERS BY FORMATION TYPE:
- Tank: Williams + Murphy in front
- Aircraft: Lucius + Carlie in front
- Missile: Adam + McGregor in front

KEY SUPPORT:
- Layla: healing for sustained fights
- Sarah: improves aircraft survivability

RECOMMENDED FORMATIONS:
Tank (default): Williams + Murphy (front) · Kimberly + Stetmann + Tesla (back)
  If survivability issue: swap Tesla for Marshall
Aircraft: Lucius + Carlie (front) · Morrison + Schuyler + DVA (back)
  If backline fragile: swap Morrison for Sarah or Marshall
Missile: Adam + McGregor (front) · Fiona + Tesla + Swift (back)
  Wait until you own BOTH frontline URs before committing to this formation
Budget/Early: Murphy + Violet (front) · Kimberly + Mason + Marshall (back)
  Works with accessible heroes while building toward full UR lineup

⚠️ Evidence suggests monster-specific hero bonuses do NOT apply in Marshal's Guard.
`;

export const MARSHALS_GUARD_REWARDS = `
MARSHAL'S GUARD — REWARD SYSTEM:

ALLIANCE REWARDS:
- Total alliance damage unlocks 5 cumulative reward phases for every member
- Phase 5 = victory benchmark — aim to unlock every run
- MVP MULTIPLIER: highest individual scorer sets a 1x–10x multiplier on ALL alliance rewards
  Encouraging your strongest player to push hard amplifies payouts for everyone — not just the MVP

INDIVIDUAL REWARD THRESHOLDS (approximate):
- ~3,000 points: base participation rewards
- ~10,000 points: recommended minimum target for meaningful returns
- 20,000–40,000 points: top-tier reward brackets
- 80,000+ points: maximum payouts at highest difficulties
- Can hit 10,000 on Levels 4–5 with consistent participation

REWARD TYPES:
- Legendary Gear Blueprints (primary value — use in Honor Shop / gear star promotion)
- Construction speedups and training speedups
- Hero EXP items
- Alliance Contribution (from donations and participation)
- Resource packs
- Sheriff Currency (event-specific)
- Zombie Tokens (event-specific)

COST-BENEFIT:
- Healing costs are easily offset when you reach your personal reward tier
- Phase 5 alliance completion + MVP multiplier + hospital help mechanic = strong positive ROI
- Lower-power members should still participate — rewards support growth at all levels
`;

export const MARSHALS_GUARD_COMMON_MISTAKES = `
MARSHAL'S GUARD — COMMON MISTAKES:

❌ Skipping construction part donations
   → Costs alliance the +25% damage bonus. Donate immediately — no reason to save parts.

❌ Forgetting to recall gathering squads before start
   → Your best troops unavailable when the event begins. Recall 5–10 min early.

❌ Parking too far from the platform
   → Wastes march time that could be additional rally cycles. Position near platform.

❌ Launching 1-minute or solo rallies
   → They don't work. Only 3-minute rallies count in this event.

❌ Starting rallies with your strongest squad instead of joining
   → Your best heroes sit idle during countdowns instead of dealing damage.

❌ Canceling rallies unnecessarily or launching other event rallies during the window
   → Disrupts the cycle and wastes the 30-minute window.

❌ Neglecting offline participation toggle
   → You contribute nothing if you disconnect. Enable it.

❌ Overreaching on difficulty
   → If tanks stay above 50% HP, you've wasted troops. Drop a level next time.
`;

export const MARSHALS_GUARD_PROGRESSION = `
MARSHAL'S GUARD — PROGRESSION TIMELINE:

New Servers (Weeks 1–2): Levels 1–2. Learn mechanics, clear consistently. Don't optimize yet.
Growing Alliances (Weeks 3–8): Levels 3–6. Build first UR squads. Target Phase 5 completions. Refine coordination.
Established Alliances (Week 9+): Levels 6–9. Multiple UR heroes, smooth execution. Compete for server rankings.
Veteran Alliances (Late Season): Levels 10–12. Optimized squads + exclusive weapons. MVP farming maximizes multipliers.
`;

export function getMarshalsGuardSummary(): string {
  return `
=== MARSHAL'S GUARD (ALLIANCE EXERCISE) ===

${MARSHALS_GUARD_OVERVIEW}

${MARSHALS_GUARD_PHASES}

${MARSHALS_GUARD_ROTATION}

${MARSHALS_GUARD_HEALING}

${MARSHALS_GUARD_HEROES}

${MARSHALS_GUARD_REWARDS}

${MARSHALS_GUARD_COMMON_MISTAKES}

${MARSHALS_GUARD_PROGRESSION}
`;
}