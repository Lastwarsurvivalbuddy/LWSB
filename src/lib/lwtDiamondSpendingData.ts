// src/lib/lwtDiamondSpendingData.ts
// Diamond spending strategy — F2P income, priority order, VIP full chart, shield costs
// Source: lastwarhandbook.com/guides/diamond-spending-guide
// Built: March 22, 2026 (session 58)

export const DIAMOND_OVERVIEW = `
DIAMONDS — OVERVIEW:
- Premium currency in Last War: Survival
- Most important currency after VIP points are maxed
- F2P players can earn approximately 6,000–8,000 diamonds/month through consistent daily play
- Spending wrong = fall behind players who started after you
- Spending right = punch above your weight in every event

CORE RULE: Never spend diamonds on instant building or research completions.
Use speedup items instead — they're earned for free and serve the identical function.
Every diamond spent on instant completions is permanently lost value that should have gone to VIP.
`;

export const DIAMOND_F2P_INCOME = `
DIAMONDS — F2P MONTHLY INCOME (~6,000–8,000/month):

| Source | Monthly Total | How to Claim |
|--------|--------------|-------------|
| Daily Tasks | ~3,000 | Complete all daily objectives |
| Event Participation | ~2,000 | Arms Race, Alliance Duel, special events |
| Alliance Activities | ~500 | Alliance gifts, alliance shop |
| 3v3 Arena Likes | ~2,700 | Give 3 likes daily = 90 diamonds/day |
| World Map Zombies | ~300 | Level 12+ zombies drop diamonds |
| Achievement Rewards | Varies | One-time unlocks |

DAILY DIAMOND CHECKLIST — NEVER MISS THESE:
- Complete all Secret Tasks (Yours/Assist/Loot) — diamonds + resources
- Give 3 likes in 3v3 Arena = 90 diamonds FREE per day
- Win 5 matches in 3v3 Arena — additional rewards
- Kill Level 12+ zombies on world map
- Complete full daily task chain
- Check mail for event reward diamonds
- Claim alliance gift diamonds
- Claim daily VIP chest (200 VIP points — never miss this)
`;

export const DIAMOND_SPENDING_PRIORITY = `
DIAMONDS — F2P SPENDING PRIORITY ORDER:

| Priority | Use | Why |
|----------|-----|-----|
| 1 | VIP Points | Permanent bonuses that compound forever |
| 2 | 30-Day VIP Activation | 3x better value than daily activation |
| 3 | Shields (Enemy Buster) | Protects weeks of progress during Day 6 |
| 4 | Stamina (VIP Store) | Event participation multiplier |
| 5 | Survivor Tickets | Base production bonuses |

NEVER SPEND DIAMONDS ON:
- Instant building completion — use construction speedups instead
- Instant research completion — use research speedups instead
- Random hero recruitment (Tavern pulls) — poor expected value, wait for events
- Resource purchases — terrible conversion rate, farm resources normally
- Full-price shop items — always wait for discounts
- Renaming — cosmetic only

THE "JUST 100 DIAMONDS" TRAP:
"Just 100 diamonds to finish this building" = 3,000 wasted diamonds per month.
That's half your VIP budget. Rule: if it doesn't provide PERMANENT value, don't buy it.
`;

export const DIAMOND_VIP_FULL_CHART = `
DIAMONDS — COMPLETE VIP LEVEL CHART (confirmed Jan 2026):

| VIP Level | Points Required (incremental) | Cumulative Points | Key Unlock |
|-----------|------------------------------|-------------------|-----------|
| 1 | 0 | 0 | VIP Store access · Adventurer Taylor survivor |
| 2 | 500 | 500 | +5% Construction Speed |
| 3 | 2,000 | 2,500 | +10% Construction Speed · 1 Rush attempt |
| 4 | 5,000 | 7,500 | Shake to Collect unlocked |
| 5 | 10,000 | 17,500 | +15% Construction Speed |
| 6 | 20,000 | 37,500 | Enhanced daily rewards |
| 7 | 40,000 | 77,500 | +3% Hero ATK |
| 8 | 80,000 | 157,500 | Agent Shirley unlocked · +5% Hero ATK |
| 9 | 150,000 | 307,500 | +5% Hero ATK |
| 10 | 300,000 | 607,500 | Major milestone — significant combined bonuses |
| 11 | 500,000 | 1,107,500 | +7.5% Hero ATK · +7.5% DEF · +7.5% HP |
| 12 | 800,000 | 1,907,500 | Enhanced VIP Store |
| 13 | 1,200,000 | 3,107,500 | +10% Hero stats |
| 14 | 1,800,000 | 4,907,500 | PvP-ready tier |
| 15 | 2,500,000 | 7,407,500 | All speed boosts active — 5th march slot |
| 16 | 4,000,000 | 11,407,500 | Combat beast tier |
| 17 | 6,000,000 | 17,407,500 | Near-maximum bonuses |
| 18 | 32,600,000 | 50,000,000 | Custom base skin · +12.5% Hero stats |

F2P MILESTONE TARGETS:
- VIP 3: Week 2 — +10% construction speed (cheap, worth rushing)
- VIP 5: Month 1 — Shake to Collect + +15% construction
- VIP 8: Month 3–4 — Agent Shirley (huge squad boost via march size)
- VIP 10: Month 6–8 — major power spike
- VIP 11+: 1 year+ — requires consistent diamond saving
- VIP 18: ~15 years F2P — whale territory only

KEY SURVIVORS UNLOCKED BY VIP:
- VIP 1: Adventurer Taylor (development/economy survivor)
- VIP 8: Agent Shirley (march size increase — most impactful survivor in the game for combat)
`;

export const DIAMOND_VIP_ACTIVATION = `
DIAMONDS — VIP ACTIVATION STRATEGY:

VIP Level and VIP Status are TWO SEPARATE THINGS:
- Level: permanent, determines which bonuses are available
- Status (activation): temporary, required to actually USE the bonuses
- Speed/stat buffs from VIP only apply while STATUS is active

VIP ACTIVATION COSTS:
| Duration | Diamond Cost | Cost Per Day | Value |
|----------|-------------|-------------|-------|
| 1 Day | 200 | 200 | Poor |
| 7 Days | 1,000 | 143 | Okay |
| 30 Days | 2,000 | 67 | BEST — always buy this |

ALWAYS buy 30-day activation. Cost per day is 3x better than daily option.
This is your SECOND diamond priority after reaching VIP 3+.

WHEN TO ACTIVATE:
Best times to activate (or ensure active):
- Starting a major building push (HQ upgrades)
- Entering a new season
- During Arms Race weeks
- Before Alliance Duel begins
`;

export const DIAMOND_SHIELD_COSTS = `
DIAMONDS — SHIELD COSTS AND STRATEGY:

| Duration | Diamond Cost | Best Use Case |
|----------|-------------|---------------|
| 8 Hours | 1,500 | Short breaks during events |
| 24 Hours | 5,000 | Standard Enemy Buster day |
| 72 Hours | 12,000 | Extended absence, weekend coverage |

ENEMY BUSTER SHIELD STRATEGY:
- Budget: 5,000 diamonds per week minimum during active seasons
- Timing: Apply 24-hour shield BEFORE Enemy Buster starts (before server reset Saturday)
- If participating in attacks: time shield to activate AFTER your attacks complete
- Coordinate with alliance to know the safe window for dropping shield

WHEN SHIELDS ARE ESSENTIAL:
- Enemy Buster (Duel Day 6): CRITICAL — losing troops here costs days of recovery
- Capitol War / Warzone Duel: HIGH — cross-server PvP actively targeting bases
- Kill Events: HIGH — players actively hunting unshielded bases
- Regular days: LOW — warehouse protection usually sufficient for offline periods

SHIELD ALTERNATIVES (when diamonds are tight):
- Shelter troops in Shelter building — reduces losses if hit
- Keep resources below warehouse protection cap before logging off
- Stay online and relocate if threatened
- Join a strong alliance for deterrence
`;

export const DIAMOND_MONTHLY_BUDGET = `
DIAMONDS — F2P MONTHLY BUDGET (~6,000/month):

| Category | Allocation | Diamonds | Notes |
|----------|-----------|---------|-------|
| VIP Points | 40% | 2,400 | Long-term permanent investment |
| 30-Day VIP Activation | 33% | 2,000 | Essential bonuses |
| Shield Reserve | 17% | 1,000 | Enemy Buster protection |
| Flexible/Emergency | 10% | 600 | Stamina, opportunities |

ADJUSTMENTS BY GAME STAGE:
Early Game (HQ 1–15): Increase VIP Points to 50% · Reduce shield budget · Rush to VIP 5
Mid Game (HQ 15–30): Standard budget · Build shield reserve · Target VIP 8 for Shirley
Late Game (HQ 30+): Increase shield budget (you're a target) · Event participation priority

LOW SPENDER BEST PURCHASES (<$20/month):
- Super Monthly Pass (~$5): VIP activation + 4th squad unlock + daily stamina = EXCELLENT value
- Growth Fund (~$5–10): Diamonds over time, best ratio for a one-time purchase
- Weekly Diamond Pack (~$5): Consistent small boost

AVOID: Random resource packs · Most hero packs (get heroes through events) · Speedup packs
`;

export function getDiamondSpendingDataSummary(): string {
  return `
=== DIAMOND SPENDING STRATEGY ===

${DIAMOND_OVERVIEW}

${DIAMOND_F2P_INCOME}

${DIAMOND_SPENDING_PRIORITY}

${DIAMOND_VIP_FULL_CHART}

${DIAMOND_VIP_ACTIVATION}

${DIAMOND_SHIELD_COSTS}

${DIAMOND_MONTHLY_BUDGET}
`;
}