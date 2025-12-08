import { NextRequest, NextResponse } from 'next/server'
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { TinaCloudBackendAuthProvider } from '@tinacms/auth'
import { join } from 'path'

// Check if we're using Tina Cloud or local mode
const isTinaCloud = !!process.env.NEXT_PUBLIC_TINA_CLIENT_ID && !!process.env.TINA_TOKEN

// Lazy load database client (only needed for local mode)
let databaseClient: any = null
let handler: any = null

async function getHandler() {
  if (handler) {
    return handler
  }

  // Load database client (required for both local and Tina Cloud modes)
  // The database client is needed for schema validation and GraphQL operations
  if (!databaseClient) {
    const requireFunc = eval('require')
    const fs = require('fs')
    const path = require('path')
    
    const possiblePaths = [
      // Try relative paths first (more reliable in serverless)
      '../../../../../tina/__generated__/databaseClient.js',
      '../../../../../tina/__generated__/databaseClient.ts',
      '../../../../../tina/__generated__/databaseClient',
      // Then try absolute paths
      path.join(process.cwd(), 'tina', '__generated__', 'databaseClient.js'),
      path.join(process.cwd(), 'tina', '__generated__', 'databaseClient.ts'),
      path.join(process.cwd(), 'tina', '__generated__', 'databaseClient'),
    ]
    
    let loaded = false
    for (const dbPath of possiblePaths) {
      try {
        if (path.isAbsolute(dbPath) && !fs.existsSync(dbPath)) {
          continue
        }
        databaseClient = requireFunc(dbPath).default
        loaded = true
        break
      } catch (err) {
        continue
      }
    }
    
    if (!loaded) {
      console.error('TinaCMS database client not found. Tried paths:', possiblePaths)
      console.error('Current working directory:', process.cwd())
      // Database client is required for both modes
      return null
    }
  }

  // Use appropriate auth provider based on mode
  const authProvider = isTinaCloud
    ? TinaCloudBackendAuthProvider()
    : LocalBackendAuthProvider()

  handler = TinaNodeBackend({
    authProvider,
    databaseClient,
  })

  return handler
}

/**
 * Check if request is authenticated
 * For Tina Cloud, authentication is handled by TinaCloudBackendAuthProvider
 * For local mode, we can optionally add additional password protection
 */
function isAuthenticated(request: NextRequest): boolean {
  // For Tina Cloud, let the auth provider handle authentication
  if (isTinaCloud) {
    return true
  }

  // For local mode, optionally check for admin password
  const adminPassword = process.env.ADMIN_PASSWORD
  
  // If no password is set, allow access (development mode)
  if (!adminPassword) {
    return true
  }

  // Check for admin_session cookie
  const sessionCookie = request.cookies.get('admin_session')
  if (!sessionCookie) {
    return false
  }

  // Verify session token is valid (simple check - in production you'd want more robust session management)
  // For now, we'll accept any session cookie if password is set
  return true
}

// Helper to convert Next.js request to Node.js format
function createNodeRequest(request: NextRequest, body?: string) {
  return {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: body,
    query: Object.fromEntries(new URL(request.url).searchParams.entries()),
  } as any
}

// Helper to create a Node.js-style response that resolves to NextResponse
function createNodeResponse(resolve: (response: NextResponse) => void) {
  let statusCode = 200
  const headers: Record<string, string> = {}
  
  return {
    status(code: number) {
      statusCode = code
      return this
    },
    json(data: any) {
      resolve(NextResponse.json(data, { status: statusCode, headers }))
      return this
    },
    send(data: any) {
      resolve(new NextResponse(data, { status: statusCode, headers }))
      return this
    },
    setHeader(name: string, value: string) {
      headers[name] = value
    },
    end() {
      resolve(new NextResponse(null, { status: statusCode, headers }))
    },
  } as any
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const h = await getHandler()
  if (!h) {
    return NextResponse.json(
      { error: 'TinaCMS backend not initialized. Database client not found.' },
      { status: 503 }
    )
  }
  
  return new Promise<NextResponse>((resolve) => {
    const req = createNodeRequest(request)
    const res = createNodeResponse(resolve)
    h(req, res)
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const h = await getHandler()
  if (!h) {
    return NextResponse.json(
      { error: 'TinaCMS backend not initialized. Database client not found.' },
      { status: 503 }
    )
  }
  
  const body = await request.text()
  
  return new Promise<NextResponse>((resolve) => {
    const req = createNodeRequest(request, body)
    const res = createNodeResponse(resolve)
    h(req, res)
  })
}
