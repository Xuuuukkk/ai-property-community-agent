<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '40px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 8 }}>02 · 技术构建过程</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>AI Agent 架构：LangGraph 多智能体协作</h2>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 32 }}>
    <div style={{ flex: '0 0 560px', background: '#fff', borderRadius: 12, padding: '22px 24px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
      <svg width="512" height="470" viewBox="0 0 512 470">
        <defs>
          <marker id="ar9" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="#BD9B56" />
          </marker>
        </defs>
        <g fontFamily="Inter, sans-serif">
          <rect x="156" y="14" width="200" height="50" rx="8" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="256" y="36" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">用户自然语言输入</text>
          <text x="256" y="54" textAnchor="middle" fontSize="11" fill="#5F5E5A">「我家厨房漏水了」</text>
          <line x1="256" y1="64" x2="256" y2="84" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar9)" />
          <rect x="96" y="88" width="320" height="64" rx="8" fill="rgba(34,57,94,0.12)" stroke="#22395E" strokeWidth="2" />
          <text x="256" y="114" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">Router Agent · 意图分类</text>
          <text x="256" y="136" textAnchor="middle" fontSize="11" fill="#172133">报修 / 费用 / 公告 / 知识 / 上报</text>
          <line x1="256" y1="152" x2="256" y2="172" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar9)" />
          <rect x="96" y="176" width="320" height="64" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
          <text x="256" y="202" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">领域 Agent + 多轮状态机</text>
          <text x="256" y="224" textAnchor="middle" fontSize="11" fill="#5F5E5A">报修缺「位置/类型」→ 主动反问补全</text>
          <line x1="256" y1="240" x2="256" y2="260" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar9)" />
          <rect x="16" y="264" width="140" height="48" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
          <text x="86" y="284" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">create_repair</text>
          <text x="86" y="302" textAnchor="middle" fontSize="10" fill="#5F5E5A">创建工单</text>
          <rect x="176" y="264" width="140" height="48" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
          <text x="246" y="284" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">query_fee</text>
          <text x="246" y="302" textAnchor="middle" fontSize="10" fill="#5F5E5A">查询费用</text>
          <rect x="336" y="264" width="160" height="48" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
          <text x="416" y="284" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">search_knowledge</text>
          <text x="416" y="302" textAnchor="middle" fontSize="10" fill="#5F5E5A">检索知识</text>
          <line x1="256" y1="260" x2="256" y2="288" stroke="#22395E" strokeWidth="1.2" />
          <line x1="256" y1="288" x2="86" y2="288" stroke="#22395E" strokeWidth="1.2" />
          <line x1="256" y1="288" x2="246" y2="288" stroke="#22395E" strokeWidth="1.2" />
          <line x1="256" y1="288" x2="416" y2="288" stroke="#22395E" strokeWidth="1.2" />
          <line x1="86" y1="312" x2="86" y2="332" stroke="#22395E" strokeWidth="1.2" />
          <line x1="246" y1="312" x2="246" y2="332" stroke="#22395E" strokeWidth="1.2" />
          <line x1="416" y1="312" x2="416" y2="332" stroke="#22395E" strokeWidth="1.2" />
          <rect x="16" y="336" width="480" height="42" rx="6" fill="#172133" />
          <text x="256" y="362" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#BD9B56">业务 API 层 · 工具执行 · Trace 全程记录可评估</text>
          <text x="256" y="410" textAnchor="middle" fontSize="12" fill="#5F5E5A">驱动模型：智谱 GLM-4-Flash · 编排框架：LangGraph</text>
        </g>
      </svg>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 6 }}>1.  多轮状态机</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.65 }}>报修不是单轮问答——业主只说「厨房漏水」时，Agent 会主动追问房屋位置、故障类型，把信息补全后才创建工单，避免生成残缺工单。</p>
      </div>
      <div>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 6 }}>2.  五类意图</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.65 }}>报修、费用、公告、知识咨询、问题上报，自然语言直达对应业务工具，实测意图识别准确率 100%。</p>
      </div>
      <div>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 6 }}>3.  可观测可评估</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.65 }}>每次对话的意图、工具、结果全程记录 Trace，可回放、可评估，是量化评估体系的数据基础。</p>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>11 / 19</span>
  </div>
</Slide>
