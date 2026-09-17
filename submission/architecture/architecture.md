# StayGallery — Production Architecture Specification

## 1. Executive Summary

StayGallery is designed as a cloud-native, horizontally scalable vacation-rental marketplace capable of supporting millions of daily active users, high-concurrency search and reservation transactions, and rapid global image delivery.

---

## 2. High-Level Architecture Diagram

```
                               ┌──────────────────────────────────────────────┐
                               │                 CLIENT TIER                  │
                               │  Desktop Web · Mobile Browser · Native Apps  │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTPS / TLS 1.3
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │             CDN & EDGE LAYER                 │
                               │   Cloudflare / AWS CloudFront / Fastly       │
                               │  • Global Anycast PoPs (<30ms latency)       │
                               │  • Static Asset Caching (JS, CSS, HTML)      │
                               │  • Image Optimization (WebP/AVIF, on-the-fly)│
                               │  • DDoS Mitigation, WAF & Bot Protection     │
                               │  • Edge Rate Limiting & SSL Termination      │
                               └───────┬───────────────────────────────┬──────┘
                                       │ Dynamic API Requests          │ Static Assets / Images
                                       ▼                               ▼
               ┌───────────────────────────────────────────────┐ ┌───────────────────────────┐
               │         API GATEWAY / LOAD BALANCER           │ │      OBJECT STORAGE       │
               │         AWS ALB / NGINX Plus / Kong           │ │   AWS S3 / Cloudflare R2  │
               │  • JWT Verification & Rate Limiting           │ │  • Property Master Photos │
               │  • Path-Based Routing (/api/*)                │ │  • Host Avatars (Base64)  │
               │  • Health Checking & SSL Offloading           │ │  • Thumbnails & Variants  │
               │  • Round-Robin Weighted Distribution          │ │  • 99.999999999% (11 9s)  │
               └───────────────────────┬───────────────────────┘ └───────────────────────────┘
                                       │
                                       ▼
               ┌────────────────────────────────────────────────────────────────────────┐
               │                      APPLICATION SERVICE CLUSTER                       │
               │              Horizontally Scaled Node.js + Express Microservices       │
               │                                                                        │
               │   ┌────────────────────────┐         ┌──────────────────────────────┐ │
               │   │  Auth & User Service   │         │  Property & Listing Service  │ │
               │   │  • Registration/Login  │         │  • Dynamic Filtering         │ │
               │   │  • JWT Cookie Issuance │         │  • Multi-photo Galleries     │ │
               │   │  • Profile Management  │         │  • Amenities & Reviews       │ │
               │   └────────────────────────┘         └──────────────────────────────┘ │
               │   ┌────────────────────────┐         ┌──────────────────────────────┐ │
               │   │  Reservation Service   │         │  Async Background Workers    │ │
               │   │  • Availability Check  │         │  • BullMQ Task Processing    │ │
               │   │  • Overlap Prevention  │         │  • Email/SMS Confirmations   │ │
               │   │  • Booking Lifecycle   │         │  • Image Resizing Pipelines  │ │
               │   └────────────────────────┘         └──────────────────────────────┘ │
               └───────────┬───────────────────────┬───────────────────────┬────────────┘
                           │                       │                       │
                           ▼                       ▼                       ▼
            ┌─────────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
            │     DATABASE LAYER      │ │    CACHING LAYER     │ │     SEARCH ENGINE    │
            │     MongoDB Replica     │ │     Redis Cluster    │ │     Elasticsearch    │
            │  • Primary / Secondaries│ │  • Session Store     │ │  • Geospatial Queries│
            │  • Compound Indexes     │ │  • Listing Cache     │ │  • Full-Text Search  │
            │  • ACID Multi-Doc Trans │ │  • Rate Limiting     │ │  • Autocomplete      │
            │  • Automatic Failover   │ │  • Availability Locks│ │  • Instant Filters   │
            └─────────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

---

## 3. Layer-by-Layer Specifications

### 3.1. Client Layer
- **Framework:** React 18 SPA built with Vite for lightning-fast bundling and HMR.
- **Routing:** React Router v6 with dynamic parameterized routes (`/listing/:id`, `/trips`, `/profile`).
- **State Management:** React Context API (`AuthContext`, `WishlistContext`) providing clean separation of concerns and universal access across the component tree.
- **Styling:** CSS Modules with BEM-inspired design tokens for zero style collisions, native responsive grid layouts, and hardware-accelerated animations.

### 3.2. CDN & Edge Infrastructure
- **Provider:** Cloudflare / AWS CloudFront.
- **Edge Functions:** Automatically rewrites image requests to serve next-gen formats (`.avif`, `.webp`) matched to client `Accept` headers.
- **Caching Strategy:**
  - HTML: `Cache-Control: public, no-cache, must-revalidate`
  - Versioned JS/CSS: `Cache-Control: public, max-age=31536000, immutable`
  - Images: `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`

### 3.3. API Gateway & Load Balancing
- **Technology:** AWS Application Load Balancer (ALB) or NGINX Plus.
- **Capabilities:**
  - TLS 1.3 termination with modern cipher suites.
  - Rate limiting (e.g., max 100 requests per minute per IP for auth endpoints, 1,000 for read endpoints).
  - Health checks against `/health` with automatic instance isolation on failure.

### 3.4. Backend Application Cluster
- **Runtime:** Node.js (v20+ LTS) with Express.
- **Concurrency & Scaling:** Stateless containers orchestrated via Kubernetes (EKS) or AWS ECS with Horizontal Pod Autoscalers (HPA) scaling between 3 and 50 instances based on CPU and request latency thresholds.
- **Security Middleware:**
  - Helmet for security response headers.
  - Cookie-parser with `httpOnly: true`, `sameSite: 'lax'`, and `secure: true` in production to eliminate XSS token theft.
  - Strict input validation schemas preventing injection attacks.

### 3.5. Persistence & Data Storage
1. **Primary Database — MongoDB Atlas:**
   - Multi-AZ Replica Set (1 Primary, 2 Secondaries) with automated failover (<10s).
   - Document models for `User`, `Property`, and `Reservation`.
   - Compound indexes: `{ propertyId: 1, checkIn: 1, checkOut: 1, status: 1 }` for high-speed overlap detection.
2. **In-Memory Cache — Redis Cluster:**
   - 3 Master nodes + 3 Replica nodes.
   - Caches hot property records with a 15-minute TTL.
   - Distributed locking using Redlock algorithm during reservation confirmation to prevent race conditions.
3. **Search Engine — Elasticsearch / Meilisearch:**
   - Indexes property titles, descriptions, locations, and amenities.
   - Geospatial distance search (`geo_distance` filter).
4. **Media Storage — AWS S3 / Cloudflare R2:**
   - Multi-part upload support for property photo galleries.
   - S3 bucket versioning and cross-region replication for 99.999999999% durability.

### 3.6. Background Processing & Jobs
- **Framework:** BullMQ backed by Redis.
- **Asynchronous Workflows:**
  - Transactional email dispatch (booking confirmation, cancellation receipts).
  - Background image transcoding and thumbnail generation.
  - Daily cleanup jobs for abandoned pending reservations.

### 3.7. Observability, Monitoring & Logging
- **Metrics:** Prometheus collecting container, Node.js runtime, and HTTP request metrics; visualized in Grafana dashboards.
- **Distributed Tracing:** OpenTelemetry instrumentation sending spans to AWS X-Ray or Jaeger.
- **Centralized Logging:** Winston logger outputting structured JSON to Datadog or ELK stack.
- **Alerting:** PagerDuty integration triggered on HTTP 5xx error spikes (>1%) or database latency degradation (>150ms).

---

## 4. Reservation Flow Architecture & Data Consistency

```
User clicks [Reserve]
         │
         ▼
Validate checkIn, checkOut, guests on Frontend
         │
   Is Authenticated?
   ├── NO  ──► Open Auth Modal ──► Login/Register ──► Return to Confirmation Modal
   └── YES ──► Open Reservation Confirmation Modal
                     │
         User clicks [Confirm Reservation]
                     │
                     ▼
         POST /api/reservations
                     │
         ┌───────────┴───────────────────────────────┐
         │ Node.js Server:                           │
         │ 1. Verify JWT HTTP-only cookie             │
         │ 2. Validate date logic (checkOut > checkIn)│
         │ 3. Check for overlapping confirmed stays   │
         │    in MongoDB                             │
         │    [Overlap Found? ──► Return 409 Conflict]│
         │ 4. Insert Reservation document in MongoDB │
         └───────────┬───────────────────────────────┘
                     │
         Status 201 Created
                     │
                     ▼
         Display Success View with Reservation ID
         Offer instant navigation to /trips
```
