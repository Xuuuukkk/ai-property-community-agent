# AI 物业社区智能体（AI Property Community Agent）

> AI 驱动的物业社区管理智能体 —— 用 LLM + Agent 架构 + RAG 知识库，重构传统物业管理的 AI Native 系统。

**项目状态：MVP 已完成并上线** · 在线演示 http://119.91.236.85

---

## 项目简介

AI Property Community Agent 面向真实物业社区场景，构建一个具备**自然语言理解、业务流程执行、社区知识查询、多角色协同**能力的智能物业管理系统。

区别于传统物业软件「加一个聊天机器人」的思路，本项目通过 **LLM + Agent 架构 + 业务系统 + RAG 知识库 + 仿真社区数据**，让 AI 真正参与到物业业务流程中——不仅能回答问题，还能**创建工单、自动派单、巡检识别、分析数据、生成报告**。

## 项目背景

传统物业管理依赖人工客服、电话报修、人工查询规章制度，存在：

- 服务入口分散
- 报修流程效率低
- 物业知识难以快速获取
- 重复事务占用大量人工
- 社区数据价值未充分利用

随着 LLM、AI Agent、RAG 技术发展，物业管理正从「传统信息系统」升级为「AI Native 智能服务系统」。

## 核心功能

| 端 | 功能 |
|---|---|
| **业主端** | AI 助手（多意图对话）、报修、费用查询、社区公告、问题上报、消息通知 |
| **物业端** | 工单管理、公告发布、AI 巡检、数据看板与洞察、知识缺口审核 |
| **维修端** | 接单/处理工单、巡检任务、消息通知 |

**AI 能力**：

- **多意图 Agent**：报修 / 费用 / 公告 / 知识 / 上报 5 类意图，自然语言直达业务工具
- **RAG 知识检索**：pgvector 向量化检索物业「隐性知识」（施工时间、装修规定、停车规则等）
- **报修闭环**：业主报修 → 技能+在岗自动派单 → 维修处理 → 双方确认
- **AI 巡检**：摄像头抓拍 → 视觉识别异常 → 实时告警通知
- **反馈自进化**：对话点赞/纠错 → 知识缺口沉淀 → 人工审核 → 自动入库

## 系统架构

采用「AI Agent + 业务服务 + 数据平台 + 知识系统」分层架构：

```
Client 层（业主/物业/维修三端）
        ↓
API Gateway（FastAPI）
        ↓
AI Agent 层（Router Agent + 领域 Agent + 工具）
        ↓
业务 Service 层（Repository 模式）
        ↓
数据平台（PostgreSQL + pgvector 向量库 / Redis）
        ↑
知识库（22 文档 / 99 切片）
```

核心原则：**Agent 不直接操作数据库**，严守 `Agent → Tool → Service → Repository → Database` 分层，杜绝 LLM 直连 SQL。

## 虚拟社区数据资产

为验证 AI 能力，构建了高仿真数字化社区「云溪花园」：

| 数据 | 规模 |
|---|---|
| 社区 | 上海浦东 · 8 栋 26 层高层 · 1200 户入住（1664 套房源）· 约 3000 居民 |
| 用户 | 400 业主 + 75 物业人员（10 管理 / 15 维修 / 20 保洁 / 30 安保）|
| 业务数据 | 746 条账单 · 50 条工单（6 类）· 24 条公告（8 类）|
| 知识库 | 22 篇知识文档 → 99 个切片（pgvector 1024 维）|

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS（移动端 PWA）|
| 后端 | Python 3.12 + FastAPI + SQLAlchemy 2.0 + Alembic + Pydantic |
| AI | LangGraph（Agent 编排）+ 智谱 GLM-4-Flash + embedding-3（1024 维）|
| 数据库 | PostgreSQL 16 + pgvector |
| 缓存 | Redis |
| 部署 | Docker Compose（dev/prod 双环境）+ Nginx + GitHub Actions CI/CD + Prometheus |

## 开发路线（Phase 0-7 全部完成）

| 阶段 | 内容 | 状态 |
|---|---|---|
| Phase 0 | 项目初始化（Repo / Docker / CI）| ✅ |
| Phase 1 | 数据库与数据层（15+ 张表 + 仿真社区）| ✅ |
| Phase 2 | 后端服务（FastAPI + Repository 分层）| ✅ |
| Phase 3 | 前端（三端页面 + PWA）| ✅ |
| Phase 4 | AI Agent 集成（多意图 + 多轮状态机）| ✅ |
| Phase 5 | RAG 知识系统（向量化检索）| ✅ |
| Phase 6 | Agent 评估（Intent/Tool/RAG）| ✅ |
| Phase 7 | 部署上线（Docker + CI/CD）| ✅ |

## 测试与评估

- **后端测试**：113 个用例全通过（pytest）
- **前端测试**：30 个用例全通过（Vitest）
- **CI**：GitHub Actions 每次 push 自动跑全量测试 + AI 质量门禁
- **AI 评估基线**（实测）：

| 指标 | 初始 | 现在 |
|---|---|---|
| 意图识别准确率 | 83% | **100%** |
| RAG 召回 Recall@5 | 100% | **100%** |
| RAG 答案准确率 | 50% | **100%** |

评估框架通过数据**发现并修复了 3 处意图缺陷 + 1 处评估指标缺陷**，详见 [评估基线](07-operation/evaluation-baseline.md)。

## 演示账号

所有账号密码均为 `123456`：

| 角色 | 用户名 |
|---|---|
| 业主 | `guoyi378` |
| 物业管理员 | `mayun420` |
| 维修师傅 | `yangfei423` |

## 项目结构

```
├── frontend/            # React + Vite + Tailwind 前端（三端）
├── backend/             # FastAPI 后端（app/api、app/services、app/agents、app/models）
├── database/            # Alembic 迁移 + init 脚本
├── data/seed/           # 仿真社区数据（8 个 SQL）
├── knowledge-base/      # RAG 知识库（Markdown）
├── evaluation/          # AI 评估数据集（意图/工具/工作流/RAG）
├── docs/                # 项目文档（见下方导航）
├── nginx/               # 生产反向代理配置
├── docker-compose.yml   # 开发环境编排
└── docker-compose.prod.yml  # 生产环境编排
```

## 文档导航

| 目录 | 内容 |
|---|---|
| [00-overview](00-overview/) | 项目介绍、用户场景、愿景范围 |
| [01-product](01-product/) | PRD、产品路线图、项目状态报告 |
| [02-architecture](02-architecture/) | 系统架构、后端架构、数据库设计 |
| [03-agent](03-agent/) | Agent 系统设计、工作流 |
| [04-data-assets](04-data-assets/) | 知识库、模拟社区数据 |
| [05-engineering](05-engineering/) | 技术设计、开发计划 |
| [06-testing](06-testing/) | 测试策略、AI 评估 |
| [07-operation](07-operation/) | 部署说明、评估基线、未来路线 |
| [08-ui-design](08-ui-design/) | 角色功能规格 |
| [09-handover](09-handover/) | 团队交接 |

## License

MIT
