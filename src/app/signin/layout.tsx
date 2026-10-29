import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to Buddy for daily action plans, battle reports, and coaching matched to your Last War: Survival profile.',
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
