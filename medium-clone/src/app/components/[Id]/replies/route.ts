import { NextRequest, NextResponse } from 'next/server'
import { Comment } from '@/lib/post-types'

// Mock replies database
const mockReplies: Comment[] = []

// GET replies for a comment
export async function GET(request: NextRequest, { params }: { params: Promise<{ Id: string }> }) {
  try {
    const { Id } = await params
    const replies = mockReplies.filter(reply => reply.parentCommentId === Id)
    return NextResponse.json({ replies })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 })
  }
}
