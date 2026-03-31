import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import '@/lib/env';

// Create a server-side Supabase client directly — never use the shared
// @/lib/supabase export in API routes. That export guards against window
// being undefined and returns null on the server, breaking all auth calls.
import { buildBattleReportSystemPrompt, BATTLE_REPORT_QUOTAS } from '@/lib/lwtBattleReportData';

function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface IntakeAnswers {
  report_type: string;
  tactics_cards: string[];
}

interface ImagePayload {
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
}

interface BattleReportRequest {
  images: ImagePayload[];
  intake: IntakeAnswers;
  playerContext?: string;
}

interface SubscriptionRow {
  tier: string;
  period_start: string | null;
  period_end: string | null;
}

interface ProfileRow {
  hq_level: number | null;
  troop_type: string | null;
  troop_tier: string | null;
  squad_power: number | null;
  server_day: number | null;
  spend_style: string | null;
  hero_power: number | null;
  beginner_mode: boolean | null;
}

// ─────────────────────────────────────────────────────────────
// RESPONSE VALIDATION
// Required top-level fields that must be present for a usable result.
// Missing any of these = incomplete response, do not save, return 422.
// ─────────────────────────────────────────────────────────────
const REQUIRED_FIELDS = [
  'outcome',
  'report_type',
  'verdict',
  'root_causes',
  'coaching',
  'rematch_verdict',
  'rematch_reasoning',
  'troop_breakdown',
  'stat_comparison',
  'hero_performance',
  'formation',
  'loss_severity',
  'power_differential',
  'invisible_factors_note',
] as const;

function validateAnalysisResponse(analysis: Record<string, unknown>): string | null {
  for (const field of REQUIRED_FIELDS) {
    if (analysis[field] === undefined || analysis[field] === null) {
      return `Missing required field: ${field}`;
    }
  }
  // Validate nested objects have their key subfields
  const troop = analysis.troop_breakdown as Record<string, unknown> | null;
  if (!troop || troop.type_matchup === undefined) return 'Missing field: troop_breakdown.type_matchup';

  const stat = analysis.stat_comparison as Record<string, unknown> | null;
  if (!stat || stat.atk_status === undefined) return 'Missing field: stat_comparison.atk_status';

  const hero = analysis.hero_performance as Record<string, unknown> | null;
  if (!hero || hero.skill_damage_assessment === undefined) return 'Missing field: hero_performance.skill_damage_assessment';

  const formation = analysis.formation as Record<string, unknown> | null;
  if (!formation || formation.formation_issue === undefined) return 'Missing field: formation.formation_issue';

  const loss = analysis.loss_severity as Record<string, unknown> | null;
  if (!loss || loss.permanent_loss_warning === undefined) return 'Missing field: loss_severity.permanent_loss_warning';

  const power = analysis.power_differential as Record<string, unknown> | null;
  if (!power || power.attacker_power === undefined) return 'Missing field: power_differential.attacker_power';

  if (!Array.isArray(analysis.root_causes)) return 'Invalid field: root_causes must be an array';
  if (!Array.isArray(analysis.coaching)) return 'Invalid field: coaching must be an array';

  return null; // valid
}

// ─────────────────────────────────────────────────────────────
// TIER LIMIT HELPER
// ─────────────────────────────────────────────────────────────
function getMonthlyLimit(tier: string): number {
  switch (tier) {
    case 'pro':      return BATTLE_REPORT_QUOTAS.pro.monthly_limit;
    case 'elite':    return BATTLE_REPORT_QUOTAS.elite.monthly_limit;
    case 'alliance': return BATTLE_REPORT_QUOTAS.alliance.monthly_limit;
    case 'founding': return BATTLE_REPORT_QUOTAS.founding.monthly_limit;
    case 'free':
    default:         return BATTLE_REPORT_QUOTAS.free.monthly_limit;
  }
}

function getDisplayLimit(tier: string): string {
  const limit = getMonthlyLimit(tier);
  return limit === 0 ? '0' : `${limit}/month`;
}

// ─────────────────────────────────────────────────────────────
// BILLING PERIOD HELPERS
// ─────────────────────────────────────────────────────────────
function getCalendarMonthBounds(): { periodStart: string; periodEnd: string } {
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const periodEnd   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
  return { periodStart, periodEnd };
}

function getBillingWindow(
  sub: SubscriptionRow,
  signupDate?: string | null
): { periodStart: string; periodEnd: string; source: string } {
  // Stripe billing period — Pro and Elite after first invoice
  if (sub.period_start && sub.period_end) {
    return { periodStart: sub.period_start, periodEnd: sub.period_end, source: 'stripe' };
  }

  // Founding Member — anchor to signup date day-of-month
  if (signupDate) {
    const signup    = new Date(signupDate);
    const anchorDay = signup.getUTCDate();
    const now       = new Date();
    const nowYear   = now.getUTCFullYear();
    const nowMonth  = now.getUTCMonth();
    const nowDay    = now.getUTCDate();

    let periodStartYear  = nowYear;
    let periodStartMonth = nowMonth;

    if (nowDay < anchorDay) {
      periodStartMonth = nowMonth - 1;
      if (periodStartMonth < 0) {
        periodStartMonth = 11;
        periodStartYear  = nowYear - 1;
      }
    }

    const daysInStartMonth = new Date(Date.UTC(periodStartYear, periodStartMonth + 1, 0)).getUTCDate();
    const clampedStart     = Math.min(anchorDay, daysInStartMonth);
    const periodStart      = new Date(Date.UTC(periodStartYear, periodStartMonth, clampedStart)).toISOString();

    let periodEndYear  = periodStartYear;
    let periodEndMonth = periodStartMonth + 1;
    if (periodEndMonth > 11) { periodEndMonth = 0; periodEndYear = periodStartYear + 1; }
    const daysInEndMonth = new Date(Date.UTC(periodEndYear, periodEndMonth + 1, 0)).getUTCDate();
    const clampedEnd     = Math.min(anchorDay, daysInEndMonth);
    const periodEnd      = new Date(Date.UTC(periodEndYear, periodEndMonth, clampedEnd)).toISOString();

    return { periodStart, periodEnd, source: 'signup_anchor' };
  }

  // Fallback — calendar month
  return { ...getCalendarMonthBounds(), source: 'calendar' };
}

function formatResetDate(periodEnd: string): string {
  return new Date(periodEnd).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// ─────────────────────────────────────────────────────────────
// POST — analyze a battle report
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth ─────────────────────────────────────────────
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await getServerSupabase().auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Parse body ────────────────────────────────────────
    const body: BattleReportRequest = await req.json();
    const { images, intake, playerContext } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }
    if (images.length > 6) {
      return NextResponse.json({ error: 'Maximum 6 screenshots per analysis' }, { status: 400 });
    }
    if (!intake?.report_type) {
      return NextResponse.json({ error: 'Intake answers required' }, { status: 400 });
    }

    // Sanitize playerContext — empty string becomes undefined
    const sanitizedContext = playerContext?.trim() || undefined;

    // ── 3. Subscription tier + billing period ────────────────
    const { data: subData } = await getServerSupabase()
      .from('subscriptions')
      .select('tier, period_start, period_end')
      .eq('user_id', user.id)
      .maybeSingle() as { data: SubscriptionRow | null };

    const tier         = subData?.tier ?? 'free';
    const monthlyLimit = getMonthlyLimit(tier);

    if (monthlyLimit === 0) {
      return NextResponse.json({
        error: 'upgrade_required',
        message: 'Battle Report Analyzer is a Pro feature. Upgrade to analyze your battle reports.',
        upgrade_url: '/upgrade',
      }, { status: 403 });
    }

    // ── 4. Monthly quota check (billing period aware) ────────
    const { periodStart, periodEnd } = getBillingWindow(
      subData ?? { tier: 'free', period_start: null, period_end: null },
      user.created_at
    );

    const { count: periodCount, error: countError } = await getServerSupabase()
      .from('battle_reports')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', periodStart)
      .lt('created_at', periodEnd);

    const currentCount = periodCount ?? 0;

    if (countError) {
      console.error('Battle report count error:', countError);
      return NextResponse.json({ error: 'Failed to check quota' }, { status: 500 });
    }

    if (currentCount >= monthlyLimit) {
      const resetDate = formatResetDate(periodEnd);
      return NextResponse.json({
        error: 'quota_exceeded',
        message: `You've used all ${monthlyLimit} Battle Report analyses this billing period. Resets on ${resetDate}.`,
        current: currentCount,
        limit: monthlyLimit,
        display_limit: getDisplayLimit(tier),
        resets_on: resetDate,
        resets_at: periodEnd,
      }, { status: 429 });
    }

    // ── 5. Load player profile ───────────────────────────────
    const { data: profileData } = await getServerSupabase()
      .from('commander_profile')
      .select('hq_level, troop_type, troop_tier, squad_power, server_day, spend_style, hero_power, beginner_mode')
      .eq('id', user.id)
      .maybeSingle() as { data: ProfileRow | null };

    const playerProfile = {
      hq_level:     profileData?.hq_level     ?? undefined,
      troop_type:   profileData?.troop_type    ?? undefined,
      troop_tier:   profileData?.troop_tier    ?? undefined,
      squad_power:  profileData?.squad_power   ?? undefined,
      server_day:   profileData?.server_day    ?? undefined,
      spend_style:  profileData?.spend_style   ?? undefined,
      hero_power:   profileData?.hero_power    ?? undefined,
      beginner_mode: profileData?.beginner_mode ?? false,
    };

    // ── 6. Build system prompt ───────────────────────────────
    const systemPrompt = buildBattleReportSystemPrompt(playerProfile, intake, sanitizedContext);

    // ── 7. Build Claude Vision message content ───────────────
    type ContentBlock =
      | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
      | { type: 'text'; text: string };

    const contentBlocks: ContentBlock[] = images.map((img) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: img.mediaType,
        data: img.base64,
      },
    }));

    const tacticsCardsSummary =
      intake.tactics_cards.length > 0 ? intake.tactics_cards.join(', ') : 'None';

    contentBlocks.push({
      type: 'text' as const,
      text: `Please analyze these ${images.length} battle report screenshot(s). Player confirmed:
- Report type: ${intake.report_type}
- Tactics cards active: ${tacticsCardsSummary}${sanitizedContext ? `\n- Player context: ${sanitizedContext}` : ''}

Read ALL screenshots as a set. Determine troop types directly from the per-type damage percentages on Screen 2. Screen 1 contains the opponent's name and displayed power — extract these carefully.

Return ONLY valid JSON matching the schema in your instructions. No markdown, no preamble, no explanation outside the JSON object.`,
    });

    // ── 8. Claude API call ───────────────────────────────────
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 6000,
        system: systemPrompt,
        messages: [{ role: 'user', content: contentBlocks }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error('Claude API error:', errText);
      return NextResponse.json({ error: 'AI analysis failed. Please try again.' }, { status: 502 });
    }

    const claudeData = await claudeResponse.json();
    const rawText: string = claudeData?.content?.[0]?.text ?? '';

    if (!rawText) {
      return NextResponse.json({ error: 'Empty response from AI. Please try again.' }, { status: 502 });
    }

    // ── 9. Parse structured JSON from Claude ─────────────────
    let analysis: Record<string, unknown>;
    try {
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Claude JSON:', rawText.slice(0, 500));
      return NextResponse.json({
        error: 'Could not parse battle report analysis. Please try again with clearer screenshots.',
      }, { status: 422 });
    }

    // ── 9b. Validate response completeness ───────────────────
    // If Claude returned a partial response, reject it now before saving.
    // This protects the quota and prevents a broken result from reaching the client.
    const validationError = validateAnalysisResponse(analysis);
    if (validationError) {
      console.error('Battle report validation failed:', validationError, '| Raw:', rawText.slice(0, 500));
      return NextResponse.json({
        error: 'The AI returned an incomplete analysis. Your quota was not charged. Please try again with clearer, cropped screenshots.',
      }, { status: 422 });
    }

    // ── 10. Save report to battle_reports table ──────────────
    const outcome      = (analysis.outcome      as string) ?? 'Unknown';
    const verdict      = (analysis.verdict      as string) ?? 'Analysis complete';
    const reportType   = (analysis.report_type  as string) ?? intake.report_type;
    const opponentName = (analysis.opponent_name as string) ?? 'Unknown';
    const opponentPower = (analysis.opponent_power as string) ?? 'not visible';

    await getServerSupabase()
      .from('battle_reports')
      .insert({
        user_id: user.id,
        outcome,
        report_type: reportType,
        verdict,
        analysis,
        images_count: images.length,
        intake_data: {
          ...intake,
          opponent_name: opponentName,
          opponent_power: opponentPower,
        },
      });

    // ── 11. Return success ───────────────────────────────────
    const resetDate = formatResetDate(periodEnd);
    return NextResponse.json({
      success: true,
      analysis,
      meta: {
        images_analyzed: images.length,
        reports_used_this_period: currentCount + 1,
        reports_remaining: Math.max(0, monthlyLimit - (currentCount + 1)),
        display_limit: getDisplayLimit(tier),
        resets_on: resetDate,
        tier,
      },
    });
  } catch (error) {
    console.error('Battle report route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// GET — fetch user's recent battle reports (last 10) + quota
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await getServerSupabase().auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: reports, error } = await getServerSupabase()
      .from('battle_reports')
      .select('id, created_at, outcome, report_type, verdict, images_count, intake_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }

    const normalizedReports = (reports ?? []).map((r: {
      id: string;
      created_at: string;
      outcome: string;
      report_type: string;
      verdict: string;
      images_count: number;
      intake_data: Record<string, unknown> | null;
    }) => {
      const intakeData = (r.intake_data as Record<string, unknown>) ?? {};
      return {
        id: r.id,
        created_at: r.created_at,
        outcome: r.outcome,
        report_type: r.report_type,
        verdict: r.verdict,
        images_count: r.images_count,
        opponent_name:  (intakeData.opponent_name  as string) ?? 'Unknown',
        opponent_power: (intakeData.opponent_power as string) ?? 'not visible',
      };
    });

    // ── Quota summary ────────────────────────────────────────
    const { data: subData } = await getServerSupabase()
      .from('subscriptions')
      .select('tier, period_start, period_end')
      .eq('user_id', user.id)
      .maybeSingle() as { data: SubscriptionRow | null };

    const tier         = subData?.tier ?? 'free';
    const monthlyLimit = getMonthlyLimit(tier);

    const { periodStart, periodEnd } = getBillingWindow(
      subData ?? { tier: 'free', period_start: null, period_end: null },
      user.created_at
    );

    const { count: periodCount } = await getServerSupabase()
      .from('battle_reports')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', periodStart)
      .lt('created_at', periodEnd);

    const usedThisPeriod = periodCount ?? 0;
    const resetDate      = formatResetDate(periodEnd);

    return NextResponse.json({
      reports: normalizedReports,
      quota: {
        tier,
        used_this_period: usedThisPeriod,
        limit: monthlyLimit,
        display_limit: getDisplayLimit(tier),
        remaining: Math.max(0, monthlyLimit - usedThisPeriod),
        can_analyze: tier !== 'free' && usedThisPeriod < monthlyLimit,
        resets_on: resetDate,
        resets_at: periodEnd,
      },
    });
  } catch (error) {
    console.error('Battle report GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}