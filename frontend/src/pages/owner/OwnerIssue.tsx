import { ImagePlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { Issue, IssueOptions } from '../../api/types'
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

export default function OwnerIssue() {
  const navigate = useNavigate()
  const [options, setOptions] = useState<IssueOptions | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ category: 'report', zone: '', location: '', location_detail: '', description: '' })
  const [images, setImages] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([api.getIssueOptions(), api.listIssues({ page_size: 50 })])
      .then(([opts, list]) => {
        setOptions(opts)
        setIssues(list.items)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => setImages((prev) => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const submit = async () => {
    if (!form.description.trim() || submitting) return
    setSubmitting(true)
    try {
      await api.createIssue({
        category: form.category,
        zone: form.zone || null,
        location: form.location || null,
        location_detail: form.location_detail || null,
        description: form.description,
        images: images.length ? images : null,
      })
      setForm({ category: 'report', zone: '', location: '', location_detail: '', description: '' })
      setImages([])
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #dedfdd',
    fontSize: 13,
    marginBottom: 10,
    background: '#fff',
    color: '#20324b',
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="问题上报" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <SectionTitle title="我要上报" />
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {(options?.categories ?? []).map((c) => (
              <button
                key={c.value}
                onClick={() => setForm({ ...form, category: c.value })}
                style={{
                  padding: '7px 14px',
                  borderRadius: 14,
                  border: form.category === c.value ? '1px solid #22395e' : '1px solid #d6d8d6',
                  background: form.category === c.value ? '#22395e' : '#fff',
                  color: form.category === c.value ? '#fff' : '#4a5568',
                  fontSize: 12,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select
            value={form.zone}
            onChange={(e) => setForm({ ...form, zone: e.target.value })}
            style={selectStyle}
          >
            <option value="">选择区域（可选）</option>
            {(options?.zones ?? []).map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={selectStyle}
          >
            <option value="">选择点位（可选）</option>
            {(options?.locations ?? []).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <input
            value={form.location_detail}
            onChange={(e) => setForm({ ...form, location_detail: e.target.value })}
            placeholder="具体位置（选填），如 3单元5楼电梯口"
            style={selectStyle}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="请描述您遇到的问题"
            rows={4}
            style={{ ...selectStyle, resize: 'none' }}
          />
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt="上报照片" style={{ width: 72, height: 54, borderRadius: 6, objectFit: 'cover' }} />
                  <button
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      background: '#e24b4a',
                      color: '#fff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <label
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '11px',
                borderRadius: 9,
                border: '1px solid #d6d8d6',
                color: '#4a5568',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <ImagePlus size={16} />
              添加照片
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
            </label>
            <button
              onClick={submit}
              disabled={submitting || !form.description.trim()}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: 9,
                background: submitting || !form.description.trim() ? '#b0b5b7' : '#22395e',
                color: '#fff',
                fontSize: 13,
              }}
            >
              {submitting ? '提交中...' : '提交上报'}
            </button>
          </div>
        </div>

        <SectionTitle title="我的上报" />
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : issues.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无上报记录</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '0 12px' }}>
            {issues.map((i) => {
              const st = STATUS_STYLES[i.status] ?? STATUS_STYLES.submitted
              return (
                <div
                  key={i.id}
                  onClick={() => setExpandedId(expandedId === i.id ? null : i.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f1ef',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#22395e', fontWeight: 500 }}>
                      {CATEGORY_LABELS[i.category] ?? i.category}
                    </span>
                    {i.zone && (
                      <span style={{ color: '#8b9194' }}>
                        {i.zone}{i.location ? ` · ${i.location}` : ''}{i.location_detail ? ` · ${i.location_detail}` : ''}
                      </span>
                    )}
                    <span style={{ flex: 1 }} />
                    <span style={{ color: st.color, background: st.bg, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>
                      {STATUS_LABELS[i.status] ?? i.status}
                    </span>
                  </div>
                  <div style={{ color: '#4a5568', lineHeight: 1.6 }}>{i.description}</div>
                  {i.assignee_name && (
                    <div style={{ fontSize: 11, color: '#185fa5' }}>
                      已派单给：{i.assignee_name}
                    </div>
                  )}
                  <time style={{ color: '#a3a5a4', fontSize: 11 }}>{formatTime(i.created_at)}</time>
                  {expandedId === i.id && (
                    i.reply ? (
                      <div style={{ background: '#f5f7fa', borderRadius: 8, padding: '10px 12px', fontSize: 12 }}>
                        <div style={{ color: '#22395e', fontWeight: 500, marginBottom: 4 }}>物业答复</div>
                        <div style={{ color: '#4a5568', lineHeight: 1.6 }}>{i.reply}</div>
                      </div>
                    ) : (
                      <div style={{ background: '#f5f7fa', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#8b9194' }}>
                        等待物业答复中…
                      </div>
                    )
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav
        active="work"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
