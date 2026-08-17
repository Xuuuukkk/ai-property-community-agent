import type {
  FeeBill,
  FeeListResponse,
  LoginRequest,
  LoginResponse,
  Notice,
  NoticeListResponse,
  RepairOrder,
  RepairListResponse,
  User,
  UserListResponse,
  UserProfile,
  Worker,
  AgentChatRequest,
  AgentChatResponse,
  InspectionCameraListResponse,
  InspectionRecord,
  InspectionRecordListResponse,
} from './types'

const API_BASE = '' // Vite dev proxy forwards /api to backend

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem('property_agent_token', token)
  } else {
    localStorage.removeItem('property_agent_token')
  }
}

export function loadAuthToken(): string | null {
  authToken = localStorage.getItem('property_agent_token')
  return authToken
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (init?.headers) {
    const provided = init.headers as Record<string, string>
    Object.assign(headers, provided)
  }
  const token = authToken ?? loadAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null)
    }
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
  login: (payload: LoginRequest) =>
    fetchJson<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  getMe: () => fetchJson<User>('/api/auth/me'),

  getUser: (id: number) => fetchJson<User>(`/api/users/${id}`),
  getWorkerUser: (id: number) => fetchJson<UserProfile>(`/api/users/${id}`),

  listUsers: (params: { page?: number; page_size?: number; role?: string } = {}) => {
    const search = new URLSearchParams()
    if (params.page) search.append('page', String(params.page))
    if (params.page_size) search.append('page_size', String(params.page_size))
    if (params.role) search.append('role', params.role)
    return fetchJson<UserListResponse>(`/api/users?${search.toString()}`)
  },

  listWorkers: (params: { status?: string; department?: string } = {}) => {
    const search = new URLSearchParams()
    if (params.status) search.append('status', params.status)
    if (params.department) search.append('department', params.department)
    return fetchJson<Worker[]>(`/api/workers?${search.toString()}`)
  },

  listRepairs: (params: { page?: number; page_size?: number; user_id?: number; worker_id?: number; status?: string } = {}) => {
    const search = new URLSearchParams()
    if (params.page) search.append('page', String(params.page))
    if (params.page_size) search.append('page_size', String(params.page_size))
    if (params.user_id) search.append('user_id', String(params.user_id))
    if (params.worker_id) search.append('worker_id', String(params.worker_id))
    if (params.status) search.append('status', params.status)
    return fetchJson<RepairListResponse>(`/api/repair/list?${search.toString()}`)
  },

  getRepair: (id: number) => fetchJson<RepairOrder>(`/api/repair/${id}`),

  assignRepair: (repairId: number, payload: { worker_id: number }) =>
    fetchJson<RepairOrder>(`/api/repair/${repairId}/assign`, { method: 'POST', body: JSON.stringify(payload) }),

  updateRepairStatus: (repairId: number, payload: { status: string }) =>
    fetchJson<RepairOrder>(`/api/repair/${repairId}/status`, { method: 'POST', body: JSON.stringify(payload) }),

  ownerConfirmRepair: (repairId: number) =>
    fetchJson<RepairOrder>(`/api/repair/${repairId}/owner-confirm`, { method: 'POST' }),

  workerConfirmRepair: (repairId: number) =>
    fetchJson<RepairOrder>(`/api/repair/${repairId}/worker-confirm`, { method: 'POST' }),

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

  chatAgent: (payload: AgentChatRequest) =>
    fetchJson<AgentChatResponse>('/api/agent/chat', { method: 'POST', body: JSON.stringify(payload) }),

  listInspectionCameras: () => fetchJson<InspectionCameraListResponse>('/api/inspection/cameras'),

  listInspectionRecords: (params: { page?: number; page_size?: number; camera_id?: number } = {}) => {
    const search = new URLSearchParams()
    if (params.page) search.append('page', String(params.page))
    if (params.page_size) search.append('page_size', String(params.page_size))
    if (params.camera_id) search.append('camera_id', String(params.camera_id))
    return fetchJson<InspectionRecordListResponse>(`/api/inspection/records?${search.toString()}`)
  },

  runInspection: (cameraId: number) =>
    fetchJson<{ record: InspectionRecord }>(`/api/inspection/cameras/${cameraId}/run`, { method: 'POST' }),

  getInspectionImageUrl: async (recordId: number): Promise<string> => {
    const token = authToken ?? loadAuthToken()
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const response = await fetch(`${API_BASE}/api/inspection/records/${recordId}/image`, { headers })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  },
}

// Re-export types for convenience
export type {
  AgentChatRequest,
  AgentChatResponse,
  LoginRequest,
  LoginResponse,
  User,
  RepairOrder,
  RepairListResponse,
  FeeBill,
  FeeListResponse,
  Notice,
  NoticeListResponse,
  UserProfile,
  Worker,
} from './types'
