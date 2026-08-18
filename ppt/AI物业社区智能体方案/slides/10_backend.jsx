<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative' }}>
  <div style={{ position: 'absolute', left: 64, top: 52, right: 64 }}>
    <div style={{ color: '#BD9B56', fontSize: 16, letterSpacing: '0.3em', marginBottom: 8 }}>02 · 技术构建路线</div>
    <h2 style={{ fontSize: 36, fontWeight: 'bold', color: '#172133', margin: 0 }}>后端：FastAPI 分层 + Repository 模式</h2>
  </div>
  <div style={{ position: 'absolute', left: 64, top: 150, width: 680, background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
    <svg width="624" height="420" viewBox="0 0 624 420">
      <defs>
        <marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#22395E" />
        </marker>
      </defs>
      <g fontFamily="Inter, sans-serif">
        <rect x="40" y="20" width="544" height="52" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
        <text x="312" y="51" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">API 路由层（api/routes）· 三端 REST 接口</text>
        <line x1="312" y1="72" x2="312" y2="96" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar3)" />
        <rect x="40" y="100" width="544" height="68" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="2" />
        <text x="72" y="128" fontSize="13" fontWeight="bold" fill="#BD9B56">Service 业务层</text>
        <text x="312" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">工单 · 费用 · 巡检 · 通知 · 派单 · 反馈</text>
        <line x1="312" y1="168" x2="312" y2="192" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar3)" />
        <rect x="40" y="196" width="544" height="62" rx="6" fill="rgba(189,155,86,0.08)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="72" y="222" fontSize="13" fontWeight="bold" fill="#BD9B56">Repository 数据层</text>
        <text x="312" y="244" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">SQLAlchemy 2.0 ORM · 业务与数据解耦</text>
        <line x1="312" y1="258" x2="312" y2="282" stroke="#22395E" strokeWidth="1.2" markerEnd="url(#ar3)" />
        <rect x="40" y="286" width="260" height="60" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
        <text x="170" y="312" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">PostgreSQL + pgvector</text>
        <text x="170" y="330" textAnchor="middle" fontSize="11" fill="#5F5E5A">事务 + 向量一库双角色</text>
        <rect x="324" y="286" width="260" height="60" rx="6" fill="#F5F8F8" stroke="#22395E" strokeWidth="1.5" />
        <text x="454" y="312" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">Redis + JWT + 调度器</text>
        <text x="454" y="330" textAnchor="middle" fontSize="11" fill="#5F5E5A">缓存 · 鉴权 · 定时清理</text>
      </g>
    </svg>
  </div>
  <div style={{ position: 'absolute', right: 64, top: 150, width: 430, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>分层价值</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>AI 逻辑不混进业务代码——Agent 调「稳定的业务工具」，改业务不动 Agent。</p>
    </div>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>派单算法</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>技能 + 在岗状态 + 工号升序，自动匹配维修师傅，无需人工指派。</p>
    </div>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>消息通知</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>派单 / 完成 / 答复 / 巡检异常，全链路实时通知相关角色。</p>
    </div>
    <div style={{ marginTop: 4, padding: '14px 18px', background: 'rgba(189,155,86,0.12)', borderRadius: 8, borderLeft: '3px solid #BD9B56' }}>
      <p style={{ fontSize: 13, color: '#172133', margin: 0, lineHeight: 1.6 }}><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>54 → 113</span> 个后端测试，为每一层打底。</p>
    </div>
  </div>
  <div style={{ position: 'absolute', left: 64, bottom: 24, color: '#BD9B56', fontSize: 14, letterSpacing: '0.12em' }}>云溪花园 · 智慧社区</div>
  <div style={{ position: 'absolute', right: 24, bottom: 24, color: 'rgba(189,155,86,0.75)', fontSize: 14 }}>10 / 17</div>
</Slide>
