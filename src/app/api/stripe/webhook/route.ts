import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Required for raw body parsing (Stripe signature verification)
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: any

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    })
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle events
  try {
    switch (event.type) {

      // ── One-time payment (Founding Member) ──
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.user_id
        const tier = session.metadata?.tier

        if (!userId || !tier) break

        // For one-time payments, activate immediately
        if (session.mode === 'payment') {
          await upsertSubscription(userId, tier, 'active', null, session.id)
        }
        // For subscriptions, wait for invoice.paid (more reliable)
        break
      }

      // ── Subscription activated / renewed ──
      case 'invoice.paid': {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription
        if (!subscriptionId) break

        const Stripe = (await import('stripe')).default
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2024-12-18.acacia',
        })
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.user_id
        const tier = subscription.metadata?.tier

        // Fallback: look up by stripe_customer_id if metadata missing
        if (!userId) {
          const customerId = subscription.customer as string
          const { data: profile } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single()
          if (profile) {
            await upsertSubscription(
              profile.user_id,
              tier || 'pro',
              'active',
              subscriptionId
            )
          }
          break
        }

        await upsertSubscription(userId, tier || 'pro', 'active', subscriptionId)
        break
      }

      // ── Subscription cancelled / expired ──
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const subscriptionId = subscription.id

        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ tier: 'free', status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('user_id', sub.user_id)
        }
        break
      }

      // ── Subscription updated (plan change) ──
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const subscriptionId = subscription.id
        const status = subscription.status // active, past_due, cancelled

        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', sub.user_id)
        }
        break
      }

      default:
        // Unhandled event — just acknowledge
        break
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    // Still return 200 so Stripe doesn't retry
  }

  return NextResponse.json({ received: true })
}

async function upsertSubscription(
  userId: string,
  tier: string,
  status: string,
  stripeSubscriptionId: string | null,
  stripeSessionId?: string
) {
  const payload: Record<string, unknown> = {
    user_id: userId,
    tier,
    status,
    updated_at: new Date().toISOString(),
  }
  if (stripeSubscriptionId) payload.stripe_subscription_id = stripeSubscriptionId
  if (stripeSessionId) payload.stripe_session_id = stripeSessionId

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) {
    console.error('Supabase subscription upsert error:', error)
    throw error
  }
}