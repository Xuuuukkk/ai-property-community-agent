import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { HomeIcon, RepairIcon, TicketIcon } from '../components/owner/icons'

const ROLES: { key: UserRole; label: string; icon: typeof HomeIcon }[] = [
  { key: 'OWNER', label: '业主', icon: HomeIcon },
  { key: 'WORKER', label: '维修人员', icon: RepairIcon },
  { key: 'PROPERTY_STAFF', label: '物业管理', icon: TicketIcon },
]

const ROLE_PATHS: Record<UserRole, string> = {
  OWNER: '/owner',
  WORKER: '/worker',
  PROPERTY_STAFF: '/admin',
  ADMIN: '/admin',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, isAuthenticated, role } = useAuth()

  const initialRole = (searchParams.get('role') as UserRole) || 'OWNER'
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const demoHint = useMemo(() => {
    const hints: Record<UserRole, string> = {
      OWNER: '演示账号：guoyi378 / 123456',
      WORKER: '演示账号：yangfei423 / 123456',
      PROPERTY_STAFF: '演示账号：linzhe917 / 123456',
      ADMIN: '演示账号：mayun420 / 123456',
    }
    return hints[selectedRole]
  }, [selectedRole])

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(ROLE_PATHS[role], { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="owner-page" style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <main className="owner-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#ffffff',
            borderRadius: 20,
            padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(10, 37, 64, 0.06)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 0',
              marginBottom: 16,
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            返回
          </button>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: '#8b95a5', fontWeight: 500, letterSpacing: 1 }}>YUNXI GARDEN</div>
            <h1 style={{ fontSize: 24, color: '#0a2540', margin: '8px 0 4px' }}>欢迎回家</h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>请选择角色并登录</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 28,
            }}
          >
            {ROLES.map((roleItem) => {
              const Icon = roleItem.icon
              const active = selectedRole === roleItem.key
              return (
                <button
                  key={roleItem.key}
                  type="button"
                  onClick={() => setSelectedRole(roleItem.key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '16px 8px',
                    borderRadius: 12,
                    border: `1.5px solid ${active ? '#2e4a66' : '#e5e7eb'}`,
                    background: active ? '#eef2f6' : '#ffffff',
                    color: active ? '#0a2540' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <Icon />
                  {roleItem.label}
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{ padding: 10, borderRadius: 8, background: '#fef2f2', color: '#991b1b', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                background: '#2e4a66',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 12, borderRadius: 8, background: '#f8f9fa', fontSize: 12, color: '#6b7280' }}>
            {demoHint}
          </div>
        </div>
      </main>
    </div>
  )
}
