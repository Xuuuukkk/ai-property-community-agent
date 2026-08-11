# AI Evaluation
# AI能力评估方案


> AI Property Community Agent  
> Agent & RAG Evaluation Specification


---

# 1. Evaluation Overview
# 评估概述


传统软件测试主要验证：

```
Input

↓

Output

```


AI Agent系统需要额外验证：


```
Input

↓

Understanding

↓

Decision

↓

Tool Selection

↓

Knowledge Retrieval

↓

Final Answer

```


因此AI评估分为：


```
Agent Evaluation

+

RAG Evaluation

+

End-to-End AI Evaluation

```


---

# 2. Evaluation Goals
# 评估目标


确保AI Agent具备：


## Understanding Ability


能够正确理解用户需求。


---

## Decision Ability


能够选择正确Agent。


---

## Execution Ability


能够正确调用工具。


---

## Knowledge Ability


能够基于知识库回答。


---

## Reliability


减少：

- 幻觉
- 错误执行
- 无依据回答


---

# 3. Evaluation Dataset
# 评估数据集


所有AI评估基于测试数据集。


目录：


```
evaluation/


├── intent_cases.json


├── tool_cases.json


├── workflow_cases.json


├── rag_questions.json


└── expected_answers.json

```


---

# 4. Agent Evaluation
# Agent评估


---

# 4.1 Intent Classification Evaluation
# 意图识别评估


目标：

验证Router Agent。


---

## Dataset Example


输入：

```
我要查一下物业费

```


Expected:


```json
{
"intent":"fee_query"
}

```


---

输入：

```
厨房水管坏了

```


Expected:


```json
{
"intent":"repair"
}

```


---

## Metrics


指标：


### Accuracy


公式：


```
Correct Intent

----------------

Total Cases

```


目标：

```
>=95%

```


---

# 4.2 Tool Calling Evaluation
# 工具调用评估


目标：

验证Agent是否调用正确Tool。


---

Example:


Input:


```
我家漏水

```


Expected:


```
create_repair_order()

```


---

Metrics:


## Tool Selection Accuracy


正确Tool次数：

```
/

总测试次数

```


---

## Parameter Extraction Accuracy


验证：

Agent是否正确提取：


```
问题类型

位置

描述

紧急程度

```


---

# 4.3 Workflow Completion Evaluation
# 流程完成率评估


验证完整任务。


例如：


```
用户报修

↓

创建订单

↓

返回编号

```


---

指标：


## Task Success Rate


公式：


```
Completed Tasks

-----------------

Total Tasks

```


---

# 5. Agent Safety Evaluation
# Agent安全性评估


测试：

---

## Hallucination Test


输入：

```
小区有没有游泳池？

```


如果知识库没有：

正确：

```
无法确认

```


错误：

```
编造存在

```


---

## Permission Test


验证：

不同角色权限。


例如：

业主：

不能：

```
删除公告

```


---

# 6. RAG Evaluation
# RAG知识准确率评估


RAG是本项目核心能力。


评估：

```
Retrieval Quality

+

Generation Quality

```


---

# 7. Retrieval Evaluation
# 检索能力评估


目标：

验证：

Vector Search是否找到正确文档。


---

## Dataset


格式：


```json
{
"question":"装修时间规定是什么",

"expected_document":
"decoration-management.md"
}

```


---

# 7.1 Recall@K


指标：

```
Top K检索结果

是否包含正确文档

```


例如：

Recall@5：


前5个结果是否包含目标文档。


---

# 7.2 MRR
# Mean Reciprocal Rank


衡量：

正确文档排名。


公式：

```
1 / rank

```


例如：

第一名：

```
1

```


第五名：

```
0.2

```


---

# 8. Answer Evaluation
# 答案生成评估


---

# 8.1 Faithfulness
# 忠实度


问题：

答案是否来自知识库。


例如：

知识库：

```
施工时间：

9:00-18:00

```


答案：

```
每天9点到18点

```


正确。


---

答案：

```
晚上22点也可以

```


错误。


---

# 8.2 Answer Accuracy
# 答案准确率


比较：

```
AI Answer

vs

Expected Answer

```


---

# 8.3 Completeness
# 完整性


验证：

是否遗漏关键内容。


例如：

装修规定应该包含：

- 时间
- 申请
- 禁止事项


---

# 9. RAG Evaluation Dataset Example
# RAG测试样例


文件：

```
rag_questions.json

```


示例：


```json
[
{
"question":
"装修什么时候可以施工?",

"source":
"decoration-management.md",

"expected":
"工作日9:00-18:00"
}

]

```


---

# 10. End-to-End AI Evaluation
# 端到端评估


模拟真实用户。


---

## Case 1
# 报修


Input:


```
我家厨房漏水

```


Expected Flow:


```
Router

↓

Repair Agent

↓

create_repair_order()

↓

Return Order ID

```


---

## Case 2
# 费用查询


Input:


```
查询物业费

```


Expected:


```
Fee Agent

↓

query_fee()

↓

Return Bill

```


---

## Case 3
# 社区问答


Input:


```
装修需要申请吗？

```


Expected:


```
Knowledge Agent

↓

RAG

↓

Answer

```


---

# 11. Evaluation Automation
# 自动化评估


推荐流程：


```
Evaluation Dataset

↓

Run Agent

↓

Collect Trace

↓

Compare Expected

↓

Generate Report

```


---

# 12. Evaluation Report
# 评估报告


输出：


```
AI Evaluation Report


├── Intent Accuracy

├── Tool Accuracy

├── Workflow Success

├── Retrieval Recall

├── Answer Accuracy

└── Failure Cases

```


---

# 13. Continuous Improvement
# 持续优化


发现问题：

```
Failure Case

↓

Analyze

↓

Update Prompt

↓

Update Knowledge

↓

Re-test

```


---

# 14. MVP Evaluation Target
# MVP目标指标


|指标|目标|
|-|-|
|Intent Accuracy|≥95%|
|Tool Calling Accuracy|≥95%|
|Workflow Success|≥90%|
|RAG Recall@5|≥90%|
|Answer Accuracy|≥85%|


---

# Summary
# 总结


AI评估体系：


```
Agent Evaluation

        +

RAG Evaluation

        +

E2E Evaluation


```


目标：

证明AI Agent不仅：

“能回答”

而且：

“能正确执行物业业务”。
