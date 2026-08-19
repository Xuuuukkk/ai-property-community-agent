<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '30px 56px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.25em', marginBottom: 5 }}>03 · 成果与验证</div>
    <h2 style={{ fontSize: 27, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.25 }}>量化评估：方法 · 流程 · 指标判定</h2>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 18, marginTop: 12 }}>
    {/* 左栏：方法 + 流程 */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* 评估方法（前情） */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>为什么要额外评估 AI</div>
        <div style={{ fontSize: 12, color: '#5F5E5A', lineHeight: 1.65, marginBottom: 8 }}>传统软件只验证「输入 → 输出」；AI Agent 还必须验证中间链路，否则「答得对」不等于「办得成」：</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11.5 }}>
          <span style={{ color: '#172133', fontWeight: 'bold' }}>输入</span><span style={{ color: '#a09b8c' }}>→</span>
          <span style={{ color: '#172133', fontWeight: 'bold' }}>理解</span><span style={{ color: '#a09b8c' }}>→</span>
          <span style={{ color: '#172133', fontWeight: 'bold' }}>决策</span><span style={{ color: '#a09b8c' }}>→</span>
          <span style={{ color: '#172133', fontWeight: 'bold' }}>工具选择</span><span style={{ color: '#a09b8c' }}>→</span>
          <span style={{ color: '#172133', fontWeight: 'bold' }}>知识检索</span><span style={{ color: '#a09b8c' }}>→</span>
          <span style={{ color: '#172133', fontWeight: 'bold' }}>最终答案</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7075', lineHeight: 1.6, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(34,57,94,0.08)' }}>对应建立三层评估：<span style={{ color: '#172133', fontWeight: 'bold' }}>Agent 评估</span>（意图 / 工具 / 工作流）＋ <span style={{ color: '#172133', fontWeight: 'bold' }}>RAG 评估</span>（检索 / 答案）＋ <span style={{ color: '#172133', fontWeight: 'bold' }}>端到端评估</span>（完整业务闭环）。</div>
      </div>
      {/* 测试流程 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>测试怎么进行</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['① 构建数据集', '意图 / 工具 / 工作流 / 知识问答 4 类用例'],
            ['② 运行 Agent', 'python 跑评估，收集 trace'],
            ['③ 比对期望', '预测值 vs 标注期望值'],
            ['④ 生成报告', '指标 + 失败用例定位'],
          ].map(([t, d]) => (
            <div key={t} style={{ flex: 1, background: 'rgba(189,155,86,0.07)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 11.5, color: '#172133', fontWeight: 'bold', marginBottom: 3 }}>{t}</div>
              <div style={{ fontSize: 10.5, color: '#6b7075', lineHeight: 1.4 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* 右栏：指标判定 + 结果 */}
    <div style={{ flex: '0 0 440px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        ['意图识别', '100%', '预测意图 = 期望意图，正确数 / 总用例', '83.33% → 100%'],
        ['RAG 召回 Recall@5', '100%', 'top-5 检索结果是否包含正确文档', '检索质量稳定达标'],
        ['RAG 答案准确率', '100%', '期望关键词全部覆盖（关键词覆盖度）', '50% → 100%'],
      ].map(([name, val, judge, note]) => (
        <div key={name} style={{ background: '#fff', borderRadius: 10, padding: '10px 16px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, color: '#172133', fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#6b7075', marginTop: 3, lineHeight: 1.5 }}>判定：{judge}</div>
            <div style={{ fontSize: 10.5, color: '#a09b8c', marginTop: 2 }}>{note}</div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 'bold', color: '#BD9B56', fontFamily: 'Inter, sans-serif', minWidth: 78, textAlign: 'right' }}>{val}</div>
        </div>
      ))}
      <div style={{ background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, color: '#FBFCFA', fontWeight: 'bold' }}>单元测试 · CI 全绿</div>
          <div style={{ fontSize: 11, color: 'rgba(251,252,250,0.75)', marginTop: 3, lineHeight: 1.5 }}>判定：pytest 单测 + GitHub Actions 每次 push 自动跑</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#BD9B56', fontFamily: 'Inter, sans-serif', minWidth: 78, textAlign: 'right' }}>113+30</div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, background: 'rgba(189,155,86,0.10)', borderLeft: '4px solid #BD9B56', borderRadius: '0 8px 8px 0', padding: '10px 18px', marginTop: 10 }}>
    <p style={{ fontSize: 12.5, color: '#172133', margin: 0, lineHeight: 1.55 }}><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>评估驱动优化：</span>RAG 答案 50% → 100% 源于发现「评估指标用脆弱子串匹配」并改为「关键词覆盖度」、同时优化答案生成 prompt。工具选择 / 参数提取 / 工作流三项受「报修多轮交互」设计影响（用例按单轮设计、实际走 pending_repair 多轮），已定位为评估框架升级项，而非 Agent 缺陷。</p>
  </div>
  <div style={{ flexShrink: 0, height: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>15 / 19</span>
  </div>
</Slide>
