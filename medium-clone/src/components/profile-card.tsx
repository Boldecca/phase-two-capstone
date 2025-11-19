'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Edit2 } from 'lucide-react'

export default function ProfileCard() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="border border-border rounded-lg p-6 max-w-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>

      {user.bio && (
        <p className="text-sm text-foreground mb-4">{user.bio}</p>
      )}

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Joined {joinDate}</span>
        </div>
      </div>
    </div>
  )
}
