# 冒险岛重生工具站

面向中国玩家的冒险岛怀旧服工具站 MVP，重点支持搜索引擎收录和资料查询。

## 技术栈

- Next.js 14 应用路由与 TypeScript
- TailwindCSS
- Prisma ORM
- PostgreSQL

## 核心路由

- `/monsters` 与 `/monsters/[slug]`
- `/items` 与 `/items/[slug]`
- `/drops`
- `/level-guide`
- `/api/monsters`, `/api/monsters/[slug]`
- `/api/items`, `/api/items/[slug]`
- `/api/drops`
- `/api/level-guide`

## 本地启动

1. 安装依赖：

```bash
npm install
```

2. 启动 PostgreSQL：

```bash
docker compose up -d
```

3. 创建数据表并写入中文种子数据：

```bash
npm run db:push
npm run prisma:seed
```

4. 启动 Next.js：

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 环境变量

复制 `.env.example` 为 `.env`，并在生产环境中替换 `DATABASE_URL`。

| 变量 | 说明 |
|------|------|
| `USE_LOCAL_DATA` | 设为 `true` 时使用内置/JSON 演示数据，**无需 PostgreSQL**，适合先上线 |
| `NEXT_PUBLIC_SITE_URL` | 生产站点完整 URL，用于 sitemap 与分享预览 |
| `DATABASE_URL` | 接 PostgreSQL 时使用（Neon、Supabase、自建库等） |

## 上线部署（Vercel 推荐）

项目为 Next.js 14，最快方式是 [Vercel](https://vercel.com) 一键部署。

### 1. 代码推到 GitHub

```bash
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/你的用户名/maoxiandao.git
git push -u origin main
```

### 2. 导入 Vercel

1. 打开 [vercel.com/new](https://vercel.com/new)，用 GitHub 登录
2. Import 你的仓库，Framework 选 **Next.js**（会自动识别）
3. **Environment Variables** 添加：

| Name | Value |
|------|-------|
| `USE_LOCAL_DATA` | `true` |
| `NEXT_PUBLIC_SITE_URL` | `https://你的项目.vercel.app`（部署后可改成自定义域名） |

4. 点击 **Deploy**，等待构建完成

### 3. 部署后

- 访问 Vercel 分配的 `https://xxx.vercel.app`
- 职业测试：`/quiz`
- 若要绑自己的域名：Vercel 项目 → Settings → Domains

### 本地 CLI 部署（可选）

```bash
npx vercel login
npx vercel --prod
```

CLI 同样需设置 `USE_LOCAL_DATA=true` 与 `NEXT_PUBLIC_SITE_URL`。

### 后续接数据库

1. 创建 [Neon](https://neon.tech) 或 [Supabase](https://supabase.com) PostgreSQL
2. 把连接串写入 Vercel 的 `DATABASE_URL`
3. 将 `USE_LOCAL_DATA` 改为 `false` 或删除
4. 本地执行 `npm run db:push && npm run prisma:seed` 初始化表与数据后重新部署
