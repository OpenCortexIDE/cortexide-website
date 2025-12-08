import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: Request) {
  // Read the admin HTML file
  const adminHtmlPath = join(process.cwd(), 'public', 'admin', 'index.html')
  let adminHtml = readFileSync(adminHtmlPath, 'utf-8')
  
  // Get the current origin to detect if we're on localhost
  const url = new URL(request.url)
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  
  // CSP policy that allows Decap CMS to function properly
  // 'unsafe-eval' is required for Decap CMS's dynamic code evaluation
  // This is scoped ONLY to /admin route, not the entire site
  // Note: Order matters - 'unsafe-eval' must be explicitly included for all script sources
  const cspPolicy = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://identity.netlify.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://api.github.com https://github.com https://unpkg.com https://identity.netlify.com; frame-src 'self' https://github.com; object-src 'none'; base-uri 'self'; form-action 'self';"
  
  // Inject CSP meta tag as well to ensure it's applied before scripts execute
  // This is a fallback in case HTTP header timing is an issue
  const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="${cspPolicy.replace(/"/g, '&quot;')}">`
  
  // On localhost, inject a script to clear Decap CMS localStorage cache
  // and force reload config.yml with cache-busting parameter
  // This ensures fresh config is loaded and prevents redirect to production
  if (isLocalhost) {
    const cacheBuster = Date.now()
    
    // Update the config.yml link to include a cache-busting parameter
    adminHtml = adminHtml.replace(
      'href="/admin/config.yml"',
      `href="/admin/config.yml?v=${cacheBuster}"`
    )
    
    const clearCacheScript = `
    <script>
      // Clear Decap CMS localStorage cache on localhost to ensure fresh config
      (function() {
        try {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('netlifycms') || key.startsWith('decapcms') || key.includes('cms') || key.includes('site_id')) {
              localStorage.removeItem(key);
            }
          });
          console.log('Cleared Decap CMS cache from localStorage');
        } catch (e) {
          console.warn('Could not clear localStorage:', e);
        }
      })();
    </script>`
    
    // Insert the script and CSP meta tag right after <head>
    adminHtml = adminHtml.replace('<head>', `<head>${cspMetaTag}${clearCacheScript}`)
  } else {
    // On production, still inject CSP meta tag for consistency
    adminHtml = adminHtml.replace('<head>', `<head>${cspMetaTag}`)
  }
  
  // Return the HTML with proper content type and CSP header
  // Note: We set both HTTP header AND meta tag to ensure CSP is applied
  // Meta tag ensures CSP is available before scripts execute (browser parses it first)
  const response = new NextResponse(adminHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Security-Policy': cspPolicy,
    },
  })
  
  return response
}

