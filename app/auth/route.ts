import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Decap CMS handles OAuth callback client-side
  // Redirect back to admin page with the OAuth parameters
  const url = new URL(request.url)
  const searchParams = url.searchParams
  
  // Preserve OAuth parameters and redirect to admin
  const adminUrl = new URL('/admin/', url.origin)
  searchParams.forEach((value, key) => {
    adminUrl.searchParams.set(key, value)
  })
  
  return NextResponse.redirect(adminUrl.toString())
}

