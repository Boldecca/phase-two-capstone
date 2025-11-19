import { NextRequest, NextResponse } from 'next/server'
import { postsStore } from '@/lib/posts-store'

// GET posts by tag
export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const posts = postsStore.getPostsByTags([params.tag])

    if (posts.length === 0) {
      return NextResponse.json({ posts: [] })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tag posts' }, { status: 500 })
  }
}
