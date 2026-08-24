# Memfit AI 官网（memfit-home）

面向 AI 搜索引擎（GEO）优化的 Docusaurus 3 文档/官网，部署于 GitHub Pages 自定义域名 **memfit.ai**。

本项目的核心约束不只是"把页面做出来"，而是"**让 AI 搜索引擎能正确发现、抓取、引用本站**"。任何改动都必须经过 GEO 扫描验证才算完成。

---

## 技术栈与运行

- **框架**：Docusaurus 3.9 + React 19 + TypeScript + Tailwind CSS 3 + Mermaid
- **i18n**：`zh-Hans`（默认）/ `en`
- **部署**：GitHub Pages，`CNAME = memfit.ai`，仓库 `yaklang/memfit-home`
- **Node**：≥ 20

```bash
npm install              # 装依赖
npm start                # 开发服务器，已固定 http://localhost:3333
npm run build            # 生产构建 → build/
npm run serve            # 本地预览生产构建（http://localhost:3000，可加 --port 3333）
npm run clear            # 清 .docusaurus 缓存（构建异常时用）
npm run typecheck        # tsc 类型检查
```

---

## ⛳ 核心工作流：改 → 验（不可省略）

> **定义：一个问题只有当 GEO 扫描确认修复后，才算"彻底解决"。改了代码但没重新扫描通过 = 未完成。**

### 1. 改完代码后必须重新扫描验证

geo 工具**只扫描已运行起来的 URL，不扫源码**。所以验证流程固定为：

```bash
npm run build && npm run serve -- --port 3333   # 起本地生产构建
# 另开终端或直接在本会话里：
/geo audit http://localhost:3333                 # 完整审计
# 或针对性复查单项：
/geo crawlers http://localhost:3333              # robots.txt
/geo schema  http://localhost:3333               # 结构化数据
/geo technical http://localhost:3333             # 技术 SEO
/geo citability http://localhost:3333            # AI 可引用性
```

- 本地扫描**无法**覆盖需要真实域名的项（sitemap 在真实域、外部 brand mentions、IndexNow 等）——这些需部署到 memfit.ai 后再 `/geo audit https://memfit.ai` 复查。
- 配置类修复（`url`/canonical/robots/llms.txt/schema/H1/og）本地扫描即可确认。
- 扫描结果若仍报该问题，**不得标记为完成**，继续修直到扫描通过。

### 2. 拿不准就停下来问（不要自行猜测）

遇到以下类型的问题，**先问用户、拿到确认后再动手**，不要擅自决定：

- 品牌资产：logo / og:image / favicon 的最终图源与文件名
- 官方信息：域名、仓库地址、社交链接、公司/团队信息、联系方式
- 产品定位文案：meta description / llms.txt / schema 里用于实体识别的官方表述
- 外部关系：与 Yaklang / SSA 的官方关系表述、链接是否可公开
- 法律/信任页：LICENSE 类型、隐私政策/条款内容
- 任何"看起来需要业务方拍板"的措辞或链接

### 3. 已锁定的事实（无需再问，直接用）

| 项 | 值 |
|---|---|
| 官方域名 | `https://memfit.ai` |
| GitHub 仓库 | `yaklang/memfit-home`（`organizationName=yaklang`, `projectName=memfit-home`） |
| 产品定位语 | "Yaklang 生态的开源网络安全 AI Agent 编排框架，递归式双引擎（ReAct+Plan）让 AI 拥有看得见的行动力" |
| og:image | 暂用 `static/img/memfit-ai-concept.jpg` 占位（后续换正式 1200×630 品牌卡） |

---

## ✅ 已完成的 GEO 修复（本地复审 73/100，基线 32/100）

详见 `GEO-AUDIT-REPORT-LOCAL.md`。已修复并验证：C1 url 死域名 / C2 og:image 404 / C3 robots.txt / C4 首页 H1 / C5 meta description / H1 schema(Organization+SoftwareApplication+WebSite+TechArticle+AboutPage) / H2 llms.txt+llms-full.txt / H3 LICENSE(Apache-2.0) / H4 about+privacy+terms 信任页 / M4 Yaklang 官方身份 / M5 文档 description / M1 git 更新时间 / L4 keywords / 13 个 AI 爬虫显式放行。

---

## 🟡 未实现待办（后续实现）

> 当前已触及"代码级天花板"（73/100）。下列项是进一步涨分的关键，按性质分类。**每实现一项仍需按「改→验」流程重新 build + `/geo audit` 确认。**

### A. 需真实数据 / 运营动作（非源码可解，最高 ROI）

- [ ] **sameAs 扩展**：Organization.sameAs 当前仅 GitHub + yaklang.com。建立后补 LinkedIn 公司页 / YouTube 频道 / Wikipedia / Wikidata / X。Wikipedia 是 AI 实体解析最强信号（预计 schema +10、品牌大涨）。
- [ ] **Person 作者**：TechArticle author 现为 Organization(Yaklang Team)。提供核心维护者公开身份后，改 Person（name/jobTitle/worksFor/sameAs→GitHub/LinkedIn），并在 `/about` 加作者卡片（预计内容 +12、schema +12）。
- [ ] **overview 量化数据**：补真实指标（工具数量、基准对比、采用量、审计案例 Token/耗时/召回率）—— citability 唯一短板。
- [ ] **Wikipedia/Wikidata 条目**：建立 Memfit AI 实体页（解决撞名 + 实体识别）。
- [ ] **第三方收录**：G2 / Capterra / awesome-list / SecurityWeek。
- [ ] **GitHub 仓库元数据**（H6）：description 改定位句、补 topics、填 homepage=memfit.ai（仓库 Settings 里改，30 秒）。

### B. 平台 / 架构决策

- [ ] **C6 安全 header（HSTS/CSP/X-Frame-Options 等）**：GitHub Pages 不支持自定义 header，需前置 Cloudflare 或迁 Cloudflare Pages/Vercel。
- [ ] **M7 长缓存**：`/assets/*` 带 hash 本应 immutable，GitHub Pages 仅 `max-age=600`，同样需 Cloudflare。
- [ ] **Markdown content negotiation**（`Accept: text/markdown`）：Cloudflare Pages 一行开启。

### C. 部署后线上验证（本地无法覆盖）

- [ ] 部署到 memfit.ai 后跑 `/geo audit https://memfit.ai` 完整复扫。
- [ ] **Bing Webmaster**：加 `<meta name="msvalidate.01">` + 提交 sitemap。
- [ ] **IndexNow**：根目录放 `{key}.txt`，发布/更新时 ping。

### D. 源码可做（择机优化，工作量小~中）

- [ ] **SearchAction**：首页 WebSite schema 加 `potentialAction`，指向 Google 站搜模板 `https://www.google.com/search?q=site:memfit.ai+{search_term_string}`（无后端搜索时的合规 sitelinks search box，预计 +3）。
- [ ] **speakable**：TechArticle / 首页加 `speakable`（cssSelector 指向摘要段），声明 AI 助手可朗读区段（预计 +10）。
- [ ] **BreadcrumbList 多级**：当前 overview 顶层 doc 仅 1 级。需重构 sidebar 把 overview 纳入分类，或 swizzle 注入「首页›文档›页」。
- [ ] **sitemap lastmod + en 版本**：Docusaurus 默认无 `<lastmod>`，且未含 `/en/`。
- [ ] **FAQPage schema**：核心文档加问答型 H2 + 40-60 字直答段 + FAQPage（AIO/ChatGPT 受益）。
- [ ] **twitter:title / twitter:description**：当前仅 twitter:card+image。
- [ ] **`/team` 页**：列 Yaklang 团队 + Person schema。
- [ ] **编辑准则 / 纠错政策页** + 公开联系邮箱 / security@。
- [ ] **图片 `width`/`height`**：降低 CLS 风险（首屏 + 架构图）。
- [ ] **M3 首页 hero 文案重复**：排查 NewHome "五大支柱"多处复述（疑似粘性导航设计，非 bug，确认后再动）。
- [ ] **og:image 正式品牌卡**：换 1200×630 正式图（现为 memfit-ai-concept.jpg 占位）。

---

## 关键文件地图

| 文件 | 作用 |
|---|---|
| `docusaurus.config.ts` | **C1 根因所在**：`url`/`baseUrl`/`organizationName`/`projectName`/`editUrl`/`themeConfig.image` |
| `src/pages/index.tsx` | 首页入口，实际导出 `NewHome`（`HomepageHeader` 是死代码，但含示例 H1） |
| `src/components/NewHome/` | 真正渲染的首页组件；`HeroSection.tsx`（hero）、`AnimatedTitle.tsx`（C4 的 span 拆字）、`WhatIsSection.tsx` 等 |
| `static/robots.txt` | 待新建（C3） |
| `static/llms.txt` | 待新建（H2） |
| `static/img/` | 静态资源；og:image 占位图在此 |
| `CNAME` | `memfit.ai`（GitHub Pages 自定义域） |
| `sidebars.ts` | 文档侧边栏 |

---

## GEO 工具说明（已装在项目内）

- geo skill 安装在**本项目** `.claude/skills/geo/`（含隔离 venv `.venv/`），**未污染全局 `~/.claude`**。
- 重装/更新：`bash .claude/scripts/install-geo-skill.sh`（源默认指向 `/Volumes/coding/application/geo-seo-claude`，可用 `GEO_SRC=...` 覆盖）。
- venv 已加入 `.gitignore`，不要提交。
- 审计报告产物（`GEO-AUDIT-REPORT-*.md`）是验证基线，修复后与之对照看分数变化。

---

## 编码约定

- 改 Docusaurus 配置后，`url`/canonical/sitemap/hreflang/JSON-LD 的 URL 都从 `url` 字段派生——**永远不要在别处硬编码站点域名占位值**。
- 新增页面必须有语义化 `<h1>` 和 `meta description`；不要用纯 `<span>`/SVG 充当主标题。
- 静态基础设施文件（robots.txt / llms.txt / CNAME）放 `static/`，构建后原样发布到根目录。
- 提交前跑一次 `npm run build` 确保构建通过。
