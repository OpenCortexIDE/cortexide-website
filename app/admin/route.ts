import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Protected admin route for TinaCMS
 * Requires ADMIN_PASSWORD environment variable to be set
 * Access via: /admin?password=YOUR_PASSWORD
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const password = url.searchParams.get('password')
  const adminPassword = process.env.ADMIN_PASSWORD
  
  // Check for existing session cookie
  const cookies = request.headers.get('cookie') || ''
  const hasSession = cookies.includes('admin_session=')

  // If no password is set, allow access (for development)
  if (!adminPassword) {
    // Serve the TinaCMS admin interface
    const adminPath = join(process.cwd(), 'public', 'admin', 'index.html')
    try {
      const adminHtml = readFileSync(adminPath, 'utf-8')
      return new NextResponse(adminHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    } catch (e) {
      // Better error message for debugging
      const errorMsg = e instanceof Error ? e.message : String(e)
      console.error('Failed to load admin interface:', errorMsg)
      console.error('Admin path:', adminPath)
      console.error('Current working directory:', process.cwd())
      return new NextResponse(`Admin interface not found. Path: ${adminPath}, Error: ${errorMsg}`, {
        status: 404,
      })
    }
  }

  // If user has valid session cookie, allow access
  if (hasSession) {
    const adminPath = join(process.cwd(), 'public', 'admin', 'index.html')
    try {
      const adminHtml = readFileSync(adminPath, 'utf-8')
      return new NextResponse(adminHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      console.error('Failed to load admin interface:', errorMsg)
      console.error('Admin path:', adminPath)
      return new NextResponse(`Admin interface not found. Path: ${adminPath}, Error: ${errorMsg}`, {
        status: 404,
      })
    }
  }

  // Check password from query param (for initial login via URL)
  if (password && password === adminPassword) {
    // Password correct via URL - set cookie and serve admin
    const adminPath = join(process.cwd(), 'public', 'admin', 'index.html')
    try {
      const adminHtml = readFileSync(adminPath, 'utf-8')
      const crypto = require('crypto')
      const sessionToken = crypto
        .createHash('sha256')
        .update(adminPassword + Date.now().toString())
        .digest('hex')
      
      const response = new NextResponse(adminHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
      })
      return response
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      console.error('Failed to load admin interface:', errorMsg)
      console.error('Admin path:', adminPath)
      return new NextResponse(`Admin interface not found. Path: ${adminPath}, Error: ${errorMsg}`, {
        status: 404,
      })
    }
  }

  // No valid session and no correct password - show login form
  const errorMsg = url.searchParams.get('error') ? '<p class="error">Incorrect password. Please try again.</p>' : ''
  
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Admin Access Required</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0a0a;
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    input {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid #333;
      border-radius: 0.5rem;
      background: #1a1a1a;
      color: #fff;
      margin: 1rem 0;
      width: 300px;
    }
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      background: #0066ff;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      margin-left: 0.5rem;
    }
    button:hover {
      background: #0052cc;
    }
    .error {
      color: #ff4444;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Admin Access Required</h1>
    <p>Please enter the admin password to continue.</p>
    <form method="POST" action="/admin">
      <input type="password" name="password" placeholder="Enter password" autofocus required />
      <button type="submit">Access Admin</button>
    </form>
    ${errorMsg}
  </div>
</body>
</html>`,
    {
      status: 401,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  )
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    // No password set - redirect to GET
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (password !== adminPassword) {
    // Wrong password - show error
    return NextResponse.redirect(new URL('/admin?error=1', request.url))
  }

  // Password correct - set auth cookie and redirect
  const crypto = require('crypto')
  const sessionToken = crypto
    .createHash('sha256')
    .update(adminPassword + Date.now().toString())
    .digest('hex')

  const response = NextResponse.redirect(new URL('/admin', request.url))
  response.cookies.set('admin_session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400, // 24 hours
    path: '/',
  })
  
  return response
}
