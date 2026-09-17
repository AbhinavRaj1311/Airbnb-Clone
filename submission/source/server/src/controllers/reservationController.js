import jwt from 'jsonwebtoken'
import Reservation from '../models/Reservation.js'
import { config } from '../config/index.js'

const COOKIE_NAME = 'staygallery_token'

function getAuthUser(req) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return null
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch {
    return null
  }
}

// Helper to parse dates in YYYY-MM-DD or DD-MM-YYYY format
function parseDate(dateStr) {
  if (!dateStr) return null
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr
  if (typeof dateStr === 'string') {
    // DD-MM-YYYY format (e.g. 15-09-2026)
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('-')
      const parsed = new Date(`${y}-${m}-${d}T00:00:00.000Z`)
      return isNaN(parsed.getTime()) ? null : parsed
    }
    // YYYY-MM-DD or ISO string
    const parsed = new Date(dateStr)
    return isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

// POST /api/reservations
export const createReservation = async (req, res) => {
  const user = getAuthUser(req)
  if (!user) return res.status(401).json({ success: false, error: 'You must be logged in to make a reservation' })

  try {
    const {
      propertyId,
      propertyTitle,
      propertyLocation,
      propertyImage,
      checkIn,
      checkOut,
      guests,
      pricePerNight,
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      totalPrice,
    } = req.body

    // Server-side validation
    if (!propertyId) return res.status(400).json({ success: false, error: 'Property is required' })
    if (!checkIn || !checkOut) return res.status(400).json({ success: false, error: 'Check-in and check-out dates are required' })

    const checkInDate = parseDate(checkIn)
    const checkOutDate = parseDate(checkOut)

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, error: 'Invalid date format' })
    }
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ success: false, error: 'Check-out date must be after check-in date' })
    }
    if (!guests || guests < 1) {
      return res.status(400).json({ success: false, error: 'At least 1 guest is required' })
    }
    const calculatedNights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const stayNights = nights || calculatedNights
    if (stayNights < 1) {
      return res.status(400).json({ success: false, error: 'Minimum 1 night stay required' })
    }

    // Check for overlapping confirmed reservations for the same property
    const overlapping = await Reservation.findOne({
      propertyId,
      status: 'confirmed',
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    })

    if (overlapping) {
      return res.status(409).json({
        success: false,
        error: 'This property is already reserved for the selected dates. Please choose different dates.',
      })
    }

    const reservation = await Reservation.create({
      userId: user.id,
      propertyId,
      propertyTitle: propertyTitle || 'Property',
      propertyLocation: propertyLocation || '',
      propertyImage: propertyImage || '',
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      pricePerNight: Number(pricePerNight),
      nights: stayNights,
      subtotal: Number(subtotal || (pricePerNight * stayNights)),
      cleaningFee: Number(cleaningFee || 0),
      serviceFee: Number(serviceFee || 0),
      totalPrice: Number(totalPrice || (subtotal + cleaningFee + serviceFee)),
      status: 'confirmed',
    })

    res.status(201).json({ success: true, data: reservation })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join('. ')
      return res.status(400).json({ success: false, error: msg })
    }
    res.status(500).json({ success: false, error: err.message || 'Failed to create reservation' })
  }
}

// GET /api/reservations — user's own reservations
export const getMyReservations = async (req, res) => {
  const user = getAuthUser(req)
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' })

  try {
    const reservations = await Reservation.find({ userId: user.id }).sort({ createdAt: -1 })
    res.json({ success: true, data: reservations })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch reservations' })
  }
}

// GET /api/reservations/:id
export const getReservationById = async (req, res) => {
  const user = getAuthUser(req)
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' })

  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) return res.status(404).json({ success: false, error: 'Reservation not found' })
    if (reservation.userId.toString() !== user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }
    res.json({ success: true, data: reservation })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch reservation' })
  }
}

// DELETE /api/reservations/:id — cancel reservation
export const cancelReservation = async (req, res) => {
  const user = getAuthUser(req)
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' })

  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) return res.status(404).json({ success: false, error: 'Reservation not found' })
    if (reservation.userId.toString() !== user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    reservation.status = 'cancelled'
    await reservation.save()

    res.json({ success: true, data: reservation })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to cancel reservation' })
  }
}

// GET /api/reservations/property/:propertyId/availability
export const getPropertyAvailability = async (req, res) => {
  try {
    const { propertyId } = req.params
    const booked = await Reservation.find(
      { propertyId, status: 'confirmed' },
      'checkIn checkOut'
    )
    res.json({ success: true, data: booked })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch availability' })
  }
}
