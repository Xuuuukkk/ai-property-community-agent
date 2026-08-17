import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { DashboardStats, DashboardInsights } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const REPAIR_TYPE_LABELS: Record<string, string> = {
  water_leak: '漏水',
  power_trip: '跳闸',
  wall_seepage: '墙面渗水',
  elevator_fault: '电梯故障',
  access_control: '门禁故障',
  public_facility: '公共设施',
}

const REPAIR_STATUS_LABELS: Record<string, string> = {
  CREATED: '待处理',
  ASSIGNED: '已派单',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
  CLOSED: '已关闭',
}

const ISSUE_CATEGORY_LABELS: Record<string, string> = {
  public_facility: '公共设施报修',
  complaint: '意见投诉',
  report: '随手拍问题',
}

const pct = (v: number) => `${Math.round(v * 100)}%`

const money = (v: number) => `¥${v.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`

function Bar({ label, value, max, color = '#22395e' }: { label: string; value: number; max: number; color?: string }) {
  const width = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4a5568' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 500, color: '#20324b' }}>{value}</span>
      </div>
      <div style={{ height: 8, background: '#f0f1ef', borderRadius: 4, marginTop: 4, overflow: 'hidden' }}>
        <div style={{ width: `${width}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 4px 13px rgba(29,45,66,.05)' }}>
      <div style={{ fontSize: 12, color: '#7e8587' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#22395e', marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#a3a5a4', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function ManagementStats() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false))
    api.getDashboardInsights().then(setInsights).catch(() => {})
  }, [])

  if (loading) {
    return (
      <div className="page dashboard-page">
        <AppHeader title="数据统计" onBack={() => navigate(-1)} />
        <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 13 }}>加载中...</div>
      </div>
    )
  }

  if (!stats) return null

  const repairMax = Math.max(1, ...Object.values(stats.repair.by_type))
  const anomalyMax = Math.max(1, ...Object.values(stats.inspection.by_anomaly))

  return (
    <div className="page dashboard-page">
      <AppHeader title="数据统计汇报" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <StatCard label="工单完成率" value={pct(stats.repair.completion_rate)} sub={`${stats.repair.completed}/${stats.repair.total} 单完成`} />
            <StatCard label="费用收缴率" value={pct(stats.fee.collection_rate)} sub={`已收 ${money(stats.fee.paid_amount)}`} />
            <StatCard label="巡检异常" value={String(stats.inspection.anomaly_count)} sub={`${stats.inspection.total} 次巡检`} />
            <StatCard label="上报待处理" value={String(stats.issue.processing + stats.issue.submitted)} sub={`共 ${stats.issue.total} 条上报`} />
          </div>
        </div>

        <SectionTitle title="数据洞察报告" />
        {insights && (
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.report && (
              <div style={{ background: 'linear-gradient(135deg, #22395e, #2f4a78)', borderRadius: 12, padding: '14px 16px', color: '#fff' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>智能总结</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{insights.report}</div>
              </div>
            )}
            {insights.insights.map((ins, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', boxShadow: '0 2px 8px rgba(29,45,66,.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      color: ins.severity === 'critical' ? '#b91c1c' : ins.severity === 'warning' ? '#a16207' : '#185fa5',
                      background: ins.severity === 'critical' ? '#fee2e2' : ins.severity === 'warning' ? '#fef3c7' : '#e6f1fb',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {ins.severity === 'critical' ? '严重' : ins.severity === 'warning' ? '关注' : '提示'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#20324b' }}>{ins.title}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: '#a3a5a4' }}>{ins.category}</span>
                </div>
                <div style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.6 }}>{ins.detail}</div>
              </div>
            ))}
          </div>
        )}

        <SectionTitle title="社区概览" />
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <StatCard label="业主" value={String(stats.community.users)} />
            <StatCard label="房屋" value={String(stats.community.houses)} />
            <StatCard label="楼栋" value={String(stats.community.buildings)} />
          </div>
        </div>

        <SectionTitle title="维修工单" />
        <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 16px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
            <div><span style={{ fontSize: 11, color: '#7e8587' }}>总工单</span><div style={{ fontSize: 20, fontWeight: 700, color: '#22395e' }}>{stats.repair.total}</div></div>
            <div><span style={{ fontSize: 11, color: '#7e8587' }}>待处理</span><div style={{ fontSize: 20, fontWeight: 700, color: '#c49b5a' }}>{stats.repair.pending}</div></div>
            <div><span style={{ fontSize: 11, color: '#7e8587' }}>已完成</span><div style={{ fontSize: 20, fontWeight: 700, color: '#2f9e63' }}>{stats.repair.completed}</div></div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#20324b', marginBottom: 10 }}>按类型</div>
          {Object.entries(stats.repair.by_type)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <Bar key={type} label={REPAIR_TYPE_LABELS[type] ?? type} value={count} max={repairMax} />
            ))}
        </div>

        <SectionTitle title="费用收缴" />
        <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 16px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
            <div><span style={{ fontSize: 11, color: '#7e8587' }}>应收总额</span><div style={{ fontSize: 18, fontWeight: 700, color: '#22395e' }}>{money(stats.fee.total_amount)}</div></div>
            <div><span style={{ fontSize: 11, color: '#7e8587' }}>已收</span><div style={{ fontSize: 18, fontWeight: 700, color: '#2f9e63' }}>{money(stats.fee.paid_amount)}</div></div>
          </div>
          <div style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.7 }}>
            已缴 {stats.fee.paid_count} 户 · 未缴 {stats.fee.unpaid_count} 户（含逾期 {stats.fee.overdue_count} 户）
          </div>
        </div>

        <SectionTitle title="巡检与上报" />
        <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#20324b', marginBottom: 10 }}>巡检异常类型</div>
          {Object.entries(stats.inspection.by_anomaly)
            .sort((a, b) => b[1] - a[1])
            .map(([anomaly, count]) => (
              <Bar
                key={anomaly}
                label={anomaly}
                value={count}
                max={anomalyMax}
                color={anomaly === '正常' ? '#2f9e63' : '#e24b4a'}
              />
            ))}

          <div style={{ fontSize: 13, fontWeight: 600, color: '#20324b', margin: '16px 0 10px' }}>业主上报类型</div>
          {Object.entries(stats.issue.by_category).length === 0 ? (
            <div style={{ fontSize: 12, color: '#a3a5a4' }}>暂无上报</div>
          ) : (
            Object.entries(stats.issue.by_category).map(([cat, count]) => (
              <Bar key={cat} label={ISSUE_CATEGORY_LABELS[cat] ?? cat} value={count} max={Math.max(1, ...Object.values(stats.issue.by_category))} color="#185fa5" />
            ))
          )}
        </div>
      </div>
      <BottomNav
        active="home"
        labels={['首页', '工单', '管理', '我的']}
        paths={['/management', '/management/repairs', '/management/notices', '/management/profile']}
      />
    </div>
  )
}
