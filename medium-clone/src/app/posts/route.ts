import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Post } from '@/lib/post-types'

// Mock posts database - replace with real database in production
export const mockPosts: Map<string, Post> = new Map()

// Add some sample posts for demo
if (mockPosts.size === 0) {
  const samplePost: Post = {
    id: 'sample-1',
    title: 'Welcome to PublishHub',
    content: '# Welcome to PublishHub\n\nThis is a sample post to demonstrate the platform. You can create, edit, and publish your own posts!',
    excerpt: 'A sample post to demonstrate the PublishHub platform features.',
    authorId: 'sample-author',
    authorName: 'Demo Author',
    authorUsername: 'demo',
    tags: ['welcome', 'demo'],
    slug: 'welcome-to-publishhub',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  }
  mockPosts.set('sample-1', samplePost)
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { title, content, excerpt, tags, status, authorName, authorUsername } = await request.json()

    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const postId = `post_${Date.now()}`
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const now = new Date().toISOString()

    const post: Post = {
      id: postId,
      title,
      content,
      excerpt,
      authorId: payload.userId,
      authorName,
      authorUsername,
      tags: tags || [],
      slug,
      status: status || 'draft',
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : undefined,
    }

    mockPosts.set(postId, post)

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}