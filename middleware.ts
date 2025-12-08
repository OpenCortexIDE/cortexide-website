import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Apply CSP headers for admin routes (excluding /admin page which sets its own CSP)
  // The /admin route handler sets its own CSP with 'unsafe-eval' for Decap CMS
  // We only set CSP here for other admin routes like /admin/config.yml
  if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/') {
    const response = NextResponse.next()
    
    // Remove any existing CSP header first (if present)
    response.headers.delete('Content-Security-Policy')
    response.headers.delete('content-security-policy')
    
    // Set CSP header to allow unsafe-eval for Decap CMS
    // This is required for Decap CMS to function properly
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com; object-src 'none'; base-uri 'self'; form-action 'self';"
    )
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  // Match all admin routes including the page route
  matcher: [
    '/admin',
    '/admin/',
    '/admin/:path*',
  ],
}

