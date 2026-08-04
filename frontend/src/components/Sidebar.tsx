import { MessageSquare, PanelLeftClose, Plus, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useConversationStore } from '../store/conversationStore'
import { useUiStore } from '../store/uiStore'

export function Sidebar() {
  const [query, setQuery] = useState('')
  const { conversations, activeConversationId, createConversation, selectConversation } = useConversationStore()
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const filtered = useMemo(() => conversations.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [conversations, query])
  const choose = (id: string) => { selectConversation(id); setSidebarOpen(false) }
  return (
    <>
      {sidebarOpen && <button aria-label="Close sidebar" className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-stone-200 bg-[#f7f7f5] transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-stone-800"><span className="flex size-8 items-center justify-center rounded-lg bg-emerald-700 text-white"><Sparkles className="size-4" /></span>Atlas AI</div>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" className="rounded-md p-2 text-stone-500 hover:bg-stone-200 md:hidden"><PanelLeftClose className="size-4" /></button>
        </div>
        <div className="space-y-3 px-3">
          <button onClick={createConversation} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-stone-900 text-sm font-medium text-white hover:bg-stone-800"><Plus className="size-4" />New chat</button>
          <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" className="h-10 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-stone-300" /></div>
        </div>
        <div className="mt-5 flex-1 overflow-y-auto px-3">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase text-stone-400">Recent</p>
          <div className="space-y-1">
            {filtered.map((conversation) => <button key={conversation.id} onClick={() => choose(conversation.id)} className={`flex h-10 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm ${activeConversationId === conversation.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:bg-stone-200/70'}`}><MessageSquare className="size-4 shrink-0" /><span className="truncate">{conversation.title}</span></button>)}
            {!filtered.length && <p className="px-2 py-6 text-center text-xs text-stone-400">No conversations found</p>}
          </div>
        </div>
        <div className="border-t border-stone-200 p-3"><button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-stone-200"><span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">NQ</span><span className="min-w-0 text-left"><span className="block truncate text-sm font-medium text-stone-700">Nguyen Quynh</span><span className="block text-xs text-stone-400">Free plan</span></span></button></div>
      </aside>
    </>
  )
}
