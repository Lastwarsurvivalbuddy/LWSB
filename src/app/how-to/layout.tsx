import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use Buddy',
  description:
    'How Buddy works: AI chat, Today\'s Orders, battle report analysis, the pack scanner, and the war room.',
}

export default function HowToLayout({ children }: { children: React.ReactNode }) {
  return children
}
