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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const posts = mockPosts.slice(startIndex, endIndex)

    const pagination = {
      page,
      limit,
      total: mockPosts.length,
      pages: Math.ceil(mockPosts.length / limit),
      hasMore: endIndex < mockPosts.length,
    }

    return NextResponse.json({ posts, pagination })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}