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
云溪花园小区

(Yunxi Garden Community)

```


基本信息：

| 项目 | 数据 |
|-|-|
| 城市 | 上海市浦东新区 |
| 详细地址 | 张江路1268号 |
| 建成年份 | 2018 |
| 社区类型 | 商品住宅 |
| 总户数 | 1200户 |
| 楼栋数量 | 8栋高层住宅楼 |
| 地下停车位 | 800个 |
| 物业公司 | 云溪物业服务有限公司 |
| 物业费标准 | 2.8元/㎡/月 |


---

# 3. Community Structure
# 社区空间结构


整体结构：

```
云溪花园小区


├── 1号楼

│   ├── 1单元

│   └── 2单元

├── 2号楼

├── 3号楼

├── 4号楼

├── 5号楼

├── 6号楼

├── 7号楼

└── 8号楼


```


---

# 4. Building Data
# 楼栋数据


每栋楼：


```
26层

2个单元

每层4户

```


计算：

```
26 × 2 × 4

=

208户/栋

```


实际模拟：

```
8栋 × 208户

=

1664户（含空置房源）

实际入住约1200户

```


数据：

```json
{
"building_no":"1号楼",
"floors":26,
"unit_count":2,
"elevator_config":"2部/单元"
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
"room_no":"1-2-502",
"area":89,
"house_type":"三室两厅"
}

```


---

# 6. Resident Data
# 业主数据


模拟：

```
1200户

≈

3000居民

```


用户角色：

```
OWNER

```


数据：

```json
{
"real_name":"张伟",
"phone":"138****1234",
"house":"1-2-502"
}

```


---

# 7. Property Staff Data
# 物业人员数据


模拟：


```
物业管理员 10人

工程维修人员 15人

保洁人员 20人

安保秩序人员 30人

合计 75人

```


角色：


```
ADMIN

WORKER

CLEANER

SECURITY

```


---

# 8. Worker Data
# 维修人员数据


维修团队（15人）：


|人员|技能|
|-|-|
|李师傅|水电维修|
|王师傅|电梯维保|
|赵师傅|管道疏通|
|陈师傅|弱电维修|
|刘师傅|门窗维修|
|...|...|


技能分类：


```
water_electric

elevator_maintenance

pipeline_dredging

weak_current

door_window_repair

```


---

# 9. Repair Order Dataset
# 历史维修工单数据


用于：

测试Repair Agent。


模拟：

过去6个月：

```
50条工单（种子数据）

```


---

工单类型：


|类型|枚举值|说明|
|-|-|-|
|厨卫漏水|water_leak|水管破裂、下水道堵塞|
|电梯故障|elevator_fault|电梯停运、异响|
|门禁损坏|access_control|门禁系统失效|
|水电跳闸|power_trip|断电、跳闸|
|墙面渗水|wall_seepage|外墙渗水、返潮|
|公共设施损坏|public_facility|路灯、健身器材等|


---

状态分布：


```
COMPLETED

已完成


PROCESSING

维修中


ASSIGNED

已派单


CREATED

待派单


CLOSED

已关闭

```


---

示例：

```json
{
"order_no":"R202507001",
"type":"water_leak",
"description":"厨房水管漏水，地板都泡了",
"urgency":"NORMAL",
"status":"COMPLETED",
"cost":150.00
}

```


---

# 10. Fee Dataset
# 物业费用数据


模拟：

每户生成：


```
物业费 (property_fee)

车位租赁费 (parking_fee)

公摊水电费 (utility_fee)

专项维修费 (maintenance_fee)

```


---

字段：


```
house_id

bill_type

period

amount

status

due_date

paid_at

```


---

示例：


```json
{
"house":"1-2-502",
"bill_type":"property_fee",
"amount":249.20,
"period":"2025-07",
"status":"UNPAID",
"due_date":"2025-08-15"
}

```


---

# 11. Notice Dataset
# 社区公告数据


模拟历史公告：


数量：

```
24条（种子数据）

```


类型：


|类型|枚举值|示例|
|-|-|-|
|停水停电通知|water_power_outage|管道维修、设备维护|
|电梯季度维保|elevator_maintenance|电梯定期保养|
|消防巡检|fire_inspection|消防设备检查|
|社区活动|community_activity|中秋活动、迎新春|
|公共收益公示|public_revenue|半年公共收益公示|
|业委会通知|committee_notice|业委会换届|
|高温温馨提示|weather_alert|防暑降温提醒|
|设施通知|facility_notice|电动车充电规范|


---

示例：

```json
{
"title":"关于1号楼停水维修通知",
"notice_type":"water_power_outage",
"is_pinned":true
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

## AI Knowledge Data


存储：

```
pgvector (PostgreSQL Extension)

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
data/seed/

├── community.sql

├── buildings.sql

├── houses.sql

├── users.sql

├── workers.sql

├── repair_orders.sql

├── fee_bills.sql

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
