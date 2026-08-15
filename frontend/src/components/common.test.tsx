import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoticeList, Ticket, RoleCard, Stat, SectionTitle } from './common'
import type { Notice } from '../api/types'

describe('NoticeList', () => {
  const notices: Notice[] = [
    {
      id: 1,
      title: '停水通知',
      content: '明日停水',
      publisher_id: 1,
      notice_type: 'water_power_outage',
      is_pinned: true,
      status: 'PUBLISHED',
      created_at: '2026-08-15T10:00:00',
    },
    {
      id: 2,
      title: '电梯维护',
      content: '定期维护',
      publisher_id: 1,
      notice_type: 'elevator_maintenance',
      is_pinned: false,
      status: 'PUBLISHED',
      created_at: '2026-08-14T10:00:00',
    },
  ]

  it('renders a loading state', () => {
    render(<NoticeList title="公告" loading />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('renders empty state when no notices', () => {
    render(<NoticeList title="公告" notices={[]} />)
    expect(screen.getByText('暂无公告')).toBeInTheDocument()
  })

  it('renders pinned tag and title', () => {
    render(<NoticeList title="公告" notices={notices} />)
    expect(screen.getByText('停水通知')).toBeInTheDocument()
    expect(screen.getByText('置顶')).toBeInTheDocument()
    expect(screen.getByText('电梯维护')).toBeInTheDocument()
  })

  it('caps the list at three notices', () => {
    const many = Array.from({ length: 5 }, (_, i) => ({
      ...notices[0],
      id: i + 1,
      title: `公告 ${i + 1}`,
      is_pinned: false,
    }))
    render(<NoticeList title="公告" notices={many} />)
    expect(screen.getByText('公告 1')).toBeInTheDocument()
    expect(screen.getByText('公告 3')).toBeInTheDocument()
    expect(screen.queryByText('公告 4')).not.toBeInTheDocument()
  })
})

describe('Ticket', () => {
  it('renders title, code, status, and time', () => {
    render(<Ticket title="水龙头漏水" code="RO123" status="ASSIGNED" time="2026-08-15" />)
    expect(screen.getByText('水龙头漏水')).toBeInTheDocument()
    expect(screen.getByText('RO123')).toBeInTheDocument()
    expect(screen.getByText('ASSIGNED')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Ticket title="水龙头漏水" code="RO123" status="ASSIGNED" time="2026-08-15" onClick={onClick} />)
    await userEvent.click(screen.getByText('水龙头漏水'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('RoleCard', () => {
  it('renders title and detail and fires onClick', async () => {
    const onClick = vi.fn()
    render(<RoleCard icon={<span>icon</span>} title="业主" detail="报修、缴费" onClick={onClick} />)
    expect(screen.getByText('业主')).toBeInTheDocument()
    expect(screen.getByText('报修、缴费')).toBeInTheDocument()
    await userEvent.click(screen.getByText('业主'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Stat', () => {
  it('renders value and label', () => {
    render(<Stat value="12" label="待处理工单" />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('待处理工单')).toBeInTheDocument()
  })
})

describe('SectionTitle', () => {
  it('renders title without link button when no link', () => {
    render(<SectionTitle title="标题" />)
    expect(screen.getByText('标题')).toBeInTheDocument()
  })

  it('renders a clickable link button when link provided', async () => {
    const onLinkClick = vi.fn()
    render(<SectionTitle title="标题" link="查看更多" onLinkClick={onLinkClick} />)
    await userEvent.click(screen.getByText('查看更多'))
    expect(onLinkClick).toHaveBeenCalledTimes(1)
  })
})
