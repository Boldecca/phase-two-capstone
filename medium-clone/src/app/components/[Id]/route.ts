import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { Comment } from '@/lib/post-types'

// Mock comments database
const mockComments: Map<string, Comment> = new Map()

// DELETE comment
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ Id: string }> }) {
  try {
    const { Id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const comment = mockComments.get(Id)
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (comment.authorId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    mockComments.delete(Id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
