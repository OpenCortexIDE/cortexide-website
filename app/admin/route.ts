import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  // Read the admin HTML file
  const adminHtmlPath = join(process.cwd(), 'public', 'admin', 'index.html')
  let adminHtml = readFileSync(adminHtmlPath, 'utf-8')
  
  // Inject CSP meta tag directly into HTML as fallback
  // This ensures CSP is applied even if headers are overridden
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com; object-src 'none'; base-uri 'self'; form-action 'self';">`
  
  // Insert CSP meta tag right after <head>
  adminHtml = adminHtml.replace('<head>', `<head>${cspMeta}`)
  
  // Return the HTML with proper content type and CSP header
  // Set both header and meta tag to ensure CSP is applied
  return new NextResponse(adminHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com; object-src 'none'; base-uri 'self'; form-action 'self';",
    },
  })
}

