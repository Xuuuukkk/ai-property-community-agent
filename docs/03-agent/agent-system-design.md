# Agent System Design
# AI Agent 系统设计


> AI Property Community Agent  
> AI物业社区智能体 AI层技术设计规范


---

# 1. Overview
# Agent系统概述


AI Agent Layer 是系统智能决策层。


核心职责：

- 理解用户自然语言输入
- 管理任务状态
- 调用业务工具
- 协调业务服务
- 生成最终响应


设计原则：

```
Agent负责决策

Business Service负责执行

Database负责存储

```


Agent不直接：

- 操作数据库
- 修改业务状态
- 执行业务规则


所有业务动作必须通过 Tool 完成。


---

# 2. Agent Runtime Architecture
# Agent运行架构


整体结构：


```
                 User Input


                    │


            Conversation Manager


                    │


              Agent Runtime


                    │


             ┌──────┴──────┐


             │             │


        Reasoning       State


             │             │


             └──────┬──────┘


                    │


              Agent Graph


                    │


              Tool Calling


                    │


          Business Service Layer


                    │


              PostgreSQL


```


---

# 3. Agent Execution Model
# Agent执行模型


采用：

```
Graph-based Agent Workflow

```


每一次任务执行由多个 Node 组成。


结构：


```
Input

↓

Understand Node

↓

Planning Node

↓

Tool Node

↓

Validation Node

↓

Response Node

```


---

# 4. Agent State Management
# Agent状态管理


Agent通过 State 保存任务上下文。


State包含：

```json
{
"user_id":1001,

"conversation_id":"xxx",

"intent":"repair",

"task":"create_repair_order",

"entities":{

"type":"water",

"location":"kitchen"

},

"tool_results":[]

}

```


---

# 5. Agent Graph Design
# Agent Graph设计


系统采用：

```
Router Graph

+

Domain Agent Graph

```


---

# 5.1 Router Graph


负责：

判断任务类型。


流程：


```
User Message


↓

Intent Detection


↓

Select Agent


↓

Execute Agent

```


输出：


```json
{
"intent":"repair",
"target":"RepairAgent"
}

```


---

# 5.2 Domain Agent Graph


每个业务Agent独立。


例如：


```
Repair Agent Graph


Input

↓

Information Extraction

↓

Missing Information Check

↓

Tool Call

↓

Result Validation

↓

Response

```


---

# 6. Tool Calling Architecture
# 工具调用设计


核心原则：


> Tool 是 Agent 与业务系统之间的唯一接口。


架构：


```
Agent

↓

Tool

↓

Service

↓

Repository

↓

Database

```


---

# 7. Tool Design Specification
# Tool设计规范


每个Tool必须：

- 单一职责
- 明确输入
- 明确输出
- 可测试


---

## Example: Create Repair Order Tool


名称：

```
create_repair_order

```


输入：


```json
{
"user_id":1001,
"house_id":302,
"type":"water",
"description":"厨房漏水"
}

```


输出：


```json
{
"order_id":"R202608001",
"status":"CREATED"
}

```


---

# 8. Agent Tools Definition
# Agent工具列表


## Repair Tools


```
create_repair_order()

query_repair_order()

assign_worker()

update_repair_status()

```


---

## Fee Tools


```
query_house_fee()

query_payment_status()

```


---

## Knowledge Tools


```
retrieve_document()

search_knowledge()

```


---

## Notice Tools


```
generate_notice()

publish_notice()

```


---

# 9. Memory Architecture
# Memory设计


系统采用三层Memory。


---

# 9.1 Conversation Memory
# 对话记忆


作用：

保存当前会话上下文。


例如：

```
用户：

我要报修


AI：

哪里坏了？


用户：

厨房

```


存储：

```
Redis

```


---

# 9.2 User Memory
# 用户长期记忆


保存：

- 用户身份
- 房屋信息
- 历史服务记录


存储：

```
PostgreSQL

```


---

# 9.3 Knowledge Memory
# 知识记忆


保存：

领域知识。


存储：

```
pgvector (PostgreSQL Extension)

```


例如：

- 物业规则
- 社区制度
- FAQ


---

# 10. Context Engineering
# 上下文工程


Agent输入上下文包括：


```
System Prompt

+

User Information

+

Conversation History

+

Retrieved Knowledge

+

Tool Results

```


---

# 11. Prompt Management
# Prompt管理


Prompt不直接写死在代码中。


推荐结构：


```
prompts/


├── router_prompt.md

├── repair_agent_prompt.md

├── knowledge_agent_prompt.md

└── notice_agent_prompt.md

```


---

# Prompt设计原则：


## Router Prompt

目标：

准确分类。


---

## Domain Prompt

目标：

控制业务流程。


---

## Knowledge Prompt

目标：

限制幻觉。


---

# 12. Agent Observability
# Agent可观测性


所有Agent运行必须记录。


记录内容：


```
Request

↓

Agent Decision

↓

Tool Call

↓

Tool Result

↓

Final Response

```


---

数据存储：


```
agent_trace

```


用于：

- Debug
- Evaluation
- Optimization


---

# 13. Human In The Loop
# 人机协同


部分操作需要人工确认。


例如：


## 公告发布


流程：


```
Agent生成

↓

人工审核

↓

发布

```


---

## 高风险维修


例如：

```
燃气问题

电路故障

```


需要：

人工确认。


---

# 14. Agent Error Handling
# 异常处理


## 信息不足


例如：

用户：

```
我要报修

```


Agent：

```
请告诉我具体位置和问题

```


---

## Tool失败


流程：

```
Tool Error

↓

Retry

↓

Fallback

↓

Notify User

```


---

## Knowledge不存在


禁止：

编造答案。


流程：

```
Retrieval失败

↓

说明无法确认

↓

建议人工咨询

```


---

# 15. Recommended Implementation Stack
# 推荐技术栈


Agent Framework:


```
LangGraph

```


LLM:


```
OpenAI API
or
Compatible LLM API

```


Embedding:


```
Embedding Model

```


Vector Storage:


```
pgvector (PostgreSQL Extension)

不额外引入独立 Vector Database。

未来：可根据规模迁移：
- Milvus
- Weaviate

```


Cache:


```
Redis

```


---

# 16. Development Constraints For Codex
# Codex开发约束


实现时必须遵守：


## Rule 1

Agent代码与业务代码分离。


结构：

```
ai-agent/

service/

repository/

```


---

## Rule 2

所有业务操作必须通过Tool。


禁止：

```
Agent -> SQL

```


---

## Rule 3

所有Agent执行必须可追踪。


---

## Rule 4

所有AI输出必须基于：

- 数据库
- 知识库


---

# Summary
# 总结


Agent系统结构：


```
Conversation Manager

        ↓

Agent Runtime

        ↓

Agent Graph

        ↓

Tool Calling

        ↓

Business Service

        ↓

Database


+
RAG Knowledge System

```


该设计支持：

- 多Agent扩展
- RAG增强
- 工具调用
- Agent评估
- Codex自动开发
