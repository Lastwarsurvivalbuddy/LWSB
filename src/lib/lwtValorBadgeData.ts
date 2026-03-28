// src/lib/lwtValorBadgeData.ts
// Valor Badge system — earning, spending, research priority
// Source: lastwarhandbook.com/guides/valor-badges-guide
// Built: March 22, 2026 (session 58)

export const VALOR_BADGE_OVERVIEW = `
VALOR BADGES — OVERVIEW:
- Special in-game currency used EXCLUSIVELY for advanced Tech Center research
- Cannot be purchased with diamonds or real money — earned through active gameplay only
- Essential for competitive progression — gates Alliance Duel chest access and T10/T11 research
- Most valuable early-game research currency after diamonds

WHAT VALOR BADGES UNLOCK:
- Alliance Duel Research — boosts VS event performance (Duel Expert: up to +100% all points)
- Special Forces Research — required path for T10 troops
- Intercity Truck Research — improves truck rewards
- Siege to Siege Research — enhances siege capabilities
- Defense Fortification Research — strengthens base defense
`;

export const VALOR_BADGE_SOURCES = `
VALOR BADGES — HOW TO EARN:

PRIMARY SOURCE — Alliance Duel VS Chests (open daily Mon–Sat):
| Chest | Badges | Points Required |
|-------|--------|----------------|
| Chest 1 | 50–100 | 40,000 |
| Chest 2 | 75–125 | 150,000 |
| Chest 3 | 100–150 | 540,000 |
| Chest 4 | 125–200 | 660,000 (requires research) |
| Chest 5 | 150–250 | 1,000,000 (requires research) |
| Chest 6 | 200–300 | 2,300,000 (requires research) |
| Chest 7 | 250–350 | 2,600,000 (requires research) |
| Chest 8 | 300–375 | 3,500,000 (requires research) |
| Chest 9 | 350–400 | 7,200,000 (requires research) |

Note: First 3 chests available by default.
Research "Premium Rewards" (3 levels) unlocks Chests 4–6.
Research "Super Bonus" (3 levels) unlocks Chests 7–9.

SECONDARY SOURCES:
- Warzone Duel victories: 200+ Valor Badges for winning alliance + milestone bonuses
- Special events (Drone Day, seasonal challenges): up to 300 badges per event
- Daily/weekly missions: 5–20 per day · 50–100 per week

ESTIMATED WEEKLY INCOME (active player):
- Alliance Duel all 9 chests: 1,500–2,500 badges
- Warzone Duel (1 win): 200+
- Daily tasks: 35–140
- Events: 100–500
- TOTAL: approximately 1,835–3,340 badges/week
`;

export const VALOR_BADGE_SPENDING = `
VALOR BADGES — SPENDING PRIORITY:

GOLDEN RULE: Spend badges on Alliance Duel research FIRST.
Better Alliance Duel performance = more chests = more badges = more research.
This is the only self-reinforcing loop in the game — do not skip it.

PRIORITY ORDER:

1. DUEL EXPERT (highest priority — do this before anything else):
   - 20 levels · each level = +5% to ALL Alliance Duel VS points
   - Level 20 = +100% bonus (doubles all VS point earnings)
   - This single research node doubles your badge income over its lifetime
   - Cost escalates: Entry (Lv 1–5) = 50–100 badges · Mid (Lv 6–15) = 500–2,000 · Advanced (Lv 16–20) = 5,000–20,000

2. PREMIUM REWARDS (3 levels) — unlocks Chests 4, 5, 6:
   - Each unlock dramatically increases badge income per week
   - Do these before pushing Duel Expert past Level 10

3. SUPER BONUS (3 levels) — unlocks Chests 7, 8, 9:
   - Elite income tier — high-spend players or well-coordinated alliances
   - Do after Duel Expert 15+ and all Premium Rewards

4. SPECIAL FORCES RESEARCH (after Alliance Duel is established):
   - Required path for T10 troops — non-negotiable for mid-to-late game
   - Begin after unlocking all chests and reaching Duel Expert Level 15–20
   - F2P split: 60% Alliance Duel · 40% Special Forces once both are active

5. INTERCITY TRUCK RESEARCH (after T10 path is clear):
   - Better truck rewards compound over time
   - Lower priority than Alliance Duel and Special Forces

6. SIEGE TO SIEGE / DEFENSE FORTIFICATION (late game):
   - After core research is complete

WEEKLY SPENDING STRATEGY (approximately 2,000 badges/week):
- Weeks 1–4: 100% Alliance Duel (Duel Expert to Lv 10 · Premium Rewards · Duel Expert to Lv 15 · Super Bonus · Duel Expert to Lv 20)
- Week 5+: 60% Alliance Duel remaining · 40% Special Forces (T10 path)
- After T10 unlock: Intercity Truck · Remaining Alliance Duel bonuses
`;

export const VALOR_BADGE_COMMON_MISTAKES = `
VALOR BADGES — COMMON MISTAKES:

❌ Hoarding badges instead of spending immediately
   → Unspent badges provide zero benefit. Every week you don't spend on Duel Expert, you miss bonus points.

❌ Jumping straight to Special Forces before Alliance Duel research
   → You miss the compounding badge income that Duel Expert provides. Alliance Duel first, always.

❌ Spending small amounts across many research areas
   → Half-completed research provides minimal benefit. Focus one branch until complete.

❌ NOT spending badges on Day 3 (Tech Research Day)
   → Spending badges on Valor Badge research on Wednesday earns VS points AND improves future performance simultaneously.

❌ Spending badges on anything other than the priority order above
   → Defense Fortification and Siege to Siege are late-game luxuries. Alliance Duel and Special Forces first.
`;

export const VALOR_BADGE_DAY3_TIP = `
VALOR BADGES — DAY 3 OPTIMIZATION (critical):

Every Wednesday (Alliance Duel Day 3 — Age of Science):
- Spending Valor Badges on Alliance Duel research SCORES VS POINTS for research activity
- AND permanently improves your future badge earning
- This means Day 3 is the ideal time to spend your accumulated badges each week
- Save a portion of weekly badges specifically for Wednesday spending

The virtuous cycle:
Spend badges on Duel Expert → earn more VS points → open more chests → earn more badges → repeat
`;

export function getValorBadgeDataSummary(): string {
  return `
=== VALOR BADGES ===

${VALOR_BADGE_OVERVIEW}

${VALOR_BADGE_SOURCES}

${VALOR_BADGE_SPENDING}

${VALOR_BADGE_DAY3_TIP}

${VALOR_BADGE_COMMON_MISTAKES}
`;
}