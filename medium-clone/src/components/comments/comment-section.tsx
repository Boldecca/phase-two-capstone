'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Comment } from '@/lib/post-types'
import CommentItem from './comment-item'
import CommentForm from './comment-form'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

interface CommentsSectionProps {
  postId: string
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user, token } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.comments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async (content: string, parentCommentId?: string) => {
    if (!user || !token) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          content,
          parentCommentId,
          authorName: user.name,
          authorUsername: user.username,
        }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      await fetchComments()
      setReplyingTo(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to delete comment')
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader className="w-4 h-4 animate-spin" />
        Loading comments...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        Comments ({comments.length})
      </h2>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Comment Form */}
      {user ? (
        <CommentForm
          onSubmit={(content) => handleAddComment(content)}
          isReply={false}
        />
      ) : (
        <div className="p-4 rounded-lg border border-border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <a href="/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </a>{' '}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={setReplyingTo}
                onDelete={handleDeleteComment}
              />

              {/* Reply Form */}
              {replyingTo === comment.id && user && (
                <div className="mt-2 ml-8">
                  <CommentForm
                    onSubmit={(content) => {
                      handleAddComment(content, comment.id)
                      setReplyingTo(null)
                    }}
                    onCancel={() => setReplyingTo(null)}
                    isReply
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  )
}
