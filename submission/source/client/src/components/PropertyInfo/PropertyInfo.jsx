import {
  Star, Mountain, Award, Users, BedDouble, Bath, Home,
  Waves, Sun, TreePine, Building2, Palette, MapPin, Zap,
  Fish, Leaf, Ship, Moon, Eye, UtensilsCrossed
} from 'lucide-react'
import styles from './PropertyInfo.module.css'

function HighlightItem({ icon: Icon, title, description }) {
  return (
    <li className={styles.highlightItem}>
      <span className={styles.highlightIcon} aria-hidden="true">
        <Icon size={24} strokeWidth={1.5} />
      </span>
      <div className={styles.highlightText}>
        <span className={styles.highlightTitle}>{title}</span>
        <span className={styles.highlightDesc}>{description}</span>
      </div>
    </li>
  )
}

const ICON_MAP = {
  Mountain, Star, Award, Waves, Sun, TreePine, Building2,
  Palette, MapPin, Zap, Fish, Leaf, Ship, Moon, Eye, UtensilsCrossed,
  Home, Users, BedDouble, Bath,
}

function PropertyInfo({ property }) {
  const { guests, bedrooms, beds, baths, host, highlights, description } = property

  return (
    <div className={styles.propertyInfo}>
      {/* Quick Facts */}
      <div className={styles.quickFacts}>
        <h2 className={styles.quickFactsTitle}>
          Entire villa hosted by {host.name}
        </h2>
        <ul className={styles.quickFactsList} aria-label="Property details">
          <li className={styles.quickFact}>
            <Users size={16} aria-hidden="true" />
            <span>{guests} guests</span>
          </li>
          <li className={styles.quickFact} aria-hidden="true">·</li>
          <li className={styles.quickFact}>
            <Home size={16} aria-hidden="true" />
            <span>{bedrooms} bedrooms</span>
          </li>
          <li className={styles.quickFact} aria-hidden="true">·</li>
          <li className={styles.quickFact}>
            <BedDouble size={16} aria-hidden="true" />
            <span>{beds} beds</span>
          </li>
          <li className={styles.quickFact} aria-hidden="true">·</li>
          <li className={styles.quickFact}>
            <Bath size={16} aria-hidden="true" />
            <span>{baths} baths</span>
          </li>
        </ul>
      </div>

      <div className={styles.divider} />

      {/* Guest Favorite Badge */}
      {property.isGuestFavorite && (
        <div className={styles.guestFavoriteBadge} aria-label="Guest favorite">
          <div className={styles.guestFavoriteLeft}>
            <span className={styles.guestFavoriteTitle}>Guest favorite</span>
            <span className={styles.guestFavoriteDesc}>
              One of the most loved homes on StayGallery based on ratings, reviews, and reliability.
            </span>
          </div>
          <div className={styles.guestFavoriteRight}>
            <div className={styles.ratingBig}>
              <Star size={14} className={styles.starBig} fill="currentColor" aria-hidden="true" />
              <span className={styles.ratingNumber}>{property.rating}</span>
            </div>
            <span className={styles.reviewCountSmall}>{property.reviewCount} reviews</span>
          </div>
        </div>
      )}

      <div className={styles.divider} />

      {/* Highlights */}
      <ul className={styles.highlightsList} aria-label="Property highlights">
        {(highlights || []).map((h) => {
          const IconComp = ICON_MAP[h.icon] || Star
          return (
            <HighlightItem
              key={h.title}
              icon={IconComp}
              title={h.title}
              description={h.desc || h.description || ''}
            />
          )
        })}
      </ul>

      <div className={styles.divider} />

      {/* Description */}
      <section className={styles.descriptionSection} aria-label="About this place">
        <h3 className={styles.sectionTitle}>About this place</h3>
        <div className={styles.description}>
          {description.split('\n\n').map((para, i) => (
            <p key={i} className={styles.descPara}>{para}</p>
          ))}
        </div>
        <button className={styles.showMoreBtn} id="show-more-desc-btn" aria-expanded="false">
          Show more ›
        </button>
      </section>
    </div>
  )
}

export default PropertyInfo
