import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, Tag, Compass, Loader, AlertCircle } from 'lucide-react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { reservationService } from '../services/reservationService'
import styles from './TripsPage.module.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function TripsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const fetchReservations = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await reservationService.getMyReservations()
      if (res.success && Array.isArray(res.data)) {
        setReservations(res.data)
      } else {
        setError('Could not load reservations.')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch trips. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleCancelReservation = async (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this reservation?')
    if (!confirmed) return

    setCancellingId(id)
    try {
      const res = await reservationService.cancelReservation(id)
      if (res.success && res.data) {
        setReservations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
        )
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel reservation.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className={styles.tripsPage}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            <h1 id="trips-page-title">Your Trips</h1>
            <p className={styles.subtitle}>
              Manage your upcoming reservations and past stays
            </p>
          </div>
          {reservations.length > 0 && (
            <span className={styles.tripsCount} id="trips-count-badge">
              {reservations.length} trip{reservations.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer} id="trips-loading">
            <Loader size={36} className={styles.spinner} />
            <p>Loading your trips...</p>
          </div>
        ) : reservations.length === 0 ? (
          /* Empty State */
          <div className={styles.emptyState} id="trips-empty-state">
            <div className={styles.emptyIcon}>
              <Compass size={36} />
            </div>
            <h2 className={styles.emptyTitle}>No trips booked... yet!</h2>
            <p className={styles.emptyText}>
              Time to dust off your bags and start planning your next great adventure.
            </p>
            <Link to="/" className={styles.startSearchingBtn} id="start-searching-btn">
              Explore Homes
            </Link>
          </div>
        ) : (
          /* Trips Grid */
          <div className={styles.tripsGrid} id="trips-grid">
            {reservations.map((res) => {
              const isConfirmed = res.status === 'confirmed'
              const imgSrc =
                res.propertyImage ||
                `/images/listings/${res.propertyId}/cover.jpg`

              return (
                <div
                  key={res._id}
                  className={styles.tripCard}
                  id={`reservation-card-${res._id}`}
                >
                  <div className={styles.tripImageWrap}>
                    <img
                      src={imgSrc}
                      alt={res.propertyTitle}
                      className={styles.tripImage}
                      onError={(e) => {
                        e.target.src = '/images/listings/property-001/cover.jpg'
                      }}
                    />
                    <span
                      className={`${styles.statusBadge} ${
                        isConfirmed
                          ? styles.statusConfirmed
                          : styles.statusCancelled
                      }`}
                      id={`status-${res._id}`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className={styles.tripBody}>
                    <h3 className={styles.tripTitle} id={`title-${res._id}`}>
                      {res.propertyTitle}
                    </h3>
                    <div className={styles.tripLocation}>
                      {res.propertyLocation || 'Lake Tahoe, California'}
                    </div>

                    <div className={styles.tripMetaList}>
                      <div className={styles.tripMetaItem}>
                        <Calendar size={15} className={styles.tripMetaIcon} />
                        <span id={`dates-${res._id}`}>
                          {formatDate(res.checkIn)} – {formatDate(res.checkOut)} ({res.nights} night{res.nights !== 1 ? 's' : ''})
                        </span>
                      </div>
                      <div className={styles.tripMetaItem}>
                        <Users size={15} className={styles.tripMetaIcon} />
                        <span id={`guests-${res._id}`}>
                          {res.guests} guest{res.guests !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className={styles.tripMetaItem}>
                        <Tag size={15} className={styles.tripMetaIcon} />
                        <span id={`resid-${res._id}`}>
                          Reservation #{res._id.substring(0, 10)}...
                        </span>
                      </div>
                    </div>

                    <div className={styles.tripPriceRow}>
                      <span className={styles.tripPriceLabel}>Total paid</span>
                      <strong className={styles.tripPriceValue} id={`price-${res._id}`}>
                        ${res.totalPrice?.toLocaleString()}
                      </strong>
                    </div>

                    <div className={styles.tripActions}>
                      <Link
                        to={`/listing/${res.propertyId}`}
                        className={styles.viewListingLink}
                        id={`view-listing-${res._id}`}
                      >
                        View listing
                      </Link>

                      {isConfirmed && (
                        <button
                          className={styles.cancelBtn}
                          id={`cancel-res-${res._id}`}
                          onClick={() => handleCancelReservation(res._id)}
                          disabled={cancellingId === res._id}
                        >
                          {cancellingId === res._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default TripsPage
