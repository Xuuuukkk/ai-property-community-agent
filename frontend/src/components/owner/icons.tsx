import type { JSX } from 'react'

const Icon = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}): JSX.Element => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="24"
    height="24"
  >
    {children}
  </svg>
)

export const HomeIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Icon>
)

export const RepairIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.55-3.55a3 3 0 0 1 0 4.24l-6.4 6.4a3 3 0 0 1-4.24 0l-1.6-1.6a1 1 0 0 0-1.4 0L3.8 18.2a1 1 0 0 0 0 1.4l2.4 2.4a1 1 0 0 0 1.4 0l5.65-5.65" />
  </Icon>
)

export const FeeIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M6 10h12" />
    <path d="M6 14h8" />
  </Icon>
)

export const NoticeIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
)

export const TicketIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </Icon>
)

export const AiIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M8 8V4h8v4" />
    <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
    <path d="M9 18h6" />
  </Icon>
)

export const ChatIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Icon>
)

export const ProfileIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
)

export const ServiceIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </Icon>
)

export const BellIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
)

export const ArrowRightIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </Icon>
)

export const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </Icon>
)

export const EyeIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)

export const EyeOffIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94l9.88 9.88z" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.4-6.4z" />
    <path d="M1 1l22 22" />
  </Icon>
)

export const UserIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
)

export const LockIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
)

export const QrIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </Icon>
)

export const SendIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </Icon>
)

export const BuildingIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-2" />
    <path d="M9 9h1" />
    <path d="M9 13h1" />
    <path d="M9 17h1" />
  </Icon>
)
