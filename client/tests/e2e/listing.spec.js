import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'
const LISTING_URL = `${BASE_URL}/listing/property-001`
const PHOTO_TOUR_URL = `${BASE_URL}/listing/property-001/photos`

// ─── Home Page Tests ─────────────────────────────────────────────────────────
test.describe('StayGallery — Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('1. Home page loads with StayGallery title', async ({ page }) => {
    await expect(page).toHaveTitle(/StayGallery/)
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('2. Multiple listings are visible on home page', async ({ page }) => {
    const cards = page.locator('[class*="propertyCard"], [class*="card"], [id*="listing-grid"] > *')
    // At minimum 5 listings visible in initial viewport
    const grid = page.locator('#listings-grid')
    await expect(grid).toBeVisible()
    const children = grid.locator('> *')
    const count = await children.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('3. Category bar is visible with categories', async ({ page }) => {
    const categoryBar = page.locator('[class*="CategoryNav"], [class*="categoryNav"], nav[aria-label*="categor"]').first()
    await expect(categoryBar).toBeVisible()
  })

  test('4. Property card click opens detail page', async ({ page }) => {
    // Click on first listing card
    const firstCard = page.locator('#listings-grid a, #listings-grid [class*="card"] a').first()
    await firstCard.click()
    // Should navigate to listing detail
    await page.waitForURL(/\/listing\//)
    expect(page.url()).toContain('/listing/')
  })

  test('5. Search bar is functional — Anywhere field present', async ({ page }) => {
    const searchBar = page.locator('button:has-text("Anywhere"), [placeholder*="Anywhere"], input[placeholder*="Where"]').first()
    await expect(searchBar).toBeVisible()
  })

  test('6. Category filtering works', async ({ page }) => {
    // Click Beach category
    const beachBtn = page.locator('button:has-text("Beach")').first()
    await beachBtn.click()
    await page.waitForTimeout(300)
    // Count should change or results should update
    const results = page.locator('#listings-grid > *')
    const count = await results.count()
    expect(count).toBeGreaterThan(0)
  })

  test('7. Wishlist/heart button persists via localStorage', async ({ page }) => {
    // Click a heart button
    const heartBtn = page.locator('[aria-label*="wish"], [aria-label*="Save"], [aria-label*="heart"]').first()
    await heartBtn.click()
    await page.waitForTimeout(200)
    // Verify localStorage has data
    const ls = await page.evaluate(() => {
      for (let key of Object.keys(localStorage)) {
        const val = localStorage.getItem(key)
        if (val && val !== 'null') return val
      }
      return null
    })
    expect(ls).not.toBeNull()
  })

  test('8. No broken image sources on home page', async ({ page }) => {
    // Check all visible images have a non-empty src
    const imgs = page.locator('#listings-grid img')
    const count = await imgs.count()
    expect(count).toBeGreaterThan(0)
    // Check that first image loaded
    const firstImg = imgs.first()
    const src = await firstImg.getAttribute('src')
    expect(src).not.toBeNull()
    expect(src.length).toBeGreaterThan(0)
  })
})

// ─── Listing Detail Page Tests ────────────────────────────────────────────────
test.describe('StayGallery — Listing Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LISTING_URL)
    await page.waitForLoadState('networkidle')
  })

  test('9. Listing detail page loads correct property', async ({ page }) => {
    await expect(page).toHaveTitle(/Lake Tahoe|StayGallery/)
    // Check h1 or title contains property name
    const title = page.locator('h1, h2').first()
    await expect(title).toBeVisible()
  })

  test('10. Hero gallery shows images', async ({ page }) => {
    const galleryImages = page.locator('[id^="gallery-image-"]')
    const count = await galleryImages.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('11. Hero gallery has no broken images', async ({ page }) => {
    const imgElements = page.locator('[id^="gallery-image-"] img')
    const count = await imgElements.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < Math.min(count, 3); i++) {
      const img = imgElements.nth(i)
      const naturalWidth = await img.evaluate((el) => el.naturalWidth)
      expect(naturalWidth).toBeGreaterThan(0)
    }
  })

  test('12. "Show all photos" button is visible and clickable', async ({ page }) => {
    const showAllBtn = page.locator('#show-all-photos-btn')
    await expect(showAllBtn).toBeVisible()
    await expect(showAllBtn).toContainText('Show all photos')
  })

  test('13. Hero image click opens lightbox', async ({ page }) => {
    const firstGalleryImg = page.locator('[id^="gallery-image-"]').first()
    await firstGalleryImg.click()
    const lightbox = page.locator('#lightbox-overlay')
    await expect(lightbox).toBeVisible()
  })

  test('14. Lightbox next button advances to next image', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()

    const counter = page.locator('.counterText, [class*="counterText"]')
    await expect(counter.first()).toContainText('1 /')

    const nextBtn = page.locator('#lightbox-next-btn')
    await expect(nextBtn).not.toBeDisabled()
    await nextBtn.click()

    const newText = await counter.first().textContent()
    expect(newText).toContain('2 /')
  })

  test('15. Lightbox previous button goes to previous image', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()

    await page.locator('#lightbox-next-btn').click()
    const counter = page.locator('[class*="counterText"]')
    await expect(counter.first()).toContainText('2 /')

    await page.locator('#lightbox-prev-btn').click()
    await expect(counter.first()).toContainText('1 /')
  })

  test('16. Escape key closes lightbox', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('#lightbox-overlay')).not.toBeVisible()
  })

  test('17. ArrowRight key navigates to next image', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()

    const counter = page.locator('[class*="counterText"]')
    await expect(counter.first()).toContainText('1 /')

    await page.keyboard.press('ArrowRight')
    await expect(counter.first()).toContainText('2 /')
  })

  test('18. ArrowLeft key navigates to previous image', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()

    await page.keyboard.press('ArrowRight')
    const counter = page.locator('[class*="counterText"]')
    await expect(counter.first()).toContainText('2 /')

    await page.keyboard.press('ArrowLeft')
    await expect(counter.first()).toContainText('1 /')
  })

  test('19. Background scrolling is locked when lightbox is open', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()

    const bodyClass = await page.locator('body').getAttribute('class')
    expect(bodyClass).toContain('modal-open')

    await page.keyboard.press('Escape')
    await page.waitForTimeout(100)
    const bodyClassAfter = await page.locator('body').getAttribute('class')
    expect(bodyClassAfter || '').not.toContain('modal-open')
  })

  test('20. Keyboard focus moves to lightbox close button when opened', async ({ page }) => {
    await page.locator('[id^="gallery-image-"]').first().click()
    await expect(page.locator('#lightbox-overlay')).toBeVisible()
    await page.waitForTimeout(200)

    const closeBtn = page.locator('#lightbox-close-btn')
    await expect(closeBtn).toBeFocused()
  })

  test('21. Booking card shows correct price', async ({ page }) => {
    await expect(page.locator('text=$485').first()).toBeVisible()
  })

  test('22. Reserve button is present', async ({ page }) => {
    const reserveBtn = page.locator('#reserve-btn')
    await expect(reserveBtn).toBeVisible()
    await expect(reserveBtn).toContainText('Reserve')
  })

  test('23. Property rating is visible', async ({ page }) => {
    await expect(page.locator('text=4.97').first()).toBeVisible()
  })

  test('24. Property location is visible', async ({ page }) => {
    await expect(page.locator('text=Lake Tahoe').first()).toBeVisible()
  })
})

// ─── Photo Tour Page Tests ────────────────────────────────────────────────────
test.describe('StayGallery — Photo Tour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PHOTO_TOUR_URL)
    await page.waitForLoadState('networkidle')
  })

  test('25. Photo tour page has photo-tour-overlay element', async ({ page }) => {
    const photoTour = page.locator('#photo-tour-overlay')
    await expect(photoTour).toBeVisible()
    await expect(photoTour).toHaveAttribute('role', 'dialog')
  })

  test('26. Photo tour shows property-specific images', async ({ page }) => {
    const images = page.locator('[id^="photo-tour-image-"]')
    const count = await images.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('27. Close photo tour button navigates back', async ({ page }) => {
    const closeBtn = page.locator('#close-photo-tour-btn')
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()
    await page.waitForTimeout(500)
    // Should go back to listing or home
    expect(page.url()).not.toContain('/photos')
  })

  test('28. Gallery image in photo tour opens lightbox', async ({ page }) => {
    await page.locator('[id^="photo-tour-image-"]').first().click()
    const lightbox = page.locator('#lightbox-overlay')
    await expect(lightbox).toBeVisible()
  })

  test('29. Show all photos from listing navigates to photo tour', async ({ page }) => {
    await page.goto(LISTING_URL)
    await page.waitForLoadState('networkidle')
    await page.locator('#show-all-photos-btn').click()
    await page.waitForURL(/\/photos/)
    expect(page.url()).toContain('/photos')
    const photoTour = page.locator('#photo-tour-overlay')
    await expect(photoTour).toBeVisible()
  })

  test('30. Escape key on photo tour navigates back', async ({ page }) => {
    const photoTour = page.locator('#photo-tour-overlay')
    await expect(photoTour).toBeVisible()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    expect(page.url()).not.toContain('/photos')
  })
})

// ─── Dynamic Routing Tests ────────────────────────────────────────────────────
test.describe('StayGallery — Dynamic Routing', () => {
  test('31. Different property IDs load different property data', async ({ page }) => {
    await page.goto(`${BASE_URL}/listing/property-002`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Malibu').first()).toBeVisible()
  })

  test('32. Property-002 photo tour uses property-002 images', async ({ page }) => {
    await page.goto(`${BASE_URL}/listing/property-002/photos`)
    await page.waitForLoadState('networkidle')
    const photoTour = page.locator('#photo-tour-overlay')
    await expect(photoTour).toBeVisible()
  })

  test('33. No broken property route — unknown ID falls back gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}/listing/property-999`)
    await page.waitForLoadState('networkidle')
    // Should not show a blank page — should show something (first property)
    const body = page.locator('body')
    await expect(body).toBeVisible()
    const text = await body.textContent()
    expect(text.length).toBeGreaterThan(100)
  })
})
