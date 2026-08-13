import { useMemo, useState, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AiIcon,
  ArrowRightIcon,
  BellIcon,
  ChatIcon,
  FeeIcon,
  HomeIcon,
  NoticeIcon,
  ProfileIcon,
  RepairIcon,
  TicketIcon,
} from '../../components/owner/icons'
import './OwnerHome.css'

type TabKey = 'home' | 'ai' | 'repair' | 'notice' | 'profile'

const QUICK_SERVICES = [
  { key: 'repair', label: '报修', icon: RepairIcon },
  { key: 'fee', label: '查费', icon: FeeIcon },
  { key: 'notice', label: '公告', icon: NoticeIcon },
  { key: 'ticket', label: '我的工单', icon: TicketIcon },
] as const

const BOTTOM_TABS: { key: TabKey; label: string; icon: ({ className }: { className?: string }) => JSX.Element }[] = [
  { key: 'home', label: '首页', icon: HomeIcon },
  { key: 'ai', label: 'AI', icon: ChatIcon },
  { key: 'repair', label: '报修', icon: RepairIcon },
  { key: 'notice', label: '公告', icon: NoticeIcon },
  { key: 'profile', label: '我的', icon: ProfileIcon },
]

const NOTICES = [
  {
    id: 1,
    title: '本周六下午社区消防演练',
    date: '2026-08-12',
    category: '安全',
    unread: true,
  },
  {
    id: 2,
    title: '电梯维保通知：8月15日上午停梯',
    date: '2026-08-11',
    category: '设施',
    unread: false,
  },
]

export default function OwnerHome() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [unpaidAmount] = useState<number>(716.8)
  const [overdueAmount] = useState<number>(0)

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date()),
    [],
  )

  const handleServiceClick = (key: string) => {
    if (key === 'fee') {
      navigate('/owner/fees')
      return
    }
    if (key === 'ticket') {
      navigate('/owner/tickets')
      return
    }
    navigate(`/owner/${key}`)
  }

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key)
    if (key === 'home') {
      navigate('/owner')
    } else {
      navigate(`/owner/${key}`)
    }
  }

  return (
    <div className="owner-page">
      <header className="owner-header">
        <div className="owner-header-deco owner-header-deco-1" />
        <div className="owner-header-deco owner-header-deco-2" />
        <div className="owner-header-top">
          <div>
            <div className="owner-brand-tag">YUNXI GARDEN</div>
            <h1 className="owner-brand-name">云溪花园</h1>
            <p className="owner-brand-slogan">智慧社区 · 美好生活</p>
          </div>
          <div className="owner-header-actions">
            <button className="owner-bell" type="button" aria-label="通知">
              <BellIcon />
              <span className="owner-bell-dot" />
            </button>
            <span className="owner-header-date">{today}</span>
          </div>
        </div>
      </header>

      <section className="owner-user-card">
        <div className="owner-avatar">张</div>
        <div className="owner-user-info">
          <h3>张先生，欢迎回家</h3>
          <p>3栋2单元 1201 · 业主</p>
        </div>
      </section>

      <section className="owner-card">
        <button
          className="owner-ai-card"
          type="button"
          onClick={() => navigate('/owner/ai')}
        >
          <span className="owner-ai-icon">
            <AiIcon />
          </span>
          <div className="owner-ai-text">
            <h3>AI 社区助手</h3>
            <p>报修、查费、公告，一句话搞定</p>
          </div>
          <span className="owner-ai-arrow">
            <ArrowRightIcon />
          </span>
        </button>
      </section>

      <section className="owner-card">
        <div className="owner-card-header">
          <span className="owner-card-title">快捷服务</span>
        </div>
        <div className="owner-services-grid">
          {QUICK_SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.key}
                className="owner-service-item"
                type="button"
                onClick={() => handleServiceClick(service.key)}
              >
                <span className="owner-service-icon">
                  <Icon />
                </span>
                <span>{service.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="owner-card">
        <div className="owner-card-header">
          <span className="owner-card-title">费用概览</span>
          <button
            className="owner-card-link"
            type="button"
            onClick={() => navigate('/owner/fees')}
          >
            明细 →
          </button>
        </div>
        <div className="owner-fee-grid">
          <div className="owner-fee-box">
            <div className="owner-fee-label">未缴账单</div>
            <div className="owner-fee-amount primary">¥{unpaidAmount.toFixed(2)}</div>
            <div className="owner-fee-desc">2 笔待缴</div>
          </div>
          <div className="owner-fee-box">
            <div className="owner-fee-label">逾期</div>
            <div className={`owner-fee-amount ${overdueAmount > 0 ? 'primary' : 'zero'}`}>
              ¥{overdueAmount.toFixed(2)}
            </div>
            <div className="owner-fee-desc">
              {overdueAmount > 0 ? '请尽快缴纳' : '暂无逾期'}
            </div>
          </div>
        </div>
      </section>

      <section className="owner-card">
        <div className="owner-card-header">
          <span className="owner-card-title">最近公告</span>
          <button
            className="owner-card-link"
            type="button"
            onClick={() => navigate('/owner/notices')}
          >
            全部 →
          </button>
        </div>
        {NOTICES.map((notice, index) => (
          <div key={notice.id}>
            <div className="owner-notice-item">
              <span
                className={`owner-notice-dot ${notice.unread ? '' : 'read'}`}
              />
              <div className="owner-notice-content">
                <h4>{notice.title}</h4>
                <p>
                  {notice.date} · {notice.category}
                </p>
              </div>
            </div>
            {index < NOTICES.length - 1 && <div className="owner-notice-divider" />}
          </div>
        ))}
      </section>

      <nav className="owner-bottom-tab" aria-label="底部导航">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              className={`owner-tab-item ${activeTab === tab.key ? 'active' : ''}`}
              type="button"
              onClick={() => handleTabClick(tab.key)}
            >
              <span className="owner-tab-icon">
                <Icon />
              </span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
