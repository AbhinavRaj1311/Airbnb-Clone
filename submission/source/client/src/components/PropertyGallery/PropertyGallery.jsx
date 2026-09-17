import { useState } from 'react'
import { Grid3x3 } from 'lucide-react'
import { getHeroImages } from '../../data/propertyData'
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
        onError={() => { setError(true); setLoaded(true); }}
      />
      <div className={styles.imageOverlay} aria-hidden="true" />
    </button>
  )
}

function PropertyGallery({ onShowAllPhotos, onImageClick }) {
  const heroImages = getHeroImages()

  // Ensure we have 5 images (fill if needed)
  while (heroImages.length < 5) {
    heroImages.push(heroImages[0])
  }

  const [main, ...grid] = heroImages

  const handleImageClick = (image, index) => {
    onImageClick?.(index)
  }

  return (
    <section className={styles.gallerySection} aria-label="Property photos">
      <div className={styles.galleryGrid}>
        {/* Main large image */}
        <GalleryImage
          image={main}
          className={styles.mainImage}
          onClick={() => handleImageClick(main, 0)}
          priority={true}
        />

        {/* Right 2×2 grid */}
        <div className={styles.gridRight}>
          {grid.map((img, i) => (
            <GalleryImage
              key={img.id}
              image={img}
              className={styles.gridImage}
              onClick={() => handleImageClick(img, i + 1)}
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

export default PropertyGallery
