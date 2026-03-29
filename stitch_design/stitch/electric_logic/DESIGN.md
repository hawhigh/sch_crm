```markdown
# Design System Specification: High-End Editorial CRM

## 1. Overview & Creative North Star: "The Kinetic Curator"
This design system rejects the clinical, "boxed-in" aesthetic of traditional CRM platforms. Our Creative North Star is **The Kinetic Curator**—a visual language that treats data not as static entries, but as a fluid, editorial experience. 

We break the "SaaS Template" look by utilizing intentional asymmetry, high-contrast color pairings (Electric Cobalt and Neon Lime), and a sophisticated layering system. The goal is to make the management of complex relationships feel as premium as browsing a high-end fashion editorial. We trade rigid grid lines for tonal depth and "breathing room," ensuring the interface feels expensive, intentional, and authoritative.

---

## 2. Colors & Atmospheric Depth
The palette is anchored by a deep, intelligent Blue (`primary`) and a high-energy Lime (`secondary`), set against a warm, paper-like neutral (`surface`).

### Core Palette
- **Primary (Electric Cobalt):** `#0300a9` — Used for high-level brand moments and primary actions.
- **Secondary (Neon Lime):** `#5a6400` / `#d8ef00` — Used sparingly for highlights, status indicators, and "active" focal points.
- **Surface (Parchment):** `#fbf9f5` — The foundation. A warm neutral that prevents the "eye fatigue" of pure white.
- **Tertiary (Carbon):** `#303030` — Used for high-contrast typography and sophisticated UI grounding.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts. 
*   *Example:* A `surface-container-low` (`#f5f3ef`) sidebar sitting against a `surface` (`#fbf9f5`) main stage. 
*   *Why:* Borders create visual "noise" that traps data. Tonal shifts allow the eye to glide across the CRM effortlessly.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. Use the following tokens to create depth:
1.  **Base:** `surface` (`#fbf9f5`)
2.  **Low Depth:** `surface-container-low` (`#f5f3ef`)
3.  **High Depth:** `surface-container-high` (`#eae8e4`)
Always nest a "High" container inside a "Low" section to draw the user’s eye to actionable data modules.

### The "Glass & Gradient" Rule
To elevate the CRM above a flat dashboard, use **Glassmorphism** for floating elements (e.g., Command Palettes, Popovers). Apply a semi-transparent `surface` color with a `backdrop-blur` of 20px. 
*   **Signature Textures:** Use subtle linear gradients transitioning from `primary` (`#0300a9`) to `primary-container` (`#0a05e9`) for Hero CTAs to provide a "lit-from-within" professional polish.

---

## 3. Typography: Editorial Authority
We use **Lexend Deca** as our primary typographic voice. Its geometric clarity provides a modern, mathematical precision essential for a CRM, while its wide apertures maintain an editorial feel.

*   **Display (Large Scale):** `display-lg` (3.5rem) / `display-md` (2.75rem). Use these for high-level data summaries (e.g., Total Revenue) to treat numbers as hero visuals.
*   **Headlines:** `headline-lg` (2rem). Bold, decisive, and grounded. 
*   **Body:** `body-lg` (1rem) / `body-md` (0.875rem). Set with generous line-height (1.6) to ensure long-form notes and CRM logs remain readable.
*   **Labels:** `label-md` (0.75rem). Used for metadata and table headers, always in All Caps with +5% letter spacing for a "curated" look.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely replaced by **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#f5f3ef) background creates a soft, natural lift.
*   **Ambient Shadows:** For floating Modals, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(27, 28, 26, 0.06);`. The shadow color is a tint of our `on-surface` color, never pure black.
*   **The "Ghost Border":** If a border is required for accessibility in input fields, use `outline-variant` (`#c6c4da`) at **20% opacity**. 100% opaque borders are forbidden.

---

## 5. Components
### Buttons
*   **Primary:** Solid `primary` (`#0300a9`) with `on-primary` (`#ffffff`) text. Roundedness: `md` (0.375rem).
*   **Secondary:** Solid `secondary-container` (`#d5ec00`) for high-attention "Success" actions.
*   **Tertiary:** Ghost style. No background, `primary` text, shifts to `surface-container-high` on hover.

### Input Fields
*   **Styling:** No bottom line. Use a `surface-container-highest` background. 
*   **Focus State:** A 2px "Ghost Border" of `primary` at 40% opacity. 
*   **Error:** Use `error` (`#ba1a1a`) text only; do not turn the entire box red—keep the editorial elegance.

### Cards & Lists
*   **Rule:** Forbid divider lines between list items. 
*   **Separation:** Use the Spacing Scale (e.g., `spacing-4` / 1rem) or a subtle hover state shift to `surface-container-low`.
*   **CRM Specific - Relationship Nodes:** Use "Glass" containers for contact cards to signify they are "live" and interactive.

### Chips (Badges)
*   **Execution:** Small, uppercase `label-sm` text. Use `secondary-fixed` for active statuses and `tertiary-fixed` for archived states.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme white space. If you think there is enough padding, add 25% more.
*   **Do** use asymmetrical layouts for dashboards (e.g., a 60/40 split rather than 50/50) to create visual interest.
*   **Do** treat data points as "Art." Use the `display-lg` font for key metrics.

### Don't
*   **Don't** use 1px solid borders to separate sections. Use background color shifts.
*   **Don't** use standard "Success Green" or "Warning Orange" unless they are tuned to the system's tonal values.
*   **Don't** use default Material or Bootstrap shadows. They are too heavy and "cheapen" the brand.
*   **Don't** crowd the interface. If the data is dense, use "nested containers" to organize, not lines.

---

**Director's Final Note:**
A CRM doesn't have to be a spreadsheet. Use this design system to create a workspace that feels like a luxury studio—where the user isn't just "inputting data," but "orchestrating growth." Keep it light, keep it layered, and never use a border when a color shift will do.```