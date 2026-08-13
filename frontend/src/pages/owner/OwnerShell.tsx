import type { JSX, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChatIcon,
  FeeIcon,
  HomeIcon,
  NoticeIcon,
  RepairIcon,
  TicketIcon,
} from '../../components/owner/icons'
import { useAuth } from '../../contexts/AuthContext'
import './OwnerHome.css'

export type OwnerTabKey = 'home' | 'ai' | 'repair' | 'fee' | 'notice' | 'ticket'

interface OwnerShellProps {
  activeTab: OwnerTabKey
  children: ReactNode
}

const OWNER_NAV_ITEMS: {
  key: OwnerTabKey
  label: string
  path: string
  icon: ({ className }: { className?: string }) => JSX.Element
}[] = [
  { key: 'home', label: '首页', path: '/owner', icon: HomeIcon },
  { key: 'ai', label: 'AI', path: '/owner/ai', icon: ChatIcon },
  { key: 'repair', label: '报修', path: '/owner/repair', icon: RepairIcon },
  { key: 'fee', label: '查费', path: '/owner/fees', icon: FeeIcon },
  { key: 'notice', label: '公告', path: '/owner/notices', icon: NoticeIcon },
  { key: 'ticket', label: '工单', path: '/owner/tickets', icon: TicketIcon },
]

function getInitial(name: string | null | undefined) {
  return (name?.charAt(0) ?? '?')
}

export default function OwnerShell({ activeTab, children }: OwnerShellProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <div className="owner-sidebar-brand">
          <div className="owner-sidebar-brand-tag">YUNXI GARDEN</div>
          <div className="owner-sidebar-brand-name">云溪花园</div>
          <p className="owner-sidebar-brand-slogan">智慧社区 · 美好生活</p>
        </div>

        <nav className="owner-side-nav" aria-label="业主端导航">
          {OWNER_NAV_ITEMS.map((item) => {
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
            <h3>{user?.real_name ?? user?.username ?? '业主'}</h3>
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

      <nav className="owner-bottom-tab" aria-label="底部导航">
        {OWNER_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              className={`owner-tab-item ${activeTab === item.key ? 'active' : ''}`}
              type="button"
              onClick={() => navigate(item.path)}
            >
              <span className="owner-tab-icon">
                <Icon />
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
