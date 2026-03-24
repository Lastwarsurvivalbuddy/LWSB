// src/app/api/admin/affiliates/route.ts
import '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BOYD_EMAIL = process.env.BOYD_EMAIL!;

async function verifyBoyd(token: string): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user?.email === BOYD_EMAIL;
}

// GET — list all affiliates (pending first, then approved, then rejected)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  if (!(await verifyBoyd(token))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('affiliates')
    .select(`
      *,
      affiliate_conversions(count)
    `)
    .order('status', { ascending: true }) // pending sorts before approved alphabetically
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ affiliates: data });
}

// PATCH — approve or reject an affiliate, set payout_rate
export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  if (!(await verifyBoyd(token))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const body = await req.json();
  const { affiliate_id, action, payout_rate, notes } = body;

  if (!affiliate_id || !action) {
    return NextResponse.json({ error: 'affiliate_id and action required.' }, { status: 400 });
  }

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'action must be approve or reject.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    status: action === 'approve' ? 'approved' : 'rejected',
    notes: notes ?? null,
  };

  if (action === 'approve') {
    updates.approved_at = new Date().toISOString();
    if (payout_rate !== undefined) {
      const rate = parseFloat(payout_rate);
      if (isNaN(rate) || rate < 0 || rate > 1) {
        return NextResponse.json({ error: 'payout_rate must be between 0 and 1 (e.g. 0.25 for 25%).' }, { status: 400 });
      }
      updates.payout_rate = rate;
    }
  } else {
    updates.rejected_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('affiliates')
    .update(updates)
    .eq('id', affiliate_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, affiliate: data });
}