'use client'

interface MarkdownPreviewProps {
  content: string
}

// Simple markdown to HTML converter
function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.*?)$/gm, '<h3 className="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 className="text-2xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 className="text-3xl font-bold mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(.*?)```/gs, '<pre className="bg-muted p-3 rounded overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code className="bg-muted px-2 py-1 rounded font-mono text-sm">$1</code>')
    // Blockquotes
    .replace(/^> (.*?)$/gm, '<blockquote className="border-l-4 border-primary pl-4 italic">$1</blockquote>')
    // Links
    .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">$1</a>')
    // Images
    .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" className="max-w-full rounded-lg my-4" />')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')

  return `<p>${html}</p>`
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const html = markdownToHtml(content)

  return (
    <div className="border border-border rounded-lg bg-background p-6">
      <div
        className="prose prose-sm max-w-none text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
