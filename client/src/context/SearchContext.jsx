import { createContext, useContext, useState, useCallback } from 'react'

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [filters, setFilters] = useState({
    location: '',
    checkIn: null,
    checkOut: null,
    guests: { adults: 0, children: 0, infants: 0, pets: 0 },
    category: 'all',
  })

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      location: '',
      checkIn: null,
      checkOut: null,
      guests: { adults: 0, children: 0, infants: 0, pets: 0 },
      category: 'all',
    })
  }, [])

  const totalGuests = filters.guests.adults + filters.guests.children

  return (
    <SearchContext.Provider value={{ filters, updateFilter, clearFilters, totalGuests }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be inside SearchProvider')
  return ctx
}
