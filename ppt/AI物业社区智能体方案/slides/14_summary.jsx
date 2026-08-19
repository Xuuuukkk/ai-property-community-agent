<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '32px 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em', marginBottom: 6 }}>04 · 总结与展望</div>
    <h2 style={{ fontSize: 29, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.3 }}>三端应用 + 自维护自更新，AI 物业社区落地</h2>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 26 }}>
    {/* 左栏：三端功能 + 技术路线 + 自维护 */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 三端功能 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 10 }}>三端应用 · 功能与角色路由</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: '#BD9B56', fontSize: 14, fontWeight: 'bold', minWidth: 52, marginTop: 1 }}>业主端</span>
            <span style={{ fontSize: 12.5, color: '#5F5E5A', lineHeight: 1.55 }}>AI 助手（统一入口）· 对话报修 · 缴费查询 · 公告 · 我的工单 · 问题上报</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: '#BD9B56', fontSize: 14, fontWeight: 'bold', minWidth: 52, marginTop: 1 }}>物业端</span>
            <span style={{ fontSize: 12.5, color: '#5F5E5A', lineHeight: 1.55 }}>数据看板 · 工单管理 · 用户/房屋管理 · 公告（AI 生成）· 巡检管理 · 知识缺口审核</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: '#BD9B56', fontSize: 14, fontWeight: 'bold', minWidth: 52, marginTop: 1 }}>维修端</span>
            <span style={{ fontSize: 12.5, color: '#5F5E5A', lineHeight: 1.55 }}>任务列表 · 接单/处理/完成 · 消息 · 巡检任务</span>
          </div>
        </div>
      </div>
      {/* 技术路线 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '12px 18px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>技术路线</div>
        <div style={{ fontSize: 12.5, color: '#5F5E5A', lineHeight: 1.7 }}>前端 React + TS + Tailwind · JWT 鉴权 + 角色路由 · PWA<br/>后端 FastAPI 三层（路由 → Service → Repository）<br/>AI LangGraph 多 Agent（Personal → Router → Domain）· 智谱 GLM-4-Flash · pgvector RAG<br/>派单算法（技能 + 在岗 + 工号升序）· 全链路消息通知</div>
      </div>
      {/* 自维护自更新 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '12px 18px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)', flex: 1 }}>
        <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>系统自维护自更新</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#172133', background: 'rgba(189,155,86,0.12)', padding: '5px 10px', borderRadius: 6 }}>⏱ 定时数据清理（APScheduler 每日）</span>
          <span style={{ fontSize: 12, color: '#172133', background: 'rgba(189,155,86,0.12)', padding: '5px 10px', borderRadius: 6 }}>📷 巡检自动化（抓拍 + 视觉识别）</span>
          <span style={{ fontSize: 12, color: '#172133', background: 'rgba(189,155,86,0.12)', padding: '5px 10px', borderRadius: 6 }}>🧠 知识自进化（反馈 → 审核 → 入库）</span>
          <span style={{ fontSize: 12, color: '#172133', background: 'rgba(189,155,86,0.12)', padding: '5px 10px', borderRadius: 6 }}>📊 监控告警（Prometheus + Grafana）</span>
          <span style={{ fontSize: 12, color: '#172133', background: 'rgba(189,155,86,0.12)', padding: '5px 10px', borderRadius: 6 }}>🚀 CI/CD（GitHub Actions 自动测试发布）</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7075', marginTop: 10, lineHeight: 1.6 }}>系统无需人工值守即可完成数据清理、自动巡检、知识沉淀、监控告警与持续交付，形成「越用越准、越用越稳」的自进化闭环。</div>
      </div>
    </div>
    {/* 右栏：量化 + Demo */}
    <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '20px 22px', color: '#FBFCFA', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ color: '#BD9B56', fontSize: 13, letterSpacing: '0.25em' }}>ONLINE DEMO</div>
        <div style={{ fontSize: 18, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>http://119.91.236.85</div>
        <div style={{ fontSize: 12.5, color: 'rgba(251,252,250,0.75)', lineHeight: 1.8 }}>
          业主 guoyi378 · 物业 mayun420 · 维修 yangfei423<br/><span style={{ color: '#BD9B56' }}>密码均为 123456</span>
        </div>
        <div style={{ paddingTop: 12, borderTop: '1px solid rgba(189,155,86,0.3)', fontSize: 11.5, color: 'rgba(251,252,250,0.6)', lineHeight: 1.7 }}>
          GitHub：Xuuuukkk/ai-property-community-agent · MIT
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 13, color: '#BD9B56', fontWeight: 'bold', letterSpacing: '0.1em' }}>项目成果</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#BD9B56', fontFamily: 'Inter, sans-serif' }}>100%</div>
            <div style={{ fontSize: 11, color: '#5F5E5A', marginTop: 3 }}>核心链路指标</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#BD9B56', fontFamily: 'Inter, sans-serif' }}>113+30</div>
            <div style={{ fontSize: 11, color: '#5F5E5A', marginTop: 3 }}>测试全绿</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(189,155,86,0.08)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#BD9B56', fontFamily: 'Inter, sans-serif' }}>7 阶段</div>
            <div style={{ fontSize: 11, color: '#5F5E5A', marginTop: 3 }}>Phase 0-7 完成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>14 / 15</span>
  </div>
</Slide>
