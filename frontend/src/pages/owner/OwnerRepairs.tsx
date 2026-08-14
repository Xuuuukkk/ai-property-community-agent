import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'
import type { RepairOrder } from '../../api/types'

const statusMap: Record<string, string> = {
  CREATED: '待处理',
  ASSIGNED: '已派单',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
  CLOSED: '已关闭',
}

const typeMap: Record<string, string> = {
  water_leak: '漏水维修',
  electrical: '电路维修',
  appliance: '家电维修',
  lock: '门锁维修',
  elevator: '电梯故障',
  cleaning: '保洁服务',
  other: '其他',
}

export default function OwnerRepairs() {
  const { user } = useAuth()
  const [repairs, setRepairs] = useState<RepairOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    api
      .listRepairs({ user_id: user.id, page_size: 50 })
      .then((res) => {
        if (cancelled) return
        setRepairs(res.items)
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
  }, [user])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="我的工单" onBack={() => window.history.back()} />
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
        {!loading && repairs.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#7e8587', fontSize: 13 }}>暂无工单</div>
        )}
        {!loading &&
          repairs.map((repair) => (
            <div
              key={repair.id}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 10,
                boxShadow: '0 4px 13px rgba(29,45,66,.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#20324b' }}>
                    {typeMap[repair.type] ?? repair.type}
                  </div>
                  <div style={{ fontSize: 11, color: '#7e8587', marginTop: 5 }}>{repair.order_no}</div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: repair.status === 'CREATED' ? '#c49b5a' : repair.status === 'CLOSED' ? '#7e8587' : '#5a8a6e',
                    background:
                      repair.status === 'CREATED' ? '#f8f1e4' : repair.status === 'CLOSED' ? '#f0f0f0' : '#eef6f1',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {statusMap[repair.status] ?? repair.status}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#4a5568', marginTop: 10, lineHeight: 1.5 }}>
                {repair.description ?? '暂无描述'}
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 10 }}>
                提交时间：{formatDate(repair.created_at)}
                {repair.urgency && (
                  <span
                    style={{
                      marginLeft: 10,
                      color: repair.urgency === 'HIGH' ? '#a94442' : repair.urgency === 'MEDIUM' ? '#c49b5a' : '#5a8a6e',
                    }}
                  >
                    优先级：{repair.urgency === 'HIGH' ? '高' : repair.urgency === 'MEDIUM' ? '中' : '低'}
                  </span>
                )}
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
