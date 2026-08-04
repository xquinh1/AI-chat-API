import type { ReactNode } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Toast } from '../components/Toast'

export function AppLayout({ children }: { children: ReactNode }) {
  return <div className="flex h-dvh overflow-hidden bg-white"><Sidebar />{children}<Toast /></div>
}
