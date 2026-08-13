import { useEffect, useMemo, useState } from 'react'
import { api, RepairListResponse, RepairOrder } from '../../api/client'
import { ArrowRightIcon, RepairIcon } from '../../components/owner/icons'
import OwnerShell from './OwnerShell'

const STATUS_OPTIONS = ['全部', 'CREATED', 'ASSIGNED', 'PROCESSING', 'COMPLETED', 'CLOSED']
const URGENCY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const TYPE_OPTIONS = [
  { label: '漏水', value: 'water_leak' },
  { label: '电梯故障', value: 'elevator_fault' },
  { label: '门禁', value: 'access_control' },
  { label: '跳闸', value: 'power_trip' },
  { label: '墙面渗水', value: 'wall_seepage' },
  { label: '公共设施', value: 'public_facility' },
]

const TYPE_LABELS = TYPE_OPTIONS.reduce<Record<string, string>>((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

const DEFAULT_FORM = {
  user_id: 1,
  house_id: '',
  type: 'water_leak',
  description: '',
  urgency: 'MEDIUM',
}

export default function OwnerRepairPage() {
  const [list, setList] = useState<RepairListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createMsg, setCreateMsg] = useState<string | null>(null)
  const [form, setForm] = useState(DEFAULT_FORM)

  const visibleItems = useMemo(() => list?.items ?? [], [list])

  const fetchList = async (targetPage = page) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listRepairs({
        page: targetPage,
        page_size: 10,
        user_id: 1,
        status: statusFilter === '全部' ? undefined : statusFilter,
      })
      setList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchList(page)
  }, [page, statusFilter])

  const handleCreate = async () => {
    setCreateMsg(null)
    try {
      await api.createRepair({
        user_id: Number(form.user_id),
        house_id: form.house_id ? Number(form.house_id) : null,
        type: form.type,
        description: form.description,
        urgency: form.urgency,
      })
      setCreateMsg('报修已提交，工单正在受理中。')
      setForm(DEFAULT_FORM)
      setPage(1)
      await fetchList(1)
    } catch (err) {
      setCreateMsg(`提交失败：${err instanceof Error ? err.message : '请稍后再试'}`)
    }
  }

  return (
    <OwnerShell activeTab="repair">
      <section className="owner-workspace-head">
        <div>
          <span className="owner-eyebrow">报修</span>
          <h2>在线报修</h2>
          <p>填写问题后直接创建维修工单，也可以查看我的报修进度。</p>
        </div>
        <div className="owner-workspace-hero">
          <span className="owner-workspace-hero-icon">
            <RepairIcon />
          </span>
          <div>
            <strong>24 小时受理</strong>
            <span>漏水、电梯、门禁、跳闸都可以直接提交</span>
          </div>
        </div>
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Create</span>
            <h3>提交报修</h3>
          </div>
          <span className="owner-panel-note">默认使用当前业主 ID</span>
        </div>

        <div className="owner-form-grid">
          <label>
            用户 ID
            <input
              type="number"
              min={1}
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })}
            />
          </label>
          <label>
            房屋 ID
            <input
              type="number"
              min={1}
              value={form.house_id}
              onChange={(e) => setForm({ ...form, house_id: e.target.value })}
              placeholder="可选"
            />
          </label>
          <label>
            类型
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPE_OPTIONS.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            紧急程度
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
              {URGENCY_OPTIONS.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="owner-form-row">
          <label className="owner-fill">
            问题描述
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="请描述位置、现象和是否需要入户"
            />
          </label>
          <button type="button" onClick={handleCreate}>
            提交工单
          </button>
        </div>

        {createMsg && <div className={createMsg.startsWith('提交失败') ? 'owner-error' : 'owner-success'}>{createMsg}</div>}
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Queue</span>
            <h3>我的报修记录</h3>
          </div>
          <button className="owner-secondary" type="button" onClick={() => void fetchList(page)} disabled={loading}>
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>

        <div className="owner-toolbar">
          <label>
            状态筛选
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <span className="owner-panel-note">共 {list?.pagination.total ?? 0} 条</span>
        </div>

        {error && <div className="owner-error">{error}</div>}

        {visibleItems.length > 0 ? (
          <>
            <div className="owner-list">
              {visibleItems.map((item: RepairOrder) => (
                <article key={item.id} className="owner-list-item">
                  <div className="owner-list-top">
                    <div>
                      <h4>{item.order_no}</h4>
                      <p>
                        {TYPE_LABELS[item.type] || item.type} · {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="owner-tag-row">
                      <span className={`badge urgency-${item.urgency}`}>{item.urgency}</span>
                      <span className={`badge status-${item.status}`}>{item.status}</span>
                    </div>
                  </div>
                  <p className="owner-list-desc">{item.description || '暂无描述'}</p>
                </article>
              ))}
            </div>

            <div className="owner-pagination">
              <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page <= 1 || loading}>
                上一页
              </button>
              <span>
                第 {page} / {list?.pagination.pages || 1} 页
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= (list?.pagination.pages || 1) || loading}
              >
                下一页 <ArrowRightIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="owner-empty">
            <strong>暂无报修记录</strong>
            <span>提交一条报修后，这里会显示工单进度。</span>
          </div>
        )}
      </section>
    </OwnerShell>
  )
}
