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

**关键验证结果：**

- 后端测试：**42/42 通过**（当前 Docker 未运行，需启动后复测）
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
2. **意图分类器是规则-based**：对边缘输入会误判为 `unknown`。
3. **Agent 还没接真实 LLM**：目前决策是硬编码规则，便于测试但泛化能力有限。
4. **没有权限/认证系统**：公告发布等操作目前是开放的。

---

## 4. 下一步计划是什么

文档内 Phase 7 已完成。后续可选方向：

1. **接入真实 LLM**（OpenAI / 兼容 API），把 router 和 domain agent 从规则改为模型驱动
2. **提升 RAG 效果**：解决 embedding 模型下载，或换用云端 embedding API
3. **完善意图分类器**：补充更多训练样例或换用 LLM 分类
4. **添加权限认证**：JWT + 角色权限（业主/物业）
5. **前端测试与 E2E 测试**
6. **Docker 镜像自动推送 / 云部署**（CI/CD 目前只验证配置和构建，不推送镜像）

---

## 5. 踩过的坑绝对不要再踩

### 5.1 容器与依赖

- **改完 backend 代码必须 rebuild 容器**，否则运行的还是旧镜像：
  ```bash
  docker compose up -d --build backend
  ```
- 运行任何 `docker compose` 前，**先确认 Docker Desktop 已启动**。

### 5.2 数据库与迁移

- Alembic 配置文件在顶层 `database/alembic.ini`，`script_location = database`。
- 升级迁移命令（容器外）：
  ```bash
  alembic -c database/alembic.ini upgrade head
  ```
- 容器内升级：
  ```bash
  docker compose exec backend alembic -c /app/database/alembic.ini upgrade head
  ```
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
