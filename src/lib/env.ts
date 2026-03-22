/**
 * env.ts — Environment variable validation
 *
 * Import this at the top of any server-side route that needs env vars.
 * Throws at startup if any critical variable is missing — loud failure
 * instead of silent runtime breakage.
 *
 * Usage:
 *   import '@/lib/env'
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `[LWSB] Missing required environment variable: ${name}\n` +
      `Add it to Vercel Environment Variables and redeploy.`
    )
  }
  return value
}

// ── Server-only vars (never NEXT_PUBLIC) ──────────────────────────────────────
export const ANTHROPIC_API_KEY       = requireEnv('ANTHROPIC_API_KEY')
export const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
export const STRIPE_SECRET_KEY       = requireEnv('STRIPE_SECRET_KEY')
export const STRIPE_PRICE_PRO        = requireEnv('STRIPE_PRICE_PRO')
export const STRIPE_PRICE_ELITE      = requireEnv('STRIPE_PRICE_ELITE')
export const STRIPE_PRICE_FOUNDING   = requireEnv('STRIPE_PRICE_FOUNDING')
export const STRIPE_PRICE_ALLIANCE   = requireEnv('STRIPE_PRICE_ALLIANCE')
export const BOYD_EMAIL              = requireEnv('BOYD_EMAIL')
export const ADMIN_USER_ID           = requireEnv('ADMIN_USER_ID')

// ── Public vars (NEXT_PUBLIC — safe to expose to client) ──────────────────────
export const NEXT_PUBLIC_SUPABASE_URL        = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
export const NEXT_PUBLIC_SUPABASE_ANON_KEY   = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = requireEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
export const NEXT_PUBLIC_APP_URL             = requireEnv('NEXT_PUBLIC_APP_URL')