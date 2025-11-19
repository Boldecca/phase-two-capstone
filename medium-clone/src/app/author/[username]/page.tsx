'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Cake } from 'lucide-react'

interface AuthorPageProps {
  params: { username: string }
}

export default function AuthorPage({ params }: AuthorPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl">
        {/* Author Header */}
        <div className="border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Author Name</h1>
              <p className="text-muted-foreground">@{params.username}</p>
            </div>
            <Button>Follow</Button>
          </div>

          <p className="text-foreground mb-6">
            Passionate writer and creator sharing insights on web development, design, and technology trends.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6 border-t border-border pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Posts</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Followers</p>
              <p className="text-2xl font-bold text-foreground">284</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Cake className="w-4 h-4" />
              Joined Nov 2025
            </span>
            <a href="mailto:author@example.com" className="flex items-center gap-1 hover:text-foreground">
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </div>
        </div>

        {/* Author Posts */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest Posts</h2>
          <p className="text-muted-foreground">Author posts will be displayed here</p>
        </div>
      </div>
    </div>
  )
}
