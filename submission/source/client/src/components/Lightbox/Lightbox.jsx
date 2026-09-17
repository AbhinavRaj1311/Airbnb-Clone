import { useEffect, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSortedGallery } from '../../data/propertyData'
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation'
import styles from './Lightbox.module.css'

function Lightbox({ isOpen, currentIndex, onClose, onNext, onPrev }) {
  const closeRef = useRef(null)
  const gallery = getSortedGallery()

  const currentImage = gallery[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === gallery.length - 1
  const total = gallery.length

  // Keyboard navigation
  useKeyboardNavigation(isOpen, {
    onNext: isLast ? undefined : onNext,
    onPrev: isFirst ? undefined : onPrev,
    onClose,
  })

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      setTimeout(() => closeRef.current?.focus(), 50)
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [isOpen])

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen || !currentImage) return

    const preloadUrls = []
    if (currentIndex > 0) preloadUrls.push(gallery[currentIndex - 1].src)
    if (currentIndex < gallery.length - 1) preloadUrls.push(gallery[currentIndex + 1].src)

    preloadUrls.forEach((url) => {
      const img = new Image()
      img.src = url
    })
  }, [isOpen, currentIndex, gallery, currentImage])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  if (!isOpen || !currentImage) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${currentIndex + 1} of ${total}: ${currentImage.alt}`}
      id="lightbox-overlay"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className={styles.header} onClick={(e) => e.stopPropagation()}>
        <div className={styles.counter} aria-live="polite" aria-atomic="true">
          <span className={styles.counterText}>
            {currentIndex + 1} / {total}
          </span>
        </div>
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          id="lightbox-close-btn"
          aria-label="Close lightbox"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Image Stage */}
      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        {/* Previous Button */}
        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          onClick={onPrev}
          disabled={isFirst}
          id="lightbox-prev-btn"
          aria-label="Previous photo"
          aria-disabled={isFirst}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        {/* Image */}
        <div className={styles.imageContainer} key={currentImage.id}>
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className={styles.lightboxImage}
            loading="eager"
            draggable={false}
          />
        </div>

        {/* Next Button */}
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={onNext}
          disabled={isLast}
          id="lightbox-next-btn"
          aria-label="Next photo"
          aria-disabled={isLast}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Caption */}
      <div className={styles.caption} onClick={(e) => e.stopPropagation()}>
        <span className={styles.room}>{currentImage.room}</span>
        <span className={styles.captionText}>{currentImage.alt}</span>
      </div>
    </div>
  )
}

export default Lightbox
