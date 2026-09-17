# Accessibility Skill

## Purpose
Implement and verify WCAG 2.1 AA accessibility standards in StayGallery.

## Quick Audit Commands
```bash
# Lighthouse CLI
npx lighthouse http://localhost:5173 \
  --only-categories=accessibility \
  --output=json \
  --output-path=./a11y-report.json

# Parse score
node -e "const r=require('./a11y-report.json');console.log('Score:', r.categories.accessibility.score*100)"
```

## Browser Console Checks
```javascript
// Run axe-core audit
const script = document.createElement('script')
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
document.head.appendChild(script)
script.onload = () => axe.run().then(r => {
  console.log('Violations:', r.violations.length)
  r.violations.forEach(v => console.log(v.id, v.description, v.nodes.length, 'elements'))
})
```

## Keyboard Testing Protocol
1. Load page in fresh browser tab (no mouse)
2. Press Tab to begin navigation
3. Verify:
   - First Tab goes to "Skip to content" link (if present)
   - Next: Header logo
   - Next: Search bar buttons
   - Next: "Airbnb your home" link
   - Next: Globe button, User menu button
   - Next: Share, Save buttons
   - Next: Gallery images (Tab through each)
   - Next: "Show all photos" button (Enter to open)
   - In photo tour: Tab to Close, then section nav, then images
   - Esc closes photo tour
   - In lightbox: Tab to Prev/Next/Close buttons
   - Esc closes lightbox

## ARIA Patterns Used

### Modal (Photo Tour, Lightbox)
```html
<div role="dialog" aria-modal="true" aria-label="[Description]">
  <button>Close</button>
  ...content...
</div>
```

### Live Counter
```html
<div aria-live="polite" aria-atomic="true">
  1 / 19
</div>
```

### Disabled Navigation
```html
<button aria-disabled="true" disabled>Previous</button>
```

### Progress Bar (Review Score)
```html
<div role="progressbar" aria-valuenow="4.9" aria-valuemin="0" aria-valuemax="5">
  <div style="width: 98%"></div>
</div>
```

## Color Contrast Checker
```javascript
// Paste in console to check contrast
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255
    return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
  })
  return 0.2126*rs + 0.7152*gs + 0.0722*bs
}
function contrast(l1, l2) {
  return (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05)
}
// #222222 vs white
const textLum = getLuminance(34,34,34)
const bgLum = getLuminance(255,255,255)
console.log('Contrast:', contrast(textLum, bgLum).toFixed(2), ':1') // Should be ≥4.5
```

## Common Fixes
- Missing alt text: Add `alt="descriptive text"` to all `<img>`
- Clickable div: Replace with `<button>` element
- Missing label: Add `<label htmlFor="input-id">`
- No focus indicator: Add CSS `button:focus-visible { outline: 2px solid ... }`
- Modal focus: Call `closeRef.current?.focus()` when opening
