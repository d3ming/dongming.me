# Draft Post Security Analysis & Fix

> Historical record of the January 2026 boolean-field incident. The current
> implementation uses `status: draft`, `status: published`, and
> `status: unlisted`; see the [current content visibility guide](guides/content-visibility.md)
> for the behavior enforced by the production build.

**Date:** 2026-01-09
**Issue:** Draft posts were being published to production
**Severity:** HIGH - Confidential draft content exposed publicly

## Root Cause Analysis

### The Problem
Draft posts marked with `draft: true` in frontmatter were being generated as static pages and accessible in production builds, despite being intended for development preview only.

### Why It Happened
Two critical files were calling `getCollection("blog")` **without filtering**:

1. **`src/pages/posts/[...id].astro`** (Lines 6-12)
   - Generated static pages for ALL posts, including drafts
   - No environment check or draft filtering
   - Result: Draft posts got full HTML pages in `dist/` folder

2. **`src/pages/index.astro`** (Lines 8-11)
   - Displayed latest 3 posts without filtering
   - Could show drafts on homepage in production

### Files That Were Already Safe ✅
- `src/pages/posts.astro` - Had proper filtering (line 9)
- `src/pages/rss.xml.ts` - Had proper filtering (line 9)

## The Fix

### Changes Made

#### 1. Fixed `src/pages/posts/[...id].astro`
```typescript
export async function getStaticPaths() {
  const isDev = import.meta.env.DEV;
  const posts = await getCollection("blog", ({ data }) => {
    // In production, exclude drafts and private posts
    if (!isDev) {
      return !data.draft && !data.private;
    }
    // In dev, show everything
    return true;
  });
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}
```

#### 2. Fixed `src/pages/index.astro`
```typescript
const posts = await getCollection("blog");
const isDev = import.meta.env.DEV;
const latestPosts = posts
  .filter((p) => isDev || (!p.data.draft && !p.data.private))
  .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime())
  .slice(0, 3);
```

## Verification Results

### Development Mode (Expected Behavior)
- ✅ Drafts ARE visible (for preview)
- ✅ Draft post appears in "Latest Writing"
- ✅ Draft post accessible at `/posts/2026/2026-01-09-ai-draft-about-page`

### Production Build (Fixed Behavior)
- ✅ Drafts NOT in `dist/` folder
- ✅ Draft post NOT in sitemap
- ✅ Draft post NOT on homepage
- ✅ Draft post NOT on /posts page
- ✅ Direct URL returns 404

### Build Output Verification
```bash
# Production build only generated 5 posts (not 6):
▶ src/pages/posts/[...id].astro
  ├─ /posts/20201101-wealth-financial-freedom/index.html
  ├─ /posts/mingdom-moment-20200927/index.html
  ├─ /posts/annual-review-first-year-of-retirement/index.html
  ├─ /posts/life-update-1-month-after-my-retirement/index.html
  └─ /posts/2026/2026-01-09-i-am-tbd/index.html
  # ❌ 2026-01-09-ai-draft-about-page NOT generated ✅
```

### HTTP Logs Verification
```
HTTP GET /posts/2026/2026-01-09-ai-draft-about-page
Returned 404 in 2 ms ✅
```

## Prevention Strategy

### Current Protection Layers
1. **Static Site Generation Filtering** - Drafts not generated in production
2. **Homepage Filtering** - Drafts excluded from latest posts
3. **Posts Page Filtering** - Drafts shown separately in dev only
4. **RSS Feed Filtering** - Drafts excluded from feed
5. **Sitemap** - Only includes generated pages (automatic)

### Recommended Best Practices

#### 1. Use Consistent Filtering Pattern
Always use this pattern when querying posts:

```typescript
const isDev = import.meta.env.DEV;
const posts = await getCollection("blog", ({ data }) => {
  if (!isDev) {
    return !data.draft && !data.private;
  }
  return true;
});
```

#### 2. Add Linting Rule
Consider adding a custom lint rule to catch unfiltered `getCollection("blog")` calls.

#### 3. Pre-Deploy Checklist
Before deploying:
- [ ] Run `make build` locally
- [ ] Check `dist/posts/` for unexpected files
- [ ] Verify sitemap doesn't include drafts: `cat dist/sitemap-0.xml | grep -i draft`
- [ ] Test production build locally: `npx serve dist`

#### 4. Content Schema Validation
The schema already defines draft/private fields:
```typescript
draft: z.boolean().optional(),
private: z.boolean().optional(),
```

Consider making these required with defaults:
```typescript
draft: z.boolean().default(false),
private: z.boolean().default(false),
```

## Testing Commands

```bash
# Build and verify
make build

# Check for draft files in dist
ls -la dist/posts/2026/

# Check sitemap
cat dist/sitemap-0.xml | grep -i draft

# Serve production build locally
npx serve dist

# Test draft URL (should 404)
curl -I http://localhost:3000/posts/2026/2026-01-09-ai-draft-about-page
```

## Lessons Learned

1. **Environment-aware filtering is critical** - Dev and prod must behave differently
2. **Static site generation requires explicit filtering** - Unlike dynamic sites, pages are generated at build time
3. **Multiple exposure points** - Must check ALL places where content is queried
4. **Verify production builds** - Always test the actual `dist/` output, not just dev server

## Status
✅ **FIXED** - Draft posts are now properly excluded from production builds while remaining accessible in development for preview.
