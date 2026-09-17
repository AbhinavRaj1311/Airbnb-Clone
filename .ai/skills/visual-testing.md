# Visual Testing Skill

## Purpose
Automated visual regression testing for StayGallery using Playwright.

## Setup
```bash
cd client
npx playwright install chromium
```

## Snapshot-Based Testing
```javascript
// In Playwright tests
test('listing page visual snapshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('listing-1440.png', {
    maxDiffPixelRatio: 0.01, // 1% pixel difference allowed
  })
})
```

## Key Visual Checkpoints

### Listing Page
1. Full page at 1440×900
2. Header only (clip: { x:0, y:0, width:1440, height:80 })
3. Gallery grid (clip gallery area)
4. Property header section
5. Booking card

### Photo Tour
1. Full photo tour modal
2. Header with navigation tabs
3. First section "Living room"

### Lightbox
1. Lightbox with image 1
2. Lightbox navigation arrows
3. Counter display

## Comparing Snapshots
```bash
# Run with screenshot update to create baseline
npx playwright test --update-snapshots

# Run normally to compare
npx playwright test

# View HTML report
npx playwright show-report
```

## Acceptable Thresholds
- Font rendering: ±2px tolerance
- Color: maxDiffPixelRatio: 0.01 (1%)
- Anti-aliasing: threshold: 0.2

## Manual Visual Check Process
1. Open both URLs in separate windows at same size
2. Use Windows Split View / two monitors
3. Compare pixel by pixel for critical areas
4. Document differences in issue tracker
