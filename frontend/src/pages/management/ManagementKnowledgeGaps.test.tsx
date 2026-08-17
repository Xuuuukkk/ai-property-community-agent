import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ManagementKnowledgeGaps from './ManagementKnowledgeGaps'

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    listKnowledgeGaps: vi.fn(),
    getFeedbackStats: vi.fn(),
    approveKnowledgeGap: vi.fn(),
    rejectKnowledgeGap: vi.fn(),
  },
}))

vi.mock('../../api/client', () => ({ api: mockApi }))
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 201 }, login: vi.fn(), logout: vi.fn() }),
}))

describe('ManagementKnowledgeGaps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.listKnowledgeGaps.mockResolvedValue({
      items: [
        {
          id: 1,
          question: '停车费怎么算？',
          suggested_answer: null,
          source: 'feedback',
          status: 'pending',
          created_at: '2026-08-17T10:00:00',
          resolved_at: null,
        },
      ],
    })
    mockApi.getFeedbackStats.mockResolvedValue({
      total: 5,
      up: 3,
      down: 2,
      down_rate: 0.4,
      top_problems: [{ question: '停车费怎么算？', count: 2 }],
    })
    mockApi.approveKnowledgeGap.mockResolvedValue({ id: 1, status: 'approved' })
    mockApi.rejectKnowledgeGap.mockResolvedValue({ id: 1, status: 'rejected' })
  })

  it('renders pending gaps and feedback stats', async () => {
    render(
      <MemoryRouter>
        <ManagementKnowledgeGaps />
      </MemoryRouter>,
    )
    expect(await screen.findByText('停车费怎么算？')).toBeInTheDocument()
    expect(screen.getByText('点踩率')).toBeInTheDocument()
  })

  it('approves a gap with an answer', async () => {
    render(
      <MemoryRouter>
        <ManagementKnowledgeGaps />
      </MemoryRouter>,
    )
    await screen.findByText('停车费怎么算？')
    fireEvent.change(screen.getByPlaceholderText('填写审核后的正确答案'), {
      target: { value: '停车费每月 300 元' },
    })
    fireEvent.click(screen.getByText('通过并写入知识库'))
    await waitFor(() => expect(mockApi.approveKnowledgeGap).toHaveBeenCalledWith(1, '停车费每月 300 元'))
  })
})
