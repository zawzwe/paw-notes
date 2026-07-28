# PawNotes 产品更新 PRD v1.1

**产品定位：轻痛点需求 + 强情绪增值**

**文档状态：** 产品更新执行稿  
**适用范围：** PawNotes Web 产品端、内容侧联动、数据分析与付费验证  
**版本日期：** 2026-07-28  
**核心价格假设：** US$5.99（最终计费周期须通过实验确认）

---

## 0. 执行摘要

PawNotes 不应把自己定义为“宠物语言精准翻译器”，也不应尝试与医疗、训练、监控等强需求成熟产品正面竞争。更可行的方向是：

> 以声音分析满足即时好奇，以情境记录增强可信度，以 PawNote 日记和长期回顾提供情绪价值与持续使用理由。

产品更新的核心目标不是增加更多 AI 功能，而是把以下闭环做强：

**听到声音 -> 记录声音 -> 补充情境 -> 获得温暖且可信的线索 -> 保存为 PawNote -> 日后重新看到 -> 愿意记录下一次**

本版本按四个阶段推进：

1. **P0：修复首次体验与测量。** 让冷用户能立即理解产品、无需准备自己的音频也能体验，并准确记录关键行为。
2. **P1：重构结果与保存。** 把“分析结果”升级为一个值得保存的宠物生活片段。
3. **P2：建立第二次使用。** 通过宠物档案、时间线、相似声音和每周回顾形成持续价值。
4. **P3：验证 US$5.99 付费模型。** 让用户为记忆、连续性和个性化付费，而不是为单次 AI 输出付费。

最重要的北极星指标是：

> **首次完成分析的用户中，7 天内完成第二次真实记录的比例。**

第一次分析可能只是好奇；第二次记录才说明 PawNotes 开始成为用户与宠物生活的一部分。

---

## 1. 背景与问题定义

### 1.1 当前机会

宠物主人天然会对叫声、情绪和日常行为产生好奇，也愿意保存与宠物相关的照片、视频和回忆。PawNotes 已经具备“选择宠物、录音或上传、获得情绪线索、保存记录”的基础产品形态，方向可被用户快速理解。

### 1.2 当前风险

- 单次声音分析的新鲜感强，但长期使用理由弱。
- 冷用户点击广告时，通常没有现成宠物音频，无法立即体验。
- 单纯输出情绪标签容易显得通用、武断或缺乏可信度。
- 用户会天然质疑准确率，声音本身又高度依赖当时情境和身体语言。
- 注册、授权麦克风、上传文件和等待分析会形成连续摩擦。
- 如果付费权益只是“更多分析次数”，US$5.99 也可能显得不值。
- 若事件定义不清，广告平台和站内数据会把浅层互动误当成真实激活。

### 1.3 产品命题

PawNotes 要回答的不是：

> “AI 能不能准确翻译宠物在说什么？”

而是：

> “主人能否更认真地理解、记录并回看宠物发出声音的那个时刻？”

---

## 2. 产品定位与表达边界

### 2.1 定位陈述

**PawNotes is a sound journal for the moments behind every bark and meow.**

中文释义：

> PawNotes 是一本宠物声音日记，帮助主人记录叫声、理解可能的情绪线索，并保存声音背后的生活片段。

### 2.2 三层价值结构

#### 第一层：Understand the moment

满足“它刚才为什么这样叫”的即时好奇，负责获客和首次激活。

#### 第二层：Save the moment

把声音、情境、照片、主人的备注和可能的情绪线索保存成一条 PawNote，负责建立情绪价值。

#### 第三层：Notice the pattern

通过时间线、相似声音、情境标签和每周回顾，帮助主人注意同一只宠物在不同场景下的声音习惯，负责复访与付费。

### 2.3 必须坚持的边界

- 使用 “may”, “might”, “possible clues”, “could be related to”等不确定性表达。
- 明确说明结果不是精确翻译、医疗诊断或行为诊断。
- 不输出“焦虑上升 17%”等看似医学化、精确化但缺乏证据的结论。
- 不用恐惧、疾病或主人内疚作为强制付费手段。
- 不宣称 AI 已经“完全学会了你家宠物的语言”。
- 对可能涉及疼痛、呼吸困难或紧急危险的场景，只提供安全提示并建议咨询专业人士，不做诊断。

### 2.4 非目标

本轮不优先建设：

- 医疗诊断或健康监测
- 在线兽医
- 宠物训练课程
- 大型宠物社区
- 宠物商城
- 饲养百科
- 复杂积分、签到和任务系统
- 专业数据仪表盘

---

## 3. 目标用户与 Jobs to be Done

### 3.1 核心用户

**A. 好奇型新用户**

- 经常观看宠物内容。
- 想知道某次叫声可能意味着什么。
- 对 AI 有兴趣，但不愿先注册或付费。

**B. 情感记录型主人**

- 把宠物视为家人。
- 已经习惯保存照片、视频和纪念日。
- 愿意为温暖、有个性、可回看的记录付费。

**C. 观察型长期用户**

- 会注意宠物在门铃、独处、进食、玩耍等情境下的差异。
- 希望对比历史记录，但不寻求医学诊断。

### 3.2 核心 Jobs to be Done

- 当宠物发出让我在意的声音时，我想快速记录并获得可能的情绪线索。
- 当我不确定声音含义时，我想补充当时发生的事，让结果更贴近情境。
- 当一个瞬间对我有意义时，我想把声音、照片和我的感受一起保存。
- 当记录逐渐增加时，我想重新看到熟悉的声音和生活片段。
- 当我决定付费时，我希望得到的是持续保存、个性化和回忆价值，而不是几次通用分析。

---

## 4. 产品目标与指标体系

### 4.1 版本目标

1. 降低冷用户从落地到完成首次体验的门槛。
2. 提高分析结果的可信度、个性化和情绪价值。
3. 建立从首次分析到第二次真实记录的回访机制。
4. 验证用户是否愿意为完整声音日记和长期回顾支付 US$5.99。
5. 建立能够定位每个流失点的事件体系。

### 4.2 北极星指标

**Second PawNote in 7 Days**

定义：首次完成真实宠物声音分析的用户中，在接下来 7 个自然日内，为同一或另一宠物完成第二条真实 PawNote 的用户比例。

排除：

- Sample Sound 体验
- 内部测试账号
- 同一文件重复提交
- 明显机器人或异常流量

### 4.3 核心漏斗

| 阶段 | 指标 | 说明 |
|---|---|---|
| 访问 | Landing Page View | 分析页成功加载 |
| 理解 | First Action | 点击 Sample、Record 或 Upload |
| 激活 | Analysis Result Viewed | 成功看到第一份结果 |
| 价值 | PawNote Saved | 保存为一条完整记录 |
| 留存 | Second PawNote in 7 Days | 7 天内第二次真实记录 |
| 付费 | Purchase Completed | 完成 US$5.99 购买 |

### 4.4 首轮内部判断线

以下为产品实验起始线，不是行业标准：

- 每 100 个分析页访问，至少 8 个开始 Sample、录音或上传。
- 开始真实录音或上传的用户中，至少 60% 成功看到结果。
- 看到真实结果的用户中，至少 25% 保存 PawNote。
- 保存首条 PawNote 的用户中，至少 15% 在 7 天内完成第二条。
- 看到付费页的高意向用户中，至少 3% 完成购买，之后再根据流量质量校准。

---

## 5. 信息架构与目标体验

### 5.1 一级结构

- Analyze
- Journal
- Pet Profile
- Weekly Recap
- Account / Membership

### 5.2 理想首次体验流程

1. 用户进入 `/en/app`。
2. 第一屏同时看到三个明确入口：`Try a Sample Sound`、`Record Your Pet`、`Upload a Sound`。
3. 用户选择宠物类型；Sample 路径可直接使用预设宠物。
4. 用户补充 1-3 个轻量情境标签，或选择跳过。
5. 系统进行分析，显示明确的进度与等待预期。
6. 用户先看到完整结果，不被注册墙拦截。
7. 用户选择保存时，再引导创建账号。
8. 保存后生成 PawNote，并引导添加宠物名字、头像或主人备注。
9. 系统提示下次记录的具体理由，而不是泛化地要求“经常回来”。

### 5.3 页面第一屏要求

主标题建议：

> **What might your pet be feeling?**

副标题建议：

> Record or upload a bark or meow to discover possible emotional clues behind the moment.

三个入口：

- **Try a Sample Sound**
- **Record Your Pet**
- **Upload a Sound**

边界说明：

> No exact translation - just a thoughtful way to listen closer.

---

## 6. P0：首次体验与 Sample Sound

### 6.1 目标

让没有现成宠物音频的冷用户也能在 60 秒内理解 PawNotes 的完整价值。

### 6.2 Sample Sound 功能

首版提供 4-6 个经过授权或自有版权的示例：

- Dog - short alert barks
- Dog - playful whine
- Dog - attention-seeking bark
- Cat - greeting meow
- Cat - repeated meow near food
- Cat - uncertain or unfamiliar-environment sound

每个示例必须包含：

- 清晰的音频
- 宠物类型
- 简短情境
- 预设身体语言或环境信息
- 完整结果样例
- 明确的 “Sample” 标识

### 6.3 Sample 体验规则

- 不要求注册。
- 不计入真实 PawNote、真实分析量和留存指标。
- 用户可自由播放、暂停、重播。
- 结果页与真实分析尽量保持相同结构，避免“演示版”和真实产品割裂。
- Sample 结果底部必须出现两个下一步：
  - `Analyze Your Pet's Sound`
  - `Save a Real Moment`

### 6.4 首份结果免注册

注册墙后移到“保存”或“继续建立宠物档案”时出现。用户在注册前可以：

- 完成一次 Sample 体验。
- 完成一次真实分析。
- 查看完整结果。
- 返回重听本次音频。

用户需要注册才能：

- 保存 PawNote。
- 建立宠物档案。
- 查看历史记录。
- 获取每周回顾。

### 6.5 录音与上传体验

录音：

- 点击前说明为什么需要麦克风权限。
- 权限被拒后，不出现死路，立即提供上传与 Sample 入口。
- 录音中显示波形、时长、停止和重录。
- 过短、无声或噪声过高时给出可理解的修复建议。

上传：

- 显示支持格式和大小限制。
- 选择文件后展示文件名、时长和可重新选择入口。
- 上传失败时保留用户已经选择的宠物和情境信息。
- 移动端优先提供相册/文件系统可理解的选择说明。

### 6.6 P0 验收标准

- 新用户无需登录即可完成 Sample 和一份真实分析。
- 首屏三个入口在主流移动端首屏范围内可见，或主入口与次入口无需深度滚动即可发现。
- 麦克风权限拒绝、文件格式错误、网络失败均有恢复路径。
- Sample 事件与真实分析事件在数据层明确区分。
- 首次可交互时间和上传等待符合当前技术能力，并在界面上提供真实预期。

---

## 7. P0/P1：情境输入

### 7.1 设计原则

情境不是免责声明，而是 PawNotes 区别于“宠物翻译器”的核心产品能力。它应当提高结果相关性，同时不能变成长表单。

### 7.2 输入时机

推荐采用两步轻输入：

1. **分析前：** 选择 1 个“刚刚发生了什么”标签。
2. **结果后：** 可选补充身体语言、频率和主人备注，用于生成更完整 PawNote。

### 7.3 首版标签

刚刚发生了什么：

- Someone arrived
- Food nearby
- Playing
- Left alone
- Doorbell or outside noise
- Seeking attention
- New place
- Other / Not sure

身体语言：

- Relaxed
- Tail moving
- Body tense
- Ears back
- Pacing
- Hiding
- Not sure

声音频率：

- Once
- Repeated a few times
- Continued for a while
- Happens often
- First time

### 7.4 交互规则

- 默认只要求一个问题，其他信息可跳过。
- 使用胶囊选项，不使用多页问卷。
- 明确说明：`Adding context helps PawNotes give a more thoughtful interpretation.`
- 用户可在结果页修改情境并重新生成解释，但需防止重复计费或重复统计。
- “Not sure” 是正常选项，不应用红色或负面提示。

### 7.5 验收标准

- 至少 80% 的新用户可在 15 秒内完成或跳过情境输入。
- 情境标签会实际进入结果生成逻辑，不只是保存到数据库。
- 结果必须显式引用用户选择的情境；如果没有情境，需说明判断更有限。
- 修改情境后旧结果仍可追溯，新结果不覆盖原始音频和原始时间。

---

## 8. P1：分析结果页重构

### 8.1 目标

把“AI 给出的答案”升级为“值得相信、保存和分享的一个时刻”。

### 8.2 结果页结构

#### A. 核心线索

示例：

> **Milo may be feeling alert and curious.**

同时显示：

- 宠物头像或默认形象
- 音频波形
- 可重新播放的原始声音
- 1 个主要线索 + 最多 2 个次要线索
- 低、中、高置信提示不使用百分比，可用 “limited / some / stronger context support”

#### B. 为什么会这样判断

用 2-3 句解释可观察到的声音特征，避免伪科学和过度精确：

> The short, repeated barks may suggest that something nearby caught his attention.

#### C. 结合情境解释

> You mentioned someone was outside the door, which makes alertness more likely than frustration.

如果用户未提供情境：

> Sound alone can only offer limited clues. Add what happened around the moment for a more thoughtful interpretation.

#### D. 下一步观察

提供一个低风险、可执行的观察建议：

> Notice whether his body relaxes once the sound or visitor is gone.

不输出治疗、训练或医疗指令。

#### E. 情绪落点

> He may not be using words, but this moment is still part of your story.

#### F. 主要操作

- `Save This PawNote`
- `Add More Context`
- `Share This Moment`
- `Analyze Another Sound`

### 8.3 结果质量规则

- 结果必须同时利用声音特征和用户情境；若缺失任一信息，要明确限制。
- 不得输出单一确定性诊断。
- 文案不得复制粘贴式重复；同一标签应有多种自然表达。
- 明确区分“可能的情绪线索”和“主人已确认的事实”。
- 涉及安全风险时使用审慎提示，不以此制造恐惧。
- 结果生成失败时保留音频和情境，可重试，不要求重新录制。

### 8.4 验收标准

- 结果页首屏 5 秒内可理解主要线索。
- 原始声音可播放，情境可查看和编辑。
- 保存、分享、再次分析三个动作有清晰优先级。
- 注册提示只在保存等需要账户的动作后出现。
- 所有结果文案通过产品边界词库检查。

---

## 9. P1：PawNote 声音日记

### 9.1 定义

PawNote 是 PawNotes 的核心内容单元。一条 PawNote 不是一份 AI 报告，而是宠物生活中的一个声音片段。

### 9.2 数据内容

必需字段：

- PawNote ID
- User ID
- Pet ID
- 原始音频地址与时长
- 创建时间
- 宠物类型
- 主要可能线索
- 结果摘要
- 是否为 Sample

可选字段：

- 自定义标题
- 主人的备注
- 情境标签
- 身体语言标签
- 声音频率
- 地点
- 照片或短视频
- 分享状态
- 收藏状态

系统字段：

- 分析模型版本
- 提示词/规则版本
- 同意与隐私版本
- 事件来源
- 创建和更新时间

### 9.3 创建流程

1. 用户看到结果。
2. 点击 `Save This PawNote`。
3. 未登录用户完成轻量注册。
4. 系统自动生成标题建议，例如：
   - `The night Luna heard thunder for the first time`
   - `Milo's doorbell bark`
5. 用户可修改标题、添加备注或照片，也可直接保存。
6. 保存成功后进入 PawNote 详情页，并显示下一步建议。

### 9.4 时间线

Journal 首页采用时间线，不做复杂仪表盘：

- 最新记录优先。
- 卡片显示宠物、日期、标题、主要线索和短波形。
- 支持按宠物、情境和可能线索筛选。
- 空状态不是“暂无数据”，而是展示如何保存第一条真实记录。

### 9.5 删除与导出

- 用户可删除单条 PawNote。
- 删除前说明音频、照片和结果将一并删除。
- 付费用户可导出声音和结构化记录。
- 账户删除遵循隐私政策和数据保留规则。

### 9.6 验收标准

- 保存操作不会丢失刚完成的分析。
- 注册中断后可返回原结果继续保存。
- Journal 能正确区分 Sample 与真实记录；默认不把 Sample 混入私人日记。
- 音频、照片和文本在移动端可正常加载。
- 删除、导出和隐私入口清晰可发现。

---

## 10. P2：宠物档案与个性化

### 10.1 首版档案字段

- Name
- Cat / Dog
- Photo
- Age or birthday（可选）
- Breed（可选）
- Personality tags（可选）
- Adoption / gotcha date（可选）
- Owner's note（可选）

### 10.2 个性化方向

随着真实 PawNote 增加，产品可以：

- 引用同一宠物过去的相似记录。
- 识别经常出现的情境标签。
- 展示主人自己曾经写过的解释。
- 在结果中使用宠物名字和历史上下文。

示例：

> This sounds similar to the bark you saved last Tuesday when someone knocked at the door.

### 10.3 表达边界

推荐：

> PawNotes learns the moments around your pet's sounds.

避免：

> PawNotes has learned your pet's language.

### 10.4 验收标准

- 用户可在不填写完整资料的情况下创建宠物档案。
- 同一条 PawNote 只能归属一个宠物，但可以重新归档。
- 相似记录必须基于真实可解释的匹配逻辑，并允许用户查看来源记录。
- 个性化失败时回退到通用结果，不虚构历史。

---

## 11. P2：每周回顾与第二次记录机制

### 11.1 目标

建立“回来看看”和“再记录一次”的自然理由，不依赖签到和推送轰炸。

### 11.2 Weekly Recap 内容

有足够数据时：

- 本周记录了几次声音
- 最常见的情境
- 最常出现的可能线索
- 一条值得回看的 PawNote
- 与过去相似的一个时刻
- 下周的温和观察提示

示例：

> **This week, Coco sounded most excited when you came home.**

数据不足时：

> You saved one moment this week. Add another sound when something feels worth remembering.

### 11.3 触达规则

- 用户明确选择邮件或站内提醒后才发送。
- 默认每周最多一次。
- 没有新记录时不生成虚假的变化总结。
- 文案以回忆和观察为主，不制造焦虑。
- 点击回顾后直接进入对应宠物的时间线或具体 PawNote。

### 11.4 第二次记录触发

首条 PawNote 保存后：

- 提示设置一个轻量提醒。
- 推荐用户在常见场景下再次记录，例如“下次门铃响时”。
- 在 24-72 小时内仅发送一次有明确理由的提醒。
- 若用户未授权通知，使用站内提示，不强制弹窗。

### 11.5 验收标准

- 有 2 条及以上真实记录才生成模式性总结。
- 回顾中的每个结论都能链接到对应 PawNote。
- 用户可关闭邮件/提醒。
- 退订立即生效。
- Weekly Recap 事件与营销邮件事件分开统计。

---

## 12. P3：US$5.99 付费策略

### 12.1 核心原则

用户不应感觉自己在支付：

> US$5.99 购买几次 AI 分析。

而应感觉自己在支付：

> US$5.99 保存、理解并回看与宠物有关的声音记忆。

### 12.2 推荐商品结构

#### Free

- Sample Sound
- 1 次完整真实分析
- 查看完整结果
- 1 个宠物档案
- 有限数量的 PawNote 保存
- 基础分享卡片

#### PawNotes Plus - US$5.99

建议先作为**月订阅假设**测试，只有 Weekly Recap、历史和个性化已经上线后才正式放大。

权益：

- 更多或不限次数的合理使用分析
- 完整声音历史
- 多宠物档案
- 情境化解释
- 相似声音与历史关联
- Weekly Recap
- 高级分享模板
- 原始声音与记录导出
- 更完整的回忆合集

### 12.3 计费周期决策

月订阅成立的前提：

- 用户有稳定的第二次记录。
- Weekly Recap 有持续价值。
- 次月仍有足够使用理由。

若 30 日留存和续费不足，应测试：

- US$5.99 一次性 Starter Pack
- US$5.99 月订阅 + 明确取消说明
- 更低门槛的年度方案折算价
- 按“永久保存/导出/回忆合集”收费，而不是按分析次数收费

### 12.4 Paywall 时机

不应出现：

- 首屏立即弹出
- Sample 前
- 第一份结果前
- 用户尚未理解 PawNote 价值时

推荐出现：

- 保存超过免费额度时
- 创建第二个宠物档案时
- 打开相似声音或 Weekly Recap 高级内容时
- 导出原始声音和完整记录时
- 用户已保存至少一条 PawNote 后

### 12.5 Paywall 文案

标题：

> **Keep every bark, meow, and the moment behind it.**

价值点：

- Save your complete sound journal
- Notice familiar moments over time
- Keep multiple pet profiles
- Get thoughtful weekly recaps
- Export the memories you want to keep

边界：

> PawNotes offers possible emotional clues, not exact translations or medical advice.

### 12.6 付费验收标准

- 购买前明确显示价格、计费周期、自动续费和取消方式。
- 用户可恢复购买和管理订阅。
- 付费失败不会丢失当前 PawNote。
- 免费权益和 Plus 权益在所有页面保持一致。
- 不使用预勾选、隐藏费用或误导性倒计时。

---

## 13. 分享与自然获客

### 13.1 分享卡片

基础内容：

- 宠物头像
- 宠物名字
- 简短波形
- 主要可能线索
- 日期或主人短句
- PawNotes 品牌标识

示例：

> Milo's Sound of the Day  
> Possible clue: Excited attention  
> “Someone just came home.”

### 13.2 短视频分享

后续可生成 5-8 秒竖屏视频：

1. 宠物照片出现。
2. 波形随原始声音播放。
3. 显示可能的情绪线索。
4. 出现主人的一句记录。
5. 以轻量 PawNotes 标识收尾。

### 13.3 隐私规则

- 默认私人。
- 分享前明确提示音频、宠物名字和照片是否公开。
- 允许隐藏日期、位置和主人备注。
- 分享链接可撤销。
- 不将私人 PawNote 自动用于公开训练或营销素材。

---

## 14. 数据埋点方案

### 14.1 命名原则

- 一个事件只代表一个明确动作。
- 页面加载、点击、开始、成功和失败分别记录。
- Sample 与真实宠物音频必须通过属性区分。
- 广告优化事件不能使用模糊的深度互动代替真实产品激活。
- 事件版本化，避免前后定义变化导致错误比较。

### 14.2 核心事件

| 事件 | 触发时机 | 关键属性 |
|---|---|---|
| `analysis_page_viewed` | 分析页成功加载 | locale, source, campaign |
| `entry_option_clicked` | 点击 Sample/Record/Upload | option, pet_type |
| `sample_started` | 示例开始播放 | sample_id, pet_type |
| `record_permission_result` | 麦克风权限返回 | granted, denied_reason |
| `record_started` | 真实录音开始 | pet_type |
| `record_completed` | 录音停止且有效 | duration, quality_state |
| `upload_selected` | 选择真实文件 | format, size, duration |
| `context_selected` | 选择情境 | context_type, value |
| `analysis_submitted` | 提交分析 | input_type, is_sample |
| `analysis_succeeded` | 成功生成结果 | latency, model_version, is_sample |
| `analysis_failed` | 分析失败 | error_code, stage |
| `result_viewed` | 主要结果进入可视区域 | is_sample, clue_type |
| `save_pawnote_clicked` | 点击保存 | logged_in, is_sample |
| `signup_started` | 保存路径开始注册 | method, source_step |
| `signup_completed` | 注册成功 | method |
| `pawnote_saved` | 保存成功 | pet_id, has_context, has_media |
| `share_created` | 生成分享内容 | format, privacy_options |
| `second_pawnote_7d` | 7 天内第二条真实记录 | days_since_first |
| `weekly_recap_viewed` | 打开每周回顾 | record_count |
| `paywall_viewed` | 看到付费页 | trigger, plan |
| `checkout_started` | 开始支付 | plan, price |
| `purchase_completed` | 支付成功 | plan, price, currency |
| `subscription_cancelled` | 取消订阅 | tenure, reason |

### 14.3 事件定义注意事项

- `analysis_page_viewed` 不能算 StartTrial。
- `entry_option_clicked` 只代表意向，不代表完成操作。
- `analysis_submitted` 可作为早期广告优化事件，但须有足够稳定样本。
- 最终业务激活优先使用 `analysis_succeeded` 或 `pawnote_saved`。
- `result_viewed` 需要可视区域与停留阈值，不能只因页面路由完成就触发。
- 所有内部测试流量必须带 `is_internal=true` 并在报表中排除。

### 14.4 报表

至少建立：

- 广告来源到第一动作漏斗
- Sample 与真实分析对比
- Record 与 Upload 路径对比
- 情境输入完成率
- 分析失败原因
- 结果到保存漏斗
- 保存到第二次记录漏斗
- Paywall 触发点到购买漏斗
- 7 日与 30 日留存
- 不同宠物类型、地区、设备和来源的质量对比

---

## 15. A/B 测试路线

### 15.1 测试原则

- 每轮优先改变一个主要变量。
- 先保证事件可信，再解释结果。
- 不在同一广告组中途同时修改人群、素材和落地页。
- 先验证首次体验，再测试付费文案。
- 不因小样本的偶然波动提前结束。

### 15.2 推荐顺序

| 优先级 | 实验 | A 版本 | B 版本 | 主指标 |
|---|---|---|---|---|
| 1 | 落地入口 | 首页 | `/en/app` | First Action Rate |
| 2 | 首屏入口 | Record + Upload | Sample + Record + Upload | Analysis Result Rate |
| 3 | 注册时机 | 结果前注册 | 结果后保存时注册 | Result Viewed / Saved |
| 4 | 情境输入 | 无情境 | 1 个必选或可跳过标签 | Analysis Completion / Save |
| 5 | 结果结构 | 单标签结果 | 线索 + 原因 + 情境 + 观察 | PawNote Save Rate |
| 6 | 保存 CTA | Save Result | Save This PawNote | Save Click Rate |
| 7 | 第二次记录 | 通用提醒 | 场景化提醒 | Second PawNote in 7 Days |
| 8 | Paywall 价值 | Unlimited Analyses | Complete Sound Journal | Purchase Rate |
| 9 | 价格结构 | US$5.99 月订阅 | US$5.99 Starter / 其他方案 | Revenue / Refund / Retention |

### 15.3 停止条件

任何实验出现以下情况立即停止：

- 分析成功率明显下降。
- 音频或账号数据丢失。
- 付费说明不完整。
- 结果越过医疗或精准翻译边界。
- 事件重复触发或漏报，无法可信归因。

---

## 16. 路线图

### P0：首次体验可用且可测

- 广告统一直达 `/en/app`
- 三入口首屏
- Sample Sound
- 首份结果免注册
- 录音/上传错误恢复
- 核心埋点
- 事件 QA 和内部流量排除

**完成定义：** 能可信测量从访问到结果的每一步，并且无音频的新用户也能完成完整演示。

### P1：结果值得保存

- 情境输入
- 结果页重构
- Save This PawNote
- 轻量注册恢复
- PawNote 详情页
- Journal 时间线
- 基础分享卡片

**完成定义：** 用户从结果页能自然完成保存，且保存内容明显超过一张 AI 标签截图。

### P2：形成第二次使用

- 宠物档案
- 历史筛选
- 相似声音
- 场景化提醒
- Weekly Recap
- 第二条 PawNote 指标

**完成定义：** 产品能用真实历史产生可追溯的回顾，并观察到稳定的 7 日第二次记录。

### P3：验证付费

- Free / Plus 权益
- US$5.99 Paywall
- 购买、恢复与取消
- 多宠物
- 高级回顾与导出
- 价格与计费周期实验

**完成定义：** 收入、退款、留存和取消原因可测，且付费价值不是单次分析次数。

---

## 17. Sprint 拆分

### Sprint 0：测量与基线（3-5 个工作日）

目标：

- 审计现有事件。
- 明确 StartTrial、Registration 等事件的真实触发位置。
- 建立事件字典、内部测试标记和漏斗报表。

交付：

- 事件规格表
- 数据 QA 清单
- 当前基线报告
- 广告平台事件映射

退出标准：

- 测试一次完整流程后，事件数量和顺序与实际动作一致。
- 刷新、返回和重复点击不会产生错误重复计数。

### Sprint 1：首次体验（1-2 周）

目标：

- 上线 Sample Sound。
- 首份结果免注册。
- 优化录音、上传和错误恢复。

交付：

- 三入口首屏
- Sample 库与版权记录
- 麦克风权限说明
- 上传状态和失败恢复
- Sample/真实事件区分

退出标准：

- 新用户在 60 秒内可完成 Sample。
- 新用户不注册可完成一份真实分析。

### Sprint 2：情境与结果（1-2 周）

目标：

- 上线轻情境输入。
- 重构结果结构和文案边界。

交付：

- 情境标签组件
- 结果生成输入契约
- 新结果页
- 结果失败重试
- 边界词库和内容 QA

退出标准：

- 结果显式引用情境。
- 无情境时明确说明限制。
- 产品、法务/政策和内容侧共同确认表达边界。

### Sprint 3：PawNote 日记（2 周）

目标：

- 完成保存、注册恢复、详情页和时间线。

交付：

- PawNote 数据模型
- Save This PawNote
- 注册后返回原流程
- Journal
- 删除与隐私控制

退出标准：

- 注册中断不丢分析。
- 保存、读取、编辑和删除链路通过。

### Sprint 4：留存（2 周）

目标：

- 上线宠物档案、第二次记录和 Weekly Recap。

交付：

- 宠物档案
- 相似记录引用
- 场景化提醒
- Weekly Recap
- 7 日第二次记录报表

退出标准：

- 回顾中每个结论可追溯到 PawNote。
- 没有足够数据时不生成虚假模式。

### Sprint 5：付费验证（1-2 周）

目标：

- 上线 Free / Plus 权益和 US$5.99 实验。

交付：

- Paywall
- Checkout
- 恢复购买、取消和失败恢复
- 权益校验
- 收入与留存报表

退出标准：

- 价格、周期和取消条款清晰。
- 付费失败不丢数据。
- 可按实验版本对比购买与后续留存。

---

## 18. 总体验收标准

### 18.1 功能

- Sample、录音和上传三条路径均可完成。
- 真实结果无需注册即可查看。
- 保存时可注册，并返回原分析继续完成。
- PawNote 可查看、编辑、删除和按宠物归档。
- Weekly Recap 只使用真实、可追溯的数据。
- 付费权益在前后端一致执行。

### 18.2 内容

- 所有结果使用不确定性表达。
- 不出现精确翻译或医疗诊断承诺。
- 结果同时解释声音线索、情境限制和下一步观察。
- 空状态、错误状态和付费页保持温暖、清晰、不施压。

### 18.3 数据

- 每个关键事件有唯一触发点和版本。
- Sample 与真实数据可分离。
- 内部测试可排除。
- 前端报表、后端记录和广告平台事件可抽样核对。
- 关键失败原因可定位。

### 18.4 性能与可靠性

- 移动端优先。
- 弱网情况下显示进度和恢复路径。
- 分析失败不丢原始音频和情境。
- 重复提交有幂等保护。
- 私人音频默认不公开。

### 18.5 商业

- US$5.99 的计费周期和权益明确。
- 取消、退款和恢复购买路径可用。
- 不用误导式倒计时、隐藏费用或强制预勾选。
- 付费实验同时观察购买率、退款率、第二次记录和续费，而非只看首购。

---

## 19. 风险与应对

| 风险 | 表现 | 应对 |
|---|---|---|
| 一次性新鲜感 | 用户只分析一次 | PawNote、第二次记录、Weekly Recap |
| 没有现成音频 | 点击后无法试用 | Sample Sound、权限失败回退 |
| 结果不可信 | 过于通用或确定 | 情境输入、解释原因、边界表达 |
| 付费价值弱 | 用户认为只是在买 AI 次数 | 卖声音日记、历史、回顾和导出 |
| 数据失真 | 浅层事件被当成转化 | 事件字典、QA、真实激活事件 |
| 隐私顾虑 | 不愿上传私人声音 | 默认私人、删除、导出、明确同意 |
| 医疗误解 | 用户把结果当诊断 | 非诊断声明、安全提示、内容审核 |
| 提醒反感 | 退订或卸载 | 明确授权、低频、场景化提醒 |

---

## 20. 产品与内容侧联动

产品侧提供：

- 可直接演示的 Sample
- 真实的录音与结果界面
- 可分享 PawNote
- 清晰的产品边界

内容侧围绕三个方向测试：

1. **直接产品演示：** 2 秒内出现 PawNotes，展示录音、情境和结果。
2. **轻问题型：** “Is your dog anxious - or just asking for attention?” 随后强调 context matters。
3. **情绪价值型：** “One day, you'll miss even the sounds that wake you up.” 重点展示保存声音记忆。

广告 CTA 与产品第一屏必须一致：

> **Upload one bark. See possible emotional clues.**

或：

> **Try a sample sound on PawNotes.**

不再只使用模糊的 `Try PawNotes`。

---

## 21. 待决策项

在进入对应 Sprint 前必须确认：

1. US$5.99 是月订阅、一次性 Starter Pack，还是两者并行实验？
2. 免费用户可保存几条 PawNote？
3. Sample 音频的版权来源和允许用途是什么？
4. 原始音频保留多久？用户删除后的处理 SLA 是什么？
5. 哪些结果类别需要额外安全提示？
6. Weekly Recap 使用邮件、站内还是浏览器通知？
7. 相似声音匹配的最低数据量与解释方式是什么？
8. 分享卡片默认显示哪些个人信息？
9. 是否支持多语言结果，以及何时进入本地化？
10. 购买与订阅由哪个支付系统承载？

---

## 22. 发布检查清单

产品：

- 首屏价值和三个入口清晰。
- Sample 可用且有 Sample 标识。
- 注册后移到保存节点。
- 结果页包含线索、原因、情境、观察和边界。
- 保存后生成真实 PawNote。

数据：

- 事件触发顺序已逐步核对。
- Sample、内部流量和真实用户可区分。
- 广告优化事件映射正确。
- 漏斗报表可按来源、设备和宠物类型查看。

内容：

- 没有精准翻译或诊断承诺。
- CTA 与实际落地体验一致。
- 内容侧使用真实产品画面，不宣传尚未上线的功能。

商业：

- 价格、周期、续费和取消说明完整。
- 免费与付费权益一致。
- 退款、恢复购买和支付失败路径测试通过。

隐私：

- 音频默认私人。
- 分享前有明确确认。
- 删除与导出可用。
- 隐私政策覆盖音频、照片、AI 分析和营销用途。

---

## 23. 推荐 UI 文案（美式英语）

### 分析页

**Headline**  
What might your pet be feeling?

**Subheadline**  
Record or upload a bark or meow to discover possible emotional clues behind the moment.

**Primary actions**  
Try a Sample Sound  
Record Your Pet  
Upload a Sound

**Boundary**  
No exact translation - just a thoughtful way to listen closer.

### 情境输入

**Prompt**  
What was happening around this sound?

**Helper**  
Adding context helps PawNotes give a more thoughtful interpretation.

**Skip**  
I'm not sure

### 结果页

**Main result**  
Milo may be feeling alert and curious.

**Context explanation**  
You mentioned someone was outside the door, which makes alertness more likely than frustration.

**Observation**  
Notice whether his body relaxes once the sound or visitor is gone.

**Emotional close**  
He may not be using words, but this moment is still part of your story.

**Actions**  
Save This PawNote  
Add More Context  
Share This Moment  
Analyze Another Sound

### 保存与注册

**Title**  
Save this moment to your pet's journal.

**Body**  
Create an account so you can keep the sound, the context, and the story behind it.

### Weekly Recap

**Title**  
Coco's week in sounds

**Example**  
This week, Coco sounded most excited when you came home.

### Paywall

**Title**  
Keep every bark, meow, and the moment behind it.

**Body**  
Build a complete sound journal, notice familiar moments over time, and keep the memories you want to revisit.

**Boundary**  
PawNotes offers possible emotional clues, not exact translations or medical advice.

---

## 24. 最终产品判断

PawNotes 的可行性不取决于“声音分析是否看起来足够像黑科技”，而取决于能否把一次好奇转化成一段被保存的生活，再把一段生活转化成持续回看的关系记录。

因此，所有后续功能都应通过三个问题筛选：

1. 它是否让首次体验更容易？
2. 它是否让这个时刻更值得保存？
3. 它是否给用户一个自然的理由再次回来？

如果答案都是否定的，就不应进入当前路线图。

**PawNotes v1.1 的产品主线：**

> **Analyze the sound. Add the context. Save the moment. Notice the story over time.**

