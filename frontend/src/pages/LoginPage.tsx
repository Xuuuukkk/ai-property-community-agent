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
      <WaveLine />
    </div>
  )
}
