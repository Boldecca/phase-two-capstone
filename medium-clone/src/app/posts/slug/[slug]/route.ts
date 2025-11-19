import { NextRequest, NextResponse } from 'next/server'
import { postsStore } from '@/lib/posts-store'

// GET post by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = postsStore.getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
