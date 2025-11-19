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
  {
    id: '2',
    title: 'The Future of Web Development',
    content: 'Exploring emerging trends, AI integration, and technologies...',
    excerpt: 'Exploring emerging trends, AI integration, and technologies shaping the web development landscape in 2025 and beyond.',
    authorId: '2',
    authorName: 'Alex Johnson',
    authorUsername: 'alexjohnson',
    tags: ['web-development', 'ai', 'technology'],
    slug: 'future-web-development',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Simple search implementation - in production, use proper search engine
    const results = mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      post.authorName.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}