import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Mock user store
const mockUsers = new Map()

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { name, bio } = await request.json()

    // Update user in mock store (in real app, update database)
    const updatedUser = {
      id: payload.userId,
      email: payload.email,
      name: name || 'User',
      bio: bio || '',
      username: payload.email.split('@')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.set(payload.userId, updatedUser)

    return NextResponse.json({ user: updatedUser })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}