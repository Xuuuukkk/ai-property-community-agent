import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { SectionTitle } from '../../components/common'

const TYPE_OPTIONS = [
  { value: 'water_leak', label: '漏水' },
  { value: 'power_trip', label: '跳闸' },
  { value: 'wall_seepage', label: '墙面渗水' },
  { value: 'elevator_fault', label: '电梯故障' },
  { value: 'access_control', label: '门禁故障' },
  { value: 'public_facility', label: '公共设施' },
]

const URGENCY_OPTIONS = [
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
  { value: 'URGENT', label: '紧急' },
]

export default function OwnerRepairForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [type, setType] = useState('water_leak')
  const [urgency, setUrgency] = useState('MEDIUM')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

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
    if (!user || !description.trim() || submitting) return
    setSubmitting(true)
    try {
      await api.createRepair({
        user_id: user.id,
        house_id: null,
        type,
        description: description.trim(),
        urgency,
        image_urls: images.length ? images : null,
      })
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = {
    width: '100%',
    padding: '11px 12px',
    borderRadius: 8,
    border: '1px solid #dedfdd',
    fontSize: 13,
    marginBottom: 12,
    background: '#fff',
    color: '#20324b',
  }

  return (
    <div className="page dashboard-page">
      <AppHeader title="在线报修" onBack={() => navigate(-1)} />
      <div className="dashboard-scroll">
        {done ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#20324b', marginBottom: 8 }}>报修提交成功</div>
            <div style={{ fontSize: 13, color: '#7e8587', marginBottom: 20 }}>维修师傅将尽快与您联系</div>
            <button
              onClick={() => navigate('/owner/repairs')}
              style={{ padding: '10px 24px', borderRadius: 9, background: '#22395e', color: '#fff', fontSize: 13, border: 'none' }}
            >
              查看我的工单
            </button>
          </div>
        ) : (
          <div style={{ padding: '0 16px 24px' }}>
            <SectionTitle title="填写报修信息" />
            <select value={type} onChange={(e) => setType(e.target.value)} style={fieldStyle}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={fieldStyle}>
              {URGENCY_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}优先级</option>
              ))}
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请描述故障情况，如：厨房水龙头漏水，持续滴漏"
              rows={4}
              style={{ ...fieldStyle, resize: 'none' }}
            />
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={img} alt="报修图片" style={{ width: 72, height: 54, borderRadius: 6, objectFit: 'cover' }} />
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
                disabled={submitting || !description.trim()}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 9,
                  background: submitting || !description.trim() ? '#b0b5b7' : '#22395e',
                  color: '#fff',
                  fontSize: 13,
                }}
              >
                {submitting ? '提交中...' : '提交报修'}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav
        active="home"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
