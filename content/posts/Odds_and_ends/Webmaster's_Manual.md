+++
title = "Webmaster's Manual"
date = 2025-01-01T01:49:00+08:00
draft = false
categories = ['Odds_and_ends']
description = "Technical architecture, project structure, and daily maintenance guidelines for Yukari.online."
+++

Welcome to the technical manual for Yukari.online. This project is built using the **Astro** framework. This documentation outlines the core technical architecture, project structure, and daily maintenance guidelines to assist in ongoing development.

## 📜 License

This project is open-sourced under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. 
You are free to fork, modify, and distribute this repository under the terms of the AGPLv3 license. However, please note that **the content of all personal articles, images, and blog posts within this repository may not be modified, repurposed, or republished without explicit permission**.

---

## 🚀 Tech Stack

* **Core Framework**: [Astro (v7+)](https://astro.build/) - Static Site Generator (SSG)
* **Styling**: Native CSS (CSS Variables)
* **Routing**: Astro `<ClientRouter />` for seamless View Transitions
* **Dynamic Interactions**: Native JavaScript (IntersectionObserver, infinite scrolling, procedural SVG filters)
* **Content Management**: Astro Content Layer API (`astro/loaders`)
* **Markdown Processing**: Native Markdown support, integrated with `remark-math` and `rehype-katex` for LaTeX equations
* **Diagrams**: Native Markdown Mermaid block support parsed dynamically via client-side JavaScript
* **Commenting System**: [Giscus](https://giscus.app/) (Powered by GitHub Discussions)
* **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (Automated CI/CD)

---

## 📂 Project Structure

```text
.
├── content/              # Content root (Markdown)
│   ├── category_order.json # Category sorting configuration (used in the INDEX)
│   └── posts/            # Directory for markdown articles
├── public/               # Static assets (images, favicon, etc.)
│   └── Pic/              # Local image directory for articles (/Pic/...)
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layouts (e.g., Layout.astro)
│   ├── pages/            # Core routing pages (index.astro, [slug].astro)
│   ├── styles/           # Global CSS stylesheets (global.css)
│   └── content.config.ts # Astro Content Layer configuration
├── astro.config.mjs      # Global Astro configuration (plugins, deployment URL, etc.)
└── package.json          # Node.js dependencies
```

---

## ✍️ Maintenance Guidelines

### 1. Publishing Articles
Create a new `.md` file in `content/posts/` (or its subdirectories) for automatic parsing.
Frontmatter specification:
```toml
+++
title = "Article Title"
date = 2026-06-26T21:00:00+08:00  #ISO 8601 标准时间格式
draft = false
categories = ['Category 1', 'Category 2']
description = "Brief description"
+++
```

### 2. Local Image References
Store images in the `public/Pic/` directory and reference them in Markdown using absolute paths:
```markdown
![Description](/Pic/image.png)
```

### 3. Giscus Configuration
To change the target GitHub repository for comments, update the `data-repo` and `data-repo-id` attributes in the `<script src="https://giscus.app/client.js"...>` tag located at the bottom of `src/pages/posts/[...slug].astro`.

---

## ⚙️ Core Technical Details

### 1. Custom Category Sorting (INDEX)
The sidebar category tree sorting is controlled by `content/category_order.json`:
- **Specified Sorting**: Categories declared in the JSON file will be prioritized according to the defined order.
- **Automatic Fallback**: Categories not declared in the JSON file will be automatically appended to the end of the list and sorted alphabetically (A-Z).

### 2. Markdown Enhancements
- **LaTeX Math Rendering**: Handled via remark/rehype plugins registered in `astro.config.mjs`. Inline math (`$E=mc^2$`) and block math (`$$...$$`) are supported and rendered using `katex.min.css` loaded in the document head.
- **Mermaid Diagrams**: Diagram rendering is handled client-side via a dynamic ESM import in the main layout, ensuring compatibility with Astro's View Transitions and theme toggling.

### 3. Advanced UI Rendering & Animations
- **Procedural Liquid Glass Filter**: The navigation bar utilizes a purely native, GPU-accelerated SVG procedural filter (`feTurbulence` + `feDisplacementMap`). This operates independently of WebGL and achieves a high-performance, crystal-clear refraction effect via a CSS pseudo-element injection.
- **Fluid Scroll Reveal**: Employs `IntersectionObserver` and CSS Transitions to conditionally apply style classes as elements enter the viewport, achieving a staggered "Wabi-sabi" flow.
- **Infinite Scroll**: The homepage leverages `IntersectionObserver` to seamlessly load article lists.
- **Sticky Layouts**: The Table of Contents (TOC) and category index utilize native HTML `<details>` and `position: sticky` to implement collapsible, floating states without relying on JavaScript.

---

## 🛠️ Local Development

| Command | Description |
| :--- | :--- |
| `npm install` | Install project dependencies |
| `npm run dev` | Start the local development server (`http://localhost:4321`) |
| `npm run build` | Compile production code into the `dist/` directory |

---

## ☁️ Automated Deployment (Cloudflare Pages)

This project is integrated with Cloudflare Pages CI/CD. Pushing code or committing new articles to the main branch will trigger an automated build and deployment process:

```bash
git add .
git commit -m "Update content"
git push
```
The cloud environment will automatically execute `npm run build` and update the live environment and Sitemap upon completion.