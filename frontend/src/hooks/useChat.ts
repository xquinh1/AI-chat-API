import { useCallback, useRef, useState } from 'react'
import { askGemini } from '../api/chat'
import { useConversationStore } from '../store/conversationStore'
import { useUiStore } from '../store/uiStore'
import { createId } from '../utils/id'
import { getErrorMessage } from '../utils/errors'

export function useChat() {
  const [isGenerating, setIsGenerating] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const store = useConversationStore()
  const showToast = useUiStore((state) => state.showToast)

  const sendMessage = useCallback(async (content: string, conversationId?: string) => {
    if (isGenerating) return
    const targetId = conversationId ?? store.activeConversationId ?? store.createConversation()
    const now = new Date().toISOString()
    const assistantId = createId()

    store.addMessage(targetId, { id: createId(), role: 'user', content, createdAt: now, status: 'complete' })
    store.addMessage(targetId, { id: assistantId, role: 'assistant', content: '', createdAt: now, status: 'streaming' })
    setIsGenerating(true)
    controllerRef.current = new AbortController()

    try {
      const response = await askGemini(content, controllerRef.current.signal)
      const chunks = response.match(/\S+\s*/g) ?? [response]
      let rendered = ''
      for (const chunk of chunks) {
        rendered += chunk
        store.updateMessage(targetId, assistantId, { content: rendered })
        await new Promise((resolve) => window.setTimeout(resolve, 12))
      }
      store.updateMessage(targetId, assistantId, { status: 'complete' })
    } catch (error) {
      const message = getErrorMessage(error)
      store.updateMessage(targetId, assistantId, { content: message, status: 'error' })
      showToast(message)
    } finally {
      setIsGenerating(false)
      controllerRef.current = null
    }
  }, [isGenerating, showToast, store])

  const retryMessage = useCallback((messageId: string) => {
    const conversation = store.conversations.find((item) => item.id === store.activeConversationId)
    const failedIndex = conversation?.messages.findIndex((message) => message.id === messageId) ?? -1
    const prompt = failedIndex > 0 ? conversation?.messages[failedIndex - 1]?.content : undefined
    if (prompt && conversation) void sendMessage(prompt, conversation.id)
  }, [sendMessage, store.activeConversationId, store.conversations])

  return { isGenerating, sendMessage, retryMessage }
}
