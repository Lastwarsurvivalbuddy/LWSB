import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BOYD_EMAIL = process.env.BOYD_EMAIL!

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  const token = auth.slice(7)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return false
  return user.email === BOYD_EMAIL
}

// ── User-facing: submit a contact form entry ──────────────────────────────────
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { category, message, email, screenshot_base64, screenshot_name } = body

  if (!category || !message?.trim()) {
    return NextResponse.json({ error: 'category and message are required' }, { status: 400 })
  }

  const validCategories = ['bug', 'feedback', 'billing', 'other']
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 })
  }

  const { data: submission, error: dbError } = await supabaseAdmin
    .from('contact_submissions')
    .insert({
      user_id: user.id,
      email: email || user.email,
      category,
      message: message.trim(),
      screenshot_base64: screenshot_base64 || null,
      screenshot_name: screenshot_name || null,
      status: 'open',
    })
    .select('id')
    .single()

  if (dbError) {
    console.error('[contact] db insert failed:', dbError.message)
    return NextResponse.json({ error: 'Failed to submit. Try again.' }, { status: 500 })
  }

  // Email via Resend — optional, non-fatal
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      const categoryLabels: Record<string, string> = {
        bug: 'Bug Report',
        feedback: 'Feedback',
        billing: 'Billing Issue',
        other: 'Other',
      }

      const emailBody = `
New contact submission from Last War: Survival Buddy

Submission ID: ${submission.id}
Category: ${categoryLabels[category] ?? category}
From: ${email || user.email}
User ID: ${user.id}

Message:
${message.trim()}

${screenshot_base64 ? `Screenshot attached: ${screenshot_name || 'screenshot.jpg'}` : 'No screenshot attached.'}
      `.trim()

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'LWSB Contact <noreply@lastwarsurvivalbuddy.com>',
          to: [BOYD_EMAIL],
          subject: `[LWSB] ${categoryLabels[category] ?? category} — ${email || user.email}`,
          text: emailBody,
        }),
      })
    } catch (emailErr) {
      console.error('[contact] resend email failed:', emailErr)
    }
  }

  return NextResponse.json({ success: true, id: submission.id })
}

// ── Admin: list all contact submissions ──────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  let query = supabaseAdmin
    .from('contact_submissions')
    .select('id, user_id, email, category, message, screenshot_base64, screenshot_name, status, admin_notes, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ submissions: data ?? [] })
}

// ── Admin: update status and/or admin_notes on a submission ──────────────────
export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { id, status, admin_notes } = body

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const validStatuses = ['open', 'in_progress', 'resolved', 'closed']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updates: Record<string, string> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (typeof admin_notes === 'string') updates.admin_notes = admin_notes

  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select('id, status, admin_notes, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ submission: data })
}