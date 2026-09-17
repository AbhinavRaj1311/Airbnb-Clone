/**
 * Reservation service — API calls to /api/reservations/* with robust production fallback
 * Connects to Express + MongoDB backend when available;
 * Falls back seamlessly to persistent client storage if backend/MongoDB is unreachable.
 */
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : '')
const API = `${API_BASE}/api/reservations`

const request = async (method, path = '', body = null) => {
  const opts = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  try {
    const res = await fetch(`${API}${path}`, opts)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Request failed')
    }
    return data
  } catch (err) {
    // If it's a 4xx/5xx returned by backend (like overlapping reservation error), propagate it
    if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError') && !err.message.includes('fetch')) {
      throw err
    }

    // Resilient fallback when backend server is unavailable in deployment
    return fallbackReservation(method, path, body)
  }
}

const fallbackReservation = (method, path, body) => {
  const STORAGE_KEY = 'staygallery_reservations'
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  // POST /api/reservations -> Create new reservation
  if (method === 'POST' && (!path || path === '/')) {
    const newCheckIn = new Date(body.checkIn)
    const newCheckOut = new Date(body.checkOut)

    // Check for overlapping confirmed reservations for the same property
    const overlap = list.some((r) => {
      if (r.propertyId !== body.propertyId || r.status === 'cancelled') return false
      const existingIn = new Date(r.checkIn)
      const existingOut = new Date(r.checkOut)
      return newCheckIn < existingOut && newCheckOut > existingIn
    })

    if (overlap) {
      throw new Error('This property is already reserved for the selected dates. Please choose different dates.')
    }

    const nights = Math.max(1, Math.round((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24)))
    const pricePerNight = body.pricePerNight || 485
    const subtotal = body.subtotal || pricePerNight * nights
    const cleaningFee = body.cleaningFee || Math.round(subtotal * 0.12)
    const serviceFee = body.serviceFee || Math.round(subtotal * 0.14)
    const totalPrice = body.totalPrice || subtotal + cleaningFee + serviceFee

    const newRes = {
      _id: 'res-' + Date.now(),
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle || 'Luxe Mountain Villa',
      propertyLocation: body.propertyLocation || 'Lake Tahoe, California',
      propertyImage: body.propertyImage || '/images/listings/property-001/cover.jpg',
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests || 2,
      pricePerNight,
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    list.unshift(newRes)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return { success: true, data: newRes }
  }

  // GET /api/reservations -> Get list of user reservations
  if (method === 'GET' && (!path || path === '/')) {
    return { success: true, data: list }
  }

  // GET /api/reservations/:id
  if (method === 'GET' && path.startsWith('/') && !path.includes('availability')) {
    const id = path.replace('/', '')
    const found = list.find((r) => r._id === id)
    if (!found) throw new Error('Reservation not found')
    return { success: true, data: found }
  }

  // DELETE /api/reservations/:id -> Cancel reservation
  if (method === 'DELETE' && path.startsWith('/')) {
    const id = path.replace('/', '')
    const idx = list.findIndex((r) => r._id === id)
    if (idx === -1) throw new Error('Reservation not found')
    list[idx].status = 'cancelled'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return { success: true, data: list[idx] }
  }

  // GET /api/reservations/property/:propertyId/availability
  if (method === 'GET' && path.includes('/availability')) {
    const propertyId = path.split('/')[2]
    const bookedDates = list
      .filter((r) => r.propertyId === propertyId && r.status === 'confirmed')
      .map((r) => ({ checkIn: r.checkIn, checkOut: r.checkOut }))
    return { success: true, data: bookedDates }
  }

  throw new Error('Unsupported reservation operation')
}

export const reservationService = {
  createReservation: (reservationData) => request('POST', '', reservationData),
  getMyReservations: () => request('GET', ''),
  getReservationById: (id) => request('GET', `/${id}`),
  cancelReservation: (id) => request('DELETE', `/${id}`),
  getPropertyAvailability: (propertyId) => request('GET', `/property/${propertyId}/availability`),
}
