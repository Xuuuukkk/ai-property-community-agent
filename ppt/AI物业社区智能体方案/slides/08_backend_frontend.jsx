<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '40px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 8 }}>02 · 技术构建过程</div>
    <h2 style={{ fontSize: 30, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>后端分层 + 前端三端一体</h2>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 32 }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: '18px 22px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 17, fontWeight: 'bold', color: '#172133', marginBottom: 6 }}>后端：FastAPI 三层架构</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.6 }}>API 路由层 → Service 业务层 → Repository 数据层。业务与数据解耦，AI 逻辑不混入业务代码。</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: '18px 22px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 17, fontWeight: 'bold', color: '#172133', marginBottom: 6 }}>派单算法</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.6 }}>按「技能匹配 + 在岗状态 + 工号升序」自动选择维修师傅，无需人工指派，报修提交即自动派单。</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: '18px 22px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 17, fontWeight: 'bold', color: '#172133', marginBottom: 6 }}>消息通知</div>
        <p style={{ fontSize: 14, color: '#5F5E5A', margin: 0, lineHeight: 1.6 }}>派单、完成、答复、巡检异常等事件全链路实时通知相关角色，保证业务协同不遗漏。</p>
      </div>
    </div>
    <div style={{ flex: 1, background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '26px 26px', color: '#FBFCFA' }}>
      <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 18 }}>FRONTEND · 三端</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(189,155,86,0.10)', borderRadius: 8 }}>
          <span style={{ color: '#BD9B56', fontSize: 17, fontWeight: 'bold', minWidth: 64 }}>业主端</span>
          <span style={{ fontSize: 13, color: 'rgba(251,252,250,0.85)' }}>AI 助手 · 报修 · 缴费 · 公告 · 问题上报</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(189,155,86,0.10)', borderRadius: 8 }}>
          <span style={{ color: '#BD9B56', fontSize: 17, fontWeight: 'bold', minWidth: 64 }}>物业端</span>
          <span style={{ fontSize: 13, color: 'rgba(251,252,250,0.85)' }}>工单管理 · 巡检 · 数据看板 · 知识审核</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(189,155,86,0.10)', borderRadius: 8 }}>
          <span style={{ color: '#BD9B56', fontSize: 17, fontWeight: 'bold', minWidth: 64 }}>维修端</span>
          <span style={{ fontSize: 13, color: 'rgba(251,252,250,0.85)' }}>接单 · 处理 · 消息 · 巡检任务</span>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(189,155,86,0.3)' }}>
        <div style={{ fontSize: 13, color: 'rgba(251,252,250,0.8)', lineHeight: 1.7 }}>
          React + TypeScript + Tailwind<br/>JWT 鉴权 · 角色路由 · 支持 PWA 安装<br/>后端 113 测试 + 前端 30 测试全绿
        </div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>08 / 15</span>
  </div>
</Slide>
