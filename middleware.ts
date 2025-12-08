import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // CSP policy for Decap CMS - allows unsafe-eval which Decap CMS requires
  // This is scoped ONLY to admin routes, not the entire site
  // Note: Decap CMS requires 'unsafe-eval' for its dynamic code evaluation functionality
  const adminCSP = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com; object-src 'none'; base-uri 'self'; form-action 'self';"
  
  // Apply CSP headers for admin routes (excluding /admin which is handled by route handler)
  // The /admin route handler creates a new NextResponse, so it sets its own CSP
  // We set CSP here for other admin routes like /admin/config.yml, /admin/callback, etc.
  if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/admin/') {
    const response = NextResponse.next()
    
    // Remove any existing CSP header first (if present)
    response.headers.delete('Content-Security-Policy')
    response.headers.delete('content-security-policy')
    
    // Set CSP header to allow unsafe-eval for Decap CMS
    // This is required for Decap CMS's dynamic code evaluation
    response.headers.set('Content-Security-Policy', adminCSP)
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  // Match all admin routes including exact /admin and /admin/
  matcher: [
    '/admin',
    '/admin/:path*',
  ],
}

