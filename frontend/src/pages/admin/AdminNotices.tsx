import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../../components/owner/icons'
import NoticeBoard from '../../components/NoticeBoard'
import AdminShell from './AdminShell'

export default function AdminNotices() {
  const navigate = useNavigate()

  return (
    <AdminShell activeTab="notices">
      <div className="yx-page">
        <header className="yx-topbar">
          <button type="button" className="yx-back" onClick={() => navigate('/admin')}>
            <ArrowLeftIcon />
          </button>
          <div className="yx-topbar-title">公告管理</div>
          <div style={{ width: 40 }} />
        </header>

        <main className="yx-main yx-container">
          <div className="yx-card" style={{ padding: 12 }}>
            <NoticeBoard />
          </div>
        </main>
      </div>
    </AdminShell>
  )
}
