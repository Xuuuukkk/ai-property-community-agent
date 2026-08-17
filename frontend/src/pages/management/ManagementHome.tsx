import {
  BarChart3,
  Bell,
  BookOpen,
  Camera,
  CircleUserRound,
  ClipboardList,
  Megaphone,
  MessageSquareText,
  Receipt,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { RepairOrder } from '../../api/types'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle, ServiceItem, Stat } from '../../components/common'

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
  ASSIGNED: '已派单',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
  CLOSED: '已关闭',
}

export default function ManagementHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .listRepairs({ page_size: 100 })
      .then((res) => setOrders(res.items))
      .finally(() => setLoading(false))
  }, [])

  const created = orders.filter((o) => o.status === 'CREATED').length
  const processing = orders.filter((o) => o.status === 'ASSIGNED' || o.status === 'PROCESSING').length
  const completed = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'CLOSED').length
  const recent = orders.filter((o) => {
    const d = new Date(o.created_at)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  }).length

  const latestOrders = orders.slice(0, 3)

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="物业管理系统" />
      <div className="dashboard-scroll">
        <div className="profile-card management-card">
          <div className="avatar">
            <CircleUserRound size={40} />
          </div>
          <div>
            <strong>
              {user?.real_name ?? user?.username ?? '管理员'} <small>物业管理员</small>
            </strong>
            <p>物业管理员 欢迎回来</p>
          </div>
          <Bell size={20} />
        </div>

        <SectionTitle title="数据概览" />
        <div className="stat-grid">
          <Stat value={loading ? '-' : String(recent)} label="本周新增" />
          <Stat value={loading ? '-' : String(created)} label="待处理工单" />
          <Stat value={loading ? '-' : String(processing)} label="处理中" />
          <Stat value={loading ? '-' : String(completed)} label="已完成" />
        </div>

        <div className="amount-card blue-tint">
          <div>
            <span>当前在途工单（笔）</span>
            <strong>{loading ? '-' : String(created + processing)}</strong>
          </div>
          <Receipt size={23} />
        </div>

        <SectionTitle title="常用功能" />
        <div className="service-grid four">
          <ServiceItem
            icon={<ClipboardList />}
            label="工单管理"
            onClick={() => navigate('/management/repairs')}
          />
          <ServiceItem
            icon={<UsersRound />}
            label="用户管理"
            onClick={() => navigate('/management/users')}
          />
          <ServiceItem
            icon={<Megaphone />}
            label="公告管理"
            onClick={() => navigate('/management/notices')}
          />
          <ServiceItem
            icon={<Receipt />}
            label="费用管理"
            onClick={() => navigate('/management/fees')}
          />
          <ServiceItem
            icon={<Camera />}
            label="自动巡检"
            onClick={() => navigate('/management/inspection')}
          />
          <ServiceItem
            icon={<MessageSquareText />}
            label="业主上报"
            onClick={() => navigate('/management/issue')}
          />
          <ServiceItem
            icon={<BarChart3 />}
            label="数据统计"
            onClick={() => navigate('/management/stats')}
          />
          <ServiceItem
            icon={<BookOpen />}
            label="知识缺口"
            onClick={() => navigate('/management/knowledge-gaps')}
          />
        </div>

        <SectionTitle title="最新工单" link="查看全部" onLinkClick={() => navigate('/management/repairs')} />
        {latestOrders.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#7e8587', fontSize: 12 }}>
            暂无工单
          </div>
        ) : (
          latestOrders.map((o) => (
            <div key={o.id} className="mini-ticket" onClick={() => navigate(`/management/repairs/${o.id}`)}>
              <span>{o.order_no}</span>
              <b>{STATUS_LABELS[o.status] ?? o.status}</b>
              <p>
                {TYPE_LABELS[o.type] ?? o.type} · {o.description || '无描述'} <time>{formatTime(o.created_at)}</time>
              </p>
            </div>
          ))
        )}
      </div>
      <BottomNav
        active="home"
        labels={['首页', '工单', '管理', '我的']}
        paths={['/management', '/management/repairs', '/management/notices', '/management/profile']}
      />
    </div>
  )
}
