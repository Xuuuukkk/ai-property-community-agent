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
}

export interface AgentChatResponse {
  conversation_id: string
  intent: string
  response: string
  tool_results: Record<string, unknown>[]
  requires_human: boolean
  pending_repair: Record<string, unknown> | null
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

