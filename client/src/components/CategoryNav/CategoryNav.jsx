import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORIES } from '../../data/propertiesData'
import styles from './CategoryNav.module.css'

function CategoryNav({ activeCategory, onSelect }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const allCategories = [{ id: 'all', label: 'All', icon: '🏠' }, ...CATEGORIES]

  return (
    <nav className={styles.categoryNav} aria-label="Property categories">
      <button
        className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`}
        onClick={() => scroll(-1)}
        aria-label="Scroll categories left"
        id="cat-scroll-left"
      >
        <ChevronLeft size={16} />
      </button>

      <div className={styles.categoriesTrack} ref={scrollRef}>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.categoryBtnActive : ''}`}
            onClick={() => onSelect(cat.id)}
            id={`category-${cat.id}`}
            aria-pressed={activeCategory === cat.id}
            aria-label={`Filter by ${cat.label}`}
          >
            <span className={styles.categoryIcon} aria-hidden="true">{cat.icon}</span>
            <span className={styles.categoryLabel}>{cat.label}</span>
          </button>
        ))}
      </div>

      <button
        className={`${styles.scrollBtn} ${styles.scrollBtnRight}`}
        onClick={() => scroll(1)}
        aria-label="Scroll categories right"
        id="cat-scroll-right"
      >
        <ChevronRight size={16} />
      </button>

      {/* Filter toggle */}
      <button className={styles.filterBtn} id="filter-btn" aria-label="Open filters">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        Filters
      </button>
    </nav>
  )
}

export default CategoryNav
