'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/lib/post-types'
import { Heart, MessageCircle } from 'lucide-react'

interface PostCardProps {
  post: Post
  showAuthor?: boolean
  featured?: boolean
}

export default function PostCard({ post, showAuthor = true, featured = false }: PostCardProps) {
  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200)

  const postImage = `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(post.title)} blog article`

  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`}>
        <article className="group border border-border rounded-xl overflow-hidden transition-all hover:shadow-xl hover:border-primary/50 cursor-pointer bg-background">
          {/* Featured image */}
          <div className="relative overflow-hidden h-64 bg-muted">
            <Image 
              src={postImage || "/placeholder.svg"}
              alt={post.title}
              width={500}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Featured content */}
          <div className="p-6 space-y-4">
            {showAuthor && (
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.authorName}</p>
                  <p className="text-xs text-muted-foreground">@{post.authorUsername}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <span>{publishDate}</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Heart className="w-4 h-4" />
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-primary/50 cursor-pointer bg-background">
        {/* Author header */}
        {showAuthor && (
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{post.authorName}</p>
              <p className="text-xs text-muted-foreground truncate">@{post.authorUsername}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <span>{publishDate}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-3 h-3" />
            <MessageCircle className="w-3 h-3" />
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-border">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium transition-colors group-hover:bg-primary/20"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </article>
    </Link>
  )
}
