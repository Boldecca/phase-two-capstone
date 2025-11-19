import { Post } from '@/lib/post-types'

class PostsStore {
  private posts: Map<string, Post> = new Map()
  private slugCounter: Map<string, number> = new Map()

  generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100)

    const count = this.slugCounter.get(baseSlug) || 0
    this.slugCounter.set(baseSlug, count + 1)

    return count > 0 ? `${baseSlug}-${count}` : baseSlug
  }

  createPost(post: Omit<Post, 'id' | 'slug'>): Post {
    const id = `post_${Date.now()}`
    const slug = this.generateSlug(post.title)
    const newPost: Post = { ...post, id, slug }
    this.posts.set(id, newPost)
    return newPost
  }

  getPost(id: string): Post | null {
    return this.posts.get(id) || null
  }

  getPostBySlug(slug: string): Post | null {
    for (const post of this.posts.values()) {
      if (post.slug === slug) return post
    }
    return null
  }

  getPostsByAuthor(authorId: string): Post[] {
    return Array.from(this.posts.values())
      .filter(post => post.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getAllPublishedPosts(): Post[] {
    return Array.from(this.posts.values())
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
  }

  updatePost(id: string, updates: Partial<Post>): Post | null {
    const post = this.posts.get(id)
    if (!post) return null
    const updated = { ...post, ...updates, updatedAt: new Date().toISOString() }
    this.posts.set(id, updated)
    return updated
  }

  deletePost(id: string): boolean {
    return this.posts.delete(id)
  }

  searchPosts(query: string): Post[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.posts.values())
      .filter(post =>
        post.status === 'published' && (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery)
        )
      )
  }

  getPostsByTags(tags: string[]): Post[] {
    return Array.from(this.posts.values())
      .filter(post =>
        post.status === 'published' &&
        post.tags.some(tag => tags.includes(tag))
      )
  }

  getPaginatedPosts(page: number = 1, pageSize: number = 10): Post[] {
    const allPosts = this.getAllPublishedPosts()
    const start = (page - 1) * pageSize
    return allPosts.slice(start, start + pageSize)
  }

  getTotalPostsCount(): number {
    return this.getAllPublishedPosts().length
  }
}

export const postsStore = new PostsStore()
