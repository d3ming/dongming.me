# dongming.me

Personal website and newsletter for Dong Ming. Built with a focus on high performance, minimal "leet coder" aesthetics, and engineering rigor.

## Documentation

- [**User Guide**](docs/USER_GUIDE.md): Learn how to write posts, manage drafts, and configure the site.

## Development

```bash
# Install dependencies
make install

# Start development server
make dev

# Lint and check code quality
make check
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
