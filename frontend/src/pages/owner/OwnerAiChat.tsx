import { useEffect, useRef, useState } from 'react'
import { Send, ImagePlus, X, ThumbsUp, ThumbsDown } from 'lucide-react'
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

interface PendingIssue {
  step?: string
  zone?: string
  location?: string
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
  const [pendingIssue, setPendingIssue] = useState<PendingIssue | null>(null)
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})
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
        pending_issue: pendingIssue as Record<string, unknown> | null,
      })
      setConversationId(res.conversation_id)
      setPendingRepair(res.pending_repair as PendingRepair | null)
      setPendingIssue(res.pending_issue as PendingIssue | null)
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

  const sendText = async (text: string) => {
    if (!text || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await api.chatAgent({
        message: text,
        user_id: user?.id ?? null,
        conversation_id: conversationId,
        pending_repair: pendingRepair as Record<string, unknown> | null,
        pending_issue: pendingIssue as Record<string, unknown> | null,
      })
      setConversationId(res.conversation_id)
      setPendingRepair(res.pending_repair as PendingRepair | null)
      setPendingIssue(res.pending_issue as PendingIssue | null)
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'r', role: 'assistant', content: res.response },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'r', role: 'assistant', content: '抱歉，服务暂时不可用，请稍后再试。' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { label: '房屋报修', text: '我要报修，家里设施有问题需要维修' },
    { label: '费用查询', text: '我想查询我的物业费账单' },
    { label: '问题上报', text: '我要上报小区里的问题（电梯/垃圾/违停等）' },
    { label: '公告咨询', text: '我想了解社区公告，或咨询小区停车/装修/垃圾分类等问题' },
  ]

  const rate = async (msgId: string, rating: 'up' | 'down', question: string, answer: string) => {
    setFeedback((prev) => ({ ...prev, [msgId]: rating }))
    try {
      await api.submitFeedback({ question, answer, rating, correction: null })
    } catch {
      // 反馈失败不打断用户
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
        {messages.map((m, idx) => {
          const prevUser = [...messages.slice(0, idx)].reverse().find((x) => x.role === 'user')
          const question = prevUser?.content ?? ''
          const isRated = feedback[m.id] != null
          return (
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
                  {m.images.map((img, i2) => (
                    <img
                      key={i2}
                      src={img}
                      alt="上传图片"
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </div>
              )}
              {m.role === 'assistant' && m.id !== '0' && !loading && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}>
                  <button
                    onClick={() => rate(m.id, 'up', question, m.content)}
                    disabled={isRated}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px',
                      borderRadius: 12, border: '1px solid #d6d8d6', background: feedback[m.id] === 'up' ? '#e1f5ee' : '#fff',
                      color: feedback[m.id] === 'up' ? '#0f6e56' : '#8b9194', fontSize: 11, cursor: 'pointer',
                    }}
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <button
                    onClick={() => rate(m.id, 'down', question, m.content)}
                    disabled={isRated}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px',
                      borderRadius: 12, border: '1px solid #d6d8d6', background: feedback[m.id] === 'down' ? '#fee2e2' : '#fff',
                      color: feedback[m.id] === 'down' ? '#a32d2d' : '#8b9194', fontSize: 11, cursor: 'pointer',
                    }}
                  >
                    <ThumbsDown size={13} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
        {messages.length === 1 && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: '90%' }}>
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => sendText(qa.text)}
                disabled={loading}
                style={{
                  padding: '8px 14px',
                  borderRadius: 18,
                  border: '1px solid #c9d3e0',
                  background: '#f5f7fa',
                  color: '#22395e',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {qa.label}
              </button>
            ))}
          </div>
        )}
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
