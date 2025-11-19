'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/post-card'
import { Post } from '@/lib/post-types'
import { ArrowLeft } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(!!query)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return

    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error('Search failed')
        }
        const data = await response.json()
        setResults(data.results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-2">
          Search Results
        </h1>
        {query && (
          <p className="text-lg text-muted-foreground">
            Results for <span className="font-semibold">&ldquo;{query}&rdquo;</span>
          </p>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="text-sm text-muted-foreground">
            Found {results.length} {results.length === 1 ? 'post' : 'posts'}
          </div>
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No posts found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Try different keywords or browse our tags below
          </p>
          <Link href="/explore">
            <Button variant="outline">Explore Tags</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
