# SEO Optimization Guide

This guide outlines how to optimize your personal Astro blog for search engines to ensure maximum visibility and high-quality traffic.

## 1. Technical SEO

### ✅ Site URL & Sitemap
The `astro.config.mjs` is already configured with:
```javascript
export default defineConfig({
  site: "https://www.dongming.me",
  integrations: [sitemap()],
});
```
- **Sitemap**: Automatically generated at `https://www.dongming.me/sitemap-index.xml`. Submit this to [Google Search Console](https://search.google.com/search-console/about).
- **Robots.txt**: Ensure your `public/robots.txt` allows indexing of your posts.

### ✅ Open Graph & Twitter Tags
Your `src/layouts/Layout.astro` now includes dynamic OG tags. For every post, ensure you pass:
- `title`: For the tab and search results.
- `description`: For the snippet below the title.
- `ogImage`: (Optional) Custom image for social preview. Default is `avatar.jpg`.

### ✅ Canonical URLs
**Status: ✅ Fully Implemented**

Canonical tags are automatically generated for every page. For blog posts, you can override the canonical URL in the frontmatter:

```yaml
---
title: "My Post Title"
canonicalURL: "https://medium.com/@user/original-post"  # Optional: Use for migrated content
---
```

If not specified, the canonical URL defaults to the post's URL on your site.

### ✅ Structured Data (JSON-LD)
**Status: ✅ Fully Implemented**

Every blog post automatically includes Article schema markup with:
- Headline, description, and image
- Author information
- Publication and modification dates
- Publisher details

This helps Google display rich snippets in search results (e.g., author name, publish date).

### ✅ Semantic HTML Structure
- Use only **one `<h1>`** per page (usually the post title).
- Use `<h2>` and `<h3>` for content hierarchy.
- Use `<time>` tags for publication dates.

---

## 2. Content SEO

### ✅ Metadata in MDX
For every blog post (in `src/content/blog/`), ensure the frontmatter is complete:
```yaml
---
title: "The Art of Lean Systems"
description: "Why minimal code leads to maximum performance."
pubDatetime: 2026-01-09T15:00:00Z
tags: ["engineering", "philosophy"]
---
```

### ✅ Alt Text for Images
Always provide descriptive alt text for images to help accessibility and Image Search:
```markdown
![Diagram showing the feedback loop of minimalist design](/assets/lean-diagram.png)
```

### ✅ Internal Linking
Link between your related posts. This helps search engines understand the structure of your content and keeps users on the site longer.

---

## 3. Performance & Experience (Core Web Vitals)

### ✅ Image Optimization
- Use the `<Image />` component from `astro:assets` instead of standard `<img>` tags.
- It automatically handles lazy loading, WebP conversion, and resizing.

### ✅ Font Performance
- Self-host your fonts (already partially done via `public/fonts/`).
- Use `font-display: swap;` in your CSS to prevent invisible text during load.

### ✅ Minimal JavaScript
- Astro's "Zero JS by default" is your biggest SEO advantage.
- Avoid heavy client-side libraries unless strictly necessary for interactivity.
