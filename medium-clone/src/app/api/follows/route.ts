import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { socialStore } from '@/lib/social-store'

// GET follow status and counts
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const userId = searchParams.get('userId')
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const followersCount = socialStore.getFollowersCount(userId)
    const followingCount = socialStore.getFollowingCount(userId)
    let isFollowing = false

    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        isFollowing = socialStore.isFollowing(payload.userId, userId)
      }
    }

    return NextResponse.json({ followersCount, followingCount, isFollowing })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch follow status' }, { status: 500 })
  }
}

// POST toggle follow
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

    const { followingId } = await request.json()
    if (!followingId) {
      return NextResponse.json({ error: 'followingId required' }, { status: 400 })
    }

    const isFollowing = socialStore.isFollowing(payload.userId, followingId)

    if (isFollowing) {
      socialStore.unfollowUser(payload.userId, followingId)
    } else {
      socialStore.followUser(payload.userId, followingId)
    }

    const followersCount = socialStore.getFollowersCount(followingId)
    return NextResponse.json({ isFollowing: !isFollowing, followersCount })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}