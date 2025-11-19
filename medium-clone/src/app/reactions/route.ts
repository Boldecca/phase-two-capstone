import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { socialStore } from '@/lib/social-store'

// GET reaction count and user status
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const postId = searchParams.get('postId')
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!postId) {
      return NextResponse.json({ error: 'postId required' }, { status: 400 })
    }

    const count = socialStore.getReactionCount(postId)
    let hasReacted = false

    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        hasReacted = socialStore.hasUserReacted(postId, payload.userId)
      }
    }

    return NextResponse.json({ count, hasReacted })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

// POST toggle reaction
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

    const { postId } = await request.json()
    if (!postId) {
      return NextResponse.json({ error: 'postId required' }, { status: 400 })
    }

    const hasReacted = socialStore.hasUserReacted(postId, payload.userId)

    if (hasReacted) {
      socialStore.removeReaction(postId, payload.userId)
    } else {
      socialStore.addReaction(postId, payload.userId)
    }

    const count = socialStore.getReactionCount(postId)
    return NextResponse.json({ count, hasReacted: !hasReacted })
  } catch {
    return NextResponse.json({ error: 'Failed to toggle reaction' }, { status: 500 })
  }
}
