import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join for Free',
  description:
    'Create a free Buddy account. Twenty questions a month, no credit card. Upgrade later for battle reports, the pack scanner, and war room tools.',
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
