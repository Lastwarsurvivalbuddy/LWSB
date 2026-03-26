import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import '@/lib/env';
import { buildBattleReportSystemPrompt, BATTLE_REPORT_QUOTAS } from '@/lib/lwtBattleReportData';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface IntakeAnswers {
  report_type: string;
  squad_type: string;
  tactics_cards: string[];
}

interface ImagePayload {
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
}

interface BattleReportRequest {
  images: ImagePayload[];
  intake: IntakeAnswers;
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

// Returns the start/end of the current calendar month in UTC.
// Used as fallback when no Stripe billing period is available
// (Founding Members, pre-webhook legacy rows).
function getCalendarMonthBounds(): { periodStart: string; periodEnd: string } {
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
  return { periodStart, periodEnd };
}

// Returns the billing window to count reports against.
// Priority order:
//   1. Stripe period_start/period_end — set on every invoice.paid for Pro/Elite
//   2. Signup-date anchor — used for Founding Members (one-time payment, no Stripe period)
//      e.g. signed up April 12 → window is the 12th of each month to the 12th of next month
//   3. Calendar month fallback — safety net for legacy rows with no data
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
    const signup = new Date(signupDate);
    const anchorDay = signup.getUTCDate(); // e.g. 12 for April 12
    const now = new Date();
    const nowYear = now.getUTCFullYear();
    const nowMonth = now.getUTCMonth();
    const nowDay = now.getUTCDate();

    // If we're on or after the anchor day this month, period started this month
    // If we're before the anchor day, period started last month
    let periodStartYear = nowYear;
    let periodStartMonth = nowMonth;
    if (nowDay < anchorDay) {
      // Before anchor day — current period started last month
      periodStartMonth = nowMonth - 1;
      if (periodStartMonth < 0) {
        periodStartMonth = 11;
        periodStartYear = nowYear - 1;
      }
    }

    // Clamp anchor day to valid days in the start month (e.g. Feb 30 → Feb 28)
    const daysInStartMonth = new Date(Date.UTC(periodStartYear, periodStartMonth + 1, 0)).getUTCDate();
    const clampedStart = Math.min(anchorDay, daysInStartMonth);
    const periodStart = new Date(Date.UTC(periodStartYear, periodStartMonth, clampedStart)).toISOString();

    // Period end = same anchor day next month
    let periodEndYear = periodStartYear;
    let periodEndMonth = periodStartMonth + 1;
    if (periodEndMonth > 11) {
      periodEndMonth = 0;
      periodEndYear = periodStartYear + 1;
    }
    const daysInEndMonth = new Date(Date.UTC(periodEndYear, periodEndMonth + 1, 0)).getUTCDate();
    const clampedEnd = Math.min(anchorDay, daysInEndMonth);
    const periodEnd = new Date(Date.UTC(periodEndYear, periodEndMonth, clampedEnd)).toISOString();

    return { periodStart, periodEnd, source: 'signup_anchor' };
  }

  // Fallback — calendar month
  return { ...getCalendarMonthBounds(), source: 'calendar' };
}

// Human-readable reset date for error messages
function formatResetDate(periodEnd: string): string {
  return new Date(periodEnd).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

// ─────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth ──────────────────────────────────────────────
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Parse body ─────────────────────────────────────────
    const body: BattleReportRequest = await req.json();
    const { images, intake } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }
    if (images.length > 6) {
      return NextResponse.json({ error: 'Maximum 6 screenshots per analysis' }, { status: 400 });
    }
    if (!intake?.squad_type || !intake?.report_type) {
      return NextResponse.json({ error: 'Intake answers required' }, { status: 400 });
    }

    // ── 3. Subscription tier + billing period ─────────────────
    // NOTE: .maybeSingle() instead of .single() — returns null (not error) when no row exists.
    // A user with no subscription row is treated as free tier.
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('tier, period_start, period_end')
      .eq('user_id', user.id)
      .maybeSingle() as { data: SubscriptionRow | null };

    const tier = subData?.tier ?? 'free';
    const monthlyLimit = getMonthlyLimit(tier);

    if (monthlyLimit === 0) {
      return NextResponse.json({
        error: 'upgrade_required',
        message: 'Battle Report Analyzer is a Pro feature. Upgrade to analyze your battle reports.',
        upgrade_url: '/upgrade',
      }, { status: 403 });
    }

    // ── 4. Monthly quota check (billing period aware) ─────────
    const { periodStart, periodEnd } = getBillingWindow(
      subData ?? { tier: 'free', period_start: null, period_end: null },
      user.created_at
    );

    // Count reports submitted within the current billing period
    const { count: periodCount, error: countError } = await supabase
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

    // ── 5. Load player profile ────────────────────────────────
    const { data: profileData } = await supabase
      .from('commander_profile')
      .select('hq_level, troop_type, troop_tier, squad_power, server_day, spend_style, hero_power, beginner_mode')
      .eq('id', user.id)
      .maybeSingle() as { data: ProfileRow | null };

    const playerProfile = {
      hq_level:      profileData?.hq_level      ?? undefined,
      troop_type:    profileData?.troop_type     ?? undefined,
      troop_tier:    profileData?.troop_tier     ?? undefined,
      squad_power:   profileData?.squad_power    ?? undefined,
      server_day:    profileData?.server_day     ?? undefined,
      spend_style:   profileData?.spend_style    ?? undefined,
      hero_power:    profileData?.hero_power     ?? undefined,
      beginner_mode: profileData?.beginner_mode  ?? false,
    };

    // ── 6. Build system prompt ────────────────────────────────
    const systemPrompt = buildBattleReportSystemPrompt(playerProfile, intake);

    // ── 7. Build Claude Vision message content ────────────────
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
      text: `Please analyze these ${images.length} battle report screenshot(s).

Player confirmed:
- Report type: ${intake.report_type}
- Their squad type: ${intake.squad_type}
- Tactics cards active: ${tacticsCardsSummary}

Read ALL screenshots as a set. Screen 1 (Outcome + Power Summary) contains the opponent's name and displayed power — extract these carefully.

Return ONLY valid JSON matching the schema in your instructions. No markdown, no preamble, no explanation outside the JSON object.`,
    });

    // ── 8. Claude API call ────────────────────────────────────
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
        max_tokens: 2000,
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

    // ── 9. Parse structured JSON from Claude ──────────────────
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

    // ── 10. Save report to battle_reports table ───────────────
    const outcome       = (analysis.outcome       as string) ?? 'Unknown';
    const verdict       = (analysis.verdict       as string) ?? 'Analysis complete';
    const reportType    = (analysis.report_type   as string) ?? intake.report_type;
    const opponentName  = (analysis.opponent_name  as string) ?? 'Unknown';
    const opponentPower = (analysis.opponent_power as string) ?? 'not visible';

    await supabase
      .from('battle_reports')
      .insert({
        user_id:     user.id,
        outcome,
        report_type: reportType,
        verdict,
        analysis,
        images_count: images.length,
        intake_data: {
          ...intake,
          opponent_name:  opponentName,
          opponent_power: opponentPower,
        },
      });

    // ── 11. Return success ────────────────────────────────────
    const resetDate = formatResetDate(periodEnd);
    return NextResponse.json({
      success: true,
      analysis,
      meta: {
        images_analyzed:           images.length,
        reports_used_this_period:  currentCount + 1,
        reports_remaining:         Math.max(0, monthlyLimit - (currentCount + 1)),
        display_limit:             getDisplayLimit(tier),
        resets_on:                 resetDate,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: reports, error } = await supabase
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
        id:             r.id,
        created_at:     r.created_at,
        outcome:        r.outcome,
        report_type:    r.report_type,
        verdict:        r.verdict,
        images_count:   r.images_count,
        opponent_name:  (intakeData.opponent_name  as string) ?? 'Unknown',
        opponent_power: (intakeData.opponent_power as string) ?? 'not visible',
      };
    });

    // ── Quota summary ─────────────────────────────────────────
    // NOTE: .maybeSingle() — returns null (not error) when no subscription row exists.
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('tier, period_start, period_end')
      .eq('user_id', user.id)
      .maybeSingle() as { data: SubscriptionRow | null };

    const tier = subData?.tier ?? 'free';
    const monthlyLimit = getMonthlyLimit(tier);
    const { periodStart, periodEnd } = getBillingWindow(
      subData ?? { tier: 'free', period_start: null, period_end: null },
      user.created_at
    );

    const { count: periodCount } = await supabase
      .from('battle_reports')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', periodStart)
      .lt('created_at', periodEnd);

    const usedThisPeriod = periodCount ?? 0;
    const resetDate = formatResetDate(periodEnd);

    return NextResponse.json({
      reports: normalizedReports,
      quota: {
        tier,
        used_this_period: usedThisPeriod,
        limit:            monthlyLimit,
        display_limit:    getDisplayLimit(tier),
        remaining:        Math.max(0, monthlyLimit - usedThisPeriod),
        can_analyze:      tier !== 'free' && usedThisPeriod < monthlyLimit,
        resets_on:        resetDate,
        resets_at:        periodEnd,
      },
    });
  } catch (error) {
    console.error('Battle report GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}