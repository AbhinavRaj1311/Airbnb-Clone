# StayGallery — Airbnb Clone

> A production-grade, full-stack vacation-rental marketplace built with React 18, Vite, Express, and MongoDB.

---

## 1. Project Overview

StayGallery is a high-fidelity, full-stack recreation of the Airbnb vacation rental experience. It delivers a rich, interactive marketplace featuring 16 multi-category listings, responsive search and filtering, interactive 5-photo hero galleries, a categorized room-by-room photo tour, an accessible keyboard-navigable lightbox, full JWT cookie authentication with profile management, and a complete end-to-end reservation flow backed by MongoDB.

All components, stylesheets, API endpoints, and database models were built from the ground up with meticulous attention to visual polish, accessibility (WCAG 2.1 AA), and architectural scalability.

---

## 2. Features

- **Multi-Property Marketplace:** 16 diverse listings across 12 categories (Amazing views, Beach, Cabins, Amazing pools, Luxe, etc.).
- **Interactive Search & Filter:** Dynamic location, date range, and guest filters with instant client-side reactivity.
- **5-Photo Hero Grid:** Responsive Airbnb-style mosaic with subtle hover interactions and "Show all photos" trigger.
- **Full-Screen Photo Tour:** Room-categorized gallery view (Living room, Bedroom, Kitchen, Bathroom, Outdoor) with smooth navigation.
- **Interactive Lightbox:** High-resolution modal with ArrowLeft/ArrowRight cyclic navigation, Escape to close, background scroll locking, and focus trapping.
- **JWT Cookie Authentication:** Secure HTTP-only cookie-based authentication supporting login, signup, session persistence across reloads, and logout.
- **User Profile & Custom Avatar:** Dynamic initials fallback, client-side base64 photo upload saved to MongoDB, and inline name editing.
- **Wishlist / Save to Favorites:** Interactive heart toggle with localStorage persistence and automatic login prompting for unauthenticated guests.
- **Complete Working Reservation Flow:**
  - Dynamic pricing with real-time night and fee calculation.
  - Comprehensive date validation (check-in, check-out, minimum stay, guest count).
  - Unauthenticated reservation gating: opens login modal and seamlessly returns to booking confirmation.
  - Reservation Confirmation Modal with full price breakdown.
  - Overlapping reservation prevention on the same property.
  - MongoDB persistence with confirmed status and unique reservation codes.
  - Dedicated **Your Trips** (`/trips`) dashboard with cancellation support and real-time status updates.

---

## 3. Tech Stack

- **Frontend:** React 18, Vite 5, React Router v6, CSS Modules, Lucide React icons.
- **Backend:** Node.js (v20+ LTS), Express 4, Mongoose 8, jsonwebtoken, bcryptjs, cookie-parser, cors.
- **Database:** MongoDB (with local replica set / Atlas compatibility).
- **Testing:** Playwright test runner for automated end-to-end regression and flow verification.
- **Styling:** Modular CSS Modules using CSS custom properties (design tokens) for colors, typography, elevations, and animations.

---

## 4. Application Architecture

StayGallery follows a clean layered architecture designed for horizontal scalability:

```
[Client (React 18 SPA)]
         │
         ▼ HTTPS / JSON API
[CDN / Edge Network (Cloudflare / CloudFront)]
         │
         ▼
[API Gateway & Load Balancer (AWS ALB / NGINX)]
         │
         ▼
[Stateless Node.js + Express Backend Cluster]
    ├── Authentication Service (JWT HTTP-Only Cookies)
    ├── Property & Listing Service
    └── Reservation Service (Date Logic & Overlap Checks)
         │
         ├──────────────────────┬──────────────────────┐
         ▼                      ▼                      ▼
[MongoDB Replica Set]     [Redis Cluster]      [AWS S3 / R2]
(Users, Properties,       (Session & Query     (Master Photos
 Reservations)             Caching, Locks)      & Media)
```

---

## 5. Folder Structure

```
StayGallery/
├── client/                     # Frontend React SPA
│   ├── public/                 # Static assets, icons, property images
│   │   └── images/listings/    # 16 property photo folders (5 photos each)
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── auth/           # AuthModal, ProfileMenu, Avatar, ProtectedRoute
│   │   │   ├── BookingCard/    # Interactive booking widget
│   │   │   ├── ReservationModal/# Confirmation & success modal
│   │   │   ├── Header/         # Site header with user menu
│   │   │   ├── PropertyCard/   # Marketplace listing cards
│   │   │   └── Lightbox/       # Accessible image viewer
│   │   ├── context/            # AuthContext, WishlistContext
│   │   ├── pages/              # HomePage, ListingDetailPage, PhotoTourPage, ProfilePage, TripsPage
│   │   └── services/           # authService.js, reservationService.js
│   └── tests/e2e/              # Playwright test suites (auth, listing, reservation)
├── server/                     # Backend Express API
│   └── src/
│       ├── config/             # Environment & port configuration
│       ├── controllers/        # auth, property, and reservation controllers
│       ├── middleware/         # Error handling, cookie parsers
│       ├── models/             # Mongoose schemas (User, Property, Reservation)
│       ├── routes/             # authRoutes, propertyRoutes, reservationRoutes
│       └── server.js           # Server startup and MongoDB connection
├── architecture/               # Architecture diagram (PNG, PDF, Markdown)
├── ai/                         # AI prompts and subagent reviewer configs
└── screenshots/                # 1440x900 desktop application screenshots
```

---

## 6. Installation

Ensure Node.js (v18 or higher) and MongoDB are installed on your machine.

1. **Clone or extract the project:**
   ```bash
   cd StayGallery
   ```

2. **Install root and workspace dependencies:**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

---

## 7. Environment Variables

Create `.env` in the `server/` directory (or use `.env.example` as a template):

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/staygallery
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=staygallery_dev_secret_change_in_production_2024
```

> **Note:** Do NOT commit `.env` files containing production secrets to version control.

---

## 8. MongoDB Setup

Ensure your local MongoDB daemon is running:

- **Windows (Service):**
  ```powershell
  Get-Service -Name *mongo*
  ```
- **macOS / Linux:**
  ```bash
  sudo systemctl start mongod
  # or via brew
  brew services start mongodb-community
  ```

---

## 9. Running Frontend

From the `client/` directory:
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 10. Running Backend

From the `server/` directory:
```bash
npm run start
```
The backend Express API will listen on `http://localhost:5001`.

---

## 11. Seeding Database

Seed demo users and listings into MongoDB:
```bash
# Seed properties
node server/src/seed.js

# Seed demo user
node server/src/seedUser.js
```

Demo User Credentials:
- **Email:** `demo@staygallery.local`
- **Password:** `Demo@12345`

---

## 12. Testing

StayGallery includes a comprehensive automated end-to-end test suite using Playwright:

```bash
cd client
npx playwright test --reporter=line
```

**Results:** 68 / 68 Tests Passing
- 33 / 33 Marketplace & Listing tests
- 26 / 26 Authentication & Profile tests
- 9 / 9 Complete Reservation Flow tests

---

## 13. Build

To create an optimized production build of the frontend:
```bash
cd client
npm run build
```
Assets will be generated in `client/dist/`.

---

## 14. Authentication

- **Architecture:** JSON Web Tokens (JWT) signed with HMAC-SHA256.
- **Cookie Security:** Tokens are transmitted exclusively inside an HTTP-only, SameSite cookie (`staygallery_token`), protecting users from client-side script token theft (XSS).
- **Session Persistence:** Checked automatically on app load via `GET /api/auth/me`. Survives full page reloads.
- **Interactive UI:** Header menu toggles between guest (Log in, Sign up) and authenticated states (Avatar initials, Profile, Wishlist, Trips, Logout).

---

## 15. Reservation System

1. **Date Selection:** Validates check-in, check-out, positive night count, and guest limits.
2. **Auth Interception:** Unauthenticated users clicking Reserve are prompted to log in; upon completion, they are automatically returned to the reservation modal.
3. **Confirmation Modal:** Displays property title, location, dates, guests, subtotal, fees, and total.
4. **Overlap Prevention:** Backend checks confirmed bookings in MongoDB for date overlaps on the same property and returns 409 Conflict if dates are taken.
5. **Dashboard (`/trips`):** Displays all user reservations with status badges, price breakdown, and cancellation capability.

---

## 16. Image Asset Strategy

- All 16 properties have high-resolution photography stored locally under `client/public/images/listings/property-xxx/`.
- Every property includes:
  - `cover.jpg` (Hero exterior / architectural view)
  - `2.jpg` (Living room)
  - `3.jpg` (Bathroom)
  - `4.jpg` (Kitchen & dining)
  - `5.jpg` (Master bedroom)
- Fallback image handlers (`onError`) prevent broken image placeholders or blank containers.

---

## 17. Photo Tour

- Accessible via the "Show all photos" button on any listing.
- Groups images into structured sections by room category.
- Supports sticky category jump navigation and keyboard navigation.

---

## 18. Lightbox

- Full-screen high-resolution modal image viewer.
- Keyboard support: `Escape` to close, `ArrowRight` for next image, `ArrowLeft` for previous image.
- Background scrolling is locked (`overflow: hidden`) while open.
- Focus is automatically trapped and restored upon exit.

---

## 19. Accessibility

- Conforms to **WCAG 2.1 AA** guidelines.
- Semantic HTML5 landmark elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`).
- Screen reader-friendly ARIA attributes (`aria-label`, `aria-expanded`, `aria-haspopup`, `role="dialog"`, `role="alert"`).
- Keyboard-navigable interactive controls with high-visibility focus rings (`:focus-visible`).

---

## 20. AI-Assisted Development

Developed using autonomous agentic AI pair programming workflows with specialized subagent reviewers for visual fidelity, UI responsiveness, backend security, accessibility compliance, and end-to-end QA validation. Complete prompts are cataloged in `ai/prompts.md`.

---

## 21. Architecture Diagram

A full production architecture diagram is provided in three formats under `architecture/`:
- `architecture.png` (High-resolution visual diagram)
- `architecture.pdf` (Printable vector document)
- `architecture.md` (Detailed structural specification)

---

## 22. Deployment

- **Frontend:** Deployable to Cloudflare Pages, Vercel, or AWS S3 + CloudFront with standard SPA redirect rules (`/* -> /index.html`).
- **Backend:** Containerized via Docker (`Dockerfile`) and deployable to AWS ECS, Google Cloud Run, or Kubernetes.
- **Database:** MongoDB Atlas M10+ cluster with multi-AZ replication.

---

## 23. Known Limitations

- Real-world payment gateway processing (e.g. Stripe Elements) is simulated with zero-charge reservation confirmation.
- SMS two-factor authentication is mocked in the current development environment.
