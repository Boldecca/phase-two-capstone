'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-content'
import { Comment } from '@/lib/post-types'
import { Button } from '@/components/ui/button'
import { MessageSquare, Trash2, Heart } from 'lucide-react'

interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string) => void
  onDelete: (commentId: string) => void
  isReply?: boolean
}

export default function CommentItem({ comment, onReply, onDelete, isReply }: CommentItemProps) {
  const { user } = useAuth()
  const isAuthor = user?.id === comment.authorId

  const createdDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className={`${isReply ? 'ml-8' : ''} border border-border rounded-lg p-4 bg-muted/50`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-foreground">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">@{comment.authorUsername} • {createdDate}</p>
        </div>
        {isAuthor && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-foreground mb-3 leading-relaxed">
        {comment.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="w-3 h-3" />
          <span>{comment.likes}</span>
        </button>
        {!isReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id)}
            className="text-xs p-0 h-auto"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Reply
          </Button>
        )}
      </div>
    </div>
  )
}
