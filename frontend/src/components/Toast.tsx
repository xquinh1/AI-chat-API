import { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { useUiStore } from '../store/uiStore'

export function Toast() {
  const { toast, clearToast } = useUiStore()
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(clearToast, 4500)
    return () => window.clearTimeout(timeout)
  }, [clearToast, toast])
  if (!toast) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-lg" role="alert">
      <AlertCircle className="size-4 shrink-0 text-red-600" />
      <span className="flex-1">{toast.message}</span>
      <button onClick={clearToast} aria-label="Dismiss notification" className="rounded p-1 hover:bg-stone-100"><X className="size-4" /></button>
    </div>
  )
}
