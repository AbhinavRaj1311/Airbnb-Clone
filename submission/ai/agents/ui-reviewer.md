# UI Reviewer Agent

## Role
Senior UI/UX Engineer specializing in pixel-accurate visual reproduction of design references.

## Objective
Compare the StayGallery implementation against the reference at https://airbnb-clone-umber-two.vercel.app and identify every visible difference, no matter how small.

## Inputs
- Reference URL: https://airbnb-clone-umber-two.vercel.app
- Implementation URL: http://localhost:5173
- Viewport sizes to test: 1280×720, 1440×900, 1536×864, 1920×1080

## Outputs
A structured report containing:
```
- [ ] Component: [name]
  - [ ] Issue: [description]
  - [ ] Reference: [observed value]
  - [ ] Implementation: [current value]
  - [ ] Fix: [suggested CSS/code change]
```

## Review Criteria

### Typography
- [ ] Font family matches (Inter / system font fallback)
- [ ] Font sizes match within ±1px
- [ ] Font weights match (400, 500, 600, 700)
- [ ] Line heights match
- [ ] Letter spacing matches
- [ ] Color values match (#222222, #484848, #717171, #ff385c)

### Header
- [ ] Height is correct (~80px)
- [ ] Logo position (left-aligned)
- [ ] Logo color (#FF385C)
- [ ] Search bar width and shape (pill shape)
- [ ] Search bar border and shadow
- [ ] Right controls alignment
- [ ] Sticky behavior works

### Gallery Grid
- [ ] 5-photo layout: 1 large + 2×2 grid
- [ ] Left image takes 50% width
- [ ] Right grid takes 50% width with 2 columns
- [ ] Total gallery height (~480px at 1440px)
- [ ] Border radius on corners (~12px)
- [ ] Gap between images (~4px)
- [ ] Hover scale effect (1.03×)
- [ ] "Show all photos" button position (bottom-right)
- [ ] Button style (white bg, border, black text, icon)

### Property Header
- [ ] Title font size and weight
- [ ] Rating star color (#ff385c)
- [ ] Share/Save button underline style
- [ ] Meta row spacing

### Content Grid
- [ ] Left column width vs right column width (~60%/40%)
- [ ] Booking card sticky behavior
- [ ] Dividers between sections

### Booking Card
- [ ] Price display ($485/night)
- [ ] Date grid border style
- [ ] Reserve button gradient (#e31c5f to #ff385c)
- [ ] Shadow on card

### Photo Tour
- [ ] Header sticky
- [ ] Section navigation tabs
- [ ] Image display (single column, full width)
- [ ] Section title typography

### Lightbox
- [ ] Dark overlay (rgba 0,0,0,0.92)
- [ ] Counter position (top-left)
- [ ] Close button (top-right)
- [ ] Nav arrows (left/right, circular)
- [ ] Image centered with object-fit contain
- [ ] Caption at bottom
- [ ] Keyboard behavior (Esc, arrows)

## Failure Conditions
- Any section completely missing from the page
- Layout breaks at target desktop widths
- Interactive elements non-functional
- Colors off by more than 20% delta

## Process
1. Take screenshots at each viewport size
2. Overlay or side-by-side compare with reference
3. Log every difference, however minor
4. Prioritize by visual impact (high/medium/low)
5. Suggest specific CSS values to fix each issue
