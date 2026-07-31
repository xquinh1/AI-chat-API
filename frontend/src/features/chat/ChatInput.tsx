import { useEffect, useRef, useState } from 'react'
import { Paperclip, Send, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Props {
  disabled?: boolean
  onSend: (text: string) => Promise<void> | void
}

export function ChatInput({ disabled, onSend }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [value])

  const handleSubmit = async () => {
    const text = value.trim()
    if (!text || loading) return
    setLoading(true)
    try {
      await onSend(text)
      setValue('')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative border-t bg-gradient-to-b from-transparent to-background">
      <div className="container max-w-3xl py-4">
        <div className="relative rounded-2xl border bg-background shadow-sm">
          <div className="absolute left-2 top-2">
            <Button variant="ghost" size="icon" aria-label="Attach" title="Attach (UI only)">
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
          <Textarea
            ref={ref}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Send a message..."
            className="min-h-[52px] max-h-[200px] px-14 py-3 rounded-2xl resize-none border-0 focus-visible:ring-0"
            disabled={!!disabled}
          />
          <div className="absolute right-2 top-2">
            <Button disabled={loading} onClick={handleSubmit} size="icon" aria-label="Send">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Press Enter to send • Shift + Enter for new line</p>
      </div>
    </div>
  )
}
