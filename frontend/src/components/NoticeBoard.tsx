import { useEffect, useState } from 'react'
import { api, Notice, NoticeListResponse } from '../api/client'

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
    <div>
      <div className="card">
        <h2>发布公告</h2>
        <div className="form-row">
          <label style={{ flex: 1 }}>
            标题
            <input
              style={{ width: '100%' }}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="公告标题"
            />
          </label>
        </div>
        <div className="form-row">
          <label style={{ flex: 1 }}>
            内容
            <textarea
              rows={3}
              style={{ width: '100%' }}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="公告内容"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            发布者 ID
            <input
              type="number"
              value={form.publisher_id}
              onChange={(e) => setForm({ ...form, publisher_id: Number(e.target.value) })}
            />
          </label>
          <label>
            类型
            <select value={form.notice_type} onChange={(e) => setForm({ ...form, notice_type: e.target.value })}>
              <option value="facility_notice">设施通知</option>
              <option value="water_power_outage">停水停电</option>
              <option value="elevator_maintenance">电梯维保</option>
              <option value="fire_inspection">消防检查</option>
              <option value="community_activity">社区活动</option>
              <option value="public_revenue">公共收益</option>
              <option value="committee_notice">业委会公告</option>
              <option value="weather_alert">天气预警</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.is_pinned}
              onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
            />{' '}
            置顶
          </label>
          <button onClick={handleCreate}>发布公告</button>
        </div>
        {createMsg && <div className={createMsg.startsWith('发布失败') ? 'error' : 'success'}>{createMsg}</div>}
      </div>

      <div className="card">
        <h2>公告列表</h2>
        {error && <div className="error">{error}</div>}
        <button className="secondary" onClick={fetchNotices} disabled={loading}>
          {loading ? '刷新中...' : '刷新'}
        </button>

        {list && (
          <>
            {list.items.map((notice: Notice) => (
              <div key={notice.id} style={{ marginTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{notice.title}</h3>
                  {notice.is_pinned && <span className="badge status-PUBLISHED">置顶</span>}
                  <span className={`badge status-${notice.status}`}>{notice.status}</span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#4b5563' }}>{notice.content || '无内容'}</p>
                <small style={{ color: '#9ca3af' }}>
                  {notice.notice_type} · 发布者 {notice.publisher_id} · {new Date(notice.created_at).toLocaleString()}
                </small>
              </div>
            ))}
            {list.items.length === 0 && <div className="empty">暂无公告</div>}
          </>
        )}
      </div>
    </div>
  )
}
