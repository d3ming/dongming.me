# Retrospective: The Case of the Broken Embeds & Vanishing MDX

## 1. Summary of Events
On January 12th, 2026, the `dongming.me` project experienced a critical failure where Twitter embeds stopped rendering and appeared as `import { Tweet } ...` text strings on the production site.

While investigating, the codebase inadvertently underwent a mass file rename from `.mdx` to `.md`, stripping the component logic capabilities from all blog posts. This was followed by a series of confused attempts to fix the issue, which initially correctly restored the `.mdx` extensions but incorrectly stripped the necessary import statements, leading to `Tweet is not defined` errors.

## 2. Root Cause Analysis

### What actually broke the embeds initially?
The primary trigger was an automated script hook (`scripts/reorganize-posts.mjs`) attached to the standard `npm run lint` command.
- **The Design Flaw:** The script was hardcoded to rename files to `.md` format: `newName = ... + '.md'`.
- **The Trigger:** When the user or agent ran `make lint` or committed code (triggering pre-commit hooks), this script silently renamed all `.mdx` files to `.md`.
- **The Result:** Astro treats `.md` as plain Markdown. It ignores imports. Thus, the visual "import string" bug appeared.

### Why did the fix fail?
When the agent identified the `.md` issue, it restored the `.mdx` extension. However, it made an incorrect assumption:
- **Assumption:** "If I am using an Astro integration (`astro-embed`), I don't need imports."
- **Reality:** In standard `.mdx` files, explicit imports are still required for components unless a global `components` object is passed during specific rendering setups (which wasn't the case here).
- **Result:** The agent stripped the imports, causing the `Tweet undefined` error.

## 3. Improvements Implemented

### 1. Removing "Side Effects" from Linting
**Action:** Removed `fix:posts` (the reorganization script) from `npm run lint` and `npm run check`.
**Why:** Linting should **never** have destructive side effects like renaming files. It should only check code quality.
**New Workflow:** created `make tidy-content` (calling `npm run organize:posts`) as a strictly manual, opt-in command.

### 2. Safer Scripts with "Dry Run"
**Action:** Updated `reorganize-posts.mjs` and created `convert-md-to-mdx.mjs` to include a safety confirmation step.
**Why:** Scripts that perform bulk file operations must calculate the changes, show them to the user, and ask for `y/N` confirmation before touching the filesystem.

### 3. Cleaning Commit Hooks
**Action:** Audit of `.husky/pre-commit`.
**Why:** To ensure no hidden scripts are running. We simplied it to only run `lint-staged` and `secretlint`, removing the broad `npm run lint` which effectively ran the entire project linting suite (and previously, the destructive script).

## 4. Key Lessons for Developers (The "Do Not Do" List)

1.  **Do NOT** hook file-renaming or file-moving scripts into `lint` or `test` commands. These should be idempotent checks, not active modifiers.
2.  **Do NOT** assume integrations (like `astro-embed`) work "magically" without verifying the specific import requirements for MDX.
3.  **Do NOT** use `npm run lint` in pre-commit hooks if `npm run lint` includes heavy or side-effect-laden tasks. Use `lint-staged` to scope checks only to changed files.
4.  **ALWAYS** implement a "Check / Confirm / Execute" pattern for any script designed to perform bulk operations on the codebase.

## 5. Conclusion
The system is now stable.
- Blog posts are `.mdx` (checked).
- Import statements are present (checked).
- Destructive automation is disabled (checked).
- Safety guards are in place for manual tools (checked).
