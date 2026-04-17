// src/app/api/admin/feedback/route.ts
// Admin — read Buddy response feedback (thumbs up/down).
//
// GET /api/admin/feedback[?rating=up|down]
//
// Admin-only (BOYD_EMAIL). Returns up to 200 most-recent feedback rows,
// optionally filtered by rating.
//
// Build fix: this file previously initialized the Supabase client AND read
// BOYD_EMAIL at module scope using `!` non-null assertions. On Next.js
// "collect page data" at build time, the module is loaded before runtime
// env is fully available, and any missing env var with `!` throws during
// collection. Moved both reads inside the handler.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const boydEmail = process.env.BOYD_EMAIL;

    if (!supabaseUrl || !serviceKey || !boydEmail) {
      console.error('[admin/feedback] Missing required env vars');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.email !== boydEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const rating = searchParams.get('rating'); // 'up' | 'down' | null (all)

    let query = supabaseAdmin
      .from('buddy_response_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (rating === 'up' || rating === 'down') {
      query = query.eq('rating', rating);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[Admin feedback GET error]', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ feedback: data ?? [] });
  } catch (err) {
    console.error('[admin/feedback] Route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}