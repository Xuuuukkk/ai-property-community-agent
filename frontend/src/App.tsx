import { useMemo, useState } from 'react'
import FeeList from './components/FeeList'
import NoticeBoard from './components/NoticeBoard'
import RepairList from './components/RepairList'
import UserSearch from './components/UserSearch'

type Tab = 'repair' | 'user' | 'fee' | 'notice'

const NAV_ITEMS: Array<{
  key: Tab
  label: string
  description: string
  icon: string
}> = [
  { key: 'repair', label: '维修工单', description: '报修创建与进度跟踪', icon: 'R' },
  { key: 'user', label: '业主查询', description: '业主资料与身份信息', icon: 'U' },
  { key: 'fee', label: '物业费用', description: '账单周期与缴费状态', icon: 'F' },
  { key: 'notice', label: '公告通知', description: '社区公告发布管理', icon: 'N' },
]

const PAGE_META: Record<Tab, { title: string; eyebrow: string; helper: string }> = {
  repair: {
    title: '维修工单中心',
    eyebrow: 'Service Desk',
    helper: '统一受理业主报修，按状态筛选、翻页查看并创建新工单。',
  },
  user: {
    title: '业主档案查询',
    eyebrow: 'Resident Profile',
    helper: '通过用户 ID 快速核验业主基础资料与联系方式。',
  },
  fee: {
    title: '物业费用账单',
    eyebrow: 'Billing',
    helper: '查询指定业主的物业费、周期账单、缴费状态与到期日期。',
  },
  notice: {
    title: '公告通知管理',
    eyebrow: 'Notice Board',
    helper: '发布社区公告，并查看置顶、状态、类型与发布时间。',
  },
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('repair')

  const activeMeta = PAGE_META[activeTab]
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(new Date()),
    [],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <h1>智慧物业</h1>
            <p>社区智能体平台</p>
          </div>
        </div>

        <nav className="side-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`side-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
              type="button"
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          后端 API 通过 /api 代理
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{activeMeta.eyebrow}</span>
            <h2>{activeMeta.title}</h2>
            <p>{activeMeta.helper}</p>
          </div>
          <div className="operator-card" aria-label="今日值班信息">
            <span>今日</span>
            <strong>{today}</strong>
            <small>物业运营台</small>
          </div>
        </header>

        <section className="metric-strip" aria-label="平台概览">
          <div className="metric">
            <span>业务模块</span>
            <strong>4</strong>
          </div>
          <div className="metric">
            <span>接口入口</span>
            <strong>/api</strong>
          </div>
          <div className="metric">
            <span>当前视图</span>
            <strong>{activeMeta.title}</strong>
          </div>
        </section>

        <section className="content-area">
          {activeTab === 'repair' && <RepairList />}
          {activeTab === 'user' && <UserSearch />}
          {activeTab === 'fee' && <FeeList />}
          {activeTab === 'notice' && <NoticeBoard />}
        </section>
      </main>
    </div>
  )
}
