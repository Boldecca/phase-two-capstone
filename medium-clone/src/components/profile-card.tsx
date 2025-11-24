'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react'

export default function ProfileCard() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  })

  if (!user) {
    return null
  }

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently'

  return (
    <div className="border border-border rounded-lg p-6 max-w-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          <Button 
            size="sm" 
            onClick={async () => {
              try {
                const response = await fetch('/api/profile', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                  },
                  body: JSON.stringify(editData),
                })
                
                if (response.ok) {
                  const data = await response.json()
                  localStorage.setItem('auth_user', JSON.stringify(data.user))
                  window.location.reload() // Simple refresh to update UI
                }
              } catch (error) {
                console.error('Failed to save profile:', error)
              }
              setIsEditing(false)
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          {user.bio ? (
            <p className="text-sm text-foreground">{user.bio}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No bio added yet. Click edit to add one!</p>
          )}
        </div>
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
