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
    <div className="page-grid">
      <section className="panel query-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Search</span>
            <h3>业主 ID 查询</h3>
          </div>
        </div>

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
          <button onClick={handleSearch} disabled={loading} type="button">
            {loading ? '查询中...' : '查询'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Profile</span>
            <h3>业主档案</h3>
          </div>
        </div>

        {user ? (
          <div className="profile-layout">
            <div className="avatar-card">
              <div className="avatar">{(user.real_name || user.username || '业').slice(0, 1)}</div>
              <strong>{user.real_name || user.username}</strong>
              <span className={`badge status-${user.role}`}>{user.role}</span>
            </div>
            <dl className="detail-list">
              <div>
                <dt>ID</dt>
                <dd>{user.id}</dd>
              </div>
              <div>
                <dt>用户名</dt>
                <dd>{user.username}</dd>
              </div>
              <div>
                <dt>姓名</dt>
                <dd>{user.real_name || '-'}</dd>
              </div>
              <div>
                <dt>电话</dt>
                <dd>{user.phone || '-'}</dd>
              </div>
              <div>
                <dt>角色</dt>
                <dd>{user.role}</dd>
              </div>
              <div>
                <dt>注册时间</dt>
                <dd>{new Date(user.created_at).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="empty-state">
            <strong>等待查询</strong>
            <span>输入用户 ID 后，这里会展示业主基础信息。</span>
          </div>
        )}
      </section>
    </div>
  )
}
