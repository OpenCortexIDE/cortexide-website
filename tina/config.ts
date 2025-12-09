import { defineConfig } from 'tinacms'

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main'

export default defineConfig({
  branch,
  // Tina Cloud mode - requires NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  contentApiUrlOverride: '/api/tina',
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
        match: {
          include: '*.mdx',
        },
        ui: {
          filename: {
            slugify: (values) => {
              if (!values || !values.title) {
                return 'untitled'
              }
              return values.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') || 'untitled'
            },
          },
        },
        defaultItem: () => {
          return {
            title: 'New Blog Post',
            description: '',
            publishedAt: new Date().toISOString().split('T')[0],
            body: '',
          }
        },
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
            ui: {
              dateFormat: 'YYYY-MM-DD',
            },
          },
          {
            type: 'datetime',
            name: 'modifiedAt',
            label: 'Modified Date',
            required: false,
            ui: {
              dateFormat: 'YYYY-MM-DD',
            },
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
