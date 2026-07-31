import { Conversation } from '@/types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { Copy, User, Bot, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function ChatMessages({ conversation }: { conversation: Conversation }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages.length])

  const messages = conversation.messages.filter(m => m.role !== 'system')

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-6 overflow-y-auto">
      {messages.map((m) => (
        <motion.div key={m.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className={cn('mb-4 flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}>
          {m.role === 'assistant' && (
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center"><Bot className="h-4 w-4" /></div>
          )}
          <div className={cn('rounded-2xl px-4 py-3 max-w-[85%] prose prose-sm dark:prose-invert',
            m.role === 'user' ? 'bg-primary text-primary-foreground prose-invert' : 'bg-muted')
          }>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{
              code(props) {
                const { children, className, ...rest } = props as any
                const isInline = !/language-/.test(className || '')
                return (
                  <code className={cn('relative', className)} {...rest}>
                    {children}
                    {!isInline && (
                      <button
                        className="absolute right-2 top-2 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => navigator.clipboard.writeText(String(children))}
                        title="Copy"
                      >
                        <Copy className="inline h-4 w-4" />
                      </button>
                    )}
                  </code>
                )
              }
            }}>
              {m.content || '...'}
            </ReactMarkdown>
          </div>
          {m.role === 'user' && (
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center"><User className="h-4 w-4" /></div>
          )}
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
