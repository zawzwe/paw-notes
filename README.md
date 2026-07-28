# 🐾 PawNotes — 宠物声音日记

听懂宠物的心声。基于 Qwen 大模型的 AI 宠物叫声情绪分析工具。

**v1.1** · [pawnotes.top](https://pawnotes.top)

## 功能

- 🐱🐶 **多宠物档案** — 品种、生日、个性标签、照片
- 🎤 **录音分析** — 浏览器实时录音（最30秒）
- 📁 **文件上传** — WAV / MP3 / M4A / OGG / WebM（≤20MB）
- 🧪 **Sample Sound** — 4 个预生成示例，免注册体验
- 🧠 **AI 情绪识别** — 两步法：Captioner 音频描述 → Plus 情绪推理
- 🏷️ **情境标签** — 分析前选"刚刚发生了什么"，让结果更准
- 🔊 **吸引声音** — 真实猫叫/狗叫/鸟叫音频，引导宠物发声
- 📊 **结果页** — 主要线索 + 为什么会这样判断 + 观察建议
- 📔 **PawNote 日记** — 聊天式历史 + 主人备注
- 📈 **情绪趋势** — 7/30 天心情日历 + 统计卡片
- 🌐 **中英双语** — 界面 + 分析输出双语言
- 💰 **付费系统** — Free（3次/天）/ Monthly $5.99（Creem 支付）
- 🌓 **亮暗主题** — 跟随系统
- 📱 **移动优先** — 底部 Tab 导航
- 🎓 **新手引导** — 3 步上手
- 🎬 **Lottie 动画** — 着陆页 3D 猫 + 分析页猫狗动画
- 📊 **数据追踪** — Vercel Analytics + TikTok Pixel
- 🔐 **Supabase Auth** — 邮箱注册/登录

## 技术栈

| 层 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript |
| 后端/数据库 | Supabase (Auth + PostgreSQL + Storage + RLS) |
| AI 模型 | Qwen3-Omni-Captioner + Qwen-Plus (阿里云百炼) |
| 样式 | Tailwind CSS + shadcn/ui |
| 国际化 | next-intl (zh/en) |
| 动画 | Lottie (lottie-web + lottie-player) |
| 支付 | Creem |
| 追踪 | Vercel Analytics + TikTok Pixel |
| 部署 | Vercel |

## 项目结构

```
app/
  [locale]/
    page.tsx           着陆页
    app/page.tsx        分析页（主功能）
    history/page.tsx    PawNote 日记
    trends/page.tsx     情绪趋势
    pricing/page.tsx    套餐页
    auth/*              登录/注册
    protected/page.tsx  个人设置
    privacy/page.tsx    隐私政策
    terms/page.tsx      服务条款
    payment/success/    支付成功页
  api/
    analyze/route.ts    核心分析 API
    checkout/route.ts   Creem 支付 API
    webhooks/creem/     Creem Webhook

components/
  landing-hero.tsx      着陆页主内容
  home-content.tsx      分析页主内容
  recording/            录音/上传/动物选择/情境/吸引声音
  result/               分析结果展示
  history/              PawNote 日记列表
  trends/               情绪趋势
  pet/                  宠物档案编辑
  onboarding.tsx        新手引导

lib/
  qwen.ts               AI 分析（两步法）
  sounds.ts             吸引声音播放
  samples.ts            Sample Sound 数据
  supabase/             数据库客户端

hooks/                  自定义 Hooks
messages/               中英文翻译
supabase/migrations/    SQL 迁移文件（按序执行）
public/sounds/          音频资源
public/samples/         示例音频
```

## 数据库

| 表 | 用途 |
|------|------|
| `profiles` | 用户扩展信息（昵称、方案、用量、管理员） |
| `pets` | 宠物档案（名字、品种、生日、照片、标签） |
| `recordings` | 录音/上传记录（关联宠物、情境、标题、备注） |
| `analyses` | AI 分析结果（情绪、置信度、翻译、原始响应） |

所有表启用 RLS，用户只能访问自己的数据。

## 本地开发

### 环境变量

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=           # Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= # Supabase 匿名 Key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase 服务角色 Key
ALIYUN_BAILIAN_API_KEY=             # 阿里云百炼 API Key
CREEM_API_KEY=                      # Creem 支付
CREEM_PRODUCT_ID=
CREEM_WEBHOOK_SECRET=
```

### 数据库迁移

在 Supabase SQL Editor 中按序执行 `supabase/migrations/` 下的 SQL 文件。

### Storage Buckets

需手动创建：
- `audio-uploads` — 私有
- `tts-output` — 私有
- `pets` — 公开（宠物照片）

### 启动

```bash
npm install
npm run dev    # localhost:3000
```

## 关键 API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/analyze` | POST | 上传音频 → 返回情绪分析结果 |
| `/api/checkout` | POST | 创建 Creem 支付会话 |
| `/api/webhooks/creem` | POST | Creem 支付回调（自动升级用户） |

## AI 分析流水线

1. **Captioner** (`qwen3-omni-30b-a3b-captioner`) — 音频 → 英文描述（工作空间端点）
2. **Plus** (`qwen-plus-latest`) — 描述 + 情境 → 情绪 + 线索 + 观察建议

未登录用户音频以 base64 直传，已登录用户上传至 Supabase Storage。

## 环境变量（Vercel）

部署到 Vercel 时需要配置所有 `.env.local` 中的变量。

## License

MIT
