import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '../components/owner/icons'

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: '业主',
  WORKER: '维修人员',
  PROPERTY_STAFF: '物业人员',
  ADMIN: '管理员',
}

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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roleLabel = ROLE_LABELS[initialRole] || '用户'

  const demoHint = useMemo(() => {
    const hints: Record<UserRole, string> = {
      OWNER: '演示账号：guoyi378 / 123456',
      WORKER: '演示账号：yangfei423 / 123456',
      PROPERTY_STAFF: '演示账号：linzhe917 / 123456',
      ADMIN: '演示账号：mayun420 / 123456',
    }
    return hints[initialRole] || ''
  }, [initialRole])

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
    <div className="yx-login-page">
      <div className="yx-topbar">
        <button type="button" className="yx-back" onClick={() => navigate('/role-select')}>
          <ArrowLeftIcon />
        </button>
        <div />
      </div>

      <div className="yx-container">
        <div className="yx-login-header">
          <h1 className="yx-login-title">欢迎登录</h1>
          <p className="yx-login-subtitle">选择身份 · 账号密码登录</p>
        </div>

        <form className="yx-login-form" onSubmit={handleSubmit}>
          <div className="yx-input-wrap">
            <span className="yx-input-icon">
              <UserIcon />
            </span>
            <input
              type="text"
              className="yx-input with-icon"
              placeholder={`请输入${roleLabel}账号`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="yx-input-wrap">
            <span className="yx-input-icon">
              <LockIcon />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="yx-input with-icon"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="yx-input-eye"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="yx-login-options">
            <label className="yx-login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              记住账号
            </label>
            <a href="#" className="yx-login-forgot" onClick={(e) => e.preventDefault()}>
              忘记密码？
            </a>
          </div>

          {error && (
            <div style={{ padding: 10, borderRadius: 8, background: '#ffe2e2', color: '#a83232', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="yx-btn yx-btn-primary"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="yx-login-footer">
          <p>还没有账号？<a href="#" onClick={(e) => e.preventDefault()}>联系物业管理处</a></p>
          {demoHint && (
            <p style={{ marginTop: 8, color: '#687280', fontSize: 12 }}>{demoHint}</p>
          )}
        </div>
      </div>
    </div>
  )
}
