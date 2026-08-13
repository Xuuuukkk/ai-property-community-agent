import { useNavigate } from 'react-router-dom'
import { BuildingIcon } from '../components/owner/icons'

export default function PortalHome() {
  const navigate = useNavigate()

  return (
    <div className="yx-splash">
      <div className="yx-splash-bg" />
      <div className="yx-splash-content">
        <div className="yx-splash-logo">
          <BuildingIcon />
        </div>
        <h1 className="yx-splash-title">云溪花园</h1>
        <p className="yx-splash-subtitle">智慧社区</p>
        <p className="yx-splash-tagline">让社区生活更美好</p>

        <div className="yx-splash-action">
          <button
            type="button"
            className="yx-btn yx-btn-primary"
            onClick={() => navigate('/role-select')}
          >
            进入小程序
          </button>
        </div>
        <p className="yx-splash-footer">智慧服务 · 贴心相伴</p>
      </div>
    </div>
  )
}
