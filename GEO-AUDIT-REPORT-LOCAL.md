# GEO 审计报告：Memfit AI（本地构建复审 2026-08-24 · 第五轮）

**审计日期：** 2026-08-24（第五轮：第五批本地项 commit `7d31df6` 部署后复扫；审计中发现的 2 处缺陷已即时修复并提交 `15bec51`）
**审计目标：** http://localhost:3333（`npm run build` 生产构建，Docker `memfit-nginx` 托管仓库 `build/` 目录）
**生产域名：** https://memfit.ai（GitHub Pages；线上版本滞后，部署需 PR 合并——当前账号对 yaklang/memfit-home 仅 READ 权限）
**审计方式：** `/geo audit` —— 5 个专家子代理并行分析
**历史基线：** 修复前线上 32 → 本地复审序列 71 → 73 → 68 → 69 → 71 → **本轮 72**

---

## 执行摘要

**整体 GEO 评分：72/100（Fair，逼近 Good）**（上轮 71 → +1）

> 五轮迭代后站内代码级优化接近完全收敛：本轮第五批 6 项修复全部验证通过，审计新发现的 2 处缺陷（en 文档 datePublished 回退构建时间、downloads 页 title 品牌三连重复）已即时修复复验。**技术 89 / Schema 63 双双触及环境或数据天花板，剩余大额分数全部在业务数据与部署侧。**

### 评分明细（第五轮）

| 类别 | 本轮 | 上轮 | Δ | 权重 | 加权 | 说明 |
|---|---|---|---|---|---|---|
| AI 可见性 | 78 | 77 | +1 | 25% | 19.50 | llms 88→90、可引用 75→78；品牌按外部口径 55 |
| 品牌权威 | 55 | 55 | 平 | 20% | 11.00 | 外部信号待线上；站内一致性 88 保持清零 |
| 内容 E-E-A-T | 74 | 73 | +1 | 20% | 14.80 | Trust 69→72（about 扩容 + 日期回溯消除造假风险） |
| 技术 GEO | 89 | 88 | +1 | 15% | 13.35 | 分数被三项平台/环境约束锁死 |
| Schema | 63 | 62 | +1 | 10% | 6.30 | Article 13/15；Person 0/15 + sameAs 5/15 是唯二大缺口 |
| 平台优化（5 平台均分） | 67 | 65 | +2 | 10% | 6.70 | Bing +4、AIO/Gemini +3 |
| **整体 GEO 评分** | | | | | **71.65 ≈ 72/100** |

### 平台就绪度（均分 67，上轮 65）

| 平台 | 本轮 | 上轮 | Δ | 状态 |
|---|---|---|---|---|
| Google AI Overviews | 77 | 74 | +3 | Good |
| ChatGPT Web Search | 70 | 68 | +2 | Fair |
| Bing Copilot | 64 | 60 | +4 | Fair |
| Perplexity AI | 68 | 67 | +1 | Fair |
| Google Gemini | 58 | 55 | +3 | Fair |

---

## 第五批修复验证（5 个子代理一致确认 6/6 通过）

| 修复项 | 结果 |
|---|---|
| TechArticle.datePublished 取 git 首次提交 | ✅ zh 各页正确分离（overview 2025-12-15 / modified 2026-08-24）；**en 缺陷已修复**（见下） |
| overview FAQ 4→6 问（zh/en 正文+FAQPage 同步） | ✅ 6 问一一对应，直答段 40-90 字，citation-ready（单块约 85 分） |
| downloads 页 SoftwareApplication+Offer schema | ✅ zh/en 均有，rich result 字段齐备 |
| en/about 英文版 | ✅ 263 词，4 个 H2 与 zh 对齐，AboutPage schema 在位 |
| 首页 hero 图 alt | ✅ 描述性文本 + width/height + fetchpriority 齐全 |
| 首页 schema URL 尾斜杠 | ✅ Organization/SoftwareApplication 均带斜杠 |

## 审计发现并即时修复的缺陷（commit `15bec51`，已复验）

| 问题 | 根因 | 修复与验证 |
|---|---|---|
| en 文档 datePublished = 构建时间（zh 正常 2025-12-15） | 首提交脚本只扫 docs/（zh）；en 构建 permalink 带 `/en` 前缀查表落空回退 | 脚本克隆 zh 键加 `/en` 前缀（36→72 键）；复验 en 两页均 2025-12-15 ✅ |
| downloads 页 title「下载 Memfit AI - Memfit AI \| Memfit AI」三连重复；description 为自动生成占位 | Layout title 手动拼接 `- ${siteConfig.title}` 再叠加 Docusaurus 后缀 | title 改纯 `t.title`；description 手写双语；顺带加 `<noscript>` 静态兜底（Perplexity 有限 JS 执行时的下载信息空窗）✅ |

---

## 各类别要点（第五轮）

### 技术SEO — 89/100（+1，环境天花板）
第五批全过；唯一计分增量是 sitemap lastmod+/en/ 实锤。锁定扣分：安全 header（GH Pages 平台限制）、本地 nginx 无 gzip/丢端口（环境差异）、长缓存（待 Cloudflare）。**源码级影响计分的项已清零。**

### Schema — 63/100（+1，数据天花板）
Article 13/15（双日期正确分离）；downloads rich result 合格。剩余 warning 级：en 面包屑 name 未本地化、时区格式 +08:00/Z 混用、sameAs 含 yaklang.com（属父组织实体，边界混淆，建议移除或换 Yaklang GitHub org）。**Person（0/15）+ sameAs 平台数（5/15）= 仍是最深缺口，拿到维护者身份单次可 63→85+。**

### 内容 E-E-A-T — 74/100（+1）
E-E-A-T 65：Experience 65 / Expertise 68 / Authoritative 53 / **Trust 72（+3）**——about 双语扩容（zh 375/en 263 词）+ datePublished 回溯真实提交消除「日期造假」风险。AI 内容判定 Highly Likely Human。缺：联系邮箱/security@/编辑准则（Trust→80 唯一路径）、量化数据、use-cases 扩写。

### AI 可见性 — 78/100（+1）
llms 90：导航噪音 0、零宽字符 0；剩余 -10 为 10 条「：」截断描述 + en 文档未入清单（en 已上线但 llms.txt/llms-full 未收录）。可引用 78：overview ≈85（FAQ 6 问直答块 78-85 分）；量化数据仍为零（连续五轮的天花板）。

### 平台 — 67（+2）
AIO 77 领跑（问答范式+定义句式标准 AIO 摘取模式）；Bing +4（lastmod/hreflang 是 Bing 明确读取信号，剩余全在部署侧 IndexNow/msvalidate）；Gemini 58（多模态 alt 信号改善，生态位仍空）。

---

## 优先级行动计划（第五轮）

### 🔴 本地源码可做（剩余边际收益 +2~4，即将归零）

1. llms.txt 10 条「：」截断描述补全（首句引导语截断，机械修复）
2. en 文档纳入 llms.txt/llms-full.txt（en 已上线，清单滞后）
3. Schema warning 清理：sameAs 中 yaklang.com 移除（父子关系已由 parentOrganization 表达）、en 面包屑 name 本地化、时区统一
4. BreadcrumbList 多级化（首页›文档›页，swizzle 注入，AIO/Bing 小额收益）

### 🟡 需业务数据 / 运营（主通道，预计合计 +15~25）

5. **量化数据**（CRITICAL，连续五轮同判）：工具数/基准/审计 Token·耗时·召回率
6. **Person 作者 + /about 作者卡片**（Schema +12~22）
7. **Wikidata/Wikipedia + sameAs 扩展**（ChatGPT +8~10 / Gemini +6~8 / Perplexity +4~6，单点 ROI 最高）
8. 公开联系邮箱 + security@ + 编辑准则页（Trust 72→80）
9. GitHub 仓库 Settings 补 description/homepage/topics；YouTube 频道（Gemini）

### ⚪ 部署后（需先解决 yaklang 主仓合并权限）

- `/geo audit https://memfit.ai` 线上复扫（生产仍为旧版：llms.txt 404）
- Bing Webmaster（msvalidate.01 + sitemap 提交）+ IndexNow key/ping
- Cloudflare 接入：安全 header / 长缓存 / Markdown 协商三合一解锁

---

## 附录：评分口径与备注

- 权重：AI 可见性 25% / 品牌 20% / 内容 20% / 技术 15% / Schema 10% / 平台 10%。
- AI 可见性沿用历史公式（爬虫 25%/可引用 35%/llms 10%/品牌外部 30%）：100×.25+78×.35+90×.10+55×.30=77.8≈78。本轮子代理自报 87.7 系采用站内品牌分口径，未采纳（保持轮次可比）。
- 品牌与平台的外部生态信号（Wikipedia/Reddit/LinkedIn/YouTube/Bing 收录）本地无法验证，保守计分，部署后复扫校准。
- 五轮总轨迹：68 → 69 → 71 → 72（新口径）；期间首页 HTML 1.21MB→138KB、llms.txt 5→44 条、llms-full 双次重建、FAQ 0→6 问、en 元数据全本地化。
