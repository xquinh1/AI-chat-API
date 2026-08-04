import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, Conversation } from '../types/chat'
import { createId } from '../utils/id'

interface ConversationState {
  conversations: Conversation[]
  activeConversationId: string | null
  createConversation: () => string
  selectConversation: (id: string) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  updateMessage: (conversationId: string, messageId: string, patch: Partial<ChatMessage>) => void
  setModel: (conversationId: string, model: string) => void
}

const makeConversation = (): Conversation => {
  const now = new Date().toISOString()
  return {
    id: createId(),
    title: 'New conversation',
    model: 'Gemini 3.5 Flash',
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,
      createConversation: () => {
        const conversation = makeConversation()
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: conversation.id,
        }))
        return conversation.id
      },
      selectConversation: (id) => set({ activeConversationId: id }),
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) => {
            if (conversation.id !== conversationId) return conversation
            const isFirstUserMessage = message.role === 'user' && conversation.messages.length === 0
            return {
              ...conversation,
              title: isFirstUserMessage
                ? message.content.slice(0, 44) + (message.content.length > 44 ? '...' : '')
                : conversation.title,
              messages: [...conversation.messages, message],
              updatedAt: new Date().toISOString(),
            }
          }),
        })),
      updateMessage: (conversationId, messageId, patch) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: conversation.messages.map((message) =>
                    message.id === messageId ? { ...message, ...patch } : message,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : conversation,
          ),
        })),
      setModel: (conversationId, model) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, model } : conversation,
          ),
        })),
    }),
    { name: 'atlas-conversations' },
  ),
)
