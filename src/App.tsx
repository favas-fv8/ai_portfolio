import { Routes, Route } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import NotLive from '@/pages/NotLive'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/not-live" element={<NotLive />} />
    </Routes>
  )
}
