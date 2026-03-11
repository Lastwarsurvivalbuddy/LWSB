// src/lib/briefingPrompt.ts
// Builds the system + user prompt for the Daily Briefing Card
// Separate from buildSystemPrompt() in buddy/route.ts — leaner, faster, targeted
// Built: March 11, 2026 (session 11)

// Note: event/duel/arms race context is computed inline from profile data below
// lwtWeeklyPassData is used by the Pack Scanner — not needed in briefing prompt directly

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDuelContext(profile: Record<string, unknown>): string {
  const serverDay = Number(profile.computed_server_day ?? profile.server_day ?? 1);
  // Alliance Duel runs on a fixed weekly cycle in Last War
  // Duel week: Day mod 7. Day 1 = Monday = start of Duel week.
  // Days within duel: 1=prep, 2=VS Day1, 3=VS Day2, 4=VS Day3, 5=VS Day4(tent), 6=VS Day5(tent+Overlord), 7=rest
  const duelDayOfWeek = ((serverDay - 1) % 7) + 1;

  const duelDayLabels: Record<number, string> = {
    1: 'Day 1 — Prep Day (save VP, stack radar, no VS yet)',
    2: 'Day 2 — VS Day 1 (Arms Race double-dip opens, hit building + research + training)',
    3: 'Day 3 — VS Day 2 (maintain momentum, Arms Race Phase alignment matters)',
    4: 'Day 4 — VS Day 3 (mid-duel push, check VP gap vs opponents)',
    5: 'Day 5 — VS Day 4 (Tent War begins, coordinate alliance targets)',
    6: 'Day 6 — VS Day 5 (Tent War + TvT, remove defense lineup, DO NOT deploy Overlord in base)',
    7: 'Day 7 — Rest Day (Duel ended, recover, prep for next week)',
  };

  return `Alliance Duel: ${duelDayLabels[duelDayOfWeek] ?? 'Unknown day'}`;
}

function getArmsRaceContext(): string {
  return 'Arms Race: Active daily. Hammer it. Align your actions with the current Alliance Duel day for double-dip points where possible.';
}

function getSpendContext(spendTier: string): string {
  const map: Record<string, string> = {
    f2p: 'F2P — focus on free resources, zero-cost optimizations only',
    budget: 'Budget spender ($1–$20/mo) — selective packs, weekly passes',
    mid: 'Mid spender ($20–$100/mo) — weekly passes + targeted bundles',
    high: 'High spender ($100–$200/mo) — most bundles worth it',
    investor: 'Investor ($200+/mo) — all weekly passes always worth it',
  };
  return map[spendTier] ?? 'Unknown spend tier';
}

function getSeasonContext(season: number, serverDay: number): string {
  if (season === 0) return 'Season 0 — early game, focus HQ and basic buildings';
  if (season === 1) return 'Season 1 — S1 season mechanics active, Profession Hall available';
  if (season === 2) {
    const overlordUnlocked = serverDay >= 89;
    return `Season 2 — ${overlordUnlocked ? 'Overlord Gorilla available, deploy and train it' : 'Overlord unlocks Day 89 — prepare resources'}`;
  }
  if (season === 3) return 'Season 3 — Desert theme, Warzone Duel active, Conqueror mechanics';
  if (season === 4) return 'Season 4 (Evernight Isle) — Tactics Cards, Capitol Conquests, night mechanics';
  if (season === 5) return 'Season 5 (Wild West) — Bank Strongholds, Golden Palace, train mechanics';
  return `Season ${season}`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function buildBriefingPrompt(profile: Record<string, unknown>): Promise<{
  systemPrompt: string;
  userPrompt: string;
}> {
  const serverDay = Number(profile.computed_server_day ?? profile.server_day ?? 1);
  const hqLevel = Number(profile.hq_level ?? 1);
  const season = Number(profile.season ?? 0);
  const spendTier = String(profile.spend_tier ?? 'f2p');
  const troopType = String(profile.troop_type ?? 'unknown');
  const troopTier = String(profile.troop_tier ?? 'under_t10');
  const playstyle = String(profile.playstyle ?? 'balanced');
  const rankBucket = String(profile.rank_bucket ?? 'not_top_200');
  const squadPowerTier = String(profile.squad_power_tier ?? 'under_10m');
  const commanderTag = String(profile.commander_tag ?? 'Commander');
  const serverNumber = String(profile.server_number ?? '???');
  const allianceName = profile.alliance_name ? `[${profile.alliance_name}]` : '';
  const killTier = String(profile.kill_tier ?? 'under_500k');

  const duelContext = getDuelContext(profile);
  const armsRaceContext = getArmsRaceContext();
  const seasonContext = getSeasonContext(season, serverDay);
  const spendContext = getSpendContext(spendTier);

  const systemPrompt = `You are Last War: Survival Buddy — an elite AI coach for Last War: Survival players.
You generate a Daily Briefing Card: a focused, tactical morning summary for ONE specific player.
This is NOT a chat response. It is a formatted card delivered once per day.

RULES:
- Be specific and actionable. No filler. No generic advice.
- Calibrate everything to this player's exact profile.
- Reference the current event context (Duel day, Arms Race) — do NOT invent phase names, timers, or countdowns you don't have data for.
- Be direct and confident. Like a coach, not a FAQ.
- Format EXACTLY as shown. Use the section headers. Keep each section tight.
- Max 3 bullet points per section. Quality over quantity.
- End with exactly ONE "Watch Out" item — the single most important risk or timing note for today.

OUTPUT FORMAT (use exactly this structure):
SITUATION
[One sentence describing today's context — server day, what event is active, what matters right now]

TOP 3 MOVES
• [Most important action right now, with specific reasoning]
• [Second priority action]
• [Third priority action]

WATCH OUT
⚠ [Single most important warning, risk, or timing note for today]

Tone: direct, confident, zero fluff. Write like a veteran player who knows this person's account.`;

  const userPrompt = `Generate today's Daily Briefing Card for this commander.

COMMANDER PROFILE:
- Tag: ${commanderTag} ${allianceName}
- Server: ${serverNumber} | Server Day: ${serverDay}
- HQ Level: ${hqLevel} | Season: ${season}
- Troop Type: ${troopType} | Troop Tier: ${troopTier}
- Squad Power Tier: ${squadPowerTier}
- Rank: ${rankBucket} | Kill Tier: ${killTier}
- Playstyle: ${playstyle}
- Spend Tier: ${spendContext}

TODAY'S EVENT CONTEXT:
- ${seasonContext}
- ${duelContext}
- ${armsRaceContext}

Generate the briefing card now.`;

  return { systemPrompt, userPrompt };
}