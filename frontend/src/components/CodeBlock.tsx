import { useState, type HTMLAttributes } from 'react'
import { Check, Copy } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean
}

export function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const language = /language-(\w+)/.exec(className ?? '')?.[1] ?? 'text'
  const code = String(children).replace(/\n$/, '')
  if (inline) return <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.9em] text-stone-800" {...props}>{children}</code>

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-stone-200 bg-[#fafafa]">
      <div className="flex h-10 items-center justify-between border-b border-stone-200 px-3 text-xs text-stone-500">
        <span>{language}</span>
        <button onClick={copy} className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-stone-100" aria-label="Copy code">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={oneLight} customStyle={{ margin: 0, padding: '1rem', background: '#fafafa', fontSize: '0.875rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
