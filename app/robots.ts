import type { MetadataRoute } from 'next'
import { baseUrl } from '@/app/sitemap'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /admin is password-protected via the route handler; /api/* is
        // internal infrastructure; /og is a dynamic OG image generator
        // referenced from page <head> only — no need to index it directly.
        disallow: ['/admin', '/api/', '/og'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl || undefined,
  }
}
