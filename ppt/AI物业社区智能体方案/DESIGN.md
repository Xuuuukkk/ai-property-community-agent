# DESIGN.md — AI 物业社区智能体 · 视觉设计（深度版）

## 画布与母版

- 画布：1280 × 720
- 母版三区：A 标题块 0–120px（标题 36px bold）；B 内容区 120–660px；C 页脚条 660–720px（左项目名 + 右页码 `NN / 17`，14px）
- 页面 padding：上下 20px，左右 64px

## 色彩池（4 hex）

| 角色 | 色值 | 面积占比 | 用途 |
|---|---|---|---|
| 主色 | `#22395E` | ≤ 60% | 标题、色块、主视觉底 |
| 辅色 | `#172133` | ≤ 30% | 正文、深色背景块 |
| 强调色 | `#BD9B56` | ≤ 10%（Hero 15–20%） | 香槟金点睛、巨型数字、图标、金线 |
| 中性/背景 | `#FBFCFA` | 剩余 | 页面主背景、卡片底 |

## 渐变与半透明

- 深蓝渐变 `linear-gradient(135deg, #172133 0%, #22395E 100%)` 用于封面/章节扉页/结束页
- 金色浅底 `rgba(189,155,86,0.10)`、卡片阴影 `0 4px 20px rgba(23,33,51,0.08)`

## 字体系统

| 层级 | 字号 | 字重 |
|---|---|---|
| 封面主标题 | 64px | bold |
| 章节大字 | 60px | bold |
| 巨型数据 | 96px | bold（Inter） |
| 页面主标题 | 36px | bold |
| 副标题/卡片头 | 26px | bold |
| 正文 | 22px | regular |
| 小字/卡片正文 | 14-15px | regular |
| 脚注/页码 | 14px | regular |

中文思源黑体，西文与数字 Inter。

## 配图系统

| 等级 | 文件 | 类型 |
|---|---|---|
| L1 封面主视觉 | `hero_community.png` | ImageGen |
| L1 技术路线图 | 页面内 SVG | SVG（时间轴） |
| L1 架构/流程 | 页面内 SVG | SVG |
| L2 数据库 ER 图 | 页面内 SVG | SVG |
| 截图占位 | 占位框（虚线 + 说明文字） | 用户自行粘贴 |
| L3 花形角标 | 页面内 SVG | 金色 ✦ |

## 页面映射表（契约）

| # | 文件 | 类型 | 角色 | 版式 | 主视觉 | 字数 | 留白 | 色彩分配 |
|---|---|---|---|---|---|---|---|---|
| 01 | 01_cover.jsx | cover | hero | 全屏视觉+骑线文字 | hero_community.png 全幅 | 30 | 40% | 主60%辅30% |
| 02 | 02_catalog.jsx | catalog | supporting | 左标题+右内容 | — | 100 | 25% | 主40%辅20% |
| 03 | 03_section01.jsx | section | transition | 全屏视觉+大标题 | 章节字+金线 | 25 | 45% | 主55%辅30% |
| 04 | 04_painpoints.jsx | content | supporting | 非对称双栏 | 图标列表 | 200 | 28% | 主35%辅20% |
| 05 | 05_community.jsx | content | supporting | 巨型数字+洞察 | 大数字 96px | 150 | 35% | 主35%强调15% |
| 06 | 06_solution.jsx | content | supporting | 非对称双栏 | 图标 | 180 | 30% | 主35%辅20% |
| 07 | 07_section02.jsx | section | transition | 全屏视觉+大标题 | 章节字+金线 | 25 | 45% | 主55%辅30% |
| 08 | 08_roadmap.jsx | content | hero | 左大图+右侧文字 | 时间轴SVG 占左58% | 200 | 20% | 主50%强调12% |
| 09 | 09_database.jsx | content | supporting | 左标题+右内容 | ER图SVG | 180 | 24% | 主35%辅15% |
| 10 | 10_backend.jsx | content | supporting | 非对称双栏 | 架构SVG | 180 | 26% | 主35%辅15% |
| 11 | 11_frontend.jsx | content | supporting | 上大图+下方卡片 | 三端SVG + 截图占位 | 160 | 26% | 主40%辅20% |
| 12 | 12_section03.jsx | section | transition | 全屏视觉+大标题 | 章节字+金线 | 25 | 45% | 主55%辅30% |
| 13 | 13_agent.jsx | content | supporting | 左大图+右侧文字 | 架构SVG 占左58% | 180 | 22% | 主45%辅15% |
| 14 | 14_rag.jsx | content | supporting | 非对称双栏 | 流程SVG | 160 | 24% | 主35%辅15% |
| 15 | 15_features.jsx | content | supporting | 非对称版式 | 截图占位框×3 | 200 | 22% | 主35%辅20% |
| 16 | 16_evaluation.jsx | content | hero | 巨型数字+洞察 | 大数字 96px | 120 | 40% | 强调18%爆发 |
| 17 | 17_ending.jsx | ending | hero | 居中金句/巨型数字 | 金色花形 | 40 | 50% | 主55%辅30% |

## 硬约束自检

- 仅 4 hex + 2 字体家族 ✅
- 每页 ≥1 视觉锚点 ✅
- 相邻页版式不重复 ✅
- 强调色只出现在焦点元素 ✅
- 截图占位框：虚线边框 + 浅金底 + 「此处放 XX 截图」说明，尺寸 ≥ 280×180 ✅
