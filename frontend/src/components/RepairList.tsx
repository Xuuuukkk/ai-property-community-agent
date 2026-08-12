import { useEffect, useState } from 'react'
import { api, RepairOrder, RepairListResponse } from '../api/client'

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

export default function RepairList() {
  const [list, setList] = useState<RepairListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for creating a new repair order
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
    <div>
      <div className="card">
        <h2>创建维修工单</h2>
        <div className="form-row">
          <label>
            用户 ID
            <input
              type="number"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })}
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
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            紧急程度
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
              {URGENCY_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label style={{ flex: 1 }}>
            问题描述
            <input
              style={{ width: '100%' }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="请描述具体问题"
            />
          </label>
          <button onClick={handleCreate}>提交工单</button>
        </div>
        {createMsg && <div className={createMsg.startsWith('创建失败') ? 'error' : 'success'}>{createMsg}</div>}
      </div>

      <div className="card">
        <h2>维修工单列表</h2>
        <div className="form-row">
          <label>
            状态筛选
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button className="secondary" onClick={() => fetchList()} disabled={loading}>
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {list && (
          <>
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
                    <td>{item.order_no}</td>
                    <td>{item.type}</td>
                    <td>{item.urgency}</td>
                    <td>
                      <span className={`badge status-${item.status}`}>{item.status}</span>
                    </td>
                    <td>{item.description || '-'}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </button>
              <span>
                第 {page} / {list.pagination.pages || 1} 页（共 {list.pagination.total} 条）
              </span>
              <button
                disabled={page >= list.pagination.pages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
