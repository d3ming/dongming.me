# Content Visibility & Preview Guide

This guide explains how to manage drafts and hidden content on `dongming.me`.

## 1. The Draft Workflow

We use a `draft` flag in the Frontmatter of blog posts to control visibility.

```yaml
---
title: "My Secret Post"
pubDatetime: 2026-01-09T18:00:00Z
draft: true
---
```

### 🛠 Local Development (Previewing)
When you run `make dev`, **all posts** (including those marked `draft: true`) are visible in the [Posts list](/posts). This allows you to proofread and verify layout before publishing.

### 🌐 Production (Public Site)
When the site is built for production (`make build`), posts with `draft: true` are:
1.  **Excluded** from the Posts list.
2.  **Excluded** from the RSS feed.
3.  **Excluded** from the XML sitemap.

---

## 2. Status Definitions

| Status | Frontmatter | Logic | Use Case |
| :--- | :--- | :--- | :--- |
| **Published** | Default | Shown everywhere. | General public content. |
| **Private** | `private: true` | Hidden from lists in Prod. Direct link works. | Content for a limited audience (friends, colleagues). Finished but not for everyone. |
| **Draft** | `draft: true` | Hidden from lists in Prod. Direct link works. | Works in progress. Not finished. |

---

## 3. "Shadow Publishing" (Sharing Previews)

Even if a post is a **Draft** or **Private**, Astro still generates a page for it at `/posts/[id]`. This is intentional.

- **How it works**: You can share the URL (e.g., `dongming.me/posts/my-private-post`) with someone. They can view the page, but nobody will find it by browsing the site or via search engines.
- **Security**: This is "security by obscurity." It is not a password-protected private post. Anyone with the URL can view it.

---

## 4. Local Development (Previewing)

When you run `make dev`, your `/posts` page is enhanced to show three distinct sections:
1.  **Posts**: Only truly published content.
2.  **Private (Dev Only)**: Posts marked `private: true`. Rendered with lower opacity to distinguish.
3.  **Drafts (Dev Only)**: Posts marked `draft: true`. Rendered with the lowest opacity.

---

## 5. How to Fully Publish

When you are ready to take a post live:

1.  Set `draft: false` and `private: false` (or remove the lines).
2.  Ensure `pubDatetime` is correct for sorting.
3.  Run `make lint` to ensure the filename matches the date.
4.  Commit and push to trigger the deployment.
