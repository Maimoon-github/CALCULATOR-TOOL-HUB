# Design Schema: "The Data Specialist"

## Brand Concept
Inspired by polished lapis lazuli spheres with golden flecks, this design system communicates precision, depth, and understated luxury. The deep blues evoke trust and authority, while the warm gold accent adds a touch of refinement and highlights critical data. The typography combines the geometric clarity of Inter for structure with the technical precision of a monospaced font for numbers and code, reinforcing the brand’s focus on data expertise.

---

## Color Palette

| Color Name                     | Hex     | Role                          |
|--------------------------------|---------|-------------------------------|
| Lapis Deep                     | `#0D33A6` | Primary – key actions, logo, dominant accents |
| Lapis Medium                   | `#3258A6` | Secondary – hover states, secondary buttons, supporting elements |
| Midnight Shale                 | `#141A26` | Background – main page background, dark canvases |
| Slate Blue                     | `#3B4859` | Surface – cards, input backgrounds, dividers |
| Gold Fleck                     | `#D9AE89` | Accent – calls‑to‑action, highlighted numbers, icons, decorative details |

### Neutral Extensions (outside the palette, for text and contrast)
- **Primary Text**: `#FFFFFF` (white) on dark backgrounds; on light surfaces, use `#1E1E1E`
- **Secondary Text**: `#B0B0B0` (light gray) for labels, metadata, less prominent information
- **Border/Stroke**: `rgba(255, 255, 255, 0.1)` or `#4A5568` for subtle separation

---

## Color Usage Guidelines

| Element                | Application                                                                                     |
|------------------------|-------------------------------------------------------------------------------------------------|
| Primary actions        | Lapis Deep (`#0D33A6`) for buttons, links, active states.                                      |
| Secondary actions      | Lapis Medium (`#3258A6`) for secondary buttons, hover effects, progress indicators.            |
| Background             | Midnight Shale (`#141A26`) as the default page background.                                     |
| Surface / Containers   | Slate Blue (`#3B4859`) for cards, sidebars, input fields, table headers.                       |
| Accent / Highlight     | Gold Fleck (`#D9AE89`) sparingly – call‑to‑action buttons, key metrics, icons, focus rings.    |
| Text (primary)         | White (`#FFFFFF`) on dark backgrounds.                                                          |
| Text (secondary)       | Light gray (`#B0B0B0`) for hints, footnotes, less important copy.                              |
| Borders                | `rgba(255,255,255,0.1)` for subtle separation; Gold Fleck for decorative accents (e.g., underlines). |

**Maintain balance**: Lapis Deep should dominate, Lapis Medium supports, Gold Fleck is the exclamation point. Never use Gold Fleck for large areas—its power lies in rarity.

---

## Typography

### Primary Font (Headings & UI)
- **Font Family**: Inter (sans‑serif)
- **Weights**:
  - Headings: 600 (Semi‑bold) or 700 (Bold)
  - Body / UI text: 400 (Regular) or 500 (Medium) for emphasis
- **Sizes** (examples):
  - H1: 3.5rem / line‑height 1.2
  - H2: 2.5rem / 1.3
  - Body: 1rem / 1.6
  - Small / captions: 0.875rem / 1.5

### Secondary Font (Numbers & Code)
- **Font Family**: JetBrains Mono (or Roboto Mono as fallback)
- **Weights**: 400 (Regular) for most numbers; 500 (Medium) for totals or emphasized data
- **Sizes**: Match the surrounding text size for inline numbers; slightly larger (1.1×) for large figures in dashboards.
- **Usage**: All numerical data in tables, calculator inputs/outputs, statistics, and any code‑like content. The monospaced alignment reinforces precision and “math authority.”

---

## Component Style Guidelines

### Buttons
- **Primary Button**: Background `#0D33A6`, white text, bold weight, rounded corners (4px). Hover: `#3258A6`.
- **Secondary Button**: Outline with `#3258A6` border, white text, transparent background. Hover: `rgba(50,88,166,0.1)` background.
- **Accent Button (CTA)**: Gold Fleck (`#D9AE89`) background, dark text (`#141A26`) for contrast. Use sparingly for the most important action.

### Cards & Containers
- Background: `#3B4859` with a subtle inner shadow or border in `rgba(255,255,255,0.05)`.
- Padding: 24px (base unit 8px).
- Optional: a thin top accent line in Gold Fleck for featured cards.

### Form Inputs
- Background: `#1E2633` (slightly lighter than Midnight Shale) or `#3B4859` with lowered opacity.
- Border: `#4A5568`, focus state: Gold Fleck outline.
- Text: white, placeholder: `#B0B0B0`.
- For numeric inputs, use JetBrains Mono.

### Data Tables
- Header: `#0D33A6` background with white text (bold).
- Row background: alternating `#141A26` and `#1E2633` (subtle difference).
- Hover row: `#3258A6` with 20% opacity.
- Numbers: JetBrains Mono, Gold Fleck for totals or highlighted cells.

### Navigation
- Background: Midnight Shale (`#141A26`) with a faint bottom border in Lapis Deep.
- Links: white, hover: Gold Fleck underline.
- Active page: Lapis Deep text or bottom border.

---

## Layout & Spacing
- **Base unit**: 8px. All margins, paddings, and gaps are multiples of 8px.
- **Grid**: 12‑column flexible grid with 24px gutters.
- **Max width**: 1280px for content, centered.
- **Negative space**: Embrace generous spacing to let the deep blue breathe; asymmetry can be used in hero sections to break the grid and draw attention to key data.

---

## Motion & Interaction
- Use subtle, purposeful motion: fade‑ins for cards (0.3s ease), hover lifts (translateY -2px) on interactive elements.
- Data updates: smooth transitions (0.2s) for changing numbers.
- Avoid excessive animation; let the gold accents draw the eye.

---

## Differentiation & Unforgettable Detail
The one thing users will remember: **the interplay of deep lapis blue and warm gold in a data‑dense environment**. Every table, every number field carries the promise of precision—like examining a precious stone under light. The monospaced numbers, set against the dark, rich background, become objects of clarity. This is not just a tool; it’s an instrument for specialists.

---

This schema provides a cohesive, intentional foundation for any website built for “The Data Specialist.” Apply these tokens consistently across all pages to maintain a distinctive, production‑grade identity.