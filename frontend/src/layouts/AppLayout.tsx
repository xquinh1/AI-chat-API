import { PropsWithChildren, useState } from 'react'
import { Sidebar } from '@/features/sidebar/Sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'

export function AppLayout({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className={`${collapsed ? 'md:w-[72px]' : 'md:w-[280px]'} border-r hidden md:flex flex-col transition-all duration-300`}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      </aside>
      <div className="flex flex-col h-full">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden block">
                {/* Mobile sidebar placeholder (out of scope for brevity) */}
              </div>
              <span className="font-semibold">AI Chat Playground</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
