import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch published posts from Firebase
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get()

    const allPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const posts = allPosts.slice(startIndex, endIndex)

    const pagination = {
      page,
      limit,
      total: allPosts.length,
      pages: Math.ceil(allPosts.length / limit),
      hasMore: endIndex < allPosts.length,
    }

    return NextResponse.json({ posts, pagination })
  } catch (error) {
    console.error('Error fetching feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}