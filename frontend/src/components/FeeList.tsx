import { useState } from 'react'
import { api, FeeBill, FeeListResponse } from '../api/client'

export default function FeeList() {
  const [userId, setUserId] = useState('1')
  const [list, setList] = useState<FeeListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    const id = Number(userId)
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.listFeesByUser(id, { page_size: 20 })
      setList(data)
    } catch (err: any) {
      setError(err.message || '加载失败')
      setList(null)
    } finally {
      setLoading(false)
    }
  }

  const totalAmount =
    list?.items.reduce((sum, item) => {
      const amount = Number(item.amount)
      return Number.isFinite(amount) ? sum + amount : sum
    }, 0) || 0

  return (
    <div className="stack">
      <section className="panel query-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Billing Search</span>
            <h3>按业主查询账单</h3>
          </div>
          {list && <span className="panel-note">合计 ¥{totalAmount.toFixed(2)}</span>}
        </div>

        <div className="form-row">
          <label>
            用户 ID
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="输入用户 ID"
              min={1}
            />
          </label>
          <button onClick={handleSearch} disabled={loading} type="button">
            {loading ? '查询中...' : '查询账单'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Bills</span>
            <h3>费用账单</h3>
          </div>
          {list && <span className="table-summary">{list.items.length} 条</span>}
        </div>

        {list ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>账单类型</th>
                    <th>周期</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>到期日</th>
                  </tr>
                </thead>
                <tbody>
                  {list.items.map((item: FeeBill) => (
                    <tr key={item.id}>
                      <td>{item.bill_type}</td>
                      <td>{item.period || '-'}</td>
                      <td className="amount">¥{Number(item.amount).toFixed(2)}</td>
                      <td>
                        <span className={`badge status-${item.status}`}>{item.status}</span>
                      </td>
                      <td>{item.due_date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {list.items.length === 0 && <div className="empty-state">暂无账单</div>}
          </>
        ) : (
          <div className="empty-state">
            <strong>尚未查询账单</strong>
            <span>输入用户 ID 后，这里会展示该业主的费用明细。</span>
          </div>
        )}
      </section>
    </div>
  )
}
