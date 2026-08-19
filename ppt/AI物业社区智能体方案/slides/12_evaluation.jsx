<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '40px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 8 }}>03 · 成果与验证</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>量化评估：用数据证明质量</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 8 }}>建立可量化的评估体系，用数据找到 bug、用数据证明修复</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '100%', display: 'flex', gap: 20 }}>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '28px 20px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.08)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 14 }}>INTENT</div>
        <div style={{ fontSize: 64, fontWeight: 'bold', color: '#172133', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>100%</div>
        <div style={{ fontSize: 14, color: '#5F5E5A', marginTop: 14, lineHeight: 1.5 }}>意图识别准确率</div>
        <div style={{ marginTop: 14, padding: '8px 0', borderTop: '1px solid rgba(34,57,94,0.1)' }}>
          <span style={{ fontSize: 12, color: '#888780' }}>从 83% 提升 · 修复 3 处规则盲区</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '28px 20px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.08)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 14 }}>RAG ANSWER</div>
        <div style={{ fontSize: 64, fontWeight: 'bold', color: '#172133', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>100%</div>
        <div style={{ fontSize: 14, color: '#5F5E5A', marginTop: 14, lineHeight: 1.5 }}>RAG 答案准确率</div>
        <div style={{ marginTop: 14, padding: '8px 0', borderTop: '1px solid rgba(34,57,94,0.1)' }}>
          <span style={{ fontSize: 12, color: '#888780' }}>从 50% 提升 · 修复评估指标本身</span>
        </div>
      </div>
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '28px 20px', textAlign: 'center', boxShadow: '0 6px 24px rgba(23,33,51,0.18)', borderTop: '4px solid #BD9B56' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', letterSpacing: '0.2em', marginBottom: 14 }}>TESTS · CI GREEN</div>
        <div style={{ fontSize: 48, fontWeight: 'bold', color: '#FBFCFA', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>113 + 30</div>
        <div style={{ fontSize: 14, color: 'rgba(251,252,250,0.85)', marginTop: 14, lineHeight: 1.5 }}>后端 + 前端测试全绿</div>
        <div style={{ marginTop: 14, padding: '8px 0', borderTop: '1px solid rgba(189,155,86,0.3)' }}>
          <span style={{ fontSize: 12, color: '#BD9B56' }}>GitHub Actions 每次 push 自动跑</span>
        </div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, background: 'rgba(189,155,86,0.10)', borderLeft: '4px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '14px 22px' }}>
    <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>评估驱动优化：</span>RAG 答案从 50% → 100% 不是换模型，而是发现「评估指标用脆弱子串匹配」的缺陷，改为「关键词覆盖度」评估，并优化答案生成 prompt——用数据找到 bug，用数据证明修复。</p>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>12 / 15</span>
  </div>
</Slide>
