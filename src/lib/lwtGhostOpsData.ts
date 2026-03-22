// src/lib/lwtGhostOpsData.ts
// Ghost Ops event — complete knowledge module
// Source: lastwarhandbook.com/guides/ghost-ops-guide
// Built: March 22, 2026 (session 58)

export const GHOST_OPS_OVERVIEW = `
GHOST OPS — OVERVIEW:
- Weekly event running THURSDAYS ONLY via the Secret Command Post building
- The single most valuable weekly event for hero progression — provides the ONLY free path to exclusive UR heroes
- Zero resource cost — no stamina, no currency, no items required to participate
- Alliance-based: coordinate with members for mission conditions and timing

UNLOCK REQUIREMENTS:
- Day 60 of Season 1 (during Season 1 Celebration)
- HQ Level 18 minimum
- Must be an alliance member

WHY GHOST OPS MATTERS:
- Exclusive UR heroes obtainable ONLY through Ghost Ops (not available in standard Tavern):
  Lucius · Morrison · Williams · Schuyler · McGregor · Stetmann · Adam · Fiona
- Missing any Thursday is a permanent loss of progression toward these heroes
- Even partial participation (one time window) is better than skipping
`;

export const GHOST_OPS_SCHEDULE = `
GHOST OPS — THURSDAY SCHEDULE (4 windows, server time):

| Window | Hours |
|--------|-------|
| Window 1 | 00:00 – 03:00 |
| Window 2 | 06:00 – 09:00 |
| Window 3 | 12:00 – 15:00 |
| Window 4 | 18:00 – 21:00 |

IMPORTANT TIMING RULES:
- Signal cuts off entirely between windows — missions CANNOT be launched outside these periods
- Each mission takes 30–45 minutes to complete
- The 18:00–21:00 window typically sees highest alliance activity
- Plan participation around the window that fits your schedule — even one window per week counts
- Rewards must be claimed MANUALLY via Secret Command Post after each mission completes
  ⚠️ Rewards do NOT auto-collect. Check back regularly or you will lose them.
`;

export const GHOST_OPS_MISSIONS = `
GHOST OPS — MISSION TIERS AND REWARDS:

| Tier | Fragment Reward | Special Bonus | Priority |
|------|----------------|---------------|----------|
| SSR (Purple) | 0 fragments | Basic materials only | Skip when possible — filler only |
| UR Level 4 | 1 fragment | Bonus rewards when conditions met | High |
| UR Level 5 | 2 fragments | Enhanced bonus rewards | High |
| Star UR (★) | 5 fragments | Best in event | HIGHEST — never miss |

STAR UR MISSIONS (top priority):
- Require specific heroes at 4-star minimum
- Deliver 5 hero fragments — 5x the output of a standard UR mission
- These are the primary progression engine for exclusive heroes

SPECIAL CONDITION BONUS POOL (when hero requirements are met):
When special hero conditions are satisfied, ALL participants receive 10 random draws from:
- Hero Fragment or Exclusive Weapon Choice Chest: 20% drop rate
- Coin Chests (blue, purple, gold): variable
- Skill Chip Chests (SR and SSR): variable
- 500 Competency Medals: 10% drop rate
- 5 Drone Coins: 5% drop rate
- 1-hour Accelerators: 15% drop rate
`;

export const GHOST_OPS_LIMITS = `
GHOST OPS — DAILY PARTICIPATION LIMITS:

| Activity | Daily Limit | Reward |
|----------|-------------|--------|
| Own missions (UR) | 3 | Full rewards including fragments |
| Own missions (SSR) | 1 | Full rewards (no fragments) |
| Rewarded ally assists | 3 | Full rewards from assisted mission |
| Volunteer assists | Unlimited | 200 Alliance Contribution each |
| Plundering enemy Ghost Ops | 5 | Rewards from enemy missions |

HERO COOLDOWN SYSTEM:
- Each hero can participate in up to 4 missions per 6-hour time slot
- Heroes remain locked during mission duration
- Track cooldowns and communicate availability in alliance chat

REWARDED ASSIST PRIORITY ORDER (use your 3 assists on):
1. Missions with Weapon Choice Chest rewards — highest value
2. Missions with Skill Medal rewards — gates progression
3. Missions with Drone Part rewards — hard to obtain elsewhere
4. Any Star UR mission — 5 fragments always valuable
After 3 rewarded assists, continue volunteering for 200 Alliance Contribution each
`;

export const GHOST_OPS_HEROES = `
GHOST OPS — EXCLUSIVE HEROES (only source in game):

| Hero | Type | Notes |
|------|------|-------|
| Lucius | Tank | Elite frontline defender — core Aircraft squad |
| Morrison | Aircraft | Top-tier aircraft DPS — Aircraft squad |
| Williams | Tank | Essential tank support — Tank squad |
| Schuyler | Aircraft | Critical aircraft formation hero |
| McGregor | Missile Vehicle | MV frontline specialist |
| Stetmann | Tank | Versatile tank hero |
| Adam | Missile Vehicle | Key MV formation hero |
| Fiona | Missile Vehicle | Premium MV damage dealer |

⚠️ CRITICAL: None of these heroes are available in the standard Tavern pool.
Ghost Ops is the ONLY free acquisition path. Missing weeks = permanent gap in your roster.
`;

export const GHOST_OPS_STRATEGY = `
GHOST OPS — STRATEGY AND BEST PRACTICES:

TIMING:
- Launch missions at the EXACT START of each reset window — alliance activity peaks at reset
- This provides maximum help availability, better coordination for special conditions
- Your completed tasks are harder to spot among the wave of others (reduces plunder exposure)

MISSION EXECUTION:
- Only send Star UR and UR missions when all requirements are satisfied — never send incomplete gold missions
- If incompatible players have joined but won't meet conditions, kick them by restarting the task before sending
- Use Mason and Violet (at UR status) as filler heroes — they are never required for special conditions
- When you have the requested heroes for a mission, execute immediately to free them for other alliance teams

COORDINATION:
- Share missions in alliance chat immediately when started
- Check alliance chat for missions with the same hero requirements before starting yours — consolidate
- Don't join a slot requiring heroes you don't have — you block someone who can meet the condition

PLUNDERING ENEMY GHOST OPS:
- Appears as green mission icons on the world map (regular missions = red icons)
- Typically found at map edges — from other servers in your Apex Arena or Storm Arena group
- Plundering other servers' Ghost Ops is acceptable — doesn't harm your server community
- Legendary (gold) rarity Ghost Ops yield superior plunder rewards
- Best time to search: ~30 minutes after reset when many players have started but not completed

HERO ROSTER DEVELOPMENT:
- Requirements escalate weekly — heroes like Fiona, Adam, Schuyler, McGregor, Lucius become frequently required
- Build a diversified roster at 4-star minimum to maintain eligibility for special condition rewards
- Priority development targets for Ghost Ops eligibility: all exclusive UR heroes to 4-star
`;

export const GHOST_OPS_COMMON_MISTAKES = `
GHOST OPS — COMMON MISTAKES:

❌ Sending incomplete Star UR missions without full team or conditions met
   → Only send when all requirements are satisfied

❌ Blocking slots without having the required heroes
   → Don't join a mission if you can't meet the hero conditions

❌ Forgetting to collect rewards manually
   → Check Secret Command Post after every mission completes — rewards don't auto-collect

❌ Neglecting secondary hero roster development
   → Requirements escalate — build Fiona, Adam, Schuyler, McGregor, Lucius to 4-star minimum

❌ Splitting required heroes across identical missions
   → Check alliance chat before starting — consolidate teams around available heroes

❌ Only participating in one mission type
   → Use all 3 rewarded assist slots on the highest-value missions available
`;

export function getGhostOpsDataSummary(): string {
  return `
=== GHOST OPS (THURSDAY EVENT) ===

${GHOST_OPS_OVERVIEW}

${GHOST_OPS_SCHEDULE}

${GHOST_OPS_MISSIONS}

${GHOST_OPS_LIMITS}

${GHOST_OPS_HEROES}

${GHOST_OPS_STRATEGY}

${GHOST_OPS_COMMON_MISTAKES}
`;
}