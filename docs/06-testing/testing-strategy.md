# Testing Strategy
# 系统测试策略


> AI Property Community Agent  
> Software Testing Specification


---

# 1. Testing Overview
# 测试概述


测试目标：

验证 AI Property Community Agent 是否满足：

- 业务功能正确
- 数据流正确
- Agent行为符合预期
- RAG回答可靠
- 系统可稳定运行


测试范围：

```
Frontend

+

Backend

+

Database

+

Agent

+

RAG

+

Deployment

```


---

# 2. Testing Principles
# 测试原则


## Principle 1

核心业务必须自动化测试。


例如：

- 创建工单
- 查询费用
- 发布公告


---

## Principle 2

AI能力必须可量化。


不能只测试：

```
看起来回答不错

```


必须测试：

```
Accuracy

Precision

Success Rate

```


---

## Principle 3

测试数据必须可复现。


使用：

```
Simulation Community Dataset

```


---

# 3. Testing Layers
# 测试分层


系统测试分为：


```
Unit Test

↓

Integration Test

↓

API Test

↓

Frontend Test

↓

Agent Test

↓

RAG Evaluation

↓

End-to-End Test

```


---

# 4. Unit Testing
# 单元测试


目标：

验证单个模块逻辑。


---

## Backend Unit Test


测试：

```
Service

Repository

Business Rule

```


例如：


RepairService：

输入：

```
repair_request

```


验证：

```
是否生成正确订单

```


---

## Example


测试：

```
create_repair_order()

```


Expected:


```
order_id exists

status = CREATED

```


---

# 5. API Testing
# API接口测试


验证：

Frontend 与 Backend 通信。


---

## User API


测试：

```
GET /users/{id}

```


验证：

返回：

```
user information

```


---

## Repair API


测试：

```
POST /repair

```


验证：

```
create order

```


---

## Fee API


测试：

```
GET /fee/{user_id}

```


验证：

```
return bill

```


---

# 6. Database Testing
# 数据库测试


验证：


## Data Integrity


例如：


```
RepairOrder

必须关联：

User

House

Worker

```


---

## Seed Data


检查：

```
Community

↓

Building

↓

House

↓

User

```


关系正确。


---

# 7. Frontend Testing
# 前端测试


测试：

- 页面加载
- 用户交互
- API调用
- 状态展示


---

## User Flow Test


场景：

```
用户登录

↓

进入服务中心

↓

创建报修

↓

查看工单

```


---

## Property Flow Test


场景：

```
物业登录

↓

查看工单

↓

分配维修

↓

更新状态

```


---

# 8. Agent Testing
# Agent测试


AI系统区别于传统系统。


需要测试：


## Intent Recognition


输入：


```
我要查物业费

```


期望：


```
intent = fee_query

```


---

## Tool Calling


输入：

```
厨房漏水

```


期望：


```
call:

create_repair_order()

```


---

## Workflow Testing


验证：

```
Input

↓

Agent Decision

↓

Tool

↓

Result

```


完整链路。


---

# 9. Integration Testing
# 集成测试


测试完整业务链。


---

## Repair Scenario


流程：


```
User

↓

Frontend

↓

Backend

↓

Agent

↓

Database

```


验证：

最终：

```
Repair Order Created

```


---

## Knowledge Scenario


流程：

```
User Question

↓

Agent

↓

Retriever

↓

Vector DB

↓

Answer

```


验证：

回答正确。


---

# 10. End-to-End Testing
# 端到端测试


模拟真实用户。


---

## Scenario 1


用户：

```
我家卫生间漏水

```


系统：

```
创建维修订单

```


---

## Scenario 2


用户：

```
我的物业费多少？

```


系统：

```
返回账单

```


---

## Scenario 3


用户：

```
装修规定是什么？

```


系统：

```
RAG回答

```


---

# 11. Test Environment
# 测试环境


推荐：


```
Docker Compose


```


包含：


```
Frontend

Backend

PostgreSQL

Redis

Vector Database

```


---

# 12. Test Data
# 测试数据


来源：

```
04-data-assets

```


包括：


```
Simulation Community

Repair Dataset

Fee Dataset

Knowledge Dataset

```


---

# 13. CI Testing
# 持续集成测试


每次代码提交：


执行：


```
Install

↓

Lint

↓

Unit Test

↓

API Test

↓

Build

```


---

# 14. Bug Management
# 缺陷管理


问题分类：


|类型|说明|
|-|-|
|Backend Bug|接口错误|
|Data Bug|数据错误|
|Agent Bug|决策错误|
|RAG Bug|知识错误|


---

# 15. Testing Completion Criteria
# 测试完成标准


MVP上线前：

必须满足：


## Backend


```
API Test Pass

```


---

## Agent


```
Intent Accuracy >= Target

Tool Calling Success

```


---

## RAG


```
Retrieval Valid

Answer Accurate

```


---

## System


```
E2E Scenario Pass

```


---

# Summary
# 总结


测试体系：


```
Software Testing

+

AI Agent Evaluation

+

RAG Evaluation


```


目标：

确保系统不仅：

“能运行”

而且：

“AI行为可验证”。
