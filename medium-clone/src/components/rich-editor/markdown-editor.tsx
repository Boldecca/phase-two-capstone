'use client'

import { useRef, useCallback } from 'react'
import EditorToolbar from './toolbar'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing your story...',
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || 'text'
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
    }, 0)
  }

  const handleBold = useCallback(() => insertMarkdown('**', '**'), [value])
  const handleItalic = useCallback(() => insertMarkdown('_', '_'), [value])
  const handleHeading = useCallback(() => insertMarkdown('\n## ', '\n'), [value])
  const handleBulletList = useCallback(() => insertMarkdown('\n- ', '\n'), [value])
  const handleNumberedList = useCallback(() => insertMarkdown('\n1. ', '\n'), [value])
  const handleCode = useCallback(() => insertMarkdown('\n```\n', '\n```\n'), [value])
  const handleQuote = useCallback(() => insertMarkdown('\n> ', '\n'), [value])
  const handleLink = useCallback(() => insertMarkdown('[', '](https://)''), [value])
  const handleImage = useCallback(() => insertMarkdown('![', '](https://)''), [value])

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <EditorToolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onHeading={handleHeading}
        onBulletList={handleBulletList}
        onNumberedList={handleNumberedList}
        onCode={handleCode}
        onQuote={handleQuote}
        onLink={handleLink}
        onImage={handleImage}
      />

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-96 p-4 font-mono text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none resize-none"
      />
    </div>
  )
}
