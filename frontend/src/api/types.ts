export interface PageInfo {
  page: number
  page_size: number
  total: number
  pages: number
}

export interface User {
  id: number
  username: string
  real_name: string | null
  phone: string | null
  role: string
  created_at: string
}

export interface RepairOrder {
  id: number
  order_no: string
  user_id: number
  house_id: number | null
  worker_id: number | null
  type: string
  description: string | null
  urgency: string
  status: string
  cost: string
  created_at: string
  completed_at: string | null
}

export interface RepairListResponse {
  items: RepairOrder[]
  pagination: PageInfo
}

export interface FeeBill {
  id: number
  house_id: number
  user_id: number
  bill_type: string
  period: string | null
  amount: string
  status: string
  due_date: string | null
  paid_at: string | null
}

export interface FeeListResponse {
  items: FeeBill[]
  pagination: PageInfo
}

export interface Notice {
  id: number
  title: string
  content: string | null
  publisher_id: number
  notice_type: string
  is_pinned: boolean
  status: string
  created_at: string
}

export interface NoticeListResponse {
  items: Notice[]
  pagination: PageInfo
}

export interface AgentChatRequest {
  message: string
  user_id?: number | null
  conversation_id?: string | null
}

export interface AgentChatResponse {
  conversation_id: string
  intent: string
  response: string
  tool_results: Record<string, unknown>[]
  requires_human: boolean
}
