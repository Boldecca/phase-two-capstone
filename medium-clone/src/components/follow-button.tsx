'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus } from 'lucide-react'

interface FollowButtonProps {
  userId: string
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { user, token } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    fetchFollowStatus()
  }, [userId, token])

  const fetchFollowStatus = async () => {
    try {
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/follows?userId=${userId}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
        setFollowerCount(data.followersCount)
      }
    } catch (error) {
      console.error('Failed to fetch follow status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFollow = async () => {
    if (!token || !user) {
      window.location.href = '/signin'
      return
    }

    if (user.id === userId) {
      return
    }

    setIsLoading(true)

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
        const data = await response.json()
        setIsFollowing(data.isFollowing)
        setFollowerCount(data.followersCount)
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button for own profile
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
