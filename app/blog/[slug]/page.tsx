import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate, readPublicBlogPosts, postType } from '../utils'
import { baseUrl } from '../../sitemap'
import { Metadata } from 'next'
import { CustomMDX } from '../CustomMDX'


const ogImageUrlOfPost = (post: postType) => {
    return post.metadata.ogimage ? `${baseUrl}${post.metadata.ogimage}`
        : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}&description=${encodeURIComponent(post.metadata.description)}`
}

// metadata for this page
export function generateMetadata({ params }): Metadata {
    let post = readPublicBlogPosts().find((post) => post.slug === params.slug)
    if (!post) {
        return {}
    }

    let { title, publishedAt: publishedTime, description, } = post.metadata
    let ogImageUrl = ogImageUrlOfPost(post)

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/blog/${post.slug}`,
        },
        openGraph: {
            siteName: 'CortexIDE',
            title,
            description,
            type: 'article',
            publishedTime,
            url: `${baseUrl}/blog/${post.slug}`,
            images: [
                {
                    url: ogImageUrl,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    }
}



// read the files and pass them to BlogPost
export async function generateStaticParams() {
    let posts = readPublicBlogPosts()
    return posts.map((post) => ({ slug: post.slug, }))
}


export default function BlogPost({ params }) {
    let post = readPublicBlogPosts().find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }


    const ogImageUrl = ogImageUrlOfPost(post)

    const blogPostingJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.metadata.title,
        description: post.metadata.description,
        datePublished: post.metadata.publishedAt,
        dateModified: post.metadata.modifiedAt ?? post.metadata.publishedAt,
        image: ogImageUrl,
        url: `${baseUrl}/blog/${post.slug}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/blog/${post.slug}`,
        },
        author: {
            '@type': 'Organization',
            name: 'CortexIDE Team',
            url: baseUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'CortexIDE',
            url: baseUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/cortexide-main.png`,
            },
        },
    }

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
            { '@type': 'ListItem', position: 3, name: post.metadata.title, item: `${baseUrl}/blog/${post.slug}` },
        ],
    }

    return (
        <main className='mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-3xl w-full min-h-screen'>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
            />
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <div className="mb-8">
                <Link 
                    href="/blog"
                    className="text-gray-400 hover:text-white text-sm mb-6 inline-block transition-colors"
                >
                    ← Back to Blog
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
                    {post.metadata.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <time dateTime={post.metadata.publishedAt}>
                        {formatDate(post.metadata.publishedAt)}
                    </time>
                    {post.metadata.modifiedAt && post.metadata.modifiedAt !== post.metadata.publishedAt && (
                        <span className="text-gray-600">
                            Updated {formatDate(post.metadata.modifiedAt)}
                        </span>
                    )}
                </div>
                {post.metadata.description && (
                    <p className="text-gray-400 text-lg mt-4 leading-relaxed">
                        {post.metadata.description}
                    </p>
                )}
            </div>

            <article className='prose prose-invert prose-lg max-w-none 
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-blue-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
                prose-blockquote:text-gray-400 prose-blockquote:border-gray-700
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:text-gray-300
                prose-img:rounded-lg prose-img:border prose-img:border-gray-800
                prose-hr:border-gray-800'>
                <CustomMDX source={post.content} />
            </article>

            <nav aria-label='Post navigation' className='mt-12 pt-6 border-t border-gray-800 text-sm text-gray-400'>
                <Link href='/blog' className='hover:text-white transition-colors'>
                    ← All posts
                </Link>
                <span className='mx-3 text-gray-700'>·</span>
                <Link href='/download-beta' className='hover:text-white transition-colors'>
                    Download CortexIDE
                </Link>
            </nav>

        </main>
    )
}
