import { ChevronRight, Sparkles, Wrench } from 'lucide-react'

export function SectionTitle({ title, link }: { title: string; link?: string }) {
  return (
    <div className="section-title">
      <h3>{title}</h3>
      {link && (
        <button>
          {link}
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  )
}

export function ServiceItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="service-item">
      <span>{icon}</span>
      <small>{label}</small>
    </button>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

export function NoticeList({ title }: { title: string }) {
  return (
    <>
      <SectionTitle title={title} link="查看更多" />
      <div className="notice-list">
        <div>
          <span className="notice-tag">置顶</span>
          <b>关于小区停水维修的通知</b>
          <time>08-11</time>
        </div>
        <div>
          <span>通知</span>
          <b>社区夏季活动通知</b>
          <time>08-10</time>
        </div>
        <div>
          <span>通知</span>
          <b>电梯维护保养通知</b>
          <time>08-08</time>
        </div>
      </div>
    </>
  )
}

export function Ticket({
  title,
  code,
  status,
  time,
}: {
  title: string
  code: string
  status: string
  time: string
}) {
  return (
    <div className="ticket">
      <div className="ticket-icon">
        <Wrench size={17} />
      </div>
      <div>
        <strong>{title}</strong>
        <p>
          {code}
          <time>{time}</time>
        </p>
      </div>
      <b>{status}</b>
    </div>
  )
}

export function RoleCard({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  detail: string
  onClick: () => void
}) {
  return (
    <button className="role-card" onClick={onClick}>
      <span className="role-icon">{icon}</span>
      <span className="role-text">
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={18} />
    </button>
  )
}

export function CityIllustration() {
  return (
    <div className="city-illustration">
      <span />
      <span />
      <span />
      <span />
      <i />
      <i />
      <i />
    </div>
  )
}

export function WaveLine() {
  return (
    <div className="wave-line">
      <span />
      <span />
    </div>
  )
}

export function LogoLockup() {
  return (
    <div className="logo-lockup">
      <div className="flower-mark">
        <Sparkles size={32} strokeWidth={1.25} />
      </div>
      <h1>云溪花园</h1>
      <div className="logo-sub">
        <span />
        智慧社区
        <span />
      </div>
    </div>
  )
}
