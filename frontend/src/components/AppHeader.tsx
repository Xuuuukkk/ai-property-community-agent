import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AppHeaderProps {
  title?: string
  onBack?: () => void
}

export default function AppHeader({ title, onBack }: AppHeaderProps) {
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
      <span className="header-spacer" />
    </header>
  )
}
