# Content Migration Guide

Moving your writing from Medium, Substack, and Beehiiv to your own domain (`dongming.me`) requires a careful strategy to avoid "Duplicate Content" penalties and preserve your SEO rankings.

## 1. The Strategy: Canonical Tags First
Search engines penalize sites that have identical content. To fix this, you must tell Google that `dongming.me` is the **original** source.

1.  **Publish on Astro first**: Get the post live on your own site.
2.  **Use Canonical Tags**: In the post on Medium/Substack, set the "Canonical URL" to pointing to the post's new URL on `dongming.me`.

---

## 2. Platform Specific Instructions

### 📝 Medium.com
1.  **Export**: Go to Settings -> Account -> Export content. Download the `.zip`.
2.  **Convert**: Use a tool like [medium-2-md](https://www.npmjs.com/package/medium-2-md) to convert the HTML/JSON export into clean Markdown.
3.  **SEO Fix**:
    - After publishing on your site, go to the Medium post settings.
    - Click **Advanced Settings**.
    - Under **This story was published elsewhere**, paste the URL of your post on `dongming.me`.
4.  **Optional**: Delete the Medium story or replace it with a "teaser" and a link to your site.

### 📧 Substack
1.  **Export**: Go to Dashboard -> Settings -> Export Data. You'll get a zip of your posts.
2.  **Conversion**: You may need to clean up the HTML to Markdown conversion (some tools handles Substack's formatted links better than others).
3.  **The "Redirect"**: Substack doesn't natively allow 301 redirects to external domains unless you are moving your *entire* Substack to a custom domain.
4.  **SEO Fix**: Go to the Substack post -> Settings -> **Advanced Settings** -> **Canonical URL**. Point it to your site.

### 🐝 Beehiiv
1.  **Export**: Go to Workspace Settings -> Data Export.
2.  **SEO Fix**: Similar to Substack, locate the **Canonical URL** field in the post settings for each migrated article and point it to your personal site.

---

## 3. Post-Migration Checklist

- [ ] **Image Migration**: Download images from the previous platforms and store them in `public/assets/` or use an external CDN. Don't "hotlink" (reference the Medium/Substack URL directly) as they may break if you delete the posts.
- [ ] **Broken Links**: Run a link checker to ensure internal links from your old posts are updated to point to your new site structure.
- [ ] **URL Structure**: Try to keep slugs consistent (e.g., `medium.com/@user/my-post` -> `dongming.me/posts/my-post`) to make redirect mapping easier.
- [ ] **Redirects**: If you were using a custom domain on Medium/Substack, set up **301 redirects** at the DNS level or via Vercel for every individual path.
