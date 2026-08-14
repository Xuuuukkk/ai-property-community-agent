import { CircleUserRound } from 'lucide-react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { useAuth } from '../../contexts/AuthContext'

export default function OwnerProfile() {
  const { user, logout } = useAuth()

  return (
    <div className="page dashboard-page">
      <AppHeader title="我的" />
      <div className="dashboard-scroll">
        <div className="profile-card">
          <div className="avatar">
            <CircleUserRound size={40} />
          </div>
          <div>
            <strong>
              {user?.real_name ?? user?.username ?? '业主'} <small>业主</small>
            </strong>
            <p>{user?.phone ?? ''}</p>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 4px 13px rgba(29,45,66,.05)',
              fontSize: 13,
              color: '#20324b',
            }}
          >
            账号：{user?.username}
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 4px 13px rgba(29,45,66,.05)',
              fontSize: 13,
              color: '#20324b',
            }}
          >
            角色：业主
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            width: '100%',
            marginTop: 30,
            padding: '14px',
            background: '#fff0f0',
            color: '#a94442',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          退出登录
        </button>
      </div>
      <BottomNav
        active="mine"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
