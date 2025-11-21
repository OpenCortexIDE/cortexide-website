import { NextResponse } from 'next/server'

const configYaml = `backend:
  name: github
  repo: OpenCortexIDE/cortexide-website
  branch: main
  base_url: https://opencortexide.com
  auth_type: pkce
  auth_scope: repo

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
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Publish Date", name: "publishedAt", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Modified Date", name: "modifiedAt", widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false, required: false }
      - { label: "OG Image", name: "ogimage", widget: "string", required: false, hint: "Path to image, e.g., /blog-images/image.png" }
      - { label: "Body", name: "body", widget: "markdown" }
`

export async function GET() {
  return new NextResponse(configYaml, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
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

