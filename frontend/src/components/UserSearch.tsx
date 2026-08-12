import { useState } from 'react'
import { api, User } from '../api/client'

export default function UserSearch() {
  const [userId, setUserId] = useState('1')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    const id = Number(userId)
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getUser(id)
      setUser(data)
    } catch (err: any) {
      setError(err.message || '查询失败')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>业主查询</h2>
      <div className="form-row">
        <label>
          用户 ID
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="输入用户 ID"
            min={1}
          />
        </label>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '查询中...' : '查询'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {user && (
        <table>
          <tbody>
            <tr><th>ID</th><td>{user.id}</td></tr>
            <tr><th>用户名</th><td>{user.username}</td></tr>
            <tr><th>姓名</th><td>{user.real_name || '-'}</td></tr>
            <tr><th>电话</th><td>{user.phone || '-'}</td></tr>
            <tr><th>角色</th><td>{user.role}</td></tr>
            <tr><th>注册时间</th><td>{new Date(user.created_at).toLocaleString()}</td></tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
