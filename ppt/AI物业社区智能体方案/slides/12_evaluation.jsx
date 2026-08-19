<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '40px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 8 }}>03 · 成果与验证</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>量化评估：核心链路指标 100%</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 8 }}>建立可量化的评估体系，用数据找到 bug、用数据证明修复</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '100%', display: 'flex', gap: 18 }}>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '24px 16px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.08)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 12 }}>INTENT</div>
        <div style={{ fontSize: 60, fontWeight: 'bold', color: '#172133', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>100%</div>
        <div style={{ fontSize: 14, color: '#5F5E5A', marginTop: 12, lineHeight: 1.5 }}>意图识别准确率</div>
        <div style={{ marginTop: 12, padding: '8px 0', borderTop: '1px solid rgba(34,57,94,0.1)' }}>
          <span style={{ fontSize: 12, color: '#888780' }}>83.33% → 100% · 修复 3 处规则盲区</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '24px 16px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.08)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 12 }}>RAG RECALL</div>
        <div style={{ fontSize: 60, fontWeight: 'bold', color: '#172133', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>100%</div>
        <div style={{ fontSize: 14, color: '#5F5E5A', marginTop: 12, lineHeight: 1.5 }}>检索召回率 Recall@5</div>
        <div style={{ marginTop: 12, padding: '8px 0', borderTop: '1px solid rgba(34,57,94,0.1)' }}>
          <span style={{ fontSize: 12, color: '#888780' }}>知识切片检索质量稳定达标</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '24px 16px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.08)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 12 }}>RAG ANSWER</div>
        <div style={{ fontSize: 60, fontWeight: 'bold', color: '#172133', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>100%</div>
        <div style={{ fontSize: 14, color: '#5F5E5A', marginTop: 12, lineHeight: 1.5 }}>答案准确率</div>
        <div style={{ marginTop: 12, padding: '8px 0', borderTop: '1px solid rgba(34,57,94,0.1)' }}>
          <span style={{ fontSize: 12, color: '#888780' }}>50% → 100% · 答案生成优化</span>
        </div>
      </div>
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '24px 16px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.18)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 12 }}>TESTS · CI GREEN</div>
        <div style={{ fontSize: 44, fontWeight: 'bold', color: '#FBFCFA', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>113 + 30</div>
        <div style={{ fontSize: 14, color: 'rgba(251,252,250,0.85)', marginTop: 12, lineHeight: 1.5 }}>后端 + 前端测试全绿</div>
        <div style={{ marginTop: 12, padding: '8px 0', borderTop: '1px solid rgba(189,155,86,0.3)' }}>
          <span style={{ fontSize: 12, color: '#BD9B56' }}>GitHub Actions 每次 push 自动跑</span>
        </div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, background: 'rgba(189,155,86,0.10)', borderLeft: '4px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '14px 22px' }}>
    <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>评估驱动优化：</span>RAG 答案从 50% → 100%，源于发现「评估指标用脆弱子串匹配」并改为「关键词覆盖度」、同时优化答案生成 prompt——用数据找到 bug，用数据证明修复。工具选择 / 参数提取 / 工作流三项指标受「报修多轮交互」设计影响（用例按单轮设计，实际走 pending_repair 多轮），已定位为评估框架升级项，而非 Agent 缺陷。</p>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>12 / 15</span>
  </div>
</Slide>
