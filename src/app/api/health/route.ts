import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const checks: Record<string, string> = {}
  let healthy = true

  // ── Supabase ping ──
  try {
    const { error } = await supabase
      .from('subscriptions')
      .select('user_id')
      .limit(1)

    checks.supabase = error ? `error: ${error.message}` : 'ok'
    if (error) healthy = false
  } catch (err: unknown) {
    checks.supabase = `unreachable: ${err instanceof Error ? err.message : String(err)}`
    healthy = false
  }

  // ── Env vars present ──
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ]

  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])
  checks.env = missingEnvVars.length === 0 ? 'ok' : `missing: ${missingEnvVars.join(', ')}`
  if (missingEnvVars.length > 0) healthy = false

  const status = healthy ? 200 : 503

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status }
  )
}