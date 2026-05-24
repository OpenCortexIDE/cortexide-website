import type { MetadataRoute } from 'next'
import { readPublicBlogPosts } from "./blog/utils"

export const baseUrl = process.env.BASE_URL ?? ''

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split('T')[0]

  // blog posts
  const blogs: MetadataRoute.Sitemap = readPublicBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.modifiedAt ?? post.metadata.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // top-level routes with explicit priorities. Homepage and download highest;
  // blog index and post listings next; subroutes (linux build page) lower.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: today, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/download-beta`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/download-beta/linux`, lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  ]

  return [...staticRoutes, ...blogs]
}
