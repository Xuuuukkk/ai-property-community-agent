<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '32px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>虚拟社区 · 数据库设计</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>数据库 ER 图（21 张表 · 5 个业务域）</h2>
    <div style={{ fontSize: 14, color: '#6b7075', marginTop: 6 }}>箭头表示外键关系 · 灰底为空间链 · 金底为人员 · 深蓝为知识</div>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="1150" height="470" viewBox="0 0 1150 470">
      <g fontFamily="Inter, sans-serif">
        {/* ===== 空间域 ===== */}
        <rect x="14" y="18" width="350" height="210" rx="10" fill="rgba(34,57,94,0.04)" stroke="#22395E" strokeWidth="1" />
        <text x="30" y="42" fontSize="12" fontWeight="bold" fill="#BD9B56">空间域</text>
        <rect x="70" y="56" width="200" height="42" rx="8" fill="#172133" />
        <text x="170" y="81" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FBFCFA">community</text>
        <line x1="170" y1="98" x2="170" y2="112" stroke="#BD9B56" strokeWidth="1.3" />
        <rect x="70" y="116" width="200" height="42" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="170" y="141" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">building ×8</text>
        <line x1="170" y1="158" x2="170" y2="172" stroke="#BD9B56" strokeWidth="1.3" />
        <rect x="70" y="176" width="200" height="42" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="170" y="201" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">house ×1664</text>

        {/* ===== 人员域 ===== */}
        <rect x="380" y="18" width="350" height="210" rx="10" fill="rgba(189,155,86,0.06)" stroke="#BD9B56" strokeWidth="1" />
        <text x="396" y="42" fontSize="12" fontWeight="bold" fill="#BD9B56">人员域</text>
        <rect x="455" y="56" width="200" height="42" rx="8" fill="rgba(189,155,86,0.12)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="555" y="81" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#172133">user ×200</text>
        <line x1="555" y1="98" x2="555" y2="112" stroke="#BD9B56" strokeWidth="1.3" />
        <line x1="455" y1="112" x2="655" y2="112" stroke="#BD9B56" strokeWidth="1.3" />
        <rect x="455" y="116" width="95" height="42" rx="8" fill="rgba(189,155,86,0.12)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="502" y="141" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">worker ×75</text>
        <rect x="560" y="116" width="95" height="42" rx="8" fill="rgba(189,155,86,0.12)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="607" y="141" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#172133">house_binding</text>
        <line x1="607" y1="158" x2="607" y2="176" stroke="#BD9B56" strokeWidth="1.2" />
        <line x1="607" y1="176" x2="607" y2="176" stroke="#BD9B56" strokeWidth="0" />
        <text x="555" y="188" textAnchor="middle" fontSize="10" fill="#5F5E5A">user 1—1 worker · user 1—N binding</text>

        {/* ===== 业务域 ===== */}
        <rect x="746" y="18" width="390" height="210" rx="10" fill="rgba(34,57,94,0.04)" stroke="#22395E" strokeWidth="1" />
        <text x="762" y="42" fontSize="12" fontWeight="bold" fill="#BD9B56">业务域</text>
        <rect x="800" y="56" width="160" height="42" rx="8" fill="rgba(34,57,94,0.08)" stroke="#22395E" strokeWidth="1.5" />
        <text x="880" y="81" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">repair_order ×50</text>
        <line x1="880" y1="98" x2="880" y2="110" stroke="#BD9B56" strokeWidth="1.2" />
        <rect x="800" y="114" width="160" height="38" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="880" y="137" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">repair_record</text>
        <rect x="980" y="56" width="140" height="38" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="1050" y="79" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">fee_bill ×746</text>
        <rect x="980" y="104" width="140" height="38" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="1050" y="127" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">notice ×24</text>
        <rect x="980" y="152" width="140" height="38" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="1050" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">issue_report</text>
        <text x="880" y="188" textAnchor="middle" fontSize="10" fill="#5F5E5A">order → user/house/worker</text>

        {/* ===== AI / 知识域 ===== */}
        <rect x="14" y="244" width="560" height="210" rx="10" fill="rgba(34,57,94,0.04)" stroke="#22395E" strokeWidth="1" />
        <text x="30" y="268" fontSize="12" fontWeight="bold" fill="#BD9B56">AI / 知识域</text>
        <rect x="60" y="282" width="180" height="42" rx="8" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="150" y="307" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">conversation</text>
        <line x1="150" y1="324" x2="150" y2="336" stroke="#BD9B56" strokeWidth="1.2" />
        <line x1="80" y1="336" x2="310" y2="336" stroke="#BD9B56" strokeWidth="1.2" />
        <rect x="60" y="340" width="80" height="38" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="100" y="363" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#172133">message</text>
        <rect x="150" y="340" width="80" height="38" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="190" y="363" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#172133">agent_trace</text>
        <rect x="240" y="340" width="90" height="38" rx="6" fill="rgba(34,57,94,0.06)" stroke="#22395E" strokeWidth="1.5" />
        <text x="285" y="363" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#172133">msg_feedback</text>
        <rect x="380" y="282" width="180" height="42" rx="8" fill="#22395E" />
        <text x="470" y="307" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FBFCFA">knowledge_document ×22</text>
        <line x1="470" y1="324" x2="470" y2="340" stroke="#BD9B56" strokeWidth="1.2" />
        <rect x="380" y="340" width="180" height="42" rx="8" fill="rgba(34,57,94,0.06)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="470" y="365" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">knowledge_chunk ×99</text>

        {/* ===== 巡检 / 通知域 ===== */}
        <rect x="590" y="244" width="546" height="210" rx="10" fill="rgba(189,155,86,0.06)" stroke="#BD9B56" strokeWidth="1" />
        <text x="606" y="268" fontSize="12" fontWeight="bold" fill="#BD9B56">巡检 / 通知域</text>
        <rect x="640" y="282" width="180" height="42" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="730" y="307" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">inspection_camera</text>
        <line x1="730" y1="324" x2="730" y2="340" stroke="#BD9B56" strokeWidth="1.2" />
        <rect x="640" y="340" width="180" height="42" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="730" y="365" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">inspection_record</text>
        <rect x="850" y="282" width="160" height="42" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="930" y="307" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#172133">notification</text>
        <rect x="850" y="340" width="160" height="42" rx="8" fill="rgba(189,155,86,0.10)" stroke="#BD9B56" strokeWidth="1.5" />
        <text x="930" y="365" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#172133">knowledge_gap</text>

        {/* ===== 跨域关系（关键外键）===== */}
        <line x1="270" y1="197" x2="800" y2="77" stroke="#BD9B56" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="607" y1="116" x2="607" y2="77" stroke="#BD9B56" strokeWidth="0" />
        <text x="520" y="100" fontSize="9" fill="#a09b8c">house → repair_order / fee_bill</text>
      </g>
    </svg>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>2 / 2</span>
  </div>
</Slide>
