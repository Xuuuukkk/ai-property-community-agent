import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { User } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const ROLE_LABELS: Record<string, string> = {
  OWNER: '业主',
  WORKER: '维修',
  PROPERTY_STAFF: '物业',
  ADMIN: '管理员',
}

export default function ManagementUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = [1, 2, 3, 4, 5, 211]
    Promise.all(ids.map((id) => api.getUser(id).catch(() => null)))
      .then((results) => setUsers(results.filter(Boolean) as User[]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page dashboard-page">
      <AppHeader title="用户管理" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <SectionTitle title="用户列表" />
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无用户</div>
        ) : (
          <div style={{ display: 'grid', gap: 10, padding: '0 16px 80px' }}>
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(29,45,66,.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 14 }}>{u.real_name ?? u.username}</strong>
                  <span
                    style={{
                      fontSize: 10,
                      padding: '3px 7px',
                      borderRadius: 4,
                      background: '#e9effb',
                      color: '#203b63',
                    }}
                  >
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', color: '#57616a', fontSize: 11 }}>{u.phone ?? '未绑定手机'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav
        active="manage"
        labels={['首页', '工单', '管理', '我的']}
        paths={['/management', '/management/repairs', '/management/notices', '/management/profile']}
      />
    </div>
  )
}
