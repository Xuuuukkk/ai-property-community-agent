import { ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function LogoLockup() {
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

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="page welcome-page">
      <div className="welcome-sky">
        <div className="sun-glow" />
        <div className="welcome-image-wrap">
          <img src="/images/27ffed7dcc44b6b7e9581a558d008486.png" alt="云溪花园社区入口" />
        </div>
        <div className="water-line" />
      </div>
      <div className="welcome-copy">
        <LogoLockup />
        <p>让社区生活更美好</p>
      </div>
      <div className="welcome-actions">
        <button className="primary-button" onClick={() => navigate('/roles')}>
          进入小程序
          <ChevronRight size={17} />
        </button>
        <div className="slogan">—　智慧服务 · 贴心相伴　—</div>
      </div>
    </div>
  )
}
