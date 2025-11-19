import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Post } from '@/lib/post-types'

// Mock posts database - replace with real database in production
const mockPosts: Map<string, Post> = new Map()

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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}