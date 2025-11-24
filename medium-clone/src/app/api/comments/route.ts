import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { socialStore } from '@/lib/social-store'

// GET comments for a post
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'postId required' }, { status: 400 })
    }

    const comments = socialStore.getCommentsByPost(postId)

    return NextResponse.json({ comments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST create comment
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

    const { postId, content, parentCommentId, authorName, authorUsername } = await request.json()

    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { error: 'postId and content are required' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Comment too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    const comment = socialStore.createComment(
      postId,
      payload.userId,
      authorName,
      authorUsername,
      content,
      parentCommentId
    )

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}