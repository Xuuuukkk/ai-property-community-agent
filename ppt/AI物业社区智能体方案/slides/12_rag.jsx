<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '40px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 8 }}>02 · 技术构建过程</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>RAG 知识库：检索物业「隐性知识」</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 8 }}>22 篇文档不是凭空编造，而是参照官方示范文本与法律规范拟定，每篇标注制定依据</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 28 }}>
    <div style={{ flex: '0 0 430px', background: '#fff', borderRadius: 12, padding: '20px 22px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
      <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 12 }}>知识库目录（7 分类 22 篇）</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0', borderBottom: '1px solid rgba(34,57,94,0.06)' }}><span>community-rules 社区规约</span><span style={{ color: '#5F5E5A' }}>3 篇</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0', borderBottom: '1px solid rgba(34,57,94,0.06)' }}><span>decoration 装修管理</span><span style={{ color: '#5F5E5A' }}>3 篇</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0', borderBottom: '1px solid rgba(34,57,94,0.06)' }}><span>parking 停车管理</span><span style={{ color: '#5F5E5A' }}>3 篇</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0', borderBottom: '1px solid rgba(34,57,94,0.06)' }}><span>property-service 物业服务</span><span style={{ color: '#5F5E5A' }}>3 篇</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0', borderBottom: '1px solid rgba(34,57,94,0.06)' }}><span>emergency 应急管理</span><span style={{ color: '#5F5E5A' }}>3 篇</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0', borderBottom: '1px solid rgba(34,57,94,0.06)' }}><span>security 安保管理</span><span style={{ color: '#5F5E5A' }}>3 篇</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#172133', padding: '4px 0' }}><span>faq 常见问题</span><span style={{ color: '#5F5E5A' }}>4 篇</span></div>
      </div>
      <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(189,155,86,0.10)', borderRadius: 8 }}>
        <div style={{ fontSize: 12, color: '#BD9B56', fontWeight: 'bold', marginBottom: 6 }}>制定依据（原文可查）</div>
        <div style={{ fontSize: 12, color: '#5F5E5A', lineHeight: 1.7 }}>
          依据《民法典》《物业管理条例》《上海市住宅物业管理规定》，参照上海市住建委 2021 版住宅小区管理规约示范文本
        </div>
      </div>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 10 }}>检索链路</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#172133', background: 'rgba(34,57,94,0.06)', padding: '6px 12px', borderRadius: 6 }}>22 文档</span>
          <span style={{ color: '#BD9B56' }}>→</span>
          <span style={{ fontSize: 13, color: '#172133', background: 'rgba(34,57,94,0.06)', padding: '6px 12px', borderRadius: 6 }}>99 切片</span>
          <span style={{ color: '#BD9B56' }}>→</span>
          <span style={{ fontSize: 13, color: '#172133', background: 'rgba(34,57,94,0.06)', padding: '6px 12px', borderRadius: 6 }}>embedding-3（1024 维）</span>
          <span style={{ color: '#BD9B56' }}>→</span>
          <span style={{ fontSize: 13, color: '#172133', background: 'rgba(34,57,94,0.06)', padding: '6px 12px', borderRadius: 6 }}>pgvector 检索 top-5</span>
          <span style={{ color: '#BD9B56' }}>→</span>
          <span style={{ fontSize: 13, color: '#172133', background: 'rgba(34,57,94,0.06)', padding: '6px 12px', borderRadius: 6 }}>GLM-4-Flash 生成答案</span>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>实测指标</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.7 }}>召回 Recall@5 = <span style={{ color: '#BD9B56', fontWeight: 'bold' }}>100%</span>（检索到的片段必含答案）· 答案准确率 <span style={{ color: '#BD9B56', fontWeight: 'bold' }}>100%</span></p>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 14, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>反馈自进化闭环</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.7 }}>业主对答案点赞/纠错 → 系统沉淀「知识缺口」→ 物业人工审核 → 审核通过自动写入知识库，让知识越用越准。</p>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>12 / 19</span>
  </div>
</Slide>
