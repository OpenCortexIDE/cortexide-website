import { NextResponse } from 'next/server'

/**
 * OAuth proxy endpoint for Decap CMS GitHub authentication
 * This handles the OAuth callback and redirects appropriately
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  
  // If there's an error, redirect to admin with error
  if (error) {
    return NextResponse.redirect(`${url.origin}/admin/?error=${encodeURIComponent(error)}`)
  }
  
  // If we have a code, redirect to admin with the OAuth parameters
  // Decap CMS will handle the token exchange client-side
  if (code) {
    const adminUrl = new URL('/admin/', url.origin)
    adminUrl.searchParams.set('code', code)
    if (state) {
      adminUrl.searchParams.set('state', state)
    }
    return NextResponse.redirect(adminUrl.toString())
  }
  
  // Default redirect to admin
  return NextResponse.redirect(`${url.origin}/admin/`)
}

