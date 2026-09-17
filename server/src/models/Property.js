import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  src: { type: String, required: true },
  thumbnail: String,
  alt: { type: String, required: true },
  room: String,
  category: String,
  order: { type: Number, default: 0 },
  isHero: { type: Boolean, default: false },
})

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: String,
  avatar: String,
  isSuperhost: { type: Boolean, default: false },
  yearsHosting: Number,
  responseRate: Number,
  responseTime: String,
  reviewCount: Number,
  rating: Number,
})

const amenitySchema = new mongoose.Schema({
  id: String,
  label: String,
  icon: String,
  featured: { type: Boolean, default: false },
})

const reviewSchema = new mongoose.Schema({
  id: String,
  author: String,
  date: String,
  rating: Number,
  text: String,
  location: String,
})

const propertySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    country: String,
    description: String,
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isSuperhost: { type: Boolean, default: false },
    isGuestFavorite: { type: Boolean, default: false },
    guests: Number,
    bedrooms: Number,
    beds: Number,
    baths: Number,
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    cleaningFee: Number,
    serviceFee: Number,
    host: hostSchema,
    amenities: [amenitySchema],
    images: [imageSchema],
    reviews: [reviewSchema],
    reviewScores: {
      cleanliness: Number,
      accuracy: Number,
      checkin: Number,
      communication: Number,
      location: Number,
      value: Number,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    minNights: { type: Number, default: 1 },
    maxNights: { type: Number, default: 30 },
  },
  {
    timestamps: true,
  }
)

const Property = mongoose.model('Property', propertySchema)

export default Property
