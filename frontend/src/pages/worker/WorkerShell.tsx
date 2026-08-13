import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeIcon, RepairIcon, TicketIcon } from '../../components/owner/icons'
import { useAuth } from '../../contexts/AuthContext'
import '../owner/OwnerHome.css'

type WorkerTabKey = 'dashboard' | 'repairs' | 'profile'

interface WorkerShellProps {
  activeTab: WorkerTabKey
  children: ReactNode
}

const WORKER_NAV = [
  { key: 'dashboard', label: '首页', path: '/worker', icon: HomeIcon },
  { key: 'repairs', label: '工单', path: '/worker/repairs', icon: RepairIcon },
  { key: 'profile', label: '我的', path: '/worker/profile', icon: TicketIcon },
] as const

function getInitial(name: string | null | undefined) {
  return (name?.charAt(0) ?? '?')
}

export default function WorkerShell({ activeTab, children }: WorkerShellProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <div className="owner-sidebar-brand">
          <div className="owner-sidebar-brand-tag">REPAIR TEAM</div>
          <div className="owner-sidebar-brand-name">维修人员端</div>
          <p className="owner-sidebar-brand-slogan">工单受理 · 派单处理</p>
        </div>

        <nav className="owner-side-nav" aria-label="维修端导航">
          {WORKER_NAV.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                className={`owner-side-nav-item ${activeTab === item.key ? 'active' : ''}`}
                type="button"
                onClick={() => navigate(item.path)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="owner-sidebar-user">
          <div className="owner-avatar">{getInitial(user?.real_name ?? user?.username)}</div>
          <div className="owner-user-info">
            <h3>{user?.real_name ?? user?.username ?? '维修人员'}</h3>
            <p>{user?.username ?? ''}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            style={{
              marginLeft: 'auto',
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            退出
          </button>
        </div>
      </aside>

      <main className="owner-main">{children}</main>
    </div>
  )
}
