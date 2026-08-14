import { CircleUserRound, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'

export default function ManagementProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="我的" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div className="profile-card management-card" style={{ margin: '16px 16px 0' }}>
          <div className="avatar">
            <CircleUserRound size={40} />
          </div>
          <div>
            <strong>{user?.real_name ?? user?.username ?? '管理员'}</strong>
            <p>{user?.role === 'ADMIN' ? '系统管理员' : '物业管理员'}</p>
          </div>
        </div>

        <div style={{ padding: '24px 16px' }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 2px 8px rgba(29,45,66,.05)',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#7e8587' }}>账号</p>
            <p style={{ margin: 0, fontSize: 14, color: '#20324b' }}>{user?.username}</p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: 24,
              padding: '13px',
              borderRadius: 10,
              background: '#fff',
              color: '#c45c5c',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 2px 8px rgba(29,45,66,.05)',
            }}
          >
            <LogOut size={18} />
            退出登录
          </button>
        </div>
      </div>
      <BottomNav
        active="mine"
        labels={['首页', '工单', '管理', '我的']}
        paths={['/management', '/management/repairs', '/management/notices', '/management/profile']}
      />
    </div>
  )
}
