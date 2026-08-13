import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApp from './pages/admin/AdminApp'
import LoginPage from './pages/LoginPage'
import PortalHome from './pages/PortalHome'
import OwnerAiChat from './pages/owner/OwnerAiChat'
import OwnerFeePage from './pages/owner/OwnerFeePage'
import OwnerHome from './pages/owner/OwnerHome'
import OwnerNoticePage from './pages/owner/OwnerNoticePage'
import OwnerRepairPage from './pages/owner/OwnerRepairPage'
import OwnerTicketPage from './pages/owner/OwnerTicketPage'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import type { UserRole } from './contexts/AuthContext'

function ProtectedLayout({ allowedRoles }: { allowedRoles: UserRole[] }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Outlet />
    </ProtectedRoute>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortalHome />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedLayout allowedRoles={['OWNER']} />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/ai" element={<OwnerAiChat />} />
        <Route path="/owner/repair" element={<OwnerRepairPage />} />
        <Route path="/owner/fees" element={<OwnerFeePage />} />
        <Route path="/owner/notices" element={<OwnerNoticePage />} />
        <Route path="/owner/tickets" element={<OwnerTicketPage />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={['WORKER']} />}>
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker/repairs" element={<WorkerDashboard />} />
        <Route path="/worker/profile" element={<WorkerDashboard />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={['PROPERTY_STAFF', 'ADMIN']} />}>
        <Route path="/admin/*" element={<AdminApp />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
