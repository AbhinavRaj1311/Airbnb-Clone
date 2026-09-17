/**
 * StayGallery Database Seed Script
 * Seeds the database with the showcase property data
 * 
 * Usage: npm run seed (from server directory)
 * 
 * Safe to run multiple times - uses upsert to avoid duplicates
 */

import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

import mongoose from 'mongoose'
import Property from './models/Property.js'
import { config } from './config/index.js'

const SEED_DATA = {
  id: 'staygallery-villa-001',
  title: 'Luxe Mountain Villa with Infinity Pool & Panoramic Views',
  location: 'Lake Tahoe, California, United States',
  country: 'United States',
  rating: 4.97,
  reviewCount: 128,
  isSuperhost: true,
  isGuestFavorite: true,
  guests: 8,
  bedrooms: 4,
  beds: 5,
  baths: 3,
  price: 485,
  currency: 'USD',
  cleaningFee: 120,
  serviceFee: 95,
  host: {
    name: 'Sarah',
    id: 'host-001',
    avatar: '/images/host/profile.jpg',
    isSuperhost: true,
    yearsHosting: 6,
    responseRate: 99,
    responseTime: 'within an hour',
    reviewCount: 284,
    rating: 4.97,
  },
  description: `Welcome to our stunning mountain villa perched above the crystal-clear waters of Lake Tahoe. This architectural masterpiece seamlessly blends indoor and outdoor living, offering breathtaking panoramic views from every room.

The main living area features soaring 20-foot ceilings, a wall of floor-to-ceiling windows, and a chef's kitchen that would make any culinary enthusiast swoon.

Perfect for families or groups seeking a premium retreat.`,
  amenities: [
    { id: 'wifi', label: 'Wifi', icon: 'Wifi', featured: true },
    { id: 'pool', label: 'Private pool', icon: 'Waves', featured: true },
    { id: 'kitchen', label: 'Kitchen', icon: 'UtensilsCrossed', featured: true },
    { id: 'washer', label: 'Washer', icon: 'WashingMachine', featured: true },
    { id: 'parking', label: 'Free parking on premises', icon: 'Car', featured: true },
  ],
  images: [
    {
      id: 'hero-main',
      src: '/images/hero/main.jpg',
      thumbnail: '/images/hero/main-thumb.jpg',
      alt: 'Spacious living area with stunning mountain views',
      room: 'Living room',
      category: 'Living room',
      order: 1,
      isHero: true,
    },
  ],
  reviews: [
    {
      id: 'review-1',
      author: 'Marcus',
      date: 'August 2024',
      rating: 5,
      text: 'Absolutely breathtaking property. The views are even more stunning in person.',
      location: 'Denver, Colorado',
    },
  ],
  reviewScores: {
    cleanliness: 4.9,
    accuracy: 4.9,
    checkin: 5.0,
    communication: 5.0,
    location: 4.8,
    value: 4.7,
  },
  coordinates: {
    lat: 38.9399,
    lng: -119.9772,
  },
  minNights: 3,
  maxNights: 30,
}

async function seed() {
  const mongoUri = config.mongoUri || process.env.MONGODB_URI

  if (!mongoUri) {
    console.error('❌ MONGODB_URI not set. Cannot seed database.')
    console.log('   To seed: set MONGODB_URI in .env and run again.')
    process.exit(1)
  }

  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('✅ Connected')

    console.log('🌱 Seeding property data...')
    const result = await Property.findOneAndUpdate(
      { id: SEED_DATA.id },
      SEED_DATA,
      { upsert: true, new: true, runValidators: true }
    )

    console.log(`✅ Property seeded: ${result.title}`)
    console.log(`   ID: ${result.id}`)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

seed()
