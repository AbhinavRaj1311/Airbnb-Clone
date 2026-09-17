import { useState } from 'react'
import { Star, ChevronDown, Info, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ReservationModal from '../ReservationModal/ReservationModal'
import styles from './BookingCard.module.css'

function calculateNights(d1Str, d2Str) {
  if (!d1Str || !d2Str) return 0
  const parse = (s) => {
    if (typeof s !== 'string') return new Date(s)
    if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
      const [d, m, y] = s.split('-')
      return new Date(Number(y), Number(m) - 1, Number(d))
    }
    const parts = s.split('T')[0].split('-')
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    }
    return new Date(s)
  }
  const d1 = parse(d1Str)
  const d2 = parse(d2Str)
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
  const diffTime = d2.getTime() - d1.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function BookingCard({ property }) {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [checkIn, setCheckIn] = useState('2026-09-15')
  const [checkOut, setCheckOut] = useState('2026-09-17')
  const [guests, setGuests] = useState(1)
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pricePerNight = property.pricePerNight || property.price || 0
  const cleaningFee = property.cleaningFee || 0
  const serviceFee = property.serviceFee || (property.pricePerNight ? Math.round(property.pricePerNight * 0.14) : 0)

  const nightsDifference = calculateNights(checkIn, checkOut)
  const validNights = nightsDifference > 0 ? nightsDifference : 0
  const nights = validNights || 2 // Display calculation based on valid nights or default 2

  const subtotal = pricePerNight * nights
  const total = subtotal + cleaningFee + serviceFee

  const handleReserve = () => {
    setValidationError('')
    setHasError(false)

    // Validation: check-in date
    if (!checkIn || !checkIn.trim()) {
      setValidationError('Please select a check-in date')
      setHasError(true)
      return
    }

    // Validation: check-out date
    if (!checkOut || !checkOut.trim()) {
      setValidationError('Please select a check-out date')
      setHasError(true)
      return
    }

    // Validation: check-out after check-in
    const diff = calculateNights(checkIn, checkOut)
    if (diff <= 0) {
      setValidationError('Check-out date must be after check-in date')
      setHasError(true)
      return
    }

    // Validation: guests
    if (!guests || guests < 1) {
      setValidationError('Please select at least 1 guest')
      setHasError(true)
      return
    }

    if (!isAuthenticated) {
      openAuthModal('login', () => {
        setIsModalOpen(true)
      })
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <aside className={styles.bookingCard} aria-label="Booking card">
      {/* Price Row */}
      <div className={styles.priceRow}>
        <div className={styles.priceGroup}>
          <span className={styles.price}>
            <strong id="card-price-per-night">${pricePerNight.toLocaleString()}</strong>
          </span>
          <span className={styles.perNight}> night</span>
        </div>
        <div className={styles.ratingGroup} aria-label={`Rated ${property.rating} with ${property.reviewCount} reviews`}>
          <Star size={12} className={styles.starIcon} fill="currentColor" aria-hidden="true" />
          <span className={styles.ratingVal}>{property.rating}</span>
          <span className={styles.reviewCount}>· {property.reviewCount} reviews</span>
        </div>
      </div>

      {/* Date & Guest Selectors */}
      <fieldset className={styles.dateGroup}>
        <legend className={styles.srOnly}>Select dates and guests</legend>
        <div className={styles.dateGrid}>
          <div className={styles.dateField}>
            <label htmlFor="check-in-date" className={styles.dateLabel}>CHECK-IN</label>
            <input
              id="check-in-date"
              type="date"
              className={styles.dateInput}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value)
                setValidationError('')
                setHasError(false)
              }}
              aria-label="Check-in date"
            />
          </div>
          <div className={styles.dateDivider} aria-hidden="true" />
          <div className={styles.dateField}>
            <label htmlFor="check-out-date" className={styles.dateLabel}>CHECKOUT</label>
            <input
              id="check-out-date"
              type="date"
              className={styles.dateInput}
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value)
                setValidationError('')
                setHasError(false)
              }}
              aria-label="Check-out date"
            />
          </div>
        </div>
        <div className={styles.guestRow}>
          <div className={styles.guestField}>
            <label htmlFor="guest-count" className={styles.dateLabel}>GUESTS</label>
            <div className={styles.guestSelect}>
              <select
                id="guest-count"
                className={styles.guestInput}
                value={guests}
                onChange={(e) => {
                  setGuests(Number(e.target.value))
                  setValidationError('')
                  setHasError(false)
                }}
                aria-label="Number of guests"
              >
                {Array.from({ length: property.guests || 6 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
              <ChevronDown size={16} className={styles.selectArrow} aria-hidden="true" />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Inline Validation Error */}
      {validationError && (
        <div className={styles.validationError} id="booking-validation-error" role="alert">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Reserve Button */}
      <button
        className={`${styles.reserveBtn} ${isSubmitting ? styles.loading : ''} ${hasError ? styles.errorState : ''}`}
        id="reserve-btn"
        aria-label="Reserve this property"
        onClick={handleReserve}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader size={18} className={styles.btnSpinner} />
            <span>Processing...</span>
          </>
        ) : (
          'Reserve'
        )}
      </button>

      <p className={styles.noChargeNote}>You won't be charged yet</p>

      {/* Price Breakdown */}
      <div className={styles.breakdown} aria-label="Price breakdown">
        <div className={styles.breakdownRow}>
          <span className={styles.breakdownLabel}>
            <button className={styles.priceDetailsBtn} id="price-details-link">
              ${pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
            </button>
          </span>
          <span className={styles.breakdownValue} id="booking-subtotal">
            ${subtotal.toLocaleString()}
          </span>
        </div>
        {cleaningFee > 0 && (
          <div className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>
              <button className={styles.priceDetailsBtn} id="cleaning-fee-info">
                Cleaning fee
                <Info size={12} className={styles.infoIcon} aria-hidden="true" />
              </button>
            </span>
            <span className={styles.breakdownValue} id="booking-cleaning-fee">
              ${cleaningFee.toLocaleString()}
            </span>
          </div>
        )}
        {serviceFee > 0 && (
          <div className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>
              <button className={styles.priceDetailsBtn} id="service-fee-info">
                StayGallery service fee
                <Info size={12} className={styles.infoIcon} aria-hidden="true" />
              </button>
            </span>
            <span className={styles.breakdownValue} id="booking-service-fee">
              ${serviceFee.toLocaleString()}
            </span>
          </div>
        )}
        <div className={styles.totalDivider} />
        <div className={styles.breakdownRow}>
          <strong className={styles.totalLabel}>Total before taxes</strong>
          <strong className={styles.totalValue} id="booking-total-price">
            ${total.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Reservation Confirmation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
        bookingDetails={{
          checkIn,
          checkOut,
          guests,
          pricePerNight,
          nights,
          subtotal,
          cleaningFee,
          serviceFee,
          totalPrice: total,
        }}
      />
    </aside>
  )
}

export default BookingCard
