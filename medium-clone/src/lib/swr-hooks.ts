import useSWR, { SWRConfiguration } from 'swr'
import { Post, Comment } from '@/lib/post-types'

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,
}

// Fetcher function
const fetcher = async (url: string, token?: string) => {
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

// Hooks for Posts
export function usePosts(page: number = 1, limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/feed?page=${page}&limit=${limit}`,
    fetcher,
    { ...defaultConfig, revalidateIfStale: true }
  )

  return {
    posts: data?.posts || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  }
}

export function usePostBySlug(slug: string, token?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/posts/slug/${slug}` : null,
    (url) => fetcher(url, token),
    defaultConfig
  )

  return {
    post: data?.post,
    isLoading,
    error,
    mutate,
  }
}

export function useSearchPosts(query: string) {
  const { data, error, isLoading, mutate } = useSWR(
    query && query.length >= 2 ? `/api/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    { ...defaultConfig, dedupingInterval: 30000 }
  )

  return {
    results: data?.results || [],
    count: data?.count || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useTagPosts(tag: string) {
  const { data, error, isLoading, mutate } = useSWR(
    tag ? `/api/tags/${encodeURIComponent(tag)}` : null,
    fetcher,
    defaultConfig
  )

  return {
    posts: data?.posts || [],
    isLoading,
    error,
    mutate,
  }
}

// Hooks for Tags
export function useTags() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/tags',
    fetcher,
    { ...defaultConfig, revalidateOnMount: true }
  )

  return {
    tags: data?.tags || [],
    isLoading,
    error,
    mutate,
  }
}

// Hooks for Comments
export function useComments(postId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `/api/comments?postId=${postId}` : null,
    fetcher,
    { ...defaultConfig, revalidateOnMount: true }
  )

  return {
    comments: data?.comments || [],
    isLoading,
    error,
    mutate,
  }
}

// Hooks for Reactions
export function useReactions(postId: string, token?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `/api/reactions?postId=${postId}` : null,
    (url) => fetcher(url, token),
    defaultConfig
  )

  return {
    count: data?.count || 0,
    hasReacted: data?.hasReacted || false,
    isLoading,
    error,
    mutate,
  }
}

// Hooks for Follows
export function useFollowStatus(userId: string, token?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/follows?userId=${userId}` : null,
    (url) => fetcher(url, token),
    defaultConfig
  )

  return {
    isFollowing: data?.isFollowing || false,
    followersCount: data?.followersCount || 0,
    followingCount: data?.followingCount || 0,
    isLoading,
    error,
    mutate,
  }
}
