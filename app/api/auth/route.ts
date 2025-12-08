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
  
  // CORS headers for Decap CMS PKCE OAuth flow
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
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
        headers: { 
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
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
        headers: { 
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      }
    )
  }
  
  // If no code, redirect to admin
  // This handles the case when Decap CMS initiates OAuth flow
  return NextResponse.redirect(`${url.origin}/admin/`, {
    headers: corsHeaders,
  })
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

