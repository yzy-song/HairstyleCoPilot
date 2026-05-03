# HairstyleCoPilot

## 产品概览

**一句话：** 帮助理发师赚钱的 AI 发型预览工具。

**核心场景：**
1. 理发师用手机给客人拍照（或上传客人照片）
2. 选择想要尝试的发型、发色模板
3. AI 生成客人换发型/发色后的效果图
4. 客人看到效果，下定决心消费 → 理发师多赚钱

**目标用户：** 独立理发师和中小型沙龙（欧洲市场）

**产品价值：** 理发师最大的收入屏障不是技术，是客人犹豫不敢换发型。一张效果图比一千句话管用。

**核心业务流程：**
```
理发师注册 → 创建 Salon → 添加 Stylist（可选）
  → 添加 Client → 创建 Consultation
  → 选择 HairstyleTemplate + AI 参数
  → AI 生成 GeneratedImage
  → 客人看到效果图 → 成交
```

## Tier 1 — 基础约束（永久有效，几乎不变）

### 技术栈
- **Monorepo:** Turborepo 2.5 + pnpm 9.0
- **后端:** NestJS 11 (Express, 端口 3000), TypeScript ES2022
- **前端:** Next.js 15.5 (App Router, 端口 3001), React 19.1
- **数据库:** PostgreSQL, Prisma ORM 6.16
- **AI:** Replicate API (图像生成), Cloudinary (存储/分发)
- **邮件:** Resend
- **认证:** JWT (passport-jwt + bcrypt), 双角色: Salon / Stylist
- **日志:** Winston + 每日轮转文件
- **API 文档:** Swagger (`/api-docs`)

### 核心编码原则
- **模块化:** NestJS 标准控制器/服务模式，每个模块独立目录
- **输入验证:** DTO 使用 `class-validator`，全局 ValidationPipe（whitelist + transform）
- **类型安全:** TypeScript 严格模式（`noUncheckedIndexedAccess`, `isolatedModules`）
- **代码风格:** Prettier + ESLint flat config v9，提交前格式化
- **文件大小:** 200-400 行为宜，最多 800 行
- **不可变模式:** 创建新对象，不修改原对象

### 安全红线（全局 rules/security.md 已覆盖，此处仅补充项目特有）
- PrismaService 是唯一的数据库入口，禁止直接拼接 SQL
- JWT token 过期时间在环境变量中配置，默认不宜超过 7 天
- Cloudinary 上传签名必须在服务端生成

## Tier 2 — 组件规范（偶尔变更）

### 数据库规范
- 模型统一使用 Prisma schema 定义在 `packages/db/prisma/schema.prisma`
- 软删除字段统一命名为 `deletedAt`（DateTime?）
- 关联表使用 Prisma 关系字段，不在应用层手动 JOIN
- Migration 文件提交到 git，不可手动修改已提交的 migration
- 枚举值（如 ConsultationStatus）统一管理在 Prisma schema 中
- **金额字段:** 统一用 `Int` 存 cents（分），前端显示时 `/100`

### API 设计规范
- RESTful，URL 使用复数名词：`/api/consultations`, `/api/templates`
- 响应格式统一：
  - 成功: `{ data: {...} }` 或 `{ data: [...], total, page, pageSize }`
  - 错误: `{ statusCode, message, error }`
- 分页参数: `page` (默认 1), `pageSize` (默认 20, 最大 100)
- 列表查询参数: `search` (模糊搜索), `sortBy`, `sortOrder` (asc/desc)
- 关联查询通过 `include` query 参数控制（如 `?include=tags`）
- 所有端点使用 `@ApiTags()` 分组，`@ApiOperation()` 描述

### 认证规范
- 使用 `@CurrentUser()` 装饰器获取当前登录用户信息
- 角色区分：Salon（沙龙管理者）和 Stylist（造型师）
- 不同角色应有独立的 guard 或至少不同的权限检查
- Reset password 等敏感操作生成一次性 token，用完即失效

### 模块结构规范
```
apps/api/src/{module}/
  {module}.module.ts
  {module}.controller.ts
  {module}.service.ts
  dto/
    create-{module}.dto.ts
    update-{module}.dto.ts
    query-{module}.dto.ts
  entities/        # 仅当需要额外实体时
```

### 前端规范（如涉及 `apps/web`）
- 页面组件放在 `apps/web/app/`，共享组件放在 `packages/ui/`
- 使用 Next.js App Router，服务端组件优先
- 客户端组件置于叶子节点，尽可能高
- 从 `@repo/ui` 导入共享 UI 组件

## Tier 3 — 当前状态（频繁更新）

### 项目阶段
**早期 MVP 阶段**（2025 年启动后暂停，2026 年 5 月恢复）

### 已完成
- [x] 认证模块（注册/登录，JWT，双角色）
- [x] 客户管理 CRUD
- [x] 咨询管理（创建、状态流转、关联客户和造型师）
- [x] 发型模板管理（CRUD，AI 参数存储，Cloudinary 图片）
- [x] AI 图像生成流水线（Replicate + Cloudinary）
- [x] 邮件发送（Resend）
- [x] Swagger API 文档
- [x] Winston 日志系统

### 进行中
- [ ] 前端页面开发

### 待开始
- [ ] Stripe 支付集成
- [ ] 国际化（i18n）
- [ ] E2E 测试
- [ ] 用户仪表盘
- [ ] 图片库/历史记录浏览
- [ ] 造型师-Salon 权限细化

### 当前会话焦点
（每次新会话在这里备注你要做什么）
