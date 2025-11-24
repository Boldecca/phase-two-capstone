'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Users, TrendingUp, Sparkles } from 'lucide-react'
import PostCard from '@/components/post-card'
import { Post } from '@/lib/post-types'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts.slice(0, 6)) // Show latest 6 posts
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Built with performance in mind. Read articles instantly.' },
    { icon: Users, title: 'Community Driven', description: 'Connect with thousands of writers and readers worldwide.' },
    { icon: TrendingUp, title: 'Grow Your Audience', description: 'Reach readers, build your brand, and monetize your content.' },
  ]

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Welcome to PublishHub
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                  Share Your <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">Ideas</span> with the World
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  PublishHub is a modern platform for writers, developers, and creators to share stories, ideas, and expertise with a global audience. Start publishing today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/write">
                  <Button size="lg" className="gap-2 bg-linear-to-r from-primary to-secondary hover:shadow-lg transition-all">
                    Start Writing
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="hover:bg-muted">
                    Explore Stories
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                {/* Decorative gradient background */}
                <div className="absolute -inset-4 bg-linear-to-br from-primary/20 via-secondary/20 to-tertiary/20 rounded-2xl blur-2xl -z-10" />
                
                {/* Hero Image */}
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/writer-publishing-platform-creative-workspace-xNo9PziFr5Y24KwGqwQShxTWNZHpSV.jpg"
                  alt="PublishHub - Share your ideas with the world"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-2xl border border-primary/10 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex flex-col items-start gap-4 p-6 rounded-lg border border-border bg-muted/30 hover:border-primary/50 transition-all hover:shadow-md">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-3">Latest Stories</h2>
          <p className="text-lg text-muted-foreground">Discover the newest posts from our community</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet. Be the first to share your story!</p>
            <Link href="/write">
              <Button>Write First Post</Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mb-8">
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-secondary/5 to-tertiary/5 p-8 sm:p-12 text-center shadow-lg">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to share your story?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of writers and creators building their audience on PublishHub. Start publishing today and connect with readers worldwide.
          </p>
          <Link href="/write">
            <Button size="lg" className="bg-linear-to-r from-primary to-secondary hover:shadow-lg transition-all">
              Create Your First Post
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
