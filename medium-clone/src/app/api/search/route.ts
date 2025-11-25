import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], count: 0 })
    }

    const postsSnapshot = await adminDb
      .collection('posts')
      .where('status', '==', 'published')
      .get()

    const allPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Simple search implementation - filter posts based on query
    const results = allPosts.filter((post: any) => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) ||
      post.authorName.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({ results, count: results.length })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}