import { ClipboardList, House, MessageCircle, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BottomNavProps {
  active: 'home' | 'work' | 'manage' | 'mine'
  labels: string[]
  paths?: string[]
}

const icons = [<House />, <ClipboardList />, <MessageCircle />, <UserRound />]
const keys: BottomNavProps['active'][] = ['home', 'work', 'manage', 'mine']

export default function BottomNav({ active, labels, paths }: BottomNavProps) {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {labels.map((label, index) => (
        <button
          key={label}
          className={active === keys[index] ? 'active' : ''}
          onClick={() => {
            if (paths?.[index] && paths[index] !== window.location.pathname) {
              navigate(paths[index])
            }
          }}
        >
          {icons[index]}
          <small>{label}</small>
        </button>
      ))}
    </nav>
  )
}
