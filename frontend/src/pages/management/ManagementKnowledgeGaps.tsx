import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { KnowledgeGap, FeedbackStats } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

export default function ManagementKnowledgeGaps() {
  const navigate = useNavigate()
  const [gaps, setGaps] = useState<KnowledgeGap[]>([])
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([api.listKnowledgeGaps('pending'), api.getFeedbackStats().catch(() => null)])
      .then(([gapRes, statsRes]) => {
        setGaps(gapRes.items)
        setStats(statsRes)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const act = async (gapId: number, action: 'approve' | 'reject') => {
    setActingId(gapId)
    try {
      if (action === 'approve') {
        await api.approveKnowledgeGap(gapId, answers[gapId]?.trim() || undefined)
      } else {
        await api.rejectKnowledgeGap(gapId)
      }
      load()
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="知识缺口审核" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        {stats && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#7e8587' }}>反馈总数</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#22395e' }}>{stats.total}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#7e8587' }}>好评</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#2f9e63' }}>{stats.up}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#7e8587' }}>点踩率</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#a32d2d' }}>{Math.round(stats.down_rate * 100)}%</div>
              </div>
            </div>
            {stats.top_problems.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#20324b', marginBottom: 8 }}>高频未解决问题</div>
                {stats.top_problems.map((p, idx) => (
                  <div key={idx} style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.6, marginBottom: 4 }}>
                    · {p.question}（点踩 {p.count} 次）
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <SectionTitle title="待审核缺口" />
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : gaps.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无待审核的缺口</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '0 12px' }}>
            {gaps.map((g) => (
              <div key={g.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f1ef', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#20324b' }}>{g.question}</div>
                {g.suggested_answer && (
                  <div style={{ fontSize: 12, color: '#8b9194' }}>业主建议：{g.suggested_answer}</div>
                )}
                <textarea
                  value={answers[g.id] ?? g.suggested_answer ?? ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [g.id]: e.target.value }))}
                  placeholder="填写审核后的正确答案"
                  rows={2}
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #dedfdd',
                    fontSize: 12, resize: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => act(g.id, 'reject')}
                    disabled={actingId === g.id}
                    style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #d6d8d6', background: '#fff', color: '#4a5568', fontSize: 12 }}
                  >
                    拒绝
                  </button>
                  <button
                    onClick={() => act(g.id, 'approve')}
                    disabled={actingId === g.id}
                    style={{ padding: '6px 14px', borderRadius: 8, background: '#2f9e63', color: '#fff', fontSize: 12, border: 'none' }}
                  >
                    {actingId === g.id ? '处理中...' : '通过并写入知识库'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav
        active="home"
        labels={['首页', '工单', '管理', '我的']}
        paths={['/management', '/management/repairs', '/management/notices', '/management/profile']}
      />
    </div>
  )
}
