# AI Property Community Agent

> AI 驱动的物业社区管理智能体  
> AI Native Property Management Platform


一个面向真实物业社区场景设计的 AI Agent 平台。

本项目旨在构建一个具备：

- 业务执行能力
- 知识理解能力
- 多角色协作能力

的智能物业管理系统。


系统通过：

- AI Agent
- RAG 知识库
- 业务服务系统
- 模拟真实社区数据

实现从：

```
业主服务

↓

物业管理

↓

维修处理

↓

知识咨询

```

的完整智能化闭环。


---

# 1. Project Overview

## 项目背景


传统物业管理系统主要依赖：

- 人工客服
- 电话报修
- 物业工作人员处理
- 人工查询规章制度


存在：

- 服务入口分散
- 报修流程效率低
- 物业知识难以快速获取
- 重复事务占用大量人工
- 社区数据价值未充分利用


随着：

- Large Language Model（LLM）
- AI Agent
- RAG

技术的发展，物业管理正在从：

```
传统信息系统

↓

AI Native 智能服务系统

```

进行升级。


---

# 2. Project Vision

## 项目愿景


构建一个：

> AI 社区管家（AI Community Assistant）


让居民可以通过自然语言完成：


- 报修
- 查询物业费用
- 咨询社区规则
- 查看公告
- 查询服务进度


让物业工作人员可以：


- 管理社区事务
- 智能处理工单
- 自动生成公告
- 辅助运营决策


最终目标：

打造一个：

> 理解社区、连接居民、辅助物业运营的 AI 原生社区管理平台。


---

# 3. Core Features

# 3.1 Owner AI Assistant
# 业主 AI 助手


提供：

- AI 对话入口
- 智能报修
- 工单查询
- 物业费查询
- 社区知识问答


Example:


User:

```
我家厨房漏水

```


AI:

```
已识别为维修需求。

正在创建维修工单。

工单编号：
R202608001

```


---

# 3.2 Property Management System
# 物业管理系统


提供：

- 用户管理
- 房屋管理
- 工单管理
- 公告管理
- 社区数据统计


---

# 3.3 Worker Task System
# 维修任务系统


提供：

- 查看维修任务
- 接收工单
- 更新状态
- 上传维修结果


---

# 3.4 AI Agent System


系统采用 Multi-Agent 架构：


```
                 User


                  ↓


            Router Agent


                  ↓


        Domain Agent Layer


     ┌────────┬────────┬────────┐

     │        │        │        │

 Repair    Fee    Notice   Knowledge

 Agent    Agent   Agent     Agent


```


Agent负责：

- 理解用户需求
- 判断任务类型
- 调用业务能力
- 生成结果


---

# 3.5 RAG Knowledge System

系统构建物业知识库。


知识包括：


- 业主管理规约
- 装修管理制度
- 停车管理规定
- 物业服务标准
- 社区 FAQ


支持：

- 文档解析
- 知识检索
- 内容引用
- 准确回答


---

# 4. Demo Scenario

## Scenario 1：智能报修


用户：

```
卫生间漏水怎么办？

```


系统流程：

```
User

↓

Router Agent

↓

Repair Agent

↓

Create Repair Order

↓

Notify Worker

```


结果：

```
维修工单创建成功

编号：
R202608001

状态：
处理中

```


---

## Scenario 2：物业知识问答


用户：

```
装修时间是什么？

```


系统流程：

```
Question

↓

Knowledge Agent

↓

RAG Retrieval

↓

Knowledge Base

↓

Answer

```


结果：

```
工作日施工时间：

9:00-12:00

14:00-18:00

```

---

# 5. System Architecture


整体架构：


```
用户


        Owner     Property     Worker


                     │


              Client Layer


                     │


              API Gateway


                     │


            AI Agent Runtime


                     │


              Router Agent


                     │


          Domain Agent Layer


    Repair   Fee   Notice   Knowledge


                     │


                  Tools


                     │


          Business Service Layer


              │              │


        PostgreSQL     Vector Database


                              ↑


                       Knowledge Base


```


核心组成：


| Layer | Description |
|---|---|
| Client Layer | 用户交互端 |
| Backend Layer | 业务服务 |
| Agent Layer | AI智能决策 |
| Database | 业务数据 |
| RAG System | 知识增强 |


---

# 6. Repository Structure


```
AI-Property-Community-Agent/


├── README.md


├── frontend/

│   前端应用


├── backend/

│   后端业务服务


├── agent/

│   AI Agent系统


├── knowledge/

│   RAG知识库


├── data/

│   模拟社区数据


├── docs/

│   项目设计文档


└── docker-compose.yml

    部署配置

```


---

# 7. Documentation


完整项目文档：


```
docs/


00-overview

项目总览


01-product

产品设计


02-architecture

系统架构


03-agent

AI Agent设计


04-data-assets

数据资产


05-engineering

工程实现


06-testing

测试评估


07-operation

部署运营

```


---

# 8. Development Roadmap


## Phase 0
# Project Foundation


项目初始化：


- Repository建立
- 技术环境配置
- Docker环境


---

## Phase 1
# Data & Backend Foundation


实现：

- 数据库设计
- 用户系统
- 房屋系统
- 报修系统
- 费用系统
- 公告系统


---

## Phase 2
# Client Applications


实现：

- 业主端
- 物业管理端
- 维修任务端


---

## Phase 3
# AI Agent Integration


实现：

- Router Agent
- Repair Agent
- Fee Agent
- Notice Agent
- Knowledge Agent


---

## Phase 4
# RAG Knowledge System


实现：

- 文档处理
- Embedding
- Vector Search
- Knowledge QA


---

## Phase 5
# Evaluation & Optimization


实现：

- Agent Evaluation
- Tool Calling Evaluation
- RAG Evaluation


---

## Phase 6
# Deployment


实现：

- Docker部署
- 服务监控
- Demo运行环境


---

# 9. Tech Stack


## Backend

推荐：

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis


## Frontend

支持：

- Web Application
- Mobile Application
- Mini Program


候选技术：

- Vue3
- React
- TypeScript
- Uni-app


## AI


- Large Language Model API
- LangChain / LangGraph
- Embedding Model
- Vector Database


##部署


- Docker
- Linux
- Cloud Environment


---

# 10. Development Principles


## AI First


AI不是简单聊天机器人。


AI作为：

```
业务入口

+

任务执行智能层

```


---

## Agent + Service Separation


Agent 不直接操作数据库。


正确：

```
Agent

↓

Tool

↓

Service

↓

Database

```


---

## Data Driven


通过：

模拟真实社区数据

验证：

AI能力和业务流程。


---

## Evaluation Driven


所有AI能力必须可测试。


包括：

- Intent Accuracy
- Tool Calling Accuracy
- Workflow Success
- RAG Accuracy


---

# 11. AI Coding Agent Guide


如果你是 AI Coding Agent（例如 Codex）：

开始开发前，请阅读：


```
docs/00-overview/


docs/01-product/


docs/02-architecture/


docs/03-agent/


docs/05-engineering/codex-handoff.md

```


推荐开发顺序：


```
Database

↓

Backend API

↓

Frontend

↓

Agent Integration

↓

RAG

↓

Evaluation

↓

部署

```


不要一次生成全部代码。

每个阶段：

- 可运行
- 可测试
- 可提交


---

# 12. Current Status


项目当前阶段：


```
Documentation Design

        ↓

Engineering Implementation

        ↓

MVP Development

```


已完成：

✅ 产品设计  
✅ 系统架构设计  
✅ Agent设计  
✅ 数据资产规划  
✅ 工程规划  
✅ 测试体系设计  


下一阶段：

进入：

```
Data Asset Construction

↓

Backend Implementation

↓

AI Agent Development

```


---

# 13. License


To be determined.
