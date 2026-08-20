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
  worker_id: number | null
  created_at: string
}

export interface RepairOwnerInfo {
  id: number
  real_name: string | null
  phone: string | null
}

export interface RepairHouseInfo {
  id: number
  community_name: string | null
  building_no: string | null
  unit_no: number | null
  floor_no: number | null
  room_no: string | null
}

export interface RepairWorkerInfo {
  id: number
  real_name: string | null
  phone: string | null
  department: string | null
  position: string | null
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
  image_urls: string[] | null
  created_at: string
  completed_at: string | null
  owner_confirmed_at: string | null
  worker_confirmed_at: string | null
  owner: RepairOwnerInfo | null
  house: RepairHouseInfo | null
  worker: RepairWorkerInfo | null
}

export interface UserProfile {
  id: number
  username: string
  real_name: string | null
  phone: string | null
  role: string
  created_at: string
}

export interface UserListResponse {
  items: User[]
  pagination: PageInfo
}

export interface Worker {
  id: number
  user_id: number
  real_name: string | null
  phone: string | null
  department: string
  position: string | null
  skill_type: string | null
  status: string
  hire_date: string | null
  created_at: string
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

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface AgentChatRequest {
  message: string
  user_id?: number | null
  conversation_id?: string | null
  pending_repair?: Record<string, unknown> | null
  pending_issue?: Record<string, unknown> | null
}

export interface AgentChatResponse {
  conversation_id: string
  intent: string
  response: string
  tool_results: Record<string, unknown>[]
  requires_human: boolean
  pending_repair: Record<string, unknown> | null
  pending_issue: Record<string, unknown> | null
}

export interface InspectionCamera {
  id: number
  name: string
  zone: string | null
  location: string | null
  manager: string | null
  provider_type: string
  source_config: Record<string, unknown> | null
  enabled: boolean
  created_at: string
}

export interface InspectionCameraListResponse {
  items: InspectionCamera[]
}

export interface InspectionRecord {
  id: number
  camera_id: number
  image_path: string | null
  anomaly_type: string | null
  confidence: number | null
  summary: string | null
  bbox: number[] | null
  status: string
  error: string | null
  created_at: string
}

export interface InspectionRecordListResponse {
  items: InspectionRecord[]
  pagination: PageInfo
}

export interface Issue {
  id: number
  user_id: number
  category: string
  zone: string | null
  location: string | null
  location_detail: string | null
  description: string
  images: string[] | null
  status: string
  assignee_id: number | null
  assignee_name: string | null
  assigned_at: string | null
  reply: string | null
  replied_at: string | null
  created_at: string
}

export interface IssueListResponse {
  items: Issue[]
  pagination: PageInfo
}

export interface IssueOptions {
  zones: string[]
  locations: string[]
  categories: { value: string; label: string }[]
}

export interface DashboardStats {
  repair: {
    total: number
    pending: number
    completed: number
    completion_rate: number
    by_status: Record<string, number>
    by_type: Record<string, number>
  }
  fee: {
    total_count: number
    total_amount: number
    paid_amount: number
    paid_count: number
    unpaid_count: number
    overdue_count: number
    collection_rate: number
  }
  inspection: {
    total: number
    anomaly_count: number
    anomaly_rate: number
    by_anomaly: Record<string, number>
  }
  issue: {
    total: number
    submitted: number
    processing: number
    resolved: number
    by_category: Record<string, number>
  }
  community: {
    users: number
    houses: number
    buildings: number
  }
}

export interface Insight {
  category: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  detail: string
}

export interface DashboardInsights {
  insights: Insight[]
  report: string
}

export interface KnowledgeGap {
  id: number
  question: string
  suggested_answer: string | null
  source: string
  status: string
  created_at: string
  resolved_at: string | null
}

export interface FeedbackStats {
  total: number
  up: number
  down: number
  down_rate: number
  top_problems: { question: string; count: number }[]
}

export interface AppNotification {
  id: number
  type: string
  title: string
  content: string
  related_type: string | null
  related_id: number | null
  is_read: boolean
  created_at: string
}




