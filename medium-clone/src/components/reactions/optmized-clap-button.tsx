'use client'

import { useAuth } from '@/lib/auth-content'
import { useReactions } from '@/lib/swr-hooks'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface OptimizedClapButtonProps {
  postId: string
}

export default function OptimizedClapButton({ postId }: OptimizedClapButtonProps) {
  const { user, token } = useAuth()
  const { count, hasReacted, isLoading, mutate } = useReactions(postId, token)

  const handleToggleReaction = async () => {
    if (!token) {
      window.location.href = '/signin'
      return
    }

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      })

      if (response.ok) {
        // Optimistically update UI and revalidate with SWR
        await mutate()
      }
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleReaction}
      disabled={isLoading}
      className={`flex items-center gap-2 ${hasReacted ? 'text-red-600' : 'text-muted-foreground'}`}
    >
      <Heart
        className={`w-5 h-5 ${hasReacted ? 'fill-current' : ''}`}
      />
      <span>{count} claps</span>
    </Button>
  )
}
