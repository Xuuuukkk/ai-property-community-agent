# Development Plan
# AI物业社区智能体开发计划


> AI Property Community Agent  
> Engineering Development Roadmap

> ✅ **本计划已全部执行完毕**（Phase 0-7 均完成并上线）。本文档为历史开发计划，最新状态见 [docs/README.md](../README.md)。


---

# 1. Development Goal
# 开发目标


本项目目标：

构建一个可运行的 AI 驱动物业社区管理平台。


MVP版本必须实现：


```
用户端

+

物业管理端

+

维修流程

+

AI Agent

+

RAG知识问答

+

模拟社区数据

```


最终效果：

用户可以通过自然语言完成：

- 报修
- 查询工单
- 查询物业费
- 咨询社区规则


物业人员可以：

- 管理用户
- 管理工单
- 发布公告


AI Agent可以：

- 理解用户需求
- 调用业务工具
- 基于知识库回答问题


---

# 2. Development Principles
# 开发原则


## Principle 1
# 先业务闭环，再AI增强


开发顺序：

```
Database

↓

Backend API

↓

Frontend

↓

AI Agent

↓

RAG

```


原因：

AI Agent依赖稳定业务能力。


---

## Principle 2
# 模块独立


系统拆分：

```
frontend

backend

agent

database

knowledge

```


避免：

```
AI逻辑混入业务代码

```


---

## Principle 3
# 每个阶段可运行


每个Phase必须：

- 有代码
- 有测试
- 有Demo


---

# 3. Development Phases
# 开发阶段规划


---

# Phase 0
# 项目初始化


目标：

建立开发环境。


内容：


```
Repository

↓

Docker Environment

↓

Project Structure

↓

CI Setup

```


交付：

```
项目可以启动

```


---

# Phase 1
# Database & Data Layer


目标：

建立物业数据模型。


任务：


## Database


实现：


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

## Seed Data


导入：

```
simulation-community

```


生成：

- 用户
- 房屋
- 工单
- 费用


交付：


```
Database Running

+

Initial Data

```


---

# Phase 2
# Backend Service Development


目标：

实现核心业务。


技术：

```
FastAPI

```


---

实现模块：

```
User Service

House Service

Repair Service

Fee Service

Notice Service

```


---

API：

例如：


```
POST /repair/create


GET /repair/{id}


GET /fee/query


GET /notice/list

```


---

交付：

Backend API 可调用。


---

# Phase 3
# Frontend Development


目标：

实现用户交互。


客户端：

```
Web Application

```


MVP页面：


## User Side


```
Home

AI Chat

Repair

Fee

Notice

My Orders

```


---

## Property Side


```
Dashboard

Repair Management

Notice Management

User Management

```


---

交付：

用户可以完成基础操作。


---

# Phase 4
# Agent Integration


目标：

接入AI能力。


架构：


```
Frontend

↓

Chat API

↓

Agent Runtime

↓

Tools

↓

Backend API

```


---

实现：


## Router Agent


能力：

识别：

```
repair

fee

knowledge

notice

```


---

## Repair Agent


实现：

```
create_repair_order()

query_repair_order()

```


---

## Fee Agent


实现：

```
query_fee()

```


---

交付：

用户可以自然语言操作系统。


---

# Phase 5
# RAG Knowledge System


目标：

实现社区知识问答。


流程：


```
Documents

↓

Processing

↓

Embedding

↓

Vector Database

↓

Retriever

↓

Knowledge Agent

```


---

知识：

```
业主公约

装修规定

停车规则

FAQ

```


---

交付：

用户可以咨询社区问题。


---

# Phase 6
# Agent Evaluation


目标：

验证AI能力。


测试：


## Intent Evaluation


测试：

```
用户输入

↓

Agent判断

```


---

## Tool Calling Evaluation


测试：

```
是否调用正确工具

```


---

## RAG Evaluation


测试：

```
问题

↓

检索

↓

答案准确率

```


---

交付：

AI能力评估报告。


---

# Phase 7
# Deployment


目标：

系统部署运行。


内容：

```
Docker Compose

↓

Backend

↓

Frontend

↓

Database

↓

Vector DB

```


---

交付：

完整Demo环境。


---

# 4. Recommended Development Order
# 推荐开发顺序


最终顺序：


```
1. Repository Setup


2. Database


3. Backend API


4. Seed Data


5. Frontend


6. Agent Runtime


7. Tools


8. RAG


9. Evaluation


10. Deployment

```


---

# 5. MVP Scope
# MVP范围


必须完成：


|模块|状态|
|-|-|
|用户系统|必须|
|房屋管理|必须|
|维修工单|必须|
|物业费用查询|必须|
|公告管理|必须|
|AI Chat|必须|
|Router Agent|必须|
|Repair Agent|必须|
|RAG问答|必须|


---

暂不实现：


|功能|原因|
|-|-|
|IoT设备|需要硬件|
|视频巡检|复杂CV|
|自动支付|第三方依赖|
|智能门禁|硬件系统|


---

# 6. Codex Execution Strategy
# Codex开发执行策略


Codex执行时：

不要一次生成全部代码。


推荐：


```
Step 1

完成Database


↓

Step 2

完成Backend


↓

Step 3

完成Frontend


↓

Step 4

接入Agent


↓

Step 5

接入RAG

```


每一步：

必须：

- 运行
- 测试
- 提交


---

# 7. Definition of Done
# 完成标准


一个功能完成必须满足：


## Backend


```
API存在

数据库正常

测试通过

```


---

## Frontend


```
页面可访问

交互完成

错误处理

```


---

## Agent


```
Prompt存在

Tool存在

Trace存在

Evaluation存在

```


---

# Summary
# 总结


开发路线：


```
Data Foundation

↓

Business System

↓

User Interface

↓

AI Agent

↓

RAG

↓

Evaluation

↓

部署

```


该计划用于指导：

- 人工开发
- Codex Vibe Coding
- 项目迭代
