import { useEffect, useMemo, useState } from 'react'
import { api, RepairListResponse, RepairOrder } from '../../api/client'
import { TicketIcon } from '../../components/owner/icons'
import OwnerShell from './OwnerShell'

const STATUS_OPTIONS = ['全部', 'CREATED', 'ASSIGNED', 'PROCESSING', 'COMPLETED', 'CLOSED']

const STATUS_HINTS: Record<string, string> = {
  CREATED: '已提交，等待受理',
  ASSIGNED: '已派单给维修人员',
  PROCESSING: '处理中',
  COMPLETED: '已完成，等待确认',
  CLOSED: '已关闭',
}

export default function OwnerTicketPage() {
  const [list, setList] = useState<RepairListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items = useMemo(() => list?.items ?? [], [list])

  const fetchTickets = async (targetPage = page) => {
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
    void fetchTickets(page)
  }, [page, statusFilter])

  return (
    <OwnerShell activeTab="ticket">
      <section className="owner-workspace-head">
        <div>
          <span className="owner-eyebrow">工单</span>
          <h2>我的工单</h2>
          <p>查看历史报修、当前处理状态和工单编号。</p>
        </div>
        <div className="owner-workspace-hero">
          <span className="owner-workspace-hero-icon">
            <TicketIcon />
          </span>
          <div>
            <strong>工单跟踪</strong>
            <span>按状态筛选，快速查看处理进度</span>
          </div>
        </div>
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Queue</span>
            <h3>工单列表</h3>
          </div>
          <button className="owner-secondary" type="button" onClick={() => void fetchTickets(page)} disabled={loading}>
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

        {items.length > 0 ? (
          <>
            <div className="owner-list">
              {items.map((item: RepairOrder) => (
                <article key={item.id} className="owner-list-item">
                  <div className="owner-list-top">
                    <div>
                      <h4>{item.order_no}</h4>
                      <p>
                        {STATUS_HINTS[item.status] || item.status} · {new Date(item.created_at).toLocaleString()}
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
                下一页
              </button>
            </div>
          </>
        ) : (
          <div className="owner-empty">
            <strong>暂无工单</strong>
            <span>你的报修单会集中显示在这里。</span>
          </div>
        )}
      </section>
    </OwnerShell>
  )
}
