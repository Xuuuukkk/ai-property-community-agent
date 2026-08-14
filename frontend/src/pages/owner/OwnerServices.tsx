import { FileText, Megaphone, Receipt, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'

const services = [
  { icon: <Wrench size={24} />, label: '报修服务', path: '/owner/repairs' },
  { icon: <Receipt size={24} />, label: '费用查询', path: '/owner/fees' },
  { icon: <Megaphone size={24} />, label: '社区公告', path: '/owner/notices' },
  { icon: <FileText size={24} />, label: '我的工单', path: '/owner/repairs' },
]

export default function OwnerServices() {
  const navigate = useNavigate()

  return (
    <div className="page dashboard-page">
      <AppHeader title="全部服务" onBack={() => window.history.back()} />
      <div className="dashboard-scroll">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginTop: 8,
          }}
        >
          {services.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.path)}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                color: '#20324b',
                boxShadow: '0 4px 13px rgba(29,45,66,.05)',
              }}
            >
              <span style={{ color: '#22395e' }}>{s.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav
        active="work"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
