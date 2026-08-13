# 交接文档 / Handoff

> 本文件写给下一个没有上下文的会话。阅读后请直接继续下一步工作。

---

## 1. 我们在做什么任务

这是一个 **AI 物业社区 Agent** 项目（仓库：`Xuuuukkk/ai-property-community-agent`）。

目标是把设计文档实现为可运行的全栈系统：业主/物业可以通过自然语言完成报修、查费、公告、知识问答等业务，Agent 通过 RAG 检索知识库并调用业务工具完成动作。

当前已按文档顺序完成 **Phase 1 ~ Phase 6**。

---

## 2. 已经完成了什么

| Phase | 内容 | 状态 |
|---|---|---|
| Phase 1 | Backend Foundation（FastAPI、SQLAlchemy、Alembic、Docker Compose） | ✅ |
| Phase 2 | Database Models（10 张业务表） | ✅ |
| Phase 3 | Business APIs（报修、费用、公告、用户） | ✅ |
| Phase 4 | Frontend UI（React + Vite + TypeScript，已外包改造） | ✅ |
| Phase 5 | AI Agent System（LangGraph 路由 + Tool + RAG 接入） | ✅ |
| Phase 6 | Agent Evaluation（轨迹表、评估数据集、指标、报告） | ✅ |
| Phase 7 | Deployment（配置管理、生产 Compose、Nginx、CI/CD、日志监控、备份） | ✅ |
| 增强 | 接入真实 LLM（意图分类 + 回答生成，无 key 时自动 fallback） | ✅ |
| 增强 | Agent 公告意图拆分为查询/发布 | ✅ |
| 增强 | ToC 业主端首页前端 | ✅ |
| 增强 | ToC 业主端 AI 助手聊天页 | ✅ |

**关键验证结果：**

- 后端测试：**56/56 通过**（已在 Docker 容器内验证）
- 前端构建通过，`npm audit` 0 漏洞
- 容器内 4 服务可正常启动
- RAG 已索引 22 文档 / 99 切片
- 评估脚本可生成 HTML/JSON 报告
- Phase 7 已补齐：`.env.example`、生产 Docker Compose、Nginx、GitHub Actions CI、日志/监控/备份
- 最新代码已 push 到 GitHub `main`

---

## 3. 当前卡在哪一步

**没有功能性阻塞。** Phase 7 Deployment 已完成，系统具备生产部署所需的最小闭环。

但仍有几个功能增强项未做（不影响部署）：

1. **RAG 语义检索效果差**：当前 embedding 用的是 `deterministic` fallback（因为 sentence-transformers 默认模型下载失败），导致 Recall@5 只有 25%。
2. **没有权限/认证系统**：公告发布等操作目前是开放的。
3. **前端测试与 E2E 测试**尚未补充。
4. **业主端子页面**尚未完全实现：已完成首页和 AI 助手聊天页，报修、查费、公告、工单列表页待做。
5. **维修人员端前端**尚未实现。

---

## 4. 下一步计划是什么

文档内 Phase 7 已完成，真实 LLM 也已接入。后续可选方向：

1. **业主端子页面**：AI 助手聊天页、报修页、查费页、公告页、工单列表页
2. **维修人员端前端**：今日任务列表、工单详情、状态更新
3. **添加权限认证**：JWT + 角色权限（业主/物业/维修工）
4. **提升 RAG 效果**：解决 embedding 模型下载，或换用云端 embedding API
5. **前端测试与 E2E 测试**
6. **Docker 镜像自动推送 / 云部署**

---

## 5. 踩过的坑绝对不要再踩

### 5.1 容器与依赖

- **改完 backend 代码必须 rebuild 容器**，否则运行的还是旧镜像：
  ```bash
  docker compose up -d --build backend
  ```
- 运行任何 `docker compose` 前，**先确认 Docker Desktop 已启动**。

### 5.2 路径与挂载

- 容器内项目根目录是 `/app`，本地是 `D:\Projects\ai-property-community-agent`。
- `knowledge-base/` 和 `evaluation/` 都已挂载到 `/app/...`，代码通过 `app.core.paths` 统一发现，不要硬编码 `parents[N]`。
- Docker 挂载可能在 `backend/` 下生成空的 `knowledge-base/` / `evaluation/` 影子目录，仓库根发现已改为检查目录非空（含 `*.md` / `*.json`）。

### 5.3 数据库与迁移

- Alembic 配置文件在顶层 `database/alembic.ini`，`script_location = database`。
- **必须在仓库根目录运行 alembic**，因为 `script_location = database` 是相对于当前工作目录解析的；在 `backend/` 下运行会找不到 `database/versions`。
  - 容器外：`alembic -c database/alembic.ini upgrade head`
  - 容器内：`docker compose exec backend alembic -c /app/database/alembic.ini upgrade head`
- CI 中曾经因 `working-directory: backend` 导致 alembic 报错 `Path doesn't exist: database`，已修复为在 migrations 步骤显式指定 `working-directory: .`。
- 种子数据导入了显式 id 后，**必须重置序列**，否则新插入会报主键冲突。已有脚本处理，不要手动乱改序列。

### 5.3 RAG / Embedding

- 默认 embedding 模型 `all-MiniLM-L6-v2` 需要联网下载；下载失败会自动 fallback 到 `deterministic`，但检索质量很差。
- 测试时统一设置 `EMBEDDING_MODEL=deterministic`。
- 生产/真实 RAG 需要：
  - 稳定的 HuggingFace 访问，或
  - 设置 `HF_TOKEN`，或
  - 换用其他 embedding API。

### 5.4 Agent 与 Trace

- Agent 的**业务操作使用自己的 `SessionLocal`**，不是 API 传进来的 `db` 会话。
- 传入 `db` 只用于**保存 trace**（`conversation` / `message` / `agent_trace`）。
- 运行评估脚本会在 dev 数据库真实创建维修工单和公告，**不会被自动回滚**。

### 5.5 测试与 curl

- 后端测试命令：
  ```bash
  cd backend
  pytest tests/ -q
  ```
- `curl` 发送中文 JSON 不要用 `-d '{...}'`，要写进文件再用 `-d @file.json`。

### 5.6 代码提交

- 这个仓库的 `.workbuddy/memory/` 是项目相关数据，**不要删除**。
- 提交前用 `git status --short` 检查，避免把本地 memory 文件误提交。

---

## 6. 快速上手命令

```bash
# 启动全栈
docker compose up -d --build

# 应用数据库迁移
docker compose exec backend alembic -c /app/database/alembic.ini upgrade head

# 索引知识库（开发/测试用 deterministic）
docker compose exec backend python -m scripts.index_knowledge_base --embedding-model deterministic

# 跑后端测试
cd backend
pytest tests/ -q

# 跑评估并生成报告
python -m scripts.run_evaluation

# 生产部署（需要 .env 和 ssl/ 证书）
docker compose -f docker-compose.prod.yml up -d --build

# 手动运行一次性备份
docker compose -f docker-compose.prod.yml --profile backup run --rm backup

# 启动可选监控栈
docker compose -f docker-compose.monitoring.yml up -d
```

---

## 7. 关键文件路径

- 设计文档：`docs/05-engineering/technical-design.md`
- 数据库设计：`docs/02-architecture/database-design.md`
- 评估方案：`docs/06-testing/ai-evaluation.md`
- 后端入口：`backend/app/main.py`
- Agent 图：`backend/app/agents/graph.py`
- 评估引擎：`backend/app/agents/evaluation/`
- 评估数据集：`evaluation/`
- 评估报告：`backend/reports/evaluation-report.html`
- 迁移脚本：`database/versions/`
- 环境模板：`.env.example`
- 生产部署：`docker-compose.prod.yml`
- Nginx 生产配置：`nginx/nginx.prod.conf`
- CI/CD：`.github/workflows/ci.yml`
- 监控：`docker-compose.monitoring.yml`
- 部署文档：`docs/07-operation/deployment.md`

---

## 8. 本次交接重点

> 由小七整理，2026-08-13。交给队员接手前必读。

### 8.1 本次会话完成的核心内容

1. **业主端首页上线**
   - 文件：`frontend/src/pages/owner/OwnerHome.tsx` + `OwnerHome.css`
   - 路由：`/owner`
   - 设计稿：`docs/08-ui-design/owner-home-v3.html`
   - 已按 UI 规范收敛色彩体系，支持移动端底部 Tab + 桌面端左侧边栏响应式布局。

2. **路由拆分**
   - 物业端：`/admin/*`（原 `App.tsx` 内容迁至 `frontend/src/pages/admin/AdminApp.tsx`）
   - 业主端：`/owner`
   - 根路径 `/` 默认跳转到 `/admin`

3. **Agent 公告意图拆分**
   - `notice` 拆为 `notice_query`（查询）和 `notice_publish`（发布）
   - 新增 `list_notices` 工具，避免误发公告

4. **CI 已全绿**
   - 修复了 alembic 工作目录、REPO_ROOT 导入等导致 Actions 失败的问题

### 8.2 当前代码状态

- 工作区：**干净**（`git status --short` 无输出）
- 最新 commit：`8339ecb docs(handoff): mark owner home page as completed and update next steps`
- 远端 `main` 已同步，可直接 `git pull`
- 后端测试：**56/56 通过**
- 前端构建：**通过**，`npm audit` 0 漏洞

### 8.3 队员接手后如何验证

```bash
# 1. 启动全栈
docker compose up -d --build

# 2. 业主端首页
open http://localhost:3000/owner

# 3. 物业端后台
open http://localhost:3000/admin

# 4. 后端健康检查
curl http://localhost:8000/api/health

# 5. 后端测试
cd backend
pytest tests/ -q

# 6. 前端构建
cd ../frontend
npm run build
```

### 8.4 建议下一步优先级

按业务闭环和依赖顺序，建议先做：

1. **业主端 AI 助手聊天页**（`/owner/ai`）—— 复用 `/api/agent/chat` 即可快速闭环
2. **业主端报修页**（`/owner/repair`）—— 调用现有报修 API
3. **业主端查费页**（`/owner/fees`）—— 调用费用 API
4. **权限认证**（JWT + 角色）—— 在子页面多起来之前引入，避免返工
5. **维修人员端**（`/worker`）—— 独立角色，依赖认证

### 8.5 需要队员注意的风险点

- **前端路由**：使用了 `BrowserRouter`，Nginx 已配置 `try_files`，直接访问 `/owner` 不会 404。
- **图标统一**：业主端所有图标来自 `frontend/src/components/owner/icons.tsx`，新增页面请复用。
- **业主端样式隔离**：业主端样式写在 `OwnerHome.css` 中，变量以 `--owner-` 为前缀，避免和 `index.css` 的物业端样式冲突。
- **API 暂未接入**：当前业主端首页数据是静态的（费用、公告），后续需连接真实 API。
- **真实 LLM 未配置**：`.env` 里 `LLM_API_KEY` 为空时自动走规则 fallback，不影响测试。
