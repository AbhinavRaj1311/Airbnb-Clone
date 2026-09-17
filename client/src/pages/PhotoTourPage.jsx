import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import LightboxDynamic from '../components/Lightbox/LightboxDynamic'
import PROPERTIES from '../data/propertiesData'
import styles from './PhotoTourPage.module.css'

// Build room sections from property images
function buildSections(images) {
  const roomMap = new Map()
  images.forEach((img, idx) => {
    const room = img.room || 'Gallery'
    if (!roomMap.has(room)) roomMap.set(room, [])
    roomMap.get(room).push({ ...img, globalIndex: idx })
  })
  return [...roomMap.entries()].map(([room, imgs]) => ({ room, images: imgs }))
}

function PhotoSection({ section, sectionIndex, onImageClick }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle} id={`section-${sectionIndex}`}>
        {section.room}
      </h3>
      <div className={styles.sectionImages}>
        {section.images.map((image, imgIdx) => (
          <button
            key={image.id}
            className={`${styles.imageCard} ${imgIdx === 0 ? styles.imageCardFull : ''}`}
            onClick={() => onImageClick(image.globalIndex)}
            id={`photo-tour-image-${image.id}`}
            aria-label={`Open photo: ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={styles.tourImage}
              loading="lazy"
            />
            <div className={styles.imageHover} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}

function PhotoTourPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const closeRef = useRef(null)

  const property = PROPERTIES.find(p => p.id === id) || PROPERTIES[0]
  const allImages = property.images || []
  const sections = buildSections(allImages)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Lock scroll
  useEffect(() => {
    document.body.classList.add('modal-open')
    setTimeout(() => closeRef.current?.focus(), 50)
    return () => document.body.classList.remove('modal-open')
  }, [])

  // Keyboard: Escape closes tour
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !lightboxOpen) {
        navigate(-1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, navigate])

  const handleImageClick = useCallback((globalIndex) => {
    setLightboxIndex(globalIndex)
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

  return (
    <div className={styles.tourPage} role="dialog" aria-modal="true" aria-label="Photo tour" id="photo-tour-overlay">
      <Helmet>
        <title>Photo tour · {property.title} | StayGallery</title>
      </Helmet>

      {/* ── Header ── */}
      <header className={styles.tourHeader}>
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={() => navigate(-1)}
          id="close-photo-tour-btn"
          aria-label="Close photo tour"
        >
          <X size={20} aria-hidden="true" />
          <span>Close</span>
        </button>

        <span className={styles.tourTitle}>Photo tour</span>

        {/* Section navigation tabs */}
        <nav className={styles.sectionNav} aria-label="Photo sections">
          {sections.map((s, i) => (
            <button
              key={s.room}
              className={styles.navTab}
              onClick={() => {
                const el = document.getElementById(`section-${i}`)
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              aria-label={`Jump to ${s.room}`}
            >
              {s.room}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Content ── */}
      <div className={styles.tourContent}>
        {sections.map((section, sectionIndex) => (
          <PhotoSection
            key={section.room}
            section={section}
            sectionIndex={sectionIndex}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {/* ── Lightbox ── */}
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

export default PhotoTourPage
