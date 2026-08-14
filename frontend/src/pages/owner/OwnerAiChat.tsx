import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import AppHeader from '../../components/AppHeader'
import BottomNav from '../../components/BottomNav'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function OwnerAiChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '您好，我是云溪花园社区助手，请问有什么可以帮您？' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.chatAgent({ message: text, user_id: user?.id ?? null })
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
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', fontSize: 12, color: '#7e8587' }}>助手思考中...</div>
        )}
      </div>
      <div
        style={{
          padding: '10px 14px 24px',
          background: '#fff',
          borderTop: '1px solid #e9e9e6',
          display: 'flex',
          gap: 10,
        }}
      >
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
          }}
        >
          <Send size={18} />
        </button>
      </div>
      <BottomNav
        active="manage"
        labels={['首页', '服务', 'AI助手', '我的']}
        paths={['/owner', '/owner/services', '/owner/ai', '/owner/profile']}
      />
    </div>
  )
}
