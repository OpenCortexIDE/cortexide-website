import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Apply CSP headers for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    
    // Set CSP header to allow unsafe-eval for Decap CMS
    response.headers.set(
      'Content-Security-Policy',
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com;"
    )
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

