import type {
  FeeBill,
  FeeListResponse,
  Notice,
  NoticeListResponse,
  RepairOrder,
  RepairListResponse,
  User,
} from './types'

const API_BASE = '' // Vite dev proxy forwards /api to backend

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      message = body.detail || JSON.stringify(body)
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export const api = {
  getUser: (id: number) => fetchJson<User>(`/api/users/${id}`),

  listRepairs: (params: { page?: number; page_size?: number; user_id?: number; status?: string } = {}) => {
    const search = new URLSearchParams()
    if (params.page) search.append('page', String(params.page))
    if (params.page_size) search.append('page_size', String(params.page_size))
    if (params.user_id) search.append('user_id', String(params.user_id))
    if (params.status) search.append('status', params.status)
    return fetchJson<RepairListResponse>(`/api/repair/list?${search.toString()}`)
  },

  getRepair: (id: number) => fetchJson<RepairOrder>(`/api/repair/${id}`),

  createRepair: (payload: {
    user_id: number
    house_id?: number | null
    type: string
    description?: string
    urgency: string
  }) => fetchJson<RepairOrder>('/api/repair', { method: 'POST', body: JSON.stringify(payload) }),

  listFeesByUser: (userId: number, params: { page?: number; page_size?: number } = {}) => {
    const search = new URLSearchParams()
    if (params.page) search.append('page', String(params.page))
    if (params.page_size) search.append('page_size', String(params.page_size))
    return fetchJson<FeeListResponse>(`/api/fee/${userId}?${search.toString()}`)
  },

  listNotices: (params: { page?: number; page_size?: number; status?: string } = {}) => {
    const search = new URLSearchParams()
    if (params.page) search.append('page', String(params.page))
    if (params.page_size) search.append('page_size', String(params.page_size))
    if (params.status) search.append('status', params.status)
    return fetchJson<NoticeListResponse>(`/api/notices?${search.toString()}`)
  },

  createNotice: (payload: {
    title: string
    content?: string
    publisher_id: number
    notice_type: string
    is_pinned?: boolean
  }) => fetchJson<Notice>('/api/notices', { method: 'POST', body: JSON.stringify(payload) }),
}

// Re-export types for convenience
export type { User, RepairOrder, RepairListResponse, FeeBill, FeeListResponse, Notice, NoticeListResponse } from './types'
