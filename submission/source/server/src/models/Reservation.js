import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
    propertyTitle: {
      type: String,
      required: true,
    },
    propertyLocation: {
      type: String,
      default: '',
    },
    propertyImage: {
      type: String,
      default: '',
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      type: Number,
      required: true,
      min: [1, 'At least 1 guest required'],
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
      min: [1, 'At least 1 night required'],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    cleaningFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
)

// Validate checkout is after checkin
reservationSchema.pre('save', function (next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error('Check-out date must be after check-in date'))
  }
  next()
})

const Reservation = mongoose.model('Reservation', reservationSchema)
export default Reservation
