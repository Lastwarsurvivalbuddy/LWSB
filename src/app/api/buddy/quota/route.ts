import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TIER_LIMITS: Record<string, number> = {
  free: 20,
  pro: 100,
  elite: 250,
  founding: 300,
  alliance: 250,
};

function getCurrentMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single();

    const tier = sub?.tier || 'free';
    const limit = TIER_LIMITS[tier] ?? 20;

    const monthKey = getCurrentMonthKey();
    const { data: usage } = await supabase
      .from('daily_usage')
      .select('question_count')
      .eq('user_id', user.id)
      .eq('date', monthKey)
      .single();

    const used = usage?.question_count ?? 0;

    return NextResponse.json({ used, limit, tier });
  } catch (err) {
    console.error('[Quota API error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}