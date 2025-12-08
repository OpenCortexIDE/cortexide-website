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
    // Removed admin rewrite - now handled by route handler for password protection
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Ignore TinaCMS generated files during webpack analysis
            // They will be available at runtime after tinacms build runs
            config.resolve = config.resolve || {}
            config.resolve.fallback = config.resolve.fallback || {}
            // Don't try to resolve these at build time
            config.resolve.alias = config.resolve.alias || {}
        }
        return config
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