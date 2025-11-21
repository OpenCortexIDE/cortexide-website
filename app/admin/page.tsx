import { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'

export const metadata: Metadata = {
  title: 'Content Manager',
}

export default function AdminPage() {
  // Read the admin HTML file
  const adminHtmlPath = join(process.cwd(), 'public', 'admin', 'index.html')
  const adminHtml = readFileSync(adminHtmlPath, 'utf-8')
  
  // Return the HTML with proper headers set via middleware
  return (
    <div dangerouslySetInnerHTML={{ __html: adminHtml }} />
  )
}

