<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative' }}>
  <div style={{ position: 'absolute', left: 64, top: 52, right: 64 }}>
    <div style={{ color: '#BD9B56', fontSize: 16, letterSpacing: '0.3em', marginBottom: 8 }}>03 · AI 能力</div>
    <h2 style={{ fontSize: 36, fontWeight: 'bold', color: '#172133', margin: 0 }}>RAG 知识库：检索物业「隐性知识」</h2>
  </div>
  <div style={{ position: 'absolute', left: 64, top: 150, width: 660, background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
    <svg width="604" height="420" viewBox="0 0 604 420">
      <defs>
        <marker id="ar5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#BD9B56" />
        </marker>
      </defs>
      <g fontFamily="Inter, sans-serif">
        <rect x="20" y="20" width="140" height="54" rx="8" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="90" y="42" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">22 知识文档</text>
        <text x="90" y="60" textAnchor="middle" fontSize="10" fill="#5F5E5A">公约/装修/停车/FAQ</text>
        <line x1="160" y1="47" x2="190" y2="47" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar5)" />
        <rect x="194" y="20" width="150" height="54" rx="8" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="269" y="42" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">切片 99 个</text>
        <text x="269" y="60" textAnchor="middle" fontSize="10" fill="#5F5E5A">语义切分</text>
        <line x1="344" y1="47" x2="374" y2="47" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar5)" />
        <rect x="378" y="20" width="206" height="54" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="481" y="42" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">embedding-3 向量化</text>
        <text x="481" y="60" textAnchor="middle" fontSize="10" fill="#5F5E5A">1024 维</text>
        <line x1="481" y1="74" x2="481" y2="96" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar5)" />
        <rect x="358" y="100" width="246" height="54" rx="8" fill="#172133" />
        <text x="481" y="122" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#BD9B56">pgvector 向量库</text>
        <text x="481" y="140" textAnchor="middle" fontSize="10" fill="#FBFCFA">PostgreSQL 扩展 · 一库双角色</text>
        <line x1="481" y1="154" x2="481" y2="176" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar5)" />
        <rect x="358" y="180" width="246" height="54" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="481" y="202" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">相似度检索 top-5</text>
        <text x="481" y="220" textAnchor="middle" fontSize="10" fill="#5F5E5A">Recall@5 = 100%</text>
        <line x1="481" y1="234" x2="481" y2="256" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar5)" />
        <rect x="358" y="260" width="246" height="54" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="481" y="282" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">GLM-4-Flash 生成答案</text>
        <text x="481" y="300" textAnchor="middle" fontSize="10" fill="#5F5E5A">答案准确率 100%</text>
        <line x1="481" y1="314" x2="481" y2="336" stroke="#BD9B56" strokeWidth="1.5" markerEnd="url(#ar5)" />
        <rect x="378" y="340" width="206" height="54" rx="8" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="2" />
        <text x="481" y="362" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">业主收到答案</text>
        <text x="481" y="380" textAnchor="middle" fontSize="10" fill="#5F5E5A">「工作日 9:00-12:00」</text>
        <text x="90" y="380" fontSize="12" fill="#5F5E5A">知识缺口 → 人工审核</text>
        <text x="90" y="398" fontSize="12" fill="#5F5E5A">→ 自动入库（自进化）</text>
        <path d="M 90 330 C 90 370 30 370 40 340" fill="none" stroke="#BD9B56" strokeWidth="1.2" strokeDasharray="4 4" />
      </g>
    </svg>
  </div>
  <div style={{ position: 'absolute', right: 64, top: 150, width: 400, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>为什么是「隐性知识」</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>施工时间、装修规定、停车规则——这些不在公告栏和费用页，只在员工经验里。</p>
    </div>
    <div>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>自进化闭环</div>
      <p style={{ fontSize: 14, color: '#172133', margin: 0, lineHeight: 1.6 }}>对话点赞/纠错 → 知识缺口沉淀 → 人工审核 → 自动入库，知识库越用越准。</p>
    </div>
    <div style={{ padding: '16px 18px', background: 'rgba(189,155,86,0.12)', borderRadius: 8, borderLeft: '3px solid #BD9B56' }}>
      <p style={{ fontSize: 13, color: '#172133', margin: 0, lineHeight: 1.6 }}><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>Recall@5 = 100%</span>：检索到的片段必含答案，答案生成有据可查。</p>
    </div>
  </div>
  <div style={{ position: 'absolute', left: 64, bottom: 24, color: '#BD9B56', fontSize: 14, letterSpacing: '0.12em' }}>云溪花园 · 智慧社区</div>
  <div style={{ position: 'absolute', right: 24, bottom: 24, color: 'rgba(189,155,86,0.75)', fontSize: 14 }}>14 / 17</div>
</Slide>
