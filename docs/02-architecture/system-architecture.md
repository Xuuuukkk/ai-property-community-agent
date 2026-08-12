# System Architecture
# 系统总体架构设计


> AI Property Community Agent  
> AI驱动的物业社区管理智能体


---

# 1. Architecture Overview
# 架构概述


AI Property Community Agent 采用：

> AI Agent + Business Service + Data Platform + Knowledge System

的分层架构。


整体目标：

将传统物业管理系统升级为 AI Native 架构。


---

# 2. High Level Architecture
# 系统总体架构


整体架构如下：


```
                         Users

        ┌────────────────────────────────┐
        │                                │
     Owner                         Property Staff

    业主端                          物业端


        │                                │


        └──────────────┬─────────────────┘

                       │


                  Worker Client

                   维修端


                       │


              Application Layer
              应用层


                       │


              API Gateway Layer
              接口层


                       │


              AI Agent Platform
              智能体平台


                       │


        ┌──────────────┼──────────────┐


 Business Services                 Knowledge System

业务服务层                         知识系统


        │                                │


        └──────────────┬─────────────────┘


                       │


                Data Infrastructure

                 数据基础设施


        ┌──────────────┼──────────────┐


   PostgreSQL 16           pgvector

   业务数据库 + 向量存储 (PostgreSQL Extension)


```

---

# 3. Architecture Layers
# 架构分层


系统分为六层。


---

# Layer 1: Client Layer
# 用户交互层


负责：

用户操作入口。


包含：


## Owner Client

业主端。


功能：

- AI助手
- 报修
- 费用查询
- 公告查看
- 工单跟踪


---

## Admin Dashboard

物业管理端。


功能：

- 数据看板
- 工单管理
- 用户管理
- 公告管理


---

## Worker Client

维修人员端。


功能：

- 查看任务
- 接受任务
- 更新状态


---

# Layer 2: API Layer
# 接口服务层


负责：

客户端与后端系统通信。


主要职责：

- 请求认证
- 参数校验
- API路由
- 返回处理


示例：


```
POST /api/chat

POST /api/repair

GET /api/fee

GET /api/notice

```


---

# Layer 3: AI Agent Layer
# AI智能体层


系统核心。


负责：

理解用户需求。

进行任务规划。

调用业务能力。


结构：


```
                  User Input


                      │


              Personal Agent


                      │


              Router Agent


                      │


      ┌───────────────┼───────────────┐


 Repair Agent     Fee Agent     Knowledge Agent


      │               │                │


      └───────────────┼───────────────┘


                  Tool Layer


```


---

# Layer 4: Business Service Layer
# 业务服务层


负责：

真正执行业务逻辑。


原则：

> Agent不直接操作数据库。


流程：

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

包含服务：

---

## User Service

用户服务。


负责：

- 用户信息
- 身份认证
- 权限管理


---

## Community Service

社区服务。


负责：

- 小区
- 楼栋
- 房屋


---

## Repair Service

维修服务。


负责：

- 工单创建
- 派单
- 状态管理


---

## Fee Service

费用服务。


负责：

- 账单查询
- 缴费状态


---

## Notice Service

公告服务。


负责：

- 公告管理
- 发布流程


---

# Layer 5: Knowledge Layer
# 知识智能层


负责：

为AI提供领域知识。


架构：


```
Documents

↓

Parser

↓

Chunk

↓

Embedding

↓

pgvector

↓

Retriever

↓

LLM

```


---

知识来源：


- 物业管理规定
- 业主公约
- 装修规范
- 停车制度
- 社区FAQ


---

# Layer 6: Data Layer
# 数据层


负责：

存储系统数据。


---

## Relational Database

关系数据库：

PostgreSQL


存储：

```
User

Community

Building

House

HouseBinding

Worker

RepairOrder

FeeBill

Notice

AgentTrace

```


---

## pgvector (PostgreSQL Extension)

向量存储（内嵌于 PostgreSQL，不独立部署）。


存储：

```
Document Embedding

Knowledge Chunk

Metadata

```


---

# 4. Core Data Flow
# 核心数据流程


---

# Scenario 1: AI报修


用户：

```
我家厨房漏水

```


流程：


```
Owner Client


↓

Chat API


↓

Personal Agent


↓

Router Agent


↓

Repair Agent


↓

Repair Tool


↓

Repair Service


↓

PostgreSQL


↓

Return Result

```


---

# Scenario 2: 社区知识问答


用户：

```
装修时间是什么？

```


流程：


```
User


↓

Router Agent


↓

Knowledge Agent


↓

Retriever


↓

pgvector


↓

LLM


↓

Answer

```


---

# Scenario 3: 公告生成


物业：

```
明天停水维修

```


流程：


```
Admin Dashboard


↓

Notice Agent


↓

Generate Content


↓

Human Review


↓

Notice Service


↓

Publish


```


---

# 5. Architecture Design Principles
# 架构设计原则


---

# 5.1 Agent与业务解耦


错误：

```
LLM

↓

SQL Database

```


正确：

```
LLM

↓

Agent

↓

Tool

↓

Service

↓

Database

```


---

# 5.2 Modular Design

系统模块独立：

方便：

- 开发
- 测试
- 扩展


---

# 5.3 Data Grounded AI


AI输出必须基于：

- 业务数据
- 知识库


减少幻觉。


---

# 5.4 Human In The Loop


关键业务需要人工确认。


例如：

- 公告发布
- 工单关闭


---

# 6. Future Extension Architecture
# 未来扩展


未来增加：


```
                 AI Community Brain


                        │


       ┌────────────────┼────────────────┐


      IoT             Vision           Voice


  智能设备           视频分析          语音助手


```


---

# 7. Summary


系统总体架构：

```
Frontend

↓

API

↓

AI Agent

↓

Business Services

↓

Database

+

Knowledge Base

```


核心理念：

> AI负责理解和决策，业务系统负责执行，数据系统负责支撑。

该架构支持：

- MVP开发
- Agent扩展
- RAG增强
- 未来智慧社区演进
