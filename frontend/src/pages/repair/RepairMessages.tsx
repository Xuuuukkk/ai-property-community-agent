import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'

export default function RepairMessages() {
  const navigate = useNavigate()

  return (
    <div className="page dashboard-page">
      <AppHeader title="消息" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div style={{ padding: 60, textAlign: 'center', color: '#7e8587', fontSize: 13 }}>
          暂无新消息
        </div>
      </div>
      <BottomNav
        active="manage"
        labels={['首页', '工单', '消息', '我的']}
        paths={['/repair', '/repair/orders', '/repair/messages', '/repair/profile']}
      />
    </div>
  )
}
