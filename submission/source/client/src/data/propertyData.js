/**
 * StayGallery - Property Data
 * Source of truth for property listing and gallery images
 * All views (listing page, photo tour, lightbox) consume this data
 */

export const GALLERY_IMAGES = [
  // ── Hero / first 5 images shown in the grid ──────────────────────────────
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
  {
    id: 'hero-2',
    src: '/images/hero/img2.jpg',
    thumbnail: '/images/hero/img2-thumb.jpg',
    alt: 'Luxurious master bedroom with king-size bed',
    room: 'Bedroom',
    category: 'Bedroom',
    order: 2,
    isHero: true,
  },
  {
    id: 'hero-3',
    src: '/images/hero/img3.jpg',
    thumbnail: '/images/hero/img3-thumb.jpg',
    alt: 'Elegant bathroom with soaking tub and rain shower',
    room: 'Bathroom',
    category: 'Bathroom',
    order: 3,
    isHero: true,
  },
  {
    id: 'hero-4',
    src: '/images/hero/img4.jpg',
    thumbnail: '/images/hero/img4-thumb.jpg',
    alt: 'Fully-equipped gourmet kitchen',
    room: 'Kitchen and dining',
    category: 'Kitchen',
    order: 4,
    isHero: true,
  },
  {
    id: 'hero-5',
    src: '/images/hero/img5.jpg',
    thumbnail: '/images/hero/img5-thumb.jpg',
    alt: 'Stunning exterior with private infinity pool',
    room: 'Outdoor',
    category: 'Exterior',
    order: 5,
    isHero: true,
  },

  // ── Living room ──────────────────────────────────────────────────────────
  {
    id: 'living-1',
    src: '/images/gallery/living-1.jpg',
    thumbnail: '/images/gallery/living-1-thumb.jpg',
    alt: 'Open-plan living room with designer sofa',
    room: 'Living room',
    category: 'Living room',
    order: 6,
  },
  {
    id: 'living-2',
    src: '/images/gallery/living-2.jpg',
    thumbnail: '/images/gallery/living-2-thumb.jpg',
    alt: 'Elegant living area with fireplace and high ceilings',
    room: 'Living room',
    category: 'Living room',
    order: 7,
  },
  {
    id: 'living-3',
    src: '/images/gallery/living-3.jpg',
    thumbnail: '/images/gallery/living-3-thumb.jpg',
    alt: 'Bright living room with floor-to-ceiling windows',
    room: 'Living room',
    category: 'Living room',
    order: 8,
  },

  // ── Bedroom ──────────────────────────────────────────────────────────────
  {
    id: 'bedroom-1',
    src: '/images/gallery/bedroom-1.jpg',
    thumbnail: '/images/gallery/bedroom-1-thumb.jpg',
    alt: 'Master bedroom with panoramic mountain views',
    room: 'Bedroom',
    category: 'Bedroom',
    order: 9,
  },
  {
    id: 'bedroom-2',
    src: '/images/gallery/bedroom-2.jpg',
    thumbnail: '/images/gallery/bedroom-2-thumb.jpg',
    alt: 'Guest bedroom with comfortable twin beds',
    room: 'Bedroom',
    category: 'Bedroom',
    order: 10,
  },
  {
    id: 'bedroom-3',
    src: '/images/gallery/bedroom-3.jpg',
    thumbnail: '/images/gallery/bedroom-3-thumb.jpg',
    alt: 'Cozy third bedroom with natural wood accents',
    room: 'Bedroom',
    category: 'Bedroom',
    order: 11,
  },

  // ── Kitchen & Dining ─────────────────────────────────────────────────────
  {
    id: 'kitchen-1',
    src: '/images/gallery/kitchen-1.jpg',
    thumbnail: '/images/gallery/kitchen-1-thumb.jpg',
    alt: 'Modern open kitchen with marble island',
    room: 'Kitchen and dining',
    category: 'Kitchen',
    order: 12,
  },
  {
    id: 'kitchen-2',
    src: '/images/gallery/kitchen-2.jpg',
    thumbnail: '/images/gallery/kitchen-2-thumb.jpg',
    alt: 'Dining area with natural light and garden views',
    room: 'Kitchen and dining',
    category: 'Kitchen',
    order: 13,
  },

  // ── Bathroom ─────────────────────────────────────────────────────────────
  {
    id: 'bathroom-1',
    src: '/images/gallery/bathroom-1.jpg',
    thumbnail: '/images/gallery/bathroom-1-thumb.jpg',
    alt: 'Spa-inspired bathroom with freestanding tub',
    room: 'Bathroom',
    category: 'Bathroom',
    order: 14,
  },
  {
    id: 'bathroom-2',
    src: '/images/gallery/bathroom-2.jpg',
    thumbnail: '/images/gallery/bathroom-2-thumb.jpg',
    alt: 'Ensuite bathroom with marble and gold finishes',
    room: 'Bathroom',
    category: 'Bathroom',
    order: 15,
  },

  // ── Outdoor / Exterior ───────────────────────────────────────────────────
  {
    id: 'exterior-1',
    src: '/images/gallery/exterior-1.jpg',
    thumbnail: '/images/gallery/exterior-1-thumb.jpg',
    alt: 'Private infinity pool overlooking the valley',
    room: 'Outdoor',
    category: 'Exterior',
    order: 16,
  },
  {
    id: 'exterior-2',
    src: '/images/gallery/exterior-2.jpg',
    thumbnail: '/images/gallery/exterior-2-thumb.jpg',
    alt: 'Spacious terrace with outdoor dining and mountain backdrop',
    room: 'Outdoor',
    category: 'Exterior',
    order: 17,
  },
  {
    id: 'exterior-3',
    src: '/images/gallery/exterior-3.jpg',
    thumbnail: '/images/gallery/exterior-3-thumb.jpg',
    alt: 'Lush garden with landscaping and pathway',
    room: 'Outdoor',
    category: 'Exterior',
    order: 18,
  },

  // ── Workspace ────────────────────────────────────────────────────────────
  {
    id: 'workspace-1',
    src: '/images/gallery/workspace-1.jpg',
    thumbnail: '/images/gallery/workspace-1-thumb.jpg',
    alt: 'Dedicated home office with high-speed WiFi',
    room: 'Workspace',
    category: 'Workspace',
    order: 19,
  },
];

/**
 * Returns gallery images sorted by order
 */
export const getSortedGallery = () =>
  [...GALLERY_IMAGES].sort((a, b) => a.order - b.order);

/**
 * Returns only the first 5 hero images for the main listing grid
 */
export const getHeroImages = () =>
  GALLERY_IMAGES.filter((img) => img.isHero).sort((a, b) => a.order - b.order);

/**
 * Returns images grouped by room/category for photo tour
 */
export const getPhotoTourSections = () => {
  const sorted = getSortedGallery();
  const sections = {};

  sorted.forEach((img) => {
    if (!sections[img.room]) {
      sections[img.room] = { room: img.room, images: [] };
    }
    sections[img.room].images.push(img);
  });

  // Desired room order for Photo Tour
  const roomOrder = [
    'Living room',
    'Bedroom',
    'Kitchen and dining',
    'Bathroom',
    'Outdoor',
    'Workspace',
  ];

  return roomOrder
    .filter((room) => sections[room])
    .map((room) => sections[room]);
};

/**
 * Returns index of an image in the sorted gallery
 */
export const getImageIndex = (imageId) => {
  const sorted = getSortedGallery();
  return sorted.findIndex((img) => img.id === imageId);
};

// ── Property Listing Data ─────────────────────────────────────────────────

export const PROPERTY_DATA = {
  id: 'staygallery-villa-001',
  title: 'Luxe Mountain Villa with Infinity Pool & Panoramic Views',
  location: 'Lake Tahoe, California, United States',
  country: 'United States',
  rating: 4.97,
  reviewCount: 128,
  isSuperhost: true,
  isGuestFavorite: true,

  // Quick facts
  guests: 8,
  bedrooms: 4,
  beds: 5,
  baths: 3,

  // Pricing
  price: 485,
  currency: 'USD',
  cleaningFee: 120,
  serviceFee: 95,
  totalNights: 5,

  // Host info
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

  // Description
  description: `Welcome to our stunning mountain villa perched above the crystal-clear waters of Lake Tahoe. This architectural masterpiece seamlessly blends indoor and outdoor living, offering breathtaking panoramic views from every room.

The main living area features soaring 20-foot ceilings, a wall of floor-to-ceiling windows, and a chef's kitchen that would make any culinary enthusiast swoon. Step outside to your private infinity pool that appears to merge with the lake below — pure magic at sunset.

Perfect for families or groups seeking a premium retreat. We're surrounded by world-class skiing in winter and incredible hiking and water sports in summer. The villa is equipped with everything you need for an unforgettable stay.`,

  // What this place offers (amenities)
  amenities: [
    { id: 'wifi', label: 'Wifi', icon: 'Wifi', featured: true },
    { id: 'pool', label: 'Private pool', icon: 'Waves', featured: true },
    { id: 'kitchen', label: 'Kitchen', icon: 'UtensilsCrossed', featured: true },
    { id: 'washer', label: 'Washer', icon: 'WashingMachine', featured: true },
    { id: 'dryer', label: 'Dryer', icon: 'Wind', featured: true },
    { id: 'ac', label: 'Air conditioning', icon: 'Wind', featured: false },
    { id: 'heating', label: 'Central heating', icon: 'Thermometer', featured: false },
    { id: 'dedicated-workspace', label: 'Dedicated workspace', icon: 'Monitor', featured: true },
    { id: 'tv', label: 'HDTV with Netflix', icon: 'Tv', featured: false },
    { id: 'parking', label: 'Free parking on premises', icon: 'Car', featured: true },
    { id: 'ev-charger', label: 'EV charger', icon: 'Zap', featured: false },
    { id: 'outdoor-dining', label: 'Outdoor dining area', icon: 'TreePine', featured: false },
    { id: 'bbq', label: 'BBQ grill', icon: 'Flame', featured: false },
    { id: 'fire-pit', label: 'Fire pit', icon: 'Flame', featured: false },
    { id: 'lake-access', label: 'Lake access', icon: 'Anchor', featured: false },
    { id: 'kayaks', label: 'Kayaks & paddleboards', icon: 'Ship', featured: false },
    { id: 'ski-storage', label: 'Ski-in/ski-out', icon: 'Mountain', featured: false },
    { id: 'sound-system', label: 'Premium sound system', icon: 'Music', featured: false },
    { id: 'gym', label: 'Gym / exercise equipment', icon: 'Dumbbell', featured: false },
    { id: 'first-aid', label: 'First aid kit', icon: 'Heart', featured: false },
  ],

  // Highlights (shown in info section)
  highlights: [
    {
      icon: 'Mountain',
      title: 'Ski-in/ski-out',
      description: 'Hit the slopes right from the villa grounds.',
    },
    {
      icon: 'Star',
      title: 'Guest favorite',
      description: 'One of the most loved homes on StayGallery based on ratings and reviews.',
    },
    {
      icon: 'Award',
      title: 'Superhost',
      description: 'Sarah is a Superhost with 6 years of exceptional hosting.',
    },
  ],

  // House rules
  houseRules: [
    'Check-in: 3:00 PM – 10:00 PM',
    'Checkout: 11:00 AM',
    'Maximum 8 guests',
    'No pets',
    'No smoking',
    'No parties or events',
    'Quiet hours: 10:00 PM – 8:00 AM',
  ],

  // Reviews
  reviews: [
    {
      id: 'review-1',
      author: 'Marcus',
      avatar: null,
      date: 'August 2024',
      rating: 5,
      text: "Absolutely breathtaking property. The views are even more stunning in person. We spent most evenings by the infinity pool watching the sunset. Sarah was an incredible host — she left us a welcome basket and was available for any questions. We'll definitely be back!",
      location: 'Denver, Colorado',
    },
    {
      id: 'review-2',
      author: 'Jennifer',
      avatar: null,
      date: 'July 2024',
      rating: 5,
      text: 'The villa exceeded all our expectations. The kitchen is a dream — we cooked family dinners every night. The master suite view is something out of a magazine. Sarah checked in just enough to make sure we had everything we needed without feeling intrusive.',
      location: 'San Francisco, California',
    },
    {
      id: 'review-3',
      author: 'Priya & Raj',
      avatar: null,
      date: 'June 2024',
      rating: 5,
      text: 'We celebrated our anniversary here and it was pure perfection. The attention to detail in this home is remarkable. The infinity pool at sunset is something we will never forget. Highly recommend to anyone looking for a truly special escape.',
      location: 'New York, New York',
    },
    {
      id: 'review-4',
      author: 'Thomas',
      avatar: null,
      date: 'September 2024',
      rating: 5,
      text: "Five stars don't do this place justice. We came for fall foliage and the views were absolutely incredible. The property is immaculate, well-stocked, and Sarah communicates beautifully. Booking again for the winter ski trip!",
      location: 'Chicago, Illinois',
    },
    {
      id: 'review-5',
      author: 'Amelia',
      avatar: null,
      date: 'May 2024',
      rating: 5,
      text: 'Wonderful family getaway! The kids loved the pool and the adults loved the views. The workspace is excellent if you need to catch up on a bit of work. Everything was clean, well-maintained, and luxurious. Sarah is a fantastic host.',
      location: 'Austin, Texas',
    },
    {
      id: 'review-6',
      author: 'David & Claire',
      avatar: null,
      date: 'October 2024',
      rating: 5,
      text: 'What a gem! The villa is beautifully designed and photographed exactly as shown. The lake views are stunning at all hours. We particularly loved the outdoor dining area for morning coffee. Will absolutely return — this is our new favorite escape.',
      location: 'Seattle, Washington',
    },
  ],

  // Aggregate review scores
  reviewScores: {
    cleanliness: 4.9,
    accuracy: 4.9,
    checkin: 5.0,
    communication: 5.0,
    location: 4.8,
    value: 4.7,
  },

  // Availability
  availabilityNote: 'Highly rated host · Last booked 3 days ago',
  minNights: 3,
  maxNights: 30,

  // Location details
  locationDescription:
    'Located in a private gated community above South Lake Tahoe, 15 minutes from Heavenly Ski Resort. Close to restaurants, shops, and year-round outdoor activities.',
  coordinates: {
    lat: 38.9399,
    lng: -119.9772,
  },
};

export default PROPERTY_DATA;
