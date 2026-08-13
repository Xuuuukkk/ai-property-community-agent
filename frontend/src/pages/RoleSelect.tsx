import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ArrowLeftIcon, HomeIcon, RepairIcon, UserIcon } from '../components/owner/icons'
import type { UserRole } from '../contexts/AuthContext'

const ROLES: Array<{
  key: UserRole
  label: string
  desc: string
  icon: typeof HomeIcon
}> = [
  { key: 'OWNER', label: '业主', desc: '享受便捷的社区服务', icon: HomeIcon },
  { key: 'PROPERTY_STAFF', label: '物业人员', desc: '管理社区运营事务', icon: UserIcon },
  { key: 'WORKER', label: '维修人员', desc: '处理维修工单任务', icon: RepairIcon },
]

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <div className="yx-role-page">
      <div className="yx-topbar">
        <button type="button" className="yx-back" onClick={() => navigate('/')}>
          <ArrowLeftIcon />
        </button>
        <div />
      </div>

      <div className="yx-container">
        <div className="yx-login-header">
          <h1 className="yx-login-title">选择您的身份</h1>
          <p className="yx-login-subtitle">请选择登录的身份</p>
        </div>

        <div className="yx-role-list">
          {ROLES.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.key}
                type="button"
                className="yx-role-item"
                onClick={() => navigate(`/login?role=${role.key}`)}
              >
                <span className="yx-role-icon">
                  <Icon />
                </span>
                <div className="yx-role-info">
                  <div className="yx-role-name">{role.label}</div>
                  <div className="yx-role-desc">{role.desc}</div>
                </div>
                <span className="yx-role-arrow">
                  <ArrowRightIcon />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
