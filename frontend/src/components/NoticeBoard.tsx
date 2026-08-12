import { useEffect, useState } from 'react'
import { api, Notice, NoticeListResponse } from '../api/client'

const NOTICE_TYPES = [
  { value: 'facility_notice', label: '设施通知' },
  { value: 'water_power_outage', label: '停水停电' },
  { value: 'elevator_maintenance', label: '电梯维保' },
  { value: 'fire_inspection', label: '消防检查' },
  { value: 'community_activity', label: '社区活动' },
  { value: 'public_revenue', label: '公共收益' },
  { value: 'committee_notice', label: '业委会公告' },
  { value: 'weather_alert', label: '天气预警' },
]

const NOTICE_TYPE_LABELS = NOTICE_TYPES.reduce<Record<string, string>>((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

export default function NoticeBoard() {
  const [list, setList] = useState<NoticeListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createMsg, setCreateMsg] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    content: '',
    publisher_id: 1,
    notice_type: 'facility_notice',
    is_pinned: false,
  })

  const fetchNotices = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listNotices({ page_size: 20 })
      setList(data)
    } catch (err: any) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleCreate = async () => {
    setCreateMsg(null)
    try {
      await api.createNotice({
        title: form.title,
        content: form.content,
        publisher_id: Number(form.publisher_id),
        notice_type: form.notice_type,
        is_pinned: form.is_pinned,
      })
      setCreateMsg('公告发布成功')
      setForm({ title: '', content: '', publisher_id: 1, notice_type: 'facility_notice', is_pinned: false })
      fetchNotices()
    } catch (err: any) {
      setCreateMsg(`发布失败: ${err.message}`)
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Publish</span>
            <h3>发布公告</h3>
          </div>
        </div>

        <div className="form-row">
          <label className="fill">
            标题
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="公告标题"
            />
          </label>
        </div>
        <div className="form-row">
          <label className="fill">
            内容
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="公告内容"
            />
          </label>
        </div>
        <div className="form-grid notice-form-grid">
          <label>
            发布者 ID
            <input
              type="number"
              value={form.publisher_id}
              onChange={(e) => setForm({ ...form, publisher_id: Number(e.target.value) })}
              min={1}
            />
          </label>
          <label>
            类型
            <select value={form.notice_type} onChange={(e) => setForm({ ...form, notice_type: e.target.value })}>
              {NOTICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.is_pinned}
              onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
            />
            置顶公告
          </label>
          <button onClick={handleCreate} type="button">
            发布公告
          </button>
        </div>

        {createMsg && <div className={createMsg.startsWith('发布失败') ? 'error' : 'success'}>{createMsg}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Timeline</span>
            <h3>公告列表</h3>
          </div>
          <button className="secondary" onClick={fetchNotices} disabled={loading} type="button">
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {list && (
          <div className="notice-list">
            {list.items.map((notice: Notice) => (
              <article key={notice.id} className="notice-item">
                <div className="notice-heading">
                  <div>
                    <h4>{notice.title}</h4>
                    <span>
                      {NOTICE_TYPE_LABELS[notice.notice_type] || notice.notice_type} · 发布者 {notice.publisher_id} ·{' '}
                      {new Date(notice.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="notice-tags">
                    {notice.is_pinned && <span className="badge status-PUBLISHED">置顶</span>}
                    <span className={`badge status-${notice.status}`}>{notice.status}</span>
                  </div>
                </div>
                <p>{notice.content || '暂无内容'}</p>
              </article>
            ))}
            {list.items.length === 0 && <div className="empty-state">暂无公告</div>}
          </div>
        )}
      </section>
    </div>
  )
}
