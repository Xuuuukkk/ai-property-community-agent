import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth, type UserRole } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WelcomePage from './pages/WelcomePage'
import RoleSelectPage from './pages/RoleSelectPage'
import LoginPage from './pages/LoginPage'
import OwnerHome from './pages/owner/OwnerHome'
import OwnerFees from './pages/owner/OwnerFees'
import OwnerRepairs from './pages/owner/OwnerRepairs'
import OwnerRepairForm from './pages/owner/OwnerRepairForm'
import OwnerNotices from './pages/owner/OwnerNotices'
import OwnerServices from './pages/owner/OwnerServices'
import OwnerAiChat from './pages/owner/OwnerAiChat'
import OwnerIssue from './pages/owner/OwnerIssue'
import OwnerProfile from './pages/owner/OwnerProfile'
import ManagementHome from './pages/management/ManagementHome'
import ManagementRepairs from './pages/management/ManagementRepairs'
import ManagementNotices from './pages/management/ManagementNotices'
import ManagementFees from './pages/management/ManagementFees'
import ManagementUsers from './pages/management/ManagementUsers'
import ManagementInspection from './pages/management/ManagementInspection'
import ManagementIssue from './pages/management/ManagementIssue'
import ManagementStats from './pages/management/ManagementStats'
import ManagementKnowledgeGaps from './pages/management/ManagementKnowledgeGaps'
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
        <PrototypeNav />
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

const NAV_GROUPS: ({ section: string } | { label: string; path: string })[] = [
  { section: '公开' },
  { label: '启动页', path: '/' },
  { label: '身份选择', path: '/roles' },
  { label: '账号登录', path: '/login' },
  { section: '业主' },
  { label: '业主首页', path: '/owner' },
  { label: '服务', path: '/owner/services' },
  { label: '房屋报修', path: '/owner/repair-form' },
  { label: '报修记录', path: '/owner/repairs' },
  { label: '费用查询', path: '/owner/fees' },
  { label: '社区公告', path: '/owner/notices' },
  { label: '问题上报', path: '/owner/issue' },
  { label: 'AI 助手', path: '/owner/ai' },
  { label: '我的', path: '/owner/profile' },
  { section: '物业' },
  { label: '物业首页', path: '/management' },
  { label: '工单管理', path: '/management/repairs' },
  { label: '公告管理', path: '/management/notices' },
  { label: '费用管理', path: '/management/fees' },
  { label: '用户管理', path: '/management/users' },
  { label: '自动巡检', path: '/management/inspection' },
  { label: '业主上报', path: '/management/issue' },
  { label: '数据统计', path: '/management/stats' },
  { label: '知识缺口', path: '/management/knowledge-gaps' },
  { label: '我的', path: '/management/profile' },
  { section: '维修' },
  { label: '维修首页', path: '/repair' },
  { label: '工单', path: '/repair/orders' },
  { label: '消息', path: '/repair/messages' },
  { label: '我的', path: '/repair/profile' },
]

function PrototypeNav() {
  return (
    <aside className="prototype-nav">
      <div className="nav-brand">
        <span className="brand-mark">✦</span>
        <span>云溪花园</span>
      </div>
      <p className="nav-caption">智慧社区 · UI 原型</p>
      <div className="nav-list">
        {NAV_GROUPS.map((item, idx) =>
          'section' in item ? (
            <div key={idx} className="nav-section">{item.section}</div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span>{item.label}</span>
            </NavLink>
          ),
        )}
      </div>
      <div className="nav-footer">
        <span className="status-dot" />
        开发中<br />
        <small>路由已打通</small>
      </div>
    </aside>
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
        <Route path="/owner/repair-form" element={<OwnerRepairForm />} />
        <Route path="/owner/notices" element={<OwnerNotices />} />
        <Route path="/owner/ai" element={<OwnerAiChat />} />
        <Route path="/owner/issue" element={<OwnerIssue />} />
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
        <Route path="/management/issue" element={<ManagementIssue />} />
        <Route path="/management/stats" element={<ManagementStats />} />
        <Route path="/management/knowledge-gaps" element={<ManagementKnowledgeGaps />} />
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
