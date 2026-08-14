import { Bell, Wrench } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle, Stat, Ticket } from '../../components/common'

export default function RepairHome() {
  const { user } = useAuth()

  return (
    <div className="page dashboard-page">
      <AppHeader title="维修工作台" />
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
              8 <small>项维修任务</small>
            </strong>
          </div>
          <div className="progress-ring">
            68<small>%</small>
          </div>
        </div>

        <SectionTitle title="任务状态" link="全部任务" />
        <div className="stat-grid repair-stats">
          <Stat value="3" label="待接单" />
          <Stat value="2" label="处理中" />
          <Stat value="3" label="已完成" />
        </div>

        <SectionTitle title="待处理工单" link="查看更多" />
        <div className="ticket-list">
          <Ticket title="厨房水龙头漏水" code="RW20250811001" status="待接单" time="08-11 09:30" />
          <Ticket title="电梯按钮故障" code="RW20250811002" status="处理中" time="08-11 09:15" />
          <Ticket title="楼道灯维修" code="RW20250811003" status="待接单" time="08-11 08:42" />
        </div>
      </div>
      <BottomNav active="work" labels={['首页', '工单', '消息', '我的']} />
    </div>
  )
}
