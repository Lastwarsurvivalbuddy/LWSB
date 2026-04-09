import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser(token)

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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Write to DB — always, regardless of email success
  const { data: submission, error: dbError } = await supabase
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
          to: ['support@lastwarsurvivalbuddy.com'],
          subject: `[LWSB] ${categoryLabels[category] ?? category} — ${email || user.email}`,
          text: emailBody,
        }),
      })
    } catch (emailErr) {
      // Non-fatal — DB write succeeded, just log
      console.error('[contact] resend email failed:', emailErr)
    }
  }

  return NextResponse.json({ success: true, id: submission.id })
}