import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config/index.js'
import propertyRoutes from './routes/propertyRoutes.js'
import authRoutes from './routes/authRoutes.js'
import reservationRoutes from './routes/reservationRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: config.clientUrl,
  credentials: true, // Allow cookies
}))
app.use(express.json({ limit: '5mb' })) // Allow base64 avatar uploads
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Request Logger (development) ─────────────────────────────────────────────
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dataSource: config.useInMemory ? 'in-memory' : 'mongodb',
  })
})

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/properties', propertyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/reservations', reservationRoutes)

// ── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

export default app
