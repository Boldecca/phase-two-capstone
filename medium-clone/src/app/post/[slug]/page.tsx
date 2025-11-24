'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Share2, Bookmark, ArrowLeft } from 'lucide-react'
import { Post } from '@/lib/post-types'
import MarkdownPreview from '@/components/rich-editor/markdown-preview'
import OptimizedCommentsSection from '@/components/comments/optmized-comments'
import OptimizedClapButton from '@/components/reactions/optmized-clap-button'
import OptimizedFollowButton from '@/components/follow-button-optmizer'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/slug/${slug}`)
        if (!response.ok) {
          throw new Error('Post not found')
        }
        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200)
  const heroImage = post.coverImage || `/placeholder.svg?height=600&width=1200&query=${encodeURIComponent(post.title)} blog post hero`

  return (
    <div className="bg-background">
      <div className="relative h-96 sm:h-[500px] overflow-hidden bg-muted">
        <Image 
          src={heroImage || "/placeholder.svg"}
          alt={post.title}
          width={1200}
          height={600}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 mb-12">
        <div className="mb-8 bg-background rounded-lg p-8 shadow-lg border border-border">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="mb-6 pl-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-4 text-balance leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 pb-6 border-b border-border mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  <Link href={`/author/${post.authorUsername}`} className="hover:text-primary transition-colors">
                    {post.authorName}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  {publishDate} · {readingTime} min read
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="hover:text-primary p-2"
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-primary p-2">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert mb-12 bg-background rounded-lg p-8 border border-border">
          <MarkdownPreview content={post.content} />
        </div>

        <div className="flex items-center gap-6 py-8 px-8 rounded-lg border border-border bg-muted/50 mb-12">
          <OptimizedClapButton postId={post.id} />
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share Story</span>
          </button>
        </div>

        <div className="border border-border rounded-lg p-8 bg-gradient-to-br from-muted/50 to-background mb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{post.authorName}</h3>
                  <p className="text-sm text-muted-foreground">@{post.authorUsername}</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">Writer and creator sharing insights on web development, modern technologies, and best practices for building scalable applications.</p>
            </div>
            <OptimizedFollowButton userId={post.authorId} />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Discussion</h2>
          <OptimizedCommentsSection postId={post.id} />
        </div>
      </article>
    </div>
  )
}
