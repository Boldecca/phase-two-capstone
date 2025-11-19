import { NextRequest, NextResponse } from 'next/server'

// Mock image upload handler
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // In production, upload to cloud storage (Cloudinary, AWS S3, etc.)
    // For now, create a mock URL
    const mockUrl = `/api/images/${Date.now()}-${file.name}`

    return NextResponse.json({
      url: mockUrl,
      name: file.name,
      size: file.size,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }
}
