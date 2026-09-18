# AI Agent Rules

- **Context & Inspiration:**
  - `.refs` folder is your friend. Useful docs in there for reference.
  - `.refs/plans` is for writing and tracking plans.
  - `.refs/steipete.me` is a clone of https://github.com/steipete/steipete.me, to be used for inspiration regarding architecture and patterns, but NOT for content copy.

- **Tech Stack Guidelines:**
  - **Framework:** Astro v5. Prefer strict TypeScript.
  - **Styling:** Tailwind CSS v4. Use `src/styles/global.css` for tokens/theme.
  - **Code Quality:** Use `Biome` for linting and formatting.
  - **Content:** MDX with Astro Content Collections.

- **Design Philosophy:**
  - **Aesthetic:** "Leet coder" — minimal, monospaced, high-signal, low-noise.
  - **Performance:** Fast by default. Minimal client-side JS.

- **Workflow:**
  - **Git:** AI agents may use `git` to create branches and commit work. Open PRs
  with `gh` for human review; never push to or commit directly on `main`.
  - **Testing:** Verify builds with `make build` after structural changes.
  - **SEO:** Ensure blog post frontmatter follows `docs/guides/seo-best-practices.md`.
  - **Commands:** Prefer `make` commands (e.g., `make dev`, `make lint`) over raw `npm` scripts.
