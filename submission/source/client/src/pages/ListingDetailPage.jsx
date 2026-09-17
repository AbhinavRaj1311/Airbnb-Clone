import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/Header/Header'
import PropertyHeader from '../components/PropertyHeader/PropertyHeader'
import PropertyGalleryDynamic from '../components/PropertyGallery/PropertyGalleryDynamic'
import PropertyInfo from '../components/PropertyInfo/PropertyInfo'
import Amenities from '../components/Amenities/Amenities'
import Reviews from '../components/PropertyInfo/Reviews'
import HostInfo from '../components/PropertyInfo/HostInfo'
import BookingCard from '../components/BookingCard/BookingCard'
import LightboxDynamic from '../components/Lightbox/LightboxDynamic'
import Footer from '../components/Footer/Footer'
import PROPERTIES from '../data/propertiesData'
import styles from './ListingDetailPage.module.css'

function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find property by id
  const property = PROPERTIES.find(p => p.id === id) || PROPERTIES[0]

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const allImages = property.images || []

  const handleShowAllPhotos = useCallback(() => {
    navigate(`/listing/${property.id}/photos`)
  }, [navigate, property.id])

  const handleHeroImageClick = useCallback((index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const handleLightboxNext = useCallback(() => {
    setLightboxIndex(prev => prev < allImages.length - 1 ? prev + 1 : prev)
  }, [allImages.length])

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex(prev => prev > 0 ? prev - 1 : prev)
  }, [])

  const locationStr = [property.location.city, property.location.state, property.location.country].filter(Boolean).join(', ')

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{property.title} · {property.location.city} | StayGallery</title>
        <meta name="description" content={property.description?.slice(0, 155)} />
      </Helmet>

      <Header />

      <main className={styles.main} id="main-content" role="main">
        <div className={styles.container}>
          {/* Back link */}
          <button className={styles.backBtn} onClick={() => navigate(-1)} id="back-btn" aria-label="Go back">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Property Title & Meta */}
          <PropertyHeader property={property} />

          {/* Gallery */}
          <PropertyGalleryDynamic
            property={property}
            onShowAllPhotos={handleShowAllPhotos}
            onImageClick={handleHeroImageClick}
          />

          {/* Content Grid: Info + Booking Card */}
          <div className={styles.contentGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              <PropertyInfo property={property} />

              <div className={styles.divider} />

              <Amenities amenities={property.amenities} />

              <div className={styles.divider} />

              <Reviews property={property} />

              <div className={styles.divider} />

              <HostInfo host={property.host} />
            </div>

            {/* Right Column - Booking Card */}
            <div className={styles.rightColumn}>
              <BookingCard property={property} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox — shows current property images only */}
      <LightboxDynamic
        isOpen={lightboxOpen}
        images={allImages}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />
    </div>
  )
}

export default ListingDetailPage
