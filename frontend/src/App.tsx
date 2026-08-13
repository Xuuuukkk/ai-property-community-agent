import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminApp from './pages/admin/AdminApp'
import OwnerHome from './pages/owner/OwnerHome'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/owner" element={<OwnerHome />} />
      </Routes>
    </BrowserRouter>
  )
}
