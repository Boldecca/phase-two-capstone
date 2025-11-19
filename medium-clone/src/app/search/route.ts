import { NextRequest, NextResponse } from 'next/server'
import { Post } from '@/lib/post-types'

// Mock posts database - replace with real database in production
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 16',
    content: 'Explore the latest features and improvements in Next.js 16...',
    excerpt: 'Explore the latest features and improvements in Next.js 16, including React Compiler support and performance enhancements.',
    authorId: '1',
    authorName: 'Sarah Chen',
    authorUsername: 'sarahchen',
    tags: ['nextjs', 'react', 'development'],
    slug: 'getting-started-nextjs',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
]

// GET search results with debouncing
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Query must be less than 100 characters' },
        { status: 400 }
      )
    }

    const results = mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      post.authorName.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({ results, count: results.length })
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
