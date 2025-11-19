'use client'

import { useAuth } from '@/lib/auth-content'
import { useFollowStatus } from '@/lib/swr-hooks'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus } from 'lucide-react'

interface OptimizedFollowButtonProps {
  userId: string
}

export default function OptimizedFollowButton({ userId }: OptimizedFollowButtonProps) {
  const { user, token } = useAuth()
  const { isFollowing, followersCount, isLoading, mutate } = useFollowStatus(userId, token)

  const handleToggleFollow = async () => {
    if (!token || !user) {
      window.location.href = '/signin'
      return
    }

    if (user.id === userId) {
      return
    }

    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ followingId: userId }),
      })

      if (response.ok) {
        // Revalidate follow status with SWR
        await mutate()
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  if (user?.id === userId) {
    return null
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={handleToggleFollow}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  )
}
