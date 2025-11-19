'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-content'

export function usePostForm() {
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publishPost = useCallback(
    async (postData: {
      title: string
      content: string
      excerpt: string
      tags: string[]
    }) => {
      if (!token) {
        setError('Not authenticated')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...postData,
            status: 'published',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to publish post')
        }

        return await response.json()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to publish'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  return { publishPost, isLoading, error }
}
