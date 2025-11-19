import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { postsStore } from '@/lib/posts-store'

// GET all published posts or search
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const query = searchParams.get('q')
    const tags = searchParams.get('tags')?.split(',')

    let posts

    if (query) {
      posts = postsStore.searchPosts(query)
    } else if (tags?.length) {
      posts = postsStore.getPostsByTags(tags)
    } else {
      posts = postsStore.getAllPublishedPosts()
    }

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { title, content, excerpt, tags, status, authorName, authorUsername } = await request.json()

    if (!title?.trim() || !content?.trim() || !excerpt?.trim()) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      )
    }

    const post = postsStore.createPost({
      title,
      content,
      excerpt,
      tags: tags || [],
      status: status || 'draft',
      authorId: payload.userId,
      authorName,
      authorUsername,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
