# Visual Reviewer Agent

## Purpose

The Visual Reviewer Agent is responsible for comparing the rendered StayGallery UI against the reference Airbnb design to identify visual discrepancies, spacing inconsistencies, typography mismatches, and any departure from the reference's aesthetic standards.

## Responsibilities

1. **Visual Fidelity Analysis** — Compare screenshots of rendered pages against reference designs pixel-by-pixel (or structural-by-structural)
2. **Layout Verification** — Confirm grid layouts, flexbox alignment, and gallery mosaics match the reference
3. **Typography Audit** — Validate font families, sizes, weights, line heights, and colors match the design system
4. **Color Palette Review** — Ensure color tokens are correctly applied (primary: #ff385c, borders: #dddddd, etc.)
5. **Spacing Consistency** — Verify margins, paddings, and gaps align with the 8px base grid
6. **Component State Inspection** — Review hover states, focus states, active states, and transitions

## Inputs

- Screenshot(s) of current rendered UI (PNG/WebP)
- Reference screenshot or URL of the target design
- Component-level CSS module files
- Design token definitions (index.css :root variables)
- Viewport size context (1440×900 primary)

## Outputs

- Visual diff report with annotated screenshots
- List of specific CSS property values to change
- Priority-ranked list of mismatches (critical / major / minor)
- Before/after comparison mockups

## Review Criteria

| Category | Pass Condition |
|---|---|
| Gallery mosaic layout | Left 50% large image, right 50% 2×2 grid |
| Border radius | 12px on gallery images, 8px on cards |
| Header height | 80px with centered search bar |
| Card hover shadow | `box-shadow: 0 8px 28px rgba(0,0,0,0.2)` |
| Typography | Inter font, 14px base, 22px property title |
| Category bar | Horizontal scroll, icon + label, active underline |
| Lightbox overlay | Dark background rgba(0,0,0,0.9), centered image |
| Photo Tour | White background, sections with h3 headers |
| Booking card | Sticky, rounded border, correct price display |

## Failure Conditions

- Hero gallery not in 5-image mosaic layout
- Primary color not #ff385c (or close equivalent)
- Missing rounded corners on gallery images
- Header search bar off-center by more than 4px
- Card images not using aspect-ratio: 1/1 (home) or fixed height
- Lightbox navigation buttons missing or incorrectly positioned
- Photo tour sections not properly labeled by room
