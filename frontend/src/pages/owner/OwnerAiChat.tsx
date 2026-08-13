import { useEffect, useMemo, useRef, useState, type FormEvent, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, type AgentChatResponse } from '../../api/client'
import {
  AiIcon,
  ArrowLeftIcon,
  ChatIcon,
  HomeIcon,
  NoticeIcon,
  ProfileIcon,
  RepairIcon,
  SendIcon,
} from '../../components/owner/icons'
import './OwnerAiChat.css'

type TabKey = 'home' | 'ai' | 'repair' | 'notice' | 'profile'
type MessageRole = 'assistant' | 'user'

interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  intent?: string
  requiresHuman?: boolean
}

const OWNER_USER_ID = 1

const QUICK_PROMPTS = [
  '我家厨房漏水，想报修',
  '帮我查一下物业费',
  '最近有什么通知',
  '装修可以施工到几点？',
]

const BOTTOM_TABS: { key: TabKey; label: string; icon: ({ className }: { className?: string }) => JSX.Element }[] = [
  { key: 'home', label: '首页', icon: HomeIcon },
  { key: 'ai', label: 'AI', icon: ChatIcon },
  { key: 'repair', label: '报修', icon: RepairIcon },
  { key: 'notice', label: '公告', icon: NoticeIcon },
  { key: 'profile', label: '我的', icon: ProfileIcon },
]

const intentLabels: Record<string, string> = {
  repair: '报修',
  fee: '查费',
  notice_query: '公告查询',
  notice_publish: '公告发布',
  knowledge: '知识问答',
  unknown: '待确认',
}

function createMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatIntentLabel(intent?: string) {
  if (!intent) return ''
  return intentLabels[intent] || intent
}

export default function OwnerAiChat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好，我是云溪花园 AI 社区助手。报修、查费、公告和社区规则，都可以直接问我。',
      intent: 'knowledge',
    },
  ])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const threadEndRef = useRef<HTMLDivElement | null>(null)

  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date()),
    [],
  )

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isSending])

  const handleTabClick = (key: TabKey) => {
    if (key === 'home') {
      navigate('/owner')
      return
    }
    navigate(`/owner/${key}`)
  }

  const appendAssistantResponse = (result: AgentChatResponse) => {
    setConversationId(result.conversation_id)
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: 'assistant',
        content: result.response || '我已经收到请求，但暂时没有生成可展示的回复。',
        intent: result.intent,
        requiresHuman: result.requires_human,
      },
    ])
  }

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim()
    if (!message || isSending) return

    setError(null)
    setInput('')
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: 'user',
        content: message,
      },
    ])
    setIsSending(true)

    try {
      const result = await api.chatAgent({
        message,
        user_id: OWNER_USER_ID,
        conversation_id: conversationId,
      })
      appendAssistantResponse(result)
    } catch (err) {
      const messageText = err instanceof Error ? err.message : '请求失败，请稍后再试'
      setError(messageText)
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'assistant',
          content: '连接 AI 助手时遇到问题，请稍后重试。',
          intent: 'unknown',
          requiresHuman: true,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(input)
  }

  return (
    <div className="owner-chat-page">
      <aside className="owner-chat-sidebar">
        <div className="owner-chat-sidebar-brand">
          <div className="owner-chat-sidebar-tag">YUNXI GARDEN</div>
          <div className="owner-chat-sidebar-name">云溪花园</div>
          <p>智慧社区 · 美好生活</p>
        </div>

        <nav className="owner-chat-side-nav" aria-label="业主端导航">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                className={`owner-chat-side-nav-item ${tab.key === 'ai' ? 'active' : ''}`}
                type="button"
                onClick={() => handleTabClick(tab.key)}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="owner-chat-sidebar-user">
          <div className="owner-chat-avatar">张</div>
          <div>
            <strong>张先生</strong>
            <span>3栋2单元 1201</span>
          </div>
        </div>
      </aside>

      <main className="owner-chat-main">
        <header className="owner-chat-header">
          <button
            className="owner-chat-icon-button"
            type="button"
            aria-label="返回首页"
            onClick={() => navigate('/owner')}
          >
            <ArrowLeftIcon />
          </button>
          <div className="owner-chat-title">
            <span>{currentDate}</span>
            <h1>AI 社区助手</h1>
          </div>
          <div className="owner-chat-status">
            <span />
            在线
          </div>
        </header>

        <section className="owner-chat-shell" aria-label="AI 助手聊天">
          <div className="owner-chat-intro">
            <span className="owner-chat-intro-icon">
              <AiIcon />
            </span>
            <div>
              <h2>一句话处理社区事务</h2>
              <p>我会根据你的描述自动识别报修、查费、公告和知识咨询。</p>
            </div>
          </div>

          <div className="owner-chat-prompts" aria-label="快捷问题">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className="owner-chat-prompt"
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={isSending}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="owner-chat-thread">
            {messages.map((message) => (
              <article key={message.id} className={`owner-chat-message ${message.role}`}>
                <div className="owner-chat-message-avatar">
                  {message.role === 'assistant' ? <AiIcon /> : '张'}
                </div>
                <div className="owner-chat-bubble">
                  <p>{message.content}</p>
                  {message.role === 'assistant' && (message.intent || message.requiresHuman) && (
                    <div className="owner-chat-meta">
                      {message.intent && <span>{formatIntentLabel(message.intent)}</span>}
                      {message.requiresHuman && <span>需要人工跟进</span>}
                    </div>
                  )}
                </div>
              </article>
            ))}

            {isSending && (
              <article className="owner-chat-message assistant">
                <div className="owner-chat-message-avatar">
                  <AiIcon />
                </div>
                <div className="owner-chat-bubble owner-chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            )}
            <div ref={threadEndRef} />
          </div>

          {error && <div className="owner-chat-error">{error}</div>}

          <form className="owner-chat-composer" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="描述你的问题或需求"
              aria-label="聊天内容"
              disabled={isSending}
            />
            <button
              className="owner-chat-send"
              type="submit"
              aria-label="发送"
              disabled={!input.trim() || isSending}
            >
              <SendIcon />
            </button>
          </form>
        </section>
      </main>

      <nav className="owner-chat-bottom-tab" aria-label="底部导航">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              className={`owner-chat-tab-item ${tab.key === 'ai' ? 'active' : ''}`}
              type="button"
              onClick={() => handleTabClick(tab.key)}
            >
              <span className="owner-chat-tab-icon">
                <Icon />
              </span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
