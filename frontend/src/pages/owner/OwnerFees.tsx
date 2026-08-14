import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'
import type { FeeBill } from '../../api/types'

const statusMap: Record<string, string> = {
  UNPAID: '未缴费',
  PAID: '已缴费',
  OVERDUE: '已逾期',
}

export default function OwnerFees() {
  const { user } = useAuth()
  const [fees, setFees] = useState<FeeBill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    api
      .listFeesByUser(user.id, { page_size: 50 })
      .then((res) => {
        if (cancelled) return
        setFees(res.items)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const unpaidTotal = fees
    .filter((f) => f.status === 'UNPAID')
    .reduce((sum, f) => sum + Number.parseFloat(f.amount), 0)

  return (
    <div className="page dashboard-page">
      <AppHeader title="费用查询" onBack={() => window.history.back()} />
      <div className="dashboard-scroll">
        <div className="amount-card">
          <div>
            <span>未缴费用总额（元）</span>
            <strong>{unpaidTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <button>去缴费</button>
        </div>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: '12px 14px',
              background: '#fff0f0',
              color: '#a94442',
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          {loading && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#7e8587', fontSize: 13 }}>加载中...</div>
          )}
          {!loading && fees.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#7e8587', fontSize: 13 }}>暂无费用记录</div>
          )}
          {!loading &&
            fees.map((fee) => (
              <div
                key={fee.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 13px rgba(29,45,66,.05)',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#20324b' }}>
                    {fee.bill_type === 'property_fee' ? '物业费' : fee.bill_type === 'parking_fee' ? '停车费' : fee.bill_type}
                  </div>
                  <div style={{ fontSize: 11, color: '#7e8587', marginTop: 5 }}>
                    {fee.period ? `${fee.period} · ` : ''}截止 {fee.due_date ?? '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#20324b' }}>¥{Number.parseFloat(fee.amount).toFixed(2)}</div>
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 4,
                      color: fee.status === 'UNPAID' ? '#c49b5a' : fee.status === 'OVERDUE' ? '#a94442' : '#5a8a6e',
                      background: fee.status === 'UNPAID' ? '#f8f1e4' : fee.status === 'OVERDUE' ? '#fff0f0' : '#eef6f1',
                      padding: '2px 6px',
                      borderRadius: 4,
                      display: 'inline-block',
                    }}
                  >
                    {statusMap[fee.status] ?? fee.status}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <BottomNav
        active="home"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
