import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, MessageSquarePlus, Search, Settings, Trash2 } from 'lucide-react'
import { mockChatService } from '@/services/mockChatService'
import type { Conversation } from '@/types/chat'
import { format, isToday, isYesterday, subDays } from 'date-fns'
import { cn } from '@/utils/cn'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  onSelectConversation?: (id: string) => void
  activeId?: string
}

export function Sidebar({ collapsed, onToggle, onSelectConversation, activeId }: SidebarProps) {
  const [items, setItems] = useState<Conversation[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    mockChatService.listConversations().then(setItems)
  }, [])

  const grouped = useMemo(() => {
    const filtered = items.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    const groups: Record<string, Conversation[]> = { Today: [], Yesterday: [], 'Last 7 Days': [] }
    const sevenDaysAgo = subDays(new Date(), 7)

    for (const c of filtered) {
      const date = new Date(c.updatedAt)
      if (isToday(date)) groups['Today'].push(c)
      else if (isYesterday(date)) groups['Yesterday'].push(c)
      else if (date > sevenDaysAgo) groups['Last 7 Days'].push(c)
    }
    return groups
  }, [items, search])

  const handleNew = async () => {
    const conv = await mockChatService.createConversation()
    setItems(prev => [conv, ...prev])
    onSelectConversation?.(conv.id)
  }

  const handleDelete = async (id: string) => {
    await mockChatService.deleteConversation(id)
    setItems(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center text-primary font-bold">AI</div>
          {!collapsed && <div className="text-sm font-medium">Playground</div>}
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <div className="p-3">
        <Button className="w-full justify-start gap-2" onClick={handleNew}>
          <MessageSquarePlus className="h-4 w-4" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>
      <div className="px-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className={cn('pl-9', collapsed && 'opacity-0 pointer-events-none')} />
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        {Object.entries(grouped).map(([label, list]) => (
          <div key={label} className="mb-4">
            {!collapsed && <div className="px-1 text-xs text-muted-foreground mb-2">{label}</div>}
            <div className="space-y-1">
              {list.map(c => (
                <button key={c.id} onClick={() => onSelectConversation?.(c.id)} className={cn('w-full text-left text-sm px-2 py-2 rounded-md hover:bg-accent group flex items-center justify-between', activeId === c.id && 'bg-accent') }>
                  <span className={cn('truncate', collapsed && 'hidden')}>{c.title}</span>
                  <span className={cn('text-xs text-muted-foreground ml-2', collapsed && 'hidden')}>{format(c.updatedAt, 'MMM d')}</span>
                  {!collapsed && (
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id) }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto p-3 border-t">
        <Button variant="outline" className={cn('w-full justify-start gap-2', collapsed && 'justify-center')}>
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  )
}
