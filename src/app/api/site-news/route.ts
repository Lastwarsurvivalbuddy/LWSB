import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID!

// ── GET — public, no auth required ──────────────────────────────
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_news')
    .select('id, created_at, badge, message, link, active')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ news: data ?? [] })
}

// ── Auth helper — Boyd only ──────────────────────────────────────
async function requireAdmin(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get('Authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user || user.id !== ADMIN_USER_ID) return null
  return user.id
}

// ── POST — create new item ───────────────────────────────────────
export async function POST(req: NextRequest) {
  const adminId = await requireAdmin(req)
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { badge, message, link, active } = body

  if (!badge || !message) {
    return NextResponse.json({ error: 'badge and message are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('site_news')
    .insert({ badge, message, link: link || null, active: active ?? true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

// ── PATCH — update (toggle active, edit text) ────────────────────
export async function PATCH(req: NextRequest) {
  const adminId = await requireAdmin(req)
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('site_news')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

// ── DELETE — hard delete ─────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const adminId = await requireAdmin(req)
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('site_news')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}