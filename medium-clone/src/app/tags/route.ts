import { NextRequest, NextResponse } from 'next/server'

// Mock tags database - replace with real database in production
const mockTags = [
  { name: 'nextjs', count: 15 },
  { name: 'react', count: 23 },
  { name: 'development', count: 18 },
  { name: 'web-development', count: 12 },
  { name: 'ai', count: 8 },
  { name: 'technology', count: 14 },
  { name: 'javascript', count: 20 },
  { name: 'typescript', count: 16 },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ tags: mockTags })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}