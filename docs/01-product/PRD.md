# Product Requirement Document (PRD)
# 产品需求文档


> AI Property Community Agent  
> AI驱动的物业社区管理智能体


---

# 1. Product Overview
# 产品概述


## 1.1 Product Name

AI Property Community Agent

中文：

AI物业社区管理智能体


---

## 1.2 Product Positioning

本产品是一个 AI Native 物业社区管理平台。

通过：

```
AI Assistant

+

Agent System

+

Property Business System

+

Knowledge Base

```

为社区中的不同角色提供智能化服务。


---

# 2. Product Goals
# 产品目标


## 2.1 Core Goal


构建一个能够完成真实物业业务闭环的 AI Agent 系统。


核心流程：

```
用户提出需求

↓

AI理解需求

↓

调用业务能力

↓

完成任务

↓

反馈结果

```


---

## 2.2 MVP Goals


MVP阶段验证：

1. AI是否可以理解物业业务需求
2. Agent是否可以调用业务工具
3. 系统是否可以完成业务闭环
4. RAG是否可以准确回答社区知识问题


---

# 3. Product Scope
# 产品范围


系统包含三个用户端：

```
                 AI Property Agent


        ┌────────────┼────────────┐


      Owner        Staff       Worker


      业主          物业        维修人员

```

---

# 4. Owner Application
# 业主端设计


## 4.1 Home Page
# 首页


## 产品目标

提供社区服务入口。


页面结构：

```
--------------------------------

用户信息

--------------------------------

AI社区助手入口


--------------------------------

快捷服务


报修

费用查询

公告

我的工单


--------------------------------

```

---

## 功能列表


| 功能 | 描述 |
|-|-|
| AI入口 | 进入AI聊天 |
| 快捷服务 | 常用功能入口 |
| 公告提醒 | 查看社区消息 |


---

# 4.2 AI Assistant
# AI助手


## 产品目标


作为所有社区服务统一入口。


---

## 输入方式


MVP：

- 文本输入


未来：

- 图片
- 语音


---

## 核心流程


```
用户输入

↓

Personal Agent

↓

Router Agent

↓

Domain Agent

↓

Tool

↓

Business Service

↓

Response

```


---

## 示例


用户：

```
我家厨房漏水

```


系统：


```
识别：

repair


调用：

Repair Agent


创建：

维修工单

```


返回：


```
您的维修工单已经创建：

编号：
R202608001


状态：
待处理

```


---

# 4.3 Service Center
# 服务中心


提供传统业务入口。


结构：

```
服务中心


├── 我要报修

├── 费用查询

├── 投诉建议

└── 社区服务

```


---

# 4.3.1 Repair Service
# 报修服务


## 功能目标


实现完整维修闭环。


---

## 用户流程


```
提交问题

↓

AI补充信息

↓

创建工单

↓

物业处理

↓

维修执行

↓

完成反馈

```


---

## 报修字段


| 字段 | 示例 |
|-|-|
| 类型 | 水管维修 |
| 描述 | 厨房漏水 |
| 地址 | 3栋502 |
| 紧急程度 | 高 |
| 图片 | 可选 |


---

## 工单状态


```
CREATED

↓

ASSIGNED

↓

ACCEPTED

↓

PROCESSING

↓

COMPLETED

↓

CLOSED

```


---

# 4.3.2 Fee Query
# 费用查询


## 功能目标


查询物业费用信息。


---

## 展示内容


例如：

```
房屋：

3栋502


本期物业费：

720元


状态：

未缴


截止时间：

2026-08-31

```


---

# 4.3.3 Community Notice
# 社区公告


功能：

- 查看公告
- AI摘要


例如：

```
停水通知

电梯维护通知

社区活动通知

```


---

# 4.4 Repair Order
# 我的工单


展示：

```
工单编号

问题描述

当前状态

维修人员

更新时间

```


---

# 4.5 User Profile
# 我的


功能：

- 用户信息
- 房屋信息
- 历史记录


---

# 5. Property Admin System
# 物业管理端


---

# 5.1 Dashboard


展示：


```
今日报修：

20


处理中：

8


已完成：

12

```


---

# 5.2 Repair Management


功能：


- 查看工单
- 分配人员
- 修改状态
- 关闭工单


---

# 5.3 User Management


管理：

- 用户
- 房屋
- 绑定关系


---

# 5.4 Notice Management


功能：


输入：

```
明天停水维修

```


AI生成：

```
标题

正文

发布时间

影响范围

```


物业审核后发布。


---

# 6. Worker Application
# 维修人员端


---

# 6.1 Task List


展示：


```
今日任务


R202608001

3栋502

厨房漏水

```


---

# 6.2 Task Detail


展示：

- 用户信息
- 问题描述
- 地址
- 紧急程度


---

# 6.3 Status Update


操作：

```
接受任务

↓

开始维修

↓

完成维修

```


---

# 7. AI Agent Product Design
# AI能力设计


---

# 7.1 Personal Agent


职责：

用户统一入口。


负责：

- 对话管理
- 上下文维护
- 调度Agent


---

# 7.2 Router Agent


职责：

识别用户意图。


示例：


输入：

```
查物业费

```


输出：

```
Fee Agent

```


---

# 7.3 Repair Agent


能力：

- 提取维修信息
- 创建工单
- 查询状态
- 通知用户


---

# 7.4 Fee Agent


能力：

- 查询账单
- 返回费用状态


---

# 7.5 Knowledge Agent


能力：

- 社区制度查询
- RAG问答


---

# 7.6 Notice Agent


能力：

- 公告生成
- 文案优化


---

# 8. Core Business Flow
# 核心业务流程


## 报修流程


```
Owner

↓

AI Assistant

↓

Repair Agent

↓

Create Order

↓

Property Staff

↓

Worker

↓

Complete

↓

Feedback

```


---

## 知识问答流程


```
User

↓

Knowledge Agent

↓

RAG Retrieval

↓

LLM

↓

Answer

```


---

# 9. MVP Acceptance Criteria
# MVP验收标准


---

## Case 1: AI报修


输入：

```
厨房漏水

```


必须：

✅ 识别维修需求

✅ 创建工单

✅ 生成编号

✅ 物业可查看

✅ 维修员可处理


---

## Case 2: 费用查询


输入：

```
查物业费

```


必须：

✅ 返回账单

✅ 返回状态


---

## Case 3: 知识问答


输入：

```
装修时间规定是什么？

```


必须：

✅ 检索知识库

✅ 返回准确答案

✅ 提供来源


---

# 10. Product Summary


MVP版本核心：

```
AI Assistant

+

Repair Workflow

+

Property Management

+

Knowledge Base

+

Community Data

```


最终目标：

打造一个可验证、可扩展的 AI Native 智慧物业社区平台。
