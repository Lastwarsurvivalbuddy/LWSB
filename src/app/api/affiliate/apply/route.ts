import '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function generateReferralCode(ign: string): string {
  const base = ign.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { name, contact_email, ign, server, promo_method } = body;

    if (!name || !contact_email || !ign || !server || !promo_method) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if email already has an application
    const { data: existing } = await supabase
      .from('affiliates')
      .select('id, status')
      .eq('contact_email', contact_email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An application already exists for this email.', status: existing.status },
        { status: 409 }
      );
    }

    // Generate unique referral code
    let referral_code = generateReferralCode(ign);
    let attempts = 0;
    while (attempts < 5) {
      const { data: collision } = await supabase
        .from('affiliates')
        .select('id')
        .eq('referral_code', referral_code)
        .single();
      if (!collision) break;
      referral_code = generateReferralCode(ign);
      attempts++;
    }

    // Try to match to an existing user account by email (optional link)
    let user_id: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) user_id = user.id;
    }

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id,           // null if not logged in — linked later on approval/signup
        referral_code,
        name,
        contact_email,
        ign,
        server,
        promo_method,
        status: 'pending',
        payout_rate: 0.15,
      })
      .select('id, status, referral_code')
      .single();

    if (error) {
      console.error('Affiliate insert error:', error);
      return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Affiliate apply error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}