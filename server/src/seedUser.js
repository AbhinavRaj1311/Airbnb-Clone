/**
 * StayGallery — Auth Seed Script
 * Creates a demo user for development/testing ONLY.
 *
 * Usage: node src/seedUser.js (from server directory)
 *
 * ⚠️  DO NOT use these credentials in production.
 */
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from './models/User.js'
import { config } from './config/index.js'

const DEMO_USER = {
  name: 'Abhinav Raj',
  email: 'demo@staygallery.local',
  password: 'Demo@12345',
}

async function seedUser() {
  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(config.mongoUri)
    console.log('✅ Connected')

    const existing = await User.findOne({ email: DEMO_USER.email })
    if (existing) {
      console.log(`ℹ️  Demo user already exists: ${DEMO_USER.email}`)
      console.log('   Skipping creation.')
    } else {
      await User.create(DEMO_USER)
      console.log(`✅ Demo user created:`)
      console.log(`   Name:     ${DEMO_USER.name}`)
      console.log(`   Email:    ${DEMO_USER.email}`)
      console.log(`   Password: ${DEMO_USER.password}`)
      console.log(`   ⚠️  FOR DEVELOPMENT USE ONLY`)
    }
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected')
  }
}

seedUser()
