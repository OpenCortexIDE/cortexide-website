// next.config.mjs
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
    // Note: The blog system uses next-mdx-remote/rsc (see app/blog/CustomMDX.tsx),
    // not @next/mdx. This @next/mdx config is for other MDX usage in the app.
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    experimental: {
        swcPlugins: [
            ['glass-js/swc', {}],
        ],
    },
    async rewrites() {
        return [
            {
                source: '/admin',
                destination: '/admin',
            },
            {
                source: '/admin/',
                destination: '/admin',
            },
        ]
    },
    async headers() {
        return [
            {
                source: '/admin/config.yml',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                ],
            },
        ]
    },
}

// MDX configuration for @next/mdx (used for non-blog MDX files)
// The blog system uses next-mdx-remote/rsc directly (see app/blog/CustomMDX.tsx)
const withMDX = createMDX({
    // Add markdown plugins here, as desired
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: []
    }
})

export default withMDX(nextConfig)