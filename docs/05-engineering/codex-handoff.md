# Codex Handoff Document
# Codex开发交接说明


> AI Property Community Agent  
> Development Instruction For Codex


---

# 1. Project Context
# 项目背景


你正在接手一个：

> AI驱动的物业社区管理智能体项目。


目标：

构建一个完整可运行的物业社区数字化平台。


系统通过：

```
Frontend

+

Backend

+

AI Agent

+

RAG Knowledge System

+

Simulation Data

```

模拟真实物业社区运行。


---

# 2. Reading Order
# 文档阅读顺序


开始开发前，必须按照以下顺序阅读：


```
README.md


↓

docs/00-overview


↓

docs/01-product


↓

docs/02-architecture


↓

docs/03-agent


↓

docs/04-data-assets


↓

docs/05-engineering


↓

docs/06-testing

```


不要跳过：

- 产品需求
- 数据设计
- Agent设计


避免：

技术实现偏离业务目标。


---

# 3. Development Goal
# 开发目标


MVP必须实现：


## 用户侧


用户可以：

```
登录

↓

进入社区服务

↓

AI咨询

↓

创建报修

↓

查询费用

↓

查看公告

↓

查看工单状态

```


---

## 物业侧


物业人员可以：


```
查看工单

↓

分配维修人员

↓

管理公告

↓

查看社区数据

```


---

## AI能力


Agent必须支持：


```
自然语言输入

↓

意图识别

↓

任务规划

↓

Tool调用

↓

业务执行

↓

结果返回

```


---

# 4. Implementation Strategy
# 实现策略


禁止：

一次生成整个项目。


采用：

Incremental Development。


顺序：


```
Phase 1

Database


↓

Phase 2

Backend API


↓

Phase 3

Frontend


↓

Phase 4

Agent Integration


↓

Phase 5

RAG


↓

Phase 6

Testing


↓

Phase 7

Deployment

```


---

# 5. Code Structure Requirement
# 代码结构要求


最终结构：


```
project/


├── frontend/


├── backend/


├── agent/


├── knowledge/


├── data/


├── docs/


└── docker-compose.yml

```


---

# 6. Backend Rules
# 后端开发规则


采用：

```
FastAPI

```


架构：


```
Router

↓

Service

↓

Repository

↓

Database

```


---

禁止：

```
API直接操作数据库

```


错误：

```
Route

↓

SQL

```


正确：


```
Route

↓

Service

↓

Repository

↓

Database

```


---

# 7. Database Rules
# 数据库规则


数据库：

```
PostgreSQL

```


所有修改：

必须通过：

```
Migration

```


流程：

```
Schema Change

↓

Migration

↓

Model Update

↓

Repository Update

```


---

# 8. Agent Development Rules
# Agent开发规则


Agent代码独立：


```
agent/


├── runtime

├── graph

├── tools

├── prompts

├── memory

└── evaluation

```


---

## Agent原则


Agent负责：

```
理解

规划

决策

```


Backend负责：

```
业务执行

数据验证

状态管理

```


---

禁止：

```
LLM

↓

SQL

```


必须：


```
LLM

↓

Tool

↓

Service

↓

Database

```


---

# 9. Tool Development Rules
# Tool规范


每个Tool必须：

包含：


```
Name

Description

Input Schema

Output Schema

Exception Handling

Test

```


---

Example:


```
create_repair_order()

```


Input：

```json
{
"user_id":1,
"description":"漏水"
}

```


Output：


```json
{
"order_id":"R001",
"status":"CREATED"
}

```


---

# 10. RAG Development Rules
# RAG规则


知识来源：

```
knowledge/

```


流程：


```
Document

↓

Chunk

↓

Embedding

↓

Vector Database

↓

Retriever

↓

LLM

```


---

禁止：

没有知识依据时：

直接生成确定答案。


---

# 11. Simulation Data Rules
# 模拟数据规则


必须支持：

真实业务测试。


数据包括：

```
Community

Building

House

User

Worker

RepairOrder

FeeBill

Notice

```


---

数据要求：

## Consistency


例如：

```
RepairOrder

必须属于某个House

```


---

## Realism


例如：

维修记录：

包含：

```
时间

状态

人员

结果

```


---

# 12. Testing Requirement
# 测试要求


每完成一个模块：

必须添加测试。


---

Backend：

```
Unit Test

API Test

```


---

Agent：

```
Intent Test

Workflow Test

Tool Test

```


---

RAG：

```
Retrieval Evaluation

Answer Evaluation

```


---

# 13. Commit Strategy
# 提交策略


不要：

一次提交全部代码。


推荐：


```
feat(database)

feat(user-service)

feat(repair-api)

feat(agent-router)

feat(rag)

```


---

# 14. Current Development Priority
# 当前开发优先级


按照：


```
1.

Initialize Project


↓

2.

Database Schema


↓

3.

Seed Simulation Data


↓

4.

Backend API


↓

5.

Frontend UI


↓

6.

Agent Layer


↓

7.

RAG


↓

8.

Evaluation


```


---

# 15. Final Acceptance Criteria
# 最终验收标准


系统必须完成以下Demo：


---

## Scenario 1
# 用户报修


输入：

```
我家厨房漏水

```


系统：


```
识别Repair

↓

创建工单

↓

返回编号

```


---

## Scenario 2
# 查询费用


输入：

```
查一下物业费

```


系统：

```
查询用户账单

↓

返回费用状态

```


---

## Scenario 3
# 社区规则问答


输入：

```
装修可以几点施工？

```


系统：

```
RAG检索

↓

返回规则

```


---

# 16. Important Reminder
# 重要说明


这个项目不是：

普通CRUD系统。


核心价值：

```
Business System

+

AI Agent

+

Knowledge System

+

Evaluation

```


开发过程中：

优先保证：

```
可运行

↓

可测试

↓

可扩展

```


不要为了快速生成代码牺牲：

- 架构清晰度
- 数据一致性
- Agent可控性


---

# End

Codex开始开发前：

请确认已经理解：

- 产品目标
- 系统架构
- Agent设计
- 数据资产
- 开发顺序

然后按照Phase逐步实现。
