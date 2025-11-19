'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-content'
import { useComments } from '@/lib/swr-hooks'
import CommentItem from './comment-item'
import CommentForm from './comment-form'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

interface OptimizedCommentsSectionProps {
  postId: string
}

export default function OptimizedCommentsSection({ postId }: OptimizedCommentsSectionProps) {
  const { user, token } = useAuth()
  const { comments, isLoading, error, mutate } = useComments(postId)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleAddComment = async (content: string, parentCommentId?: string) => {
    if (!user || !token) return

    try {
      setSubmitError(null)
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

      // Revalidate comments with SWR
      await mutate()
      setReplyingTo(null)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to post comment')
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
      await mutate()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to delete comment')
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
          {typeof error === 'string' ? error : 'Failed to load comments'}
        </div>
      )}

      {submitError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 text-sm">
          {submitError}
        </div>
      )}

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

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment: Comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={setReplyingTo}
                onDelete={handleDeleteComment}
              />

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
