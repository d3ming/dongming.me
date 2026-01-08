# User Guide for dongming.me

This guide explains how to manage content and configure your Astro-based personal site.

## 🚀 Quick Start

Ensure you have dependencies installed:

```bash
make install
make dev
```

Visit `http://localhost:4321` to see your changes live.

---

## ✍️ Writing Content

This site uses **Astro Content Collections**. All blog posts live in `src/content/blog/`.

### Creating a New Entry

1.  Create a new file in `src/content/blog/`: e.g., `my-new-post.md` (or `.mdx`).
2.  Add the required frontmatter at the top of the file:

```yaml
---
title: "My New Post"
description: "A short summary for SEO and previews."
pubDatetime: 2026-01-08T12:00:00Z
tags: ["tech", "astro"]
---

# My Post Content

Write your post here using Markdown.
```

### Writing a Draft

To create a draft that only appears in development but **not in production builds**:

1.  Add `draft: true` to the frontmatter:

```yaml
---
title: "Secret WIP Post"
draft: true
...
---
```

2.  The post will be visible when you run `make dev`, but excluded when you run `make build`.

### Publishing an Entry

1.  Remove `draft: true` (or set it to `false`).
2.  Ensure `pubDatetime` is set to your desired publication time.
3.  Commit and push your changes.

---

## 🛠️ Configuration

### Site Metadata

Global site configuration (Title, Author, Social Links) is managed in:
**`src/consts.ts`**

Edit this file to update:
- `SITE.title` / `SITE.desc`: SEO defaults.
- `NAV_LINKS`: Top navigation menu items.
- `SOCIAL_LINKS`: Links to GitHub, Twitter, etc.

### Styling & Design

- **Global Styles:** `src/styles/global.css`
  - CSS Variables for colors (`--background`, `--accent`, etc.)
  - Tailwind `@theme` configuration.
- **Typography:** The site uses Tailwind Typography plugin (`prose` classes) for blog content.

### Validating Changes

Before committing, it's good practice to run the linter and type checker:

```bash
make check
```

### Safety Features (Git Hooks)

We use `husky` and `lint-staged` to automatically check your code when you commit.
- **Secret Scanning:** `secretlint` checks for API keys and credentials.
- **Code Quality:** `biome` checks for linting and formatting errors.
- **Prevention:** If any check fails, the commit will be blocked. Fix the errors and try again.

---

## 🚀 Deployment

This project is optimized for deployment on platforms like **Vercel** or **Netlify**.

### Deploying to Vercel (Recommended)

1.  Push your code to a GitHub repository.
2.  Import the repository in Vercel.
3.  Vercel typically auto-detects Astro. If not, ensure the build settings are:
    - **Build Command:** `make build` (or `npm run build`)
    - **Output Directory:** `dist`
4.  Your site will automatically deploy on every push to `main`.

### Preview Deployments

If connected to Vercel/Netlify, opening a Pull Request will generate a unique preview URL for that branch.

---

## 📚 Further Reading

- [Astro Documentation](https://docs.astro.build)
- [Markdown Guide](https://www.markdownguide.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
