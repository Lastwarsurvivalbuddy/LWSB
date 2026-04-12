import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// RATE LIMIT CONFIG — requests per minute by route and tier
//
// Why 2/min: A human reading a battle report analysis takes
// 30-60 seconds minimum. Buddy responses take 10-20 seconds
// to read. 2/min = one request every 30 seconds.
// Any script fires faster and hits the wall on request 3.
// Tier doesn't change the per-minute cap — it changes monthly
// quota. A Founding Member still can't fire 60 requests/min.
// ─────────────────────────────────────────────────────────────
const RATE_LIMITS: Record<string, Record<string, number>> = {
  '/api/battle-report': { free: 0, pro: 2, elite: 2, alliance: 2, founding: 2, anon: 1 },
  '/api/buddy':         { free: 2, pro: 2, elite: 2, alliance: 2, founding: 2, anon: 1 },
  '/api/pack-scanner':  { free: 0, pro: 2, elite: 2, alliance: 2, founding: 2, anon: 1 },
  '/api/briefing':      { free: 2, pro: 2, elite: 2, alliance: 2, founding: 2, anon: 1 },
  'default':            { free: 2, pro: 2, elite: 2, alliance: 2, founding: 2, anon: 1 },
}

// ─────────────────────────────────────────────────────────────
// ABUSE CONFIG
//
// Three-strike system:
// Strike 1 → Warning 1 (informational, no penalty)
// Strike 2 → Warning 2 (firm, final warning)
// Strike 3 → Flagged for review (temporarily restricted)
//
// Strikes are tracked via abuse_warning_count on profiles.
// ABUSE_THRESHOLD_PER_HOUR controls how many rate limit hits
// in a single hour constitute one strike.
// ─────────────────────────────────────────────────────────────
const ABUSE_THRESHOLD_PER_HOUR = parseInt(process.env.ABUSE_THRESHOLD_PER_HOUR ?? '50', 10)
const WINDOW_SECONDS = 60
const ABUSE_WINDOW_SECONDS = 3600

// ─────────────────────────────────────────────────────────────
// WARNING & RESTRICTION MESSAGES
// ─────────────────────────────────────────────────────────────
const WARNING_1_MESSAGE =
  "Commander, Buddy has a short cooldown between requests to keep the service fast and fair for everyone. " +
  "You're moving a bit faster than that limit allows. No worries — just slow down a touch and you're good. " +
  "This is a heads up, not a penalty."

const WARNING_2_MESSAGE =
  "Commander, this is your second warning. Buddy's request limit exists to prevent abuse and protect the service for all players. " +
  "One more violation and your account will be temporarily restricted. " +
  "If this is accidental, just slow down — you're still good."

const RESTRICTED_MESSAGE =
  "Commander, your account has been temporarily restricted due to repeated rate limit violations. " +
  "If this was a mistake, contact us at support@lastwarsurvivalbuddy.com and we'll get you sorted."

// ─────────────────────────────────────────────────────────────
// FOUNDER BYPASS
// Boyd's user ID — skip abuse tracking entirely for this account.
// Prevents false flags during heavy testing / development sessions.
// ─────────────────────────────────────────────────────────────
const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID ?? ''

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (!pathname.startsWith('/api/')) return NextResponse.next()

  // ── Exempt routes — bypass rate limiter entirely ──────────
  if (pathname.startsWith('/api/stripe/webhook'))  return NextResponse.next()
  if (pathname.startsWith('/api/auth'))            return NextResponse.next()
  if (pathname.startsWith('/api/pulse'))           return NextResponse.next()
  if (pathname.startsWith('/api/admin'))           return NextResponse.next()
  if (pathname.startsWith('/api/health'))          return NextResponse.next()
  if (pathname.startsWith('/api/notifications'))   return NextResponse.next()
  if (pathname.startsWith('/api/submissions'))     return NextResponse.next()
  if (pathname.startsWith('/api/buddy/quota'))     return NextResponse.next()
  if (pathname.startsWith('/api/contact'))         return NextResponse.next()
  if (pathname.startsWith('/api/site-news'))       return NextResponse.next()
  if (pathname.startsWith('/api/affiliate'))       return NextResponse.next()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // ── 1. Identify user ──────────────────────────────────────
  let userId: string | null = null
  let userTier = 'anon'

  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    try {
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        userId = user.id

        // ── 2. Ban check ──────────────────────────────────
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('tier, banned, ban_reason')
          .eq('user_id', user.id)
          .single()

        if (sub?.banned) {
          return new NextResponse(
            JSON.stringify({
              error: 'account_banned',
              message:
                'This account has been permanently banned for automated API abuse. ' +
                'No refunds are issued for ToS violations.',
              ban_reason: sub.ban_reason ?? 'Automated script detected',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          )
        }

        userTier = sub?.tier ?? 'free'

        // ── 3. Restriction check (flagged_for_review) ─────
        const { data: profileData } = await supabase
          .from('profiles')
          .select('abuse_warning_count')
          .eq('id', user.id)
          .single()

        const { data: subFlagData } = await supabase
          .from('subscriptions')
          .select('flagged_for_review')
          .eq('user_id', user.id)
          .single()

        if (subFlagData?.flagged_for_review) {
          return new NextResponse(
            JSON.stringify({
              error: 'account_restricted',
              message: RESTRICTED_MESSAGE,
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          )
        }

        ;(req as unknown as Record<string, unknown>)._abuseWarningCount =
          profileData?.abuse_warning_count ?? 0
      }
    } catch {
      // Invalid token — treat as anon
    }
  }

  const identifier =
    userId ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // ── 4. Route limit ────────────────────────────────────────
  const routeKey =
    Object.keys(RATE_LIMITS).find(k => k !== 'default' && pathname.startsWith(k)) ?? 'default'
  const limit = RATE_LIMITS[routeKey][userTier] ?? RATE_LIMITS[routeKey]['anon'] ?? 1

  // ── 5. Per-minute counter ─────────────────────────────────
  const windowStart = Math.floor(Date.now() / (WINDOW_SECONDS * 1000))
  const rateLimitKey = `${identifier}:${routeKey}:${windowStart}`
  const windowExpiry = new Date((windowStart + 1) * WINDOW_SECONDS * 1000).toISOString()

  let currentCount = 1
  try {
    const { error: insertErr } = await supabase
      .from('rate_limits')
      .insert({ key: rateLimitKey, count: 1, expires_at: windowExpiry })

    if (insertErr) {
      const { data: row } = await supabase
        .from('rate_limits')
        .select('count')
        .eq('key', rateLimitKey)
        .single()

      currentCount = (row?.count ?? 0) + 1

      await supabase
        .from('rate_limits')
        .update({ count: currentCount })
        .eq('key', rateLimitKey)
    }
  } catch {
    // DB failure — allow through
    return NextResponse.next()
  }

  // ── 6. Rate limit exceeded ────────────────────────────────
  if (currentCount > limit) {
    const isFounder = FOUNDER_USER_ID && userId === FOUNDER_USER_ID

    if (userId && !isFounder) {
      try {
        const abuseWindowStart = Math.floor(Date.now() / (ABUSE_WINDOW_SECONDS * 1000))
        const abuseKey = `abuse:${userId}:${abuseWindowStart}`
        const abuseExpiry = new Date(
          (abuseWindowStart + 1) * ABUSE_WINDOW_SECONDS * 1000
        ).toISOString()

        let abuseCount = 1
        const { error: abuseInsertErr } = await supabase
          .from('rate_limits')
          .insert({ key: abuseKey, count: 1, expires_at: abuseExpiry })

        if (abuseInsertErr) {
          const { data: abuseRow } = await supabase
            .from('rate_limits')
            .select('count')
            .eq('key', abuseKey)
            .single()

          abuseCount = (abuseRow?.count ?? 0) + 1
          await supabase
            .from('rate_limits')
            .update({ count: abuseCount })
            .eq('key', abuseKey)
        }

        if (abuseCount >= ABUSE_THRESHOLD_PER_HOUR) {
          const { data: profileRow } = await supabase
            .from('profiles')
            .select('abuse_warning_count')
            .eq('id', userId)
            .single()

          const warningCount = profileRow?.abuse_warning_count ?? 0

          if (warningCount === 0) {
            await supabase
              .from('profiles')
              .update({
                abuse_warning_count: 1,
                abuse_warning_issued: true,
                abuse_warning_issued_at: new Date().toISOString(),
              })
              .eq('id', userId)

            await supabase.from('notifications').insert({ user_id: userId, message: WARNING_1_MESSAGE })

            return new NextResponse(
              JSON.stringify({ error: 'rate_limit_warning', warning: 1, message: WARNING_1_MESSAGE, retry_after: WINDOW_SECONDS }),
              { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(WINDOW_SECONDS) } }
            )
          } else if (warningCount === 1) {
            await supabase.from('profiles').update({ abuse_warning_count: 2 }).eq('id', userId)
            await supabase.from('notifications').insert({ user_id: userId, message: WARNING_2_MESSAGE })

            return new NextResponse(
              JSON.stringify({ error: 'rate_limit_warning', warning: 2, message: WARNING_2_MESSAGE, retry_after: WINDOW_SECONDS }),
              { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(WINDOW_SECONDS) } }
            )
          } else {
            await supabase.from('profiles').update({ abuse_warning_count: 3 }).eq('id', userId)
            await supabase
              .from('subscriptions')
              .update({
                flagged_for_review: true,
                flag_reason: `Rate limit threshold hit 3 times. abuse_warning_count = 3. Review before taking action.`,
                flagged_at: new Date().toISOString(),
              })
              .eq('user_id', userId)
              .eq('banned', false)
            await supabase.from('notifications').insert({ user_id: userId, message: RESTRICTED_MESSAGE })

            return new NextResponse(
              JSON.stringify({ error: 'account_restricted', message: RESTRICTED_MESSAGE }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
          }
        }
      } catch {
        // Abuse tracking failure is non-fatal
      }
    }

    return new NextResponse(
      JSON.stringify({
        error: 'rate_limit_exceeded',
        message: "Buddy needs a moment — you're moving faster than he can respond. Wait 60 seconds and try again.",
        retry_after: WINDOW_SECONDS,
        limit,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(WINDOW_SECONDS),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String((windowStart + 1) * WINDOW_SECONDS),
        },
      }
    )
  }

  // ── 7. Allow — attach headers ─────────────────────────────
  const remaining = Math.max(0, limit - currentCount)
  const res = NextResponse.next()
  res.headers.set('X-RateLimit-Limit', String(limit))
  res.headers.set('X-RateLimit-Remaining', String(remaining))
  res.headers.set('X-RateLimit-Reset', String((windowStart + 1) * WINDOW_SECONDS))
  return res
}

export const config = {
  matcher: '/api/:path*',
}