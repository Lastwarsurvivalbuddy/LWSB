import '@/lib/env'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BOYD_EMAIL = process.env.BOYD_EMAIL!

async function verifyAdmin(token: string): Promise<boolean> {
  const anonClient = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await anonClient.auth.getUser(token)
  if (error || !user) return false
  return user.email === BOYD_EMAIL
}

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { userId, welcomed } = await req.json()
  if (!userId || typeof welcomed !== 'boolean') {
    return NextResponse.json({ error: 'userId and welcomed required' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { error } = await supabase
    .from('profiles')
    .update({ welcomed })
    .eq('id', userId)

  if (error) {
    console.error('[welcome toggle error]', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId, welcomed })
}