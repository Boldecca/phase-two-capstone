'use client'

import { useAuth } from '@/lib/auth-content'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import EditorForm from '@/components/rich-editor/editor-form'

export default function WritePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Write a New Story</h1>
        <p className="text-muted-foreground">
          Share your thoughts, ideas, and expertise with the PublishHub community.
        </p>
      </div>

      <EditorForm />
    </div>
  )
}
