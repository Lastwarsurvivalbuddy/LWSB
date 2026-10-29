import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program',
  description:
    'Share Last War: Survival Buddy and earn a commission on subscriptions you refer. Apply with your in-game name, server, and how you promote.',
}

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children
}
