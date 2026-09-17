import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Star, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { reservationService } from '../../services/reservationService'
import styles from './ReservationModal.module.css'

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  try {
    let d
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-')
      d = new Date(year, month - 1, day)
    } else {
      const parts = dateStr.split('T')[0].split('-')
      if (parts.length === 3) {
        d = new Date(parts[0], parts[1] - 1, parts[2])
      } else {
        d = new Date(dateStr)
      }
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function ReservationModal({
  isOpen,
  onClose,
  property,
  bookingDetails,
  onReservationCreated,
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmedReservation, setConfirmedReservation] = useState(null)
  const overlayRef = useRef(null)
  const closeRef = useRef(null)

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setError('')
      setConfirmedReservation(null)
      document.body.classList.add('modal-open')
      setTimeout(() => closeRef.current?.focus(), 50)
    } else {
      document.body.classList.remove('modal-open')
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen || !property || !bookingDetails) return null

  const {
    checkIn,
    checkOut,
    guests,
    pricePerNight,
    nights,
    subtotal,
    cleaningFee,
    serviceFee,
    totalPrice,
  } = bookingDetails

  const propertyLocationStr =
    typeof property.location === 'object'
      ? `${property.location.city}, ${property.location.state}`
      : property.location || ''

  const propertyCoverImg =
    property.images?.[0]?.src || '/images/listings/property-001/cover.jpg'

  const handleConfirmReservation = async () => {
    setError('')
    setLoading(true)

    try {
      const payload = {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: propertyLocationStr,
        propertyImage: propertyCoverImg,
        checkIn,
        checkOut,
        guests: Number(guests),
        pricePerNight: Number(pricePerNight),
        nights: Number(nights),
        subtotal: Number(subtotal),
        cleaningFee: Number(cleaningFee || 0),
        serviceFee: Number(serviceFee || 0),
        totalPrice: Number(totalPrice),
      }

      const res = await reservationService.createReservation(payload)
      if (res.success && res.data) {
        setConfirmedReservation(res.data)
        if (onReservationCreated) {
          onReservationCreated(res.data)
        }
      } else {
        setError(res.error || 'Failed to complete reservation. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while confirming your reservation.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToTrips = () => {
    onClose()
    navigate('/trips')
  }

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={confirmedReservation ? 'Reservation Confirmed' : 'Confirm your reservation'}
      id="reservation-modal"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          id="close-reservation-modal-btn"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {confirmedReservation ? (
          /* ─── SUCCESS VIEW ─── */
          <div className={styles.successContainer} id="reservation-success-view">
            <div className={styles.successIconWrap}>
              <CheckCircle size={36} />
            </div>

            <h2 className={styles.successTitle}>Reservation confirmed!</h2>
            <p className={styles.successSubtitle}>
              You're all set! A confirmation has been saved to your account.
            </p>

            <div className={styles.successCard}>
              <div className={styles.successItem}>
                <span className={styles.successItemLabel}>Reservation ID</span>
                <span className={styles.successItemValue} id="reservation-id-display">
                  #{confirmedReservation._id}
                </span>
              </div>
              <div className={styles.successItem}>
                <span className={styles.successItemLabel}>Property</span>
                <span className={styles.successItemValue} id="reservation-property-title">
                  {confirmedReservation.propertyTitle}
                </span>
              </div>
              <div className={styles.successItem}>
                <span className={styles.successItemLabel}>Dates</span>
                <span className={styles.successItemValue} id="reservation-dates-display">
                  {formatDateDisplay(confirmedReservation.checkIn)} –{' '}
                  {formatDateDisplay(confirmedReservation.checkOut)} ({confirmedReservation.nights} night{confirmedReservation.nights > 1 ? 's' : ''})
                </span>
              </div>
              <div className={styles.successItem}>
                <span className={styles.successItemLabel}>Guests</span>
                <span className={styles.successItemValue} id="reservation-guests-display">
                  {confirmedReservation.guests} guest{confirmedReservation.guests > 1 ? 's' : ''}
                </span>
              </div>
              <div className={styles.successItem}>
                <span className={styles.successItemLabel}>Total Amount</span>
                <span className={styles.successItemValue} id="reservation-total-display">
                  ${confirmedReservation.totalPrice?.toLocaleString()}
                </span>
              </div>
              <div className={styles.successItem}>
                <span className={styles.successItemLabel}>Status</span>
                <span className={styles.successItemValue} style={{ color: '#008a05', textTransform: 'capitalize' }}>
                  {confirmedReservation.status}
                </span>
              </div>
            </div>

            <div className={styles.successActions}>
              <button
                className={styles.viewTripsBtn}
                id="view-trips-btn"
                onClick={handleGoToTrips}
              >
                View Trips
              </button>
              <button
                className={styles.doneBtn}
                id="close-success-btn"
                onClick={onClose}
              >
                Back to Listing
              </button>
            </div>
          </div>
        ) : (
          /* ─── CONFIRMATION REVIEW VIEW ─── */
          <div>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Confirm your reservation</h2>
            </div>

            {/* Property Summary */}
            <div className={styles.propertyCard}>
              <img
                src={propertyCoverImg}
                alt={property.title}
                className={styles.propertyThumb}
              />
              <div className={styles.propertyInfo}>
                <div className={styles.propertyTitle} id="confirm-property-title">
                  {property.title}
                </div>
                <div className={styles.propertyLocation} id="confirm-property-location">
                  {propertyLocationStr}
                </div>
                <div className={styles.propertyMeta}>
                  <Star size={12} fill="#222" color="#222" />
                  <span>{property.rating || '4.97'}</span>
                  <span style={{ color: '#717171' }}>
                    ({property.reviewCount || 128} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <h3 className={styles.sectionTitle}>Trip details</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Dates</div>
                <div className={styles.detailValue} id="confirm-dates">
                  {formatDateDisplay(checkIn)} – {formatDateDisplay(checkOut)}
                </div>
                <div style={{ fontSize: '12px', color: '#717171', marginTop: '2px' }} id="confirm-nights">
                  {nights} night{nights > 1 ? 's' : ''}
                </div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Guests</div>
                <div className={styles.detailValue} id="confirm-guests">
                  {guests} guest{guests > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Price Details */}
            <h3 className={styles.sectionTitle}>Price details</h3>
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>
                  ${pricePerNight?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
                </span>
                <span id="confirm-subtotal">${subtotal?.toLocaleString()}</span>
              </div>
              {cleaningFee > 0 && (
                <div className={styles.priceRow}>
                  <span>Cleaning fee</span>
                  <span id="confirm-cleaning-fee">${cleaningFee?.toLocaleString()}</span>
                </div>
              )}
              {serviceFee > 0 && (
                <div className={styles.priceRow}>
                  <span>StayGallery service fee</span>
                  <span id="confirm-service-fee">${serviceFee?.toLocaleString()}</span>
                </div>
              )}
              <div className={styles.priceDivider} />
              <div className={styles.totalRow}>
                <span>Total (USD)</span>
                <span id="confirm-total-price">${totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.policyNote}>
              <strong>Cancellation policy:</strong> Free cancellation up to 48 hours before check-in.
            </div>

            {error && (
              <div className={styles.errorBanner} role="alert" id="reservation-error-banner">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              className={styles.confirmBtn}
              id="confirm-reservation-btn"
              onClick={handleConfirmReservation}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className={styles.spinner} />
                  <span>Confirming reservation...</span>
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationModal
