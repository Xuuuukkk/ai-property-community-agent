import { useEffect, useMemo, useState } from 'react'
import { api, RepairListResponse, RepairOrder } from '../../api/client'
import { RepairIcon, TicketIcon } from '../../components/owner/icons'
import WorkerShell from './WorkerShell'

const STATUS_OPTIONS = ['全部', 'CREATED', 'ASSIGNED', 'PROCESSING', 'COMPLETED', 'CLOSED']
const WORKFLOW_STATUS = ['ASSIGNED', 'PROCESSING', 'COMPLETED', 'CLOSED']

export default function WorkerDashboard() {
  const [list, setList] = useState<RepairListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const items = useMemo(() => list?.items ?? [], [list])

  const fetchRepairs = async (targetPage = page) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listRepairs({
        page: targetPage,
        page_size: 10,
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
    void fetchRepairs(page)
  }, [page, statusFilter])

  const handleAssign = async (repairId: number) => {
    setActionMsg(null)
    try {
      await api.assignRepair(repairId, { worker_id: 1 })
      setActionMsg('已接单')
      await fetchRepairs(page)
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : '接单失败')
    }
  }

  const handleStatus = async (repairId: number, status: string) => {
    setActionMsg(null)
    try {
      await api.updateRepairStatus(repairId, { status })
      setActionMsg(`状态已更新为 ${status}`)
      await fetchRepairs(page)
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : '更新失败')
    }
  }

  return (
    <WorkerShell activeTab="dashboard">
      <section className="owner-workspace-head">
        <div>
          <span className="owner-eyebrow">维修人员端</span>
          <h2>工单处理台</h2>
          <p>查看待处理工单，快速接单并推进状态。</p>
        </div>
        <div className="owner-workspace-hero">
          <span className="owner-workspace-hero-icon">
            <TicketIcon />
          </span>
          <div>
            <strong>待处理工单</strong>
            <span>支持接单、处理中、完成</span>
          </div>
        </div>
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Queue</span>
            <h3>工单列表</h3>
          </div>
          <button className="owner-secondary" type="button" onClick={() => void fetchRepairs(page)} disabled={loading}>
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
        {actionMsg && <div className="owner-success">{actionMsg}</div>}

        <div className="owner-list">
          {items.map((item: RepairOrder) => (
            <article key={item.id} className="owner-list-item">
              <div className="owner-list-top">
                <div>
                  <h4>{item.order_no}</h4>
                  <p>
                    用户 {item.user_id} · {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="owner-tag-row">
                  <span className={`badge urgency-${item.urgency}`}>{item.urgency}</span>
                  <span className={`badge status-${item.status}`}>{item.status}</span>
                </div>
              </div>
              <p className="owner-list-desc">{item.description || '暂无描述'}</p>
              <div className="owner-tag-row" style={{ marginTop: 12 }}>
                {item.status === 'CREATED' && (
                  <button type="button" onClick={() => void handleAssign(item.id)}>
                    接单
                  </button>
                )}
                {WORKFLOW_STATUS.map((status) => (
                  <button key={status} type="button" className="owner-secondary" onClick={() => void handleStatus(item.id, status)}>
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="owner-empty">
            <strong>暂无工单</strong>
            <span>目前没有待处理的维修任务。</span>
          </div>
        )}

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
            下一页
          </button>
        </div>
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Tips</span>
            <h3>当前处理节奏</h3>
          </div>
        </div>
        <div className="owner-fee-grid">
          <div className="owner-stat-card">
            <RepairIcon />
            <span>接单后自动进入 ASSIGNED</span>
          </div>
          <div className="owner-stat-card">
            <RepairIcon />
            <span>处理中可切换 PROCESSING</span>
          </div>
        </div>
      </section>
    </WorkerShell>
  )
}
