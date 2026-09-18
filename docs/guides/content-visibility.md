# Content Visibility & Preview Guide

Posts use one explicit `status` field in their frontmatter:

```yaml
status: draft # draft, published, or unlisted
```

The build and every discovery surface use the same status rules:

| Status | Local development | Production page | Lists, search, RSS, sitemap |
| :--- | :--- | :--- | :--- |
| `published` | Visible | Generated | Included |
| `draft` | Visible | Not generated | Excluded |
| `unlisted` | Visible | Generated at its direct URL | Excluded |

`unlisted` is useful when a finished post should be shareable by URL without
appearing in the site's navigation, search index, RSS feed, or sitemap. It is
not access control: anyone who has the URL can read it, and the source is in
the public repository. Unlisted pages send `noindex,nofollow` to crawlers.

Unlisted posts live under `src/content/blog/unlisted/`, which gives them a
clear route such as `/posts/unlisted/2021-02-14-cryto-thoughts`. This directory
also lets the sitemap configuration exclude the whole class of pages safely.

During `make dev`, the Posts page includes all three statuses. Type `draft` or
`unlisted` into its search field to inspect those subsets. During `make build`,
only published posts appear in the public list and search JSON. The build also
verifies that draft pages are absent, unlisted pages are direct-link only, and
unlisted pages are not indexed by Pagefind or the sitemap.

To publish a post, change its frontmatter to `status: published`, then run
`make build` before committing and pushing.
