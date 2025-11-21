import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Decap CMS PKCE OAuth callback handler
  // This endpoint receives the OAuth callback and redirects to admin
  const url = new URL(request.url)
  
  // Redirect to admin page - Decap CMS will handle the OAuth flow client-side
  // The hash fragment with the code will be preserved in the redirect
  const adminUrl = new URL('/admin/', url.origin)
  
  // Preserve any query parameters
  url.searchParams.forEach((value, key) => {
    adminUrl.searchParams.set(key, value)
  })
  
  // Return HTML that will redirect and preserve hash
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Redirecting...</title>
  <script>
    // Preserve hash fragment and redirect
    window.location.href = '/admin/' + window.location.hash;
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}

