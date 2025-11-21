// next.config.mjs
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
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
                destination: '/admin/index.html',
            },
            {
                source: '/admin/index.html',
                destination: '/admin/index.html',
            },
            // Ensure /admin/ (with trailing slash) also works
            {
                source: '/admin/',
                destination: '/admin/index.html',
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
            {
                source: '/admin/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com;",
                    },
                ],
            },
        ]
    },
}

const withMDX = createMDX({
    // Add markdown plugins here, as desired
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: []
    }
})

export default withMDX(nextConfig)