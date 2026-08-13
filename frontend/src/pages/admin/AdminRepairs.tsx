import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../../components/owner/icons'
import RepairList from '../../components/RepairList'
import AdminShell from './AdminShell'

export default function AdminRepairs() {
  const navigate = useNavigate()

  return (
    <AdminShell activeTab="repairs">
      <div className="yx-page">
        <header className="yx-topbar">
          <button type="button" className="yx-back" onClick={() => navigate('/admin')}>
            <ArrowLeftIcon />
          </button>
          <div className="yx-topbar-title">维修工单</div>
          <div style={{ width: 40 }} />
        </header>

        <main className="yx-main yx-container">
          <div className="yx-card" style={{ padding: 12 }}>
            <RepairList />
          </div>
        </main>
      </div>
    </AdminShell>
  )
}
