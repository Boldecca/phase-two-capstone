'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/post-card'
import { useTags, usePosts } from '@/lib/swr-hooks'
import { Loader } from 'lucide-react'
import { useState } from 'react'

export default function OptimizedExplore() {
  const { tags, isLoading: isLoadingTags } = useTags()
  const [currentPage, setCurrentPage] = useState(1)
  const { posts, pagination, isLoading: isLoadingPosts } = usePosts(currentPage, 12)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Explore Stories</h1>
        <p className="text-lg text-muted-foreground">
          Discover articles, stories, and insights from our community
        </p>
      </div>

      {/* Popular Tags */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Popular Tags</h2>
        {isLoadingTags ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            Loading tags...
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.slice(0, 15).map((tag: { name: string; count: number }) => (
              <Link key={tag.name} href={`/tags/${tag.name.toLowerCase()}`}>
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-background hover:border-primary hover:bg-muted transition-colors cursor-pointer">
                  <span className="font-medium text-foreground">{tag.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({tag.count})</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tags available yet</p>
        )}
      </div>

      {/* Posts Feed */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Latest Posts</h2>
        {isLoadingPosts ? (
          <div className="flex items-center gap-2 text-muted-foreground py-12">
            <Loader className="w-4 h-4 animate-spin" />
            Loading posts...
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={!pagination.hasMore}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground py-12">No posts available yet</p>
        )}
      </div>
    </div>
  )
}
