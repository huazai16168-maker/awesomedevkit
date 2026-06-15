# AwesomeDevKit 网站规划

> 最后更新：2026-06-14
> 状态：即将部署到 Cloudflare Pages（等待 GitHub 仓库 + 构建配置）

---

## 一、重新定位

**当前问题：** 首页 metadata 描述写的是 "launch and growth tools for indie developers"，太窄了。我们实际上已经做了正则、Cron、JSON、Social Card Preview 这些通用开发者工具。

**新定位：**
> "Free, browser-based developer tools. No login. No AI. No data leaves your machine."

**目标用户：**
- 独立开发者 / Indie Hackers（主）
- 前端工程师（次）
- 全栈 / DevOps（再次）

**差异化（为什么要用 AwesomeDevKit 而不是其他工具站）：**
1. **更快** — 纯静态，全球 CDN，零服务器
2. **更干净** — 无广告，无弹窗，无注册
3. **更专注** — 不是 989 个工具的垃圾场，每个工具精心打磨
4. **Anti-AI 立场** — 明确不做 AI 功能，做开发者信赖的确定性工具

---

## 二、站点架构

### 导航结构

```
Home (/)
├── Tools (/tools) — 全部工具列表
│   ├── [slug] — 单个工具页面
│   └── category/[category] — 按分类筛选（plan）
├── Guides (/guides) — PLAN: 使用指南 / 教程（SEO 内容）
│   └── [slug] — 单篇文章
├── About (/about) — 关于本站
└── Contact (/contact) — 已存在
```

### 页脚链接

```
[Tools] [Guides] [About] [Contact] [Privacy] [Terms]
[LaunchAssetKit] [heng yisourcing]
```

### 首页需要改

当前首页偏重 "launch tools"，需要改成展示全部 9 个工具 + 按分类分组展示。hero 区域的文案要从 "launch and growth tools" 改成通用开发者工具。

---

## 三、工具路线图

### Phase 1：现有 9 个工具（已就绪）

| # | 工具 | 状态 | SEO 潜力 |
|---|------|------|----------|
| 1 | AI Search Visibility Checker | ✅ 已有 | 低（AI 关键词竞争激烈） |
| 2 | Landing Page SEO Roast | ✅ 已有 | 中 |
| 3 | Product Hunt Launch Copy | ✅ 已有 | 中 |
| 4 | SaaS Pricing Page Copy | ✅ 已有 | 中 |
| 5 | App Launch Checklist | ✅ 已有 | 中 |
| 6 | Regex Tester | ✅ 已有 | ★ 高（"regex tester" 搜索量巨大） |
| 7 | Cron Expression Generator | ✅ 已有 | ★ 高（"cron generator" 稳定搜索） |
| 8 | JSON Formatter & Validator | ✅ 已有 | ★ 最高（"json formatter" 月搜百万级） |
| 9 | Social Card Previewer | ✅ 已有 | 中 |

### Phase 2：下一批 7 个（高优先级）

工具选择原则：挑选搜索量高、实现简单（纯前端、无需后端）的类别。

| 优先级 | 工具 | 搜索关键词 | 实现难度 | 预期 SEO 价值 |
|--------|------|-----------|----------|-------------|
| P0 | **Base64 / URL / HTML 编解码一体** | base64 encoder, url decoder | ★☆☆ | ★★★ |
| P0 | **Diff Checker（文本/代码对比）** | diff checker, text compare | ★☆☆ | ★★★ |
| P0 | **UUID / ULID 生成器** | uuid generator | ★☆☆ | ★★★ |
| P1 | **JWT Debugger** | jwt debugger, jwt decoder | ★★☆ | ★★☆ |
| P1 | **Timestamp 转换 + 时区** | timestamp converter | ★☆☆ | ★★☆ |
| P1 | **图片压缩（浏览器端 WASM）** | image compressor, compress image online | ★★★ | ★★★★ |
| P2 | **Markdown 实时预览 + 转 HTML** | markdown editor, md to html | ★★☆ | ★★★ |

### Phase 3：增长工具（上线后根据数据决定）

- Mock Data 生成器（姓名/邮箱/地址/电话 fake data）
- CSS 渐变可视化生成器
- Color 调色板 + 对比度检查
- 在线正则替换工具（Regex Replace）
- HTTP Status Code 速查 + 描述
- IP / 子网计算器
- 文本统计（字数/行数/词频）
- SQL 格式化
- YAML ↔ JSON 互转
- Cookie / LocalStorage 编辑器

### Phase 4：高阶工具（需要 WASM 或更多投入）

- 全功能 Base64 / 图片编解码
- 浏览器内代码沙箱执行
- 多格式图片转换（WebP/AVIF/PNG/JPEG）
- CSV ↔ JSON 互转 + 编辑器
- 正则可视化（Railroad Diagram）

---

## 四、SEO & 内容策略

### 核心原则

工具站获取流量的引擎是 **Google Search**。每个工具页面就是一个 landing page。

### 每个工具页面需要优化

```
- 页面标题: "{Tool Name} - AwesomeDevKit"
- H1: 包含主要关键词（如 "Online JSON Formatter & Validator"）
- meta description: 包含关键词 + 价值主张
- URL: /{tool-slug}
- 内部链接: 推荐相关工具（"你可能也需要"）
- FAQ: 结构化数据（FAQ Schema），3-5 个问题
- CTA: 引导到其他工具
```

### 内容策略（Phase 2 做）

每个高流量工具配一篇使用指南：

| 工具 | 指南标题 |
|------|---------|
| JSON Formatter | "JSON Formatting Guide: Best Practices for API Developers" |
| Regex Tester | "Regex Cheat Sheet: 20 Patterns Every Developer Should Know" |
| Cron Expression | "Cron Expression Examples: Every Schedule Pattern Explained" |
| Base64 Encoder | "When to Use Base64 Encoding: A Developer's Guide" |
| Diff Checker | "How to Compare Code Files Like a Pro" |

这些文章放在 `/guides/` 目录下，既可以独立被搜索引擎收录，又可以为对应工具页面引流。

### 技术 SEO

- ✅ sitemap.xml（已存在）
- ✅ robots.txt（已存在）
- ✅ Open Graph / Twitter Card meta（已存在）
- ✅ 结构化数据（ItemList + 每个工具的 FAQ）
- ⬜ Google Search Console（上线后添加）

---

## 五、变现思考

### 方案 A：Affiliate 链接（推荐，最轻量）

在工具页面底部或侧边栏添加推荐链接：
- 推荐的托管服务（Cloudflare、Vercel）
- 推荐的域名注册商（Spaceship、Namecheap）
- 推荐的开发工具（VS Code 插件、API 工具等）

不影响用户体验，零开发成本。

### 方案 B：付费 Pro 版（中后期）

对高价值工具提供 Pro 版本：
- JSON Formatter Pro：大文件支持（>10MB）、Schema 验证、批量处理
- Image Compressor Pro：批量压缩、自定义输出尺寸、保留 EXIF
- Regex Tester Pro：保存模式、团队分享

### 方案 C：B2B 导流

通过 "Request help" 邮件收集需求，引流到你的外贸/采购服务。

### 建议

先走方案 A，零成本零风险。月访问量到 10万 后再考虑方案 B。

---

## 六、设计 / UX 改进

### 当前问题

1. **首页文案偏了** — "launch and growth tools" 不匹配新定位
2. **缺少分类** — 9 个工具混在一起，没有按类别分组
3. **缺少跨工具推荐** — 用户用完一个工具就流失了
4. **缺少暗色模式** — 开发者工具站标配
5. **页面不够快** — 没有做字体优化、图片优化

### 计划改进

| 改进 | 优先级 | 复杂度 |
|------|--------|--------|
| 首页改写（反映新定位） | P0 | 低 |
| 工具分类（Developer Utility / SEO / Launch） | P0 | 低 |
| 交叉推荐模块（"你可能也需要"） | P1 | 中 |
| 暗色模式 | P1 | 中 |
| 字体优化（Inter 自托管 + subset） | P1 | 低 |
| 工具页面加载性能优化 | P1 | 中 |
| 统一的工具侧边栏（导航 + 推荐 + 广告位） | P2 | 中 |

---

## 七、Codex 执行清单（按顺序）

等 Codex 19号积分重置后，告诉它做这些：

### 第 1 步：修复首页定位（低难度）

- [ ] 修改 `src/app/page.tsx` — hero 文案 + 描述从 "launch tools" 改成通用开发者工具
- [ ] 修改 `src/app/layout.tsx` — metadata 改成新定位
- [ ] 添加分类标签展示

### 第 2 步：新增 Phase 2 工具（低-中难度）

- [ ] Base64 / URL / HTML 编解码合一页面（一个页面三种编码）
- [ ] Diff Checker 页面（文本对比）
- [ ] UUID / ULID 生成器页面
- [ ] JWT Debugger 页面
- [ ] Timestamp 转换页面
- [ ] 图片压缩页面（用 browser-image-compression 库，纯前端）
- [ ] Markdown 预览页面
- [ ] 在 `src/lib/tools.ts` 添加全部新工具的元数据

### 第 3 步：部署到 Cloudflare Pages（低难度）

- [ ] 初始化 GitHub 仓库并 push 代码
- [ ] Cloudflare Pages → Connect to Git → 配置构建
- [ ] 添加自定义域名 awesomedevkit.com
- [ ] Spaceship 改 DNS（指向 Cloudflare nameserver）

### 第 4 步：SEO 内容（中难度）

- [ ] 创建 `/guides/` 路由
- [ ] 为每个高流量工具写一篇指南文章
- [ ] 添加内部链接：工具 ↔ 对应指南

### 第 5 步：改进（中难度）

- [ ] 暗色模式
- [ ] 交叉推荐
- [ ] 分类导航

---

## 八、域名 DNS 切换备忘

**为什么现在不改 DNS？** 因为还没有 build + deploy，改完 DNS 会指向空网站。

**等 Codex 部署后**需要做：

1. 登录 Spaceship → DNS 管理
2. 把 nameserver 改成 Cloudflare 的（添加 awesomedevkit.com 到 Cloudflare 时会给你）
3. 等待 DNS 生效（几分钟到几小时）
4. 以后 Hostinger 只跑 hengyisourcing.com 和 agarwoodart.com

---

## 九、关键指标（上线后跟踪）

| 指标 | 第一个月目标 | 第三个月目标 |
|------|------------|------------|
| 收录工具数 | 9 | 16 |
| 月访问量 | 1,000 | 10,000 |
| Google 收录页数 | >20 | >50 |
| 平均停留时间 | >1min | >2min |
| 日活跃工具使用 | >50 | >500 |
