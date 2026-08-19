<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '40px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 8 }}>02 · 技术构建过程</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>技术架构：六层分离的 AI Native 系统</h2>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 32 }}>
    <div style={{ flex: '0 0 620px', background: '#fff', borderRadius: 12, padding: '22px 24px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
      <svg width="572" height="470" viewBox="0 0 572 470">
        <defs>
          <marker id="ar6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="#22395E" />
          </marker>
        </defs>
        <g fontFamily="Inter, sans-serif">
          <rect x="36" y="18" width="500" height="52" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
          <text x="286" y="49" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">客户端 · 业主 / 物业 / 维修 三端</text>
          <line x1="286" y1="70" x2="286" y2="92" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar6)" />
          <rect x="36" y="96" width="500" height="48" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
          <text x="286" y="125" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">API 网关 · FastAPI</text>
          <line x1="286" y1="144" x2="286" y2="166" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar6)" />
          <rect x="36" y="170" width="500" height="70" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="2" />
          <text x="64" y="196" fontSize="13" fontWeight="bold" fill="#BD9B56">AI Agent 层</text>
          <text x="286" y="218" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">Router Agent + 领域 Agent + 工具调用</text>
          <line x1="286" y1="240" x2="286" y2="262" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar6)" />
          <rect x="36" y="266" width="500" height="56" rx="6" fill="rgba(189,155,86,0.08)" stroke="#BD9B56" strokeWidth="1.5" />
          <text x="64" y="290" fontSize="13" fontWeight="bold" fill="#BD9B56">业务服务层</text>
          <text x="286" y="312" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">工单 · 费用 · 巡检 · 通知 · 反馈 · 知识库</text>
          <line x1="286" y1="322" x2="286" y2="344" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar6)" />
          <rect x="36" y="348" width="240" height="60" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
          <text x="156" y="374" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">PostgreSQL + pgvector</text>
          <text x="156" y="394" textAnchor="middle" fontSize="11" fill="#5F5E5A">事务数据 + 向量检索</text>
          <rect x="296" y="348" width="240" height="60" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
          <text x="416" y="374" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">Redis + 智谱 GLM</text>
          <text x="416" y="394" textAnchor="middle" fontSize="11" fill="#5F5E5A">缓存 · LLM · embedding</text>
        </g>
      </svg>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 6 }}>1.  Agent 与业务解耦</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.65 }}>AI Agent 只负责理解意图、编排工具，不直接操作数据库，严守 Agent → Tool → Service → Repository → Database 分层，杜绝 LLM 直连 SQL 的风险。</p>
      </div>
      <div>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 6 }}>2.  pgvector 一库双角色</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.65 }}>PostgreSQL 同时承载业务数据（工单、费用）和向量数据（知识切片），无需额外向量数据库，降低部署与运维复杂度。</p>
      </div>
      <div>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 6 }}>3.  可观测可评估</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.65 }}>每次 AI 对话的意图、工具调用、结果全程记录，可回放、可追踪，支撑后续的量化评估与持续迭代。</p>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>8 / 19</span>
  </div>
</Slide>
