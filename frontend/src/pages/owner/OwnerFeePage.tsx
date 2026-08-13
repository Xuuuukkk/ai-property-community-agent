import { useState } from 'react'
import { api, FeeBill, FeeListResponse } from '../../api/client'
import { FeeIcon } from '../../components/owner/icons'
import OwnerShell from './OwnerShell'

const DEFAULT_USER_ID = '1'

export default function OwnerFeePage() {
  const [userId, setUserId] = useState(DEFAULT_USER_ID)
  const [list, setList] = useState<FeeListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    const id = Number(userId)
    if (!Number.isFinite(id) || id <= 0) return

    setLoading(true)
    setError(null)
    try {
      const data = await api.listFeesByUser(id, { page_size: 20 })
      setList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
      setList(null)
    } finally {
      setLoading(false)
    }
  }

  const summary = list?.items.reduce(
    (acc, item) => {
      const amount = Number(item.amount)
      if (Number.isFinite(amount)) {
        acc.total += amount
      }
      if (item.status === 'UNPAID') acc.unpaid += amount
      if (item.status === 'OVERDUE') acc.overdue += amount
      if (item.status === 'PAID') acc.paid += amount
      return acc
    },
    { total: 0, unpaid: 0, overdue: 0, paid: 0 },
  )

  return (
    <OwnerShell activeTab="fee">
      <section className="owner-workspace-head">
        <div>
          <span className="owner-eyebrow">查费</span>
          <h2>费用查询</h2>
          <p>输入业主 ID，查看物业费、停车费和其他账单的缴费状态。</p>
        </div>
        <div className="owner-workspace-hero">
          <span className="owner-workspace-hero-icon">
            <FeeIcon />
          </span>
          <div>
            <strong>账单一键查询</strong>
            <span>支持按业主 ID 拉取全部费用明细</span>
          </div>
        </div>
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Billing Search</span>
            <h3>按业主查询账单</h3>
          </div>
          {summary && <span className="owner-panel-note">合计 ¥{summary.total.toFixed(2)}</span>}
        </div>

        <div className="owner-form-row">
          <label className="owner-fill">
            用户 ID
            <input
              type="number"
              min={1}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="输入用户 ID"
            />
          </label>
          <button type="button" onClick={handleSearch} disabled={loading}>
            {loading ? '查询中...' : '查询账单'}
          </button>
        </div>

        {error && <div className="owner-error">{error}</div>}
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Bills</span>
            <h3>费用账单</h3>
          </div>
          {summary && (
            <span className="owner-panel-note">
              未缴 ¥{summary.unpaid.toFixed(2)} · 逾期 ¥{summary.overdue.toFixed(2)}
            </span>
          )}
        </div>

        {list ? (
          <>
            <div className="owner-fee-grid">
              <div className="owner-stat-card">
                <span>账单数量</span>
                <strong>{list.items.length}</strong>
              </div>
              <div className="owner-stat-card">
                <span>已缴</span>
                <strong>¥{summary?.paid.toFixed(2) ?? '0.00'}</strong>
              </div>
              <div className="owner-stat-card">
                <span>未缴</span>
                <strong>¥{summary?.unpaid.toFixed(2) ?? '0.00'}</strong>
              </div>
              <div className="owner-stat-card">
                <span>逾期</span>
                <strong>¥{summary?.overdue.toFixed(2) ?? '0.00'}</strong>
              </div>
            </div>

            <div className="owner-list">
              {list.items.map((item: FeeBill) => (
                <article key={item.id} className="owner-list-item">
                  <div className="owner-list-top">
                    <div>
                      <h4>{item.bill_type}</h4>
                      <p>
                        {item.period || '未注明周期'} · 到期日 {item.due_date || '暂无'}
                      </p>
                    </div>
                    <div className="owner-tag-row">
                      <span className={`badge status-${item.status}`}>{item.status}</span>
                      <span className="owner-amount">¥{Number(item.amount).toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {list.items.length === 0 && (
              <div className="owner-empty">
                <strong>暂无账单</strong>
                <span>这个业主当前没有可展示的费用记录。</span>
              </div>
            )}
          </>
        ) : (
          <div className="owner-empty">
            <strong>尚未查询账单</strong>
            <span>输入用户 ID 后，这里会展示对应的费用明细。</span>
          </div>
        )}
      </section>
    </OwnerShell>
  )
}
