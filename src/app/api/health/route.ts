import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/health
// Returns system status for uptime monitoring and pre-launch verification.
// Checks: app reachability, Supabase connectivity, env var presence.
// Never throws — always returns 200 with a status payload.
// Uptime monitors (e.g. UptimeRobot) should alert on non-200 OR status !== 'ok'.

export async function GET() {
  const checks: Record<string, 'ok' | 'error' | 'missing'> = {}

  // ── 1. Env vars present ─────────────────────────────────────────────────────
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'ANTHROPIC_API_KEY',
  ]
  const missingEnvVars: string[] = []
  for (const v of requiredEnvVars) {
    if (!process.env[v]) missingEnvVars.push(v)
  }
  checks.env = missingEnvVars.length === 0 ? 'ok' : 'missing'

  // ── 2. Supabase reachable ───────────────────────────────────────────────────
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
    // Lightweight query — just confirm DB is reachable
    const { error } = await supabase
      .from('subscriptions')
      .select('user_id')
      .limit(1)
    checks.supabase = error ? 'error' : 'ok'
  } catch {
    checks.supabase = 'error'
  }

  // ── 3. Overall status ───────────────────────────────────────────────────────
  const allOk = Object.values(checks).every(v => v === 'ok')
  const status = allOk ? 'ok' : 'degraded'

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks,
      ...(missingEnvVars.length > 0 ? { missing_env: missingEnvVars } : {}),
    },
    { status: allOk ? 200 : 503 }
  )
}