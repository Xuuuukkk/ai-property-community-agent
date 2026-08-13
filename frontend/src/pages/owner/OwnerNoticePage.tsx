import { useEffect, useState } from 'react'
import { api, Notice, NoticeListResponse } from '../../api/client'
import { NoticeIcon } from '../../components/owner/icons'
import OwnerShell from './OwnerShell'

const NOTICE_TYPE_LABELS: Record<string, string> = {
  facility_notice: '设施通知',
  water_power_outage: '停水停电',
  elevator_maintenance: '电梯维保',
  fire_inspection: '消防检查',
  community_activity: '社区活动',
  public_revenue: '公共收益',
  committee_notice: '业委会公告',
  weather_alert: '天气预警',
}

export default function OwnerNoticePage() {
  const [list, setList] = useState<NoticeListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotices = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listNotices({ page_size: 20, status: 'PUBLISHED' })
      setList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchNotices()
  }, [])

  const pinnedCount = list?.items.filter((item) => item.is_pinned).length ?? 0

  return (
    <OwnerShell activeTab="notice">
      <section className="owner-workspace-head">
        <div>
          <span className="owner-eyebrow">公告</span>
          <h2>社区公告</h2>
          <p>查看最新通知、维保安排、公共收益和活动信息。</p>
        </div>
        <div className="owner-workspace-hero">
          <span className="owner-workspace-hero-icon">
            <NoticeIcon />
          </span>
          <div>
            <strong>公告统一查看</strong>
            <span>默认展示已发布内容和置顶公告</span>
          </div>
        </div>
      </section>

      <section className="owner-panel">
        <div className="owner-panel-header">
          <div>
            <span className="owner-eyebrow">Timeline</span>
            <h3>公告列表</h3>
          </div>
          <div className="owner-tag-row">
            <span className="owner-panel-note">置顶 {pinnedCount}</span>
            <button className="owner-secondary" type="button" onClick={() => void fetchNotices()} disabled={loading}>
              {loading ? '刷新中...' : '刷新'}
            </button>
          </div>
        </div>

        {error && <div className="owner-error">{error}</div>}

        {list ? (
          <div className="owner-list">
            {list.items.map((notice: Notice) => (
              <article key={notice.id} className="owner-list-item">
                <div className="owner-list-top">
                  <div>
                    <h4>{notice.title}</h4>
                    <p>
                      {NOTICE_TYPE_LABELS[notice.notice_type] || notice.notice_type} · 发布者 {notice.publisher_id} ·{' '}
                      {new Date(notice.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="owner-tag-row">
                    {notice.is_pinned && <span className="badge status-PUBLISHED">置顶</span>}
                    <span className={`badge status-${notice.status}`}>{notice.status}</span>
                  </div>
                </div>
                <p className="owner-list-desc">{notice.content || '暂无内容'}</p>
              </article>
            ))}
            {list.items.length === 0 && (
              <div className="owner-empty">
                <strong>暂无公告</strong>
                <span>当前没有可展示的社区公告。</span>
              </div>
            )}
          </div>
        ) : (
          <div className="owner-empty">
            <strong>公告加载中</strong>
            <span>这里会显示最新的社区通知。</span>
          </div>
        )}
      </section>
    </OwnerShell>
  )
}
