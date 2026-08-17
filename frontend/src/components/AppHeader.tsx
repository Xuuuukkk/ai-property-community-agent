import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AppHeaderProps {
  title?: string
  onBack?: () => void
  right?: React.ReactNode
}

export default function AppHeader({ title, onBack, right }: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="app-header">
      {onBack ? (
        <button className="icon-button" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>
      ) : (
        <span className="header-spacer" />
      )}
      {title && <h1>{title}</h1>}
      {right ?? <span className="header-spacer" />}
    </header>
  )
}
