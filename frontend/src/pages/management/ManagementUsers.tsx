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

const ROLE_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'OWNER', label: '业主' },
  { value: 'PROPERTY_STAFF', label: '物业' },
  { value: 'WORKER', label: '维修' },
  { value: 'ADMIN', label: '管理员' },
]

export default function ManagementUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .listUsers({ page_size: 100, role: role || undefined })
      .then((res) => setUsers(res.items))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [role])

  return (
    <div className="page dashboard-page">
      <AppHeader title="用户管理" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <SectionTitle title="用户列表" />

        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#57616a' }}>角色筛选：</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e1e3e6',
              fontSize: 12,
              background: '#fff',
            }}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

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
