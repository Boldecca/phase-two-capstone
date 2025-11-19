import { NextRequest, NextResponse } from 'next/server'


// GET author's published posts
export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    // In production, fetch author by username from database
    // For now, return empty since we need to enhance the posts store
    return NextResponse.json({ posts: [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
