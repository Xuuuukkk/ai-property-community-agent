<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative' }}>
  <div style={{ position: 'absolute', left: 64, top: 52, right: 64 }}>
    <div style={{ color: '#BD9B56', fontSize: 16, letterSpacing: '0.3em', marginBottom: 8 }}>02 · 技术构建路线</div>
    <h2 style={{ fontSize: 36, fontWeight: 'bold', color: '#172133', margin: 0 }}>从数据库到上线：7 个阶段的完整构建</h2>
    <p style={{ fontSize: 14, color: '#5F5E5A', marginTop: 6 }}>每个阶段都有代码 + 测试 + 可运行交付，一步步验证</p>
  </div>
  <div style={{ position: 'absolute', left: 64, top: 150, width: 560, height: 490, background: '#fff', borderRadius: 12, padding: '20px 26px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
    <svg width="508" height="450" viewBox="0 0 508 450">
      <g fontFamily="Inter, sans-serif">
        <line x1="70" y1="40" x2="70" y2="410" stroke="#22395E" strokeWidth="2" />
        {[
          ['P0', '项目初始化', 'Repo · Docker · CI'],
          ['P1', '数据库与数据层', '8 表 + 仿真社区'],
          ['P2', '后端服务', 'FastAPI + Repository'],
          ['P3', '前端', '三端页面'],
          ['P4', 'AI Agent', '多意图 + 工具'],
          ['P5', 'RAG 知识系统', 'pgvector 检索'],
          ['P6', '评估', 'Intent/Tool/RAG'],
          ['P7', '部署上线', 'Docker + PWA'],
        ].map(([p, t, d], i) => (
          <g key={p}>
            <circle cx="70" cy={40 + i * 50} r="7" fill="#BD9B56" />
            <text x="20" y={45 + i * 50} fontSize="12" fontWeight="bold" fill="#BD9B56">{p}</text>
            <text x="110" y={42 + i * 50} fontSize="14" fontWeight="bold" fill="#172133">{t}</text>
            <text x="110" y={58 + i * 50} fontSize="11" fill="#5F5E5A">{d}</text>
          </g>
        ))}
      </g>
    </svg>
  </div>
  <div style={{ position: 'absolute', right: 64, top: 150, width: 540, height: 490, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.15em', marginBottom: 4 }}>每一阶段的关键难点</div>
    <div style={{ background: '#fff', borderLeft: '3px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '12px 18px', boxShadow: '0 3px 12px rgba(23,33,51,0.05)' }}>
      <span style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginRight: 8 }}>P1</span>
      <span style={{ fontSize: 13, color: '#172133', lineHeight: 1.5 }}>设计 8+ 张关联表 + 1664 套房源的仿真数据，保证数据一致性与真实感</span>
    </div>
    <div style={{ background: '#fff', borderLeft: '3px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '12px 18px', boxShadow: '0 3px 12px rgba(23,33,51,0.05)' }}>
      <span style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginRight: 8 }}>P2</span>
      <span style={{ fontSize: 13, color: '#172133', lineHeight: 1.5 }}>Repository 模式解耦业务与数据，54 个测试打底，为 Agent 提供稳定工具</span>
    </div>
    <div style={{ background: '#fff', borderLeft: '3px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '12px 18px', boxShadow: '0 3px 12px rgba(23,33,51,0.05)' }}>
      <span style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginRight: 8 }}>P4</span>
      <span style={{ fontSize: 13, color: '#172133', lineHeight: 1.5 }}>报修多轮状态机：业主只说「厨房漏水」，Agent 主动反问位置/类型再补全工单</span>
    </div>
    <div style={{ background: '#fff', borderLeft: '3px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '12px 18px', boxShadow: '0 3px 12px rgba(23,33,51,0.05)' }}>
      <span style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginRight: 8 }}>P5</span>
      <span style={{ fontSize: 13, color: '#172133', lineHeight: 1.5 }}>知识切片 + 1024 维向量化，让「装修几点施工」这类隐性知识可被精确检索</span>
    </div>
    <div style={{ background: '#fff', borderLeft: '3px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '12px 18px', boxShadow: '0 3px 12px rgba(23,33,51,0.05)' }}>
      <span style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginRight: 8 }}>P6</span>
      <span style={{ fontSize: 13, color: '#172133', lineHeight: 1.5 }}>评估驱动优化：意图 83%→100%、RAG 答案 50%→100%，用数据找到并修好缺陷</span>
    </div>
    <div style={{ background: '#fff', borderLeft: '3px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '12px 18px', boxShadow: '0 3px 12px rgba(23,33,51,0.05)' }}>
      <span style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginRight: 8 }}>P7</span>
      <span style={{ fontSize: 13, color: '#172133', lineHeight: 1.5 }}>国内服务器镜像源/网络/SECRET_KEY 等部署坑逐一踩平，最终 CI 全绿上线</span>
    </div>
  </div>
  <div style={{ position: 'absolute', left: 64, bottom: 24, color: '#BD9B56', fontSize: 14, letterSpacing: '0.12em' }}>云溪花园 · 智慧社区</div>
  <div style={{ position: 'absolute', right: 24, bottom: 24, color: 'rgba(189,155,86,0.75)', fontSize: 14 }}>08 / 17</div>
</Slide>
