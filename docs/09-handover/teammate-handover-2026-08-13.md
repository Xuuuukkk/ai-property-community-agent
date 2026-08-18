# 项目交接文档

> 生成时间：2026-08-13 15:07  
> 交接人：小七  
> 接收人：项目队员  
> 仓库：`Xuuuukkk/ai-property-community-agent`  

> ⚠️ **历史快照**：本文档记录 2026-08-13 交接时状态，其中测试数（56）、RAG 召回（25%）、未实现功能等均已被后续迭代更新。**最新状态见 [docs/README.md](../README.md)**。
> 分支：`main`

---

## 一、项目概述

**AI 物业社区 Agent** —— 面向住宅小区的全栈智能助手系统，支持业主、物业、维修人员三类角色通过自然语言完成报修、查费、公告、知识问答等业务。

- 后端：FastAPI + SQLAlchemy + Alembic + PostgreSQL(pgvector) + Redis
- 前端：React 18 + Vite + TypeScript
- Agent：LangGraph + 自定义 Tools + RAG 知识库
- 部署：Docker Compose + Nginx + GitHub Actions CI/CD

---

## 二、当前完成状态

| 阶段/模块 | 状态 | 说明 |
|---|---|---|
| Phase 1 Backend Foundation | ✅ 完成 | FastAPI 骨架、Docker、PostgreSQL、Alembic |
| Phase 2 Database Models | ✅ 完成 | 10 张业务表、种子数据 |
| Phase 3 Business APIs | ✅ 完成 | 报修、费用、公告、用户 REST API |
| Phase 4 Frontend UI | ✅ 完成 | React + Vite + TypeScript 物业端后台 |
| Phase 5 AI Agent System | ✅ 完成 | LangGraph 路由、Tools、RAG 接入 |
| Phase 6 Agent Evaluation | ✅ 完成 | 轨迹表、评估数据集、指标、报告 |
| Phase 7 Deployment | ✅ 完成 | 生产 Compose、Nginx、CI/CD、日志监控、备份 |
| 真实 LLM 接入 | ✅ 完成 | 意图分类 + 回答生成，无 key 自动 fallback |
| Agent 公告意图拆分 | ✅ 完成 | `notice_query` / `notice_publish` 双意图 |
| ToC 业主端首页 | ✅ 完成 | `/owner` 路由、响应式布局、品牌设计 |

### 关键验证数据

- 后端测试：**56/56 通过**（Docker 容器内验证）
- 前端构建：**通过**，`npm audit` 0 漏洞
- CI 状态：**GitHub Actions 全绿**
- RAG 索引：22 文档 / 99 切片（`deterministic` embedding fallback）

---

## 三、本次会话新增内容

### 3.1 业主端首页

- **页面**：`frontend/src/pages/owner/OwnerHome.tsx`
- **样式**：`frontend/src/pages/owner/OwnerHome.css`
- **图标**：`frontend/src/components/owner/icons.tsx`
- **设计稿**：`docs/08-ui-design/owner-home-v3.html`
- **访问地址**：http://localhost:3000/owner

功能模块：
- 柔化深靛蓝品牌 Header + 毛玻璃用户信息卡
- AI 社区助手入口
- 快捷服务：报修、查费、公告、我的工单
- 费用概览：未缴账单 / 逾期（零值中性灰显示）
- 最近公告列表
- 移动端底部 Tab + 桌面端左侧边栏响应式布局

### 3.2 路由拆分

- **物业端**：`/admin/*` → `frontend/src/pages/admin/AdminApp.tsx`
- **业主端**：`/owner` → `OwnerHome.tsx`
- **根路径**：`/` 自动跳转 `/admin`
- 依赖：`react-router-dom` 已安装

### 3.3 Agent 公告意图拆分

- `notice` 拆分为 `notice_query`（查询公告）和 `notice_publish`（发布公告）
- 新增 `list_notices` 工具，避免"最近有什么通知"误发公告
- 相关文件：`backend/app/agents/intent.py`、`tools/notice_tools.py`、`domain_agents.py`、`graph.py`

---

## 四、代码目录结构

```
ai-property-community-agent/
├── .env.example                 # 环境变量模板
├── docker-compose.yml           # 开发环境
├── docker-compose.prod.yml      # 生产环境
├── docker-compose.monitoring.yml # 监控栈
├── HANDOFF.md                   # 持续更新的交接文档
├── backend/                     # FastAPI 后端
│   ├── app/
│   │   ├── agents/              # Agent、Tools、Graph、Evaluation
│   │   ├── api/routes/          # REST API
│   │   ├── core/                # 配置、日志、LLM、路径发现
│   │   ├── models/              # SQLAlchemy 模型
│   │   ├── services/            # 业务服务
│   │   └── main.py              # 后端入口
│   ├── tests/                   # 56 个 pytest 测试
│   └── scripts/                 # 索引、评估脚本
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/AdminApp.tsx   # 物业端
│   │   │   └── owner/OwnerHome.tsx  # 业主端首页
│   │   ├── components/
│   │   │   ├── owner/icons.tsx      # 业主端图标
│   │   │   ├── FeeList.tsx
│   │   │   ├── NoticeBoard.tsx
│   │   │   ├── RepairList.tsx
│   │   │   └── UserSearch.tsx
│   │   ├── App.tsx              # 路由入口
│   │   └── main.tsx
│   ├── package.json
│   └── nginx.conf
├── database/                    # Alembic 迁移
├── knowledge-base/              # RAG 知识库（Markdown）
├── evaluation/                  # 评估数据集
└── docs/                        # 设计文档
    ├── 01-product/              # PRD
    ├── 02-architecture/         # 数据库设计
    ├── 05-engineering/          # 技术设计
    ├── 06-testing/              # 评估方案
    ├── 07-operation/            # 部署文档
    ├── 08-ui-design/            # UI 设计稿
    └── 09-handover/             # 交接文档
```

---

## 五、环境要求

- Docker Desktop（Windows/macOS）或 Docker Engine + Docker Compose（Linux）
- Node.js 22+（本地前端开发）
- Python 3.12+（本地后端开发/测试）
- Git

---

## 六、快速启动与验证

### 6.1 首次启动

```bash
# 1. 克隆并进入仓库
git clone git@github.com:Xuuuukkk/ai-property-community-agent.git
cd ai-property-community-agent

# 2. 复制环境配置
cp .env.example .env

# 3. 启动全栈
docker compose up -d --build

# 4. 应用数据库迁移
docker compose exec backend alembic -c /app/database/alembic.ini upgrade head

# 5. 索引知识库（开发环境用 deterministic，无需下载模型）
docker compose exec backend python -m scripts.index_knowledge_base --embedding-model deterministic
```

### 6.2 访问入口

| 服务 | 地址 |
|---|---|
| 物业端后台 | http://localhost:3000/admin |
| 业主端首页 | http://localhost:3000/owner |
| 后端 API 文档 | http://localhost:8000/docs |
| 后端健康检查 | http://localhost:8000/api/health |
| Prometheus 指标 | http://localhost:8000/api/metrics |

### 6.3 测试验证

```bash
# 后端测试
cd backend
pytest tests/ -q

# 前端构建
cd ../frontend
npm run build

# 前端审计
npm audit
```

---

## 七、关键配置说明

### 7.1 环境变量

重点变量（完整列表见 `.env.example`）：

| 变量 | 说明 | 默认值 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL 连接 | 开发自动指向容器内 postgres |
| `REDIS_URL` | Redis 连接 | `redis://redis:6379/0` |
| `LLM_API_KEY` | OpenAI 兼容 API Key | 空，走规则 fallback |
| `LLM_MODEL` | LLM 模型 | `gpt-4o-mini` |
| `OPENAI_API_BASE` | API 基础地址 | `https://api.openai.com/v1` |
| `EMBEDDING_MODEL` | Embedding 模型 | `deterministic` |
| `HF_TOKEN` | HuggingFace Token | 空 |

### 7.2 真实 LLM 配置

如需接入真实 LLM，在 `.env` 中设置：

```env
LLM_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini
# 若用国内中转，修改 OPENAI_API_BASE
OPENAI_API_BASE=https://api.example.com/v1
```

---

## 八、已知问题与风险

| 问题 | 影响 | 建议处理方式 |
|---|---|---|
| Embedding 默认模型下载失败 | RAG 检索质量差（Recall@5 仅 25%） | 生产环境配置 `HF_TOKEN` 或换云端 embedding API |
| 业主端首页为静态数据 | 未连接真实 API | 开发子页面时统一接入 |
| 无权限认证系统 | 公告发布等操作开放 | 在子页面增多前引入 JWT + 角色 |
| 评估脚本写入真实数据 | 运行后数据库会新增工单/公告 | 评估后按需清理或使用独立测试数据库 |
| Windows 下 `npm run build` 偶发 safe-delete 警告 | 不影响构建结果 | 如失败，手动 `rm -rf frontend/dist` 后重试 |

---

## 九、下一步建议

按优先级排序：

1. **业主端 AI 助手聊天页**（`/owner/ai`）
   - 调用 `POST /api/agent/chat`
   - 最快形成产品闭环

2. **业主端报修页**（`/owner/repair`）
   - 调用报修相关 API
   - 参考物业端 `RepairList` 组件

3. **业主端查费页**（`/owner/fees`）
   - 调用费用 API，展示账单列表与缴费状态

4. **权限认证系统**
   - JWT + 角色（业主/物业/维修工）
   - 建议在此之后继续扩展前端子页面

5. **维修人员端**（`/worker`）
   - 今日任务、工单详情、状态更新

6. **RAG 效果提升**
   - 解决 embedding 模型问题

7. **前端测试与 E2E**
   - Vitest + Playwright

8. **镜像自动推送 / 云部署**
   - CI 中补充 `docker buildx` 推送

---

## 十、联系人

- 项目负责人：当前用户
- 交接人：小七（AI 助手）
- 仓库地址：https://github.com/Xuuuukkk/ai-property-community-agent

---

## 附录：常用命令速查

```bash
# 重建并启动后端
docker compose up -d --build backend

# 重建并启动前端
docker compose up -d --build frontend

# 查看容器日志
docker compose logs -f backend

# 进入后端容器
docker compose exec backend bash

# 运行评估
python -m scripts.run_evaluation

# 生产部署（需准备 ssl/ 证书）
docker compose -f docker-compose.prod.yml up -d --build

# 启动监控栈
docker compose -f docker-compose.monitoring.yml up -d
```
