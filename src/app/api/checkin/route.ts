import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Load current streak data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('streak_current, streak_last_checkin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD UTC
    const lastCheckin = profile.streak_last_checkin;
    const currentStreak = profile.streak_current ?? 0;

    // Already checked in today — return current streak, no update needed
    if (lastCheckin === today) {
      return NextResponse.json({ streak: currentStreak, alreadyCheckedIn: true });
    }

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Increment if last checkin was yesterday, otherwise reset to 1
    const newStreak = lastCheckin === yesterdayStr ? currentStreak + 1 : 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        streak_current: newStreak,
        streak_last_checkin: today,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ streak: newStreak, alreadyCheckedIn: false });

  } catch (err) {
    console.error('[Checkin API error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}