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
  - **Git:** DO NOT USE `git` commands unless explicitly asked to do so.
  - **Testing:** Verify builds with `make build` after structural changes.
  - **Commands:** Prefer `make` commands (e.g., `make dev`, `make check`) over raw `npm` scripts.