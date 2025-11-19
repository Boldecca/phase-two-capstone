export interface Draft {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  savedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  authorName: string
  authorUsername: string
  tags: string[]
  slug: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorUsername: string
  content: string
  parentCommentId?: string
  createdAt: string
  updatedAt: string
  likes: number
}

export interface Reaction {
  id: string
  postId: string
  userId: string
  type: 'clap'
  createdAt: string
}

export interface Follow {
  followerId: string
  followingId: string
  createdAt: string
}
