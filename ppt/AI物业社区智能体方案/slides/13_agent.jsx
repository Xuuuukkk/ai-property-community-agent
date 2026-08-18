<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative' }}>
  <div style={{ position: 'absolute', left: 64, top: 52, right: 64 }}>
    <div style={{ color: '#BD9B56', fontSize: 16, letterSpacing: '0.3em', marginBottom: 8 }}>03 · AI 能力</div>
    <h2 style={{ fontSize: 36, fontWeight: 'bold', color: '#172133', margin: 0 }}>AI Agent：LangGraph 多意图编排</h2>
  </div>
  <div style={{ position: 'absolute', left: 64, top: 150, width: 700, background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
    <svg width="644" height="430" viewBox="0 0 644 430">
      <defs>
        <marker id="ar4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#BD9B56" />
        </marker>
      </defs>
      <g fontFamily="Inter, sans-serif">
        <rect x="222" y="16" width="200" height="54" rx="8" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="322" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">用户自然语言输入</text>
        <text x="322" y="58" textAnchor="middle" fontSize="11" fill="#5F5E5A">「我家厨房漏水了」</text>
        <line x1="322" y1="70" x2="322" y2="92" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar4)" />
        <rect x="162" y="96" width="320" height="70" rx="8" fill="rgba(34,57,94,0.12)" stroke="#22395E" strokeWidth="2" />
        <text x="322" y="122" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">意图分类（Router Agent）</text>
        <text x="322" y="146" textAnchor="middle" fontSize="12" fill="#172133" fontWeight="bold">报修 / 费用 / 公告 / 知识 / 上报</text>
        <text x="322" y="162" textAnchor="middle" fontSize="11" fill="#5F5E5A">准确率 100%</text>
        <line x1="322" y1="166" x2="322" y2="188" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar4)" />
        <rect x="162" y="192" width="320" height="70" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="322" y="218" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">领域 Agent + 多轮状态机</text>
        <text x="322" y="240" textAnchor="middle" fontSize="11" fill="#5F5E5A">报修缺「位置/类型」→ 主动反问补全</text>
        <line x1="322" y1="262" x2="322" y2="284" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar4)" />
        <rect x="30" y="288" width="190" height="58" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="125" y="314" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">create_repair_order</text>
        <text x="125" y="332" textAnchor="middle" fontSize="10" fill="#5F5E5A">创建工单</text>
        <rect x="240" y="288" width="190" height="58" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="335" y="314" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">query_fee</text>
        <text x="335" y="332" textAnchor="middle" fontSize="10" fill="#5F5E5A">查询费用</text>
        <rect x="450" y="288" width="190" height="58" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="545" y="314" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">search_knowledge</text>
        <text x="545" y="332" textAnchor="middle" fontSize="10" fill="#5F5E5A">检索知识</text>
        <line x1="322" y1="288" x2="322" y2="346" stroke="#22395E" strokeWidth="1.2" />
        <line x1="322" y1="346" x2="125" y2="346" stroke="#22395E" strokeWidth="1.2" />
        <line x1="322" y1="346" x2="335" y2="346" stroke="#22395E" strokeWidth="1.2" />
        <line x1="322" y1="346" x2="545" y2="346" stroke="#22395E" strokeWidth="1.2" />
        <line x1="125" y1="346" x2="125" y2="370" stroke="#22395E" strokeWidth="1.2" />
        <line x1="335" y1="346" x2="335" y2="370" stroke="#22395E" strokeWidth="1.2" />
        <line x1="545" y1="346" x2="545" y2="370" stroke="#22395E" strokeWidth="1.2" />
        <rect x="30" y="374" width="610" height="44" rx="6" fill="#172133" />
        <text x="335" y="401" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#BD9B56">业务 API 层 · 工具执行 · Trace 全程记录可评估</text>
      </g>
    </svg>
  </div>
  <div style={{ position: 'absolute', right: 64, top: 150, width: 400, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>多轮补全</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>报修是「状态机」不是「单轮问答」——Agent 记得上下文，主动追问缺失字段。</p>
    </div>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>可观测</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>每次对话的意图、工具、Trace 全记录，支撑评估与迭代。</p>
    </div>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>5 类意图</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>报修、费用、公告、知识咨询、问题上报——自然语言直达对应业务工具。</p>
    </div>
    <div style={{ marginTop: 4, padding: '14px 18px', background: 'rgba(189,155,86,0.12)', borderRadius: 8, borderLeft: '3px solid #BD9B56' }}>
      <p style={{ fontSize: 13, color: '#172133', margin: 0, lineHeight: 1.6 }}>智谱 GLM-4-Flash 驱动，<span style={{ color: '#BD9B56', fontWeight: 'bold' }}>LangGraph</span> 编排状态流转。</p>
    </div>
  </div>
  <div style={{ position: 'absolute', left: 64, bottom: 24, color: '#BD9B56', fontSize: 14, letterSpacing: '0.12em' }}>云溪花园 · 智慧社区</div>
  <div style={{ position: 'absolute', right: 24, bottom: 24, color: 'rgba(189,155,86,0.75)', fontSize: 14 }}>13 / 17</div>
</Slide>
