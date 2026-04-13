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

const FOUNDER_BONUS_QUESTIONS = 50

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

        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : (session.customer as Stripe.Customer | null)?.id ?? null

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : (session.subscription as Stripe.Subscription | null)?.id ?? null

        // ── Pro/Elite → Founding upgrade handling ─────────────────────────────
        // If buying Founding AND user has an existing active subscription,
        // cancel the existing sub at period end + apply +50 bonus questions
        // as the upgrade thank-you.
        let bonusQuestions: number | undefined = undefined

        if (tier === 'founding' && customerId) {
          try {
            const activeSubs = await stripe.subscriptions.list({
              customer: customerId,
              status: 'active',
              limit: 10,
            })

            if (activeSubs.data.length > 0) {
              // User had an active sub — this is an upgrade, apply the bonus
              bonusQuestions = FOUNDER_BONUS_QUESTIONS

              for (const oldSub of activeSubs.data) {
                if (!oldSub.cancel_at_period_end) {
                  await stripe.subscriptions.update(oldSub.id, {
                    cancel_at_period_end: true,
                  })
                  console.log(
                    `Founding upgrade: scheduled cancel-at-period-end for sub ${oldSub.id} (user ${userId})`
                  )
                }
              }
            }
          } catch (err) {
            // Non-fatal — log and continue with the upsert
            console.error('Founding upgrade cancel-existing-subs error:', err)
          }
        }

        // Upsert for ALL modes (subscription AND payment).
        // Founding = payment mode (no subscriptionId). Pro/Elite = subscription mode.
        await upsertSubscription({
          userId,
          tier,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          bonusQuestions,
        })

        // Record affiliate conversion if ref_code present
        if (refCode) {
          await recordAffiliateConversion(userId, tier, refCode, session.id)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId =
          (invoice as any).subscription ??
          (invoice as any).parent?.subscription_details?.subscription
        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        let userId = subscription.metadata?.user_id
        const tier = subscription.metadata?.tier
        const refCode = subscription.metadata?.ref_code ?? null

        const subAny = subscription as any
        const periodStart: string | null = subAny.current_period_start
          ? new Date(subAny.current_period_start * 1000).toISOString()
          : null
        const periodEnd: string | null = subAny.current_period_end
          ? new Date(subAny.current_period_end * 1000).toISOString()
          : null

        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : (subscription.customer as Stripe.Customer)?.id ?? null

        // Fallback: resolve user_id via stripe_customer_id lookup
        if (!userId && customerId) {
          const { data: existing } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single()
          if (existing) userId = existing.user_id
        }

        if (!userId) {
          console.warn('invoice.paid: could not resolve user_id, skipping')
          break
        }

        await upsertSubscription({
          userId,
          tier: tier || 'pro',
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          periodStart,
          periodEnd,
        })

        // Record affiliate conversion on first invoice only
        if (refCode) {
          const isFirstInvoice = (invoice as any).billing_reason === 'subscription_create'
          if (isFirstInvoice) {
            await recordAffiliateConversion(userId, tier || 'pro', refCode, subscriptionId)
          }
        }
        break
      }

      // Log every successful charge to the payments table
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceAny = invoice as any
        const amountUsd = (invoiceAny.amount_paid ?? 0) / 100
        if (amountUsd <= 0) break

        const subscriptionId =
          invoiceAny.subscription ??
          invoiceAny.parent?.subscription_details?.subscription

        let userId: string | null = null
        let tier: string | null = null

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          userId = subscription.metadata?.user_id ?? null
          tier = subscription.metadata?.tier ?? null

          if (!userId) {
            const customerId =
              typeof subscription.customer === 'string'
                ? subscription.customer
                : (subscription.customer as Stripe.Customer)?.id
            if (customerId) {
              const { data: profile } = await supabaseAdmin
                .from('subscriptions')
                .select('user_id, tier')
                .eq('stripe_customer_id', customerId)
                .single()
              if (profile) {
                userId = profile.user_id
                tier = tier ?? profile.tier
              }
            }
          }
        } else {
          // One-time payment (Founding) — pull user via customer
          const customerId =
            typeof invoiceAny.customer === 'string'
              ? invoiceAny.customer
              : invoiceAny.customer?.id
          if (customerId) {
            const { data: profile } = await supabaseAdmin
              .from('subscriptions')
              .select('user_id, tier')
              .eq('stripe_customer_id', customerId)
              .single()
            if (profile) {
              userId = profile.user_id
              tier = tier ?? profile.tier
            }
          }
        }

        if (!userId) {
          console.warn('invoice.payment_succeeded: could not resolve user_id, skipping payments insert')
          break
        }

        const { error } = await supabaseAdmin
          .from('payments')
          .insert({
            user_id: userId,
            stripe_payment_id: invoiceAny.id,
            amount_usd: amountUsd,
            subscription_tier: tier ?? 'unknown',
          })

        if (error) {
          console.error('payments insert error:', error)
        } else {
          console.log(`Payment recorded: user ${userId} · $${amountUsd} · tier ${tier}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Look up the existing row to check current tier — if the user is
        // already on Founding (lifetime), do NOT downgrade them when their
        // old Pro/Elite sub winds down at period end.
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id, tier')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (sub) {
          if (sub.tier === 'founding') {
            // Founding is lifetime — clear out the dead sub_id but keep the tier
            await supabaseAdmin
              .from('subscriptions')
              .update({
                stripe_subscription_id: null,
                period_start: null,
                period_end: null,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', sub.user_id)
            console.log(`Subscription ${subscription.id} cancelled — user ${sub.user_id} stays on Founding`)
          } else {
            // Standard cancellation — drop to free
            await supabaseAdmin
              .from('subscriptions')
              .update({
                tier: 'free',
                stripe_subscription_id: null,
                period_start: null,
                period_end: null,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', sub.user_id)
          }
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
          .select('user_id, tier')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (sub) {
          // Don't overwrite tier here — Stripe Customer Portal plan swaps
          // (Pro ↔ Elite) come through with new price IDs, but tier is
          // resolved via metadata on invoice.paid. Just sync billing fields.
          await supabaseAdmin
            .from('subscriptions')
            .update({
              period_start: periodStart,
              period_end: periodEnd,
              cancel_at_period_end: subscription.cancel_at_period_end ?? false,
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

async function upsertSubscription(args: {
  userId: string
  tier: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  periodStart?: string | null
  periodEnd?: string | null
  bonusQuestions?: number
}) {
  const {
    userId,
    tier,
    stripeCustomerId,
    stripeSubscriptionId,
    periodStart,
    periodEnd,
    bonusQuestions,
  } = args

  const payload: Record<string, unknown> = {
    user_id: userId,
    tier,
    updated_at: new Date().toISOString(),
  }

  if (stripeCustomerId) payload.stripe_customer_id = stripeCustomerId
  if (stripeSubscriptionId) payload.stripe_subscription_id = stripeSubscriptionId
  if (periodStart !== undefined) payload.period_start = periodStart
  if (periodEnd !== undefined) payload.period_end = periodEnd
  if (bonusQuestions !== undefined) payload.bonus_questions = bonusQuestions

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
    console.error('recordAffiliateConversion error:', err)
  }
}