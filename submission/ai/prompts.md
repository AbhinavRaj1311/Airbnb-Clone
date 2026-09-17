# StayGallery — AI Prompt History

This document contains the chronological record of AI prompts used during the development of the StayGallery Airbnb Clone project. In accordance with assignment instructions, prompts retrieved directly from the conversation history are marked as **Exact Historical Prompts**, and intermediate development instructions are marked as **Reconstructed AI Development Prompts**.

---

## Phase 1: Initial Project Implementation & Architecture Setup
**Status:** Reconstructed AI Development Prompts

```markdown
You are an autonomous senior full-stack engineer and UI/UX specialist. Build a polished, production-ready Airbnb-style vacation rental marketplace named "StayGallery".

Requirements:
1. Initialize a clean full-stack architecture with a React 18 + Vite frontend and Node.js + Express backend.
2. Structure the client using modular CSS Modules, Google Fonts (Inter), and Lucide React icons.
3. Configure MongoDB with Mongoose for data persistence.
4. Establish clean development tooling, linting, and Playwright end-to-end testing setup.
```

---

## Phase 2: Multi-Listing Marketplace & Search/Filters
**Status:** Reconstructed AI Development Prompts

```markdown
Implement the comprehensive multi-property marketplace for StayGallery:
1. Create a rich dataset of 16 distinct, realistic properties spanning multiple categories (Amazing views, Beach, Cabins, Amazing pools, Luxe, etc.).
2. Build the Category Bar with horizontal scrolling, active selection state, and dynamic property filtering.
3. Build responsive property cards with photo carousels, pricing breakdown, rating badges, and heart/wishlist button.
4. Implement the interactive desktop and mobile search bar with location, dates, and guest count selectors.
```

---

## Phase 3: Image and Media Asset Implementation
**Status:** Reconstructed AI Development Prompts

```markdown
Ensure high visual fidelity for all property imagery:
1. Organize property images into structured folders under `/images/listings/property-xxx/`.
2. Ensure every property has 5 distinct room photos: cover (exterior/hero), living room, bathroom, kitchen, and master bedroom.
3. Verify all image aspect ratios, object-fit cropping, and fallback mechanisms to prevent any broken images or blank containers.
```

---

## Phase 4: Authentication System (JWT + HTTP-Only Cookies)
**Status:** Exact Historical Prompt

```markdown
FIX THE AUTHENTICATION AND PROFILE SYSTEM COMPLETELY.

Current problem:
The StayGallery header currently shows the globe icon and hamburger/profile UI, but clicking the profile area does not provide a Login/Signup option, and there is no proper user avatar/profile flow.

I want you to implement the complete authentication UI and backend behavior.

DO NOT just change the icon.
DO NOT create a fake visual-only dropdown.
Actually implement the complete flow.

1. HEADER PROFILE BUTTON: Keep the existing Airbnb-style profile/menu button. When clicked, open dropdown with Log in, Sign up, StayGallery your home, Help Center.
2. LOGIN & SIGNUP MODALS: Email, password, name, validation, error banner, show/hide password toggle.
3. BACKEND AUTH: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me using bcryptjs and HTTP-only JWT cookies.
4. AVATAR & PROFILE: Support avatar photo upload and display name editing on /profile.
```

---

## Phase 5: Profile & Avatar Management
**Status:** Reconstructed AI Development Prompts

```markdown
Implement the user profile page (/profile) and custom avatar support:
1. Create the protected ProfilePage displaying user details, joined date, and avatar management.
2. Build an avatar upload mechanism supporting image selection, client-side preview, and base64 persistence to MongoDB.
3. Implement initials fallback avatar when no photo is uploaded (e.g. "AR" for Abhinav Raj).
4. Add inline name editing with instant save feedback.
```

---

## Phase 6: Complete Reservation Flow & MongoDB Persistence
**Status:** Exact Historical Prompt

```markdown
FIX THE RESERVE BUTTON — IT IS CURRENTLY NOT WORKING.

On the property details page, the booking card contains:
- Price: $485 night
- Rating: 4.97
- Reviews: 128
- Check-in
- Check-out
- Guests
- Reserve button
- "You won't be charged yet"

The "Reserve" button currently does nothing.

Implement a COMPLETE WORKING RESERVATION FLOW.

Requirements:
1. Clicking "Reserve" must trigger an actual interaction.
2. Validate:
   - Check-in date is selected
   - Check-out date is selected
   - Check-out must be after check-in
   - At least 1 guest
3. If the user is NOT logged in:
   - Open the existing Login modal
   - After successful login, return to the reservation flow
4. If the user IS logged in:
   - Open a reservation/booking confirmation modal or page.
5. Reservation confirmation must display property name, dates, guests, price breakdown, and Confirm button.
6. Save to MongoDB (Reservation model: userId, propertyId, checkIn, checkOut, guests, pricePerNight, nights, totalPrice, status).
7. Success confirmation with reservation ID and button to view trips.
8. Add "Trips" section to logged-in profile menu leading to /trips.
9. Overlap prevention: Prevent duplicate or overlapping bookings for the same property.
10. Reserve button states: hover, active, loading, disabled, error. Do NOT use alert().
```

---

## Phase 7: Photo Tour Page & Category Navigation
**Status:** Reconstructed AI Development Prompts

```markdown
Build the full-screen Photo Tour page (/listing/:id/photos):
1. Clicking "Show all photos" on any listing navigates to the categorized Photo Tour.
2. Group property images by room category (Living room, Bedroom, Kitchen, Bathroom, Outdoor).
3. Provide top navigation with back button and section scroll jumps.
4. Clicking any photo inside the tour opens the interactive Lightbox.
```

---

## Phase 8: Lightbox Modal & Keyboard Navigation
**Status:** Reconstructed AI Development Prompts

```markdown
Implement the interactive Lightbox modal:
1. Support full-screen high-resolution image viewing.
2. Next and Previous buttons with cyclic navigation.
3. Keyboard navigation: ArrowRight (next), ArrowLeft (prev), Escape (close).
4. Lock background body scrolling while lightbox is active.
5. Accessible focus management returning to trigger element upon closing.
```

---

## Phase 9: UI & Visual Refinement
**Status:** Reconstructed AI Development Prompts

```markdown
Refine visual fidelity to match modern Airbnb production design:
1. Review spacing, typography, colors, borders, and shadows against the design system.
2. Add subtle micro-interactions: card hover lifts, button active states, modal entrance transitions.
3. Ensure crisp contrast ratios meeting WCAG 2.1 AA standards.
```

---

## Phase 10: End-to-End Testing & Regression Verification
**Status:** Reconstructed AI Development Prompts

```markdown
Execute full automated testing with Playwright:
1. Write listing and marketplace tests covering search, filters, hero gallery, and routing.
2. Write auth tests covering profile dropdown, login modal, registration, session persistence, and avatar.
3. Write complete reservation tests covering validation, auth gating, confirmation modal, MongoDB creation, /trips listing, and overlap prevention.
4. Verify all tests pass with zero regressions.
```

---

## Phase 11: Quality Audit & Code Cleaning
**Status:** Reconstructed AI Development Prompts

```markdown
Perform comprehensive code quality inspection:
1. Search and remove all temporary TODOs, FIXMEs, and debug logs.
2. Verify production build bundle size with Vite.
3. Audit all image references for broken paths or missing assets.
```

---

## Phase 12: Submission Packaging & Verification
**Status:** Exact Historical Prompt

```markdown
FINAL SUBMISSION PREPARATION — DO EVERYTHING AUTONOMOUSLY

You are now responsible for preparing the FINAL SUBMISSION of my StayGallery Airbnb Clone assignment.
1. Create architecture diagram (PNG, PDF, Markdown).
2. Prepare AI agent and skill configuration files.
3. Compile AI prompt history (prompts.md).
4. Write comprehensive README.md covering all 23 sections.
5. Capture 7 required desktop screenshots (1440x900).
6. Clean source code (no node_modules, no .env, no dist).
7. Assemble final submission/ directory and package into StayGallery-Airbnb-Clone-Submission.zip.
8. Inspect and verify the ZIP contents.
```
