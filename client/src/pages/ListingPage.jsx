import { useState, useCallback } from 'react'
import Header from '../components/Header/Header'
import PropertyHeader from '../components/PropertyHeader/PropertyHeader'
import PropertyGallery from '../components/PropertyGallery/PropertyGallery'
import PropertyInfo from '../components/PropertyInfo/PropertyInfo'
import Amenities from '../components/Amenities/Amenities'
import Reviews from '../components/PropertyInfo/Reviews'
import HostInfo from '../components/PropertyInfo/HostInfo'
import BookingCard from '../components/BookingCard/BookingCard'
import PhotoTour from '../components/PhotoTour/PhotoTour'
import Lightbox from '../components/Lightbox/Lightbox'
import Footer from '../components/Footer/Footer'
import PROPERTY_DATA from '../data/propertyData'
import styles from './ListingPage.module.css'

function ListingPage() {
  const [photoTourOpen, setPhotoTourOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const property = PROPERTY_DATA

  // Open photo tour
  const handleShowAllPhotos = useCallback(() => {
    setPhotoTourOpen(true)
  }, [])

  // Open lightbox from gallery grid (hero images 0-4)
  const handleHeroImageClick = useCallback((index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  // Open lightbox from photo tour (index into full sorted gallery)
  const handlePhotoTourImageClick = useCallback((globalIndex) => {
    setLightboxIndex(globalIndex)
    setLightboxOpen(true)
  }, [])

  // Close photo tour
  const handleClosePhotoTour = useCallback(() => {
    setPhotoTourOpen(false)
  }, [])

  // Close lightbox
  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  // Lightbox navigation
  const handleLightboxNext = useCallback(() => {
    setLightboxIndex((prev) => {
      const total = PROPERTY_DATA.host ? 19 : 19 // total images
      return prev < total - 1 ? prev + 1 : prev
    })
  }, [])

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }, [])

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main} id="main-content">
        <div className={styles.container}>
          {/* Property Title & Meta */}
          <PropertyHeader property={property} />

          {/* Gallery */}
          <PropertyGallery
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

      {/* Photo Tour Overlay */}
      <PhotoTour
        isOpen={photoTourOpen}
        onClose={handleClosePhotoTour}
        onImageClick={handlePhotoTourImageClick}
      />

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />
    </div>
  )
}

export default ListingPage
