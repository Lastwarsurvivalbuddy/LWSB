// src/app/api/pack-scanner/route.ts
// Pack Scanner endpoint — Pro / Elite / Founding / Alliance only
// Free users are blocked. No caching — every scan is live.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildPackScannerPrompt } from '@/lib/packScannerPrompt';

const ALLOWED_TIERS = ['pro', 'elite', 'founding', 'alliance'];

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
      .select('tier')
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
    const { screenshot_base64, screenshot_media_type } = body;

    if (!screenshot_base64) {
      return NextResponse.json({ error: 'No screenshot provided' }, { status: 400 });
    }

    const mediaType = screenshot_media_type ?? 'image/jpeg';

    // --- Load commander profile ---
    const { data: profile } = await supabase
      .from('commander_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // --- Daily usage check (shared quota with Buddy) ---
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('daily_usage')
      .select('question_count, screenshot_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    const questionLimits: Record<string, number> = {
      free: 0,
      pro: 30,
      elite: 100,
      founding: 20,
      alliance: 100,
    };
    const screenshotLimits: Record<string, number> = {
      free: 0,
      pro: 10,
      elite: 20,
      founding: 5,
      alliance: 20,
    };

    const currentQuestions = usage?.question_count ?? 0;
    const currentScreenshots = usage?.screenshot_count ?? 0;
    const questionLimit = questionLimits[tier.toLowerCase()] ?? 0;
    const screenshotLimit = screenshotLimits[tier.toLowerCase()] ?? 0;

    if (currentQuestions >= questionLimit) {
      return NextResponse.json(
        { error: 'daily_limit_reached', message: 'Daily question limit reached. Resets at midnight UTC.' },
        { status: 429 }
      );
    }
    if (currentScreenshots >= screenshotLimit) {
      return NextResponse.json(
        { error: 'screenshot_limit_reached', message: 'Daily screenshot limit reached.' },
        { status: 429 }
      );
    }

    // --- Build system prompt ---
    const systemPrompt = buildPackScannerPrompt({
      commander_tag: profile.commander_tag ?? 'Commander',
      spend_style: profile.spend_style,
      spend_tier: profile.spend_tier,
      hq_level: profile.hq_level,
      season: profile.season,
      troop_tier: profile.troop_tier,
      troop_type: profile.troop_type,
      server_day: profile.computed_server_day,
      subscription_tier: tier,
    });

    // --- Call Claude API ---
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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

    // --- Update daily usage ---
    if (usage) {
      await supabase
        .from('daily_usage')
        .update({
          question_count: currentQuestions + 1,
          screenshot_count: currentScreenshots + 1,
        })
        .eq('user_id', user.id)
        .eq('date', today);
    } else {
      await supabase
        .from('daily_usage')
        .insert({
          user_id: user.id,
          date: today,
          question_count: 1,
          screenshot_count: 1,
        });
    }

    return NextResponse.json({
      verdict,
      analysis: rawText,
      questions_remaining: questionLimit - currentQuestions - 1,
    });

  } catch (err) {
    console.error('Pack scanner error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}