<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '34px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>04 · 总结与展望</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>技术路线回顾：七个阶段 · 从 0 到上线</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 6 }}>每个阶段都有代码、测试、可运行交付，循序渐进验证</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '100%', background: '#fff', borderRadius: 12, padding: '28px 30px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
      <svg width="1090" height="330" viewBox="0 0 1090 330">
        <g fontFamily="Inter, sans-serif">
          <line x1="55" y1="50" x2="1045" y2="50" stroke="#22395E" strokeWidth="2.5" />
          {[
            ['P0', '项目初始化', '仓库 · Docker · CI'],
            ['P1', '数据库', '15+ 表 + 仿真数据'],
            ['P2', '后端', 'FastAPI 分层'],
            ['P3', '前端', '三端 + PWA'],
            ['P4', 'AI Agent', '多意图 + 状态机'],
            ['P5', 'RAG', '向量化检索'],
            ['P6', '评估', 'Intent/Tool/RAG'],
            ['P7', '部署', '已上线'],
          ].map(([p, t, d], i) => (
            <g key={p}>
              <circle cx={55 + i * 140} cy={50} r="10" fill="#BD9B56" />
              <text x={55 + i * 140} y={22} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">{p}</text>
              <rect x={55 + i * 140 - 58} y={80} width="116" height="56" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
              <text x={55 + i * 140} y={112} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">{t}</text>
              <text x={55 + i * 140} y={150} textAnchor="middle" fontSize="11" fill="#5F5E5A">{d}</text>
            </g>
          ))}
          <text x="55" y="220" fontSize="12" fill="#5F5E5A">交付：可运行骨架</text>
          <text x="195" y="220" fontSize="12" fill="#5F5E5A">交付：数据就绪</text>
          <text x="335" y="220" fontSize="12" fill="#5F5E5A">交付：API 可调用</text>
          <text x="475" y="220" fontSize="12" fill="#5F5E5A">交付：三端成型</text>
          <text x="615" y="220" fontSize="12" fill="#5F5E5A">交付：自然语言办事</text>
          <text x="755" y="220" fontSize="12" fill="#5F5E5A">交付：知识问答</text>
          <text x="895" y="220" fontSize="12" fill="#5F5E5A">交付：评估报告</text>
          <text x="1035" y="220" fontSize="12" fill="#5F5E5A">交付：线上运行</text>
        </g>
      </svg>
      <div style={{ marginTop: 14, display: 'flex', gap: 14 }}>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P1 数据一致性</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>1664 套房源 + 746 账单，外键关联保证数据一致，8 个 SQL 可复现</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P4 多轮状态机</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>报修主动追问缺省字段，避免生成残缺工单</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P6 评估找 bug</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>意图 83%→100%、答案 50%→100%，数据驱动优化</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P7 部署踩坑</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>国内镜像源、SECRET_KEY、端口映射逐一踩平</p>
        </div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>13 / 15</span>
  </div>
</Slide>
