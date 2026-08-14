import {
  CircleUserRound,
  FileText,
  Megaphone,
  MessageCircle,
  Receipt,
  ScanLine,
  Wrench,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { NoticeList, SectionTitle, ServiceItem } from '../../components/common'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'
import type { FeeBill, Notice, RepairOrder } from '../../api/types'

export default function OwnerHome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [fees, setFees] = useState<FeeBill[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [repairs, setRepairs] = useState<RepairOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const unpaidTotal = useMemo(() => {
    return fees
      .filter((f) => f.status === 'UNPAID')
      .reduce((sum, f) => sum + Number.parseFloat(f.amount), 0)
  }, [fees])

  const pendingRepairs = useMemo(() => {
    return repairs.filter((r) => ['CREATED', 'ASSIGNED', 'PROCESSING'].includes(r.status)).length
  }, [repairs])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([
      api.listFeesByUser(user.id, { page_size: 20 }),
      api.listNotices({ page_size: 5, status: 'PUBLISHED' }),
      api.listRepairs({ user_id: user.id, page_size: 20 }),
    ])
      .then(([feeRes, noticeRes, repairRes]) => {
        if (cancelled) return
        setFees(feeRes.items)
        setNotices(noticeRes.items)
        setRepairs(repairRes.items)
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

  return (
    <div className="page dashboard-page">
      <AppHeader title="云溪花园智慧社区" />
      <div className="dashboard-scroll">
        <div className="profile-card">
          <div className="avatar">
            <CircleUserRound size={40} />
          </div>
          <div>
            <strong>
              {user?.real_name ?? user?.username ?? '业主'} <small>业主</small>
            </strong>
            <p>欢迎回到云溪花园</p>
          </div>
          <ScanLine size={21} />
        </div>

        <div className="amount-card">
          <div>
            <span>未缴费用总额（元）</span>
            <strong>{unpaidTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
          <button>去缴费</button>
        </div>

        <SectionTitle title="快捷服务" />
        <div className="service-grid four">
          <ServiceItem icon={<Wrench />} label="报修服务" onClick={() => navigate('/owner/repairs')} />
          <ServiceItem icon={<Receipt />} label="费用查询" onClick={() => navigate('/owner/fees')} />
          <ServiceItem icon={<Megaphone />} label="社区公告" onClick={() => navigate('/owner/notices')} />
          <ServiceItem icon={<FileText />} label="我的工单" onClick={() => navigate('/owner/repairs')} />
        </div>

        {pendingRepairs > 0 && (
          <div
            style={{
              marginTop: 14,
              background: '#fff',
              borderRadius: 10,
              padding: '13px 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 13px rgba(29,45,66,.05)',
            }}
          >
            <span style={{ fontSize: 13, color: '#20324b' }}>进行中工单</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#bfa46a' }}>{pendingRepairs}</span>
          </div>
        )}

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

        <NoticeList title="社区公告" notices={notices} loading={loading} />

        <div className="ai-card" onClick={() => navigate('/owner/ai')} style={{ cursor: 'pointer' }}>
          <div>
            <strong>AI 社区助手</strong>
            <p>有问题？问问社区助手</p>
          </div>
          <div className="bot-bubble">
            <MessageCircle size={27} />
          </div>
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
