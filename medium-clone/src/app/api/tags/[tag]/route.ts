import { NextRequest, NextResponse } from 'next/server'
import { mockPosts } from '../../posts/route'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params
    const decodedTag = decodeURIComponent(tag.toLowerCase())
    
    const posts = Array.from(mockPosts.values())
      .filter(post => 
        post.status === 'published' && 
        post.tags.some(postTag => postTag.toLowerCase() === decodedTag)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch posts for tag' },
      { status: 500 }
    )
  }
}