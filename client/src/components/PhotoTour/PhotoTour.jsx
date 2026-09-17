import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { getPhotoTourSections } from '../../data/propertyData'
import styles from './PhotoTour.module.css'

function PhotoSection({ section, sectionIndex, onImageClick, globalStartIndex }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle} id={`section-${sectionIndex}`}>
        {section.room}
      </h3>
      <div className={styles.sectionImages}>
        {section.images.map((image, imgIndex) => {
          const globalIndex = globalStartIndex + imgIndex
          return (
            <button
              key={image.id}
              className={`${styles.imageCard} ${imgIndex === 0 ? styles.imageCardFull : ''}`}
              onClick={() => onImageClick(globalIndex)}
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
          )
        })}
      </div>
    </div>
  )
}

function PhotoTour({ isOpen, onClose, onImageClick, initialSection }) {
  const closeRef = useRef(null)
  const sections = getPhotoTourSections()

  // Build global index map
  const sectionStartIndexes = []
  let runningIndex = 0
  sections.forEach((s) => {
    sectionStartIndexes.push(runningIndex)
    runningIndex += s.images.length
  })

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      // Focus close button
      setTimeout(() => closeRef.current?.focus(), 50)
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour"
      id="photo-tour-overlay"
    >
      {/* Header */}
      <div className={styles.tourHeader}>
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          id="close-photo-tour-btn"
          aria-label="Close photo tour"
        >
          <X size={20} aria-hidden="true" />
          <span>Close</span>
        </button>
        <span className={styles.tourTitle}>Photo tour</span>
        <div className={styles.headerRight}>
          <nav className={styles.sectionNav} aria-label="Photo sections">
            {sections.map((s, i) => (
              <a
                key={s.room}
                href={`#section-${i}`}
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {s.room}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className={styles.tourContent}>
        {sections.map((section, sectionIndex) => (
          <PhotoSection
            key={section.room}
            section={section}
            sectionIndex={sectionIndex}
            globalStartIndex={sectionStartIndexes[sectionIndex]}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  )
}

export default PhotoTour
