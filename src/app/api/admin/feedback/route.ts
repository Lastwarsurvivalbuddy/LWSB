import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BOYD_EMAIL = process.env.BOYD_EMAIL!;

async function verifyAdmin(token: string): Promise<boolean> {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return false;
  return user.email === BOYD_EMAIL;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  if (!(await verifyAdmin(token))) {
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
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }

  return NextResponse.json({ feedback: data ?? [] });
}