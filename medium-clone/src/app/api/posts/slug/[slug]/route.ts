import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('slug', '==', slug)
      .where('status', '==', 'published')
      .get()
    
    if (postsSnapshot.empty) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const postDoc = postsSnapshot.docs[0]
    const post = { id: postDoc.id, ...postDoc.data() }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}