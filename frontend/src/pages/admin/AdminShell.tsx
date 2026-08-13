import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeIcon, NoticeIcon, ProfileIcon, RepairIcon } from '../../components/owner/icons'

export type AdminTabKey = 'home' | 'repairs' | 'notices' | 'profile'

interface AdminShellProps {
  activeTab: AdminTabKey
  children: ReactNode
}

const ADMIN_NAV_ITEMS: {
  key: AdminTabKey
  label: string
  path: string
  icon: typeof HomeIcon
}[] = [
  { key: 'home', label: '首页', path: '/admin', icon: HomeIcon },
  { key: 'repairs', label: '工单', path: '/admin/repairs', icon: RepairIcon },
  { key: 'notices', label: '公告', path: '/admin/notices', icon: NoticeIcon },
  { key: 'profile', label: '我的', path: '/admin/profile', icon: ProfileIcon },
]

export default function AdminShell({ activeTab, children }: AdminShellProps) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {children}

      <nav className="yx-bottom-tab" aria-label="物业端底部导航">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.key
          return (
            <button
              key={item.key}
              className={`yx-tab-item ${active ? 'active' : ''}`}
              type="button"
              onClick={() => navigate(item.path)}
            >
              <span className="yx-tab-icon">
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
