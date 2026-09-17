import { useState } from 'react'
import {
  Wifi, Waves, UtensilsCrossed, Wind, Thermometer, Monitor, Tv,
  Car, Zap, TreePine, Flame, Anchor, Mountain, Music, Dumbbell,
  Heart, WashingMachine, Star, Ship
} from 'lucide-react'
import styles from './Amenities.module.css'

const ICON_MAP = {
  Wifi, Waves, UtensilsCrossed, Wind, Thermometer, Monitor, Tv,
  Car, Zap, TreePine, Flame, Anchor, Mountain, Music, Dumbbell,
  Heart, WashingMachine, Star, Ship,
}

function AmenityItem({ amenity }) {
  const Icon = ICON_MAP[amenity.icon] || Star

  return (
    <li className={styles.amenityItem}>
      <span className={styles.amenityIcon} aria-hidden="true">
        <Icon size={24} strokeWidth={1.5} />
      </span>
      <span className={styles.amenityLabel}>{amenity.label}</span>
    </li>
  )
}

function Amenities({ amenities }) {
  const [showAll, setShowAll] = useState(false)

  const featured = amenities.filter((a) => a.featured)
  const displayList = showAll ? amenities : featured.slice(0, 10)

  return (
    <section className={styles.amenitiesSection} aria-label="What this place offers">
      <h3 className={styles.title}>What this place offers</h3>
      <ul className={styles.amenitiesList}>
        {displayList.map((amenity) => (
          <AmenityItem key={amenity.id} amenity={amenity} />
        ))}
      </ul>
      {amenities.length > 10 && (
        <button
          className={styles.showAllBtn}
          id="show-all-amenities-btn"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll ? 'Show less' : `Show all ${amenities.length} amenities`}
        </button>
      )}
    </section>
  )
}

export default Amenities
