import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, FeeIcon, NoticeIcon, RepairIcon, TicketIcon } from '../../components/owner/icons'
import OwnerShell from './OwnerShell'

const SERVICES = [
  { key: 'repair', label: '报事服务', desc: '提交维修工单', icon: RepairIcon, path: '/owner/repair' },
  { key: 'fee', label: '费用查询', desc: '查看物业账单', icon: FeeIcon, path: '/owner/fees' },
  { key: 'notice', label: '社区公告', desc: '社区通知消息', icon: NoticeIcon, path: '/owner/notices' },
  { key: 'ticket', label: '我的工单', desc: '跟踪工单进度', icon: TicketIcon, path: '/owner/tickets' },
]

export default function OwnerServices() {
  const navigate = useNavigate()

  return (
    <OwnerShell activeTab="services">
      <div className="yx-page">
        <header className="yx-topbar">
          <button type="button" className="yx-back" onClick={() => navigate('/owner')}>
            <ArrowLeftIcon />
          </button>
          <div className="yx-topbar-title">全部服务</div>
          <div style={{ width: 40 }} />
        </header>

        <main className="yx-main yx-container">
          <section className="yx-card">
            <div className="yx-role-list" style={{ marginTop: 0 }}>
              {SERVICES.map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.key}
                    type="button"
                    className="yx-role-item"
                    onClick={() => navigate(service.path)}
                  >
                    <span className="yx-role-icon">
                      <Icon />
                    </span>
                    <div className="yx-role-info">
                      <div className="yx-role-name">{service.label}</div>
                      <div className="yx-role-desc">{service.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </main>
      </div>
    </OwnerShell>
  )
}
