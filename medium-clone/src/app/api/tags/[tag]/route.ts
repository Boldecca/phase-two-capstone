import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params
    const decodedTag = decodeURIComponent(tag.toLowerCase())
    
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('status', '==', 'published')
      .where('tags', 'array-contains', decodedTag)
      .orderBy('publishedAt', 'desc')
      .get()
    
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts for tag:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts for tag' },
      { status: 500 }
    )
  }
}