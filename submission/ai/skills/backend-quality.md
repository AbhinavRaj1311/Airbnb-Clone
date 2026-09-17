# Backend Quality Skill

## Purpose

Enforce production-quality standards for the StayGallery Node.js/Express/MongoDB backend, ensuring correctness, security, observability, and graceful degradation.

## API Design Standards

### RESTful Conventions
```
GET    /api/properties           → list all (abbreviated)
GET    /api/properties/:id       → single property (full)
GET    /api/properties?category= → filtered list
GET    /api/properties?location= → location search
GET    /health                   → health check
```

### Response Envelope
Every API response MUST use this shape:
```json
{
  "success": true,
  "data": { ... },
  "source": "mongodb | in-memory"
}
```
Error responses:
```json
{
  "success": false,
  "error": "Human-readable message",
  "stack": "..." // only in development
}
```

## Graceful Degradation Pattern

The server must work without MongoDB:
1. On startup, detect `MONGODB_URI` env var
2. If missing → set `config.useInMemory = true`
3. If connect fails → catch error, set `config.useInMemory = true`, log warning
4. All controllers check `config.useInMemory` before querying Mongoose

```js
if (config.useInMemory) {
  return res.json({ success: true, data: IN_MEMORY_DATA, source: 'in-memory' })
}
// MongoDB query follows
```

## Middleware Requirements

| Middleware | Required | Purpose |
|---|---|---|
| cors | ✅ | Restrict to CLIENT_URL origin |
| express.json | ✅ | Parse JSON bodies |
| Request logger | Dev only | Log method + path |
| errorHandler | ✅ | Catch all thrown errors |
| notFoundHandler | ✅ | 404 for unknown routes |

## Security Checklist

- [ ] CORS locked to `CLIENT_URL` (not `*`)
- [ ] No secrets in source code
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` committed with placeholder values
- [ ] Input validation on query params (sanitize location/category)
- [ ] No stack traces in production responses

## Mongoose Model Requirements

Property schema must include:
- `id` (String, unique, required) — for URL routing
- All fields matching `propertiesData.js` structure
- `images` as array of subdocuments with `src`, `alt`, `room`, `order`
- `amenities` as array of Strings or subdocuments
- Timestamps (`createdAt`, `updatedAt`)

## Failure Conditions

- Server crashes if MongoDB is unavailable (must not crash — must fall back)
- API returns HTML error page instead of JSON (must always return JSON)
- CORS blocks frontend during development
- Missing `.env.example` file
- Seed script fails silently (must log clear success/failure)
