import type { Conversation, Message, ModelOption } from '@/types/chat'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const MODELS: ModelOption[] = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (placeholder)', provider: 'gemini' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (placeholder)', provider: 'gemini' },
]

// In-memory store for demo only
let conversations: Conversation[] = []

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export const mockChatService = {
  listModels(): Promise<ModelOption[]> {
    return Promise.resolve(MODELS)
  },

  async listConversations(): Promise<Conversation[]> {
    if (conversations.length === 0) {
      // seed with a sample
      const conv: Conversation = {
        id: generateId('c'),
        title: 'Exploring AI Playground',
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
        updatedAt: Date.now() - 1000 * 60 * 60 * 12,
        messages: [
          { id: generateId('m'), role: 'system', content: 'You are a helpful AI.', createdAt: Date.now() - 1000 * 60 * 60 * 24 },
          { id: generateId('m'), role: 'user', content: 'What can you do?', createdAt: Date.now() - 1000 * 60 * 60 * 24 + 1000 },
          { id: generateId('m'), role: 'assistant', content: 'I can demonstrate concepts like streaming, RAG, and function calling.', createdAt: Date.now() - 1000 * 60 * 60 * 24 + 2000 },
        ],
      }
      conversations = [conv]
    }
    await delay(200)
    return JSON.parse(JSON.stringify(conversations))
  },

  async createConversation(): Promise<Conversation> {
    const newConv: Conversation = {
      id: generateId('c'),
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: generateId('m'), role: 'system', content: 'You are a helpful AI assistant.', createdAt: Date.now() },
      ],
    }
    conversations.unshift(newConv)
    await delay(150)
    return JSON.parse(JSON.stringify(newConv))
  },

  async renameConversation(id: string, title: string) {
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      conv.title = title
      conv.updatedAt = Date.now()
    }
    await delay(120)
    return { success: true }
  },

  async deleteConversation(id: string) {
    conversations = conversations.filter(c => c.id !== id)
    await delay(120)
    return { success: true }
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    await delay(120)
    return JSON.parse(JSON.stringify(conversations.find(c => c.id === id)))
  },

  async sendMessage(opts: {
    conversationId: string
    content: string
    modelId: string
  }): Promise<{ message: Message }> {
    const conv = conversations.find(c => c.id === opts.conversationId)
    if (!conv) throw new Error('Conversation not found')

    const userMsg: Message = { id: generateId('m'), role: 'user', content: opts.content, createdAt: Date.now() }
    conv.messages.push(userMsg)
    conv.updatedAt = Date.now()

    await delay(250)

    const assistantMsg: Message = {
      id: generateId('m'),
      role: 'assistant',
      content:
        `Here is a mock response streaming from ${opts.modelId}.\n\n` +
        '```ts\n// Example: Function calling placeholder\nexport async function callTool(name: string, args: Record<string, any>) {\n  // mock tool call\n  return { name, args, result: "ok" }\n}\n```\n\n' +
        '- Demonstrates: Conversation History, System Prompt, Streaming, RAG, Agents.',
      createdAt: Date.now(),
    }
    conv.messages.push(assistantMsg)

    return { message: JSON.parse(JSON.stringify(assistantMsg)) }
  },

  async *streamMessage(opts: { conversationId: string; content: string; modelId: string }) {
    // Fake streaming via async generator
    const chunks = [
      'Thinking',
      '...\n\n',
      '```js\n',
      'console.log("streaming...")\n',
      '```\n\n',
      'This is a simulated streaming response.'
    ]

    // Immediately add user message in the store
    const conv = conversations.find(c => c.id === opts.conversationId)
    if (conv) {
      conv.messages.push({ id: generateId('m'), role: 'user', content: opts.content, createdAt: Date.now() })
      conv.updatedAt = Date.now()
    }

    for (const part of chunks) {
      await delay(200)
      yield part
    }
  }
}
