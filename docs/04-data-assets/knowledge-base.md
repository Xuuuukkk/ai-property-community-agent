# Knowledge Base Design
# AI知识资产设计规范


> AI Property Community Agent  
> RAG Knowledge Asset Specification


---

# 1. Purpose
# 知识资产目标


AI Property Community Agent 不仅依赖业务数据库，还需要具备物业领域知识能力。


知识库用于支持：

- 社区规则问答
- 物业政策解释
- 装修规范查询
- 停车管理咨询
- 服务流程说明
- 常见问题回答


核心目标：

> 让Agent基于真实物业知识回答，而不是依靠模型猜测。


---

# 2. Knowledge Architecture
# 知识系统架构


整体流程：


```
Official Documents

官方文档


        ↓


Content Processing

内容处理


        ↓


Chunking

文档切片


        ↓


Embedding

向量化


        ↓


Vector Database

向量数据库


        ↓


Retriever

知识检索


        ↓


LLM Generation

答案生成

```


---

# 3. Knowledge Source Strategy
# 知识来源策略


知识资产来源分为三类。


---

# 3.1 Official Template Documents
# 官方模板文档


来源：

- 物业管理相关公开规范
- 行业协会模板
- 社区管理制度模板
- 政府公开管理文件


用途：

提供标准结构。


例如：


```
业主公约模板

物业服务合同模板

装修管理规定模板

停车管理规定模板

消防安全制度模板

```


---

# 3.2 Simulated Community Documents
# 模拟社区知识


根据模拟小区：

```
幸福里智慧社区

```


生成对应文档。


例如：


```
幸福里业主公约

幸福里装修管理规定

幸福里停车管理办法

幸福里物业服务手册

```


---

# 3.3 FAQ Knowledge
# 常见问题知识


来源：

真实物业客服场景。


例如：


问题：

```
装修时间是什么？

```


答案：

```
工作日：

9:00-12:00

14:00-18:00

节假日禁止产生噪音施工

```


---

# 4. Knowledge Directory Structure
# 知识库目录设计


最终知识文件结构：


```
knowledge/


├── 01-community-rules/

│
├── owner-convention.md

│
└── community-management.md


├── 02-property-service/

│
├── service-standard.md

│
└── complaint-process.md


├── 03-decoration/

│
└── decoration-management.md


├── 04-parking/

│
└── parking-rules.md


├── 05-safety/

│
├── fire-safety.md

│
└── emergency-process.md


├── 06-faq/

│
└── common-questions.md


└── 07-templates/

    ├── notice-template.md

    └── announcement-template.md

```


---

# 5. Document Format Specification
# 文档格式规范


所有知识文档统一采用 Markdown。


结构：


```markdown
# Document Title


## Purpose

文档用途


## Rules

具体规定


## Process

执行流程


## FAQ

常见问题

```


---

# Example


文件：

```
decoration-management.md

```


内容结构：


```
装修管理规定

1. 装修申请流程

2. 施工时间

3. 禁止事项

4. 验收流程

5. 常见问题

```


---

# 6. Knowledge Metadata Design
# 知识元数据设计


每个文档需要包含 Metadata。


Example:


```yaml
---
title: 装修管理规定

category: decoration

source: community_policy

community: 幸福里智慧社区

version: 1.0

updated_at: 2026-08-01

---
```


---

# 7. Chunk Strategy
# 文档切片策略


RAG检索需要合理切分。


推荐：


Chunk Size:

```
300-800 tokens

```


Overlap:

```
50-100 tokens

```


---

切分原则：


不要：

```
整篇文档作为一个Chunk

```


应该：

```
章节级Chunk

```


例如：

装修规定：

拆分：

```
施工时间

↓

装修材料

↓

审批流程

↓

违规处理

```


---

# 8. Embedding Strategy
# 向量化策略


流程：


```
Markdown

↓

Parser

↓

Chunk

↓

Embedding Model

↓

Vector Store

```


Embedding保存：


```
chunk_id

document_id

content

vector

metadata

```


---

# 9. Vector Database Design
# 向量数据库设计


推荐：


MVP：

```
Chroma

```


生产：

```
Milvus

```


存储：


```
KnowledgeChunk

```


字段：

|字段|说明|
|-|-|
|id|唯一ID|
|content|文本内容|
|embedding|向量|
|metadata|来源信息|


---

# 10. Retrieval Strategy
# 检索策略


采用：

```
Semantic Search

+

Metadata Filter

```


例如：


用户：

```
装修几点可以施工？

```


检索：


```
category = decoration

↓

semantic similarity

```


---

# 11. RAG Answer Rules
# RAG回答规则


Agent生成答案时：


必须：

- 基于检索结果
- 引用知识来源
- 避免编造


---

如果没有找到：

返回：


```
当前知识库暂无相关规定，

建议联系物业客服确认。

```


---

# 12. Knowledge Update Process
# 知识更新流程


流程：


```
New Document

↓

Review

↓

Upload

↓

Embedding

↓

Vector Database Update

↓

Available

```


---

# 13. Knowledge Evaluation Preparation
# 知识评估准备


为后续：

```
06-testing/ai-evaluation.md

```


准备数据。


包括：


## Question Dataset


例如：

```
装修施工时间？

物业费缴纳时间？

停车规则？

```


---

## Expected Answer


保存：

```
标准答案

来源文档

关键字段

```


---

# 14. Future Expansion
# 后续扩展


未来增加：


## Multimodal Knowledge


支持：

- 图片
- PDF
- 视频


---

## Dynamic Knowledge


接入：

- 实时公告
- 天气
- 停水停电信息


---

# Summary
# 总结


知识资产体系：


```
Official Templates

        ↓

Simulated Community Documents

        ↓

Markdown Knowledge Base

        ↓

Embedding

        ↓

Vector Database

        ↓

RAG Agent

        ↓

Answer User

```


目标：

构建一个：

- 可检索
- 可验证
- 可更新
- 可扩展

的物业AI知识体系。
