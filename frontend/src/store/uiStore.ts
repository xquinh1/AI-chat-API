import { create } from 'zustand'

interface Toast {
  id: number
  message: string
}

interface UiState {
  sidebarOpen: boolean
  toast: Toast | null
  setSidebarOpen: (open: boolean) => void
  showToast: (message: string) => void
  clearToast: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toast: null,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  clearToast: () => set({ toast: null }),
}))
