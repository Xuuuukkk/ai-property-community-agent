import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiIcon, HomeIcon, ProfileIcon, ServiceIcon } from '../../components/owner/icons'

export type OwnerTabKey = 'home' | 'services' | 'ai' | 'profile' | 'repair' | 'fee' | 'notice' | 'ticket'

interface OwnerShellProps {
  activeTab: OwnerTabKey
  children: ReactNode
}

const BOTTOM_TAB_KEY: OwnerTabKey[] = ['home', 'services', 'ai', 'profile']

const OWNER_NAV_ITEMS: {
  key: OwnerTabKey
  label: string
  path: string
  icon: typeof HomeIcon
}[] = [
  { key: 'home', label: '首页', path: '/owner', icon: HomeIcon },
  { key: 'services', label: '服务', path: '/owner/services', icon: ServiceIcon },
  { key: 'ai', label: 'AI助手', path: '/owner/ai', icon: AiIcon },
  { key: 'profile', label: '我的', path: '/owner/profile', icon: ProfileIcon },
]

export default function OwnerShell({ activeTab, children }: OwnerShellProps) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {children}

      <nav className="yx-bottom-tab" aria-label="业主端底部导航">
        {OWNER_NAV_ITEMS.map((item) => {
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
