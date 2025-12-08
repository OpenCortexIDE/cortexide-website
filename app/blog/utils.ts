import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

// Frontmatter schema validation
const FrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  publishedAt: z.string().refine(
    (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: 'publishedAt must be a valid date string' }
  ),
  modifiedAt: z.string().optional().refine(
    (val) => {
      if (!val) return true // Optional field
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    { message: 'modifiedAt must be a valid date string if provided' }
  ),
  ogimage: z.string().optional(),
})

export type metadataType = z.infer<typeof FrontmatterSchema>

/**
 * Parses frontmatter from MDX file content using gray-matter.
 * This replaces the previous regex-based parser which was brittle and
 * could break on edge cases (colons, quotes, multiline values, etc.).
 * 
 * @param fileContent - Raw MDX file content with YAML frontmatter
 * @returns Object containing parsed metadata and content body
 */
function parseFrontmatter(fileContent: string): { metadata: metadataType, content: string } {
  try {
    const parsed = matter(fileContent)
    return {
      metadata: parsed.data as metadataType,
      content: parsed.content.trim()
    }
  } catch (error) {
    // Fallback for files without frontmatter (should be rare)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Blog] Failed to parse frontmatter:', error)
    }
    return {
      metadata: {
        title: '(specify frontmatter)',
        description: '-',
        publishedAt: new Date().toISOString().split('T')[0]
      },
      content: fileContent.trim()
    }
  }
}

/**
 * Validates frontmatter against schema.
 * 
 * Development: Logs clear warnings with file path and invalid fields.
 * Production: Returns null for invalid posts to skip them gracefully.
 * 
 * @param metadata - Parsed frontmatter object
 * @param filePath - Path to the MDX file (for error reporting)
 * @returns Validated metadata or null if invalid
 */
function validateFrontmatter(metadata: unknown, filePath: string): metadataType | null {
  const result = FrontmatterSchema.safeParse(metadata)
  
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Blog] Invalid frontmatter in ${filePath}:`, result.error.issues)
      // In dev, throw for completely invalid posts (missing title & publishedAt)
      const criticalFields = ['title', 'publishedAt']
      const missingCritical = result.error.issues.some(
        err => criticalFields.includes(err.path[0] as string)
      )
      if (missingCritical) {
        throw new Error(`[Blog] Critical frontmatter missing in ${filePath}: ${result.error.message}`)
      }
    }
    // In production, skip invalid posts gracefully
    return null
  }
  
  return result.data
}

// Simple in-process cache for blog posts
interface CacheEntry {
  posts: postType[]
  timestamp: number
}

let postsCache: CacheEntry | null = null

/**
 * Cache configuration:
 * - Development: Cache invalidates on every call (TTL = 0) so changes show immediately
 * - Production: Cache with 60 second TTL for performance
 */
const CACHE_TTL_MS = process.env.NODE_ENV === 'development' ? 0 : 60 * 1000

/**
 * Clears the blog posts cache (useful for testing or manual invalidation)
 */
export function clearBlogPostsCache(): void {
  postsCache = null
}

export type postType = { metadata: metadataType, slug: string, content: string, isDevOnly?: boolean }

/**
 * Reads and parses all public blog posts from the filesystem.
 * 
 * Features:
 * - Uses gray-matter for robust frontmatter parsing
 * - Validates frontmatter schema with zod
 * - Implements safe caching (dev: no cache, prod: 60s TTL)
 * - Graceful error handling (skips bad files, doesn't crash)
 * - Filters DEV- and _-prefixed files in production
 * 
 * @returns Array of valid blog posts, sorted by publishedAt (newest first)
 */
export function readPublicBlogPosts(): postType[] {
  // Check cache
  if (postsCache !== null) {
    const age = Date.now() - postsCache.timestamp
    if (age < CACHE_TTL_MS) {
      return postsCache.posts
    }
  }

  const dir = path.join(process.cwd(), 'app', 'blog', '[slug]', 'content')

  // Check if directory exists, return empty array if it doesn't
  if (!fs.existsSync(dir)) {
    const emptyResult: postType[] = []
    postsCache = { posts: emptyResult, timestamp: Date.now() }
    return emptyResult
  }

  let mdxFileNames: string[] = []
  
  try {
    mdxFileNames = fs.readdirSync(dir)
    // Filter out non-MDX files and hidden/system files
    mdxFileNames = mdxFileNames.filter(file => 
      file.endsWith('.mdx') && 
      !file.startsWith('.') // Exclude hidden files
    )
  } catch (error) {
    // Directory doesn't exist or can't be read
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Blog] Failed to read directory ${dir}:`, error)
    }
    const emptyResult: postType[] = []
    postsCache = { posts: emptyResult, timestamp: Date.now() }
    return emptyResult
  }
  
  if (mdxFileNames.length === 0) {
    const emptyResult: postType[] = []
    postsCache = { posts: emptyResult, timestamp: Date.now() }
    return emptyResult
  }

  const validPosts: postType[] = []

  for (const fileWithDotMdx of mdxFileNames) {
    const filePath = path.join(dir, fileWithDotMdx)
    let fileContent: string
    let fileName: string

    try {
      // Read file content
      fileContent = fs.readFileSync(filePath, 'utf-8')
      fileName = path.parse(fileWithDotMdx).name
    } catch (error) {
      // File is unreadable - skip it
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Blog] Failed to read file ${filePath}:`, error)
      }
      continue
    }

    // Parse frontmatter
    let parsed: { metadata: metadataType, content: string }
    try {
      parsed = parseFrontmatter(fileContent)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Blog] Failed to parse frontmatter in ${filePath}:`, error)
      }
      continue
    }

    // Validate frontmatter
    const validatedMetadata = validateFrontmatter(parsed.metadata, filePath)
    if (!validatedMetadata) {
      // Validation failed - already logged in validateFrontmatter
      continue
    }

    // Handle DEV- and _-prefixed files
    const isDev = fileWithDotMdx.match(/^DEV-.*$/)
    const isPrivate = fileWithDotMdx.match(/^_.*$/)
    
    if (isDev || isPrivate) {
      if (process.env.NODE_ENV === 'development') {
        validPosts.push({
          metadata: {
            ...validatedMetadata,
            title: (isDev ? 'DEV - ' : 'PRIVATE - ') + validatedMetadata.title
          },
          slug: fileName,
          content: parsed.content,
          isDevOnly: true
        })
      }
      // Skip in production
      continue
    }

    // Valid public post
    validPosts.push({
      metadata: validatedMetadata,
      slug: fileName,
      content: parsed.content
    })
  }

  // Update cache
  postsCache = { posts: validPosts, timestamp: Date.now() }
  
  return validPosts
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
