# React Architecture Skill

## Purpose

Guide architectural decisions for the StayGallery React frontend to ensure scalability, maintainability, and consistency with industry best practices.

## Core Patterns

### 1. Component Hierarchy
```
App
├── BrowserRouter
│   ├── WishlistProvider (Context)
│   │   ├── HomePage
│   │   │   ├── SearchProvider (Context)
│   │   │   ├── HomeHeader
│   │   │   │   └── SearchBar (with dropdowns)
│   │   │   ├── CategoryNav
│   │   │   └── PropertyGrid
│   │   │       └── PropertyCard[]
│   │   ├── ListingDetailPage
│   │   │   ├── Header
│   │   │   ├── PropertyHeader
│   │   │   ├── PropertyGalleryDynamic
│   │   │   ├── PropertyInfo + Amenities + Reviews + HostInfo
│   │   │   ├── BookingCard
│   │   │   └── LightboxDynamic
│   │   └── PhotoTourPage
│   │       ├── PhotoSection[]
│   │       └── LightboxDynamic
```

### 2. Data Flow
- Property data: `src/data/propertiesData.js` — single source of truth
- Wishlist state: WishlistContext + localStorage persistence
- Search/filter state: SearchContext (scoped to HomePage)
- No global state needed beyond wishlist and search

### 3. Image Safety Rule
- Every image component must use property.images from the SAME property object
- Never import images from a different property's data
- Gallery components receive `property` prop, not global image arrays

### 4. CSS Module Pattern
- Every component uses `ComponentName.module.css`
- Design tokens from `index.css` `:root` variables via `var(--token-name)`
- No inline styles except for dynamic values (width%, transform)
- No global class names except utilities defined in index.css

### 5. Performance Patterns
- `loading="lazy"` on all non-hero images
- `loading="eager"` on first hero image
- `useCallback` for event handlers passed as props
- `useMemo` for expensive filter computations
- Adjacent lightbox images preloaded on index change

## Component Guidelines

- Components should do ONE thing well
- Props should be typed (at minimum, documented in JSDoc)
- Event handlers follow naming: `onActionName` (prop), `handleActionName` (local)
- IDs: required on all interactive elements for testing (`id="gallery-image-${id}"`)

## Anti-patterns to Avoid

- Importing static data in gallery/lightbox components (use prop drilling or context)
- Using index as key for dynamic lists with reordering
- Using `any` div click handlers (use `<button>`)
- Monolithic page components (> 150 lines of JSX)
