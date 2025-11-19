import { NextRequest, NextResponse } from 'next/server'
import { Post } from '@/lib/post-types'

// Mock posts database
const mockPosts: Post[] = []

// GET post by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = mockPosts.find(p => p.slug === params.slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ post })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
