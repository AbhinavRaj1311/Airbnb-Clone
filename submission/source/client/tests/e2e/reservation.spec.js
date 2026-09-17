import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'
const DEMO_EMAIL = 'demo@staygallery.local'
const DEMO_PASSWORD = 'Demo@12345'

// Helper: login via UI
async function loginViaUI(page) {
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')
  await page.locator('#header-menu-btn').click()
  await page.waitForTimeout(300)
  await page.locator('#menu-login-btn').click()
  await page.waitForTimeout(300)
  await page.locator('#login-email').fill(DEMO_EMAIL)
  await page.locator('#login-password').fill(DEMO_PASSWORD)
  await page.locator('#login-submit-btn').click()
  await expect(page.locator('#auth-modal')).not.toBeVisible({ timeout: 10000 })
  await page.waitForTimeout(500)
}

test.describe('StayGallery — Complete Reservation Flow', () => {
  test('1. Booking card is visible on property details page with initial dates & price', async ({ page }) => {
    await page.goto(`${BASE_URL}/listing/property-001`)
    await page.waitForLoadState('networkidle')

    // Price
    const priceEl = page.locator('#card-price-per-night')
    await expect(priceEl).toBeVisible()
    await expect(priceEl).toContainText('$485')

    // Inputs
    await expect(page.locator('#check-in-date')).toBeVisible()
    await expect(page.locator('#check-out-date')).toBeVisible()
    await expect(page.locator('#guest-count')).toBeVisible()

    // Reserve button
    const reserveBtn = page.locator('#reserve-btn')
    await expect(reserveBtn).toBeVisible()
    await expect(reserveBtn).toHaveText('Reserve')
  })

  test('2. Validation prevents reservation when check-out is before check-in', async ({ page }) => {
    await page.goto(`${BASE_URL}/listing/property-001`)
    await page.waitForLoadState('networkidle')

    // Set invalid dates: check-in after check-out
    await page.locator('#check-in-date').fill('2026-09-20')
    await page.locator('#check-out-date').fill('2026-09-15')

    await page.locator('#reserve-btn').click()

    // Inline validation error must be displayed
    const errorBanner = page.locator('#booking-validation-error')
    await expect(errorBanner).toBeVisible()
    await expect(errorBanner).toContainText('Check-out date must be after check-in date')

    // Modal must NOT open
    await expect(page.locator('#reservation-modal')).not.toBeVisible()
  })

  test('3. Validation prevents reservation when dates are missing', async ({ page }) => {
    await page.goto(`${BASE_URL}/listing/property-001`)
    await page.waitForLoadState('networkidle')

    // Clear check-in date
    await page.locator('#check-in-date').fill('')
    await page.locator('#reserve-btn').click()

    const errorBanner = page.locator('#booking-validation-error')
    await expect(errorBanner).toBeVisible()
    await expect(errorBanner).toContainText('Please select a check-in date')
  })

  test('4. Unauthenticated user clicking Reserve opens Login Modal and continues to reservation after login', async ({ page, context }) => {
    // Ensure clean state (logged out)
    await context.clearCookies()
    await page.goto(`${BASE_URL}/listing/property-001`)
    await page.waitForLoadState('networkidle')

    // Valid dates
    await page.locator('#check-in-date').fill('2026-10-10')
    await page.locator('#check-out-date').fill('2026-10-14')

    // Click reserve
    await page.locator('#reserve-btn').click()

    // Auth modal should open
    const authModal = page.locator('#auth-modal')
    await expect(authModal).toBeVisible()

    // Log in
    await page.locator('#login-email').fill(DEMO_EMAIL)
    await page.locator('#login-password').fill(DEMO_PASSWORD)
    await page.locator('#login-submit-btn').click()

    // After login, reservation confirmation modal should open automatically
    const resModal = page.locator('#reservation-modal')
    await expect(resModal).toBeVisible({ timeout: 5000 })
    await expect(page.locator('#confirm-property-title')).toContainText('Luxe Mountain Villa')
  })

  test('5. Authenticated user clicking Reserve opens Reservation Confirmation Modal with accurate details', async ({ page }) => {
    await loginViaUI(page)

    await page.goto(`${BASE_URL}/listing/property-001`)
    await page.waitForLoadState('networkidle')

    // Select custom dates: 3 nights
    await page.locator('#check-in-date').fill('2026-11-01')
    await page.locator('#check-out-date').fill('2026-11-04')
    await page.locator('#guest-count').selectOption('2')

    await page.locator('#reserve-btn').click()

    const resModal = page.locator('#reservation-modal')
    await expect(resModal).toBeVisible()

    // Verify confirmation modal contents
    await expect(page.locator('#confirm-property-title')).toContainText('Luxe Mountain Villa')
    await expect(page.locator('#confirm-dates')).toContainText('Nov 1, 2026')
    await expect(page.locator('#confirm-dates')).toContainText('Nov 4, 2026')
    await expect(page.locator('#confirm-nights')).toContainText('3 nights')
    await expect(page.locator('#confirm-guests')).toContainText('2 guests')

    // Price calculation: 485 * 3 = 1455, plus cleaning & service fee
    await expect(page.locator('#confirm-subtotal')).toContainText('$1,455')
    await expect(page.locator('#confirm-reservation-btn')).toBeVisible()
  })

  test('6. Complete End-to-End: Confirm reservation saves to MongoDB and displays success confirmation', async ({ page }) => {
    await loginViaUI(page)

    await page.goto(`${BASE_URL}/listing/property-001`)
    await page.waitForLoadState('networkidle')

    // Generate guaranteed unique dates in future to avoid collisions across test runs
    const futureDays = 300 + Math.floor(Math.random() * 1000)
    const d1 = new Date(Date.now() + futureDays * 86400000)
    const d2 = new Date(d1.getTime() + 2 * 86400000)
    const checkInStr = d1.toISOString().split('T')[0]
    const checkOutStr = d2.toISOString().split('T')[0]

    await page.locator('#check-in-date').fill(checkInStr)
    await page.locator('#check-out-date').fill(checkOutStr)
    await page.locator('#guest-count').selectOption('3')

    await page.locator('#reserve-btn').click()
    await expect(page.locator('#reservation-modal')).toBeVisible()

    // Click Confirm Reservation
    const confirmBtn = page.locator('#confirm-reservation-btn')
    await confirmBtn.click()

    // Success screen should appear
    const successView = page.locator('#reservation-success-view')
    await expect(successView).toBeVisible({ timeout: 10000 })

    // Success screen shows required details
    await expect(page.locator('#reservation-id-display')).toBeVisible()
    await expect(page.locator('#reservation-property-title')).toContainText('Luxe Mountain Villa')
    await expect(page.locator('#reservation-guests-display')).toContainText('3 guests')
    await expect(page.locator('#reservation-total-display')).toBeVisible()

    // Button to view trips
    const viewTripsBtn = page.locator('#view-trips-btn')
    await expect(viewTripsBtn).toBeVisible()

    // Clicking View Trips navigates to /trips
    await viewTripsBtn.click()
    await page.waitForURL('**/trips')
    await expect(page.locator('#trips-page-title')).toHaveText('Your Trips')

    // Reservation should appear in Trips list
    const tripsGrid = page.locator('#trips-grid')
    await expect(tripsGrid).toBeVisible()
    await expect(tripsGrid).toContainText('Luxe Mountain Villa')
    await expect(tripsGrid).toContainText('confirmed')
  })

  test('7. Trips section in profile menu links to /trips', async ({ page }) => {
    await loginViaUI(page)

    await page.locator('#header-menu-btn').click()
    await page.waitForTimeout(300)

    const tripsLink = page.locator('#trips-link')
    await expect(tripsLink).toBeVisible()
    await tripsLink.click()

    await page.waitForURL('**/trips')
    await expect(page.locator('#trips-page-title')).toHaveText('Your Trips')
  })

  test('8. Multi-property test: Booking works for a different property without hardcoding', async ({ page }) => {
    await loginViaUI(page)

    // Go to property-002 (Malibu Beach House)
    await page.goto(`${BASE_URL}/listing/property-002`)
    await page.waitForLoadState('networkidle')

    // Verify property-specific price ($620)
    const priceEl = page.locator('#card-price-per-night')
    await expect(priceEl).toContainText('$620')

    const futureDays = 1500 + Math.floor(Math.random() * 1000)
    const d1 = new Date(Date.now() + futureDays * 86400000)
    const d2 = new Date(d1.getTime() + 3 * 86400000)
    const checkInStr = d1.toISOString().split('T')[0]
    const checkOutStr = d2.toISOString().split('T')[0]

    await page.locator('#check-in-date').fill(checkInStr)
    await page.locator('#check-out-date').fill(checkOutStr)

    await page.locator('#reserve-btn').click()
    await expect(page.locator('#reservation-modal')).toBeVisible()

    // Confirm property title is Malibu, not Lake Tahoe
    await expect(page.locator('#confirm-property-title')).toContainText('Malibu')

    // Confirm booking
    await page.locator('#confirm-reservation-btn').click()
    await expect(page.locator('#reservation-success-view')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('#reservation-property-title')).toContainText('Malibu')
  })

  test('9. Overlapping reservation prevention: booking already reserved dates displays error banner', async ({ page }) => {
    await loginViaUI(page)

    await page.goto(`${BASE_URL}/listing/property-003`)
    await page.waitForLoadState('networkidle')

    const futureDays = 2500 + Math.floor(Math.random() * 500)
    const d1 = new Date(Date.now() + futureDays * 86400000)
    const d2 = new Date(d1.getTime() + 2 * 86400000)
    const checkInStr = d1.toISOString().split('T')[0]
    const checkOutStr = d2.toISOString().split('T')[0]

    // Book first time
    await page.locator('#check-in-date').fill(checkInStr)
    await page.locator('#check-out-date').fill(checkOutStr)
    await page.locator('#reserve-btn').click()
    await expect(page.locator('#reservation-modal')).toBeVisible()
    await page.locator('#confirm-reservation-btn').click()
    await expect(page.locator('#reservation-success-view')).toBeVisible({ timeout: 10000 })
    await page.locator('#close-success-btn').click()

    // Try booking the EXACT SAME DATES again
    await page.locator('#reserve-btn').click()
    await expect(page.locator('#reservation-modal')).toBeVisible()
    await page.locator('#confirm-reservation-btn').click()

    // Error banner should appear
    const errorBanner = page.locator('#reservation-error-banner')
    await expect(errorBanner).toBeVisible()
    await expect(errorBanner).toContainText('already reserved')
  })
})
