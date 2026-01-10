# SEO Linting Guide

## Overview

Your blog has an automated SEO linter that validates blog post frontmatter to ensure optimal search engine performance. It runs automatically before every commit and can be run manually at any time.

## What It Checks

### ✅ Required Fields (Errors)
- **Title**: Must be present
- **Description**: Must be present
- **Publication Date** (`pubDatetime`): Must be present

### ⚠️ Recommended Fields (Warnings)
- **Title Length**: 10-60 characters (optimal for search results)
- **Description Length**: 120-160 characters (optimal for search snippets)
- **Author**: Should be specified (defaults to site author if missing)
- **Tags**: Recommended for organization

## How to Use

### Manual Check
Run the linter anytime:
```bash
make lint
# or
npm run lint
```

### Automatic Check
The linter runs automatically before every commit via Husky.

### Example Output

```
🔍 Running SEO content linter...

Found 2 post(s) to validate.

📝 Checking: my-awesome-post
✅ [my-awesome-post]: Title length OK (25 chars)
✅ [my-awesome-post]: Description length OK (145 chars)
✅ [my-awesome-post]: Publication date present
✅ [my-awesome-post]: Author: Dong Ming

📝 Checking: draft-post
⏭️  [draft-post]: Skipping draft

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All posts pass SEO validation!
```

## Exit Codes

- **0**: All checks passed (or warnings only)
- **1**: Errors found (missing required fields)

**Note**: Warnings won't block commits, but errors will.

## Fixing Common Issues

### "Title too short"
```yaml
# ❌ Bad
title: "My Post"

# ✅ Good
title: "How I Built a Fast Blog with Astro"
```

### "Description too short"
```yaml
# ❌ Bad (30 chars)
description: "A post about Astro."

# ✅ Good (145 chars)
description: "Learn how I built a lightning-fast personal blog using Astro, Tailwind CSS, and modern web performance techniques. No JavaScript required."
```

### "Missing pubDatetime"
```yaml
# ❌ Bad
title: "My Post"
description: "..."

# ✅ Good
title: "My Post"
description: "..."
pubDatetime: 2026-01-09T17:00:00Z
```

## Skipping Drafts

Posts marked as drafts are automatically skipped:
```yaml
---
title: "Work in Progress"
description: "Not ready yet"
draft: true  # This post won't be linted
---
```

## Integration with CI/CD

If you set up GitHub Actions or Vercel deployment checks, add this to your workflow:

```yaml
- name: SEO Lint
  run: npm run seo-lint
```

This ensures no posts with SEO issues get deployed to production.

## Customizing Rules

To adjust the SEO rules (e.g., change description length), edit:
```
scripts/seo-lint.mjs
```

Look for the `RULES` object at the top of the file:
```javascript
const RULES = {
  TITLE_MIN_LENGTH: 10,
  TITLE_MAX_LENGTH: 60,
  DESCRIPTION_MIN_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 160,
};
```
