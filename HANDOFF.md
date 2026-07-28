# PawNotes 开发者交接文档

## 项目 URL

- 生产环境: https://pawnotes.top
- GitHub: https://github.com/zawzwe/paw-notes
- Supabase: https://supabase.com/dashboard/project/jeoxncgcmhbhauwbuiww
- Vercel: Vercel Dashboard → paw-notes
- 阿里云百炼: https://bailian.console.aliyun.com/

## 待完成任务

### 高优先级
- [ ] **TTS 语音合成** — 分析完让用户听到"宠物说话"。已预留接口 `lib/qwen.ts` → `generateTTS()`
- [ ] **照片上传修复** — Supabase Storage `pets` bucket 需配置公开访问 + RLS
- [ ] **支付优化** — Creem Paywall 时机调整（PRD Sprint 5）
- [ ] **Weekly Recap** — 基于历史数据生成每周情绪总结

### 中优先级
- [ ] 分享卡片生成（PRD 第 13 节）
- [ ] 多语言结果输出优化
- [ ] 分析失败重试和幂等保护
- [ ] Weekly Recap 邮件/站内通知

### 已知问题
- TTS API 端点待确认（阿里云百炼文档更新）
- 照片上传需 Supabase Storage bucket 公开配置
- 移动端录音兼容性需进一步测试

## 数据库迁移

在 Supabase SQL Editor 中按序执行：
```
supabase/migrations/
  001_init.sql
  002_add_profile_insert_policy.sql
  003_add_plan_billing.sql
  004_storage_rls.sql
  005_add_admin.sql
  006_pets.sql
  007_pawnote_fields.sql
  008_pet_profile.sql
```

## 环境变量清单

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
ALIYUN_BAILIAN_API_KEY
CREEM_API_KEY
CREEM_PRODUCT_ID
CREEM_WEBHOOK_SECRET
DATABASE_URL
```

## 部署

推送 main 分支 → Vercel 自动部署。环境变量在 Vercel Dashboard 设置。

## 产品 PRD

`PawNotes_Product_Update_PRD_v1.1.md` 包含完整产品规划（Sprint 0-5）。
