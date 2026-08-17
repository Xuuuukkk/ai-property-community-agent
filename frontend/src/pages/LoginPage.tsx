import { Eye, LockKeyhole, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AppHeader from '../components/AppHeader'
import { WaveLine } from '../components/common'

function roleHome(role: string) {
  if (role === 'OWNER') return '/owner'
  if (role === 'WORKER') return '/repair'
  if (role === 'PROPERTY_STAFF' || role === 'ADMIN') return '/management'
  return '/'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate(roleHome(user.role), { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      // navigation handled by useEffect after user state updates
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      setLoading(false)
    }
  }

  const fillAndLogin = async (u: string, p: string) => {
    setUsername(u)
    setPassword(p)
    setError('')
    setLoading(true)
    try {
      await login(u, p)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      setLoading(false)
    }
  }

  const demoAccounts = [
    { role: '业主', username: 'guoyi378', password: '123456' },
    { role: '物业', username: 'mayun420', password: '123456' },
    { role: '维修', username: 'yangfei423', password: '123456' },
  ]

  return (
    <div className="page art-page login-page">
      <AppHeader onBack={() => navigate('/roles')} />
      <div className="login-copy">
        <h2>欢迎登录</h2>
        <p>请使用账号密码登录</p>
      </div>
      <form className="form-stack" onSubmit={handleSubmit}>
        <label className="input-wrap">
          <UserRound size={20} />
          <input
            placeholder="请输入账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="input-wrap">
          <LockKeyhole size={20} />
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Eye size={19} />
        </label>
        <div className="form-options">
          <span>
            <span className="checkbox checked">✓</span>记住密码
          </span>
          <button type="button">忘记密码?</button>
        </div>
        {error && <p style={{ color: '#c23', fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button className="primary-button full" type="submit" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
        <p className="help-copy">
          还没有账号？<button type="button">联系物业管理处</button>
        </p>
      </form>
      <div style={{ margin: '20px 0 8px' }}>
        <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 10 }}>演示账号 · 点击一键登录</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {demoAccounts.map((acc) => (
            <button
              key={acc.role}
              type="button"
              disabled={loading}
              onClick={() => fillAndLogin(acc.username, acc.password)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                border: '1px solid #dedfdd',
                borderRadius: 10,
                background: '#f5f7fa',
                fontSize: 12,
                color: '#20324b',
              }}
            >
              <span style={{ fontWeight: 600, color: '#22395e' }}>{acc.role}</span>
              <span style={{ color: '#7e8587' }}>{acc.username} / {acc.password}</span>
            </button>
          ))}
        </div>
      </div>
      <WaveLine />
    </div>
  )
}
