# Yukari's LEAF - 个人博客代码库

欢迎来到 Yukari.online 的源代码仓库！本博客已于近期从 Hugo 引擎全面重构升级至现代前端框架 **Astro**，并搭配了极致的深色模式与玻璃拟物化 (Glassmorphism) 主题。

本 README 记录了博客的技术架构、目录结构以及日常维护指南，方便随时查阅。

---

## 🚀 技术栈 (Tech Stack)

* **核心框架**: [Astro (v7+)](https://astro.build/) - 零 JS 负担的静态站点生成器。
* **样式系统**: 原生 CSS (CSS Variables) + Glassmorphism 设计。
* **页面路由**: Astro 自带的 `<ClientRouter />`，提供类似原生 App (SPA) 的无缝丝滑跨页跳转。
* **内容管理**: Astro Content Layer API (`astro/loaders`)，原生支持 Markdown 解析。
* **评论系统**: [Giscus](https://giscus.app/zh-CN) - 基于 GitHub Discussions 构建。
* **部署平台**: [Cloudflare Pages](https://pages.cloudflare.com/) - 自动化构建与边缘网络 CDN。

---

## 📂 项目结构 (Project Structure)

```text
.
├── content/              # ✍️ 博客文章的根目录 (存放你的所有 Markdown 文件)
│   └── posts/            # 文章按类别分子文件夹存放
├── public/               # 🖼️ 静态资源目录 (图片、favicon 等)
│   └── Pic/              # 存放文章中引用的本地图片 (在 MD 中通过 /Pic/... 引用)
├── src/                  # 💻 博客前端源代码
│   ├── layouts/          # 页面布局骨架 (包含导航栏、页脚、ViewTransitions配置)
│   ├── pages/            # 核心页面路由 (首页 index.astro、归档页 posts/index.astro 等)
│   ├── styles/           # 全局 CSS 样式表 (颜色变量、动画效果都在这)
│   └── content.config.ts # Astro 的 Content Layer 配置文件，定义了 Markdown 的数据结构
├── astro.config.mjs      # Astro 全局配置 (配置了 sitemap 和部署网址)
└── package.json          # Node.js 依赖清单
```

---

## ✍️ 日常维护与写作指南

### 1. 发布新文章
你只需要在 `content/posts/` 目录下（或者它的任意子目录里）新建一个 `.md` 文件即可。Astro 会自动扫描并将其渲染为网页。

**标准的文章头部 (Frontmatter) 格式如下：**
```markdown
---
title: "你的文章标题"
date: 2026-06-26T21:00:00+08:00
categories: ["分类1", "分类2"]
summary: "这是一段简短的摘要，会显示在主页和列表页。"
---

这里是正文...
```

### 2. 插入图片
将图片放入 `public/Pic/` 目录下。
在 Markdown 中引用时，使用以 `/` 开头的绝对路径即可，这样无论文章在哪一层目录，图片都能正确显示：
```markdown
![说明文字](/Pic/你的图片.png)
```

### 3. 评论系统管理 (Giscus)
文章底部的评论完全交由 Giscus 托管。如果未来您更改了 GitHub 的仓库名或设置，请在 `src/pages/posts/[...slug].astro` 的底部找到 `<script src="https://giscus.app/client.js"...>` 标签，更新对应的 `data-repo` 和 `data-repo-id` 即可。

---

## 🛠️ 本地开发与预览命令

如果你想在修改代码或写完文章后，在本地先预览一下效果，可以在终端运行以下命令：

| 命令 | 说明 |
| :--- | :--- |
| `npm install` | 安装或更新依赖项 (通常只在初次拉取代码时执行一次) |
| `npm run dev` | 启动本地开发服务器，在 `http://localhost:4321` 实时预览博客 |
| `npm run build` | 编译构建生产环境的代码到 `dist/` 目录 (通常由 Cloudflare 自动执行) |

---

## ☁️ 自动部署机制 (Cloudflare Pages)

博客已经接入了 CI/CD（持续集成与部署）。
当你完成了一篇新文章，或者修改了任何样式，**只需要执行标准的 Git 提交和推送**：

```bash
git add .
git commit -m "Update: 新增了一篇文章"
git push
```

Cloudflare Pages 会立即捕捉到 `push` 动作，并在云端全自动执行 `npm run build`。大约 30 秒内，线上域名（如 `https://yukari.online`）的内容以及对应的 Sitemap 就会自动更新，**完全不需要任何手动干预**。
