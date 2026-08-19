<Slide style={{ width: '1280px', height: '720px', background: '#FBFCFA', position: 'relative', padding: '26px 52px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexShrink: 0 }}>
    <div style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.25em', marginBottom: 4 }}>04 · 总结与展望</div>
    <h2 style={{ fontSize: 25, fontWeight: 'bold', color: '#172133', margin: 0, lineHeight: 1.2 }}>三端功能 × 实现技术：每个功能怎么做出来的</h2>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 18, marginTop: 10 }}>
    {/* 左栏：三端功能实现 */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 业主端 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: '#172133' }}>业主端</span>
          <span style={{ fontSize: 10.5, color: '#BD9B56', background: 'rgba(189,155,86,0.12)', padding: '2px 7px', borderRadius: 4 }}>ToC · Owner</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>AI 助手</span><span style={{ color: '#6b7075' }}>LangGraph 多 Agent：Personal 对话 → Router 意图识别 → Domain 工具调用</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>对话报修</span><span style={{ color: '#6b7075' }}>Repair Agent · 多轮状态机补全房屋/类型 · 自动派单（技能+在岗+工号）</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>缴费查询</span><span style={{ color: '#6b7075' }}>Fee Agent 查 fee_bills 账单表 · 返回金额/状态/截止日</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>公告</span><span style={{ color: '#6b7075' }}>公告列表 + AI 摘要（LLM 提炼要点）</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>我的工单</span><span style={{ color: '#6b7075' }}>repair_order 状态追踪（创建→派单→接单→完成→关闭）</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>问题上报</span><span style={{ color: '#6b7075' }}>IssueReport 上报 · 附图片 · 物业答复</span></div>
        </div>
      </div>
      {/* 物业端 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: '#172133' }}>物业端</span>
          <span style={{ fontSize: 10.5, color: '#BD9B56', background: 'rgba(189,155,86,0.12)', padding: '2px 7px', borderRadius: 4 }}>ToB · Admin/Staff</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>数据看板</span><span style={{ color: '#6b7075' }}>统计聚合 API · 今日报修/处理中/已完成实时汇总</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>工单管理</span><span style={{ color: '#6b7075' }}>repair_order CRUD · 状态流转 · 人工派单/改派</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>用户/房屋</span><span style={{ color: '#6b7075' }}>user / house / house_binding 绑定关系管理</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>公告 AI 生成</span><span style={{ color: '#6b7075' }}>Notice Agent + LLM 生成标题/正文/影响范围 · 人工审核发布</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>巡检管理</span><span style={{ color: '#6b7075' }}>摄像头抓拍 → 视觉模型识别异常 → 巡检记录 + 告警</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>知识缺口审核</span><span style={{ color: '#6b7075' }}>knowledge_gap 审核 → 通过自动写入 pgvector 知识库</span></div>
        </div>
      </div>
      {/* 维修端 */}
      <div style={{ background: '#fff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: '#172133' }}>维修端</span>
          <span style={{ fontSize: 10.5, color: '#BD9B56', background: 'rgba(189,155,86,0.12)', padding: '2px 7px', borderRadius: 4 }}>ToC · Worker</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>任务列表</span><span style={{ color: '#6b7075' }}>自动派单后查询「我的待处理」工单</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>接单/处理/完成</span><span style={{ color: '#6b7075' }}>状态机流转 · 每步触发实时通知</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>消息</span><span style={{ color: '#6b7075' }}>事件驱动通知（派单/答复/完成）</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 11.5, lineHeight: 1.4 }}><span style={{ color: '#172133', fontWeight: 'bold', minWidth: 56 }}>巡检任务</span><span style={{ color: '#6b7075' }}>巡检记录查看 · 异常处理</span></div>
        </div>
      </div>
    </div>
    {/* 右栏：自维护 + Demo */}
    <div style={{ flex: '0 0 285px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'linear-gradient(135deg, #172133 0%, #22395E 100%)', borderRadius: 12, padding: '16px 18px', color: '#FBFCFA', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.2em' }}>系统自维护自更新</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, lineHeight: 1.45 }}>
          <div><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>定时清理</span><span style={{ color: 'rgba(251,252,250,0.8)' }}>　APScheduler 每日清过期数据/孤儿文件</span></div>
          <div><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>巡检自动化</span><span style={{ color: 'rgba(251,252,250,0.8)' }}>　定时抓拍 + 视觉识别异常</span></div>
          <div><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>知识自进化</span><span style={{ color: 'rgba(251,252,250,0.8)' }}>　反馈→知识缺口→审核→入库</span></div>
          <div><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>监控告警</span><span style={{ color: 'rgba(251,252,250,0.8)' }}>　Prometheus + Grafana</span></div>
          <div><span style={{ color: '#BD9B56', fontWeight: 'bold' }}>持续交付</span><span style={{ color: 'rgba(251,252,250,0.8)' }}>　GitHub Actions 自动测试+发布</span></div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(251,252,250,0.6)', lineHeight: 1.5, paddingTop: 7, borderTop: '1px solid rgba(189,155,86,0.3)' }}>无需人工值守，越用越准、越用越稳</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 4px 16px rgba(23,33,51,0.06)' }}>
        <div style={{ color: '#BD9B56', fontSize: 11.5, letterSpacing: '0.2em', marginBottom: 8 }}>ONLINE DEMO</div>
        <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', color: '#172133', lineHeight: 1.4 }}>http://119.91.236.85</div>
        <div style={{ fontSize: 11, color: '#6b7075', lineHeight: 1.6, marginTop: 6 }}>
          业主 guoyi378 · 物业 mayun420<br/>维修 yangfei423　<span style={{ color: '#BD9B56' }}>密码 123456</span>
        </div>
        <div style={{ fontSize: 10.5, color: '#a09b8c', marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(34,57,94,0.1)' }}>GitHub：Xuuuukkk/ai-property-community-agent · MIT</div>
      </div>
    </div>
  </div>
  <div style={{ flexShrink: 0, height: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
    <span style={{ color: '#BD9B56', fontSize: 12, letterSpacing: '0.1em' }}>云溪花园 · 智慧社区</span>
    <span style={{ color: '#a09b8c', fontSize: 12 }}>18 / 19</span>
  </div>
</Slide>
