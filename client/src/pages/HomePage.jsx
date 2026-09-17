import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import HomeHeader from '../components/HomeHeader/HomeHeader'
import CategoryNav from '../components/CategoryNav/CategoryNav'
import PropertyCard from '../components/PropertyCard/PropertyCard'
import { SearchProvider, useSearch } from '../context/SearchContext'
import PROPERTIES from '../data/propertiesData'
import styles from './HomePage.module.css'

function ListingsGrid() {
  const { filters, updateFilter, totalGuests } = useSearch()
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    let list = PROPERTIES

    // Category filter
    if (category !== 'all') {
      list = list.filter(p => p.categories && p.categories.includes(category))
    }

    // Location filter
    if (filters.location && filters.location.toLowerCase() !== 'anywhere') {
      const q = filters.location.toLowerCase()
      list = list.filter(p =>
        p.location.city.toLowerCase().includes(q) ||
        p.location.country.toLowerCase().includes(q) ||
        (p.location.state && p.location.state.toLowerCase().includes(q))
      )
    }

    // Guest filter
    if (totalGuests > 0) {
      list = list.filter(p => p.guests >= totalGuests)
    }

    return list
  }, [category, filters.location, totalGuests])

  return (
    <>
      {/* Sticky sub-nav */}
      <CategoryNav activeCategory={category} onSelect={setCategory} />

      {/* Main Content */}
      <main className={styles.main} id="main-content" role="main">
        <div className={styles.container}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState} id="empty-state">
              <span className={styles.emptyIcon}>🔍</span>
              <h2>No listings match your filters</h2>
              <p>Try adjusting your search or clearing filters.</p>
              <button className={styles.clearBtn} onClick={() => { setCategory('all'); updateFilter('location', '') }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.resultsCount} aria-live="polite" aria-atomic="true">
                {filtered.length} place{filtered.length !== 1 ? 's' : ''} to stay
              </div>
              <div className={styles.grid} id="listings-grid">
                {filtered.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}

function HomePageInner() {
  const { filters, updateFilter, totalGuests } = useSearch()

  return (
    <div className={styles.page}>
      <Helmet>
        <title>StayGallery — Find unique places to stay around the world</title>
        <meta name="description" content="Discover and book unique vacation rentals, cabins, beach houses, villas and more. StayGallery — extraordinary stays worldwide." />
      </Helmet>

      <HomeHeader filters={filters} updateFilter={updateFilter} totalGuests={totalGuests} />
      <ListingsGrid />
    </div>
  )
}

function HomePage() {
  return (
    <SearchProvider>
      <HomePageInner />
    </SearchProvider>
  )
}

export default HomePage
