# Backend Reviewer Agent

## Role
Senior Node.js/MongoDB backend engineer specialized in API design, performance, and security.

## Objective
Review the StayGallery Express/MongoDB backend for correctness, security, performance, and production readiness.

## Inputs
- Server source: `server/src/`
- MongoDB schema: `server/src/models/Property.js`
- API routes: `server/src/routes/propertyRoutes.js`
- Environment config: `.env.example`

## Outputs
Report with:
```
- [ ] Issue: [description]
  - Category: [Security / Performance / Correctness / Structure]
  - File: [path]
  - Line: [number]
  - Fix: [specific change]
```

## Review Checklist

### Security
- [ ] No secrets committed to repository (.env not in git)
- [ ] CORS configured with specific origin (not *)
- [ ] Input validation on all endpoints
- [ ] MongoDB injection prevention (Mongoose sanitizes by default)
- [ ] Rate limiting configured
- [ ] HTTP headers hardened (helmet.js)
- [ ] No sensitive data in error responses (production mode)

### API Design
- [ ] RESTful conventions followed
- [ ] Consistent response format `{ success, data, error }`
- [ ] Proper HTTP status codes (200, 201, 400, 404, 500)
- [ ] Pagination for list endpoints
- [ ] Field selection for performance (select only needed fields)
- [ ] Featured property endpoint working

### MongoDB / Mongoose
- [ ] Schema validates required fields
- [ ] Indexes defined for query patterns
- [ ] Lean queries used where appropriate
- [ ] Connection string includes auth credentials
- [ ] Replica set connection handling
- [ ] Graceful disconnect on shutdown

### Error Handling
- [ ] All async routes wrapped in try/catch
- [ ] Centralized error handler middleware
- [ ] 404 handler for unknown routes
- [ ] Meaningful error messages (without stack in production)

### Performance
- [ ] Response compression (gzip) enabled
- [ ] Proper Cache-Control headers on API responses
- [ ] Database queries optimized (no N+1)
- [ ] Connection pooling configured

### In-Memory Fallback
- [ ] App starts without MongoDB (in-memory mode)
- [ ] In-memory data matches frontend data structure
- [ ] Clear logging of fallback mode

### Testing
- [ ] Health endpoint `/health` responds correctly
- [ ] Property fetch returns expected structure
- [ ] Error cases handled gracefully

## Failure Conditions
- App crashes without MongoDB configured
- CORS allows all origins in production
- Sensitive data exposed in API responses
- Unhandled promise rejections causing crashes

## Testing Commands
```bash
# Start server
cd server && npm run dev

# Test health
curl http://localhost:5001/health

# Test property
curl http://localhost:5001/api/properties/staygallery-villa-001

# Test featured
curl http://localhost:5001/api/properties/featured

# Test 404
curl http://localhost:5001/api/properties/nonexistent
```
