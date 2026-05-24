import Link from "next/link"
import { readPublicBlogPosts, formatDate } from "./utils"
import { baseUrl } from "../sitemap"

const blogDescription = 'Engineering notes, release walkthroughs, and design rationale from the team building CortexIDE.'

export const metadata = {
  title: 'Blog',
  description: blogDescription,
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    siteName: 'CortexIDE',
    title: 'CortexIDE Blog',
    description: blogDescription,
    type: 'website',
    url: `${baseUrl}/blog`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CortexIDE Blog',
    description: blogDescription,
  },
}


export default function Page() {
  let allBlogs = readPublicBlogPosts()
    .sort((a, b) => new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1)

  // TODO: Add pagination support for blog posts list
  // Consider implementing:
  // - Client-side pagination with page size (e.g., 10 posts per page)
  // - URL-based pagination (/blog?page=2) or route-based (/blog/page/2)
  // - "Load more" button for infinite scroll alternative
  // - Ensure pagination works with SSG/ISR caching strategy

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'CortexIDE Blog',
    description: blogDescription,
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'CortexIDE',
      url: baseUrl,
      logo: `${baseUrl}/cortexide-main.png`,
    },
    blogPost: allBlogs.filter(p => !p.isDevOnly).map(p => ({
      '@type': 'BlogPosting',
      headline: p.metadata.title,
      description: p.metadata.description,
      datePublished: p.metadata.publishedAt,
      url: `${baseUrl}/blog/${p.slug}`,
    })),
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className='mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 max-w-4xl w-full'>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
            CortexIDE Blog
          </h1>
          <p className="text-gray-400 text-lg">
            Engineering notes, release walkthroughs, and design rationale from the team building CortexIDE.
          </p>
        </div>

        {allBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allBlogs.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`block group ${post.isDevOnly ? 'opacity-50' : ''}`}
              >
                <article className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-gray-200 transition-colors">
                      {post.metadata.title}
                    </h2>
                    <time className="text-sm text-gray-500 whitespace-nowrap sm:ml-4">
                      {formatDate(post.metadata.publishedAt, false)}
                    </time>
                  </div>
                  {post.metadata.description && (
                    <p className="text-gray-400 text-base leading-relaxed">
                      {post.metadata.description}
                    </p>
                  )}
                  <div className="mt-4 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    Read more →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
