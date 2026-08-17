import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import type { AppNotification } from '../api/types'
import { useAuth } from '../contexts/AuthContext'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'

function navForRole(role?: string): { active: 'mine' | 'home' | 'work' | 'manage'; labels: string[]; paths: string[] } {
  if (role === 'OWNER') {
    return { active: 'manage', labels: ['首页', '服务', 'AI助手', '我的'], paths: ['/owner', '/owner/services', '/owner/ai', '/owner/profile'] }
  }
  if (role === 'WORKER') {
    return { active: 'mine', labels: ['首页', '工单', '消息', '我的'], paths: ['/repair', '/repair/orders', '/repair/messages', '/repair/profile'] }
  }
  return { active: 'home', labels: ['首页', '工单', '管理', '我的'], paths: ['/management', '/management/repairs', '/management/notices', '/management/profile'] }
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api
      .listNotifications({ page_size: 100 })
      .then((res) => setNotifications(res.items))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (n: AppNotification) => {
    if (n.is_read) return
    await api.markNotificationRead(n.id)
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)))
  }

  const markAll = async () => {
    await api.markAllNotificationsRead()
    setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })))
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const nav = navForRole(user?.role)

  return (
    <div className="page dashboard-page">
      <AppHeader title="消息通知" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={markAll}
            style={{ fontSize: 12, color: '#185fa5', background: 'none', border: 'none' }}
          >
            全部已读
          </button>
        </div>
        {loading ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无消息</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '0 12px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n)}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f1ef',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: n.is_read ? 'transparent' : '#e24b4a',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: n.is_read ? 400 : 600, color: '#20324b' }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: '#a3a5a4' }}>{formatTime(n.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4a5568', marginTop: 4, lineHeight: 1.5 }}>{n.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav active={nav.active} labels={nav.labels} paths={nav.paths} />
    </div>
  )
}
