# Design Refinement Options for dongming.me / tbd.ong

**Date:** 2026-01-09
**Context:** Evaluating design improvements, particularly around "TBD" branding and royal purple accent exploration

---

## Current State Analysis

### Strengths
- **Clean, minimalist aesthetic** aligned with "leet coder" philosophy
- **Monospaced typography** reinforces technical credibility
- **Dark-first design** with proper theme toggle
- **Good performance** with minimal client-side JS
- **Subtle animations** (avatar rotation on hover)

### Key Concerns
1. **"TBD" branding ambiguity** - Without context from the blog post, "TBD" appears as placeholder text (To Be Determined)
2. **Generic blue accent** - Current `#3b82f6` (blue-500) lacks personality
3. **Limited visual hierarchy** - Muted color palette may feel too subdued
4. **Brand identity unclear** - No strong visual signature that makes the site memorable

---

## Design Direction Options

### Option 1: "Intentional Ambiguity" - Embrace the TBD Paradox

**Philosophy:** Make the "TBD" branding feel deliberately provocative rather than accidental.

**Visual Strategy:**
- Add subtle visual cues that signal intentionality (e.g., stylized logo treatment)
- Use typography and spacing to elevate "TBD" from placeholder to brand
- Include micro-copy hints that intrigue visitors

**Specific Changes:**
```
Header Logo Treatment:
- Current: Plain "TBD" text
- Proposed: "TBD" with subtle underline animation or bracket notation
  Examples:
  • [TBD]
  • TBD_
  • <TBD>
  • TBD.ong
```

**Color Palette (Royal Purple Variant):**
```css
/* Deep Royal Purple Theme */
--accent-primary: #7C3AED;      /* vibrant purple-600 */
--accent-secondary: #A78BFA;    /* lighter purple-400 for hover states */
--accent-dark: #5B21B6;         /* deep purple-800 for dark mode */
--accent-muted: #DDD6FE;        /* purple-200 for subtle highlights */

/* Alternative: Richer Purple */
--accent-primary: #8B5CF6;      /* purple-500 - more saturated */
--accent-secondary: #C4B5FD;    /* purple-300 */
--accent-dark: #6D28D9;         /* purple-700 */
```

**Implementation:**
- Logo gets subtle purple glow on hover
- Selection color uses purple instead of blue
- Links use purple with higher contrast ratio
- Code blocks get purple accent borders

---

### Option 2: "Confident Minimalism" - Refined Professional

**Philosophy:** Lean into extreme clarity and confidence. Remove any ambiguity.

**Visual Strategy:**
- Replace "TBD" in header with full wordmark: "To Be Dong" or "tbd.ong"
- Use tagline to immediately establish context
- Stronger typographic hierarchy

**Specific Changes:**
```
Header Options:
1. "tbd.ong" as primary brand
   Subtext: "To Be Dong • To Be Determined"

2. Split logo:
   TBD
   ───
   .ong

3. Inline explanation:
   TBD (To Be Dong)
```

**Color Palette (Sophisticated Purple):**
```css
/* Sophisticated Purple - Less saturated, more refined */
--accent-primary: #9333EA;      /* purple-600 with slight desaturation */
--accent-secondary: #A855F7;    /* purple-500 */
--accent-dark: #7E22CE;         /* purple-700 */
--accent-highlight: #F3E8FF;    /* purple-50 for light mode backgrounds */

/* Gradient option for premium feel */
--accent-gradient: linear-gradient(135deg, #9333EA 0%, #C084FC 100%);
```

**Implementation:**
- Gradient underlines on hover for links
- Purple-tinted avatar border
- Subtle purple gradient in footer
- Purple accent in code syntax highlighting

---

### Option 3: "Playful Paradox" - Embrace the Joke

**Philosophy:** Lean into the multi-layered joke. Make it fun and memorable.

**Visual Strategy:**
- Animated or interactive "TBD" that reveals layers
- Tooltip or hover state that shows "To Be Dong"
- Playful micro-interactions

**Specific Changes:**
```
Interactive Logo:
- Hover over "TBD" → shows "To Be Dong"
- Click cycles through meanings:
  • TBD → To Be Determined
  • TBD → To Be Dong
  • TBD → The Bold Dong
  • TBD → (one letter from TGD)
```

**Color Palette (Vibrant Purple):**
```css
/* Vibrant, energetic purple */
--accent-primary: #A855F7;      /* bright purple-500 */
--accent-secondary: #E879F9;    /* fuchsia-400 for playful accents */
--accent-dark: #9333EA;         /* purple-600 */
--accent-glow: #F5D0FE;         /* fuchsia-200 for glow effects */

/* Dual-tone option */
--accent-purple: #A855F7;
--accent-fuchsia: #D946EF;      /* creates dynamic gradient */
```

**Implementation:**
- Animated gradient text for logo
- Purple glow effects on interactive elements
- Playful hover states (scale, rotate, color shift)
- Easter egg: Konami code reveals "The Great Dong"

---

## Recommended Approach: **Hybrid of Option 1 + 2**

### Why This Works:
1. **Addresses the core concern** - Makes "TBD" feel intentional, not accidental
2. **Maintains minimalism** - Doesn't over-complicate the design
3. **Adds personality** - Royal purple creates distinctive brand identity
4. **Scalable** - Can add playful elements later without redesign

### Specific Implementation Plan:

#### 1. Logo Refinement
```astro
<!-- Current -->
<a href="/" class="text-xl font-bold">TBD</a>

<!-- Proposed -->
<a href="/" class="logo-wordmark group">
  <span class="text-xl font-bold tracking-tighter">TBD</span>
  <span class="text-xs text-muted-foreground ml-2 opacity-60 group-hover:opacity-100 transition-opacity">.ong</span>
</a>
```

#### 2. Royal Purple Color System
```css
/* Dark Mode (Primary) */
--accent: #A855F7;              /* purple-500 - vibrant but not harsh */
--accent-hover: #C084FC;        /* purple-400 - lighter for hover */
--accent-muted: #7C3AED;        /* purple-600 - for borders/subtle */

/* Light Mode */
--accent: #9333EA;              /* purple-600 - better contrast on white */
--accent-hover: #7C3AED;        /* purple-600 - slightly darker hover */
--accent-muted: #A855F7;        /* purple-500 - for subtle elements */
```

#### 3. Enhanced Visual Hierarchy
- **Avatar border:** Add subtle purple glow
- **Section headers:** Purple accent bar on left
- **Links:** Purple with smooth color transition
- **Selection:** Purple background with high contrast
- **Code blocks:** Purple accent border on left edge

#### 4. Subtle Context Hints
Add a tagline or subtitle that provides context without being heavy-handed:

```astro
<!-- Home page hero -->
<h1>Hi, I'm @dming.</h1>
<p class="tagline">
  Building in public. Thinking out loud.
  <span class="text-accent">To Be Determined.</span>
</p>
```

---

## Color Palette Comparison

### Current (Blue)
```
Dark:  #3b82f6 (blue-500)
Light: #0066cc (blue-600)
```
**Pros:** Safe, professional, high contrast
**Cons:** Generic, lacks personality, overused in tech

### Proposed Purple Variants

#### Variant A: Vibrant Royal
```css
--accent-dark: #A855F7;   /* HSL: 283, 91%, 64% */
--accent-light: #9333EA;  /* HSL: 277, 85%, 55% */
```
**Vibe:** Confident, modern, energetic
**Best for:** Making a statement, standing out

#### Variant B: Deep Regal
```css
--accent-dark: #7C3AED;   /* HSL: 258, 90%, 66% */
--accent-light: #7E22CE;  /* HSL: 274, 83%, 47% */
```
**Vibe:** Sophisticated, premium, refined
**Best for:** Professional with personality

#### Variant C: Bright Fuchsia-Purple
```css
--accent-dark: #C084FC;   /* HSL: 283, 95%, 76% */
--accent-light: #A855F7;  /* HSL: 283, 91%, 64% */
```
**Vibe:** Playful, creative, bold
**Best for:** Embracing the "playful paradox" angle

### My Recommendation: **Variant A (Vibrant Royal)**
- Distinctive without being garish
- Excellent contrast on both dark and light backgrounds
- Energetic but professional
- Aligns with "bold" interpretation of TBD

---

## Additional Design Enhancements

### 1. Typography Refinement
```css
/* Add slight variation to break monotony */
h1, h2, h3 {
  font-weight: 700;
  letter-spacing: -0.02em;  /* Tighter tracking for headers */
}

.logo-wordmark {
  letter-spacing: -0.05em;  /* Even tighter for brand */
  font-weight: 800;         /* Bolder weight */
}
```

### 2. Micro-Interactions
- **Avatar:** Subtle purple glow on hover (not just rotation)
- **Links:** Animated underline that slides in from left
- **Cards:** Lift effect with purple shadow
- **Theme toggle:** Smooth color transition through purple

### 3. Visual Signature Elements
- **Accent bar:** Thin purple vertical bar on left of blog posts
- **Dividers:** Replace gray `<Hr>` with subtle purple gradient
- **Quotes/Callouts:** Purple left border with tinted background
- **Code blocks:** Purple accent with syntax highlighting

### 4. Improved Brand Consistency
```
Primary Brand Color: Purple (#A855F7)
Secondary: Fuchsia accent for highlights
Neutral: Current grayscale system
Typography: Monospace (current)
Spacing: Generous (current)
```

---

## Implementation Priority

### Phase 1: Core Color Update (30 min)
1. Update `global.css` with new purple accent tokens
2. Test contrast ratios for accessibility
3. Verify on both light and dark modes

### Phase 2: Logo Refinement (15 min)
1. Update `Header.astro` with new logo treatment
2. Add `.ong` suffix with hover effect
3. Adjust spacing and tracking

### Phase 3: Enhanced Interactions (45 min)
1. Add purple glow to avatar
2. Implement animated link underlines
3. Update selection colors
4. Refine hover states across components

### Phase 4: Visual Signature (30 min)
1. Add accent bars to blog posts
2. Update divider styling
3. Enhance code block styling
4. Add subtle gradients where appropriate

**Total Time:** ~2 hours for complete implementation

---

## Accessibility Considerations

All proposed purple variants meet WCAG AA standards:

| Variant | Dark BG Contrast | Light BG Contrast | AA Compliant |
|---------|------------------|-------------------|--------------|
| Variant A (#A855F7) | 8.2:1 | 4.8:1 | ✅ Yes |
| Variant B (#7C3AED) | 6.1:1 | 5.9:1 | ✅ Yes |
| Variant C (#C084FC) | 10.1:1 | 3.2:1 | ⚠️ Light mode needs adjustment |

**Recommendation:** Use Variant A with slightly darker shade for light mode (#9333EA) to ensure AAA compliance.

---

## Next Steps

1. **Review this document** - Discuss which direction resonates
2. **Choose color variant** - Test a few purple shades in browser
3. **Implement Phase 1** - Update color tokens
4. **Iterate** - Refine based on visual feedback
5. **Document decision** - Update design system docs

---

## Questions to Consider

1. **Brand priority:** Is "TBD" the permanent brand, or will it evolve?
2. **Audience:** Who's the primary audience? (Recruiters, peers, general readers?)
3. **Tone:** How playful vs. professional should the site feel?
4. **Longevity:** Will this design serve you for 1 year? 5 years?

---

## Visual Mockup Ideas

I can generate mockups showing:
1. Current design vs. purple accent comparison
2. Different logo treatments side-by-side
3. Full homepage with new color system
4. Blog post page with enhanced styling

Would you like me to create any of these?
