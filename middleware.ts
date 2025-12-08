import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect /admin route (but allow /admin/index.html and API routes)
  if (pathname === '/admin' || pathname === '/admin/') {
    // Let the route handler handle authentication
    return NextResponse.next()
  }

  // TinaCMS doesn't require unsafe-eval, so we can use strict CSP
  // No special CSP handling needed for admin routes
  return NextResponse.next()
}

export const config = {
  // Match admin routes and API routes
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/tina/:path*',
  ],
}

