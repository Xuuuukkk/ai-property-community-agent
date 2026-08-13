import { useNavigate } from 'react-router-dom'
import { HomeIcon, RepairIcon, TicketIcon } from '../components/owner/icons'

const PORTALS = [
  { title: '业主端', desc: '报修、查费、公告、工单', role: 'OWNER', icon: HomeIcon },
  { title: '维修人员端', desc: '接单、处理、流转', role: 'WORKER', icon: RepairIcon },
  { title: '物业管理端', desc: '后台管理与配置', role: 'PROPERTY_STAFF', icon: TicketIcon },
] as const

export default function PortalHome() {
  const navigate = useNavigate()

  return (
    <div className="owner-page" style={{ background: '#f7f8fa' }}>
      <main className="owner-main">
        <section className="owner-workspace-head" style={{ paddingTop: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <span className="owner-eyebrow">YUNXI GARDEN</span>
            <h2 style={{ marginTop: 8 }}>云溪花园</h2>
            <p>智慧社区 · 美好生活</p>
          </div>
        </section>

        <section className="owner-panel">
          <div className="owner-list">
            {PORTALS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.title}
                  type="button"
                  className="owner-list-item"
                  onClick={() => navigate(`/login?role=${item.role}`)}
                  style={{ textAlign: 'left' }}
                >
                  <div className="owner-list-top">
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <span className="owner-workspace-hero-icon">
                      <Icon />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
