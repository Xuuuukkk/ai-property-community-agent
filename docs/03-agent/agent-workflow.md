# Agent Workflow
# AI Agent业务流程设计


> AI Property Community Agent  
> Agent Workflow Specification


---

# 1. Workflow Overview
# 流程概述


Agent Workflow 定义：

用户请求进入系统后，AI Agent 如何：

- 理解任务
- 判断意图
- 收集信息
- 调用工具
- 执行业务
- 返回结果


整体流程：

```
User Request

↓

Conversation Manager

↓

Router Agent

↓

Domain Agent

↓

Tool Calling

↓

Business Service

↓

Database

↓

Response

```


---

# 2. General Agent Workflow
# 通用Agent流程


所有业务请求遵循：

```
                User Input


                    ↓


          1. Intent Recognition


                    ↓


          2. Context Loading


                    ↓


          3. Task Planning


                    ↓


          4. Information Collection


                    ↓


          5. Tool Execution


                    ↓


          6. Result Validation


                    ↓


          7. Response Generation


```


---

# 3. Repair Workflow
# 报修流程


## Scenario

用户：

```
我家厨房漏水了

```


---

## Workflow


```
User

↓

Personal Agent

↓

Router Agent

↓

Intent = Repair

↓

Repair Agent

↓

Extract Information

↓

Check Required Fields

↓

Create Repair Order Tool

↓

Repair Service

↓

Database

↓

Return Order Result

↓

User

```


---

# 4. Repair Information Collection
# 报修信息收集流程


Repair Agent需要确认：

| 字段 | 是否必须 |
|-|-|
| 用户身份 | 必须 |
| 房屋位置 | 必须 |
| 问题类型 | 必须 |
| 问题描述 | 必须 |
| 紧急程度 | 可选 |


---

如果信息不足：

例如：

用户：

```
我要报修

```


流程：


```
Repair Agent

↓

Missing Fields Detection

↓

Ask User

↓

Continue Workflow

```


示例：


AI：

```
请告诉我具体位置，例如：
几栋几号房，哪里出现问题？

```


---

# 5. Repair Status Query Workflow
# 工单查询流程


用户：

```
我的维修处理了吗？

```


流程：


```
User

↓

Router Agent

↓

Repair Agent

↓

Query Repair Tool

↓

Repair Service

↓

Database

↓

Return Status

```


返回：

```
您的厨房漏水工单：

编号：
R202608001

状态：
处理中

维修人员：
李师傅

预计：
今天下午处理

```


---

# 6. Fee Query Workflow
# 费用查询流程


## Scenario


用户：

```
查一下物业费

```


---

流程：

```
User

↓

Router Agent

↓

Fee Agent

↓

Identify User

↓

Get House Information Tool

↓

Query Fee Tool

↓

Fee Service

↓

Database

↓

Response

```


---

返回：

```
物业费：

金额：
720元

状态：
未缴

截止日期：
2026-08-31

```


---

# 7. Knowledge Q&A Workflow
# RAG知识问答流程


## Scenario


用户：

```
装修可以施工到几点？

```


---

流程：


```
User Question

↓

Router Agent

↓

Knowledge Agent

↓

Query Rewrite

↓

Retriever

↓

Vector Database

↓

Retrieve Documents

↓

LLM Generation

↓

Answer

```


---

# 8. RAG Retrieval Decision Flow
# 知识检索判断流程


```
Question


↓

Need External Knowledge?


      │

      ├── No

      │

      ↓

 Direct Answer


      │


      └── Yes


           ↓


      Retrieve Knowledge


           ↓


      Confidence Check


           ↓


      Generate Answer

```


---

# 9. Notice Generation Workflow
# 公告生成流程


## Scenario


物业输入：

```
明天停水维修

```


---

流程：

```
Property Staff

↓

Notice Agent

↓

Extract Event Information

↓

Generate Draft

↓

Human Review

↓

Notice Service

↓

Publish

```


---

生成内容：


```
标题

影响范围

时间

原因

注意事项

```


---

# 10. Multi-Agent Collaboration Workflow
# 多Agent协作流程


复杂任务：

例如：

```
停水通知 + 维修工单

```


流程：


```
User Request


↓

Router Agent


↓

Task Planning


↓

┌─────────────────┐

│                 │

Repair Agent   Notice Agent

│                 │

└─────────────────┘


↓

Combine Result


↓

Response User

```


---

# 11. Exception Workflow
# 异常处理流程


---

## 11.1 Missing Information


```
Agent

↓

Detect Missing Data

↓

Ask User

↓

Resume Task

```


---

## 11.2 Tool Failure


```
Tool Call

↓

Error

↓

Retry

↓

Fallback

↓

Notify User

```


---

## 11.3 Knowledge Uncertainty


```
Retrieval Score Low

↓

No Confident Answer

↓

Avoid Hallucination

↓

Recommend Human Support

```


---

# 12. Human Approval Workflow
# 人工审核流程


需要人工介入：

- 公告发布
- 高风险维修
- 特殊投诉


流程：


```
Agent Suggestion

↓

Human Review

↓

Approve / Reject

↓

Execute

```


---

# 13. Agent Evaluation Workflow
# Agent评估流程


每个Workflow需要测试。


测试结构：


```
Input

↓

Expected Intent

↓

Expected Tool

↓

Expected Result

```


Example:


输入：

```
厨房漏水

```


期望：


```
Intent:

repair


Tool:

create_repair_order


Result:

Order Created

```


---

# 14. Workflow Design Principles
# 流程设计原则


## Principle 1

业务流程必须确定。


AI不能替代业务规则。


---

## Principle 2

Agent负责：

```
理解

规划

调用

```


Service负责：

```
执行

验证

存储

```


---

## Principle 3

所有Workflow必须可测试。


---

# Summary
# 总结


核心业务Workflow：


```
Repair Workflow

Fee Workflow

Knowledge Workflow

Notice Workflow


```


统一执行模型：


```
User

↓

Agent

↓

Tool

↓

Service

↓

Database

↓

Response

```


该设计为：

- Agent开发
- 自动化测试
- RAG评估
- Codex实现

提供流程依据。
