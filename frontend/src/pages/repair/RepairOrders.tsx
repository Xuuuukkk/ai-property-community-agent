import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { RepairOrder } from '../../api/types'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const TYPE_LABELS: Record<string, string> = {
  water_leak: '漏水',
  elevator_fault: '电梯故障',
  access_control: '门禁故障',
  power_trip: '跳闸',
  wall_seepage: '墙面渗水',
  public_facility: '公共设施',
}

const STATUS_LABELS: Record<string, string> = {
  CREATED: '待处理',
  ASSIGNED: '待接单',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
  CLOSED: '已关闭',
}

const chipBase: React.CSSProperties = {
  whiteSpace: 'nowrap',
  padding: '6px 12px',
  borderRadius: 14,
  fontSize: 11,
  border: '1px solid #e3e6e5',
  background: '#fff',
  color: '#57616a',
}

const chipActive: React.CSSProperties = {
  ...chipBase,
  background: '#22395e',
  color: '#fff',
  borderColor: '#22395e',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: 14,
  boxShadow: '0 2px 8px rgba(29,45,66,.05)',
}

const badgeStyle = (status: string): React.CSSProperties => ({
  fontSize: 10,
  padding: '3px 7px',
  borderRadius: 4,
  background: status === 'ASSIGNED' ? '#f5ecd7' : status === 'PROCESSING' ? '#e9effb' : '#e8edf0',
  color: status === 'ASSIGNED' ? '#ad8a45' : status === 'PROCESSING' ? '#203b63' : '#57616a',
})

const btnPrimary: React.CSSProperties = {
  padding: '7px 12px',
  borderRadius: 8,
  fontSize: 11,
  background: '#22395e',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
}

const btnDefault: React.CSSProperties = {
  padding: '7px 12px',
  borderRadius: 8,
  fontSize: 11,
  background: '#f0f1ef',
  color: '#20324b',
  border: 'none',
  cursor: 'pointer',
}

export default function RepairOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!user?.worker_id) return
    setLoading(true)
      api
        .listRepairs({ worker_id: user.worker_id, page_size: 100 })
        .then((res) => setOrders(res.items))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [user?.worker_id])

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  const updateStatus = async (id: number, status: string) => {
    await api.updateRepairStatus(id, { status })
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const handleWorkerConfirm = async (id: number) => {
    await api.workerConfirmRepair(id)
    load()
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="我的工单" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <SectionTitle title="筛选状态" />
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 12px' }}>
          <button style={filter === 'ALL' ? chipActive : chipBase} onClick={() => setFilter('ALL')}>
            全部
          </button>
          {['ASSIGNED', 'PROCESSING', 'COMPLETED', 'CLOSED'].map((s) => (
            <button key={s} style={filter === s ? chipActive : chipBase} onClick={() => setFilter(s)}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <SectionTitle title={`工单列表 (${filtered.length})`} />
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无工单</div>
        ) : (
          <div style={{ display: 'grid', gap: 10, padding: '0 16px 80px' }}>
            {filtered.map((o) => (
              <div key={o.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{o.order_no}</strong>
                  <span style={badgeStyle(o.status)}>{STATUS_LABELS[o.status]}</span>
                </div>
                <p style={{ margin: '8px 0', color: '#57616a', fontSize: 12 }}>
                  {TYPE_LABELS[o.type] ?? o.type} · {o.description || '无描述'}
                </p>
                {o.owner && (
                  <div style={{ fontSize: 11, color: '#57616a', marginBottom: 6, background: '#f5f7fa', padding: '6px 8px', borderRadius: 4 }}>
                    业主：{o.owner.real_name ?? '未命名'} · {o.owner.phone ?? '暂无电话'}
                    {o.house && (
                      <span>
                        {' '}
                        · {o.house.community_name ?? ''} {o.house.building_no ?? ''}-{o.house.room_no ?? ''}
                      </span>
                    )}
                  </div>
                )}
                {o.image_urls && o.image_urls.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                    {o.image_urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="报修图片"
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ))}
                  </div>
                )}
                <p style={{ margin: 0, color: '#8d9497', fontSize: 10 }}>创建时间：{formatTime(o.created_at)}</p>

                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {o.status === 'ASSIGNED' && (
                    <button style={btnPrimary} onClick={() => updateStatus(o.id, 'PROCESSING')}>
                      接单并开始处理
                    </button>
                  )}
                  {o.status === 'PROCESSING' && !o.worker_confirmed_at && (
                    <button style={btnPrimary} onClick={() => handleWorkerConfirm(o.id)}>
                      确认维修完成
                    </button>
                  )}
                  {o.status === 'PROCESSING' && o.worker_confirmed_at && (
                    <button style={btnDefault} disabled>
                      已确认，等待业主确认
                    </button>
                  )}
                  {o.status === 'COMPLETED' && (
                    <button style={btnDefault} onClick={() => updateStatus(o.id, 'CLOSED')}>
                      关闭工单
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav
        active="work"
        labels={['首页', '工单', '消息', '我的']}
        paths={['/repair', '/repair/orders', '/repair/messages', '/repair/profile']}
      />
    </div>
  )
}
