'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-content'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface ClapButtonProps {
  postId: string
}

export default function ClapButton({ postId }: ClapButtonProps) {
  const { user, token } = useAuth()
  const [count, setCount] = useState(0)
  const [hasReacted, setHasReacted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReactionStatus()
  }, [postId, token])

  const fetchReactionStatus = async () => {
    try {
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/reactions?postId=${postId}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setCount(data.count)
        setHasReacted(data.hasReacted)
      }
    } catch (error) {
      console.error('Failed to fetch reaction status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleReaction = async () => {
    if (!token) {
      window.location.href = '/signin'
      return
    }

    setIsLoading(true)

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
        const data = await response.json()
        setCount(data.count)
        setHasReacted(data.hasReacted)
      }
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
    } finally {
      setIsLoading(false)
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
