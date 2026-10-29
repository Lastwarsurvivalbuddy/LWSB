import type { MetadataRoute } from 'next'

const BASE = 'https://lwsb.vercel.app'

const PATHS = [
  '/',
  '/signin',
  '/signup',
  '/upgrade',
  '/guide',
  '/how-to',
  '/contact',
  '/affiliate',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: path === '/' ? `${BASE}/` : `${BASE}${path}`,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
