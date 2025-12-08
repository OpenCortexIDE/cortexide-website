import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Decap CMS PKCE OAuth callback handler
  // PKCE handles OAuth client-side, so we just redirect to admin
  // Decap CMS will read the OAuth parameters from the URL
  const url = new URL(request.url)
  const adminUrl = new URL('/admin/', url.origin)
  
  // Preserve all query parameters and hash
  url.searchParams.forEach((value, key) => {
    adminUrl.searchParams.set(key, value)
  })
  
  // CSP policy for admin callback - allows inline scripts for redirect
  // Note: This route doesn't need unsafe-eval, only inline scripts for the redirect
  const callbackCSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
  
  // Return HTML that redirects and preserves hash fragment
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Completing authentication...</title>
  <script>
    // Preserve hash and redirect to admin
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = '/admin/' + (hash || '') + (params.toString() ? '?' + params.toString() : '');
    window.location.replace(redirectUrl);
  </script>
</head>
<body>
  <p>Completing authentication...</p>
</body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html',
        'Content-Security-Policy': callbackCSP,
      },
    }
  )
}

