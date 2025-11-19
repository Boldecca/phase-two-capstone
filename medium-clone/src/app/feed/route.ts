import { NextRequest, NextResponse } from 'next/server'
import { postsStore } from '@/lib/posts-store'

// GET paginated feed
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('limit') || '10')

    if (page < 1 || pageSize < 1 || pageSize > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const allPosts = postsStore.getAllPublishedPosts()
    const totalCount = allPosts.length
    const start = (page - 1) * pageSize
    const posts = allPosts.slice(start, start + pageSize)

    return NextResponse.json({
      posts,
      pagination: {
        current: page,
        pageSize,
        total: totalCount,
        pages: Math.ceil(totalCount / pageSize),
        hasMore: start + pageSize < totalCount,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}
