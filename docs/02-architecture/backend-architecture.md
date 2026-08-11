# Backend Architecture
# 后端系统架构设计


> AI Property Community Agent  
> Backend Engineering Specification


---

# 1. Backend Overview
# 后端概述


后端系统负责：

- 提供业务 API
- 管理核心业务逻辑
- 支撑 AI Agent 调用
- 管理数据访问


核心设计原则：

> AI负责理解需求，Backend负责业务执行。


整体流程：


```
Client

↓

API Layer

↓

Service Layer

↓

Repository Layer

↓

Database

```


---

# 2. Backend Technology Stack
# 技术选型


## Programming Language

```
Python 3.12+
```


---

## Web Framework

```
FastAPI
```


选择原因：

- 高性能
- 异步支持
- 自动生成 OpenAPI 文档
- 适合 AI 应用开发


---

## ORM

```
SQLAlchemy
```


负责：

- 数据模型映射
- 数据查询
- 数据库操作


---

## Data Validation

```
Pydantic
```


负责：

- Request校验
- Response格式化


---

## Database

```
PostgreSQL
```


负责：

核心业务数据。


---

## Cache

```
Redis
```


用途：

- Session
- Agent短期记忆
- 缓存


---

# 3. Backend Architecture Pattern
# 后端分层设计


采用：

> Controller + Service + Repository Architecture


结构：

```
API Controller


      ↓


Business Service


      ↓


Repository


      ↓


Database

```


---

# 4. Backend Project Structure
# 项目目录设计


推荐：


```
backend/


├── app/

│

├── api/

│   ├── auth.py

│   ├── user.py

│   ├── community.py

│   ├── repair.py

│   ├── fee.py

│   └── notice.py


│

├── services/

│   ├── user_service.py

│   ├── repair_service.py

│   ├── fee_service.py

│   └── notice_service.py


│

├── repositories/

│   ├── user_repository.py

│   ├── repair_repository.py

│   └── fee_repository.py


│

├── models/

│   ├── user.py

│   ├── house.py

│   ├── repair.py

│   └── notice.py


│

├── schemas/

│   ├── user_schema.py

│   ├── repair_schema.py

│   └── notice_schema.py


│

├── core/

│   ├── config.py

│   ├── security.py

│   └── database.py


│

└── main.py

```


---

# 5. Module Design
# 核心模块设计


---

# 5.1 Authentication Module
# 用户认证模块


职责：

管理用户身份。


功能：

- 登录
- Token生成
- 用户身份识别


数据：

```
User

Role

Permission

```


---

# 5.2 Community Module
# 社区管理模块


负责：

模拟真实小区基础数据。


包含：


```
Community

Building

House

ParkingSpace

```


关系：


```
Community

    |

 Building

    |

 House

```


---

# 5.3 User Module
# 用户模块


负责：

管理：

- 业主
- 物业人员
- 维修人员


核心：

```
User

HouseBinding

Role

```


---

# 5.4 Repair Module
# 报修模块


系统核心业务模块。


负责：

- 创建工单
- 分配任务
- 状态流转
- 维修记录


流程：

```
Create

↓

Assign

↓

Process

↓

Complete

```


---

## Repair Service Interface


示例：

```python
create_repair_order()

assign_worker()

update_status()

query_order()

```


---

# 5.5 Fee Module
# 费用模块


负责：

物业费用查询。


功能：

- 查询账单
- 查询缴费状态


接口：


```python
get_fee_bill()

check_payment_status()

```


---

# 5.6 Notice Module
# 公告模块


负责：

社区公告管理。


功能：

- 创建公告
- 发布公告
- 查询公告


---

# 6. API Layer Design
# API设计规范


采用 REST API。


统一格式：

```
/api/{resource}

```


---

# 6.1 User API


## 获取用户信息


```
GET

/api/user/profile

```


Response:


```json
{
"user_id":1001,
"name":"张三",
"house":"3-502"
}
```


---

# 6.2 Repair API


## 创建报修


```
POST

/api/repair

```


Request:


```json
{
"type":"water",
"description":"厨房漏水",
"location":"厨房",
"urgency":"high"
}

```


Response:


```json
{
"order_id":"R202608001",
"status":"CREATED"
}

```


---

## 查询工单


```
GET

/api/repair/{id}

```


---

## 更新状态


```
PUT

/api/repair/{id}/status

```


---

# 6.3 Fee API


查询费用：

```
GET

/api/fee/{user_id}

```


---

# 6.4 Notice API


查询公告：

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

# 7. Agent Integration Interface
# Agent调用接口设计


原则：

Agent不调用数据库。


调用：

```
Agent

↓

Tool

↓

Backend API/Service

```


---

# Example


用户：

```
我要报修

```


Agent：

调用：

```
repair.create_order()

```


Backend：

执行：

```
RepairService.create()

```


数据库：

写入：

```
RepairOrder

```


---

# 8. Error Handling
# 异常处理


统一返回：

```json
{
"success":false,
"error_code":"REPAIR_001",
"message":"Invalid request"
}

```


---

# 9. Logging
# 日志设计


记录：


## Request Log

用户请求。


## Business Log

业务状态变化。


## Agent Trace Log

AI执行过程。


例如：

```
User Input

↓

Router Decision

↓

Tool Call

↓

Result

```


---

# 10. Security Design
# 安全设计


包括：

- 用户认证
- 权限控制
- 数据隔离


---

敏感数据：

例如：

- 手机号
- 身份信息


需要：

- 加密存储
- 权限访问


---

# 11. Backend Development Principles
# 后端开发原则


## Principle 1

业务逻辑必须进入 Service。


禁止：

Controller直接操作数据库。


---

## Principle 2

数据库访问统一 Repository。


---

## Principle 3

Agent只能通过Tool调用业务能力。


---

## Principle 4

每个模块必须具备：

- Model
- Schema
- Service
- API
- Test


---

# 12. Summary


Backend架构：

```
FastAPI

↓

Service Layer

↓

Repository Layer

↓

PostgreSQL


+
Agent Tool Interface

```


目标：

构建一个：

- 模块化
- 可测试
- 可扩展
- AI友好

的物业业务后端系统。
