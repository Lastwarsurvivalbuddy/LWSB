import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rookie Commander Guide',
  description:
    'A starter guide for Last War: Survival from Buddy: day-one checklist, heroes, weekly rhythm, and what to avoid.',
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
