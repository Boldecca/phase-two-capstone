import { Comment, Reaction, Follow } from '@/lib/post-types'

class SocialStore {
  private comments: Map<string, Comment> = new Map()
  private reactions: Map<string, Reaction> = new Map()
  private follows: Map<string, Follow> = new Map()

  // Comments
  createComment(postId: string, authorId: string, authorName: string, authorUsername: string, content: string, parentCommentId?: string): Comment {
    const id = `comment_${Date.now()}`
    const comment: Comment = {
      id,
      postId,
      authorId,
      authorName,
      authorUsername,
      content,
      parentCommentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    }
    this.comments.set(id, comment)
    return comment
  }

  getCommentsByPost(postId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId && !comment.parentCommentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getReplies(parentCommentId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter(comment => comment.parentCommentId === parentCommentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  getComment(id: string): Comment | null {
    return this.comments.get(id) || null
  }

  deleteComment(id: string): boolean {
    return this.comments.delete(id)
  }

  updateComment(id: string, content: string): Comment | null {
    const comment = this.comments.get(id)
    if (!comment) return null
    comment.content = content
    comment.updatedAt = new Date().toISOString()
    return comment
  }

  // Reactions (Claps)
  addReaction(postId: string, userId: string): Reaction {
    const id = `reaction_${Date.now()}`
    const reaction: Reaction = {
      id,
      postId,
      userId,
      type: 'clap',
      createdAt: new Date().toISOString(),
    }
    this.reactions.set(id, reaction)
    return reaction
  }

  getReactionCount(postId: string): number {
    return Array.from(this.reactions.values())
      .filter(reaction => reaction.postId === postId).length
  }

  hasUserReacted(postId: string, userId: string): boolean {
    return Array.from(this.reactions.values())
      .some(reaction => reaction.postId === postId && reaction.userId === userId)
  }

  removeReaction(postId: string, userId: string): boolean {
    for (const [key, reaction] of this.reactions.entries()) {
      if (reaction.postId === postId && reaction.userId === userId) {
        return this.reactions.delete(key)
      }
    }
    return false
  }

  // Follows
  followUser(followerId: string, followingId: string): Follow | null {
    if (followerId === followingId) return null
    const id = `follow_${followerId}_${followingId}`
    if (this.follows.has(id)) return null
    
    const follow: Follow = {
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    }
    this.follows.set(id, follow)
    return follow
  }

  unfollowUser(followerId: string, followingId: string): boolean {
    const id = `follow_${followerId}_${followingId}`
    return this.follows.delete(id)
  }

  isFollowing(followerId: string, followingId: string): boolean {
    const id = `follow_${followerId}_${followingId}`
    return this.follows.has(id)
  }

  getFollowersCount(userId: string): number {
    return Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId).length
  }

  getFollowingCount(userId: string): number {
    return Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId).length
  }
}

export const socialStore = new SocialStore()
