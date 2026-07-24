# 🐾 PawNotes — 宠物声音日记

听懂宠物的心声。基于 Qwen 大模型的 AI 宠物叫声情绪分析工具。

**v1.0** · [pawnotes.top](https://pawnotes.top)

## 功能

- 🐱🐶 **多宠物档案** — 添加多只猫狗，分别命名和管理
- 🎤 **录音分析** — 浏览器实时录音，最长 30 秒
- 📁 **文件上传** — 支持 WAV / MP3 / M4A / OGG / WebM
- 🧠 **AI 情绪识别** — 两步法：Captioner 音频描述 + Plus 情绪推理
- 🔊 **吸引声音** — 播放真实猫叫/狗叫/鸟叫吸引宠物
- 📊 **情绪趋势** — 7/30 天心情日历 + 统计卡片
- 💬 **聊天式历史** — 气泡对话风格，按宠物筛选
- 🌐 **中英双语** — 界面 + 分析输出双语支持
- 💰 **计费系统** — Free（3次/天）/ Monthly（¥9.9 / $5.9）
- 🌓 **亮暗主题** — 支持系统主题切换
- 📱 **移动端优先** — 底部 Tab 导航，手机体验优先
- 🎓 **新手引导** — 3 步引导，快速上手

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 后端 | Supabase (Auth + DB + Storage) |
| AI 模型 | Qwen3-Omni-Captioner + Qwen-Plus (阿里云百炼) |
| 样式 | Tailwind CSS + shadcn/ui |
| 国际化 | next-intl |
| 部署 | Vercel |

## 数据库

- `profiles` — 用户扩展信息（昵称、方案、用量）
- `pets` — 宠物档案（名字、物种、头像）
- `recordings` — 录音/上传记录
- `analyses` — AI 分析结果（情绪、置信度、翻译文本）

所有表启用 RLS，用户只能访问自己的数据。

## 本地开发

### 环境变量

```bash
cp .env.example .env.local
```

需要配置：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ALIYUN_BAILIAN_API_KEY=
DATABASE_URL=
```

### 数据库迁移

在 Supabase SQL Editor 中依次执行 `supabase/migrations/` 下的 SQL 文件。

### 启动

```bash
npm install
npm run dev
```

打开 [localhost:3000](http://localhost:3000)。

## License

MIT
