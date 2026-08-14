# 前端交接文档 —— AI 物业社区智能体平台

> 最后更新：2026-08-14
> 当前状态：Bolt 原型已整合，三端路由与真实 API 已接入

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
| 构建工具 | Vite | 8.2.1 |
| 语言 | TypeScript | 5.5.4 |
| 路由 | react-router-dom | 7.x |
| 样式 | Tailwind CSS + 自定义 CSS 变量 | - |
| 图标 | lucide-react | - |
| HTTP 请求 | fetch | 封装在 `src/api/client.ts` |
| 容器化 | Docker + nginx | `frontend/Dockerfile` + `frontend/nginx.conf` |

---

## 三、前端页面清单

### 公共页面

| 页面 | 路径 | 文件 |
|---|---|---|
| 启动页 | `/` | `src/pages/LandingPage.tsx` |
| 欢迎页 | `/welcome` | `src/pages/WelcomePage.tsx` |
| 角色选择 | `/roles` | `src/pages/RoleSelectionPage.tsx` |
| 登录页 | `/login` | `src/pages/LoginPage.tsx` |

### 业主端

| 页面 | 路径 | 文件 |
|---|---|---|
| 首页 | `/owner` | `src/pages/owner/OwnerHome.tsx` |
| 费用查询 | `/owner/fees` | `src/pages/owner/OwnerFees.tsx` |
| 我的工单 | `/owner/repairs` | `src/pages/owner/OwnerRepairs.tsx` |
| 社区公告 | `/owner/notices` | `src/pages/owner/OwnerNotices.tsx` |
| 服务入口 | `/owner/services` | `src/pages/owner/OwnerServices.tsx` |
| AI 助手 | `/owner/ai` | `src/pages/owner/OwnerAiChat.tsx` |
| 我的 | `/owner/profile` | `src/pages/owner/OwnerProfile.tsx` |

### 物业端

| 页面 | 路径 | 文件 |
|---|---|---|
| 首页 | `/management` | `src/pages/management/ManagementHome.tsx` |
| 工单管理 | `/management/repairs` | `src/pages/management/ManagementRepairs.tsx` |
| 公告管理 | `/management/notices` | `src/pages/management/ManagementNotices.tsx` |
| 用户管理 | `/management/users` | `src/pages/management/ManagementUsers.tsx` |
| 我的 | `/management/profile` | `src/pages/management/ManagementProfile.tsx` |

### 维修端

| 页面 | 路径 | 文件 |
|---|---|---|
| 首页 | `/repair` | `src/pages/repair/RepairHome.tsx` |
| 工单列表 | `/repair/orders` | `src/pages/repair/RepairOrders.tsx` |
| 我的 | `/repair/profile` | `src/pages/repair/RepairProfile.tsx` |

---

## 四、认证与路由

- 统一使用 `AuthContext` 管理 JWT
- `ProtectedRoute` 按角色守卫路由
- 登录后根据 `user.role` 跳转对应首页
- JWT 有效期 7 天

演示账号（密码均为 `123456`）：

- 业主：`guoyi378`
- 物业：`linzhe917`
- 维修：`yangfei423`
- 管理员：`mayun420`

---

## 五、API 接入状态

当前三端页面已接入真实后端 API：

- 业主首页：费用、公告、工单
- 业主子页面：费用、工单、公告、AI 助手
- 物业首页：工单统计
- 物业子页面：工单、公告、用户
- 维修首页：今日待办、任务完成度
- 维修子页面：工单列表

---

## 六、快速启动

```bash
# 开发模式
cd frontend
npm install
npm run dev

# 生产构建
npm run build

# Docker 构建
cd ..
docker compose build --no-cache frontend
docker compose up -d frontend
```

---

## 七、注意事项

- 修改前端代码后必须重新构建并重启容器，生产镜像才会更新
- `page_size` 参数后端限制最大 100
- 移动端优先设计，桌面端自适应
