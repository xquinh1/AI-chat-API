import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Something went wrong. Please try again.'
  if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
  if (!error.response) return 'Unable to reach the server. Check your connection.'
  if (error.response.status >= 500) return 'The AI service is unavailable right now.'

  const data = error.response.data as { error?: { message?: string } } | undefined
  return data?.error?.message ?? 'The request could not be completed.'
}
