# Database Design
# 数据库设计文档


> AI Property Community Agent  
> Database Schema Specification


---

# 1. Database Overview
# 数据库概述


本系统采用关系型数据库作为核心业务数据存储。


技术选型：

```
PostgreSQL

+

SQLAlchemy ORM

```


数据库负责：

- 用户数据
- 社区基础数据
- 房屋关系
- 维修业务
- 费用数据
- 公告数据


同时配合：

```
Vector Database

```

存储 AI 知识资产。


---

# 2. Database Architecture
# 数据库整体架构


```
                    Application


                         │


                  Service Layer


                         │


              ┌──────────┴──────────┐


              │                     │


       PostgreSQL              Vector DB


       业务数据库               AI知识库


```


---

# 3. Entity Relationship Overview
# 实体关系概览


核心实体：


```
Community

    │

    ├── Building

            │

            └── House


User

    │

    └── HouseBinding


RepairOrder

    │

    └── RepairRecord


FeeBill


Notice


KnowledgeDocument

```


---

# 4. Core Tables
# 核心数据表设计


---

# 4.1 Community Table
# 小区表


用途：

存储模拟社区基础信息。


Table:

```
community

```


字段：

| 字段 | 类型 | 描述 |
|-|-|-|
| id | bigint | 主键 |
| name | varchar | 小区名称 |
| name_en | varchar | 小区英文名称 |
| address | varchar | 地址 |
| built_year | int | 建成年份 |
| building_count | int | 楼栋总数 |
| total_households | int | 总户数 |
| parking_spaces | int | 地下停车位数量 |
| property_company | varchar | 物业服务公司全称 |
| description | text | 描述 |
| created_at | timestamp | 创建时间 |


Example:


```json
{
"id":1,
"name":"云溪花园小区",
"name_en":"Yunxi Garden Community",
"address":"上海市浦东新区张江路1268号",
"built_year":2018,
"building_count":8,
"total_households":1200,
"parking_spaces":800,
"property_company":"云溪物业服务有限公司"
}

```


---

# 4.2 Building Table
# 楼栋表


Table:

```
building

```


字段：


| 字段 | 类型 | 描述 |
|-|-|-|
| id | bigint | 主键 |
| community_id | bigint | 小区ID |
| building_no | varchar | 楼栋编号 |
| floors | int | 楼层数量 |
| unit_count | int | 单元数量 |
| elevator_config | varchar | 电梯配置 |


关系：

```
Community 1:N Building

```


---

# 4.3 House Table
# 房屋表


Table:

```
house

```


字段：


| 字段 | 类型 | 描述 |
|-|-|-|
| id | bigint | 主键 |
| building_id | bigint | 楼栋ID |
| room_no | varchar | 房号 |
| unit_no | int | 单元号 |
| floor_no | int | 楼层号 |
| area | decimal | 面积 |
| house_type | varchar | 户型 |
| status | varchar | 状态 |


Example:


```
3栋502

```


---

# 4.4 User Table
# 用户表


Table:

```
user

```


用途：

存储系统用户。


字段：


| 字段 | 类型 | 描述 |
|-|-|-|
| id | bigint | 主键 |
| username | varchar | 用户名（登录用） |
| real_name | varchar | 真实姓名 |
| phone | varchar | 手机 |
| password_hash | varchar | 密码 |
| role | varchar | 角色 |
| created_at | timestamp | 时间 |


角色：


```
OWNER

PROPERTY_STAFF

WORKER

ADMIN

```


---

# 4.5 House Binding Table
# 房屋绑定关系表


Table:

```
house_binding

```


用途：

记录用户和房屋关系。


字段：


|字段|类型|说明|
|-|-|-|
|id|bigint|主键|
|user_id|bigint|用户|
|house_id|bigint|房屋|
|relation|varchar|关系|


Example:


```
张三

↓

3栋502业主

```


---

# 4.6 Worker Table
# 维修人员表


Table:

```
worker

```


字段：


|字段|类型|说明|
|-|-|-|
|id|bigint|主键|
|user_id|bigint|用户|
|department|varchar|部门（management/engineering/cleaning/security）|
|position|varchar|岗位|
|skill_type|varchar|技能 |
|status|varchar|状态|
|hire_date|date|入职时间|


Example:


```
水电维修

空调维修

```


---

# 4.7 Repair Order Table
# 维修工单表


核心业务表。


Table:

```
repair_order

```


字段：


|字段|类型|说明|
|-|-|-|
|id|bigint|主键|
|order_no|varchar|工单编号|
|user_id|bigint|提交用户|
|house_id|bigint|房屋|
|worker_id|bigint|维修人员|
|type|varchar|类型|
|description|text|描述|
|urgency|varchar|紧急程度|
|status|varchar|状态|
|cost|decimal|维修费用（自费维修填写，公共设施为0）|
|created_at|timestamp|创建时间|
|completed_at|timestamp|完成时间|


---

状态定义：


```
CREATED

ASSIGNED

ACCEPTED

PROCESSING

COMPLETED

CLOSED

```


---

Example:


```json
{
"order_no":"R202608001",
"type":"water",
"description":"厨房漏水",
"status":"PROCESSING"
}

```


---

# 4.8 Repair Record Table
# 维修记录表


Table:

```
repair_record

```


用途：

记录维修过程。


字段：


|字段|类型|说明|
|-|-|-|
|id|bigint|主键|
|repair_id|bigint|工单|
|content|text|描述|
|image_url|varchar|图片|
|created_at|timestamp|时间|


---

# 4.9 Fee Bill Table
# 物业费用表


Table:

```
fee_bill

```


字段：


|字段|类型|说明|
|-|-|-|
|id|bigint|主键|
|house_id|bigint|房屋|
|user_id|bigint|缴费人|
|bill_type|varchar|账单类型（property_fee/parking_fee/utility_fee/maintenance_fee）|
|period|varchar|周期|
|amount|decimal|金额|
|status|varchar|状态|
|due_date|date|截止日期|
|paid_at|timestamp|实际缴费时间|


状态：


```
PAID

UNPAID

OVERDUE

```

账单类型：


```
property_fee        物业费

parking_fee          车位租赁费

utility_fee          公摊水电费

maintenance_fee      专项维修费

```


---

# 4.10 Notice Table
# 公告表


Table:

```
notice

```


字段：


|字段|类型|说明|
|-|-|-|
|id|bigint|主键|
|title|varchar|标题|
|content|text|正文|
|publisher_id|bigint|发布人|
|notice_type|varchar|公告类型|
|is_pinned|boolean|是否置顶|
|status|varchar|状态|
|created_at|timestamp|时间|


状态：


```
DRAFT

PUBLISHED

ARCHIVED

```

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


---

# 5. AI Related Data Tables
# AI相关数据


---

# 5.1 Conversation Table
# 对话记录表


Table:

```
conversation

```


用途：

保存AI聊天记录。


字段：


|字段|类型|
|-|-|
|id|bigint|
|user_id|bigint|
|session_id|varchar|
|created_at|timestamp|


---

# 5.2 Message Table
# 消息记录表


Table:

```
message

```


字段：


|字段|类型|
|-|-|
|conversation_id|bigint|
|role|varchar|
|content|text|
|agent_name|varchar|
|created_at|timestamp|


role:


```
USER

ASSISTANT

TOOL

```


---

# 5.3 Agent Trace Table
# Agent执行轨迹表


用于：

AI调试和评估。


字段：


|字段|说明|
|-|-|
|id|主键|
|session_id|会话|
|agent|Agent名称|
|tool|调用工具|
|input|输入|
|output|输出|
|created_at|时间|


---

# 6. Knowledge Database
# 知识库数据设计


知识库主要存储于：

Vector Database。


---

Document:


```
knowledge_document

```


包含：

```
document_id

title

source

metadata

embedding

```


---

Chunk:


```
knowledge_chunk

```


包含：

```
chunk_id

document_id

content

vector

```


---

# 7. Index Design
# 索引设计


重点索引：


## User


```
phone

username

```


---

## Repair


```
order_no

user_id

status

created_at

```


---

## Fee


```
house_id

status

```


---

# 8. Data Relationship Summary
# 数据关系总结


```
Community

1

↓

N

Building


Building

1

↓

N

House


House

N

↓

N

User


User

1

↓

N

RepairOrder


RepairOrder

1

↓

N

RepairRecord


House

1

↓

N

FeeBill


```


---

# 9. Database Design Principles
# 数据库设计原则


## Business Data Separation


业务数据：

PostgreSQL


AI知识：

Vector Database


---

## Agent Traceability


所有AI执行：

必须可追踪。


---

## Simulation Ready


数据库设计必须支持：

模拟真实小区数据。


---

# 10. Future Extension


未来增加：


## IoT Data


例如：

```
device

sensor_data

```


---

## Payment System


增加：

```
payment

transaction

```


---

## Smart Patrol


增加：

```
inspection_task

inspection_result

```


---

# Summary


核心数据库：

```
PostgreSQL

    |

    ├── User

    ├── Community

    ├── House

    ├── Repair

    ├── Fee

    ├── Notice


Vector DB

    |

    └── Knowledge Base

```


该设计支持：

- MVP开发
- Seed数据生成
- Agent调用
- RAG系统
- 后续智慧社区扩展
