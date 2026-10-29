import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Support',
  description:
    'Contact Buddy at support@lastwarsurvivalbuddy.com. Signed-in players can send a message from the contact form.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
