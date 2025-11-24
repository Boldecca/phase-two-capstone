'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-content'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import MarkdownEditor from './markdown-editor'
import MarkdownPreview from './markdown-preview'
import { Draft, Post } from '@/lib/post-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EditorFormProps {
  initialDraft?: Draft
  onSave?: (draft: Draft) => void
}

export default function EditorForm({ initialDraft, onSave }: EditorFormProps) {
  const router = useRouter()
  const { user, token, isLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: initialDraft?.title || '',
    excerpt: initialDraft?.excerpt || '',
    content: initialDraft?.content || '',
    tags: initialDraft?.tags?.join(', ') || '',
    coverImage: '',
  })
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.content) {
        const draft: Draft = {
          id: `draft_${Date.now()}`,
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem('current_draft', JSON.stringify(draft))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [formData])

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (!user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSuccess(null)
    setError(null)
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (!formData.title.trim()) {
        throw new Error('Please add a title')
      }

      const draft: Draft = {
        id: initialDraft?.id || `draft_${Date.now()}`,
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem('current_draft', JSON.stringify(draft))
      setSuccess('Draft saved successfully!')

      if (onSave) {
        onSave(draft)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPublishing(true)
    setError(null)

    try {
      if (!formData.title.trim()) {
        throw new Error('Please add a title')
      }
      if (!formData.content.trim()) {
        throw new Error('Please write some content')
      }
      if (!formData.excerpt.trim()) {
        throw new Error('Please add an excerpt')
      }

      console.log('Publishing post...', { title: formData.title, token: !!token })
      
      let coverImageUrl = ''
      if (coverImageFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', coverImageFile)
        
        const imageResponse = await fetch('/api/images/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: imageFormData,
        })
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          coverImageUrl = imageData.url
        }
      }
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: 'published',
          authorName: user.name,
          authorUsername: user.username,
          coverImage: coverImageUrl,
        }),
      })
      
      console.log('Response status:', response.status)

      console.log('Response received:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to publish: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log('Success result:', result)
      localStorage.removeItem('current_draft')
      setSuccess('Post published successfully!')
      setTimeout(() => router.push(`/profile`), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <form onSubmit={handleSaveDraft} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Write a compelling headline..."
            value={formData.title}
            onChange={handleChange}
            required
            className="text-lg font-semibold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {coverImagePreview && (
            <div className="mt-2">
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="A brief summary of your post (2-3 sentences)"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            type="text"
            placeholder="react, nextjs, typescript (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Tabs defaultValue="write" className="w-full">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="mt-2">
            <MarkdownEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-2">
            {formData.content ? (
              <MarkdownPreview content={formData.content} />
            ) : (
              <p className="text-muted-foreground py-12 text-center">
                Start writing to see preview
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          type="submit"
          variant="outline"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? 'Publishing...' : 'Publish Post'}
        </Button>
      </div>
    </form>
  )
}
