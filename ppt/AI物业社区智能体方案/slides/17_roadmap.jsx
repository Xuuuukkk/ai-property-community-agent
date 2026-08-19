<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '36px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>04 · 总结与展望</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>技术路线回顾：八个阶段 · 从 0 到上线</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 6 }}>每个阶段都有代码、测试、可运行交付，循序渐进验证</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '100%', background: '#fff', borderRadius: 12, padding: '30px 26px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
      <svg width="1100" height="300" viewBox="0 0 1100 300">
        <g fontFamily="Inter, sans-serif">
          {/* 主时间轴 */}
          <line x1="60" y1="70" x2="1060" y2="70" stroke="#22395E" strokeWidth="2.5" />
          {[
            ['P0', '项目初始化', '仓库 · Docker · CI'],
            ['P1', '数据库', '21 表 + 仿真数据'],
            ['P2', '后端', 'FastAPI 三层'],
            ['P3', '前端', '三端 + PWA'],
            ['P4', 'AI Agent', '多意图 + 状态机'],
            ['P5', 'RAG', '向量化检索'],
            ['P6', '评估', 'Intent/Tool/RAG'],
            ['P7', '部署', '已上线'],
          ].map(([p, t, d], i) => {
            const cx = 60 + i * 143
            return (
              <g key={p}>
                {/* 节点圆 */}
                <circle cx={cx} cy={70} r="9" fill="#BD9B56" />
                <circle cx={cx} cy={70} r="14" fill="none" stroke="#BD9B56" strokeWidth="1.5" strokeOpacity="0.35" />
                {/* 阶段标签 */}
                <text x={cx} y={46} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">{p}</text>
                {/* 阶段名 */}
                <text x={cx} y={112} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#172133">{t}</text>
                {/* 描述 */}
                <text x={cx} y={134} textAnchor="middle" fontSize="11.5" fill="#5F5E5A">{d}</text>
                {/* 下方小圆点连接 */}
                <line x1={cx} y1={79} x2={cx} y2={100} stroke="#BD9B56" strokeWidth="1.5" strokeOpacity="0.5" />
              </g>
            )
          })}
        </g>
      </svg>
      <div style={{ marginTop: 16, display: 'flex', gap: 14 }}>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #BD9B56' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P1 · 数据一致性</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>8 栋 / 1664 套 / 746 账单，外键关联保证一致，8 个 SQL 可复现</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #BD9B56' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P4 · 多轮状态机</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>报修主动追问缺省字段，避免生成残缺工单</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #BD9B56' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P6 · 评估找 bug</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>意图 83.33%→100%、答案 50%→100%，数据驱动优化</p>
        </div>
        <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #BD9B56' }}>
          <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', marginBottom: 5 }}>P7 · 部署踩坑</div>
          <p style={{ fontSize: 12, color: '#5F5E5A', margin: 0, lineHeight: 1.5 }}>国内镜像源、SECRET_KEY、端口映射逐一踩平</p>
        </div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>17 / 19</span>
  </div>
</Slide>
