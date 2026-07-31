import { useEffect, useState } from 'react'
import { mockChatService } from '@/services/mockChatService'
import type { ModelOption } from '@/types/chat'
import { Select } from './Select'

interface Props {
  modelId: string
  onChange: (id: string) => void
}

export function ModelSelector({ modelId, onChange }: Props) {
  const [models, setModels] = useState<ModelOption[]>([])

  useEffect(() => {
    mockChatService.listModels().then(setModels)
  }, [])

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Model</span>
      <Select value={modelId} onChange={onChange} options={models.map(m => ({ value: m.id, label: m.name }))} />
    </div>
  )
}
