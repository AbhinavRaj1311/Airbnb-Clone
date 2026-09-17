import { useEffect } from 'react'

/**
 * Hook for handling keyboard navigation in modals/lightbox
 * @param {boolean} isActive - Whether the keyboard listener is active
 * @param {object} handlers - { onNext, onPrev, onClose }
 */
export function useKeyboardNavigation(isActive, { onNext, onPrev, onClose } = {}) {
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          onNext?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          onPrev?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, onNext, onPrev, onClose])
}

export default useKeyboardNavigation
