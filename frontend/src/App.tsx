import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth, type UserRole } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WelcomePage from './pages/WelcomePage'
import RoleSelectPage from './pages/RoleSelectPage'
import LoginPage from './pages/LoginPage'
import OwnerHome from './pages/owner/OwnerHome'
import OwnerFees from './pages/owner/OwnerFees'
import OwnerRepairs from './pages/owner/OwnerRepairs'
import OwnerNotices from './pages/owner/OwnerNotices'
import OwnerServices from './pages/owner/OwnerServices'
import OwnerAiChat from './pages/owner/OwnerAiChat'
import OwnerProfile from './pages/owner/OwnerProfile'
import ManagementHome from './pages/management/ManagementHome'
import ManagementRepairs from './pages/management/ManagementRepairs'
import ManagementNotices from './pages/management/ManagementNotices'
import ManagementFees from './pages/management/ManagementFees'
import ManagementUsers from './pages/management/ManagementUsers'
import ManagementInspection from './pages/management/ManagementInspection'
import ManagementProfile from './pages/management/ManagementProfile'
import RepairHome from './pages/repair/RepairHome'
import RepairOrders from './pages/repair/RepairOrders'
import RepairMessages from './pages/repair/RepairMessages'
import RepairProfile from './pages/repair/RepairProfile'
import StatusBar from './components/StatusBar'

function roleHome(role: UserRole) {
  if (role === 'OWNER') return '/owner'
  if (role === 'WORKER') return '/repair'
  if (role === 'PROPERTY_STAFF' || role === 'ADMIN') return '/management'
  return '/'
}

function HomeRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>加载中...</div>
  if (!user) return <WelcomePage />
  return <Navigate to={roleHome(user.role as UserRole)} replace />
}

function ProtectedLayout({ allowedRoles }: { allowedRoles: UserRole[] }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Outlet />
    </ProtectedRoute>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="prototype-layout">
        <aside className="prototype-nav">
          <div className="nav-brand">
            <span className="brand-mark">✦</span>
            <span>云溪花园</span>
          </div>
          <p className="nav-caption">智慧社区 · UI 原型</p>
          <div className="nav-list">
            <button className="nav-item active" onClick={() => window.location.href = '/'}>
              <span>启动页</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/roles'}>
              <span>身份选择</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/login'}>
              <span>账号登录</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/owner'}>
              <span>业主首页</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/owner/fees'}>
              <span>业主·费用</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/owner/repairs'}>
              <span>业主·工单</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/owner/notices'}>
              <span>业主·公告</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/management'}>
              <span>物业首页</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/management/repairs'}>
              <span>物业·工单</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/management/notices'}>
              <span>物业·公告</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/management/inspection'}>
              <span>物业·巡检</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/repair'}>
              <span>维修首页</span>
            </button>
            <button className="nav-item" onClick={() => window.location.href = '/repair/orders'}>
              <span>维修·工单</span>
            </button>
          </div>
          <div className="nav-footer">
            <span className="status-dot" />
            开发中<br />
            <small>路由已打通</small>
          </div>
        </aside>
        <section className="phone-stage">
          <div className="phone-screen">
            <StatusBar />
            {children}
          </div>
        </section>
        <div className="stage-label">
          <span>移动端预览</span>
          <span className="label-line" />
          <span>云溪花园</span>
        </div>
      </div>
    </main>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/roles" element={<RoleSelectPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedLayout allowedRoles={['OWNER']} />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/services" element={<OwnerServices />} />
        <Route path="/owner/fees" element={<OwnerFees />} />
        <Route path="/owner/repairs" element={<OwnerRepairs />} />
        <Route path="/owner/notices" element={<OwnerNotices />} />
        <Route path="/owner/ai" element={<OwnerAiChat />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={['WORKER']} />}>
        <Route path="/repair" element={<RepairHome />} />
        <Route path="/repair/orders" element={<RepairOrders />} />
        <Route path="/repair/messages" element={<RepairMessages />} />
        <Route path="/repair/profile" element={<RepairProfile />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={['PROPERTY_STAFF', 'ADMIN']} />}>
        <Route path="/management" element={<ManagementHome />} />
        <Route path="/management/repairs" element={<ManagementRepairs />} />
        <Route path="/management/notices" element={<ManagementNotices />} />
        <Route path="/management/fees" element={<ManagementFees />} />
        <Route path="/management/users" element={<ManagementUsers />} />
        <Route path="/management/inspection" element={<ManagementInspection />} />
        <Route path="/management/profile" element={<ManagementProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  )
}
