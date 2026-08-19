<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '32px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>02 · 技术构建过程</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>数据库设计：15+ 张表承载整个社区</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 6 }}>数据库是系统地基，通过外键建立完整 ER 关系，覆盖社区到知识库的全部实体</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 0, gap: 28 }}>
    <div style={{ flex: '0 0 320px', background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '24px 24px', color: '#FBFCFA' }}>
      <div style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.25em', marginBottom: 12 }}>CORE ENTITIES</div>
      <div style={{ fontSize: 14, color: 'rgba(251,252,250,0.9)', lineHeight: 1.9 }}>
        community 社区<br/>
        building 楼栋（8）<br/>
        house 房屋（1664）<br/>
        user 用户（275）<br/>
        house_binding 房屋绑定<br/>
        worker 物业人员（75）<br/>
        repair_order 工单<br/>
        fee_bill 账单（746）<br/>
        notice 公告（24）<br/>
        conversation / message<br/>
        agent_trace 追踪<br/>
        <span style={{ color: '#BD9B56' }}>knowledge_document / chunk</span>
      </div>
    </div>
    <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '20px 22px', boxShadow: '0 6px 24px rgba(23,33,51,0.08)' }}>
      <svg width="560" height="470" viewBox="0 0 560 470">
        <g fontFamily="Inter, sans-serif">
          <rect x="14" y="14" width="150" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="89" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">community</text>
          <line x1="164" y1="39" x2="206" y2="39" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="210" y="14" width="150" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="285" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">building ×8</text>
          <line x1="360" y1="39" x2="402" y2="39" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="406" y="14" width="150" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="481" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">house ×1664</text>
          <line x1="285" y1="64" x2="285" y2="104" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="210" y="108" width="150" height="50" rx="6" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
          <text x="285" y="138" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">user ×275</text>
          <line x1="210" y1="133" x2="164" y2="133" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="14" y="108" width="150" height="50" rx="6" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
          <text x="89" y="138" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">house_binding</text>
          <line x1="285" y1="158" x2="285" y2="198" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="210" y="202" width="150" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="285" y="232" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">worker ×75</text>
          <line x1="285" y1="252" x2="285" y2="292" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="160" y="296" width="130" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="225" y="326" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">repair_order</text>
          <rect x="306" y="296" width="130" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="371" y="326" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">fee_bill ×746</text>
          <line x1="225" y1="346" x2="225" y2="386" stroke="#BD9B56" strokeWidth="1.5" />
          <rect x="160" y="390" width="130" height="50" rx="6" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
          <text x="225" y="420" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">notice ×24</text>
          <rect x="306" y="390" width="130" height="50" rx="6" fill="#172133" stroke="#BD9B56" strokeWidth="1.5" />
          <text x="371" y="416" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#BD9B56">knowledge</text>
          <text x="371" y="434" textAnchor="middle" fontSize="10" fill="#FBFCFA">document + chunk</text>
        </g>
      </svg>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>07 / 15</span>
  </div>
</Slide>
