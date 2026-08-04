import { useRef } from 'react'
import { ArrowUp, Paperclip } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface FormValues { message: string }

export function ChatInput({ onSend, disabled }: { onSend: (message: string) => void; disabled: boolean }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { register, handleSubmit, reset, watch } = useForm<FormValues>({ defaultValues: { message: '' } })
  const registration = register('message')
  const value = watch('message')
  const submit = ({ message }: FormValues) => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    reset()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }
  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto w-full max-w-3xl px-4 pb-5 md:px-8">
      <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.07)] focus-within:border-stone-300">
        <textarea
          {...registration}
          ref={(node) => { registration.ref(node); textareaRef.current = node }}
          rows={1}
          disabled={disabled}
          placeholder="Ask anything..."
          onInput={(event) => { event.currentTarget.style.height = 'auto'; event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 180)}px` }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void handleSubmit(submit)() }
          }}
          className="max-h-45 min-h-12 w-full resize-none bg-transparent px-3 py-3 text-[15px] text-stone-800 outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
        />
        <div className="flex items-center justify-between px-1 pb-1">
          <button type="button" disabled title="Attachments coming soon" aria-label="Attach file" className="rounded-lg p-2 text-stone-400 disabled:cursor-not-allowed"><Paperclip className="size-4" /></button>
          <button type="submit" disabled={disabled || !value.trim()} aria-label="Send message" className="flex size-9 items-center justify-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400"><ArrowUp className="size-4" /></button>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-stone-400">AI can make mistakes. Check important information.</p>
    </form>
  )
}
