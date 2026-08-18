<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative' }}>
  <div style={{ position: 'absolute', left: 64, top: 52, right: 64 }}>
    <div style={{ color: '#BD9B56', fontSize: 16, letterSpacing: '0.3em', marginBottom: 8 }}>02 · 技术构建路线</div>
    <h2 style={{ fontSize: 36, fontWeight: 'bold', color: '#172133', margin: 0 }}>数据库设计：8+ 张表承载整个社区</h2>
  </div>
  <div style={{ position: 'absolute', left: 64, top: 150, width: 300, background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '26px 24px', color: '#FBFCFA' }}>
    <div style={{ color: '#BD9B56', fontSize: 14, letterSpacing: '0.3em', marginBottom: 12 }}>DATA MODEL</div>
    <h3 style={{ fontSize: 22, fontWeight: 'bold', margin: '0 0 14px', color: '#FBFCFA' }}>核心实体</h3>
    <div style={{ fontSize: 13, color: 'rgba(251,252,250,0.88)', lineHeight: 2 }}>
      Community 社区<br/>
      Building 楼栋<br/>
      House 房屋<br/>
      User 业主<br/>
      Worker 物业人员<br/>
      RepairOrder 工单<br/>
      FeeBill 费用<br/>
      Notice 公告<br/>
      <span style={{ color: '#BD9B56' }}>+ pgvector 向量表</span>
    </div>
  </div>
  <div style={{ position: 'absolute', left: 400, top: 150, right: 64, height: 470, background: '#fff', borderRadius: 12, padding: '22px 26px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
    <svg width="790" height="426" viewBox="0 0 790 426">
      <g fontFamily="Inter, sans-serif">
        <rect x="20" y="16" width="200" height="60" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="120" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">community</text>
        <text x="120" y="62" textAnchor="middle" fontSize="11" fill="#5F5E5A">1 个小区 · 基本信息</text>
        <rect x="320" y="16" width="200" height="60" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="420" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">building</text>
        <text x="420" y="62" textAnchor="middle" fontSize="11" fill="#5F5E5A">8 栋 · 26 层 · 2 单元</text>
        <rect x="620" y="16" width="150" height="60" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="695" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">house</text>
        <text x="695" y="62" textAnchor="middle" fontSize="11" fill="#5F5E5A">1664 套房源</text>
        <line x1="220" y1="46" x2="320" y2="46" stroke="#BD9B56" strokeWidth="1.5" />
        <line x1="520" y1="46" x2="620" y2="46" stroke="#BD9B56" strokeWidth="1.5" />
        <rect x="20" y="200" width="200" height="60" rx="6" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="120" y="226" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">user</text>
        <text x="120" y="246" textAnchor="middle" fontSize="11" fill="#5F5E5A">200 业主 + 75 物业</text>
        <rect x="320" y="200" width="200" height="60" rx="6" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="420" y="226" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">repair_order</text>
        <text x="420" y="246" textAnchor="middle" fontSize="11" fill="#5F5E5A">50 工单 · 5 状态 · 6 类</text>
        <rect x="620" y="200" width="150" height="60" rx="6" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="695" y="226" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">fee_bill</text>
        <text x="695" y="246" textAnchor="middle" fontSize="11" fill="#5F5E5A">4 类费用</text>
        <line x1="120" y1="76" x2="120" y2="200" stroke="#BD9B56" strokeWidth="1.5" />
        <line x1="420" y1="76" x2="420" y2="200" stroke="#BD9B56" strokeWidth="1.5" />
        <line x1="695" y1="76" x2="695" y2="200" stroke="#BD9B56" strokeWidth="1.5" />
        <rect x="20" y="360" width="200" height="60" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="120" y="386" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">worker</text>
        <text x="120" y="406" textAnchor="middle" fontSize="11" fill="#5F5E5A">75 人 · 5 类技能</text>
        <rect x="320" y="360" width="200" height="60" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="420" y="386" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">notice</text>
        <text x="420" y="406" textAnchor="middle" fontSize="11" fill="#5F5E5A">24 公告 · 8 类</text>
        <rect x="620" y="360" width="150" height="60" rx="6" fill="#172133" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="695" y="384" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#BD9B56">knowledge</text>
        <text x="695" y="404" textAnchor="middle" fontSize="11" fill="#FBFCFA">99 切片 · vector</text>
        <line x1="420" y1="260" x2="420" y2="360" stroke="#BD9B56" strokeWidth="1.5" />
      </g>
    </svg>
  </div>
  <div style={{ position: 'absolute', left: 64, bottom: 24, color: '#BD9B56', fontSize: 14, letterSpacing: '0.12em' }}>云溪花园 · 智慧社区</div>
  <div style={{ position: 'absolute', right: 24, bottom: 24, color: 'rgba(189,155,86,0.75)', fontSize: 14 }}>09 / 17</div>
</Slide>
