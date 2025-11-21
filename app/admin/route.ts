import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  // Read the admin HTML file
  const adminHtmlPath = join(process.cwd(), 'public', 'admin', 'index.html')
  const adminHtml = readFileSync(adminHtmlPath, 'utf-8')
  
  // Return the HTML with proper content type and CSP header
  // CSP header must allow unsafe-eval for Decap CMS to work
  return new NextResponse(adminHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com; object-src 'none'; base-uri 'self'; form-action 'self';",
    },
  })
}

