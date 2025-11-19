import { NextRequest, NextResponse } from 'next/server'
import { postsStore } from '@/lib/posts-store'

// GET author's published posts
export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    // In production, fetch author by username from database
    // For now, return empty since we need to enhance the posts store
    return NextResponse.json({ posts: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
