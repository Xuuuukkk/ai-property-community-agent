import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { FeeBill, User } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const TYPE_LABELS: Record<string, string> = {
  property_fee: '物业费',
  parking_fee: '停车费',
  utility_fee: '水电费',
  maintenance_fee: '维修费',
}

const STATUS_LABELS: Record<string, string> = {
  UNPAID: '未缴',
  PAID: '已缴',
  OVERDUE: '逾期',
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  UNPAID: { color: '#c49b5a', bg: '#f8f1e4' },
  PAID: { color: '#5a8a6e', bg: '#eef6f1' },
  OVERDUE: { color: '#a94442', bg: '#fff0f0' },
}

const BULK_EXAMPLE = `[
  { "user_id": 1, "bill_type": "property_fee", "amount": 500, "period": "2026-08", "due_date": "2026-08-31" },
  { "user_id": 2, "bill_type": "parking_fee", "amount": 300, "period": "2026-08" }
]`

export default function ManagementFees() {
  const navigate = useNavigate()
  const [bills, setBills] = useState<FeeBill[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [owners, setOwners] = useState<User[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  // 新增表单字段
  const [ownerId, setOwnerId] = useState<string>('')
  const [billType, setBillType] = useState('property_fee')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [houseId, setHouseId] = useState('')
  const [bulkText, setBulkText] = useState('')

  const loadBills = () => {
    setLoading(true)
    api
      .listAllFees({ page_size: 100 })
      .then((res) => setBills(res.items))
      .finally(() => setLoading(false))
  }

  const loadOwners = () => {
    api.listUsers({ role: 'OWNER', page_size: 200 }).then((res) => setOwners(res.items))
  }

  useEffect(() => {
    loadBills()
    loadOwners()
  }, [])

  const flash = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const submitCreate = async () => {
    if (!ownerId || !amount) {
      flash('请选择业主并填写金额')
      return
    }
    setBusy(true)
    try {
      await api.createFee({
        user_id: Number(ownerId),
        house_id: houseId ? Number(houseId) : null,
        bill_type: billType,
        period: period || null,
        amount,
        due_date: dueDate || null,
      })
      flash('账单已创建')
      setShowCreate(false)
      setOwnerId(''); setAmount(''); setPeriod(''); setDueDate(''); setHouseId('')
      loadBills()
    } catch (e) {
      flash(e instanceof Error ? e.message : '创建失败')
    } finally {
      setBusy(false)
    }
  }

  const submitBulk = async () => {
    let parsed: any[]
    try {
      parsed = JSON.parse(bulkText)
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('不是有效数组')
    } catch {
      flash('JSON 格式错误，请检查')
      return
    }
    setBusy(true)
    try {
      const items = parsed.map((it) => ({
        user_id: Number(it.user_id),
        house_id: it.house_id ? Number(it.house_id) : null,
        bill_type: it.bill_type || 'property_fee',
        period: it.period || null,
        amount: String(it.amount),
        due_date: it.due_date || null,
      }))
      await api.bulkCreateFees({ items })
      flash(`已导入 ${items.length} 条账单`)
      setShowBulk(false)
      setBulkText('')
      loadBills()
    } catch (e) {
      flash(e instanceof Error ? e.message : '导入失败')
    } finally {
      setBusy(false)
    }
  }

  const markPaid = async (id: number) => {
    setBusy(true)
    try {
      await api.markFeePaid(id)
      flash('已确认收款')
      loadBills()
    } catch (e) {
      flash(e instanceof Error ? e.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  const formatDate = (iso: string | null) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const unpaid = bills.filter((b) => b.status === 'UNPAID' || b.status === 'OVERDUE')
  const totalUnpaid = unpaid.reduce((sum, b) => sum + parseFloat(b.amount), 0)
  const filtered = filter === 'ALL' ? bills : bills.filter((b) => b.status === filter)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #dedfdd',
    fontSize: 13,
    color: '#20324b',
    background: '#fff',
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

        {/* 操作区 */}
        <div style={{ display: 'flex', gap: 10, padding: '14px 16px 0' }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: '#22395e', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            ＋ 新增账单
          </button>
          <button
            onClick={() => setShowBulk(true)}
            style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid #22395e', background: '#fff', color: '#22395e', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            ⬆ 一键批量上传
          </button>
        </div>

        {msg && (
          <div style={{ margin: '10px 16px 0', padding: '10px 12px', background: '#eef6f1', color: '#3f7d5c', borderRadius: 8, fontSize: 12 }}>{msg}</div>
        )}

        {/* 新增账单弹窗 */}
        {showCreate && (
          <div style={{ margin: '14px 16px 0', background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 16px rgba(29,45,66,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: 15, color: '#20324b' }}>新增账单</strong>
              <button onClick={() => setShowCreate(false)} style={{ border: 'none', background: 'none', fontSize: 18, color: '#8d9497', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 5 }}>选择业主 *</div>
                <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} style={inputStyle}>
                  <option value="">请选择业主</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.real_name || o.username}（ID {o.id}）</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 5 }}>费用类型</div>
                <select value={billType} onChange={(e) => setBillType(e.target.value)} style={inputStyle}>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 5 }}>金额（元）*</div>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="例如 500" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 5 }}>账期</div>
                  <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2026-08" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 5 }}>截止日期</div>
                  <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" style={inputStyle} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 5 }}>房屋 ID（留空自动取业主绑定房屋）</div>
                <input value={houseId} onChange={(e) => setHouseId(e.target.value)} type="number" placeholder="可选" style={inputStyle} />
              </div>
              <button onClick={submitCreate} disabled={busy} style={{ padding: '11px 0', borderRadius: 10, border: 'none', background: '#22395e', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                {busy ? '提交中...' : '确认创建'}
              </button>
            </div>
          </div>
        )}

        {/* 批量上传弹窗 */}
        {showBulk && (
          <div style={{ margin: '14px 16px 0', background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 16px rgba(29,45,66,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: 15, color: '#20324b' }}>批量导入账单（JSON）</strong>
              <button onClick={() => setShowBulk(false)} style={{ border: 'none', background: 'none', fontSize: 18, color: '#8d9497', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: '#7e8587', marginBottom: 8 }}>粘贴 JSON 数组，每项一条账单：</div>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={BULK_EXAMPLE}
              rows={6}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #dedfdd', fontSize: 12, color: '#20324b', fontFamily: 'monospace', boxSizing: 'border-box' }}
            />
            <button onClick={submitBulk} disabled={busy} style={{ width: '100%', marginTop: 10, padding: '11px 0', borderRadius: 10, border: 'none', background: '#22395e', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? '导入中...' : '一键导入'}
            </button>
          </div>
        )}

        {/* 状态筛选 */}
        <SectionTitle title="账单列表" />
        <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', overflowX: 'auto' }}>
          {[['ALL', '全部'], ['UNPAID', '未缴'], ['PAID', '已缴'], ['OVERDUE', '逾期']].map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              style={{
                whiteSpace: 'nowrap',
                padding: '6px 14px',
                borderRadius: 14,
                fontSize: 12,
                border: '1px solid #e3e6e5',
                background: filter === k ? '#22395e' : '#fff',
                color: filter === k ? '#fff' : '#57616a',
                cursor: 'pointer',
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无账单</div>
        ) : (
          <div style={{ display: 'grid', gap: 10, padding: '0 16px 80px' }}>
            {filtered.map((b) => {
              const st = STATUS_COLORS[b.status] || { color: '#57616a', bg: '#e8edf0' }
              return (
                <div key={b.id} style={{ background: '#fff', borderRadius: 10, padding: 14, boxShadow: '0 2px 8px rgba(29,45,66,.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 13 }}>{TYPE_LABELS[b.bill_type] ?? b.bill_type}</strong>
                    <span style={{ fontSize: 14, color: '#b68e4f', fontWeight: 700 }}>¥{parseFloat(b.amount).toFixed(2)}</span>
                  </div>
                  <p style={{ margin: '6px 0 10px', color: '#57616a', fontSize: 11 }}>
                    房屋 {b.house_id} · 业主 ID {b.user_id} · 账期 {b.period || '-'} · 截止 {formatDate(b.due_date)}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: st.color, background: st.bg, padding: '3px 8px', borderRadius: 4 }}>{STATUS_LABELS[b.status] ?? b.status}</span>
                    {(b.status === 'UNPAID' || b.status === 'OVERDUE') && (
                      <button
                        onClick={() => markPaid(b.id)}
                        disabled={busy}
                        style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#22395e', color: '#fff', fontSize: 12, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}
                      >
                        确认收款
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
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
