import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const tier = session.metadata?.tier
        const refCode = session.metadata?.ref_code ?? null

        if (!userId || !tier) break

        if (session.mode === 'payment') {
          // Founding Member — one-time payment, no billing period
          await upsertSubscription(userId, tier, 'active', null, session.id, null, null)
        }

        // Record affiliate conversion if ref_code present
        if (refCode) {
          await recordAffiliateConversion(userId, tier, refCode, session.id)
        }

        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription
          ?? (invoice as any).parent?.subscription_details?.subscription
        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.user_id
        const tier = subscription.metadata?.tier
        const refCode = subscription.metadata?.ref_code ?? null

        // Extract billing period — cast to any because field names vary across Stripe SDK versions
        const subAny = subscription as any
        const periodStart: string | null = subAny.current_period_start
          ? new Date(subAny.current_period_start * 1000).toISOString()
          : null
        const periodEnd: string | null = subAny.current_period_end
          ? new Date(subAny.current_period_end * 1000).toISOString()
          : null

        if (!userId) {
          const customerId = typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer as Stripe.Customer)?.id
          if (customerId) {
            const { data: profile } = await supabaseAdmin
              .from('subscriptions')
              .select('user_id')
              .eq('stripe_customer_id', customerId)
              .single()
            if (profile) {
              await upsertSubscription(
                profile.user_id, tier || 'pro', 'active',
                subscriptionId, undefined, periodStart, periodEnd
              )
            }
          }
          break
        }

        await upsertSubscription(
          userId, tier || 'pro', 'active',
          subscriptionId, undefined, periodStart, periodEnd
        )

        // Record affiliate conversion on first invoice only
        // (avoid duplicate conversions on recurring renewals)
        if (refCode) {
          const isFirstInvoice = (invoice as any).billing_reason === 'subscription_create'
          if (isFirstInvoice) {
            await recordAffiliateConversion(userId, tier || 'pro', refCode, subscriptionId)
          }
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              tier: 'free',
              status: 'cancelled',
              period_start: null,
              period_end: null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', sub.user_id)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const subUpdatedAny = subscription as any
        const periodStart: string | null = subUpdatedAny.current_period_start
          ? new Date(subUpdatedAny.current_period_start * 1000).toISOString()
          : null
        const periodEnd: string | null = subUpdatedAny.current_period_end
          ? new Date(subUpdatedAny.current_period_end * 1000).toISOString()
          : null
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              period_start: periodStart,
              period_end: periodEnd,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', sub.user_id)
        }
        break
      }

      default:
        break
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err)
  }

  return NextResponse.json({ received: true })
}

async function upsertSubscription(
  userId: string,
  tier: string,
  status: string,
  stripeSubscriptionId: string | null,
  stripeSessionId?: string,
  periodStart?: string | null,
  periodEnd?: string | null,
) {
  const payload: Record<string, unknown> = {
    user_id: userId,
    tier,
    status,
    updated_at: new Date().toISOString(),
  }
  if (stripeSubscriptionId) payload.stripe_subscription_id = stripeSubscriptionId
  if (stripeSessionId) payload.stripe_session_id = stripeSessionId
  if (periodStart !== undefined) payload.period_start = periodStart
  if (periodEnd !== undefined) payload.period_end = periodEnd

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) {
    console.error('Supabase upsert error:', error)
    throw error
  }
}

async function recordAffiliateConversion(
  referredUserId: string,
  tier: string,
  refCode: string,
  stripeRef: string
) {
  try {
    // Look up affiliate by referral_code — must be approved
    const { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id')
      .eq('referral_code', refCode)
      .eq('status', 'approved')
      .single()

    if (!affiliate) {
      console.warn(`Affiliate conversion: no approved affiliate found for ref_code ${refCode}`)
      return
    }

    // Prevent duplicate conversions for the same user
    const { data: existing } = await supabaseAdmin
      .from('affiliate_conversions')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('referred_user_id', referredUserId)
      .single()

    if (existing) {
      console.log(`Affiliate conversion: duplicate skipped for user ${referredUserId}`)
      return
    }

    const { error } = await supabaseAdmin
      .from('affiliate_conversions')
      .insert({
        affiliate_id: affiliate.id,
        referred_user_id: referredUserId,
        subscription_tier: tier,
        stripe_subscription_id: stripeRef,
      })

    if (error) {
      console.error('Affiliate conversion insert error:', error)
    } else {
      console.log(`Affiliate conversion recorded: ${refCode} → ${tier} (user ${referredUserId})`)
    }
  } catch (err) {
    // Non-fatal — never block the main webhook flow
    console.error('recordAffiliateConversion error:', err)
  }
}