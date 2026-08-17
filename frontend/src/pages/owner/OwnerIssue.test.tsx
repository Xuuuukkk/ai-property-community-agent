import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OwnerIssue from './OwnerIssue'

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    getIssueOptions: vi.fn(),
    listIssues: vi.fn(),
    createIssue: vi.fn(),
  },
}))

vi.mock('../../api/client', () => ({ api: mockApi }))
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 }, login: vi.fn(), logout: vi.fn() }),
}))

describe('OwnerIssue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.getIssueOptions.mockResolvedValue({
      zones: ['东区', '西区'],
      locations: ['电梯', '垃圾房'],
      categories: [
        { value: 'public_facility', label: '公共设施报修' },
        { value: 'complaint', label: '意见投诉' },
        { value: 'report', label: '随手拍问题' },
      ],
    })
    mockApi.listIssues.mockResolvedValue({ items: [], pagination: { total: 0 } })
    mockApi.createIssue.mockResolvedValue({ id: 1 })
  })

  it('renders the report form with category buttons', async () => {
    render(
      <MemoryRouter>
        <OwnerIssue />
      </MemoryRouter>,
    )
    expect(await screen.findByText('我要上报')).toBeInTheDocument()
    expect(screen.getByText('公共设施报修')).toBeInTheDocument()
    expect(screen.getByText('意见投诉')).toBeInTheDocument()
  })

  it('submits a report with description', async () => {
    render(
      <MemoryRouter>
        <OwnerIssue />
      </MemoryRouter>,
    )
    await screen.findByText('我要上报')
    fireEvent.change(screen.getByPlaceholderText('请描述您遇到的问题'), {
      target: { value: '电梯门关不上' },
    })
    fireEvent.click(screen.getByText('提交上报'))
    await waitFor(() => expect(mockApi.createIssue).toHaveBeenCalled())
    expect(mockApi.createIssue.mock.calls[0][0].description).toBe('电梯门关不上')
  })

  it('lists my reports', async () => {
    mockApi.listIssues.mockResolvedValue({
      items: [
        {
          id: 1,
          user_id: 1,
          category: 'public_facility',
          zone: '东区',
          location: '电梯',
          location_detail: null,
          description: '电梯门关不上',
          images: null,
          status: 'processing',
          assignee_id: 202,
          assignee_name: '丁辉',
          assigned_at: null,
          reply: null,
          replied_at: null,
          created_at: '2026-08-17T10:00:00',
        },
      ],
      pagination: { total: 1 },
    })
    render(
      <MemoryRouter>
        <OwnerIssue />
      </MemoryRouter>,
    )
    expect(await screen.findByText('电梯门关不上')).toBeInTheDocument()
    expect(screen.getByText('已派单给：丁辉')).toBeInTheDocument()
  })
})
