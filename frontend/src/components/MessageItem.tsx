import { RefreshCw, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../types/chat'
import { MarkdownMessage } from './MarkdownMessage'

export function MessageItem({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  if (message.role === 'user') {
    return <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-stone-100 px-4 py-3 text-[15px] leading-6 text-stone-800 md:max-w-[72%]">{message.content}</div>
  }
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white"><Sparkles className="size-3.5" /></div>
      <div className="min-w-0 flex-1">
        {message.status === 'streaming' && !message.content ? (
          <div className="flex h-8 items-center gap-1"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
        ) : <MarkdownMessage content={message.content} />}
        {message.status === 'streaming' && message.content && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-emerald-700" />}
        {message.status === 'error' && (
          <button onClick={onRetry} className="mt-3 flex items-center gap-2 rounded-md border border-stone-200 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"><RefreshCw className="size-3.5" />Retry</button>
        )}
      </div>
    </div>
  )
}
