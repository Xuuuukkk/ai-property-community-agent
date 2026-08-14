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
| Phase 4 | Frontend UI（React + Vite + TypeScript + Tailwind CSS + lucide-react，已整合 Bolt 原型） | ✅ |
| Phase 5 | AI Agent System（LangGraph 路由 + Tool + RAG 接入） | ✅ |
| Phase 6 | Agent Evaluation（轨迹表、评估数据集、指标、报告） | ✅ |
| Phase 7 | Deployment（配置管理、生产 Compose、Nginx、CI/CD、日志监控、备份） | ✅ |
| 增强 | 接入真实 LLM（意图分类 + 回答生成，无 key 时自动 fallback） | ✅ |
| 增强 | Agent 公告意图拆分为查询/发布 | ✅ |
| 增强 | ToC 业主端首页前端 | ✅ |
| 增强 | ToC 业主端 AI 助手聊天页 | ✅ |
| 增强 | 统一门户 + JWT 登录 + 角色分流（业主/维修/物业） | ✅ |
| 增强 | 统一门户 + JWT 登录 + 角色分流 | ✅ |
| 增强 | Bolt 设计原型整合进项目 frontend | ✅ |

**关键验证结果：**

- 后端测试：**61/61 通过**（已在 Docker 容器内验证）
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
2. **前端测试与 E2E 测试**尚未补充。
3. **权限颗粒度待细化**：目前只做了登录 + 角色路由守卫，业务 API 本身仍开放（未对接口做权限校验）。
4. **Docker 镜像自动推送 / 云部署**：CI 目前只验证构建，不推送镜像。

---

## 4. 下一步计划是什么

文档内 Phase 7 已完成，真实 LLM、统一登录与角色分流也已接入。后续可选方向：

1. **业务 API 权限校验**：把 `get_current_user` 接到公告发布、工单分配、费用查询等敏感接口上
2. **业主端数据接入**：当前首页/子页面多为静态数据，需接入真实 API（费用、公告、工单、报修创建）
3. **维修人员端状态流转**：WorkerDashboard 目前可接单和切状态，但缺少“我的”页面和个人信息
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

1. **统一门户 + 角色分流 + JWT 登录**
   - 入口：`/` 三端选择（业主 / 维修 / 物业）
   - 登录页：`/login`，支持角色 Tab 切换
   - 后端：`POST /api/auth/login`、`GET /api/auth/me`，JWT 7 天
   - 前端：`AuthContext` + `ProtectedRoute` 按角色守卫路由
   - 演示账号密码已统一设为 `123456`，由 `backend/scripts/import_seed_data.py` 在导入 seed 档案后自动写入 bcrypt 哈希

2. **角色与路由对应**
   - 业主 `OWNER` → `/owner`
   - 维修人员 `WORKER` → `/repair`
   - 物业人员 `PROPERTY_STAFF` / 管理员 `ADMIN` → `/management`

3. **Bolt 原型整合后的页面**
   - 启动页 `/`、`/welcome`
   - 角色选择 `/roles`
   - 登录 `/login`
   - 业主首页 `/owner`
   - 物业首页 `/management`
   - 维修首页 `/repair`
   - 样式文件：`frontend/src/index.css`（Tailwind + 自定义 CSS 变量）

4. **当前前端页面状态**
   - 首页 UI 已按 Bolt 设计实现
   - 三端首页仍为静态/占位数据，待接入后端真实 API
   - 登录已对接 `/api/auth/login`，按角色自动跳转

### 8.2 当前代码状态

- 工作区：**干净**（`git status --short` 无输出）
- 最新 commit：`fab64ec feat(frontend): replace UI with Bolt prototype, wire react-router and JWT auth`
- 远端 `main` 已同步，可直接 `git pull`
- 后端测试：**61/61 通过**
- 前端构建：**通过**

### 8.3 队员接手后如何验证

```bash
# 1. 启动全栈
docker compose up -d --build

# 2. 打开统一门户（生产镜像）
open http://localhost:3000/

# 3. 或打开 Vite 开发服务器
open http://localhost:5173/

# 4. 用演示账号登录
curl -s http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guoyi378","password":"123456"}' | python -m json.tool

# 5. 后端测试
cd backend
pytest tests/ -q

# 6. 前端构建
cd ../frontend
npm run build
```

### 8.4 建议下一步优先级

1. **业务 API 权限校验**：把 `get_current_user` 接到公告发布、工单分配、费用查询等接口
2. **业主端数据接入**：首页/子页面接入真实 API（费用、公告、工单、创建报修）
3. **维修人员端完善**：增加“我的”页面、工单详情、扫码/拍照上报
4. **提升 RAG 效果**：解决 embedding 模型下载，或换用云端 embedding API
5. **前端测试与 E2E 测试**
6. **Docker 镜像自动推送 / 云部署**

### 8.5 需要队员注意的风险点

- **前端路由**：使用了 `BrowserRouter`，Nginx 已配置 `try_files`，直接访问 `/owner` 不会 404。
- **演示密码**：seed 导入后所有用户默认密码为 `123456`，**生产环境必须替换**。
- **当前首页数据多为静态**：业主/物业/维修首页尚未完全接入真实 API，后续需逐项替换。
- **SECRET_KEY**：生产部署必须替换 `docker-compose.prod.yml` 里的 `SECRET_KEY`。
- **API 权限待细化**：目前只做了登录 + 路由角色守卫，业务接口本身仍开放。
