# Technical Design V2.1
# AI物业社区智能体技术设计

> AI Property Community Agent  
> Engineering Technical Specification

Version: V2.1

---

# 1. Technical Overview
# 技术架构概览

系统采用：

- 前后端分离架构
- AI Agent架构
- RAG知识增强架构
- PostgreSQL统一数据架构（业务数据 + pgvector向量检索）

整体目标：

构建一个：

> AI驱动、数据驱动、可验证的物业社区智能体平台。

整体结构：

```
                    Users
                     │
              Frontend Application
                     │
                 API Gateway
                     │
              Backend Application
        ┌────────────┼────────────┐
        │            │            │
   Business       Agent       Knowledge
   Service        Layer        Layer
        │            │            │
        └────────────┼────────────┘
                     │
              PostgreSQL Data Layer
        ┌────────────┴────────────┐
        │                         │
 Business Tables              pgvector
 User                          Documents
 House                         Embeddings
 Repair                        Knowledge
 Fee
 Notice
```

---

# 2. Recommended Tech Stack
# 技术栈设计

## 2.1 Frontend

推荐：

```
React + TypeScript + Tailwind CSS
```

职责：

- 用户交互
- AI Chat界面
- 工单管理
- 数据展示

未来支持：

- 微信小程序
- 移动端应用

---

## 2.2 Backend

推荐：

```
Python 3.12+ + FastAPI + SQLAlchemy 2.0 + Alembic + Pydantic
```

职责：

- REST API
- 业务逻辑
- 权限管理
- 数据访问
- Agent接口

---

## 2.3 Database

核心数据库：

```
PostgreSQL 16
```

负责存储：

业务数据：

| 表名 | 用途 |
|-|-|
| community | 小区基础信息 |
| building | 楼栋信息 |
| house | 房屋信息 |
| user | 用户/业主/员工 |
| house_binding | 房屋绑定关系 |
| worker | 物业员工信息 |
| repair_order | 报修工单 |
| repair_record | 维修过程记录 |
| fee_bill | 物业费用账单 |
| notice | 物业公告 |
| conversation | AI对话记录 |
| message | 对话消息 |
| agent_trace | Agent执行轨迹 |

详细表结构参见：

```
docs/02-architecture/database-design.md
```

---

## 2.4 Vector Storage

采用：

```
PostgreSQL + pgvector
```

用途：

存储：

- 文档Embedding
- 知识向量
- RAG索引

MVP阶段：

不额外引入独立Vector Database，业务数据与向量检索统一在PostgreSQL内完成。

未来：

可根据规模迁移：

- Milvus
- Weaviate

---

## 2.5 Cache

```
Redis
```

用途：

- Session
- Chat Memory
- Temporary State
- Queue

---

## 2.6 AI Layer

Agent Framework:

```
LangGraph
```

用途：

- Agent Workflow
- State Management
- Tool Calling
- Multi Agent Orchestration

---

# 3. Repository Structure
# 项目目录设计

实际项目结构：

```
AI-Property-Community-Agent/
├── ai-agent/              # Agent运行时（LangGraph graphs/tools/prompts）
├── backend/               # 后端服务（FastAPI + SQLAlchemy）
│   └── app/
│       ├── api/routes/    # API路由
│       ├── services/      # 业务服务层
│       ├── repositories/  # 数据访问层
│       ├── models/        # SQLAlchemy数据模型
│       ├── schemas/       # Pydantic请求/响应模型
│       ├── core/          # 配置/安全/数据库连接
│       └── main.py        # 应用入口
├── data/
│   └── seed/              # 8个PostgreSQL种子SQL文件
├── database/              # 数据库迁移脚本（Alembic）
├── docs/                  # 项目文档（9个分类目录）
│   ├── 00-overview/       # 项目概述
│   ├── 01-product/        # 产品需求
│   ├── 02-architecture/   # 架构设计
│   ├── 03-agent/          # Agent设计
│   ├── 04-data-assets/    # 数据资产
│   ├── 05-engineering/    # 工程规范
│   ├── 06-testing/        # 测试策略
│   └── 07-operation/     # 部署运维
├── frontend/              # 前端应用（React + TypeScript）
├── knowledge-base/        # RAG知识库源文档
│   ├── community-rules/   # 社区规则
│   ├── decoration/        # 装修规范
│   ├── faq/               # 常见问题
│   ├── parking/           # 停车管理
│   └── property-service/  # 物业服务
├── scripts/              # 工具脚本（种子数据生成等）
├── tests/                 # 测试代码
├── LICENSE
└── README.md
```

---

# 4. Backend Architecture
# 后端架构设计

采用分层架构：

```
API Layer
     ↓
Service Layer
     ↓
Repository Layer
     ↓
Database
```

---

目录：

```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── community.py
│   │   ├── repair.py
│   │   ├── fee.py
│   │   └── notice.py
│   ├── services/
│   │   ├── user_service.py
│   │   ├── repair_service.py
│   │   ├── fee_service.py
│   │   └── notice_service.py
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── repair_repository.py
│   │   └── fee_repository.py
│   ├── models/
│   │   ├── user.py
│   │   ├── house.py
│   │   ├── repair.py
│   │   └── notice.py
│   ├── schemas/
│   │   ├── user_schema.py
│   │   ├── repair_schema.py
│   │   └── notice_schema.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   └── main.py
```

详细后端架构参见：

```
docs/02-architecture/backend-architecture.md
```

---

# 5. Database Design Rules
# 数据库设计规范

数据库修改流程：

```
Model Change
     ↓
Alembic Migration
     ↓
Database Update
     ↓
Seed Update
```

禁止：

```
直接修改生产数据库
```

详细表结构、字段定义、索引设计参见：

```
docs/02-architecture/database-design.md
```

核心表清单：

| 表名 | 核心字段 | 说明 |
|-|-|-|
| community | name, name_en, address, built_year, building_count, total_households, parking_spaces, property_company | 小区基础信息 |
| building | community_id, building_no, floors, unit_count, elevator_config | 楼栋信息 |
| house | building_id, room_no, unit_no, floor_no, area, house_type, status | 房屋信息 |
| user | username, real_name, phone, password_hash, role | 用户/业主/员工 |
| house_binding | user_id, house_id, relation | 房屋绑定关系 |
| worker | user_id, department, position, skill_type, status, hire_date | 物业员工 |
| repair_order | order_no, user_id, house_id, worker_id, type, description, urgency, status, cost, created_at, completed_at | 报修工单 |
| repair_record | repair_id, content, image_url, created_at | 维修过程记录 |
| fee_bill | house_id, user_id, bill_type, period, amount, status, due_date, paid_at | 物业费用账单 |
| notice | title, content, publisher_id, notice_type, is_pinned, status, created_at | 物业公告 |

---

# 6. Backend Module Design
# 后端模块设计

## User Module

负责：

- 用户信息
- 身份认证
- 用户角色

---

## Community Module

负责：

- 小区
- 楼栋
- 房屋

---

## Repair Module

负责：

- 创建工单
- 工单分配
- 状态流转

状态：

```
CREATED → ASSIGNED → ACCEPTED → PROCESSING → COMPLETED → CLOSED
```

工单类型：

```
water_leak          厨卫漏水
elevator_fault      电梯故障
access_control      门禁损坏
power_trip          水电跳闸
wall_seepage        墙面渗水
public_facility     公共设施损坏
```

---

## Fee Module

负责：

- 物业费
- 缴费状态
- 账单查询

账单类型：

```
property_fee        物业费（2.8元/㎡/月）
parking_fee         车位租赁费
utility_fee         公摊水电费
maintenance_fee    专项维修费
```

账单状态：

```
PAID        已缴费
UNPAID      未缴费
OVERDUE     逾期欠费
```

---

## Notice Module

负责：

- 公告创建
- 公告发布
- 公告查询

公告类型：

```
water_power_outage    停水停电通知
elevator_maintenance  电梯维保
fire_inspection       消防巡检
community_activity    社区活动
public_revenue        公共收益公示
committee_notice      业委会通知
weather_alert         气象温馨提示
facility_notice       设施公告
```

公告状态：

```
DRAFT        草稿
PUBLISHED    已发布
ARCHIVED     已归档
```

---

# 7. API Design Specification
# API设计规范

采用：

RESTful API。

---

## User

```
GET  /api/users/{id}          获取用户信息
GET  /api/user/profile         获取当前用户Profile
POST /api/auth/login           用户登录
```

---

## Repair

创建：

```
POST /api/repair               创建报修工单
```

查询：

```
GET  /api/repair/{id}          查询单条工单
GET  /api/repair/list          查询工单列表
PUT  /api/repair/{id}/status   更新工单状态
```

---

## Fee

```
GET  /api/fee/{user_id}        查询用户费用账单
```

---

## Notice

查询：

```
GET  /api/notices              查询公告列表
```

创建：

```
POST /api/notices              创建公告
```

---

# 8. Agent Layer Design
# Agent层设计

目录：

```
ai-agent/
├── runtime/          # Agent初始化、状态管理、执行生命周期
├── graphs/           # LangGraph图定义
├── tools/            # Agent工具（统一业务调用入口）
├── prompts/          # Prompt模板管理
├── memory/           # 对话记忆/用户记忆/知识记忆
└── evaluation/       # Agent评估
```

详细Agent设计参见：

```
docs/03-agent/agent-system-design.md
docs/03-agent/agent-workflow.md
```

---

## 8.1 Runtime

负责：

- Agent初始化
- 状态管理
- 执行生命周期

---

## 8.2 Graphs

包含：

```
router_graph        路由图（意图识别 → Agent分发）
repair_graph        报修工单图
knowledge_graph     知识问答图
notice_graph        公告生成图
```

---

## 8.3 Tools

Agent禁止直接访问数据库。

统一通过Tool：

```
create_repair_order()     创建报修工单
query_repair_order()      查询工单
assign_worker()           分配维修人员
update_repair_status()    更新工单状态
query_house_fee()         查询房屋费用
query_payment_status()    查询缴费状态
search_knowledge()        知识库检索
generate_notice()         生成公告草稿
publish_notice()          发布公告
```

调用链：

```
Agent → Tool → Service → Repository → Database
```

---

## 8.4 Prompts

统一管理：

```
prompts/
├── router_prompt.md          路由意图分类
├── repair_agent_prompt.md   报修业务流程
├── knowledge_agent_prompt.md 知识问答约束
└── notice_agent_prompt.md   公告生成规范
```

---

# 9. Agent Observability
# Agent运行追踪

所有Agent行为需要记录。

记录：

```
User Input
     ↓
Intent Decision
     ↓
Agent Selection
     ↓
Tool Calling
     ↓
Final Response
```

存储：

```
agent_trace表（PostgreSQL）
```

用于：

- Debug
- Evaluation
- Prompt优化

---

# 10. Data Flow Design
# 数据流设计

## Normal Business Flow

```
Frontend → API → Service → Repository → PostgreSQL
```

---

## AI Flow

```
Frontend → Chat API → Agent Runtime → Tool → Business Service → Database → Response
```

---

## RAG Flow

```
User Question → Knowledge Agent → Retriever → pgvector → Relevant Documents → LLM → Answer
```

---

# 11. Knowledge Pipeline
# 知识库处理流程

知识来源目录：

```
knowledge-base/
├── community-rules/     社区规则（业主公约、管理制度）
├── decoration/          装修规范
├── faq/                 常见问题
├── parking/             停车管理
└── property-service/    物业服务标准
```

处理流程：

```
Official Documents (Markdown)
     ↓
Cleaning
     ↓
Chunking (300-800 tokens, 50-100 overlap)
     ↓
Embedding
     ↓
pgvector (knowledge_document + knowledge_chunk)
     ↓
Retriever
     ↓
Knowledge Agent
```

详细知识库设计参见：

```
docs/04-data-assets/knowledge-base.md
```

---

# 12. Authentication Design
# 权限设计

角色：

```
OWNER              业主
PROPERTY_STAFF     物业管理员
WORKER             维修人员
ADMIN              系统管理员
```

权限：

| 角色 | 权限 |
|-|-|
| OWNER | 报修、查询费用、查看公告 |
| PROPERTY_STAFF | 工单管理、公告管理、费用管理 |
| WORKER | 维修任务处理、工单状态更新 |
| ADMIN | 系统管理、用户管理、全部权限 |

---

# 13. Configuration Management
# 配置管理

配置：

```
.env
```

内容：

```env
# Database
DATABASE_URL=postgresql://admin:password@localhost:5432/property_agent

# Redis
REDIS_URL=redis://localhost:6379

# AI
OPENAI_API_BASE=https://open.bigmodel.cn/api/paas/v4/
LLM_API_KEY=<你的智谱API Key>
LLM_MODEL=glm-4-flash
EMBEDDING_MODEL=embedding-3
EMBEDDING_DIMENSION=1024
```

注意：

不设 `VECTOR_DB_URL`，向量检索由 pgvector 在 PostgreSQL 内完成，无需独立向量数据库。

---

# 14. Logging Design
# 日志设计

Backend记录：

```
API Request
Error
Business Event
```

Agent记录：

```
Input
Decision
Tool Call
Output
Latency
```

---

# 15. Testing Requirements
# 测试要求

## Backend

```
Unit Test       单元测试（Service层）
API Test        接口测试（FastAPI TestClient）
```

---

## Agent

```
Workflow Test   工作流测试（Graph执行路径）
Tool Test       工具测试（输入/输出校验）
Evaluation Test 评估测试（意图准确率、工具调用准确率）
```

---

## RAG

```
Retrieval Test          检索测试（召回率、准确率）
Answer Accuracy Test    答案准确性测试
```

详细测试策略参见：

```
docs/06-testing/testing-strategy.md
docs/06-testing/ai-evaluation.md
```

---

# 16. Deployment Architecture
# 部署架构

Docker Compose:

```yaml
services:
  frontend:      # React前端
  backend:       # FastAPI后端（含Agent Runtime）
  postgres:      # PostgreSQL 16 + pgvector
  redis:         # Redis缓存
```

PostgreSQL包含：

```
Business Database       业务数据表
+ pgvector Extension    向量索引
```

注意：

不部署独立 Vector Database 服务，pgvector 作为 PostgreSQL 扩展运行在同一个 postgres 容器内。

详细部署说明参见：

```
docs/07-operation/deployment.md
```

---

# 17. Seed Data
# 种子数据

种子SQL文件位于：

```
data/seed/
```

共8个PostgreSQL种子文件，基于云溪花园小区固定背景生成：

| 文件 | 数据表 | 记录数 | 说明 |
|-|-|-|-|
| community.sql | community | 1 | 云溪花园小区基础信息 |
| buildings.sql | building | 8 | 1号楼~8号楼，26层，2单元 |
| houses.sql | house | 1664 | 8栋×2单元×26层×4户，89-143㎡ |
| users.sql | user + house_binding | 200+200 | 200户抽样业主 + 房屋绑定 |
| workers.sql | user + worker | 75+75 | 10管理员+15维修+20保洁+30安保 |
| repair_orders.sql | repair_order | 50 | 6种故障类型，5种状态 |
| fee_bills.sql | fee_bill | 746 | 物业费/车位/公摊水电/专项维修 |
| notices.sql | notice | 24 | 8种公告类型，5条置顶 |

云溪花园小区固定参数：

| 项目 | 数据 |
|-|-|
| 小区名称 | 云溪花园小区（Yunxi Garden Community） |
| 建成年份 | 2018年 |
| 详细地址 | 上海市浦东新区张江路1268号 |
| 楼栋总数 | 8栋高层住宅楼 |
| 总户数 | 1200户 |
| 地下停车位 | 800个 |
| 物业服务公司 | 云溪物业服务有限公司 |
| 物业费标准 | 2.8元/㎡/月 |

ID关联规划：

```
community(1)
  → building(1-8)
    → house(1-1664)

user 业主(1-200) ── house_binding ──→ house(已绑定200套)
user 员工(201-275) → worker(1-75)
  ├─ 管理员 worker(1-10)    ← notice.publisher_id
  ├─ 维修工 worker(11-25)   ← repair_order.worker_id
  ├─ 保洁   worker(26-45)
  └─ 安保   worker(46-75)

repair_order → user_id(业主1-200) + house_id(1-1664) + worker_id(维修工11-25)
fee_bill → house_id(1-1664) + user_id(业主1-200)
```

种子数据生成脚本：

```
scripts/generate_seed_data.py
```

---

# 18. Codex Implementation Rules
# Codex实现约束

## Rule 1

严格模块化。

新增功能必须包含：

```
Database Model
     ↓
Alembic Migration
     ↓
Service
     ↓
API
     ↓
Test
     ↓
Documentation
```

---

## Rule 2

Agent与业务系统分离。

禁止：

```
Agent → SQL
```

正确：

```
Agent → Tool → Service → Database
```

---

## Rule 3

每个功能必须：

- 可运行
- 可测试
- 可验证

---

## Rule 4

优先实现顺序：

```
Database
  ↓
Backend API
  ↓
Frontend
  ↓
Agent
  ↓
RAG
  ↓
Evaluation
```

---

# Summary
# 总结

最终技术架构：

```
React + TypeScript + Tailwind CSS
               ↓
FastAPI + SQLAlchemy 2.0 + Alembic + Pydantic
               ↓
LangGraph Agent Runtime
               ↓
Business Services (Tool → Service → Repository)
               ↓
PostgreSQL 16 + pgvector
               ↓
Docker Deployment (frontend + backend + postgres + redis)
```

设计目标：

构建一个：

- 可维护
- 可扩展
- 可测试
- AI Native

的物业社区智能体平台。
