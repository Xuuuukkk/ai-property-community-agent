import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AiIcon,
  ArrowRightIcon,
  BellIcon,
  FeeIcon,
  HomeIcon,
  NoticeIcon,
  ProfileIcon,
  QrIcon,
  RepairIcon,
  TicketIcon,
} from '../../components/owner/icons'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import type { Notice } from '../../api/types'
import AdminShell from './AdminShell'

const DATA_SERVICES = [
  { key: 'repair', label: '物业管家', icon: RepairIcon, path: '/admin/repairs' },
  { key: 'fee', label: '物业缴费', icon: FeeIcon, path: '/admin/desk?tab=fee' },
  { key: 'notice', label: '最新工单', icon: NoticeIcon, path: '/admin/repairs' },
  { key: 'ticket', label: '最新工单', icon: TicketIcon, path: '/admin/repairs' },
]

const NOTICES_MOCK: Notice[] = [
  {
    id: 1,
    title: '关于小区公共区域消杀的通知',
    content: '',
    publisher_id: 1,
    notice_type: '安全通知',
    is_pinned: true,
    status: 'PUBLISHED',
    created_at: '2026-08-10',
  },
  {
    id: 2,
    title: '6月电梯维护保养安排公告',
    content: '',
    publisher_id: 1,
    notice_type: '设施通知',
    is_pinned: false,
    status: 'PUBLISHED',
    created_at: '2026-08-09',
  },
  {
    id: 3,
    title: '端午节放假及温馨提示',
    content: '',
    publisher_id: 1,
    notice_type: '社区活动',
    is_pinned: false,
    status: 'PUBLISHED',
    created_at: '2026-08-08',
  },
]

export default function AdminHome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats] = useState({ todo: 12, doing: 28, done: 45, pending: 8 })
  const [notices, setNotices] = useState<Notice[]>(NOTICES_MOCK)

  useEffect(() => {
    api
      .listNotices({ page_size: 3 })
      .then((res) => {
        if (res.items.length > 0) setNotices(res.items.slice(0, 3))
      })
      .catch(() => {
        // keep mock data
      })
  }, [])

  const displayName = user?.real_name || user?.username || '管理员'

  return (
    <AdminShell activeTab="home">
      <div className="yx-page">
        <header className="yx-topbar">
          <div className="yx-topbar-title">物业管理系统</div>
          <button type="button" className="yx-bell" aria-label="通知">
            <BellIcon />
            <span className="yx-bell-dot" />
          </button>
        </header>

        <main className="yx-main yx-container">
          <div className="yx-profile-card yx-mb-12">
            <div className="yx-avatar">{displayName.charAt(0)}</div>
            <div className="yx-profile-info">
              <div className="yx-profile-name">
                {displayName}
                <span className="yx-profile-role">管理员</span>
              </div>
              <div className="yx-profile-meta">物业管理人员 欢迎回来</div>
            </div>
            <button type="button" className="yx-profile-extra" aria-label="二维码">
              <QrIcon />
            </button>
          </div>

          <section className="yx-card yx-mb-12">
            <div className="yx-fee-row">
              <div>
                <div className="yx-fee-label">未缴费用总额（元）</div>
                <div className="yx-fee-amount">1,280.00</div>
              </div>
              <button
                type="button"
                className="yx-btn yx-btn-accent"
                style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
                onClick={() => navigate('/admin/desk?tab=fee')}
              >
                去催缴
              </button>
            </div>
          </section>

          <section className="yx-card yx-mb-12">
            <div className="yx-card-title">数据概览</div>
            <div className="yx-stat-grid">
              <div className="yx-stat-item">
                <div className="yx-stat-value">{stats.todo}</div>
                <div className="yx-stat-label">新增报修</div>
              </div>
              <div className="yx-stat-item">
                <div className="yx-stat-value">{stats.doing}</div>
                <div className="yx-stat-label">处理中</div>
              </div>
              <div className="yx-stat-item">
                <div className="yx-stat-value">{stats.done}</div>
                <div className="yx-stat-label">已完成</div>
              </div>
              <div className="yx-stat-item">
                <div className="yx-stat-value">{stats.pending}</div>
                <div className="yx-stat-label">待处理</div>
              </div>
            </div>
          </section>

          <section className="yx-card yx-mb-12">
            <div className="yx-card-title">数据服务</div>
            <div className="yx-services-grid">
              {DATA_SERVICES.map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.key}
                    type="button"
                    className="yx-service-item"
                    onClick={() => navigate(service.path)}
                  >
                    <span className="yx-service-icon">
                      <Icon />
                    </span>
                    <span>{service.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="yx-card yx-mb-12">
            <div className="yx-card-title">
              快用公告
              <button type="button" className="yx-card-link" onClick={() => navigate('/admin/desk?tab=notice')}>
                查看更多 <ArrowRightIcon />
              </button>
            </div>
            <div className="yx-notice-list">
              {notices.map((notice) => (
                <div key={notice.id} className="yx-notice-item">
                  <span className="yx-notice-tag">{notice.notice_type}</span>
                  <div className="yx-notice-content">
                    <div className="yx-notice-title">{notice.title}</div>
                  </div>
                  <div className="yx-notice-date">{notice.created_at.slice(5, 10)}</div>
                </div>
              ))}
            </div>
          </section>

          <button type="button" className="yx-ai-card" onClick={() => navigate('/admin/desk?tab=notice')}>
            <span className="yx-ai-icon">
              <AiIcon />
            </span>
            <div className="yx-ai-text">
              <div className="yx-ai-title">AI 社区助手</div>
              <div className="yx-ai-desc">智能帮手，提高社区管理效率</div>
            </div>
            <span style={{ color: '#687280' }}>
              <ArrowRightIcon />
            </span>
          </button>
        </main>
      </div>
    </AdminShell>
  )
}
