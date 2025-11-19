import { NextRequest, NextResponse } from 'next/server'
import { postsStore } from '@/lib/posts-store'

// GET search results with debouncing
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Query must be less than 100 characters' },
        { status: 400 }
      )
    }

    const results = postsStore.searchPosts(query)

    return NextResponse.json({ results, count: results.length })
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
