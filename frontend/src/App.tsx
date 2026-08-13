import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApp from './pages/admin/AdminApp'
import AdminHome from './pages/admin/AdminHome'
import AdminNotices from './pages/admin/AdminNotices'
import AdminProfile from './pages/admin/AdminProfile'
import AdminRepairs from './pages/admin/AdminRepairs'
import LoginPage from './pages/LoginPage'
import PortalHome from './pages/PortalHome'
import OwnerAiChat from './pages/owner/OwnerAiChat'
import OwnerFeePage from './pages/owner/OwnerFeePage'
import OwnerHome from './pages/owner/OwnerHome'
import OwnerNoticePage from './pages/owner/OwnerNoticePage'
import OwnerProfile from './pages/owner/OwnerProfile'
import OwnerRepairPage from './pages/owner/OwnerRepairPage'
import OwnerServices from './pages/owner/OwnerServices'
import OwnerTicketPage from './pages/owner/OwnerTicketPage'
import RoleSelect from './pages/RoleSelect'
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
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedLayout allowedRoles={['OWNER']} />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/services" element={<OwnerServices />} />
        <Route path="/owner/ai" element={<OwnerAiChat />} />
        <Route path="/owner/repair" element={<OwnerRepairPage />} />
        <Route path="/owner/fees" element={<OwnerFeePage />} />
        <Route path="/owner/notices" element={<OwnerNoticePage />} />
        <Route path="/owner/tickets" element={<OwnerTicketPage />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={['WORKER']} />}>
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker/repairs" element={<WorkerDashboard />} />
        <Route path="/worker/profile" element={<WorkerDashboard />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={['PROPERTY_STAFF', 'ADMIN']} />}>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/repairs" element={<AdminRepairs />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/desk/*" element={<AdminApp />} />
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
