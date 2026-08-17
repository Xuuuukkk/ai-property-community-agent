import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [repairs, setRepairs] = useState<RepairOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    if (!user) return
    setLoading(true)
    api
      .listRepairs({ user_id: user.id, page_size: 50 })
      .then((res) => setRepairs(res.items))
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [user])

  const handleOwnerConfirm = async (id: number) => {
    try {
      await api.ownerConfirmRepair(id)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : '确认失败')
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="我的工单" onBack={() => window.history.back()} />
      <div className="dashboard-scroll">
        <div style={{ padding: '0 16px 12px' }}>
          <button
            onClick={() => navigate('/owner/repair-form')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 9,
              background: '#22395e',
              color: '#fff',
              fontSize: 14,
              border: 'none',
            }}
          >
            + 发起报修
          </button>
        </div>
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
                    color: repair.status === 'CREATED' ? '#c49b5a' : repair.status === 'CLOSED' || repair.status === 'COMPLETED' ? '#7e8587' : '#5a8a6e',
                    background:
                      repair.status === 'CREATED' ? '#f8f1e4' : repair.status === 'CLOSED' || repair.status === 'COMPLETED' ? '#f0f0f0' : '#eef6f1',
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
              {repair.worker && (
                <div style={{ fontSize: 12, color: '#22395e', marginTop: 8, background: '#f5f7fa', padding: 8, borderRadius: 6 }}>
                  <div>维修师傅：{repair.worker.real_name ?? '未命名'}</div>
                  <div>电话：{repair.worker.phone ?? '暂无'}</div>
                </div>
              )}
              {repair.image_urls && repair.image_urls.length > 0 && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {repair.image_urls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="报修图片"
                      style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6 }}
                    />
                  ))}
                </div>
              )}
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 10 }}>
                提交时间：{formatDate(repair.created_at)}
                {repair.urgency && (
                  <span
                    style={{
                      marginLeft: 10,
                      color: repair.urgency === 'HIGH' || repair.urgency === 'URGENT' ? '#a94442' : repair.urgency === 'MEDIUM' ? '#c49b5a' : '#5a8a6e',
                    }}
                  >
                    优先级：{repair.urgency === 'URGENT' ? '紧急' : repair.urgency === 'HIGH' ? '高' : repair.urgency === 'MEDIUM' ? '中' : '低'}
                  </span>
                )}
              </div>
              {repair.status !== 'COMPLETED' && repair.status !== 'CLOSED' && !repair.owner_confirmed_at && (
                <button
                  onClick={() => handleOwnerConfirm(repair.id)}
                  style={{
                    marginTop: 10,
                    padding: '6px 12px',
                    background: '#22395e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  确认维修完成
                </button>
              )}
              {repair.owner_confirmed_at && repair.status !== 'COMPLETED' && repair.status !== 'CLOSED' && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#5a8a6e' }}>已确认，等待师傅确认</div>
              )}
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
