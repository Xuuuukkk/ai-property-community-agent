# User Scenarios
# 用户角色与业务场景分析


> AI Property Community Agent  
> 用户、角色与核心业务流程定义


---

# 1. Overview
# 场景概述


AI Property Community Agent 面向真实物业社区环境设计。

系统模拟一个完整社区生态：

```
业主 Owner

        ↓

AI社区助手

        ↓

物业 Staff

        ↓

维修 Worker

        ↓

社区服务闭环

```


系统核心目标：

通过 AI Agent 连接社区中的不同角色，使传统物业流程智能化。


---

# 2. User Roles
# 用户角色定义


系统包含四类核心角色：


| Role | 中文 | 主要职责 |
|---|---|---|
| Owner | 业主 | 使用社区服务 |
| Property Staff | 物业工作人员 | 管理社区事务 |
| Worker | 维修人员 | 执行维修任务 |
| Admin | 系统管理员 | 管理系统配置 |


---

# 3. Owner Scenario
# 业主使用场景


## 3.1 AI咨询


### 场景描述


业主希望快速获取社区信息。


传统方式：

```
查看物业群

↓

询问物业

↓

等待回复

```


AI方式：

```
打开AI助手

↓

输入问题

↓

立即获得回答

```


---

### 示例


用户：

```
小区晚上几点以后不能装修？

```


AI：

```
根据《装修管理规定》：

工作日装修时间为：

8:00-12:00

14:00-18:00

晚间禁止施工。

```


---

### 涉及Agent


```
Router Agent

↓

Knowledge Agent

↓

RAG System

```


---

# 3.2 报修场景
# Repair Scenario


## 用户需求


业主发现家庭设备故障。


例如：

```
厨房漏水

空调坏了

电梯故障

```


---

## 传统流程


```
发现问题

↓

联系物业

↓

人工登记

↓

等待派单

↓

维修

```


---

## AI流程


```
用户：

厨房漏水


↓

AI Assistant


↓

Repair Agent


↓

收集信息


↓

创建工单


↓

通知物业


↓

维修处理


↓

反馈用户

```


---

## AI需要收集的信息


| 字段 | 示例 |
|-|-|
| 问题类型 | 水管漏水 |
| 位置 | 厨房 |
| 房屋 | 3栋502 |
| 紧急程度 | 高 |
| 描述 | 持续漏水 |


---

## 涉及Agent


```
Router Agent

↓

Repair Agent

↓

Repair Service

```


---

# 3.3 物业费查询场景
# Fee Query Scenario


## 用户需求


用户：

```
帮我查一下物业费

```


---

## AI流程


```
用户身份确认

↓

查询绑定房屋

↓

查询账单

↓

返回结果

```


---

## 返回信息


例如：

```
房屋：

3栋502


本期物业费：

720元


状态：

未缴


截止日期：

2026-08-31

```


---

## 涉及Agent


```
Router Agent

↓

Fee Agent

↓

Fee Service

```


---

# 3.4 工单查询场景
# Repair Tracking Scenario


## 用户需求


查看维修进度。


例如：

```
我的报修处理了吗？

```


---

## AI流程


```
识别用户

↓

查询历史工单

↓

返回状态

```


---

返回：

```
工单编号：

R202608001


状态：

维修处理中


维修人员：

李师傅

```


---

# 4. Property Staff Scenario
# 物业工作人员场景


---

# 4.1 工单管理


## 场景


物业每天处理大量维修请求。


---

## AI辅助流程


```
新工单产生

↓

AI分类

↓

物业查看

↓

分配维修人员

```


---

## AI能力


自动：

- 分类维修类型
- 判断紧急程度
- 推荐处理优先级


---

# 4.2 公告生成


## 场景


物业需要发布通知。


例如：

输入：

```
明天停水维修

```


AI生成：


标题：

```
关于社区供水系统维护的通知

```


正文：

```
尊敬的业主：

因设备维护需要...
```


---

## 涉及Agent


```
Notice Agent

↓

Knowledge Base

```


---

# 4.3 社区知识查询


## 场景


物业工作人员查询制度。


例如：

```
业主装修违规怎么处理？

```


AI：

```
根据装修管理规定：

需要提交整改通知...

```


---

# 5. Worker Scenario
# 维修人员场景


---

# 5.1 查看任务


维修人员登录：

查看：

```
今日任务


R202608001

3栋502

厨房漏水

紧急程度：高

```


---

# 5.2 接单处理


流程：

```
收到任务

↓

接受

↓

前往维修

↓

更新状态

```


状态：

```
ASSIGNED

↓

ACCEPTED

↓

PROCESSING

↓

COMPLETED

```


---

# 5.3 完成反馈


维修完成：

上传：

- 图片
- 维修说明
- 使用材料


系统：

更新工单状态。


---

# 6. Admin Scenario
# 管理员场景


---

## 系统管理


管理员负责：

- 用户权限
- 系统配置
- 数据管理


---

# 7. End-to-End Business Scenarios
# 端到端业务流程


---

# Scenario 1:
# AI报修闭环


完整流程：

```
Owner

↓

AI Assistant

↓

Router Agent

↓

Repair Agent

↓

Repair Service

↓

Database

↓

Property Staff

↓

Worker

↓

Completion

↓

Owner Feedback

```


---

# Scenario 2:
# 社区知识问答


流程：

```
拥有者

↓

AI Assistant

↓

Router Agent

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

# Scenario 3:
# 公告生成


流程：

```
Property Staff

↓

Notice Agent

↓

Knowledge Base

↓

Generate Notice

↓

Human Review

↓

Publish

```


---

# 8. Scenario Coverage Matrix
# 场景覆盖矩阵


| 场景 |拥有者| Staff | Worker | Agent |
|-|-|-|-|-|
| AI咨询 | ✅ | ✅ | - | Knowledge Agent |
| 报修 | ✅ | ✅ | ✅ | Repair Agent |
| 费用查询 | ✅ | - | - | Fee Agent |
| 公告 | 查看 | 发布 | - | Notice Agent |
| 工单 | 查看 | 管理 | 处理 | Repair Agent |


---

# 9. Design Principles
# 设计原则


## User First

用户通过自然语言表达需求。


---

## Workflow Driven

AI必须推动业务流程，而不是只生成文本。


---

## Human In The Loop

关键操作保留人工确认。


例如：

- 公告发布
- 工单关闭


---

## Data Grounded

AI回答必须基于：

- 业务数据库
- 知识库


避免幻觉。


---

# Summary


本章节定义了 AI Property Community Agent 的核心用户和业务场景。

后续章节：

- PRD
- Agent Workflow
- API Design
- Testing Scenario

均基于本章节展开。
