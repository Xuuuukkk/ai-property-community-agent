import { Camera, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { InspectionCamera, InspectionRecord } from '../../api/types'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const ANOMALY_STYLES: Record<string, { color: string; bg: string }> = {
  垃圾堆积: { color: '#a16207', bg: '#fef3c7' },
  车辆违停: { color: '#a16207', bg: '#fef3c7' },
  消防通道堵塞: { color: '#b91c1c', bg: '#fee2e2' },
  烟雾: { color: '#b91c1c', bg: '#fee2e2' },
  可疑人员聚集: { color: '#b91c1c', bg: '#fee2e2' },
  楼道堆物: { color: '#a16207', bg: '#fef3c7' },
}

function InspectionImage({ recordId, bbox }: { recordId: number; bbox?: number[] | null }) {
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    let objectUrl: string | null = null
    api
      .getInspectionImageUrl(recordId)
      .then((u) => {
        objectUrl = u
        setUrl(u)
      })
      .catch(() => setFailed(true))
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [recordId])

  if (failed) {
    return (
      <div
        style={{
          width: 72,
          height: 48,
          borderRadius: 6,
          background: '#f0f1ef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a3a5a4',
          fontSize: 10,
        }}
      >
        无图
      </div>
    )
  }
  if (!url) {
    return <div style={{ width: 72, height: 48, borderRadius: 6, background: '#f0f1ef' }} />
  }

  const [x1, y1, x2, y2] = bbox && bbox.length === 4 ? bbox : [0, 0, 0, 0]
  const hasBox = bbox && bbox.length === 4 && (x2 - x1 > 0.01 || y2 - y1 > 0.01)

  return (
    <>
      <div
        onClick={() => setZoomed(true)}
        style={{
          position: 'relative',
          width: 72,
          height: 48,
          borderRadius: 6,
          overflow: 'hidden',
          flexShrink: 0,
          cursor: 'zoom-in',
          background: '#000',
        }}
      >
        <img src={url} alt="巡检截图" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
        {hasBox && (
          <div
            style={{
              position: 'absolute',
              left: `${x1 * 100}%`,
              top: `${y1 * 100}%`,
              width: `${(x2 - x1) * 100}%`,
              height: `${(y2 - y1) * 100}%`,
              border: '2px solid #e24b4a',
              background: 'rgba(226, 75, 74, 0.15)',
              boxSizing: 'border-box',
            }}
          />
        )}
      </div>

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div style={{ position: 'relative', width: '90%', maxWidth: 420 }}>
            <img src={url} alt="巡检截图大图" style={{ width: '100%', borderRadius: 10, display: 'block' }} />
            {hasBox && (
              <div
                style={{
                  position: 'absolute',
                  left: `${x1 * 100}%`,
                  top: `${y1 * 100}%`,
                  width: `${(x2 - x1) * 100}%`,
                  height: `${(y2 - y1) * 100}%`,
                  border: '3px solid #e24b4a',
                  background: 'rgba(226, 75, 74, 0.15)',
                  boxSizing: 'border-box',
                  borderRadius: 3,
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function ManagementInspection() {
  const navigate = useNavigate()
  const [cameras, setCameras] = useState<InspectionCamera[]>([])
  const [records, setRecords] = useState<InspectionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [runningId, setRunningId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.listInspectionCameras(),
      api.listInspectionRecords({ page_size: 50 }),
    ])
      .then(([camRes, recRes]) => {
        setCameras(camRes.items)
        setRecords(recRes.items)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const run = async (cameraId: number) => {
    setRunningId(cameraId)
    try {
      await api.runInspection(cameraId)
      load()
    } finally {
      setRunningId(null)
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const anomalyCount = records.filter((r) => r.anomaly_type).length

  return (
    <div className="page dashboard-page">
      <AppHeader title="自动巡检" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        <div className="amount-card blue-tint">
          <div>
            <span>今日异常（条）</span>
            <strong>{loading ? '-' : String(anomalyCount)}</strong>
          </div>
          <Camera size={23} />
        </div>

        <SectionTitle title="监控点" />
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : cameras.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无监控点</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 16px', padding: '0 12px' }}>
            {cameras.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 46,
                  borderBottom: '1px solid #f0f1ef',
                  gap: 10,
                  fontSize: 13,
                }}
              >
                <Camera size={16} style={{ color: '#22395e' }} />
                <b style={{ flex: 1, fontWeight: 500 }}>{c.name}</b>
                <span style={{ fontSize: 11, color: c.enabled ? '#2f9e63' : '#a3a5a4' }}>
                  {c.enabled ? '启用' : '停用'}
                </span>
                <button
                  onClick={() => run(c.id)}
                  disabled={runningId === c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 10px',
                    borderRadius: 7,
                    border: '1px solid #d6d8d6',
                    background: runningId === c.id ? '#f0f1ef' : '#fff',
                    color: '#22395e',
                    fontSize: 12,
                  }}
                >
                  <RefreshCw size={13} />
                  {runningId === c.id ? '巡检中' : '立即巡检'}
                </button>
              </div>
            ))}
          </div>
        )}

        <SectionTitle title="巡检记录" />
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>加载中...</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#7e8587', fontSize: 12 }}>暂无巡检记录</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 8, margin: '0 16px 80px', padding: '0 12px' }}>
            {records.map((r) => {
              const style = r.anomaly_type ? ANOMALY_STYLES[r.anomaly_type] : undefined
              const cam = cameras.find((c) => c.id === r.camera_id)
              return (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    borderBottom: '1px solid #f0f1ef',
                    fontSize: 11,
                    padding: '10px 0',
                  }}
                >
                  {r.image_path && r.status === 'success' && <InspectionImage recordId={r.id} bbox={r.bbox} />}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          color: style ? style.color : '#2f9e63',
                          background: style ? style.bg : '#e7f6ee',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontWeight: 500,
                        }}
                      >
                        {r.status === 'error' ? '失败' : r.anomaly_type ? r.anomaly_type : '正常'}
                      </span>
                      {r.confidence != null && r.status === 'success' && (
                        <span style={{ color: '#8b9194' }}>置信度 {Math.round(r.confidence * 100)}%</span>
                      )}
                      <span style={{ flex: 1 }} />
                      <time style={{ color: '#8b9194', whiteSpace: 'nowrap' }}>{formatTime(r.created_at)}</time>
                    </div>
                    <div style={{ color: '#4a5568', lineHeight: 1.6 }}>
                      <span style={{ color: '#22395e', fontWeight: 500 }}>{cam?.name ?? `监控点 ${r.camera_id}`}</span>
                      {r.status === 'error' ? ` · ${r.error || '巡检失败'}` : ` · ${r.summary || ''}`}
                    </div>
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
