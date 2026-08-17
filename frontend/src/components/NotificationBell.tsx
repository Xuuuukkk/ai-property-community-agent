import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

function notificationsPath(role?: string) {
  if (role === 'OWNER') return '/owner/notifications'
  if (role === 'WORKER') return '/repair/notifications'
  return '/management/notifications'
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user) return
    api
      .getUnreadCount()
      .then((res) => setCount(res.count))
      .catch(() => {})
  }, [user])

  return (
    <button
      className="icon-button"
      onClick={() => navigate(notificationsPath(user?.role))}
      style={{ position: 'relative' }}
      aria-label="消息通知"
    >
      <Bell size={22} />
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 8,
            background: '#e24b4a',
            color: '#fff',
            fontSize: 10,
            lineHeight: '16px',
            textAlign: 'center',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
