# 前端交接文档 —— AI 物业社区智能体平台

> 目标：把当前极简版前端 UI 外包重做成更美观、更专业的物业管理系统界面。
> 当前状态：Phase 4 已完成，功能已跑通，仅 UI 简陋。

---

## 一、项目位置

本地仓库根目录：

```
D:\Projects\ai-property-community-agent
```

前端代码目录：

```
D:\Projects\ai-property-community-agent\frontend
```

---

## 二、技术栈

| 层 | 技术 | 版本 |
|---|---|---|
| 框架 | React | 18.3.1 |
| 构建工具 | Vite | 5.4.2 |
| 语言 | TypeScript | 5.5.4 |
| 路由 | react-router-dom | 6.26.0（目前只是单页 Tab 切换，未启用路由） |
| 样式 | 原生 CSS | 全部写在 `src/index.css` |
| UI 组件库 | 无 | 当前未引入 Ant Design / Element Plus / Tailwind 等 |
| HTTP 请求 | fetch | 封装在 `src/api/client.ts` |
| 容器化 | Docker + nginx | `frontend/Dockerfile` + `frontend/nginx.conf` |

**外包自由度**：
- 可引入任意 React UI 组件库（推荐 Ant Design 5、Arco Design、MUI、TDesign）。
- 可改用 Tailwind / styled-components / Less / Sass。
- 可把当前「单页 Tab」改成「侧边栏 + 路由页面」。
- **不要改动后端 API 路径和返回结构**。

---

## 三、前端文件完整清单

```
frontend/
├── package.json              # 依赖与脚本
├── package-lock.json         # 锁定版本
├── tsconfig.json             # TS 根配置
├── tsconfig.app.json         # 应用 TS 配置
├── tsconfig.node.json        # Vite/Node TS 配置
├── vite.config.ts            # Vite 配置（含 /api 开发代理）
├── index.html                # 入口 HTML
├── Dockerfile                # 多阶段构建镜像
├── nginx.conf                # 生产环境 /api 反向代理
├── .dockerignore             # Docker 构建忽略
└── src/
    ├── main.tsx              # React 应用挂载入口
    ├── App.tsx               # 根组件：顶部标题 + Tab 导航 + 页面切换
    ├── index.css             # 全局样式（当前所有样式在这里）
    ├── vite-env.d.ts         # Vite 类型声明
    ├── api/
    │   ├── client.ts         # 统一 fetch 封装 + 所有 API 方法
    │   └── types.ts          # TypeScript 接口定义
    └── components/
        ├── UserSearch.tsx    # 业主查询页面
        ├── RepairList.tsx    # 维修工单列表 + 创建工单
        ├── FeeList.tsx       # 物业费用账单查询
        └── NoticeBoard.tsx   # 公告列表 + 发布公告
```

---

## 四、各文件职责详解

### 4.1 `src/main.tsx`
React 入口。调用 `ReactDOM.createRoot` 渲染 `<App />`。

### 4.2 `src/App.tsx`
当前页面骨架：
- 顶部 header：标题「AI 物业社区管理平台」+ 副标题
- 顶部 Tab 导航：维修工单 / 业主查询 / 物业费用 / 公告通知
- 根据 `activeTab` 条件渲染四个组件

**改造建议**：
- 可改成左侧菜单 + 右侧内容区的布局。
- 如需要多页面，可把 Tab 改成 `react-router-dom` 路由（依赖已安装）。

### 4.3 `src/index.css`
当前所有样式都写在这里。关键 class：

| class | 用途 |
|---|---|
| `.app-header` | 顶部标题栏 |
| `.nav-tabs` / `.nav-tab` | Tab 导航 |
| `.card` | 白色卡片容器 |
| `.form-row` | 表单行布局 |
| `.pagination` | 分页按钮区 |
| `.badge` | 状态标签（颜色按 status 后缀匹配） |
| `.error` / `.success` | 错误/成功提示 |

**状态色映射**（当前写死）：
- 橙：CREATED / UNPAID / DRAFT
- 蓝：ASSIGNED / PROCESSING
- 绿：COMPLETED / PAID / PUBLISHED
- 灰：CLOSED / OVERDUE / ARCHIVED

### 4.4 `src/api/client.ts`
所有 HTTP 请求封装。

已提供方法：

```ts
api.getUser(id: number)                         -> GET  /api/users/{id}
api.listRepairs({page, page_size, user_id, status}) -> GET  /api/repair/list
api.getRepair(id: number)                       -> GET  /api/repair/{id}
api.createRepair(payload)                       -> POST /api/repair
api.listFeesByUser(userId, {page, page_size})   -> GET  /api/fee/{user_id}
api.listNotices({page, page_size, status})      -> GET  /api/notices
api.createNotice(payload)                       -> POST /api/notices
```

**注意**：
- 开发时 Vite 代理会把 `/api` 转发到后端 `http://backend:8000`（docker 内）或 `http://127.0.0.1:8000`（本地）。
- 生产环境由 nginx 反向代理 `/api`。
- 所有 API 返回 JSON，`response.ok === false` 时会抛出异常，异常 message 取 `body.detail`。

### 4.5 `src/api/types.ts`
类型定义：

```ts
PageInfo              // 分页元数据
User                  // 用户
RepairOrder           // 维修工单
RepairListResponse    // { items, pagination }
FeeBill               // 费用账单
FeeListResponse       // { items, pagination }
Notice                // 公告
NoticeListResponse    // { items, pagination }
```

### 4.6 `src/components/UserSearch.tsx`
**页面：业主查询**

功能：
- 输入用户 ID
- 点击查询
- 展示用户详细信息

状态：
- `userId`：输入框
- `user`：查询结果
- `loading` / `error`

### 4.7 `src/components/RepairList.tsx`
**页面：维修工单（最复杂）**

上半部分：创建工单表单
- 字段：用户 ID、房屋 ID（可选）、类型、紧急程度、问题描述
- 类型选项：漏水、电梯故障、门禁、跳闸、墙面渗水、公共设施
- 紧急程度：LOW / MEDIUM / HIGH / URGENT

下半部分：工单列表
- 状态筛选：全部 / CREATED / ASSIGNED / PROCESSING / COMPLETED / CLOSED
- 分页：上一页 / 下一页
- 表格列：工单号、类型、紧急程度、状态、描述、创建时间

状态较多，适合改造时拆成两个子组件：`RepairCreateForm` + `RepairTable`。

### 4.8 `src/components/FeeList.tsx`
**页面：物业费用账单**

功能：
- 输入用户 ID 查询
- 展示账单列表
- 表格列：账单类型、周期、金额、状态、到期日

### 4.9 `src/components/NoticeBoard.tsx`
**页面：公告通知**

上半部分：发布公告表单
- 标题、内容、发布者 ID、类型、置顶复选框

下半部分：公告列表
- 每条公告展示：标题、置顶/状态 badge、内容、类型/发布者/时间

---

## 五、后端 API 清单

完整接口与返回结构：

| 方法 | 路径 | 说明 | 请求参数/Body |
|---|---|---|---|
| GET | `/api/health` | 健康检查 | - |
| GET | `/api/health/ready` | 就绪检查（含 DB/Redis 状态） | - |
| GET | `/api/users/{id}` | 查询用户 | path: id |
| GET | `/api/repair/list` | 工单列表 | query: page, page_size, user_id, status |
| GET | `/api/repair/{id}` | 工单详情 | path: id |
| POST | `/api/repair` | 创建工单 | body: user_id, house_id?, type, description?, urgency |
| GET | `/api/fee/{user_id}` | 用户账单 | path: user_id；query: page, page_size |
| GET | `/api/notices` | 公告列表 | query: page, page_size, status |
| POST | `/api/notices` | 发布公告 | body: title, content?, publisher_id, notice_type, is_pinned? |

所有列表接口返回结构统一：

```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 六、运行与构建命令

### 本地开发

```bash
cd D:\Projects\ai-property-community-agent\frontend

# 安装依赖
npm install

# 启动开发服务器（http://127.0.0.1:5173）
npm run dev
```

### 生产构建

```bash
npm run build
```

产物输出到 `frontend/dist/`。

### Docker 全栈启动（含前后端）

```bash
cd D:\Projects\ai-property-community-agent
docker compose up --build -d
```

启动后：
- 前端：`http://127.0.0.1:3000`
- 后端：`http://127.0.0.1:8000`
- Swagger：`http://127.0.0.1:8000/docs`

---

## 七、外包改造建议

### 7.1 推荐方向
1. **引入组件库**：Ant Design 5 或 Arco Design，最符合中后台管理风格。
2. **布局升级**：左侧固定菜单 + 右侧面包屑 + 内容区。
3. **路由化**：把四个 Tab 改成 `/repair`、`/user`、`/fee`、`/notice` 路由。
4. **表单优化**：创建工单/公告用 Modal 弹窗或抽屉，而不是堆在页面顶部。
5. **表格优化**：用 ProTable / Ant Design Table，带排序、过滤、分页。
6. **状态标签**：用 Tag 组件，颜色按状态映射。
7. **响应式**：支持移动端（可选）。

### 7.2 不要改的地方
- `src/api/client.ts` 中的 API 路径和方法签名可保留。
- `src/api/types.ts` 中的接口字段名尽量不动（或只增不减）。
- `vite.config.ts` 中的 `/api` 代理配置。
- `nginx.conf` 中的 `/api` 反向代理。
- `Dockerfile` 构建流程（可在此基础上加依赖安装）。

### 7.3 如需换 UI 框架示例
以 Ant Design 为例：

```bash
cd frontend
npm install antd @ant-design/icons
```

然后在 `main.tsx` 引入样式：

```tsx
import 'antd/dist/reset.css'
```

即可开始使用 `Layout`、`Menu`、`Table`、`Form`、`Modal`、`Tag` 等组件替换现有实现。

---

## 八、验收标准（给外包）

改造完成后，确保：
1. `npm run build` 成功通过 TypeScript 检查。
2. `docker compose up --build -d` 能正常启动前后端。
3. 四个核心功能仍然可用：
   - 业主查询
   - 维修工单列表 + 创建
   - 费用账单查询
   - 公告列表 + 发布
4. 所有 API 调用走 `src/api/client.ts`，不直接写 fetch。
5. 不破坏后端 API 契约。

---

## 九、联系方式 / 后端接口文档

后端 Swagger 地址（需先启动服务）：

```
http://127.0.0.1:8000/docs
```

后端源码目录：

```
D:\Projects\ai-property-community-agent\backend\app
```

数据库设计文档：

```
D:\Projects\ai-property-community-agent\docs\02-architecture\database-design.md
```

---

*文档生成时间：2026-08-12*
