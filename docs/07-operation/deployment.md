# Deployment Guide
# 系统部署说明


> AI Property Community Agent  
> Deployment Specification


---

# 1. Deployment Overview
# 部署概述


本项目采用容器化部署方式。


目标：

通过 Docker Compose 一键启动完整系统。


部署组件：


```
Frontend

Backend

PostgreSQL 16 + pgvector

Redis

Agent Runtime (内嵌于 Backend)

```


整体结构：


```
                 User


                  │


             Frontend


                  │


              Backend


        ┌─────────┼─────────┐


        │         │         │


   PostgreSQL   Redis   (pgvector

   + pgvector           内嵌)


                  │


             Agent Runtime


```


---

# 2. Deployment Environment
# 环境要求


## Minimum Hardware


开发环境：


|资源|要求|
|-|-|
|CPU|4 Core+|
|Memory|8GB+|
|Storage|20GB+|


---

## Software


需要：

```
Docker

Docker Compose

Git

```


版本建议：


```
Docker >= 24

Docker Compose >= 2

Python >= 3.12

Node.js >= 22

```


---

# 3. Project Deployment Structure
# 部署目录结构


最终项目：


```
AI-Property-Community-Agent/


├── frontend/

│

├── backend/

│

├── ai-agent/

│

├── knowledge-base/

│

├── data/

│
├── seed/

│

├── database/

│

├── scripts/

│

├── tests/

│

├── docker-compose.yml

│

├── .env

│

└── docs/

```


---

# 4. Environment Configuration
# 环境配置


配置文件：


```
.env

```


示例：


```env
# Database

POSTGRES_HOST=postgres

POSTGRES_PORT=5432

POSTGRES_DB=property_agent

POSTGRES_USER=admin

POSTGRES_PASSWORD=password



# Redis

REDIS_HOST=redis



# AI

LLM_API_KEY=xxxx

EMBEDDING_MODEL=text-embedding-3-small

```


---

# 5. Docker Compose Architecture
# Docker服务设计


服务：


```yaml
services:


  frontend:


  backend:


  postgres:  # 包含 pgvector 扩展


  redis:

```

> 注：pgvector 作为 PostgreSQL 扩展内嵌运行，无需独立 vector-db 容器。


---

# 6. Database Initialization
# 数据库初始化


启动：


```
docker compose up postgres

```


执行：


```
migration

↓

seed data

```


数据来源：


```
data/seed/

```


包含：


```
community.sql

buildings.sql

houses.sql

users.sql

workers.sql

repair_orders.sql

fee_bills.sql

notices.sql

```


---

# 7. Knowledge Base Deployment
# 知识库部署


流程：


```
knowledge documents


↓

Document Parser


↓

Chunk


↓

Embedding


↓

pgvector

(PostgreSQL Extension)


```


初始化命令：


```
python ingest.py

```


结果：

pgvector 生成知识索引。


---

# 8. Backend Deployment
# 后端部署


启动：


```
docker compose up backend

```


启动后：


```
API Server

http://localhost:8000

```


检查：

```
GET /health

```


返回：

```json
{
"status":"ok"
}

```


---

# 9. Frontend Deployment
# 前端部署


启动：


```
docker compose up frontend

```


访问：

```
http://localhost:3000

```


---

# 10. Agent Runtime Deployment
# Agent运行部署


Agent作为Backend内部模块运行。


流程：


```
Chat Request


↓

Agent Runtime


↓

Graph Execution


↓

Tool Calling


↓

Business Service


```


---

# 11. Local Development Workflow
# 本地开发流程


推荐：


## Step 1


Clone:


```
git clone xxx

```


---

## Step 2


配置：


```
.env

```


---

## Step 3


启动基础服务：


```
docker compose up

```


---

## Step 4


初始化数据：


```
seed database

ingest knowledge

```


---

## Step 5


运行测试：


```
pytest

npm test

```


---

# 12. Production Deployment
# 生产部署建议


生产环境增加：


## Reverse Proxy


推荐：

```
Nginx

```


---

## HTTPS


使用：

```
SSL Certificate

```


---

## Monitoring


增加：

```
Prometheus

Grafana

```


---

## Logging


使用：

```
ELK

or

Cloud Logging

```


---

# 13. Backup Strategy
# 数据备份


需要备份：


## PostgreSQL


备份：

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

```


---


## pgvector 向量数据

随 PostgreSQL 一同备份（pgvector 数据存储在 PostgreSQL 中）。

备份：

```
Knowledge Embeddings

Knowledge Chunks

```


---

# 14. Health Check
# 健康检查


服务：

|服务|检查|
|-|-|
|Frontend|页面访问|
|Backend|/health|
|PostgreSQL|Connection|
|pgvector|Vector Query|
|Redis|Ping|


---

# 15. Deployment Acceptance
# 部署验收


部署完成标准：


## System


```
All containers running

```


---

## Database


```
Seed data loaded

```


---

## AI


```
Agent responds

```


---

## RAG


```
Knowledge query works

```


---

# Summary
# 总结


部署流程：


```
Docker Compose

↓

Database

↓

Seed Data

↓

Knowledge Ingestion

↓

Backend

↓

Frontend

↓

Agent

```


最终实现：

一键启动的 AI物业社区智能体 Demo 环境。
