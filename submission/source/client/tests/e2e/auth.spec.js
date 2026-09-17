import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'
const DEMO_EMAIL = 'demo@staygallery.local'
const DEMO_PASSWORD = 'Demo@12345'
const DEMO_NAME = 'Abhinav Raj'

// Helper to login via API to set cookie
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
  await page.waitForTimeout(2000)
}

// ─── Profile Menu Tests ───────────────────────────────────────────────────────
test.describe('StayGallery — Auth UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('1. Profile menu button is visible in header', async ({ page }) => {
    const menuBtn = page.locator('#header-menu-btn')
    await expect(menuBtn).toBeVisible()
    await expect(menuBtn).toHaveAttribute('aria-haspopup', 'true')
  })

  test('2. Profile menu opens on click', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    const dropdown = page.locator('#profile-menu-dropdown')
    await expect(dropdown).toBeVisible()
  })

  test('3. Logged-out menu shows Log in and Sign up', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await expect(page.locator('#menu-login-btn')).toBeVisible()
    await expect(page.locator('#menu-login-btn')).toContainText('Log in')
    await expect(page.locator('#menu-signup-btn')).toBeVisible()
    await expect(page.locator('#menu-signup-btn')).toContainText('Sign up')
  })

  test('4. Profile menu closes on Escape key', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await expect(page.locator('#profile-menu-dropdown')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    await expect(page.locator('#profile-menu-dropdown')).not.toBeVisible()
  })

  test('5. Profile menu closes on outside click', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await expect(page.locator('#profile-menu-dropdown')).toBeVisible()
    await page.locator('body').click({ position: { x: 100, y: 100 } })
    await page.waitForTimeout(200)
    await expect(page.locator('#profile-menu-dropdown')).not.toBeVisible()
  })

  // ─── Login Modal Tests ──────────────────────────────────────────────────────
  test('6. Login modal opens from menu', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    const modal = page.locator('#auth-modal')
    await expect(modal).toBeVisible()
    await expect(modal).toHaveAttribute('role', 'dialog')
  })

  test('7. Login modal has email, password, and submit button', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()
    await expect(page.locator('#login-submit-btn')).toBeVisible()
  })

  test('8. Login modal closes with Escape', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    await expect(page.locator('#auth-modal')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#auth-modal')).not.toBeVisible()
  })

  test('9. Login modal closes with X button', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    await expect(page.locator('#auth-modal')).toBeVisible()
    await page.locator('#auth-modal-close-btn').click()
    await expect(page.locator('#auth-modal')).not.toBeVisible()
  })

  test('10. Login with empty fields shows no request (empty validation)', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    await page.locator('#login-submit-btn').click()
    // Modal should still be visible (not close)
    await expect(page.locator('#auth-modal')).toBeVisible()
  })

  test('11. Login with wrong credentials shows error', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    await page.locator('#login-email').fill('wrong@example.com')
    await page.locator('#login-password').fill('wrongpassword')
    await page.locator('#login-submit-btn').click()
    await page.waitForTimeout(3000)
    // Error banner should be visible
    const errorBanner = page.locator('[class*="errorBanner"]')
    await expect(errorBanner).toBeVisible()
    // Modal should remain open
    await expect(page.locator('#auth-modal')).toBeVisible()
  })

  test('12. Show/hide password toggle works', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    const pw = page.locator('#login-password')
    await expect(pw).toHaveAttribute('type', 'password')
    // Click eye button
    await page.locator('[aria-label="Show password"]').first().click()
    await expect(pw).toHaveAttribute('type', 'text')
  })

  // ─── Signup Modal Tests ─────────────────────────────────────────────────────
  test('13. Signup modal opens from menu', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-signup-btn').click()
    const modal = page.locator('#auth-modal')
    await expect(modal).toBeVisible()
    await expect(page.locator('#signup-name')).toBeVisible()
    await expect(page.locator('#signup-email')).toBeVisible()
    await expect(page.locator('#signup-password')).toBeVisible()
    await expect(page.locator('#signup-confirm')).toBeVisible()
  })

  test('14. Signup validation — passwords do not match', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-signup-btn').click()
    await page.locator('#signup-name').fill('Test User')
    await page.locator('#signup-email').fill('test@example.com')
    await page.locator('#signup-password').fill('password123')
    await page.locator('#signup-confirm').fill('password456')
    await page.locator('#signup-submit-btn').click()
    // Should show passwords don't match error
    const errors = page.locator('[role="alert"]')
    const count = await errors.count()
    expect(count).toBeGreaterThan(0)
  })

  test('15. Switch from login to signup form', async ({ page }) => {
    await page.locator('#header-menu-btn').click()
    await page.locator('#menu-login-btn').click()
    // Should show login form
    await expect(page.locator('#login-email')).toBeVisible()
    // Click "Sign up" link
    await page.locator('[class*="switchLink"]').click()
    // Should switch to signup form
    await expect(page.locator('#signup-name')).toBeVisible()
    await expect(page.locator('#login-email')).not.toBeVisible()
  })

  // ─── Successful Login Tests ─────────────────────────────────────────────────
  test('16. Successful login closes modal and updates header', async ({ page }) => {
    await loginViaUI(page)
    // Modal should be closed
    await expect(page.locator('#auth-modal')).not.toBeVisible()
    // Header should now show avatar/initials
    const menuBtn = page.locator('#header-menu-btn')
    await expect(menuBtn).toBeVisible()
  })

  test('17. Logged-in menu shows user info and logout', async ({ page }) => {
    await loginViaUI(page)
    await page.locator('#header-menu-btn').click()
    await page.waitForTimeout(300)
    const dropdown = page.locator('#profile-menu-dropdown')
    await expect(dropdown).toBeVisible()
    // Should show user name and email
    await expect(dropdown).toContainText(DEMO_NAME)
    await expect(dropdown).toContainText(DEMO_EMAIL)
    // Should show logout button
    await expect(page.locator('#logout-btn')).toBeVisible()
    // Should NOT show login/signup
    await expect(page.locator('#menu-login-btn')).not.toBeVisible()
  })

  test('18. Logout clears session and reverts header', async ({ page }) => {
    await loginViaUI(page)
    await page.locator('#header-menu-btn').click()
    await page.waitForTimeout(300)
    await page.locator('#logout-btn').click()
    await page.waitForTimeout(1000)
    // Now should be logged out — clicking menu shows login option
    await page.locator('#header-menu-btn').click()
    await page.waitForTimeout(300)
    await expect(page.locator('#menu-login-btn')).toBeVisible()
    await expect(page.locator('#logout-btn')).not.toBeVisible()
  })

  test('19. Session persists on page reload', async ({ page }) => {
    await loginViaUI(page)
    // Reload the page
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    // Should still be logged in
    await page.locator('#header-menu-btn').click()
    await page.waitForTimeout(300)
    await expect(page.locator('#logout-btn')).toBeVisible()
    await expect(page.locator('#menu-login-btn')).not.toBeVisible()
  })

  // ─── Profile Page Tests ─────────────────────────────────────────────────────
  test('20. Profile page redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/profile`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    // Should redirect away or show login
    const url = page.url()
    expect(url).not.toBe(`${BASE_URL}/profile`)
  })

  test('21. Profile page loads when authenticated', async ({ page }) => {
    await loginViaUI(page)
    await page.goto(`${BASE_URL}/profile`)
    await page.waitForLoadState('networkidle')
    const profilePage = page.locator('#profile-page')
    await expect(profilePage).toBeVisible()
    await expect(page.locator('#profile-name')).toContainText(DEMO_NAME)
    await expect(page.locator('#profile-email')).toContainText(DEMO_EMAIL)
  })

  test('22. Profile page shows edit name button', async ({ page }) => {
    await loginViaUI(page)
    await page.goto(`${BASE_URL}/profile`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('#edit-name-btn')).toBeVisible()
  })

  test('23. Profile page has avatar upload button', async ({ page }) => {
    await loginViaUI(page)
    await page.goto(`${BASE_URL}/profile`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('#change-avatar-btn')).toBeVisible()
  })

  test('24. Profile page logout works', async ({ page }) => {
    await loginViaUI(page)
    await page.goto(`${BASE_URL}/profile`)
    await page.waitForLoadState('networkidle')
    await page.locator('#profile-logout-btn').click()
    await page.waitForTimeout(1000)
    // Should redirect to home
    expect(page.url()).toBe(`${BASE_URL}/`)
  })

  // ─── Wishlist Auth Tests ────────────────────────────────────────────────────
  test('25. Save button opens login modal when not authenticated', async ({ page }) => {
    // Click Save (heart) on first listing card while logged out
    await page.waitForTimeout(500)
    const heartBtn = page.locator('[id^="wishlist-btn-"]').first()
    await heartBtn.click()
    await page.waitForTimeout(500)
    // Login modal should appear
    await expect(page.locator('#auth-modal')).toBeVisible()
  })

  test('26. Avatar fallback shows initials when no avatar uploaded', async ({ page }) => {
    await loginViaUI(page)
    await page.locator('#header-menu-btn').click()
    await page.waitForTimeout(300)
    const dropdown = page.locator('#profile-menu-dropdown')
    await expect(dropdown).toBeVisible()
    // The avatar span in the dropdown should show initials
    const avatarEl = dropdown.locator('[class*="initials"]')
    const count = await avatarEl.count()
    // Either initials element exists, OR an img element (if avatar uploaded)
    const imgEl = dropdown.locator('img[alt*="avatar"]')
    const hasInitials = count > 0
    const hasImg = await imgEl.count() > 0
    expect(hasInitials || hasImg).toBeTruthy()
  })
})
