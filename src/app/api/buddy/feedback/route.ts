import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse body ──
    const body = await req.json();
    const { message_id, rating, response_text } = body;

    if (!message_id || !rating) {
      return NextResponse.json({ error: 'message_id and rating required' }, { status: 400 });
    }
    if (rating !== 'up' && rating !== 'down') {
      return NextResponse.json({ error: 'rating must be up or down' }, { status: 400 });
    }

    // ── Upsert — one vote per user per message ──
    const { error: upsertError } = await supabaseAdmin
      .from('buddy_response_feedback')
      .upsert(
        {
          user_id: user.id,
          message_id,
          rating,
          response_text: response_text || null,
        },
        { onConflict: 'user_id,message_id' }
      );

    if (upsertError) {
      console.error('[Feedback upsert error]', upsertError);
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Feedback API error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}