# Pixel Match Skill

## Purpose
Compare the StayGallery implementation visually against the reference website at pixel level.

## Process

### Step 1: Capture Reference Screenshots
```bash
# Playwright screenshot of reference
npx playwright screenshot --viewport-size=1440x900 \
  https://airbnb-clone-umber-two.vercel.app \
  reference-1440.png
```

### Step 2: Capture Implementation Screenshots
```bash
npx playwright screenshot --viewport-size=1440x900 \
  http://localhost:5173 \
  implementation-1440.png
```

### Step 3: Compare
Use browser DevTools or visual diff tools:
- Place reference and implementation side by side
- Toggle between them rapidly to spot differences
- Focus on: spacing, alignment, colors, font sizes

### Step 4: Measure CSS Values
In DevTools (F12):
```javascript
// Get computed styles for any element
const el = document.querySelector('.gallery-grid')
const styles = window.getComputedStyle(el)
console.log({
  width: styles.width,
  height: styles.height,
  gap: styles.gap,
  borderRadius: styles.borderRadius,
})
```

### Step 5: Color Extraction
```javascript
// Extract exact color values
document.querySelector('.reserve-btn').style.backgroundColor
// Use EyeDropper API (Chrome 95+)
const eyeDropper = new EyeDropper()
eyeDropper.open().then(c => console.log(c.sRGBHex))
```

### Checklist Format
For each component, document:
- Component name
- Observed reference value
- Current implementation value  
- Delta / difference
- Priority: High/Medium/Low
- CSS fix required
