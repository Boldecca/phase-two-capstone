'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/post-card'
import { Post } from '@/lib/post-types'
import { ArrowLeft } from 'lucide-react'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export default function TagPage({ params }: TagPageProps) {
  const { tag: rawTag } = use(params)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tag = decodeURIComponent(rawTag)

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        const response = await fetch(`/api/tags/${encodeURIComponent(tag)}`)
        if (!response.ok) {
          throw new Error('Failed to load posts')
        }
        const data = await response.json()
        setPosts(data.posts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTagPosts()
  }, [tag])

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/explore">
          <Button variant="ghost" className="mb-4 pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tags
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-2">
          {tag}
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore stories and articles tagged with {tag}
        </p>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} with this tag
          </div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No posts found with tag "{tag}"
          </p>
          <Link href="/explore">
            <Button variant="outline">Explore Other Tags</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
