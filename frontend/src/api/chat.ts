import { apiClient } from './client'
import type { AskGeminiResponse } from '../types/chat'

export async function askGemini(prompt: string, signal?: AbortSignal): Promise<string> {
  const { data } = await apiClient.post<AskGeminiResponse>('/ask-gemini', { prompt }, { signal })
  return data.data.response
}
