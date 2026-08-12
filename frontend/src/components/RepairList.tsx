import { useEffect, useState } from 'react'
import { api, RepairListResponse, RepairOrder } from '../api/client'

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

export default function RepairList() {
  const [list, setList] = useState<RepairListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    user_id: 1,
    house_id: '',
    type: 'water_leak',
    description: '',
    urgency: 'MEDIUM',
  })
  const [createMsg, setCreateMsg] = useState<string | null>(null)

  const fetchList = async (p = page) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listRepairs({
        page: p,
        page_size: 10,
        status: statusFilter === '全部' ? undefined : statusFilter,
      })
      setList(data)
    } catch (err: any) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
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
      setCreateMsg('工单创建成功')
      setForm({ user_id: 1, house_id: '', type: 'water_leak', description: '', urgency: 'MEDIUM' })
      fetchList()
    } catch (err: any) {
      setCreateMsg(`创建失败: ${err.message}`)
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Create</span>
            <h3>创建维修工单</h3>
          </div>
          <span className="panel-note">字段会按现有后端契约提交</span>
        </div>

        <div className="form-grid">
          <label>
            用户 ID
            <input
              type="number"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })}
              min={1}
            />
          </label>
          <label>
            房屋 ID
            <input
              type="number"
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

        <div className="form-row">
          <label className="fill">
            问题描述
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="请描述具体问题、位置或补充信息"
            />
          </label>
          <button onClick={handleCreate} type="button">
            提交工单
          </button>
        </div>

        {createMsg && <div className={createMsg.startsWith('创建失败') ? 'error' : 'success'}>{createMsg}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Queue</span>
            <h3>维修工单列表</h3>
          </div>
          <button className="secondary" onClick={() => fetchList()} disabled={loading} type="button">
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>

        <div className="toolbar">
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
          {list && <span className="table-summary">共 {list.pagination.total} 条记录</span>}
        </div>

        {error && <div className="error">{error}</div>}

        {list && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>工单号</th>
                    <th>类型</th>
                    <th>紧急程度</th>
                    <th>状态</th>
                    <th>描述</th>
                    <th>创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {list.items.map((item: RepairOrder) => (
                    <tr key={item.id}>
                      <td className="mono">{item.order_no}</td>
                      <td>{TYPE_LABELS[item.type] || item.type}</td>
                      <td>
                        <span className={`badge urgency-${item.urgency}`}>{item.urgency}</span>
                      </td>
                      <td>
                        <span className={`badge status-${item.status}`}>{item.status}</span>
                      </td>
                      <td className="description-cell">{item.description || '-'}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {list.items.length === 0 && <div className="empty-state">暂无工单</div>}
            <div className="pagination">
              <button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} type="button">
                上一页
              </button>
              <span>
                第 {page} / {list.pagination.pages || 1} 页
              </span>
              <button
                disabled={page >= list.pagination.pages || loading}
                onClick={() => setPage((p) => p + 1)}
                type="button"
              >
                下一页
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
