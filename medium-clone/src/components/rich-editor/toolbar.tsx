'use client'

import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Code, Quote, Heading2, Link2, Image } from 'lucide-react'

interface ToolbarProps {
  onBold: () => void
  onItalic: () => void
  onHeading: () => void
  onBulletList: () => void
  onNumberedList: () => void
  onCode: () => void
  onQuote: () => void
  onLink: () => void
  onImage: () => void
}

export default function EditorToolbar({
  onBold,
  onItalic,
  onHeading,
  onBulletList,
  onNumberedList,
  onCode,
  onQuote,
  onLink,
  onImage,
}: ToolbarProps) {
  return (
    <div className="border border-border rounded-t-lg bg-muted/50 p-3 flex flex-wrap gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBold}
        title="Bold"
        className="h-8 w-8 p-0"
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onItalic}
        title="Italic"
        className="h-8 w-8 p-0"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <div className="w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onHeading}
        title="Heading"
        className="h-8 w-8 p-0"
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBulletList}
        title="Bullet List"
        className="h-8 w-8 p-0"
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onNumberedList}
        title="Numbered List"
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <div className="w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCode}
        title="Code Block"
        className="h-8 w-8 p-0"
      >
        <Code className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onQuote}
        title="Quote"
        className="h-8 w-8 p-0"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onLink}
        title="Add Link"
        className="h-8 w-8 p-0"
      >
        <Link2 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onImage}
        title="Add Image"
        className="h-8 w-8 p-0"
      >
        <Image className="w-4 h-4" />
      </Button>
    </div>
  )
}
