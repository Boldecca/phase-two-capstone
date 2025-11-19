import { NextRequest, NextResponse } from 'next/server'
import { postsStore } from '@/lib/posts-store'

// GET all tags with post counts
export async function GET(request: NextRequest) {
  try {
    const allPosts = postsStore.getAllPublishedPosts()
    const tagsMap = new Map<string, number>()

    allPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1)
      })
    })

    const tags = Array.from(tagsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({ tags })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
