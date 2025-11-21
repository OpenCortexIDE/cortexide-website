import { NextResponse } from 'next/server'

/**
 * OAuth callback handler for Decap CMS GitHub PKCE authentication
 * GitHub redirects here with the authorization code, we redirect to /admin/ with hash fragment
 * Decap CMS PKCE expects the code in the hash fragment, not query string
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  
  // Handle OAuth errors
  if (error) {
    const errorDescription = url.searchParams.get('error_description') || error
    // Redirect to admin with error in hash
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Authentication Error</title>
  <script>
    window.location.replace('/admin/#error=${encodeURIComponent(errorDescription)}');
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
  
  // If we have an authorization code, redirect to admin with it in hash fragment
  // Decap CMS PKCE needs the code in the hash, not query string
  if (code) {
    // Build hash fragment with OAuth parameters
    const hashParams = new URLSearchParams()
    hashParams.set('code', code)
    if (state) {
      hashParams.set('state', state)
    }
    
    // Redirect to admin with code in hash fragment (PKCE requirement)
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Completing authentication...</title>
  <script>
    // PKCE requires code in hash fragment, not query string
    window.location.replace('/admin/#${hashParams.toString()}');
  </script>
</head>
<body>
  <p>Completing authentication...</p>
</body>
</html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
  
  // If no code, redirect to admin
  return NextResponse.redirect(`${url.origin}/admin/`)
}

