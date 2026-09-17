import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import styles from './PropertyCard.module.css'

function PropertyCard({ property }) {
  const { isSaved, toggle } = useWishlist()
  const { isAuthenticated, openAuthModal } = useAuth()
  const [imgIndex, setImgIndex] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const saved = isSaved(property.id)
  const images = property.images || []
  const total = images.length
  const currentImg = images[imgIndex]

  const handleWishlist = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      openAuthModal('login')
      return
    }
    toggle(property.id)
  }, [property.id, toggle, isAuthenticated, openAuthModal])

  const handlePrev = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex(i => (i - 1 + total) % total)
    setImgLoaded(false)
  }, [total])

  const handleNext = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex(i => (i + 1) % total)
    setImgLoaded(false)
  }, [total])

  const locationStr = [property.location.city, property.location.country].filter(Boolean).join(', ')

  return (
    <article className={styles.card} aria-label={property.title}>
      <Link to={`/listing/${property.id}`} className={styles.cardLink} id={`property-card-${property.id}`}>
        {/* ── Image Zone ── */}
        <div className={styles.imageZone}>
          {/* Skeleton */}
          {!imgLoaded && <div className={`skeleton ${styles.imageSkeleton}`} aria-hidden="true" />}

          <img
            key={currentImg?.src}
            src={currentImg?.src}
            alt={currentImg?.alt || property.title}
            className={`${styles.image} ${imgLoaded ? styles.imageLoaded : styles.imageHidden}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            draggable={false}
          />

          {/* Dot indicators */}
          {total > 1 && (
            <div className={styles.dots} aria-hidden="true">
              {images.map((_, i) => (
                <span key={i} className={`${styles.dot} ${i === imgIndex ? styles.dotActive : ''}`} />
              ))}
            </div>
          )}

          {/* Nav arrows — appear on hover */}
          {total > 1 && (
            <>
              <button
                className={`${styles.navArrow} ${styles.navArrowLeft}`}
                onClick={handlePrev}
                aria-label="Previous image"
                tabIndex={-1}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={`${styles.navArrow} ${styles.navArrowRight}`}
                onClick={handleNext}
                aria-label="Next image"
                tabIndex={-1}
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Wishlist button */}
          <button
            className={`${styles.wishlistBtn} ${saved ? styles.wishlistBtnSaved : ''}`}
            onClick={handleWishlist}
            aria-label={saved ? `Remove ${property.title} from wishlist` : `Save ${property.title} to wishlist`}
            aria-pressed={saved}
            id={`wishlist-btn-${property.id}`}
          >
            <Heart
              size={22}
              fill={saved ? '#ff385c' : 'rgba(0,0,0,0.5)'}
              stroke={saved ? '#ff385c' : 'white'}
              strokeWidth={1.5}
            />
          </button>

          {/* Guest Favorite badge */}
          {property.isGuestFavorite && (
            <div className={styles.guestFavBadge} aria-label="Guest favorite">
              <span>Guest favorite</span>
            </div>
          )}
        </div>

        {/* ── Info Zone ── */}
        <div className={styles.infoZone}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{property.location.city}, {property.location.state || property.location.country}</span>
            <div className={styles.ratingChip}>
              <Star size={12} fill="currentColor" aria-hidden="true" />
              <span>{property.rating}</span>
            </div>
          </div>

          <span className={styles.distance}>{property.distanceText}</span>

          <span className={styles.dates}>{property.availabilityText}</span>

          <div className={styles.priceRow}>
            <span className={styles.price}>
              <strong>${property.pricePerNight.toLocaleString()}</strong>
              <span className={styles.perNight}> night</span>
            </span>
            {property.totalPrice && (
              <span className={styles.totalPrice}>${property.totalPrice.toLocaleString()} total</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default PropertyCard
