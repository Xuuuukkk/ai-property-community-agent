import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/owner/icons'
import { useAuth } from '../../contexts/AuthContext'
import AdminShell from './AdminShell'

export default function AdminProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const displayName = user?.real_name || user?.username || '管理员'
  const phone = user?.phone || '暂无手机号'

  return (
    <AdminShell activeTab="profile">
      <div className="yx-page">
        <header className="yx-topbar">
          <button type="button" className="yx-back" onClick={() => navigate('/admin')}>
            <ArrowLeftIcon />
          </button>
          <div className="yx-topbar-title">我的</div>
          <div style={{ width: 40 }} />
        </header>

        <main className="yx-main yx-container">
          <section className="yx-profile-card yx-mb-12">
            <div className="yx-avatar">{displayName.charAt(0)}</div>
            <div className="yx-profile-info">
              <div className="yx-profile-name">{displayName}</div>
              <div className="yx-profile-meta">{phone}</div>
            </div>
          </section>

          <section className="yx-card">
            <div style={menuItemStyle}>
              <span>账户设置</span>
              <span style={{ color: '#9aa3ad' }}>
                <ArrowRightIcon />
              </span>
            </div>
            <div style={{ height: 1, background: '#e5e7eb' }} />
            <div style={menuItemStyle}>
              <span>权限管理</span>
              <span style={{ color: '#9aa3ad' }}>
                <ArrowRightIcon />
              </span>
            </div>
            <div style={{ height: 1, background: '#e5e7eb' }} />
            <div style={menuItemStyle}>
              <span>系统消息</span>
              <span style={{ color: '#9aa3ad' }}>
                <ArrowRightIcon />
              </span>
            </div>
          </section>

          <button
            type="button"
            className="yx-btn yx-btn-outline"
            style={{ marginTop: 24 }}
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            退出登录
          </button>
        </main>
      </div>
    </AdminShell>
  )
}

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 0',
  fontSize: 14,
  color: '#1f2937',
  cursor: 'pointer',
}
