import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'staygallery_wishlist'

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlist]))
    } catch {}
  }, [wishlist])

  const toggle = useCallback((propertyId) => {
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(propertyId)) {
        next.delete(propertyId)
      } else {
        next.add(propertyId)
      }
      return next
    })
  }, [])

  const isSaved = useCallback((propertyId) => wishlist.has(propertyId), [wishlist])

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isSaved }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider')
  return ctx
}
