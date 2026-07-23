# 🐾 PawNotes — 宠物声音日记

记录宠物每一天的声音和故事。

## 技术栈

- **Next.js** (App Router, React 19)
- **Supabase** — 认证 + 数据库 + 存储
- **Tailwind CSS** + **shadcn/ui** — 样式与组件
- **TypeScript**

## 功能规划

- [ ] 宠物档案管理
- [ ] 声音录制与上传
- [ ] 日记撰写（文字 + 声音）
- [ ] 时间线回顾
- [ ] 用户认证（基于 Supabase Auth）

## 本地开发

### 前置条件

需要一个 Supabase 项目，在 [supabase.com](https://supabase.com) 创建。

### 环境变量

```bash
cp .env.example .env.local
```

填入 Supabase 项目的 URL 和 Publishable Key：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

### 启动

```bash
npm install
npm run dev
```

打开 [localhost:3000](http://localhost:3000) 即可看到应用。

## License

MIT
