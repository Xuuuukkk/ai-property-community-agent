# 交接文档 / Handoff

> 本文件写给下一个没有上下文的会话。阅读后请直接继续下一步工作。
> 最后更新：2026-08-16

---

## 1. 我们在做什么任务

这是一个 **AI 物业社区 Agent** 项目（仓库：`Xuuuukkk/ai-property-community-agent`）。

**产品目标**：构建一个 AI Native 的物业社区管理平台，让业主、物业人员、维修师傅通过自然语言完成报修、查费、公告、知识问答等业务闭环。

当前已按文档顺序完成 **Phase 1 ~ Phase 7**，并补齐了统一门户、三端角色分流、AI 助手闭环、工单自动派单与双向确认等增强功能。

---

## 2. 已经完成了什么

### 2.1 技术底座

| Phase | 内容 | 状态 |
|---|---|---|
| Phase 1 | Backend Foundation（FastAPI、SQLAlchemy、Alembic、Docker Compose） | ✅ |
| Phase 2 | Database Models（10+ 业务表） | ✅ |
| Phase 3 | Business APIs（报修、费用、公告、用户、师傅） | ✅ |
| Phase 4 | Frontend UI（React + Vite + TS + Tailwind CSS + lucide-react，已整合 Bolt 原型） | ✅ |
| Phase 5 | AI Agent System（LangGraph 路由 + Tool + RAG 接入） | ✅ |
| Phase 6 | Agent Evaluation（轨迹表、评估数据集、指标、报告） | ✅ |
| Phase 7 | Deployment（Docker Compose、Nginx、CI/CD、监控、备份） | ✅ |

### 2.2 产品功能

**业主端（ToC）**

- 统一门户 + JWT 登录 + 角色分流
- 业主首页：真实费用、公告、工单数据
- 子页面：费用查询、我的工单、社区公告、服务入口、AI 助手、我的
- AI 助手多轮对话报修，自动派单，图片上传
- 工单双向确认（业主 + 师傅都确认后才关闭）

**物业端（ToB）**

- 物业首页：工单统计
- 工单管理：查看、派单、改派（下拉选择师傅）
- 公告管理：发布公告、列表、详情展开
- 用户管理：真实用户列表、角色筛选
- 我的页面

**维修端（ToB）**

- 维修首页：今日待办、任务完成度
- 工单列表：接单、开始、完成、确认
- 我的页面

**AI Agent**

- 意图识别：报修、查费、公告查询、公告发布、知识问答
- Repair Agent：多轮收集故障信息、自动派单
- Fee Agent：查询费用/欠费
- Notice Agent：查询公告、发布公告
- Knowledge Agent：基于知识库 RAG 问答

### 2.3 关键验证结果

- 后端测试：**71/71 通过**，GitHub Actions CI 全绿
- 前端测试：**19/19 通过**（Vitest + React Testing Library）
- 前端构建通过，`npm audit` 0 漏洞
- Docker 服务：property-frontend / backend / postgres / redis 全部运行
- 用户数据：275 个账号（200 业主、50 物业、15 维修、10 管理员），演示密码 `123456`（`backend/scripts/set_demo_passwords.py`）
- 知识库：22 文档 / 99 切片，使用智谱 `embedding-3`（1024 维）
- LLM：智谱 `glm-4-flash`（`OPENAI_API_BASE=https://open.bigmodel.cn/api/paas/v4/`）
- 评估脚本可生成 HTML/JSON 报告
- 最新代码已 push 到 GitHub `main`（`b2fa209`）

### 2.4 2026-08-15 新增修复（AI 体验攻坚已完成）

- **接入真实 LLM**：智谱 `glm-4-flash` + `embedding-3`（1024 维），`.env` 本地配置（gitignored）
- **意图分类**：改为规则优先、LLM 仅兜底 unknown，避免"停电动车"误判为"停电通知"
- **Notice / Knowledge Agent**：LLM 可用时生成自然语言回答，否则降级规则模板
- **Repair Agent 三处修复**：
  1. 回显"我家"→"您家"，避免 AI 把自己当业主
  2. `collect_description` 完成即建单并同轮返回师傅信息（原逻辑要第 4 轮 confirm 才建单，文案却提前承诺，导致业主永远等不到师傅信息）
  3. 派单从"id 最小优先"改为"未完成工单数最少优先"，不再总派给杨飞
- **测试基础设施**：独立 `property_agent_test` 数据库 + 序列重置 + 384 维列改造，修复 CI 维度不匹配（`test_evaluation.py` 改用模块引用 `SessionLocal`）

### 2.5 2026-08-16 新增（工程加固已完成）

- **API 角色权限校验（RBAC）**：`security.py` 新增 `require_roles(*roles)` 依赖，全部业务接口接入认证+授权：
  - users/workers 列表仅 ADMIN/PROPERTY_STAFF；fee 业主只能查自己；repair 业主/师傅数据隔离、assign 仅 staff、confirm 校验工单归属；notices 发布仅 staff；agent/chat 需登录且业主/师傅强制以自己身份；knowledge reindex 仅 ADMIN
  - 测试新增 `auth_headers(user_id, role)` helper，补 10 个 401/403 拒绝场景，后端 71 passed
- **前端单元测试**：引入 Vitest + React Testing Library，覆盖 ProtectedRoute 权限守卫、common 展示组件、client token 管理，19 passed，CI frontend job 已加 `npm test`
- **生产安全配置**：`config.py` 加 model_validator（生产环境 SECRET_KEY 缺失/弱/占位符即拒绝启动）；`set_demo_passwords.py` 生产保护（需 `--force`）；新增 `.env.production.example`（强密码占位 + 带密码 Redis URL + 智谱配置）
- **CI/CD 推镜像**：`.github/workflows/docker-publish.yml` 构建并推送 backend/frontend 到 GHCR；`docker-compose.prod.yml` 加 image 字段支持 `docker compose pull` 部署

---

## 3. 当前卡在哪一步 / 核心问题

### 3.1 ✅ AI 体验（已完成）

LLM 已接入，Notice/Knowledge/Repair Agent 均能生成自然语言回答，意图分类规则优先 + LLM 兜底。

### 3.2 ✅ RAG 检索质量（已完成）

embedding 从 `deterministic` fallback 换成智谱 `embedding-3`（1024 维），知识库已用真实语义向量重新索引。

### 3.3 ✅ API 权限校验（已完成）

全部业务接口已接入角色认证+授权，见 2.5。

### 3.4 ✅ 前端单元测试（已完成）

Vitest 单元测试已就位并接入 CI，见 2.5。

### 3.5 ✅ 生产安全配置（已完成）

SECRET_KEY 生产强制校验、`set_demo_passwords.py` 生产保护、`.env.production.example` 已就位，见 2.5。

### 3.6 ✅ CI/CD 推送镜像（已完成）

`.github/workflows/docker-publish.yml` 构建并推送 backend/frontend 镜像到 GHCR，`docker-compose.prod.yml` 加 image 字段支持 pull 部署，见 2.5。

### 3.7 待完善项（下一步）

- 前端 E2E 测试（Playwright）缺失
- 知识库内容覆盖度有限（部分问题如具体垃圾清运时间仍检索不到）

---

## 4. 下一步计划是什么

当前 AI 体验、RAG 质量、API 权限、前端单测、生产安全配置、CI 推镜像均已完成。剩余上线准备：

### 阶段三（剩余）：工程加固

1. **前端 E2E 测试**：Playwright 覆盖核心用户路径（登录→报修→派单）

### 阶段四：上线准备

1. **云服务器部署**：申请云主机，安装 Docker，配置生产环境
2. **HTTPS 配置**：申请证书（certbot），Nginx 强制 HTTPS
3. **监控告警**：容器健康检查、日志采集、资源告警（Prometheus + Grafana 或轻量方案）
4. **数据备份**：PostgreSQL 定时备份 + 恢复演练
5. **知识库内容补全**：补充垃圾清运时间等常见业主问题的知识文档，重刷索引

---

## 5. 踩过的坑绝对不要再踩

### 5.1 容器与依赖

- **改完 backend 代码必须 rebuild 容器**，否则运行的还是旧镜像：
  ```bash
  docker compose up -d --build backend
  ```
- 运行任何 `docker compose` 前，**先确认 Docker Desktop 已启动**。
- 前端容器如果缓存旧代码，用 `--no-cache` 重建：
  ```bash
  docker compose build --no-cache frontend && docker compose up -d frontend
  ```

### 5.2 路径与挂载

- 容器内项目根目录是 `/app`，本地是 `D:\Projects\ai-property-community-agent`。
- `knowledge-base/` 和 `evaluation/` 都已挂载到 `/app/...`，代码通过 `app.core.paths` 统一发现，不要硬编码 `parents[N]`。

### 5.3 数据库与迁移

- Alembic 配置文件在顶层 `database/alembic.ini`，`script_location = database`。
- **必须在仓库根目录运行 alembic**：
  - 容器外：`alembic -c database/alembic.ini upgrade head`
  - 容器内：`docker compose exec backend alembic -c /app/database/alembic.ini upgrade head`
- 种子数据导入了显式 id 后，**必须重置序列**，否则新插入会报主键冲突。
- 修改模型字段后，记得同时更新 Alembic 迁移文件，否则 CI 会失败。

### 5.4 RAG / Embedding

- 默认 embedding 模型 `all-MiniLM-L6-v2` 需要联网下载；下载失败会自动 fallback 到 `deterministic`，但检索质量很差。
- 测试时统一设置 `EMBEDDING_MODEL=deterministic`。
- 生产/真实 RAG 需要：稳定的 HuggingFace 访问、或 `HF_TOKEN`、或换用云端 embedding API。

### 5.5 Agent 与 Trace

- Agent 的**业务操作使用自己的 `SessionLocal`**，不是 API 传进来的 `db` 会话。
- 传入 `db` 只用于**保存 trace**（`conversation` / `message` / `agent_trace`）。
- 运行评估脚本会在 dev 数据库真实创建维修工单和公告，**不会被自动回滚**。

### 5.6 测试与 curl

- 后端测试命令：
  ```bash
  cd backend && pytest tests/ -q
  ```
- 前端测试命令：
  ```bash
  cd frontend && npm test
  ```
- `curl` 发送中文 JSON 不要直接用 `-d '{...}'`，要写进文件再用 `-d @file.json`。
- 后端测试的 `auth_headers(user_id, role)` helper 在 `tests/conftest.py`，角色 id 段：OWNER 1-200，ADMIN 201-210，WORKER 211-225，PROPERTY_STAFF 226-275。

### 5.7 代码提交

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
cd backend && pytest tests/ -q

# 跑前端测试
cd frontend && npm test

# 跑前端构建
cd ../frontend && npm run build

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

- 产品经理汇报：`docs/01-product/project-status-report-2026-08-14.md`
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

### 8.1 最新核心进展

1. **AI 助手闭环报修**
   - 业主说"我要报修" → Agent 多轮收集物品/描述/图片 → 自动派单 → 返回师傅联系方式
   - 工单需业主和师傅双方都确认才关闭
   - 涉及文件：`backend/app/agents/domain_agents.py`、`tools/repair_tools.py`、`models/repair_order.py`

2. **三端首页与功能页**
   - 业主端：`/owner/*` 子页面全部接入真实 API
   - 物业端：`/management/*` 工单、公告、用户管理接入真实数据
   - 维修端：`/repair/*` 工单列表、今日统计接入真实数据

3. **数据汉化**
   - 工作人员信息（姓名、部门、职位、技能、状态）已改为中文
   - 业主姓名从拼音转为中文
   - 涉及文件：`data/seed/workers.sql`、`data/seed/users.sql`

4. **物业派单优化**
   - 新增 `/api/workers` 接口
   - 物业端工单派单从"硬编码杨飞"改为下拉选择所有在岗工程部师傅

### 8.2 当前代码状态

- 工作区：**干净**
- 最新 commit：`6d835fe`
- 远端 `main` 已同步
- 后端测试：**61/61 通过**
- 前端构建：**通过**

### 8.3 队员接手后如何验证

```bash
# 1. 启动全栈
docker compose up -d --build

# 2. 打开统一门户
open http://localhost:3000/

# 3. 用演示账号登录（密码 123456）
# 业主：guoyi378
# 物业：linzhe917
# 维修：yangfei423
# 管理员：mayun420

# 4. 后端测试
cd backend && pytest tests/ -q

# 5. 前端构建
cd ../frontend && npm run build
```

### 8.4 建议下一步优先级

1. **接入真实 LLM**：这是当前体验瓶颈，没有 LLM 生成，RAG 和公告查询都只会硬拼结果
2. **RAG 语义 Embedding**：提升知识库检索召回率
3. **API 权限校验**：敏感接口增加权限验证
4. **前端测试与 E2E 测试**
5. **Docker 镜像自动推送 / 云部署**

### 8.5 需要队员注意的风险点

- **LLM_API_KEY 当前为空**：Agent 走规则路径，AI 体验受限
- **前端路由**：使用了 `BrowserRouter`，Nginx 已配置 `try_files`
- **演示密码**：所有用户默认密码为 `123456`，**生产环境必须替换**
- **SECRET_KEY**：生产部署必须替换
- **API 权限待细化**：目前只做了登录 + 路由角色守卫
