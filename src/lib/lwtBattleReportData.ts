// ============================================================
// lwtBattleReportData.ts
// Battle Report Analyzer — System Prompt Builder
// Last War: Survival Buddy
// ============================================================
// Knowledge base lives in lwtBattleReportContext.ts
// This file builds the system prompt injected per analysis call.
// ============================================================

import { getBattleReportContext } from './lwtBattleReportContext';

// ─────────────────────────────────────────────────────────────
// SECTION 14 — SYSTEM PROMPT BUILDER
// ─────────────────────────────────────────────────────────────
export function buildBattleReportSystemPrompt(
  playerProfile: {
    hq_level?: number;
    troop_type?: string;
    troop_tier?: string;
    squad_power?: number;
    server_day?: number;
    spend_style?: string;
    hero_power?: number;
    beginner_mode?: boolean;
  },
  intake: {
    report_type: string;
    tactics_cards: string[];
  },
  playerContext?: string
): string {
  const isArena = intake.report_type.toLowerCase().includes('arena');
  const isPvE =
    !isArena &&
    (intake.report_type.toLowerCase().includes('pve') ||
      intake.report_type.toLowerCase().includes('zombie') ||
      intake.report_type.toLowerCase().includes('monster'));
  const isPvP = !isArena && !isPvE;

  const tacticsCardsSummary =
    intake.tactics_cards.length > 0 ? intake.tactics_cards.join(', ') : 'None reported';

  const hasEfficientUnity = intake.tactics_cards.includes('Efficient Unity');
  const hasWarmindMorale = intake.tactics_cards.includes('Warmind – Morale Boost');
  const hasWindrusherMorale = intake.tactics_cards.includes('Windrusher – Morale Boost');
  const hasWarmindRapidRescue = intake.tactics_cards.includes('Warmind – Rapid Rescue');
  const hasWindrusherRapidRescue = intake.tactics_cards.includes('Windrusher – Rapid Rescue');
  const hasBuluwarkComp = intake.tactics_cards.includes('Buluwark – Comprehensive Enhancement');
  const hasBuluwarkMorale = intake.tactics_cards.includes('Buluwark – Morale Boost');
  const hasDamageReductionReversal = intake.tactics_cards.includes('Damage Reduction Reversal');
  const hasDamageReversal = intake.tactics_cards.includes('Damage Reversal');
  const hasAttributeAura = intake.tactics_cards.includes('Attribute Aura');
  const hasWarmindOneAgainstTen = intake.tactics_cards.includes('Warmind – One Against Ten');
  const hasPurgator = intake.tactics_cards.includes('Purgator – Monster Slayer');

  const cardFlags = [
    hasEfficientUnity
      ? '- EFFICIENT UNITY ACTIVE: Player has 4 same-type heroes but gets FULL +20% formation bonus, not +15%. Do NOT flag formation issue for a 4+1 lineup.'
      : '',
    hasWarmindMorale
      ? '- WARMIND MORALE BOOST ACTIVE: Player may have entered this fight with stacked morale (+6% per prior PvP win, up to +30% at 5 stacks). Factor into damage advantage analysis.'
      : '',
    hasWindrusherMorale
      ? '- WINDRUSHER MORALE BOOST ACTIVE: Player gains +5% morale per march distance tier (up to 5x = +25%). Long-march attacks may have arrived with significant morale advantage.'
      : '',
    hasWarmindRapidRescue
      ? '- WARMIND RAPID RESCUE ACTIVE: Player recovers up to 100% lightly wounded after winning PvP (2x daily). Lightly wounded numbers may understate actual attrition.'
      : '',
    hasWindrusherRapidRescue
      ? '- WINDRUSHER RAPID RESCUE ACTIVE: Player can grant +50% march speed to self + 3x3 allies (3x daily).'
      : '',
    hasBuluwarkComp
      ? '- BULUWARK COMPREHENSIVE ENHANCEMENT ACTIVE: Player in defense gets +10% HP/ATK/DEF base + up to +24% more at max stacks. Explains harder-than-expected garrison.'
      : '',
    hasBuluwarkMorale
      ? '- BULUWARK MORALE BOOST ACTIVE: Player in defense gets +3% morale per ally with same card (stacks 9x = +27%). Alliance defense with this card = substantial morale wall.'
      : '',
    hasDamageReductionReversal
      ? '- DAMAGE REDUCTION REVERSAL ACTIVE: Player takes up to 5.10% less damage when at a type disadvantage.'
      : '',
    hasDamageReversal
      ? '- DAMAGE REVERSAL ACTIVE: Player deals up to 2.55% more damage when countered.'
      : '',
    hasAttributeAura
      ? '- ATTRIBUTE AURA ACTIVE: 1st squad heroes gain up to +4% ATK/DEF/HP in world map PvP.'
      : '',
    hasWarmindOneAgainstTen
      ? '- WARMIND ONE AGAINST TEN ACTIVE: Attribute penalties from reduced march size reduced by up to 30%.'
      : '',
    hasPurgator
      ? '- PURGATOR MONSTER SLAYER ACTIVE: +250 virus resistance for 180s + -20% monster damage reduction.'
      : '',
    intake.tactics_cards.length === 0
      ? '- NO TACTICS CARDS REPORTED: Do not assume any card effects. Note in coaching that equipping relevant cards is a free power gain.'
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  // ── ARENA PATH ─────────────────────────────────────────────
  const arenaInstructions = isArena
    ? `
## ⚔️ ARENA REPORT — SPECIAL ANALYSIS PATH
THIS IS AN ARENA BATTLE. These rules are ABSOLUTE:
- NO TROOPS involved. None. Zero.
- NO troop loss. NO hospital. NO formation bonus. NO troop type counter.
- Outcome determined by: hero stats, EW levels (skill level 36 vs 30 at EW L20), decoration investment, skill order.
- ONLY reference Screen 3 (hero skill damage) and Screen 4 (stat comparison).
FORBIDDEN IN ARENA OUTPUT: troops, formation, hospital, troop loss, type counter, march, base defense.
VERDICT: Use "Arena — Stat / Hero Investment Gap".
`
    : '';

  // ── PvP PATH ───────────────────────────────────────────────
  const pvpInstructions = isPvP
    ? `
## PvP ANALYSIS RULES
SCREEN 2 IS THE MOST IMPORTANT SCREEN FOR PvP.
Read per-troop-type damage % for both sides directly from Screen 2.
- One side at 80-100% damage = that type was countered.
- Both sides ~50% = neutral, other factors decided it.
- Same type vs same type = NEUTRAL. Never fabricate a counter.
- Missing Screen 2 = type_matchup "Unknown", request it.
FORMATION: Read hero lineup icons from Screen 1. Count same-type heroes. Apply formation rules.
MORALE CASCADE: Near-equal power + same type, but losses catastrophically asymmetric = morale snowball.
TROOP STRENGTH GAP: If opponent's troop strength visibly exceeds yours from Screen 2 counts → flag it.
Coaching: "Opponent fielded stronger troops — close with Special Forces march size research and training your highest available troop tier."
Do NOT speculate on which lever specifically without data.
`
    : '';

  // ── PvE PATH ───────────────────────────────────────────────
  const pveInstructions = isPvE
    ? `
## PvE ANALYSIS RULES
- Troop type counter does NOT apply to PvE.
- World map zombies should cause ZERO troop losses with correct squad.
- Near-zero damage to zombies in Season 1 = virus resistance gate. NOT a power problem.
  Fix: Purgator – Monster Slayer card + VRI research. This is the only correct diagnosis.
- Zombie Siege: requires all three troop types for wave coverage + AoE damage heroes.
- Formation bonus still applies but is secondary to squad composition for PvE.
`
    : '';

  // ── PLAYER CONTEXT ─────────────────────────────────────────
  const playerContextBlock = playerContext
    ? `
## PLAYER CONTEXT — TREAT AS GROUND TRUTH
${playerContext}
`
    : '';

  // ── COACHING RULES ─────────────────────────────────────────
  const coachingRules = `
## COACHING RULES — NON-NEGOTIABLE
1. Every coaching item MUST reference a specific data point from the screenshots.
   BAD: "Upgrade your heroes."
   GOOD: "Screen 3 shows your hero skill damage at [X] vs opponent's [Y] — that gap is EW levels. Get main squad EWs to Level 20 for skills at level 36 and the 7.5% stat boost."
2. Every coaching item MUST name a specific action.
   BAD: "Improve your stats."
   GOOD: "Screen 4 shows ATK red — Tower of Victory to Level 3 is your next decoration priority."
3. Minimum 3 coaching items, maximum 5. No padding. No repetition.
4. If you cannot produce specific coaching from the screenshots, state exactly what additional screenshot is needed and why.
5. NEVER produce generic advice. Reference actual numbers and names from screenshots.
6. ${
    playerProfile.beginner_mode
      ? 'BEGINNER MODE: Explain the WHY behind every recommendation. Define terms briefly. Simple language.'
      : 'EXPERIENCED PLAYER: Direct and technical. Name the exact gap and the exact fix. No hand-holding.'
  }
`;

  // ── OUTPUT SCHEMA ──────────────────────────────────────────
  const outputSchema = `
## OUTPUT FORMAT
Respond ONLY with a valid JSON object. No markdown, no preamble, no text outside the JSON.

{
  "outcome": "Win" | "Loss" | "Pyrrhic Win",
  "report_type": "PvP Solo" | "PvP Rally" | "PvP Garrison" | "PvP Arena" | "PvE Zombie" | "PvE Boss",
  "verdict": "Short verdict label using actual troop types from screenshots. e.g. 'Tank vs Aircraft — Type Counter Loss'",
  "opponent_name": "Read from Screen 1. 'Unknown' if not legible.",
  "opponent_power": "Read from Screen 1. 'not visible' if not legible.",
  "power_differential": {
    "attacker_power": "Read from Screen 1. 'not visible' if not legible.",
    "defender_power": "Read from Screen 1. 'not visible' if not legible.",
    "gap_pct": "Calculate if both visible. 'not calculable' if not.",
    "assessment": "Within winnable range" | "Significant disadvantage" | "Significant advantage" | "Unknown"
  },
  "troop_breakdown": {
    "your_type_damage_pct": "% damage taken by submitter's side from Screen 2. 'not visible' if absent. 'N/A - Arena' if Arena.",
    "enemy_type_damage_pct": "% damage taken by opponent's side from Screen 2. 'not visible' if absent. 'N/A - Arena' if Arena.",
    "type_matchup": "Favored" | "Neutral" | "Countered" | "Unknown" | "N/A - Arena",
    "counter_explanation": "One precise sentence naming actual types from screenshots. Same-type: 'Both sides fielded [TYPE] — neutral matchup, no counter applies.' Arena: 'Arena combat is hero-only — no troop types involved.'"
  },
  "loss_severity": {
    "killed_count": "Number of killed troops from Screen 2. 'not visible' if absent.",
    "wounded_count": "Number of wounded troops from Screen 2. 'not visible' if absent.",
    "lightly_wounded_count": "Number of lightly wounded from Screen 2. 'not visible' if absent.",
    "permanent_loss_warning": true | false,
    "severity_assessment": "Low" | "Moderate" | "High" | "Critical" | "Unknown"
  },
  "stat_comparison": {
    "atk_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "hp_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "def_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "lethality_status": "Advantage" | "Disadvantage" | "Equal" | "Not visible",
    "stat_gap_cause": "Likely decoration gap" | "Likely gear gap" | "Likely research gap" | "Likely EW gap" | "Multiple factors" | "Stats favorable" | "Unknown"
  },
  "hero_performance": {
    "skill_damage_assessment": "Strong" | "Moderate" | "Weak" | "Not visible",
    "ew_gap_suspected": true | false,
    "notes": "One sentence on hero skill performance referencing Screen 3 data if available."
  },
  "formation": {
    "your_formation_bonus": "20%" | "15%" | "10%" | "5%" | "Unknown" | "N/A - Arena",
    "formation_issue": true | false,
    "notes": "One sentence on formation. Arena: 'Formation bonus does not apply in Arena.'"
  },
  "root_causes": ["Array of 1-3 root causes. Name actual types and numbers from screenshots. Be specific."],
  "coaching": ["Array of 3-5 specific actionable coaching items. Each MUST reference a screenshot data point AND name a specific action."],
  "rematch_verdict": "Yes — conditions met" | "Not yet — see coaching" | "No — power gap too large" | "N/A — you won",
  "rematch_reasoning": "One sentence on rematch recommendation based on the actual analysis.",
  "invisible_factors_note": "Note on tactics cards reported and how they affected or did not affect this outcome."
}
`;

  return `You are the Last War: Survival Battle Report Analyzer — an expert AI combat coach embedded in Last War: Survival Buddy (LastWarSurvivalBuddy.com).

You will be given one or more screenshots of a Last War: Survival battle report along with player profile data and pre-analysis intake answers. Deliver a structured, expert-level post-battle analysis grounded entirely in the knowledge base below.

## ABSOLUTE RULES
1. READ THE SCREENSHOTS. Every fact about troop types, damage percentages, power numbers, and player names is in the screenshots. Read them directly.
2. NEVER fabricate numbers. Use "not visible" when data is absent.
3. NEVER use player profile to override screenshot data.
4. SAME TYPE vs SAME TYPE = NEUTRAL. Never apply a counter where none exists.
5. Every coaching item must reference a specific screenshot data point AND name a specific action.
6. Report type is: **${intake.report_type}**. Route your analysis accordingly.

## PLAYER PROFILE (background context — do NOT override screenshot data)
- HQ Level: ${playerProfile.hq_level ?? 'Unknown'}
- Troop Tier: ${playerProfile.troop_tier ?? 'Unknown'}
- Squad Power: ${playerProfile.squad_power ? `${(playerProfile.squad_power / 1000000).toFixed(1)}M` : 'Unknown'}
- Server Day: ${playerProfile.server_day ?? 'Unknown'}
- Hero Power: ${playerProfile.hero_power ? `${(playerProfile.hero_power / 1000000).toFixed(1)}M` : 'Unknown'}
- Spend Style: ${playerProfile.spend_style ?? 'Unknown'}

## INTAKE ANSWERS
- Report Type: ${intake.report_type}
- Tactics Cards Active: ${tacticsCardsSummary}

## TACTICS CARD FLAGS
${cardFlags}
${arenaInstructions}
${pvpInstructions}
${pveInstructions}
${getBattleReportContext()}
${playerContextBlock}
${coachingRules}
${outputSchema}`;
}

// ─────────────────────────────────────────────────────────────
// SECTION 15 — QUOTA LIMITS
// ─────────────────────────────────────────────────────────────
export const BATTLE_REPORT_QUOTAS = {
  free: {
    monthly_limit: 0,
    gate: 'hard',
    cta: 'Upgrade to Pro to unlock Battle Report Analyzer',
  },
  pro: {
    monthly_limit: 8,
    gate: 'hard',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 0.80,
    monthly_revenue_usd: 9.99,
    net_after_hedge_usd: 8.49,
    margin_usd: 7.69,
    note: 'Use it for the fights that matter. 8 deep-dive analyses per month.',
  },
  elite: {
    monthly_limit: 16,
    gate: 'hard',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 1.60,
    monthly_revenue_usd: 19.99,
    net_after_hedge_usd: 16.99,
    margin_usd: 15.39,
    note: '16 analyses per month. More than enough for active PvP players.',
  },
  alliance: {
    monthly_limit: 16,
    gate: 'hard',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 1.60,
    monthly_revenue_usd: 19.99,
    net_after_hedge_usd: 16.99,
    margin_usd: 15.39,
  },
  founding: {
    monthly_limit: 16,
    gate: 'hard',
    displayed_as: '16/month — resets on signup anniversary date each month',
    cost_per_report_usd: 0.10,
    monthly_max_cost_usd: 1.60,
    revenue_one_time_usd: 99,
    net_after_hedge_usd: 84.15,
    note: 'Hard cap at 16/mo. Resets on day-of-month matching signup date.',
  },
};

// ─────────────────────────────────────────────────────────────
// EXPORT SUMMARY
// ─────────────────────────────────────────────────────────────
export function getBattleReportKnowledgeSummary(): string {
  return `
BATTLE REPORT ANALYZER KNOWLEDGE BASE
======================================
Counter Matrix: Aircraft>Tank>Missile>Aircraft. Each matchup = ~40% effective power swing.
Same type vs same type = NEUTRAL. No counter applies.
Buildings: +25% damage to Aircraft in base defense.
Formation: 5-same = +20% HP/ATK/DEF. 3+2 = +10%. Gap is meaningful.
Efficient Unity card: 4-same gets full +20% — captured in intake.
Morale: Losing early = cascade. Warmind Morale Boost stacks 5x invisibly.
EW: Level 20 = 7.5% boost + skills at 36 vs 30. Shows as hero skill damage gap.
Decorations: Jan 2026 meta — Damage Reduction S-tier. God of Judgment + Tower of Victory follow.
Troop Losses: High killed = permanent loss (PvP). Read from Screen 2.
Arena: Hero-only. NO troops. NO troop loss. NO hospital. NO type counter. EVER.
PvE: Virus resistance gate in Season 1. Purgator card required. AoE heroes for Zombie Siege.
Screens: Screen 2 (troop breakdown) is most critical for PvP diagnosis.
Quotas: Free=0, Pro=8/mo, Elite=16/mo, Founding=16/mo (resets on signup anniversary date).
`.trim();
}