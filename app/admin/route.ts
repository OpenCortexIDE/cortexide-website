import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  // Read the admin HTML file
  const adminHtmlPath = join(process.cwd(), 'public', 'admin', 'index.html')
  const adminHtml = readFileSync(adminHtmlPath, 'utf-8')
  
  // Return the HTML with proper content type
  // Middleware will add CSP headers
  return new NextResponse(adminHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}

