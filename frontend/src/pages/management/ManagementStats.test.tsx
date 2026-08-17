import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ManagementStats from './ManagementStats'

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    getDashboardStats: vi.fn(),
    getDashboardInsights: vi.fn(),
  },
}))

vi.mock('../../api/client', () => ({ api: mockApi }))
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 201 }, login: vi.fn(), logout: vi.fn() }),
}))

const statsPayload = {
  repair: {
    total: 52,
    pending: 16,
    completed: 36,
    completion_rate: 0.69,
    by_status: { COMPLETED: 31, PROCESSING: 7 },
    by_type: { public_facility: 13, water_leak: 8 },
  },
  fee: {
    total_count: 746,
    total_amount: 225728.35,
    paid_amount: 135097.06,
    paid_count: 455,
    unpaid_count: 291,
    overdue_count: 41,
    collection_rate: 0.6,
  },
  inspection: {
    total: 24,
    anomaly_count: 14,
    anomaly_rate: 0.58,
    by_anomaly: { 正常: 10, 垃圾堆积: 7 },
  },
  issue: {
    total: 1,
    submitted: 0,
    processing: 1,
    resolved: 0,
    by_category: { public_facility: 1 },
  },
  community: { users: 275, houses: 1664, buildings: 8 },
}

describe('ManagementStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.getDashboardStats.mockResolvedValue(statsPayload)
    mockApi.getDashboardInsights.mockResolvedValue({
      insights: [
        {
          category: '工单',
          severity: 'warning',
          title: '公共设施报修占比最高',
          detail: '公共设施类报修 13 单，占 25%',
        },
      ],
      report: '云溪花园数据总结：公共设施报修占比高。',
    })
  })

  it('renders core KPI cards', async () => {
    render(
      <MemoryRouter>
        <ManagementStats />
      </MemoryRouter>,
    )
    expect(await screen.findByText('工单完成率')).toBeInTheDocument()
    expect(screen.getByText('费用收缴率')).toBeInTheDocument()
    expect(screen.getByText('巡检异常')).toBeInTheDocument()
  })

  it('shows the insight report and findings', async () => {
    render(
      <MemoryRouter>
        <ManagementStats />
      </MemoryRouter>,
    )
    expect(await screen.findByText('公共设施报修占比最高')).toBeInTheDocument()
    expect(screen.getByText(/云溪花园数据总结/)).toBeInTheDocument()
  })

  it('shows community overview numbers', async () => {
    render(
      <MemoryRouter>
        <ManagementStats />
      </MemoryRouter>,
    )
    expect(await screen.findByText('275')).toBeInTheDocument()
    expect(screen.getByText('1664')).toBeInTheDocument()
  })
})
