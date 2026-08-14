import { BriefcaseBusiness, House, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { CityIllustration, RoleCard } from '../components/common'

export default function RoleSelectPage() {
  const navigate = useNavigate()

  return (
    <div className="page art-page">
      <AppHeader onBack={() => navigate('/')} />
      <div className="roles-copy">
        <h2>选择您的身份</h2>
        <p>请选择登录的身份</p>
      </div>
      <div className="role-list">
        <RoleCard
          icon={<House />}
          title="业主"
          detail="享受便捷的社区服务"
          onClick={() => navigate('/login')}
        />
        <RoleCard
          icon={<BriefcaseBusiness />}
          title="物业人员"
          detail="管理社区日常事务"
          onClick={() => navigate('/login')}
        />
        <RoleCard
          icon={<Wrench />}
          title="维修人员"
          detail="接收任务，完成维修"
          onClick={() => navigate('/login')}
        />
      </div>
      <CityIllustration />
    </div>
  )
}
