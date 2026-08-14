import {
  CircleUserRound,
  FileText,
  Megaphone,
  MessageCircle,
  Receipt,
  ScanLine,
  Wrench,
} from 'lucide-react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { NoticeList, SectionTitle, ServiceItem } from '../../components/common'
import { useAuth } from '../../contexts/AuthContext'

export default function OwnerHome() {
  const { user } = useAuth()

  return (
    <div className="page dashboard-page">
      <AppHeader title="云溪花园智慧社区" />
      <div className="dashboard-scroll">
        <div className="profile-card">
          <div className="avatar">
            <CircleUserRound size={40} />
          </div>
          <div>
            <strong>
              {user?.real_name ?? user?.username ?? '业主'} <small>业主</small>
            </strong>
            <p>欢迎回到云溪花园</p>
          </div>
          <ScanLine size={21} />
        </div>

        <div className="amount-card">
          <div>
            <span>未缴费用总额（元）</span>
            <strong>1,280.00</strong>
          </div>
          <button>去缴费</button>
        </div>

        <SectionTitle title="快捷服务" />
        <div className="service-grid four">
          <ServiceItem icon={<Wrench />} label="报修服务" />
          <ServiceItem icon={<Receipt />} label="费用查询" />
          <ServiceItem icon={<Megaphone />} label="社区公告" />
          <ServiceItem icon={<FileText />} label="我的工单" />
        </div>

        <NoticeList title="社区公告" />

        <div className="ai-card">
          <div>
            <strong>AI 社区助手</strong>
            <p>有问题？问问社区助手</p>
          </div>
          <div className="bot-bubble">
            <MessageCircle size={27} />
          </div>
        </div>
      </div>
      <BottomNav active="home" labels={['首页', '服务', 'AI助手', '我的']} />
    </div>
  )
}
