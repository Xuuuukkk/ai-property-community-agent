import { useState } from 'react'
import FeeList from './components/FeeList'
import NoticeBoard from './components/NoticeBoard'
import RepairList from './components/RepairList'
import UserSearch from './components/UserSearch'

type Tab = 'user' | 'repair' | 'fee' | 'notice'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('repair')

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-title">AI 物业社区管理平台</h1>
          <p className="app-subtitle">业主 · 维修 · 费用 · 公告一站式管理</p>
        </div>
      </header>

      <nav className="nav-tabs">
        {([
          { key: 'repair', label: '维修工单' },
          { key: 'user', label: '业主查询' },
          { key: 'fee', label: '物业费用' },
          { key: 'notice', label: '公告通知' },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'user' && <UserSearch />}
      {activeTab === 'repair' && <RepairList />}
      {activeTab === 'fee' && <FeeList />}
      {activeTab === 'notice' && <NoticeBoard />}
    </>
  )
}
