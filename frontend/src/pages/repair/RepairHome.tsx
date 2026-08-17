import { Bell, Wrench } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { RepairOrder } from '../../api/types'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import NotificationBell from '../../components/NotificationBell'
import BottomNav from '../../components/BottomNav'
import { SectionTitle, Stat, Ticket } from '../../components/common'

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

export default function RepairHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.worker_id) return
    api
      .listRepairs({ worker_id: user.worker_id, page_size: 100 })
      .then((res) => setOrders(res.items))
      .finally(() => setLoading(false))
  }, [user?.worker_id])

  const assigned = useMemo(
    () => orders.filter((o) => o.status === 'ASSIGNED'),
    [orders]
  )
  const processing = useMemo(
    () => orders.filter((o) => o.status === 'PROCESSING'),
    [orders]
  )
  const completed = useMemo(
    () => orders.filter((o) => o.status === 'COMPLETED' || o.status === 'CLOSED'),
    [orders]
  )

  const pendingOrders = useMemo(
    () => [...assigned, ...processing].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5),
    [assigned, processing]
  )

  const isToday = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }

  const todayOrders = useMemo(() => orders.filter((o) => isToday(o.created_at)), [orders])
  const todayPending = useMemo(
    () => todayOrders.filter((o) => o.status === 'ASSIGNED' || o.status === 'PROCESSING'),
    [todayOrders]
  )
  const todayCompleted = useMemo(
    () => todayOrders.filter((o) => o.status === 'COMPLETED' || o.status === 'CLOSED'),
    [todayOrders]
  )

  const todayCompletionRate = useMemo(() => {
    const total = todayOrders.length
    if (total === 0) return 0
    return Math.round((todayCompleted.length / total) * 100)
  }, [todayOrders, todayCompleted])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="维修工作台" right={<NotificationBell />} />
      <div className="dashboard-scroll">
        <div className="profile-card repair-card">
          <div className="avatar">
            <Wrench size={35} />
          </div>
          <div>
            <strong>
              {user?.real_name ?? user?.username ?? '维修师傅'} <small>维修人员</small>
            </strong>
            <p>今天也要高效完成任务</p>
          </div>
          <Bell size={20} />
        </div>

        <div className="repair-highlight">
          <div>
            <span>今日待办</span>
            <strong>
              {loading ? '-' : String(todayPending.length)} <small>项维修任务</small>
            </strong>
          </div>
          <div
            className="progress-ring"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap' }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>
              {loading ? '-' : todayCompletionRate}
              <small>%</small>
            </span>
          </div>
        </div>

        <SectionTitle title="任务状态" link="全部任务" onLinkClick={() => navigate('/repair/orders')} />
        <div className="stat-grid repair-stats">
          <Stat value={loading ? '-' : String(assigned.length)} label="待接单" />
          <Stat value={loading ? '-' : String(processing.length)} label="处理中" />
          <Stat value={loading ? '-' : String(completed.length)} label="已完成" />
        </div>

        <SectionTitle title="待处理工单" link="查看更多" onLinkClick={() => navigate('/repair/orders')} />
        <div className="ticket-list">
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
          ) : pendingOrders.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无待处理工单</div>
          ) : (
            pendingOrders.map((o) => (
              <Ticket
                key={o.id}
                title={TYPE_LABELS[o.type] ?? o.type}
                code={o.order_no}
                status={STATUS_LABELS[o.status] ?? o.status}
                time={formatTime(o.created_at)}
                onClick={() => navigate(`/repair/orders/${o.id}`)}
              />
            ))
          )}
        </div>
      </div>
      <BottomNav
        active="home"
        labels={['首页', '工单', '消息', '我的']}
        paths={['/repair', '/repair/orders', '/repair/messages', '/repair/profile']}
      />
    </div>
  )
}
