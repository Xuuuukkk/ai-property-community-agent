import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OwnerRepairForm from './OwnerRepairForm'

const { mockApi } = vi.hoisted(() => ({
  mockApi: { createRepair: vi.fn() },
}))

vi.mock('../../api/client', () => ({ api: mockApi }))
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 }, login: vi.fn(), logout: vi.fn() }),
}))

describe('OwnerRepairForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.createRepair.mockResolvedValue({ id: 1 })
  })

  it('renders the repair form', () => {
    render(
      <MemoryRouter>
        <OwnerRepairForm />
      </MemoryRouter>,
    )
    expect(screen.getByText('填写报修信息')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/请描述故障情况/)).toBeInTheDocument()
  })

  it('submits a repair order', async () => {
    render(
      <MemoryRouter>
        <OwnerRepairForm />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByPlaceholderText(/请描述故障情况/), {
      target: { value: '厨房水龙头漏水' },
    })
    fireEvent.click(screen.getByText('提交报修'))
    await waitFor(() => expect(mockApi.createRepair).toHaveBeenCalled())
    const payload = mockApi.createRepair.mock.calls[0][0]
    expect(payload.user_id).toBe(1)
    expect(payload.type).toBe('water_leak')
    expect(payload.description).toBe('厨房水龙头漏水')
  })

  it('shows success state after submit', async () => {
    render(
      <MemoryRouter>
        <OwnerRepairForm />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByPlaceholderText(/请描述故障情况/), {
      target: { value: '灯泡不亮' },
    })
    fireEvent.click(screen.getByText('提交报修'))
    expect(await screen.findByText('报修提交成功')).toBeInTheDocument()
  })
})
