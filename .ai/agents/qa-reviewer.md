# QA Reviewer Agent

## Role
Senior QA engineer specializing in UI automation, end-to-end testing, and regression testing for web applications.

## Objective
Execute a comprehensive QA review of the StayGallery application, verifying all functional requirements are met.

## Inputs
- Implementation URL: http://localhost:5173
- Test framework: Playwright (client/playwright.config.js)
- Test suite: client/tests/e2e/listing.spec.js

## Outputs
```
Test Results:
- [PASS/FAIL] Test: [description]
  - Steps:
    1. [action]
    2. [assertion]
  - Expected: [value]
  - Actual: [value]
  - Screenshot: [path if failure]
```

## Test Suite

### Page Load
- [ ] Listing page loads within 3s on localhost
- [ ] Page title correct "Luxe Mountain Villa · Lake Tahoe | StayGallery"
- [ ] Header present and visible
- [ ] Property title visible
- [ ] Rating displayed (4.97)
- [ ] Review count displayed (128 reviews)
- [ ] All 5 hero images loaded (no broken images)
- [ ] No JavaScript errors in console
- [ ] No network errors for assets

### Gallery
- [ ] Gallery grid shows 5 images
- [ ] Main image occupies ~50% of gallery width
- [ ] Right side shows 2×2 grid
- [ ] "Show all photos" button visible in bottom-right corner
- [ ] Hovering gallery image shows scale effect

### Photo Tour (VIEW B)
- [ ] Clicking "Show all photos" opens photo tour
- [ ] Photo tour covers full screen
- [ ] "Photo tour" title in header
- [ ] Room section navigation tabs visible
- [ ] First section "Living room" shown
- [ ] Images display in photo tour
- [ ] Clicking "Living room" tab scrolls to section
- [ ] Background scroll locked while photo tour open
- [ ] Pressing Escape closes photo tour

### Lightbox (VIEW C)
- [ ] Clicking image in photo tour opens lightbox
- [ ] Lightbox covers full screen
- [ ] Dark overlay (near-black) visible
- [ ] Image displayed centered
- [ ] Counter shows "1 / 19" or current position
- [ ] Close button (X) visible
- [ ] Previous arrow visible (or disabled on first image)
- [ ] Next arrow visible (or disabled on last image)
- [ ] Caption shows room name and image description

### Lightbox Navigation
- [ ] Clicking Next → shows next image
- [ ] Clicking Previous → shows previous image
- [ ] ArrowRight key → shows next image
- [ ] ArrowLeft key → shows previous image
- [ ] Escape key → closes lightbox
- [ ] Previous button disabled (or hidden) on first image
- [ ] Next button disabled (or hidden) on last image
- [ ] Background scroll locked while lightbox open
- [ ] Scroll unlocked when lightbox closes

### Booking Card
- [ ] Price $485/night displayed
- [ ] CHECK-IN date field functional
- [ ] CHECKOUT date field functional
- [ ] Guest count selector functional
- [ ] Reserve button present and clickable
- [ ] Price breakdown shows cleaning fee, service fee, total
- [ ] Card is sticky while scrolling

### Responsive
- [ ] Page doesn't break at 1280px width
- [ ] Booking card collapses at <1024px (acceptable)
- [ ] Gallery still shows at tablet width

### Accessibility
- [ ] Tab key reaches all interactive elements
- [ ] Enter activates buttons
- [ ] Focus visible on all interactive elements
- [ ] Modal dialogs trap focus appropriately

## Performance Thresholds
- [ ] Lighthouse Performance score ≥ 70
- [ ] LCP < 3s
- [ ] No layout shifts after initial load
- [ ] Images load progressively (lazy loading works)

## Failure Conditions
- Photo tour doesn't open on "Show all photos" click
- Lightbox doesn't open from photo tour
- Keyboard navigation broken in lightbox
- Background scrolling not prevented in modals
- Any hero image shows broken image icon
- Booking card Reserve button missing

## Running Tests
```bash
# Install Playwright browsers
cd client && npx playwright install

# Run all tests
npm run test

# Run specific test
npx playwright test tests/e2e/listing.spec.js

# Run with UI (visual mode)
npx playwright test --ui

# Generate test report
npx playwright show-report
```
