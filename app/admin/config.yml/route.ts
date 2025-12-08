import { NextResponse } from 'next/server'

/**
 * Netlify CMS Configuration Route
 * 
 * This is the canonical source of truth for Netlify CMS configuration.
 * It serves the config.yml dynamically, allowing environment variable injection
 * (e.g., GITHUB_OAUTH_CLIENT_ID) and dynamic base_url based on the request origin.
 * 
 * Note: A static file at public/admin/config.yml was removed to avoid conflicts
 * with Next.js routing. This route handler is the only source for the config.
 */
export async function GET(request: Request) {
  // Get the base URL from the request origin (works for both localhost and production)
  const url = new URL(request.url)
  const baseUrl = url.origin // e.g., http://localhost:3000 or https://opencortexide.com
  
  const configYaml = `backend:
  name: github
  repo: OpenCortexIDE/cortexide-website
  branch: main
  base_url: ${baseUrl}
  auth_type: pkce
  auth_scope: repo
  app_id: ${process.env.GITHUB_OAUTH_CLIENT_ID || 'Ov23ligYcJ3u8pu3F5qz'}
  proxy_url: ${baseUrl}/api/auth

media_folder: public/blog-images
public_folder: /blog-images

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "app/blog/[slug]/content"
    create: true
    slug: "{{slug}}"
    extension: "mdx"
    format: "yaml-frontmatter"
    frontmatter_delimiter: "---"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Publish Date", name: "publishedAt", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Modified Date", name: "modifiedAt", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false, required: false }
      - { label: "OG Image", name: "ogimage", widget: "string", required: false, hint: "Path to image, e.g., /blog-images/image.png" }
      - { label: "Body", name: "body", widget: "markdown" }
`
  
  // Disable caching for config.yml to ensure fresh config on each request
  // This is critical for development where base_url needs to match the current origin
  return new NextResponse(configYaml, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

