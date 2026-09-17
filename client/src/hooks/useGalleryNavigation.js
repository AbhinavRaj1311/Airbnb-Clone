import { useState, useCallback } from 'react'
import { getSortedGallery } from '../data/propertyData'

/**
 * Hook for managing gallery navigation state
 * @param {number} initialIndex - Starting image index
 */
export function useGalleryNavigation(initialIndex = 0) {
  const gallery = getSortedGallery()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : prev))
  }, [gallery.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }, [])

  const goTo = useCallback((index) => {
    if (index >= 0 && index < gallery.length) {
      setCurrentIndex(index)
    }
  }, [gallery.length])

  const currentImage = gallery[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === gallery.length - 1
  const total = gallery.length

  return {
    currentIndex,
    currentImage,
    isFirst,
    isLast,
    total,
    goToNext,
    goToPrev,
    goTo,
    gallery,
  }
}

export default useGalleryNavigation
