import { useEffect, useMemo, useRef, useState } from 'react'
import { ChatMessages } from '@/features/chat/ChatMessages'
import { ChatInput } from '@/features/chat/ChatInput'
import { Welcome } from '@/features/chat/Welcome'
import { mockChatService } from '@/services/mockChatService'
import type { Conversation } from '@/types/chat'
import { ModelSelector } from '@/features/model-selector/ModelSelector'

export function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modelId, setModelId] = useState<string>('gemini-1.5-pro')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mockChatService.listConversations().then(list => {
      setConversations(list)
      setActiveId(list[0]?.id ?? null)
    })
  }, [])

  const active = useMemo(() => conversations.find(c => c.id === activeId) || null, [conversations, activeId])

  const handleSend = async (input: string) => {
    if (!active) return
    // Streaming placeholder: append chunks into latest assistant message
    const stream = mockChatService.streamMessage({ conversationId: active.id, content: input, modelId })
    let assistant = ''

    setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, { id: `tmp_${Date.now()}`, role: 'assistant', content: '', createdAt: Date.now() }] } : c))

    for await (const chunk of stream) {
      assistant += chunk
      setConversations(prev => prev.map(c => {
        if (c.id !== active.id) return c
        const msgs = [...c.messages]
        const last = msgs[msgs.length - 1]
        if (last && last.role === 'assistant' && last.id.startsWith('tmp_')) {
          last.content = assistant
        }
        return { ...c, messages: msgs }
      }))
    }
  }

  return (
    <div ref={containerRef} className="h-[calc(100vh-57px)] grid grid-rows-[1fr_auto]">
      {!active || active.messages.filter(m => m.role !== 'system').length === 0 ? (
        <Welcome>
          <ModelSelector modelId={modelId} onChange={setModelId} />
        </Welcome>
      ) : (
        <ChatMessages conversation={active} />
      )}
      <ChatInput disabled={false} onSend={handleSend} />
    </div>
  )
}
