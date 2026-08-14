import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { FeeBill } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

export default function ManagementFees() {
  const navigate = useNavigate()
  const [bills, setBills] = useState<FeeBill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userIds = [1, 2, 3, 4, 5]
    Promise.all(userIds.map((id) => api.listFeesByUser(id, { page_size: 100 })))
      .then((results) => {
        const all = results.flatMap((r) => r.items)
        setBills(all)
      })
      .finally(() => setLoading(false))
  }, [])

  const unpaid = bills.filter((b) => b.status === 'UNPAID' || b.status === 'OVERDUE')
  const totalUnpaid = unpaid.reduce((sum, b) => sum + parseFloat(b.amount), 0)

  const formatDate = (iso: string | null) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="费用管理" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div className="amount-card blue-tint" style={{ margin: '16px 16px 0' }}>
          <div>
            <span>未缴费用总额（元）</span>
            <strong>{loading ? '-' : totalUnpaid.toFixed(2)}</strong>
          </div>
        </div>

        <SectionTitle title={`未缴账单 (${unpaid.length})`} />
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : unpaid.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无未缴账单</div>
        ) : (
          <div style={{ display: 'grid', gap: 10, padding: '0 16px 80px' }}>
            {unpaid.map((b) => (
              <div
                key={b.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(29,45,66,.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{b.bill_type}</strong>
                  <span style={{ fontSize: 14, color: '#b68e4f', fontWeight: 700 }}>¥{b.amount}</span>
                </div>
                <p style={{ margin: '6px 0 0', color: '#57616a', fontSize: 11 }}>
                  房屋 {b.house_id} · 周期 {b.period || '-'} · 截止 {formatDate(b.due_date)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav
        active="manage"
        labels={['首页', '工单', '管理', '我的']}
        paths={['/management', '/management/repairs', '/management/notices', '/management/profile']}
      />
    </div>
  )
}
