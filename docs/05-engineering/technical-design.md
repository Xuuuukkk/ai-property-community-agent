# Technical Design
# AI物业社区智能体技术设计


> AI Property Community Agent  
> Engineering Technical Specification


---

# 1. Technical Overview
# 技术架构概览


系统采用前后端分离架构，并结合 AI Agent 与 RAG 技术。


整体结构：


```
                    User


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


               Data Layer


        ┌────────────┴────────────┐


        │                         │


 PostgreSQL                Vector Database


```


---

# 2. Recommended Tech Stack
# 技术栈设计


## Frontend


推荐：

```
React

+

TypeScript

+

Tailwind CSS

```


职责：

- 用户界面
- AI Chat交互
- 工单管理
- 数据展示


---

## Backend


推荐：

```
Python

+

FastAPI

```


职责：

- API服务
- 业务逻辑
- 权限控制
- 数据访问


---

## Database


业务数据库：

```
PostgreSQL

```


存储：

- 用户
- 房屋
- 工单
- 费用
- 公告


---

## Cache


```
Redis

```


用途：

- Session
- Chat Memory
- Temporary State


---

## AI Layer


Agent Framework：

```
LangGraph

```


用途：

- Agent Workflow
- State Management
- Tool Calling


---

## Vector Database


MVP:

```
Chroma

```


Production:

```
Milvus

```


用途：

RAG知识检索。


---

# 3. Repository Structure
# 项目目录设计


推荐结构：


```
AI-Property-Community-Agent/


├── frontend/


├── backend/


├── agent/


├── knowledge/


├── data/


├── docker/


├── docs/


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

## Directory


```
backend/


├── app/


│

├── api/

│   └── routes/


│

├── services/


│

├── repositories/


│

├── models/


│

├── schemas/


│

├── core/


│

└── main.py


```


---

# 5. Backend Module Design
# 后端模块设计


## User Module


负责：

- 用户信息
- 身份验证


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
- 分配维修
- 更新状态


核心：

```
RepairService

```


---

## Fee Module


负责：

- 费用查询
- 缴费状态


---

## Notice Module


负责：

- 公告管理
- 发布


---

# 6. API Design Specification
# API设计规范


统一：

RESTful API。


---

# User


```
GET

/api/users/{id}

```


---

# Repair


创建工单：


```
POST

/api/repair

```


查询：

```
GET

/api/repair/{id}

```


列表：

```
GET

/api/repair/list

```


---

# Fee


```
GET

/api/fee/{user_id}

```


---

# Notice


列表：

```
GET

/api/notices

```


创建：

```
POST

/api/notices

```


---

# 7. Agent Layer Design
# Agent层设计


目录：


```
agent/


├── runtime/


├── graphs/


├── tools/


├── prompts/


├── memory/


└── evaluation/


```


---

# 7.1 Runtime


负责：

- Agent初始化
- State管理
- 执行流程


---

# 7.2 Graphs


存放：

```
router_graph

repair_graph

knowledge_graph

notice_graph

```


---

# 7.3 Tools


所有业务调用入口。


例如：


```
create_repair_order

query_fee

search_knowledge

generate_notice

```


---

# 7.4 Prompts


统一管理：

```
router_prompt

repair_prompt

knowledge_prompt

notice_prompt

```


---

# 8. Data Flow Design
# 数据流设计


## Normal Business Flow


```
Frontend

↓

API

↓

Service

↓

Repository

↓

Database

```


---

## AI Flow


```
Frontend

↓

Chat API

↓

Agent Runtime

↓

Tool

↓

Backend API

↓

Database

↓

Response

```


---

## RAG Flow


```
User Question

↓

Knowledge Agent

↓

Retriever

↓

Vector Database

↓

LLM

↓

Answer

```


---

# 9. Authentication Design
# 权限设计


角色：


```
OWNER

PROPERTY_STAFF

WORKER

ADMIN

```


---

权限示例：


|角色|权限|
|-|-|
|OWNER|创建报修、查询费用|
|STAFF|管理工单、公告|
|WORKER|处理维修|
|ADMIN|系统管理|


---

# 10. Configuration Management
# 配置管理


环境变量：


```
.env


DATABASE_URL=

REDIS_URL=

LLM_API_KEY=

VECTOR_DB_URL=

```


---

# 11. Logging Design
# 日志设计


系统记录：


Backend：

```
API Request

Error

Business Event

```


Agent：

```
Input

Decision

Tool Call

Output

```


---

# 12. Error Handling
# 异常处理


统一异常：


```
BusinessException

ValidationException

AgentException

```


返回：

```json
{
"code":40001,
"message":"error"
}

```


---

# 13. Testing Requirements
# 测试要求


每层测试：


## Backend


```
Unit Test

API Test

```


---

## Agent


```
Workflow Test

Tool Test

Evaluation Test

```


---

## RAG


```
Retrieval Test

Answer Accuracy Test

```


---

# 14. Deployment Architecture
# 部署设计


Docker Compose：


```
docker-compose.yml


services:


frontend


backend


postgres


redis


vector-db


```


---

# 15. Codex Implementation Rules
# Codex实现约束


## Rule 1


不要直接修改Database。


必须：

```
Migration

↓

Model

↓

Repository

```


---

## Rule 2


Agent与Backend分离。


禁止：

```
Agent直接调用SQL

```


---

## Rule 3


所有新增功能必须包含：

```
API

Service

Test

Documentation

```


---

## Rule 4


保持模块化。


未来可以增加：

```
Payment Agent

Patrol Agent

Security Agent

```


---

# Summary
# 总结


技术架构：


```
React

↓

FastAPI

↓

Business Service

+

Agent Runtime

↓

PostgreSQL

+

Vector Database


```


设计目标：

构建一个：

- 可维护
- 可扩展
- 可测试
- 支持AI Agent演进

的物业社区智能体平台。
