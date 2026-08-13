import type { JSX } from 'react'

export const BellIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export const AiIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 8V4H8" />
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M9 15h6" />
  </svg>
)

export const ArrowRightIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
)

export const ArrowLeftIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
)

export const SendIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
)

export const RepairIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.55-3.55a3 3 0 0 1 0 4.24l-6.4 6.4a3 3 0 0 1-4.24 0l-1.6-1.6a1 1 0 0 0-1.4 0L3.8 18.2a1 1 0 0 0 0 1.4l2.4 2.4a1 1 0 0 0 1.4 0l5.65-5.65" />
  </svg>
)

export const FeeIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M6 10h12M6 14h8" />
  </svg>
)

export const NoticeIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
    <path d="M8 11h8M8 15h5" />
  </svg>
)

export const TicketIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

export const HomeIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
)

export const ChatIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 13h8M9 9h6M8 17h8" />
  </svg>
)

export const ProfileIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
