/**
 * In-memory fallback data for when MongoDB is unavailable
 * Mirrors the structure of the frontend propertyData.js
 */
export const IN_MEMORY_PROPERTY = {
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
  description: `Welcome to our stunning mountain villa perched above the crystal-clear waters of Lake Tahoe.

The main living area features soaring 20-foot ceilings, a wall of floor-to-ceiling windows, and a chef's kitchen.

Perfect for families or groups seeking a premium retreat.`,
  amenities: [
    { id: 'wifi', label: 'Wifi', icon: 'Wifi', featured: true },
    { id: 'pool', label: 'Private pool', icon: 'Waves', featured: true },
    { id: 'kitchen', label: 'Kitchen', icon: 'UtensilsCrossed', featured: true },
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
