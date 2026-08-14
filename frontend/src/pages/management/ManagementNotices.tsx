import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { Notice } from '../../api/types'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

export default function ManagementNotices() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .listNotices({ status: 'PUBLISHED', page_size: 50 })
      .then((res) => setNotices(res.items))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const publish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !user) return
    setSaving(true)
    try {
      await api.createNotice({
        title: form.title,
        content: form.content,
        publisher_id: user.id,
        notice_type: 'facility_notice',
        is_pinned: false,
      })
      setForm({ title: '', content: '' })
      load()
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="公告管理" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <SectionTitle title="发布公告" />
        <form onSubmit={publish} style={{ padding: '0 16px 16px' }}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="公告标题"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #dedfdd',
              fontSize: 13,
              marginBottom: 10,
            }}
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="公告内容"
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #dedfdd',
              fontSize: 13,
              marginBottom: 10,
              resize: 'none',
            }}
          />
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 9,
              background: saving ? '#b0b5b7' : '#22395e',
              color: '#fff',
              fontSize: 13,
            }}
          >
            {saving ? '发布中...' : '发布'}
          </button>
        </form>

        <SectionTitle title="已发布公告" />
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : notices.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无公告</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '0 12px' }}>
            {notices.map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 42,
                  borderBottom: '1px solid #f0f1ef',
                  gap: 8,
                  fontSize: 11,
                }}
              >
                <span
                  style={{
                    color: n.is_pinned ? '#ad8a45' : '#a3a5a4',
                    background: n.is_pinned ? '#f5ecd7' : 'transparent',
                    padding: n.is_pinned ? '2px 4px' : 0,
                  }}
                >
                  {n.is_pinned ? '置顶' : '通知'}
                </span>
                <b style={{ flex: 1, fontWeight: 500 }}>{n.title}</b>
                <time style={{ color: '#8b9194' }}>{formatDate(n.created_at)}</time>
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
