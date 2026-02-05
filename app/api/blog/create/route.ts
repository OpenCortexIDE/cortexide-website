import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, description, publishedAt, content } = body

    if (!slug || !title || !description || !publishedAt || !content) {
      const missing: string[] = []
      if (!slug) missing.push('slug')
      if (!title) missing.push('title')
      if (!description) missing.push('description')
      if (!publishedAt) missing.push('publishedAt')
      if (!content) missing.push('content')
      return NextResponse.json(
        { error: 'Missing required fields', missing },
        { status: 400 }
      )
    }

    // TODO: persist blog post (e.g. to Tina, filesystem, or DB)
    return NextResponse.json({ success: true, slug }, { status: 201 })
  } catch (error) {
    console.error('Blog create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
