# dongming.me

Personal website and newsletter for Dong Ming. Built with a focus on high performance, minimal "leet coder" aesthetics, and engineering rigor.

## Documentation

- [**User Guide**](docs/USER_GUIDE.md): Learn how to write posts, manage drafts, and configure the site.
- [**SEO Best Practices**](docs/guides/seo-best-practices.md): Technical SEO setup and optimization tips.
- [**SEO Linting**](docs/guides/seo-linting.md): Automated validation of blog post metadata.
- [**Content Migration**](docs/guides/content-migration.md): Moving content from Medium, Substack, and Beehiiv.

## Development

```bash
# Install dependencies
make install

# Start development server
make dev

# Run all quality checks (SEO + Code + Formatting)
make lint
```

## Building for Production

```bash
# Build static site and search index
make build

# Preview the production build locally
make preview
```

## Tech Stack

- **Framework:** [Astro](https://astro.build) (v5)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Search:** [Pagefind](https://pagefind.app)
- **Linting/Formatting:** [Biome](https://biomejs.dev)
- **Content:** MDX with Content Collections

## Project Structure

- `src/content/blog`: Markdown/MDX posts.
- `src/pages`: Route definitions.
- `src/layouts`: Page shells.
- `src/styles`: Global CSS and design tokens.

## References

Inspired by [steipete.me](https://steipete.me).
