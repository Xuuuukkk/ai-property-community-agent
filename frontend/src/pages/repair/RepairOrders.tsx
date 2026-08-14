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

const URGENCY_LABELS: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
}

const URGENCY_COLORS: Record<string, { bg: string; color: string }> = {
  LOW: { bg: '#e8edf0', color: '#57616a' },
  MEDIUM: { bg: '#f5ecd7', color: '#ad8a45' },
  HIGH: { bg: '#fde8e8', color: '#c0392b' },
  URGENT: { bg: '#fadbd8', color: '#922b21' },
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
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 2px 8px rgba(29,45,66,.05)',
}

const badgeStyle = (status: string): React.CSSProperties => ({
  fontSize: 11,
  padding: '4px 8px',
  borderRadius: 6,
  fontWeight: 500,
  background: status === 'ASSIGNED' ? '#f5ecd7' : status === 'PROCESSING' ? '#e9effb' : '#e8edf0',
  color: status === 'ASSIGNED' ? '#ad8a45' : status === 'PROCESSING' ? '#203b63' : '#57616a',
})

const tagStyle = (urgency: string): React.CSSProperties => ({
  fontSize: 10,
  padding: '2px 6px',
  borderRadius: 4,
  fontWeight: 500,
  background: URGENCY_COLORS[urgency]?.bg || '#e8edf0',
  color: URGENCY_COLORS[urgency]?.color || '#57616a',
})

const btnPrimary: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  fontSize: 12,
  background: '#22395e',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
}

const btnDefault: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  fontSize: 12,
  background: '#f0f1ef',
  color: '#20324b',
  border: 'none',
  cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  color: '#8d9497',
  fontSize: 11,
  width: 42,
  flexShrink: 0,
}

const valueStyle: React.CSSProperties = {
  color: '#20324b',
  fontSize: 12,
  fontWeight: 500,
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

  const formatAddress = (house: RepairOrder['house']) => {
    if (!house) return '暂无地址'
    const building = house.building_no || ''
    const unit = house.unit_no
    const floor = house.floor_no
    // room_no is stored as "B3-2U-15F-01"; derive the room suffix when possible.
    const roomSuffix = (house.room_no || '').split('-').pop() || ''

    const parts: string[] = []
    if (building) parts.push(`${building}栋`)
    if (unit) parts.push(`${unit}单元`)
    if (floor) parts.push(`${floor}楼`)
    if (roomSuffix) parts.push(`${roomSuffix}室`)

    return parts.length > 0 ? parts.join('') : house.room_no || '暂无地址'
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
          <div style={{ display: 'grid', gap: 12, padding: '0 16px 80px' }}>
            {filtered.map((o) => (
              <div key={o.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: 14, color: '#1a2b3c', wordBreak: 'break-all' }}>{o.order_no}</strong>
                  <span style={badgeStyle(o.status)}>{STATUS_LABELS[o.status]}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
                  <span style={{ fontSize: 12, color: '#57616a' }}>{TYPE_LABELS[o.type] ?? o.type}</span>
                  <span style={tagStyle(o.urgency)}>{URGENCY_LABELS[o.urgency] ?? o.urgency}</span>
                </div>

                <p style={{ margin: '0 0 12px', color: '#20324b', fontSize: 13, lineHeight: 1.5 }}>
                  {o.description || '无描述'}
                </p>

                <div
                  style={{
                    background: '#f7f9fb',
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 12,
                    display: 'grid',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={labelStyle}>业主</span>
                    <span style={valueStyle}>{o.owner?.real_name ?? '未命名'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={labelStyle}>电话</span>
                    <span style={valueStyle}>{o.owner?.phone ?? '暂无电话'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={labelStyle}>地址</span>
                    <span style={{ ...valueStyle, flex: 1, lineHeight: 1.4 }}>{formatAddress(o.house)}</span>
                  </div>
                </div>

                {o.image_urls && o.image_urls.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    {o.image_urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="报修图片"
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6 }}
                      />
                    ))}
                  </div>
                )}

                <p style={{ margin: '0 0 12px', color: '#8d9497', fontSize: 11 }}>创建时间：{formatTime(o.created_at)}</p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
