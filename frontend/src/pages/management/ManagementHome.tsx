import {
  Bell,
  CircleUserRound,
  ClipboardList,
  Megaphone,
  Receipt,
  UsersRound,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { NoticeList, SectionTitle, ServiceItem, Stat } from '../../components/common'

export default function ManagementHome() {
  const { user } = useAuth()

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

        <SectionTitle title="数据概览" link="查看更多" />
        <div className="stat-grid">
          <Stat value="12" label="新增报修" />
          <Stat value="18" label="待处理工单" />
          <Stat value="36" label="处理中" />
          <Stat value="45" label="已完成" />
        </div>

        <div className="amount-card blue-tint">
          <div>
            <span>未缴费用总额（元）</span>
            <strong>86,560.00</strong>
          </div>
          <Receipt size={23} />
        </div>

        <SectionTitle title="常用功能" />
        <div className="service-grid four">
          <ServiceItem icon={<ClipboardList />} label="工单管理" />
          <ServiceItem icon={<UsersRound />} label="用户管理" />
          <ServiceItem icon={<Megaphone />} label="公告管理" />
          <ServiceItem icon={<Receipt />} label="费用管理" />
        </div>

        <NoticeList title="最新工单" />

        <div className="mini-ticket">
          <span>RW20250811001</span>
          <b>待处理</b>
          <p>
            2栋1单元1202 · 厨房漏水 <time>08-11 09:30</time>
          </p>
        </div>
      </div>
      <BottomNav active="manage" labels={['首页', '工单', '管理', '我的']} />
    </div>
  )
}
