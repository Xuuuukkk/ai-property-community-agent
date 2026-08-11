# AI Property Community Agent

> AI 驱动的物业社区管理智能体（AI Native Property Management Platform）

一个面向真实物业社区场景设计的 AI Agent 平台。

本项目旨在构建一个具备业务执行能力、知识理解能力和多角色协作能力的智能物业管理系统。

系统通过：

- AI Agent
- RAG 知识库
- 业务服务系统
- 模拟真实社区数据

实现从业主服务、物业管理到维修处理的完整闭环。


---

# 1. Project Overview

## 项目背景

传统物业管理系统主要依赖：

- 人工客服
- 电话报修
- 物业工作人员处理
- 人工查询规则和制度

存在以下问题：

- 业主服务入口分散
- 报修流程效率低
- 物业知识难以快速获取
- 物业工作人员重复处理大量事务
- 社区数据价值未被充分利用


随着大语言模型（LLM）和 Agent 技术的发展，物业管理可以从传统信息系统升级为：

> AI 驱动的智能社区服务系统。


---

# 2. Project Vision

## 项目愿景

构建一个 AI 社区管家：

让居民可以通过自然语言完成：

- 报修
- 查询物业费用
- 咨询社区规则
- 查看公告
- 查询服务进度


让物业工作人员可以：

- 管理社区事务
- 自动生成公告
- 智能处理工单
- 利用 AI 辅助决策


---

# 3. Core Features

## 3.1 Owner AI Assistant（业主 AI 助手）

提供：

- AI 对话入口
- 智能报修
- 工单查询
- 物业费查询
- 社区知识问答


示例：

用户：

```
我家厨房漏水
```

AI：

```
已识别为维修需求。

正在为您创建维修工单。

工单编号：
R202608001
```


---

## 3.2 Property Management System（物业管理系统）

提供：

- 用户管理
- 房屋管理
- 工单管理
- 公告管理
- 数据统计


---

## 3.3 Worker Task System（维修任务系统）

提供：

- 任务查看
- 工单处理
- 状态更新
- 维修结果反馈


---

## 3.4 AI Agent System

系统包含：

```
Personal Agent

        ↓

Router Agent

        ↓

Domain Agents


Repair Agent

Fee Agent

Notice Agent

Knowledge Agent

```


---

## 3.5 RAG Knowledge System

构建物业知识库：

包括：

- 业主管理规约
- 装修管理制度
- 停车管理规定
- 物业服务标准
- 社区 FAQ


支持：

- 知识检索
- 文档引用
- 准确回答


---

# 4. System Architecture

整体架构：

```
                 Users

        ┌────────┼────────┐

      Owner    Admin    Worker

        │        │        │

        └────────┼────────┘

                 │

            API Layer

                 │

          AI Agent Layer

                 │

        Business Service Layer

                 │

        Database + Knowledge Base

```


核心组成：

| Layer | Description |
|---|---|
| Frontend | 用户交互端 |
| Backend | 业务服务 |
| Agent Layer | AI智能决策 |
| Database | 业务数据 |
| RAG System | 知识增强 |


---

# 5. Documentation


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

# 6. Development Roadmap


## Phase 0 - Project Foundation

项目初始化：

- Repository建立
- 技术环境配置
- 数据库初始化


---

## Phase 1 - Core Business System

实现：

- 用户系统
- 房屋系统
- 报修系统
- 费用系统
- 公告系统


---

## Phase 2 - AI Agent Integration

实现：

- Router Agent
- Repair Agent
- Fee Agent
- Knowledge Agent


---

## Phase 3 - RAG Knowledge System

实现：

- 文档处理
- Embedding
- Vector Search
- Knowledge QA


---

## Phase 4 - Client Applications

实现：

- 业主端
- 物业后台
- 维修端


---

## Phase 5 - Evaluation & Optimization

实现：

- 功能测试
- Agent Evaluation
- RAG Evaluation


---

# 7. Tech Stack


## Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis


## Frontend

- Vue3
- Uni-app
- 微信小程序


## AI

- Large Language Model API
- LangChain / LangGraph
- Embedding Model
- Vector Database


## Deployment

- Docker
- Linux
- Cloud Environment


---

# 8. Development Principles


## AI First

AI 不只是聊天机器人，而是业务执行入口。


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

通过模拟真实社区数据验证 AI 能力。


---

## Evaluation Driven

所有 AI 能力必须可测试。


包括：

- Agent Accuracy
- Tool Calling Accuracy
- RAG Accuracy


---

# 9. Current Status


项目阶段：

```
Documentation Design

        ↓

Engineering Implementation

        ↓

MVP Development

```


当前已完成：

- 产品设计
- 系统架构设计
- Agent设计
- 数据资产规划
- 开发规划


下一阶段：

进入工程实现。


---

# 10. License

To be determined.
