import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { api } from '../../api/client'
import type { Notice } from '../../api/types'

const typeMap: Record<string, string> = {
  notice: '通知',
  announcement: '公告',
  activity: '活动',
  emergency: '紧急',
}

export default function OwnerNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .listNotices({ page_size: 50, status: 'PUBLISHED' })
      .then((res) => {
        if (cancelled) return
        setNotices(res.items)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="社区公告" onBack={() => window.history.back()} />
      <div className="dashboard-scroll">
        {error && (
          <div
            style={{
              marginTop: 14,
              padding: '12px 14px',
              background: '#fff0f0',
              color: '#a94442',
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#7e8587', fontSize: 13 }}>加载中...</div>
        )}
        {!loading && notices.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#7e8587', fontSize: 13 }}>暂无公告</div>
        )}
        {!loading &&
          notices.map((notice) => (
            <div
              key={notice.id}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 10,
                boxShadow: '0 4px 13px rgba(29,45,66,.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#20324b', lineHeight: 1.4, flex: 1 }}>
                  {notice.is_pinned && (
                    <span
                      style={{
                        color: '#c49b5a',
                        background: '#f8f1e4',
                        padding: '1px 5px',
                        borderRadius: 4,
                        fontSize: 10,
                        marginRight: 6,
                        fontWeight: 700,
                      }}
                    >
                      置顶
                    </span>
                  )}
                  {notice.title}
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(notice.created_at)}</div>
              </div>
              {notice.content && (
                <div
                  style={{
                    fontSize: 12,
                    color: '#4a5568',
                    marginTop: 10,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {notice.content}
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <span
                  style={{
                    fontSize: 10,
                    color: '#7e8587',
                    background: '#f5f6f3',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {typeMap[notice.notice_type] ?? notice.notice_type}
                </span>
              </div>
            </div>
          ))}
      </div>
      <BottomNav
        active="home"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
