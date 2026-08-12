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

  return (
    <div className="card">
      <h2>物业费用账单</h2>
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
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '查询中...' : '查询'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {list && (
        <>
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
                  <td>¥{Number(item.amount).toFixed(2)}</td>
                  <td>
                    <span className={`badge status-${item.status}`}>{item.status}</span>
                  </td>
                  <td>{item.due_date ? item.due_date : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.items.length === 0 && <div className="empty">暂无账单</div>}
        </>
      )}
    </div>
  )
}
