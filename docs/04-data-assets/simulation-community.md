# Simulation Community Data Design
# 模拟社区数据资产设计


> AI Property Community Agent  
> Virtual Community Dataset Specification


---

# 1. Purpose
# 数据资产目标


为了验证 AI Property Community Agent 的实际能力，需要构建一个完整的模拟物业社区。


该模拟社区用于：

- 开发阶段测试
- Agent Workflow验证
- RAG问答测试
- 数据查询测试
- Demo演示


目标：

> 构建一个接近真实物业管理场景的数字化社区。


---

# 2. Simulation Community Overview
# 模拟小区概览


社区名称：

```
幸福里智慧社区

```


基本信息：

| 项目 | 数据 |
|-|-|
| 城市 | 深圳 |
| 建成年份 | 2020 |
| 社区类型 | 商品住宅 |
| 总户数 | 600户 |
| 楼栋数量 | 6栋 |
| 地下停车位 | 350个 |
| 物业公司 | 幸福里物业服务有限公司 |


---

# 3. Community Structure
# 社区空间结构


整体结构：

```
幸福里智慧社区


├── 1栋

│   ├── 1单元

│   ├── 2单元

│   └── 3单元


├── 2栋

├── 3栋

├── 4栋

├── 5栋

└── 6栋


```


---

# 4. Building Data
# 楼栋数据


每栋楼：


```
20层

2个单元

每层4户

```


计算：

```
20 × 2 × 4

=

160户/栋

```


实际模拟：

```
6栋 × 100户

=

600户

```


数据：

```json
{
"building_no":"3栋",
"floors":20,
"units":2
}

```


---

# 5. House Data
# 房屋数据


每个房屋包含：


|字段|说明|
|-|-|
|house_id|房屋ID|
|building|楼栋|
|unit|单元|
|floor|楼层|
|room|房号|
|area|面积|
|type|户型|
|owner|业主|


示例：

```json
{
"house_no":"3-2-502",
"area":89,
"type":"三室两厅"
}

```


---

# 6. Resident Data
# 业主数据


模拟：

```
600户

≈

1500居民

```


用户角色：

```
OWNER

```


数据：

```json
{
"name":"张伟",
"phone":"138xxxx",
"house":"3-502"
}

```


---

# 7. Property Staff Data
# 物业人员数据


模拟：


```
物业经理 1人

客服人员 5人

工程人员 8人

保安 12人

保洁 10人

```


角色：


```
PROPERTY_MANAGER

CUSTOMER_SERVICE

ENGINEER

SECURITY

CLEANER

```


---

# 8. Worker Data
# 维修人员数据


维修团队：


|人员|技能|
|-|-|
|李师傅|水电维修|
|王师傅|空调维修|
|赵师傅|电梯维护|
|陈师傅|门窗维修|


技能分类：


```
water

electric

air_condition

elevator

```


---

# 9. Repair Order Dataset
# 历史维修工单数据


用于：

测试Repair Agent。


模拟：

过去6个月：

```
3000条工单

```


---

工单类型：


|类型|比例|
|-|-|
|漏水|30%|
|电路问题|25%|
|空调维修|20%|
|门窗维修|15%|
|其他|10%|


---

状态分布：


```
COMPLETED

80%


PROCESSING

10%


CREATED

5%


CLOSED

5%

```


---

示例：

```json
{
"order_no":"R202607001",
"type":"water",
"description":"厨房水管漏水",
"status":"COMPLETED"
}

```


---

# 10. Fee Dataset
# 物业费用数据


模拟：

每户生成：


```
物业费

停车费

维修基金

```


---

字段：


```
house_id

period

amount

status

due_date

```


---

示例：


```json
{
"house":"3-502",
"fee":"物业费",
"amount":720,
"status":"UNPAID"
}

```


---

# 11. Notice Dataset
# 社区公告数据


模拟历史公告：


数量：

```
200条

```


类型：


|类型|示例|
|-|-|
|停水通知|管道维修|
|停电通知|设备维护|
|活动公告|社区活动|
|安全提醒|消防检查|


---

示例：

```json
{
"title":"关于3栋停水维修通知",
"category":"maintenance"
}

```


---

# 12. AI Test Scenario Dataset
# AI测试场景数据


专门用于Agent Evaluation。


---

# Repair Test Cases


输入：

```
我家厨房漏水了

```


期望：


```
Intent:

repair


Tool:

create_repair_order

```


---

# Fee Test Cases


输入：

```
帮我查物业费

```


期望：


```
Intent:

fee_query


Tool:

query_fee

```


---

# Knowledge Test Cases


输入：

```
装修允许施工到几点？

```


期望：


```
Knowledge Agent

↓

RAG Retrieval

```


---

# 13. Data Storage Strategy
# 数据存储方案


## Business Data


存储：

```
PostgreSQL

```


包括：

```
User

House

RepairOrder

FeeBill

Notice

```


---

## AI Knowledge Data


存储：

```
Vector Database

```


包括：

```
Community Rules

FAQ

Management Documents

```


---

# 14. Seed Data Generation
# 初始化数据生成


项目提供：

```
seed/

├── community.sql

├── users.sql

├── houses.sql

├── repairs.sql

├── fees.sql

└── notices.sql

```


执行：


```
docker compose up

↓

database migration

↓

seed import

```


---

# 15. Data Generation Rules
# 数据生成规则


要求：

## Consistency


例如：

房屋必须属于楼栋。


```
House

belongs to

Building

```


---

## Realism


数据需要符合真实物业场景。


例如：

维修记录：

- 有时间
- 有状态
- 有人员


---

## Diversity


覆盖：

- 正常用户
- 高频报修
- 欠费用户
- 历史公告


---

# 16. Future Data Expansion
# 后续扩展


未来增加：


## IoT Data


```
sensor

device

alarm

```


---

## Security Data


```
patrol_task

camera_event

```


---

## Community Operation Data


```
activity

feedback

complaint

```


---

# Summary
# 总结


模拟社区数据资产包含：


```
Community

↓

Building

↓

House

↓

Resident


+

Repair History

+

Fee Records

+

Notice Records

+

Knowledge Documents

```


该数据资产用于：

- Agent测试
- RAG验证
- Demo展示
- 系统开发


目标：

构建一个可运行、可验证的数字化物业社区环境。
