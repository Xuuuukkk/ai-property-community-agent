import { useEffect, useRef, useState } from 'react'
import { Send, ImagePlus, X } from 'lucide-react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[]
}

interface PendingRepair {
  step?: string
  item?: string
  description?: string
  image_urls?: string[]
}

export default function OwnerAiChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '您好，我是云溪花园社区助手，请问有什么可以帮您？' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [pendingRepair, setPendingRepair] = useState<PendingRepair | null>(null)
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setPendingImages((prev) => [...prev, dataUrl])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removePendingImage = (idx: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const send = async () => {
    const text = input.trim()
    if ((!text && pendingImages.length === 0) || loading) return

    const imageTags = pendingImages.length ? `\n${pendingImages.join('\n')}` : ''
    const fullMessage = text + imageTags

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      images: pendingImages.length ? [...pendingImages] : undefined,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setPendingImages([])
    setLoading(true)

    try {
      const res = await api.chatAgent({
        message: fullMessage,
        user_id: user?.id ?? null,
        conversation_id: conversationId,
        pending_repair: pendingRepair as Record<string, unknown> | null,
      })
      setConversationId(res.conversation_id)
      setPendingRepair(res.pending_repair as PendingRepair | null)
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'r', role: 'assistant', content: res.response },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'r', role: 'assistant', content: '抱歉，服务暂时不可用，请稍后再试。' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page dashboard-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <AppHeader title="AI 社区助手" onBack={() => window.history.back()} />
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: 12,
              background: m.role === 'user' ? '#22395e' : '#fff',
              color: m.role === 'user' ? '#fff' : '#20324b',
              fontSize: 13,
              lineHeight: 1.5,
              boxShadow: '0 2px 8px rgba(29,45,66,.06)',
              whiteSpace: 'pre-line',
            }}
          >
            {m.content}
            {m.images && m.images.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {m.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="上传图片"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', fontSize: 12, color: '#7e8587' }}>助手思考中...</div>
        )}
      </div>

      {pendingImages.length > 0 && (
        <div
          style={{
            padding: '8px 14px 0',
            background: '#fff',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            borderTop: '1px solid #e9e9e6',
          }}
        >
          {pendingImages.map((img, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <img src={img} alt="待发送" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
              <button
                onClick={() => removePendingImage(idx)}
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#ff4d4f',
                  color: '#fff',
                  border: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          padding: '10px 14px 24px',
          background: '#fff',
          borderTop: '1px solid #e9e9e6',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #dedfdd',
            background: '#fff',
            color: '#22395e',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <ImagePlus size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="输入问题..."
          style={{
            flex: 1,
            border: '1px solid #dedfdd',
            borderRadius: 20,
            padding: '10px 14px',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#22395e',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            opacity: loading ? 0.6 : 1,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Send size={18} />
        </button>
      </div>
      <BottomNav
        active="manage"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
        fixed={false}
      />
    </div>
  )
}
