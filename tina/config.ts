import { defineConfig } from 'tinacms'

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main'

export default defineConfig({
  branch,
  // No cloud credentials needed - using local authentication only
  // This works for open source projects without requiring secrets
  // Local auth works in both development and production
  // Don't set clientId or token - leave them undefined for local-only mode
  contentApiUrlOverride: '/api/tina/gql',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'blog-images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'app/blog/[slug]/content',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            required: true,
          },
          {
            type: 'datetime',
            name: 'publishedAt',
            label: 'Publish Date',
            required: true,
            dateFormat: 'YYYY-MM-DD',
          },
          {
            type: 'datetime',
            name: 'modifiedAt',
            label: 'Modified Date',
            required: false,
            dateFormat: 'YYYY-MM-DD',
          },
          {
            type: 'string',
            name: 'ogimage',
            label: 'OG Image',
            required: false,
            description: 'Path to image, e.g., /blog-images/image.png',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
})
