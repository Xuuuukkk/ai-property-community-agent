import { ClipboardList, House, MessageCircle, UserRound } from 'lucide-react'

interface BottomNavProps {
  active: 'home' | 'work' | 'manage' | 'mine'
  labels: string[]
}

const icons = [<House />, <ClipboardList />, <MessageCircle />, <UserRound />]
const keys: BottomNavProps['active'][] = ['home', 'work', 'manage', 'mine']

export default function BottomNav({ active, labels }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {labels.map((label, index) => (
        <button key={label} className={active === keys[index] ? 'active' : ''}>
          {icons[index]}
          <small>{label}</small>
        </button>
      ))}
    </nav>
  )
}
