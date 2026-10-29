import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Upgrade Complete — Last War: Survival Buddy' },
  description: 'Your Buddy upgrade is confirmed. Head back to the dashboard to use it.',
}

export default function UpgradeSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
