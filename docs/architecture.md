# StayGallery — Production Architecture

## Overview

This document describes the production-scale architecture for StayGallery, a vacation-rental marketplace. The architecture follows cloud-native best practices with horizontal scaling, CDN delivery, and observability built-in.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USERS / CLIENTS                                        │
│              Mobile App · Desktop Browser · SEO Crawlers                         │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │ HTTPS
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       CDN / EDGE LAYER                                           │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  Cloudflare / AWS CloudFront / Vercel Edge Network                       │    │
│  │                                                                          │    │
│  │  • Global PoPs (Points of Presence) — <50ms latency worldwide           │    │
│  │  • Static asset caching (JS, CSS, fonts, images)                        │    │
│  │  • Image optimization (WebP/AVIF conversion, resizing)                  │    │
│  │  • DDoS protection & rate limiting                                      │    │
│  │  • SSL/TLS termination                                                  │    │
│  │  • Brotli/gzip compression                                              │    │
│  │  • Cache-Control headers for immutable assets                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────────────────┬───────────────────┘
               │ Dynamic requests                             │ Static/cached
               ▼                                             ▼
┌──────────────────────────────┐              ┌───────────────────────────────────┐
│   REACT FRONTEND (Vite)       │              │   OBJECT STORAGE                  │
│                               │              │                                   │
│  • Served via CDN (Vercel/    │              │  AWS S3 / Cloudflare R2           │
│    Netlify/CloudFront)        │              │                                   │
│  • React 18 + Vite            │              │  • Property images (JPEG/WebP)    │
│  • Code splitting             │              │  • Thumbnails (auto-generated)    │
│  • Lazy loading               │              │  • Host avatars                   │
│  • Service Worker (PWA)       │              │  • Video tours (future)           │
│  • SWR / React Query          │              │  • 99.999% durability             │
│    for client-side caching    │              │  • Versioned uploads              │
│                               │◄────────────►│  • Lifecycle policies             │
│  Routing: React Router        │  image URLs  │  • Cross-region replication       │
│  State: React Context/Zustand │              └───────────────────────────────────┘
└──────────────┬────────────────┘                             ▲
               │ API calls /api/*                             │
               ▼                                             │ uploads
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY / LOAD BALANCER                                │
│                                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────────┐   │
│  │  AWS API Gateway / NGINX / Kong                                            │   │
│  │                                                                            │   │
│  │  • Route-level authentication & authorization (JWT/API Keys)              │   │
│  │  • Rate limiting per IP / user tier                                       │   │
│  │  • Request validation (schema validation)                                 │   │
│  │  • SSL offloading                                                         │   │
│  │  • Round-robin load balancing across Node.js instances                    │   │
│  │  • Health checks & circuit breaking                                       │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬──────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
      ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
      │ Node.js / Express│  │ Node.js / Express│  │ Node.js / Express│
      │   Instance 1     │  │   Instance 2     │  │   Instance N     │
      │                 │  │                 │  │                 │
      │ • Properties API│  │ • Properties API│  │ • Properties API│
      │ • Search API    │  │ • Search API    │  │ • Search API    │
      │ • Bookings API  │  │ • Bookings API  │  │ • Bookings API  │
      │ • Users API     │  │ • Users API     │  │ • Users API     │
      │ • Images API    │  │ • Images API    │  │ • Images API    │
      └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐  ┌─────────────────────────┐  ┌─────────────────┐
│   MONGODB        │  │   ELASTICSEARCH          │  │   REDIS CACHE   │
│   (Primary DB)   │  │   (Search Service)       │  │                 │
│                 │  │                         │  │ • Session cache │
│ MongoDB Atlas   │  │ • Full-text search      │  │ • API response  │
│ (M30+)          │  │ • Geospatial queries    │  │   cache (TTL)   │
│                 │  │ • Faceted filtering     │  │ • Rate limiting │
│ Replica Set:    │  │ • Fuzzy matching        │  │   counters      │
│  Primary        │  │ • Autocomplete          │  │ • Pub/Sub for   │
│  Secondary ×2   │  │ • Aggregations          │  │   real-time     │
│  Arbiter        │  │ • Synonym handling      │  │   availability  │
│                 │  │                         │  │   updates       │
│ • Auto-sharding │  │ Sync from MongoDB via   │  │                 │
│ • Auto-backup   │  │ Change Streams          │  │ Redis Cluster:  │
│ • Atlas Search  │  │                         │  │  3 nodes        │
│   (optional)    │  └─────────────────────────┘  │  auto-failover  │
└─────────────────┘                               └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      BACKGROUND JOBS / WORKER SERVICES                           │
│                                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────────┐ │
│  │  Image Processing   │  │  Email / Notif.    │  │  Analytics Pipeline        │ │
│  │                    │  │                    │  │                            │ │
│  │  • Sharp (resize)  │  │  • Booking confirm │  │  • Event tracking          │ │
│  │  • WebP conversion │  │  • Check-in remind │  │  • User behavior           │ │
│  │  • Thumbnail gen   │  │  • Review requests │  │  • Search analytics        │ │
│  │  • EXIF stripping  │  │  • SendGrid / SES  │  │  • Revenue metrics         │ │
│  │  Bull Queue        │  │  Bull Queue        │  │  Apache Kafka + ClickHouse │ │
│  └────────────────────┘  └────────────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      OBSERVABILITY & MONITORING                                   │
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │  Datadog / New   │  │  Sentry (Error   │  │  Prometheus + Grafana        │  │
│  │  Relic (APM)     │  │  Tracking)       │  │  (Infrastructure Metrics)    │  │
│  │                  │  │                  │  │                              │  │
│  │  • Traces        │  │  • JS errors     │  │  • CPU / Memory / Disk       │  │
│  │  • Logs          │  │  • API errors    │  │  • Request rates             │  │
│  │  • Alerts        │  │  • Source maps   │  │  • Error rates               │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT & CI/CD                                           │
│                                                                                  │
│  GitHub Actions / CircleCI                                                       │
│                                                                                  │
│  1. PR → Lint + Unit Tests + Integration Tests                                  │
│  2. Merge → Build → E2E Tests (Playwright)                                      │
│  3. Deploy to Staging → Visual regression tests                                 │
│  4. Manual approve → Deploy to Production (Blue/Green)                          │
│  5. Health checks → Rollback if failure                                         │
│                                                                                  │
│  Infrastructure as Code: Terraform / AWS CDK                                    │
│  Container Orchestration: Kubernetes (EKS) or Docker Swarm                      │
│  Registry: AWS ECR / GitHub Container Registry                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Horizontal Scaling Strategy

### Frontend (Static)
- Hosted on CDN with infinite scale
- Code splitting ensures small initial bundles
- Service Worker for offline-first experience

### API Layer (Node.js/Express)
- Stateless instances behind load balancer
- Horizontal Pod Autoscaler (HPA) in Kubernetes
- Scale based on CPU/memory/request rate
- Target: <100ms p99 API latency

### Database (MongoDB)
- **Sharding**: Shard by `propertyId` or `geoHash` for location-based queries
- **Replica Set**: 1 Primary + 2 Secondaries for read scaling
- **Atlas Search**: Built-in full-text search (alternative to Elasticsearch for simpler setup)
- **Indexes**: Compound indexes on `(location, price, rating)` for search performance

### Cache (Redis)
- Cache property listings for 5 minutes (TTL)
- Cache search results for 30 seconds
- Cache-aside pattern: miss → DB → cache
- Redis Cluster for high availability

## Image Optimization Pipeline

```
Upload → S3 Raw Bucket
        → Lambda trigger
        → Sharp resize (multiple sizes: 400, 800, 1200, 2400px)
        → WebP conversion
        → S3 Optimized Bucket
        → CloudFront CDN
        → Served with srcset for responsive delivery
```

## Security

- All connections over HTTPS/TLS 1.3
- JWT tokens with short expiry (15 min) + refresh tokens
- MongoDB connection string never exposed to frontend
- S3 bucket private — served only through signed CloudFront URLs for UGC
- WAF rules for SQLi, XSS, rate limiting
- CORS configured per environment
- CSP headers on all responses

## Cost Optimization

- S3 lifecycle: compress + Glacier after 90 days
- Reserved instances for predictable baseline load
- Spot instances for background job workers
- CloudFront caching reduces origin load by ~80%
- Redis TTL prevents unbounded memory growth

## Data Flow for Property Listing Page

```
User → CDN → React App (cached)
User → CDN → /api/properties/featured → Node.js → Redis (cache hit)
                                                 → MongoDB (cache miss)
User → CDN → /images/* → CloudFront → S3 (CDN cached images)
```
