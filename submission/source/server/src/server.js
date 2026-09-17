import mongoose from 'mongoose'
import app from './app.js'
import { config } from './config/index.js'

async function startServer() {
  // ── Connect to MongoDB ──────────────────────────────────────────────────────
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`✅ Connected to MongoDB: ${config.mongoUri}`)
    config.useInMemory = false
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed. Falling back to in-memory data.')
    console.warn(`   Error: ${err.message}`)
    console.warn('   Note: Authentication (login/register) requires MongoDB.')
    config.useInMemory = true
  }

  // ── Start Express ──────────────────────────────────────────────────────────
  app.listen(config.port, () => {
    console.log(`\n🚀 StayGallery Server running on http://localhost:${config.port}`)
    console.log(`   Environment: ${config.nodeEnv}`)
    console.log(`   Data source: ${config.useInMemory ? 'in-memory (auth disabled)' : 'mongodb'}`)
    console.log(`   Client URL:  ${config.clientUrl}\n`)
  })
}

// ── Handle unhandled rejections ────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason)
  process.exit(1)
})

startServer()
