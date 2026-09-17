import { useState } from 'react'
import { Grid3x3 } from 'lucide-react'
import styles from './PropertyGallery.module.css'

function GalleryImage({ image, className, onClick, priority = false }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <button
      className={`${styles.imageWrapper} ${className}`}
      onClick={onClick}
      aria-label={`View photo: ${image.alt}`}
      id={`gallery-image-${image.id}`}
    >
      {!loaded && !error && <div className={styles.imageSkeleton} aria-hidden="true" />}
      <img
        src={error ? '/images/misc/fallback.jpg' : image.src}
        alt={image.alt}
        className={`${styles.galleryImage} ${loaded ? styles.imageLoaded : styles.imageHidden}`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
      />
      <div className={styles.imageOverlay} aria-hidden="true" />
    </button>
  )
}

function PropertyGalleryDynamic({ property, onShowAllPhotos, onImageClick }) {
  const images = property.images || []

  // Use first 5 images for the hero grid
  const heroImages = images.slice(0, 5)
  while (heroImages.length < 5 && images.length > 0) {
    heroImages.push(images[heroImages.length % images.length])
  }

  const [main, ...grid] = heroImages

  return (
    <section className={styles.gallerySection} aria-label="Property photos">
      <div className={styles.galleryGrid}>
        {/* Main large image */}
        <GalleryImage
          image={main}
          className={styles.mainImage}
          onClick={() => onImageClick?.(0)}
          priority={true}
        />

        {/* Right 2×2 grid */}
        <div className={styles.gridRight}>
          {grid.slice(0, 4).map((img, i) => (
            <GalleryImage
              key={`${img.id}-${i}`}
              image={img}
              className={styles.gridImage}
              onClick={() => onImageClick?.(i + 1)}
            />
          ))}
        </div>
      </div>

      {/* Show all photos button */}
      <button
        id="show-all-photos-btn"
        className={styles.showAllBtn}
        onClick={onShowAllPhotos}
        aria-label="Show all photos in photo tour"
      >
        <Grid3x3 size={14} aria-hidden="true" />
        <span>Show all photos</span>
      </button>
    </section>
  )
}

export default PropertyGalleryDynamic
