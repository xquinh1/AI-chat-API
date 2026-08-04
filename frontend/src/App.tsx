import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { ChatPage } from './pages/ChatPage'

export default function App() {
  return <AppLayout><Routes><Route path="/" element={<ChatPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppLayout>
}
