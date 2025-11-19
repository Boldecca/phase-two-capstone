import { NextRequest, NextResponse } from 'next/server'
import { socialStore } from '@/lib/social-store'

// GET replies for a comment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const replies = socialStore.getReplies(params.id)
    return NextResponse.json({ replies })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 })
  }
}
