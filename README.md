# AI 物业社区智能体（AI Property Community Agent）

> AI 驱动的物业社区管理智能体平台 —— 用 LLM + Agent 架构 + RAG 知识库，重构传统物业管理的 AI Native 系统。

[![CI](https://github.com/Xuuuukkk/ai-property-community-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/Xuuuukkk/ai-property-community-agent/actions/workflows/ci.yml)

## 项目简介

AI Property Community Agent 面向真实物业社区场景，构建一个具备**自然语言理解、业务流程执行、社区知识查询、多角色协同**能力的智能物业管理系统。

区别于传统物业软件「加一个聊天机器人」的思路，本项目通过 **LLM + Agent 架构 + 业务系统 + RAG 知识库 + 仿真社区数据**，让 AI 真正参与到物业业务流程中——不仅能回答问题，还能**创建工单、自动派单、巡检识别、分析数据、生成报告**。

## 核心特性

- **AI 助手（多意图 Agent）**：对话式完成报修、查费、查公告、知识咨询，支持多轮补全信息
- **RAG 知识检索**：pgvector 向量化检索物业「隐性知识」（施工时间、装修规定、停车规则等）
- **报修闭环**：业主报修 → 技能+在岗自动派单 → 维修工处理 → 双方确认完成
- **AI 巡检**：摄像头抓拍 → 视觉模型识别异常（垃圾堆积、消防堵塞等）→ 实时告警通知
- **业主上报**：随手拍问题 → 自动派单给片区负责人 → 答复反馈
- **数据统计与洞察**：工单/费用/巡检/上报多维度看板 + LLM 生成的运营洞察报告
- **消息通知**：派单、完成、答复、巡检异常全链路实时通知相关角色
- **反馈闭环**：AI 对话点赞/纠错 → 沉淀知识缺口 → 人工审核 → 自动写入知识库（自我进化）
- **数据自维护**：定时清理过期可观测数据 + 孤儿文件
- **三端角色**：业主端 / 物业端 / 维修端，JWT 鉴权 + 角色路由

## 技术架构

| 层 | 技术栈 |
|---|---|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS（PWA 支持） |
| 后端 | FastAPI + SQLAlchemy 2.0 + LangGraph（Agent 编排） |
| AI | 智谱 GLM-4-Flash（对话）+ embedding-3（1024 维向量化） |
| 数据库 | PostgreSQL 16 + pgvector（向量检索） |
| 缓存 | Redis |
| 可观测 | Prometheus 指标 + Agent 调用链追踪 |
| 部署 | Docker Compose + Nginx（SSL）+ GitHub Actions CI/CD |

**分层架构**：`AI Agent 层（意图分类/领域 Agent/工具）→ 业务 Service 层 → Repository 层 → 数据平台（PG + pgvector + Redis）`

## 三端角色

| 端 | 用户 | 核心功能 |
|---|---|---|
| 业主端 | 小区业主 | AI 助手、报修、费用查询、公告、问题上报、消息通知 |
| 物业端 | 物业管理员/客服 | 工单管理、公告发布、巡检管理、数据看板、知识缺口审核 |
| 维修端 | 维修师傅 | 接单/处理工单、巡检任务、消息通知 |

## 快速开始

### 方式一：Docker Compose（推荐）

```bash
git clone https://github.com/Xuuuukkk/ai-property-community-agent.git
cd ai-property-community-agent
cp .env.example .env   # 填入 LLM_API_KEY 等配置
docker compose up -d --build

# 导入种子数据 + 索引知识库（首次）
docker compose exec backend python scripts/import_seed_data.py
docker compose exec backend python -m scripts.index_knowledge_base --embedding-model deterministic
```

访问：前端 http://localhost:3000 · 后端 API http://localhost:8000/docs

### 方式二：本地开发

```bash
# 后端（需先启动 PostgreSQL + Redis）
cd backend
pip install -r requirements.txt
alembic -c ../database/alembic.ini upgrade head
python scripts/import_seed_data.py
uvicorn app.main:app --reload --port 8000

# 前端
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev   # http://localhost:5173
```

## 演示账号

所有账号密码均为 `123456`：

| 角色 | 用户名 | 说明 |
|---|---|---|
| 业主 | `guoyi378` | 郭毅（体验报修/缴费/AI 助手） |
| 物业管理员 | `mayun420` | 马云（体验工单/公告/数据看板） |
| 维修师傅 | `yangfei423` | 杨飞（体验接单/处理） |

## 目录结构

```
├── backend/            # FastAPI 后端（Agent + 业务 + RAG）
│   ├── app/
│   │   ├── agents/     # LangGraph Agent、意图分类、领域 Agent、评估框架
│   │   ├── api/        # REST 路由
│   │   ├── services/   # 业务逻辑（报修/巡检/上报/通知/知识库...）
│   │   ├── models/     # SQLAlchemy ORM 模型
│   │   └── core/       # 配置、鉴权、调度器、日志
│   └── tests/          # pytest 测试套件
├── frontend/           # React + Vite + Tailwind 前端（三端）
├── database/           # Alembic 迁移 + 数据目录
├── data/seed/          # 仿真社区数据（社区/楼栋/房屋/用户/工单/账单/公告）
├── knowledge-base/     # RAG 知识库（Markdown）
├── evaluation/         # 评估数据集（意图/工具/工作流/RAG）
├── docs/               # 项目文档（架构/产品/设计/部署）
├── nginx/              # 生产反向代理配置
├── docker-compose.yml  # 开发环境编排
└── docker-compose.prod.yml  # 生产环境编排（SSL/备份/监控）
```

## 测试与质量

```bash
cd backend && pytest tests/ -q        # 后端单元/集成测试
cd frontend && npm test               # 前端组件测试
cd backend && python -m app.agents.evaluation   # AI 评估（意图/工具/RAG 准确率）
```

- 后端 100+ 测试用例，CI 每次提交自动运行（含 AI 质量门禁：意图识别 ≥90%）
- AI 评估基线：意图识别 100%、RAG 召回 Recall@5 100%、RAG 答案准确率 100%

## 部署

生产环境支持一键部署（自动迁移 + 健康检查 + 备份 + 监控），详见 [部署文档](docs/07-operation/deployment.md)。

```bash
cp .env.production.example .env   # 配置生产环境变量 + SSL 证书
./deploy.sh
```

## 文档导航

- [项目介绍](docs/00-overview/project-introduction.md)
- [系统架构](docs/02-architecture/system-architecture.md)
- [数据库设计](docs/02-architecture/database-design.md)
- [部署说明](docs/07-operation/deployment.md)
- [评估基线](docs/07-operation/evaluation-baseline.md)

## License

MIT
