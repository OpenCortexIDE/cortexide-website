import { NextResponse } from 'next/server'

/**
 * OAuth proxy endpoint for Decap CMS GitHub authentication
 * Handles OAuth callbacks and redirects to admin
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  
  // Handle OAuth errors
  if (error) {
    const errorDescription = url.searchParams.get('error_description') || error
    return NextResponse.redirect(`${url.origin}/admin/?error=${encodeURIComponent(errorDescription)}`)
  }
  
  // If we have an authorization code, redirect to admin with it
  // Decap CMS PKCE will handle the token exchange client-side
  if (code) {
    const adminUrl = new URL('/admin/', url.origin)
    // Preserve the code and state for PKCE flow
    adminUrl.searchParams.set('code', code)
    if (state) {
      adminUrl.searchParams.set('state', state)
    }
    return NextResponse.redirect(adminUrl.toString())
  }
  
  // If no code, check if this is an OAuth initiation request
  // Redirect to admin to let Decap CMS handle it
  return NextResponse.redirect(`${url.origin}/admin/`)
}

