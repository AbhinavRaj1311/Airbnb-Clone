import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generatePdf() {
  const rootDir = path.resolve(__dirname, '..')
  const imgPath = path.join(rootDir, 'submission', 'architecture', 'architecture.png')
  const mdPath = path.join(rootDir, 'submission', 'architecture', 'architecture.md')
  const outPdfPath = path.join(rootDir, 'submission', 'architecture', 'architecture.pdf')

  const imgBase64 = fs.readFileSync(imgPath).toString('base64')
  const mdContent = fs.readFileSync(mdPath, 'utf8')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>StayGallery Production Architecture</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 30px;
      color: #222;
      line-height: 1.5;
    }
    h1 { font-size: 24px; color: #ff385c; margin-bottom: 8px; }
    h2 { font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 4px; margin-top: 24px; }
    h3 { font-size: 15px; margin-top: 16px; }
    .diagram-img {
      width: 100%;
      max-width: 1000px;
      border-radius: 8px;
      border: 1px solid #ddd;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      margin: 16px 0 24px 0;
    }
    pre {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 12px;
      font-size: 11px;
      font-family: monospace;
      overflow-x: auto;
    }
    ul { padding-left: 20px; }
    li { margin-bottom: 4px; font-size: 13px; }
    p { font-size: 13px; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <h1>StayGallery — Production Architecture Specification</h1>
  <p><strong>Scalable Cloud-Native Architecture for Vacation-Rental Marketplace</strong></p>
  
  <h2>1. System Architecture Diagram</h2>
  <img src="data:image/png;base64,${imgBase64}" class="diagram-img" alt="Architecture Diagram" />

  <div class="page-break"></div>

  <h2>2. Architectural Layers & Technology Stack</h2>
  
  <h3>2.1 Client Layer</h3>
  <ul>
    <li><strong>React 18 SPA (Vite):</strong> Fast client-side rendering with dynamic routing via React Router v6.</li>
    <li><strong>State Management:</strong> React Context API (AuthContext, WishlistContext) providing reactive authentication and persistence.</li>
    <li><strong>Styling:</strong> Scoped CSS Modules with custom design tokens for responsive, modular components.</li>
  </ul>

  <h3>2.2 CDN & Edge Tier</h3>
  <ul>
    <li><strong>Cloudflare / AWS CloudFront:</strong> Global Anycast Points of Presence delivering sub-30ms latency worldwide.</li>
    <li><strong>Asset Optimization:</strong> Automatic on-the-fly WebP and AVIF image compression.</li>
    <li><strong>Security:</strong> Distributed Denial-of-Service (DDoS) protection, Web Application Firewall (WAF), and SSL termination.</li>
  </ul>

  <h3>2.3 API Gateway & Load Balancing</h3>
  <ul>
    <li><strong>AWS Application Load Balancer / NGINX Plus:</strong> Intelligent path-based routing (/api/*), health check monitoring, and SSL offloading.</li>
    <li><strong>Rate Limiting:</strong> Tiered rate limiting protecting authentication and write endpoints.</li>
  </ul>

  <h3>2.4 Application Microservice Cluster</h3>
  <ul>
    <li><strong>Stateless Node.js + Express Services:</strong> Horizontally auto-scaled containers on AWS ECS / Kubernetes.</li>
    <li><strong>Authentication:</strong> Secure HTTP-only JWT cookies mitigating XSS vulnerabilities.</li>
    <li><strong>Asynchronous Workers:</strong> BullMQ with Redis for background jobs, email confirmations, and media pipelines.</li>
  </ul>

  <h3>2.5 Persistence & In-Memory Data</h3>
  <ul>
    <li><strong>MongoDB Atlas:</strong> Multi-AZ replica set with primary/secondary automatic failover and ACID transactions.</li>
    <li><strong>Redis Cluster:</strong> In-memory session store, query caching, and distributed locking (Redlock) preventing double bookings.</li>
    <li><strong>Elasticsearch:</strong> High-performance geospatial and full-text search engine for instant listing filtering.</li>
    <li><strong>AWS S3 / Cloudflare R2:</strong> Highly durable object storage for high-resolution property gallery media.</li>
  </ul>
</body>
</html>
  `

  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.pdf({
    path: outPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  })

  await browser.close()
  console.log('✅ Generated architecture.pdf successfully at:', outPdfPath)
}

generatePdf().catch((err) => {
  console.error('Error generating PDF:', err)
  process.exit(1)
})
