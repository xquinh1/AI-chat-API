import { useEffect } from 'react'
import { Code2, Lightbulb, Menu, PenLine, Sparkles } from 'lucide-react'
import { ChatInput } from '../components/ChatInput'
import { MessageItem } from '../components/MessageItem'
import { ModelSelector } from '../components/ModelSelector'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { useChat } from '../hooks/useChat'
import { useConversationStore } from '../store/conversationStore'
import { useUiStore } from '../store/uiStore'

const suggestions = [
  { icon: PenLine, label: 'Draft a concise project update' },
  { icon: Code2, label: 'Explain a TypeScript concept' },
  { icon: Lightbulb, label: 'Brainstorm ideas for a new product' },
]

export function ChatPage() {
  const { conversations, activeConversationId, createConversation, setModel } = useConversationStore()
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)
  const { isGenerating, sendMessage, retryMessage } = useChat()
  const active = conversations.find((item) => item.id === activeConversationId)
  const endRef = useAutoScroll(active?.messages)
  useEffect(() => { if (!activeConversationId && conversations.length === 0) createConversation() }, [activeConversationId, conversations.length, createConversation])
  const model = active?.model ?? 'Gemini 3.5 Flash'
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-100 px-4 md:px-6">
        <div className="flex items-center gap-2"><button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"><Menu className="size-5" /></button><ModelSelector value={model} onChange={(value) => active && setModel(active.id, value)} /></div>
        <div className="flex items-center gap-2 text-xs text-stone-400"><span className="hidden size-1.5 rounded-full bg-emerald-500 sm:block" /><span className="hidden sm:block">Connected</span></div>
      </header>
      <section className="min-h-0 flex-1 overflow-y-auto">
        {!active?.messages.length ? (
          <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-12">
            <div className="mb-8"><span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-emerald-700 text-white"><Sparkles className="size-5" /></span><h1 className="text-3xl font-semibold text-stone-900">How can I help?</h1><p className="mt-2 text-stone-500">Ask a question, explore an idea, or get help with your work.</p></div>
            <div className="grid gap-2 sm:grid-cols-3">{suggestions.map(({ icon: Icon, label }) => <button key={label} onClick={() => void sendMessage(label)} className="min-h-24 rounded-lg border border-stone-200 p-3 text-left text-sm text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"><Icon className="mb-3 size-4 text-emerald-700" />{label}</button>)}</div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">{active.messages.map((message) => <MessageItem key={message.id} message={message} onRetry={() => retryMessage(message.id)} />)}<div ref={endRef} /></div>
        )}
      </section>
      <ChatInput disabled={isGenerating} onSend={(message) => void sendMessage(message)} />
    </main>
  )
}
