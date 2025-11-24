import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Post } from '@/lib/post-types'
import { adminDb } from '@/lib/firebase-admin'



export async function GET() {
  try {
    console.log('=== GET /api/posts called ===')
    const postsSnapshot = await adminDb.collection('posts').orderBy('createdAt', 'desc').get()
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(`Found ${posts.length} posts`)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/posts called')
    const authHeader = request.headers.get('authorization')
    console.log('Auth header:', authHeader ? 'present' : 'missing')
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No valid auth header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { title, content, excerpt, tags, status, authorName, authorUsername, coverImage } = body

    if (!title || !content || !excerpt) {
      console.log('Missing required fields:', { title: !!title, content: !!content, excerpt: !!excerpt })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const postId = `post_${Date.now()}`
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const now = new Date().toISOString()

    const post: Post = {
      id: postId,
      title,
      content,
      excerpt,
      authorId: payload.userId,
      authorName,
      authorUsername,
      tags: tags || [],
      slug,
      status: status || 'draft',
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : undefined,
      coverImage: coverImage || undefined,
    }

    await adminDb.collection('posts').doc(postId).set(post)
    console.log('Post created successfully:', postId)

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}