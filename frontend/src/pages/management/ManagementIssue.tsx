import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { Issue } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const CATEGORY_LABELS: Record<string, string> = {
  public_facility: '公共设施报修',
  complaint: '意见投诉',
  report: '随手拍问题',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: '已提交',
  processing: '处理中',
  resolved: '已解决',
}

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  submitted: { color: '#854f0b', bg: '#faeeda' },
  processing: { color: '#185fa5', bg: '#e6f1fb' },
  resolved: { color: '#0f6e56', bg: '#e1f5ee' },
}

export default function ManagementIssue() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyingId, setReplyingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    api
      .listIssues({ page_size: 100, issue_status: statusFilter || undefined })
      .then((res) => setIssues(res.items))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  const reply = async (issueId: number) => {
    if (!replyText.trim() || replyingId !== null) return
    setReplyingId(issueId)
    try {
      await api.replyIssue(issueId, replyText.trim())
      setReplyText('')
      load()
    } finally {
      setReplyingId(null)
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const pending = issues.filter((i) => i.status !== 'resolved').length

  return (
    <div className="page dashboard-page">
      <AppHeader title="业主上报处理" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div className="amount-card blue-tint">
          <div>
            <span>待处理（条）</span>
            <strong>{loading ? '-' : String(pending)}</strong>
          </div>
        </div>

        <SectionTitle title="上报列表" />
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {([null, 'submitted', 'processing', 'resolved'] as const).map((s) => (
            <button
              key={s ?? 'all'}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '5px 12px',
                borderRadius: 14,
                border: statusFilter === s ? '1px solid #22395e' : '1px solid #d6d8d6',
                background: statusFilter === s ? '#22395e' : '#fff',
                color: statusFilter === s ? '#fff' : '#4a5568',
                fontSize: 12,
              }}
            >
              {s === null ? '全部' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : issues.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无上报</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '0 12px' }}>
            {issues.map((i) => {
              const st = STATUS_STYLES[i.status] ?? STATUS_STYLES.submitted
              const expanded = expandedId === i.id
              return (
                <div
                  key={i.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f1ef',
                    fontSize: 12,
                  }}
                >
                  <div
                    onClick={() => setExpandedId(expanded ? null : i.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <span style={{ color: '#22395e', fontWeight: 500 }}>
                      {CATEGORY_LABELS[i.category] ?? i.category}
                    </span>
                    {i.zone && <span style={{ color: '#8b9194' }}>{i.zone}{i.location ? ` · ${i.location}` : ''}</span>}
                    <span style={{ flex: 1 }} />
                    <span style={{ color: st.color, background: st.bg, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>
                      {STATUS_LABELS[i.status] ?? i.status}
                    </span>
                  </div>
                  <div style={{ color: '#4a5568', lineHeight: 1.6 }}>{i.description}</div>
                  <time style={{ color: '#a3a5a4', fontSize: 11 }}>{formatTime(i.created_at)}</time>

                  {expanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {i.images && i.images.length > 0 && (
                        <IssueImages images={i.images} />
                      )}
                      {i.reply ? (
                        <div style={{ background: '#f0f7f4', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ color: '#0f6e56', fontWeight: 500, marginBottom: 4 }}>已答复</div>
                          <div style={{ color: '#4a5568', lineHeight: 1.6 }}>{i.reply}</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="填写答复内容，提交后该上报将标记为已解决"
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 8,
                              border: '1px solid #dedfdd',
                              fontSize: 13,
                              resize: 'none',
                            }}
                          />
                          <button
                            onClick={() => reply(i.id)}
                            disabled={replyingId !== null || !replyText.trim()}
                            style={{
                              alignSelf: 'flex-end',
                              padding: '8px 18px',
                              borderRadius: 8,
                              background: replyingId !== null || !replyText.trim() ? '#b0b5b7' : '#22395e',
                              color: '#fff',
                              fontSize: 13,
                            }}
                          >
                            {replyingId === i.id ? '提交中...' : '答复并解决'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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

function IssueImages({ images }: { images: string[] }) {
  const [urls, setUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    let objectUrls: string[] = []
    images.forEach((img) => {
      api
        .getIssueImageUrl(img)
        .then((u) => {
          objectUrls.push(u)
          setUrls((prev) => ({ ...prev, [img]: u }))
        })
        .catch(() => {})
    })
    return () => {
      objectUrls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [images])

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {images.map((img) =>
        urls[img] ? (
          <img key={img} src={urls[img]} alt="上报照片" style={{ width: 80, height: 60, borderRadius: 6, objectFit: 'cover' }} />
        ) : (
          <div key={img} style={{ width: 80, height: 60, borderRadius: 6, background: '#f0f1ef' }} />
        ),
      )}
    </div>
  )
}
