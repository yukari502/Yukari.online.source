# Yukari's LEAF - 个人博客代码库

本仓库为 Yukari.online 的源代码，基于 **Astro** 构建。本 README 记录了项目的核心技术架构、目录结构及开发指南，供日常维护参考。
本仓库可以自由fork修改，但是本仓库写的任何文章内容不可修改。
网站基于AGPL v3协议

---

## 🚀 技术栈 (Tech Stack)

* **核心框架**: [Astro (v7+)](https://astro.build/) - 静态站点生成器 (SSG)
* **样式系统**: 原生 CSS (CSS Variables)
* **页面路由**: Astro `<ClientRouter />` 视图过渡 (View Transitions)
* **动态交互**: 原生 JavaScript (IntersectionObserver、无限滚动、视差滚动)
* **内容管理**: Astro Content Layer API (`astro/loaders`)
* **Markdown 处理**: Markdown原生支持，`remark-math` 和 `rehype-katex` 处理 LaTeX 数学公式
* **评论系统**: [Giscus](https://giscus.app/zh-CN) (基于 GitHub Discussions)
* **部署平台**: [Cloudflare Pages](https://pages.cloudflare.com/) (CI/CD 自动构建)

---

## 📂 项目结构 (Project Structure)

```text
.
├── content/              # 内容根目录 (Markdown)
│   ├── category_order.json # 分类排序配置文件 (用于 INDEX 栏目)
│   └── posts/            # 文章文件存放目录
├── public/               # 静态资源目录 (图片、favicon)
│   └── Pic/              # 本地文章配图目录 (/Pic/...)
├── src/                  # 博客前端源代码
│   ├── layouts/          # 布局骨架 (Layout.astro)
│   ├── pages/            # 核心页面路由 (index.astro, [slug].astro)
│   ├── styles/           # 全局 CSS 样式表 (global.css)
│   └── content.config.ts # Astro Content Layer 配置文件
├── astro.config.mjs      # Astro 全局配置 (集成插件、部署 URL 等)
└── package.json          # Node.js 依赖清单
```

---

## ✍️ 日常维护指南

### 1. 发布文章
在 `content/posts/`（或其子目录）中新建 `.md` 文件即可自动解析。
Frontmatter 格式规范：
```markdown
---
title: "文章标题"
date: 2026-06-26T21:00:00+08:00
categories: ["分类1", "分类2"]
summary: "简短摘要"
---
```

### 2. 本地图片引用
将图片存放至 `public/Pic/` 目录，在 Markdown 中使用绝对路径引用：
```markdown
![说明](/Pic/image.png)
```

### 3. Giscus 评论配置
如需更改 GitHub 仓库，请更新 `src/pages/posts/[...slug].astro` 底部 `<script src="https://giscus.app/client.js"...>` 中的 `data-repo` 与 `data-repo-id` 属性。

---

## ⚙️ 核心技术细节

### 1. INDEX 分类自定义排序
侧边栏分类树排序由 `content/category_order.json` 控制：
- **指定排序**：在 JSON 中声明的分类将按定义的顺序前置显示。
- **自动后补**：未在 JSON 中声明的分类将自动追加至列表末尾，按字母序 (A-Z) 排序。

### 2. LaTeX 公式渲染
数学公式渲染已在 `astro.config.mjs` 中通过 remark/rehype 插件注册：
- **行内公式**：`$E=mc^2$`
- **块级公式**：`$$...$$`
渲染依赖 `src/layouts/Layout.astro` 头部加载的 `katex.min.css` 样式。

### 3. 动态加载与视图交互
- **Infinite Scroll**：首页基于 `IntersectionObserver` 实现文章列表无极加载。
- **Fluid Scroll Reveal**：采用 `IntersectionObserver` 和 CSS Transition 实现元素的按需加载浮现（DOM进入视口时附加样式类）。
- **Sticky Layout**：文章目录 (TOC) 和分类索引基于原生 HTML `<details>` 与 `position: sticky` 实现无 JS 折叠与悬浮状态。

---

## 🛠️ 本地开发

| 命令 | 说明 |
| :--- | :--- |
| `npm install` | 安装项目依赖 |
| `npm run dev` | 启动本地服务器 (`http://localhost:4321`) |
| `npm run build` | 编译生产环境代码至 `dist/` |

---

## ☁️ 自动部署 (Cloudflare Pages)

本项目接入了 Cloudflare Pages CI/CD。通过 Git 推送代码或提交新文章至仓库主分支，将触发自动构建部署：

```bash
git add .
git commit -m "Update content"
git push
```
云端自动执行 `npm run build`，部署完毕后自动更新线上环境与 Sitemap。
