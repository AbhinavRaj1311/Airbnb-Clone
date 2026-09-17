import { chromium } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'http://localhost:5173'
const DEMO_EMAIL = 'demo@staygallery.local'
const DEMO_PASSWORD = 'Demo@12345'

async function capture() {
  const rootDir = path.resolve(__dirname, '..')
  const outDir = path.join(rootDir, 'submission', 'screenshots')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  console.log('📸 1. Capturing 01-home-page.png...')
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(outDir, '01-home-page.png') })

  console.log('📸 2. Capturing 02-property-details.png...')
  await page.goto(`${BASE_URL}/listing/property-001`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(outDir, '02-property-details.png') })

  console.log('📸 3. Capturing 03-photo-tour.png...')
  await page.goto(`${BASE_URL}/listing/property-001/photos`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(outDir, '03-photo-tour.png') })

  console.log('📸 4. Capturing 04-lightbox.png...')
  await page.goto(`${BASE_URL}/listing/property-001`)
  await page.waitForLoadState('networkidle')
  // Click first hero gallery image button
  const heroFirstImg = page.locator('button[aria-label^="View photo:"]').first()
  await heroFirstImg.click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(outDir, '04-lightbox.png') })
  // Close lightbox
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  console.log('📸 5. Capturing 05-login.png...')
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')
  await page.locator('#header-menu-btn').click()
  await page.waitForTimeout(400)
  await page.locator('#menu-login-btn').click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(outDir, '05-login.png') })

  console.log('📸 6. Logging in and capturing 06-logged-in-profile.png...')
  await page.locator('#login-email').fill(DEMO_EMAIL)
  await page.locator('#login-password').fill(DEMO_PASSWORD)
  await page.locator('#login-submit-btn').click()
  await page.waitForTimeout(1500)
  await page.goto(`${BASE_URL}/profile`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(outDir, '06-logged-in-profile.png') })

  console.log('📸 7. Capturing 07-reservation.png...')
  await page.goto(`${BASE_URL}/listing/property-001`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.locator('#reserve-btn').click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(outDir, '07-reservation.png') })

  await browser.close()
  console.log('🎉 All 7 screenshots captured successfully at 1440x900!')
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err)
  process.exit(1)
})
