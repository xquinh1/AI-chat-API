export type MessageRole = 'user' | 'assistant'

export type MessageStatus = 'complete' | 'streaming' | 'error'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
  status: MessageStatus
}

export interface Conversation {
  id: string
  title: string
  model: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface AskGeminiResponse {
  data: {
    response: string
  }
}
