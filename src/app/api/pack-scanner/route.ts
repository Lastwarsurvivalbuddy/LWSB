// src/app/api/pack-scanner/route.ts
// Pack Scanner endpoint — Pro / Elite / Founding / Alliance only
// Free users are blocked. No caching — every scan is live.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildPackScannerPrompt } from '@/lib/packScannerPrompt';

const ALLOWED_TIERS = ['pro', 'elite', 'founding', 'alliance'];

const TIER_LIMITS: Record<string, { questions: number; screenshots: number }> = {
  free:     { questions: 20,  screenshots: 0  },
  pro:      { questions: 100, screenshots: 10 },
  elite:    { questions: 250, screenshots: 20 },
  founding: { questions: 300, screenshots: 25 },
  alliance: { questions: 250, screenshots: 20 },
};

// Monthly usage key — matches buddy route exactly.
// daily_usage.usage_date is a `date` type: requires full YYYY-MM-DD,
// anchored to the 1st of the month for one row per user per month.
function getCurrentMonthKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

export async function POST(req: NextRequest) {
  try {
    // --- Auth ---
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Subscription check — Free users blocked ---
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier, bonus_questions')
      .eq('user_id', user.id)
      .single();

    const tier = sub?.tier ?? 'free';
    if (!ALLOWED_TIERS.includes(tier.toLowerCase())) {
      return NextResponse.json(
        { error: 'upgrade_required', message: 'Pack Scanner is available on Pro, Elite, Founding, and Alliance plans.' },
        { status: 403 }
      );
    }

    // --- Parse body ---
    const body = await req.json();
    const { screenshot_base64, screenshot_media_type, playerContext } = body;

    if (!screenshot_base64) {
      return NextResponse.json({ error: 'No screenshot provided' }, { status: 400 });
    }

    const mediaType = screenshot_media_type ?? 'image/jpeg';
    const sanitizedContext = typeof playerContext === 'string' ? playerContext.trim() || undefined : undefined;

    // --- Load commander profile ---
    const { data: profile } = await supabase
      .from('commander_profile')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // --- Monthly quota check (matches buddy route) ---
    const bonusQuestions = sub?.bonus_questions ?? 0;
    const baseLimits = TIER_LIMITS[tier.toLowerCase()] ?? TIER_LIMITS.free;
    const limits = {
      questions:   baseLimits.questions + bonusQuestions,
      screenshots: baseLimits.screenshots,
    };

    const monthKey = getCurrentMonthKey();
    const { data: usage } = await supabase
      .from('daily_usage')
      .select('question_count, screenshot_count')
      .eq('user_id', user.id)
      .eq('usage_date', monthKey)
      .single();

    const currentQuestions   = usage?.question_count   ?? 0;
    const currentScreenshots = usage?.screenshot_count ?? 0;

    if (currentQuestions >= limits.questions) {
      return NextResponse.json(
        {
          error: 'monthly_limit_reached',
          message: `You've used all ${limits.questions} questions for this month. Resets on the 1st.`,
        },
        { status: 429 }
      );
    }
    if (currentScreenshots >= limits.screenshots) {
      return NextResponse.json(
        {
          error: 'screenshot_limit_reached',
          message: `You've used all ${limits.screenshots} screenshot analyses for this month. Resets on the 1st.`,
        },
        { status: 429 }
      );
    }

    // --- Build system prompt ---
    const systemPrompt = buildPackScannerPrompt(
      {
        commander_tag:     profile.commander_tag ?? 'Commander',
        spend_style:       profile.spend_style,
        hq_level:          profile.hq_level,
        season:            profile.season,
        troop_tier:        profile.troop_tier,
        troop_type:        profile.troop_type,
        server_day:        profile.server_day,
        subscription_tier: tier,
      },
      sanitizedContext
    );

    // --- Call Claude API ---
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: screenshot_base64,
                },
              },
              {
                type: 'text',
                text: 'Analyze this pack screenshot and return your verdict.',
              },
            ],
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const err = await claudeResponse.text();
      console.error('Claude API error:', err);
      return NextResponse.json({ error: 'AI error' }, { status: 500 });
    }

    const claudeData = await claudeResponse.json();
    const rawText = claudeData.content?.[0]?.text ?? '';

    // --- Parse verdict ---
    const verdictMatch = rawText.match(/VERDICT:\s*(BUY|SKIP|MAYBE|UNKNOWN)/i);
    const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : 'UNKNOWN';

    // --- Update monthly usage (matches buddy route upsert pattern) ---
    await supabase
      .from('daily_usage')
      .upsert(
        {
          user_id:          user.id,
          usage_date:       monthKey,
          question_count:   currentQuestions   + 1,
          screenshot_count: currentScreenshots + 1,
        },
        { onConflict: 'user_id,usage_date' }
      );

    return NextResponse.json({
      verdict,
      analysis: rawText,
      questions_remaining: limits.questions - currentQuestions - 1,
    });
  } catch (err) {
    console.error('Pack scanner error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
