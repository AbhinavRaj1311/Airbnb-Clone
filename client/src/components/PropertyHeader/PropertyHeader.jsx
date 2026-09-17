import { Star, Share2, Heart, Award } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import styles from './PropertyHeader.module.css'

function PropertyHeader({ property }) {
  const { isSaved, toggle } = useWishlist()
  const saved = isSaved(property.id)

  return (
    <div className={styles.propertyHeader}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{property.title}</h1>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            id="share-btn"
            aria-label="Share this listing"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: property.title, url: window.location.href })
              }
            }}
          >
            <Share2 size={16} aria-hidden="true" />
            <span>Share</span>
          </button>
          <button
            className={`${styles.actionBtn} ${saved ? styles.actionBtnSaved : ''}`}
            id="save-btn"
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={saved}
            onClick={() => toggle(property.id)}
          >
            <Heart
              size={16}
              aria-hidden="true"
              fill={saved ? 'currentColor' : 'none'}
            />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className={styles.metaRow}>
        {/* Rating */}
        <div className={styles.ratingGroup}>
          <Star
            size={14}
            className={styles.starIcon}
            fill="currentColor"
            aria-hidden="true"
          />
          <span className={styles.ratingValue}>{property.rating}</span>
          <span className={styles.ratingDot} aria-hidden="true">·</span>
          <a
            href="#reviews"
            className={styles.reviewLink}
            aria-label={`${property.reviewCount} reviews`}
          >
            {property.reviewCount} reviews
          </a>
        </div>

        <span className={styles.dot} aria-hidden="true">·</span>

        {/* Superhost badge */}
        {property.isSuperhost && (
          <>
            <div className={styles.superhostBadge} aria-label="Superhost">
              <Award size={13} aria-hidden="true" />
              <span>Superhost</span>
            </div>
            <span className={styles.dot} aria-hidden="true">·</span>
          </>
        )}

        {/* Location */}
        <a href="#location" className={styles.locationLink}>
          {typeof property.location === 'object'
            ? [property.location.city, property.location.state, property.location.country].filter(Boolean).join(', ')
            : property.location}
        </a>
      </div>
    </div>
  )
}

export default PropertyHeader
