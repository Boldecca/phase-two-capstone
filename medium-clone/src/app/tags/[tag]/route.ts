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

// GET posts by tag
export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const posts = mockPosts.filter(post => 
      post.tags.includes(params.tag.toLowerCase())
    )

    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tag posts' }, { status: 500 })
  }
}
