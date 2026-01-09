# Design Overhaul Plan: "Leet Coder" Aesthetic

**Objective**: Elevate `dongming.me` from a generic Astro starter to a premium, "leet coder" minimalist portfolio, heavily inspired by `steipete.me`.

## Current Analysis
1.  **Visual Hierarchy**: The header cramp ("TBDongPosts") and flat content structure lack the "engineered" feel.
2.  **Architecture**: `src/components` is empty. The site is currently "page-driven" rather than "component-driven", making it hard to maintain consistent styling.
3.  **Styling**: The color palette is generic. The "leet coder" aesthetic requires high-contrast monochrome (dark mode primary) with subtle accents.
4.  **Content Presentation**: The home page fails to establish identity (Avatar, Bio, Socials) immediately.

## Implementation Roadmap

### Phase 1: Component Architecture (The Foundation)
We will move from hardcoded HTML to reusable Astro components.
*   **`components/Header.astro`**: A semantic nav bar with proper spacing and active states.
*   **`components/Footer.astro`**: A minimal footer layout.
*   **`components/Card.astro`**: The core unit for content. Used for blog posts and project highlights.
*   **`components/Socials.astro`**: A reusable icon row (GitHub, X, etc.) for the profile section and footer.
*   **`components/Hr.astro`**: A styled divider to create rhythm between sections.

### Phase 2: Page Layout & Home Redesign
*   **`layouts/Layout.astro`**:
    *   Integrate the new `Header` and `Footer`.
    *   Add `ViewTransitions` for that "app-like" smooth feel.
*   **`pages/index.astro`**:
    *   **Hero**: Implement a Flex/Grid layout featuring an Avatar (left) and Bio (right).
    *   **Social Proof**: Display social icons prominently.
    *   **Content Feed**: Replace the static "No posts" text with a dynamic list of recent posts using the `Card` component.

### Phase 3: Styling & Polish
*   **Typography**: double-down on the Mono aesthetic. Ensure `font-mono` is applied consistently.
*   **Icons**: Add SVG assets for social links and UI elements (RSS, Theme Toggle).
*   **Interactions**: Add subtle hover states (text underline expansion, card lift) to make the site feel "alive".

## UX Improvements targeted
1.  **Navigation**: Clear separation between "Identity" (Site Title) and "Navigation" (Posts, About).
2.  **Readability**: Improved line-height and spacing for mono fonts.
3.  **Scanning**: Users can quickly scan the "Hero" to know *who* you are, then scan the *Cards* to see what you do.
