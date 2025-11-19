'use client'

import { useAuth } from '@/lib/auth-content'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import ProfileCard from '@/components/profile-card'

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProfileCard />

        <div className="md:col-span-2">
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Your Posts</h2>
            <p className="text-muted-foreground">
              Your published posts will appear here. Posts CRUD will be implemented in Lab 4.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
