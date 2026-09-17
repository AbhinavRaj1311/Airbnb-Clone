import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Globe, Menu, User, Plus, Minus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'
import ProfileMenu from '../auth/ProfileMenu'
import Avatar from '../auth/Avatar'
import styles from './HomeHeader.module.css'

// ─── Guest Picker ─────────────────────────────────────────────────────────────
function GuestRow({ label, sublabel, count, onAdd, onSub, canSub }) {
  return (
    <div className={styles.guestRow}>
      <div>
        <span className={styles.guestLabel}>{label}</span>
        <span className={styles.guestSub}>{sublabel}</span>
      </div>
      <div className={styles.guestControls}>
        <button
          className={`${styles.guestBtn} ${!canSub ? styles.guestBtnDisabled : ''}`}
          onClick={onSub} disabled={!canSub}
          aria-label={`Remove ${label}`}
        ><Minus size={14} /></button>
        <span className={styles.guestCount}>{count}</span>
        <button className={styles.guestBtn} onClick={onAdd} aria-label={`Add ${label}`}><Plus size={14} /></button>
      </div>
    </div>
  )
}

// ─── Location Dropdown ────────────────────────────────────────────────────────
const SUGGESTED = [
  { label: 'Anywhere', icon: '🌎' },
  { label: 'United States', icon: '🇺🇸' },
  { label: 'Europe', icon: '🇪🇺' },
  { label: 'Asia', icon: '🌏' },
  { label: 'Mexico & Caribbean', icon: '🏝️' },
  { label: 'Pacific Islands', icon: '🌊' },
]

function LocationDropdown({ value, onChange, onClose }) {
  return (
    <div className={styles.locationDropdown}>
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownTitle}>Search destinations</span>
      </div>
      <input
        className={styles.locationInput}
        placeholder="Where to?"
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus
      />
      <div className={styles.suggestions}>
        {SUGGESTED.map(s => (
          <button key={s.label} className={styles.suggestion} onClick={() => { onChange(s.label); onClose() }}>
            <span className={styles.suggestionIcon}>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Date Picker ──────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function DateDropdown({ onSelect, onClose }) {
  const [selected, setSelected] = useState([])
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const buildDays = (year, month) => {
    const first = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < first; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    return days
  }

  const days = buildDays(viewYear, viewMonth)
  const isSelected = (d) => d && selected.some(s => s.toDateString() === d.toDateString())
  const isInRange = (d) => {
    if (!d || selected.length !== 2) return false
    return d > selected[0] && d < selected[1]
  }

  const handleDay = (d) => {
    if (!d) return
    if (selected.length === 0 || selected.length === 2) {
      setSelected([d])
    } else {
      const sorted = [selected[0], d].sort((a, b) => a - b)
      setSelected(sorted)
      onSelect(sorted)
    }
  }

  return (
    <div className={styles.dateDropdown}>
      <div className={styles.calendarNav}>
        <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1) } else setViewMonth(m => m-1) }}>‹</button>
        <span>{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1) } else setViewMonth(m => m+1) }}>›</button>
      </div>
      <div className={styles.calendarGrid}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className={styles.calDay}>{d}</span>)}
        {days.map((d, i) => (
          <button
            key={i}
            className={`${styles.calCell} ${d && isSelected(d) ? styles.calSelected : ''} ${d && isInRange(d) ? styles.calInRange : ''} ${!d ? styles.calEmpty : ''} ${d && d < today ? styles.calPast : ''}`}
            onClick={() => handleDay(d)}
            disabled={!d || d < today}
          >
            {d ? d.getDate() : ''}
          </button>
        ))}
      </div>
      {selected.length === 2 && (
        <div className={styles.dateConfirm}>
          <span>{selected[0].toLocaleDateString()} – {selected[1].toLocaleDateString()}</span>
          <button className={styles.clearDates} onClick={() => setSelected([])}>Clear dates</button>
        </div>
      )}
    </div>
  )
}

// ─── Main HomeHeader ──────────────────────────────────────────────────────────
function HomeHeader({ filters, updateFilter, totalGuests }) {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [activePanel, setActivePanel] = useState(null)
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  const openLogin = useCallback(() => openAuthModal('login'), [openAuthModal])
  const openSignup = useCallback(() => openAuthModal('signup'), [openAuthModal])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setActivePanel(null) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (panel) => setActivePanel(prev => prev === panel ? null : panel)

  const guestTotal = guests.adults + guests.children

  const handleSearch = () => {
    updateFilter('guests', guests)
    setActivePanel(null)
  }

  const guestLabel = guestTotal > 0
    ? `${guestTotal} guest${guestTotal > 1 ? 's' : ''}${guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}`
    : 'Add guests'

  return (
    <header className={styles.header} role="banner">
      <div className={styles.headerInner} ref={ref}>
        {/* Logo */}
        <Link to="/" className={styles.logo} id="home-logo" aria-label="StayGallery home">
          <svg width="30" height="32" viewBox="0 0 30 32" fill="none">
            <path d="M15 0C11.2 0 7.6 3.4 5.5 8.5C3 8.5 0 10.8 0 14.5C0 18.6 3.5 22 7.8 22H22.2C26.5 22 30 18.6 30 14.5C30 10.8 27 8.5 24.5 8.5C22.4 3.4 18.8 0 15 0Z" fill="#FF385C"/>
          </svg>
          <span className={styles.logoText}>StayGallery</span>
        </Link>

        {/* Search Bar */}
        <div className={`${styles.searchBar} ${activePanel ? styles.searchBarExpanded : ''}`}>
          {/* Location */}
          <button
            className={`${styles.searchPill} ${activePanel === 'location' ? styles.searchPillActive : ''}`}
            onClick={() => toggle('location')}
            id="search-location-btn"
          >
            <span className={styles.pillLabel}>Where</span>
            <span className={`${styles.pillValue} ${!filters.location ? styles.pillPlaceholder : ''}`}>
              {filters.location || 'Anywhere'}
            </span>
          </button>

          <div className={styles.pillDivider} />

          {/* Dates */}
          <button
            className={`${styles.searchPill} ${activePanel === 'dates' ? styles.searchPillActive : ''}`}
            onClick={() => toggle('dates')}
            id="search-dates-btn"
          >
            <span className={styles.pillLabel}>When</span>
            <span className={`${styles.pillValue} ${!filters.checkIn ? styles.pillPlaceholder : ''}`}>
              {filters.checkIn ? `${filters.checkIn.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${filters.checkOut?.toLocaleDateString('en-US',{month:'short',day:'numeric'})}` : 'Any week'}
            </span>
          </button>

          <div className={styles.pillDivider} />

          {/* Guests */}
          <button
            className={`${styles.searchPill} ${styles.searchPillLast} ${activePanel === 'guests' ? styles.searchPillActive : ''}`}
            onClick={() => toggle('guests')}
            id="search-guests-btn"
          >
            <span className={styles.pillLabel}>Who</span>
            <span className={`${styles.pillValue} ${guestTotal === 0 ? styles.pillPlaceholder : ''}`}>
              {guestLabel}
            </span>
          </button>

          {/* Search Button */}
          <button className={styles.searchBtn} onClick={handleSearch} id="search-submit-btn" aria-label="Search">
            <Search size={16} strokeWidth={2.5} />
            {activePanel && <span className={styles.searchBtnLabel}>Search</span>}
          </button>
        </div>

        {/* Right Controls */}
        <div className={styles.headerRight}>
          <Link to="/" className={styles.hostLink} id="header-host-link">
            StayGallery your home
          </Link>
          <button className={styles.iconBtn} id="header-lang-btn" aria-label="Language and currency">
            <Globe size={16} />
          </button>

          {/* Auth-aware profile/menu button */}
          <div className={styles.menuWrap}>
            <button
              className={styles.menuBtn}
              id="header-menu-btn"
              aria-label="Open user menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={toggleMenu}
            >
              <Menu size={18} />
              <div className={styles.userAvatar} aria-hidden="true">
                {isAuthenticated && user ? (
                  <Avatar user={user} size="sm" />
                ) : (
                  <User size={18} />
                )}
              </div>
            </button>

            {menuOpen && (
              <ProfileMenu
                onClose={closeMenu}
                onOpenLogin={openLogin}
                onOpenSignup={openSignup}
              />
            )}
          </div>
        </div>

        {/* Dropdowns */}
        {activePanel === 'location' && (
          <div className={styles.dropdownWrapper} style={{ left: 0 }}>
            <LocationDropdown
              value={filters.location}
              onChange={v => updateFilter('location', v)}
              onClose={() => setActivePanel(null)}
            />
          </div>
        )}

        {activePanel === 'dates' && (
          <div className={styles.dropdownWrapper} style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <DateDropdown
              onSelect={([ci, co]) => { updateFilter('checkIn', ci); updateFilter('checkOut', co) }}
              onClose={() => setActivePanel(null)}
            />
          </div>
        )}

        {activePanel === 'guests' && (
          <div className={styles.dropdownWrapper} style={{ right: 0, left: 'auto' }}>
            <div className={styles.guestDropdown}>
              <GuestRow label="Adults" sublabel="Ages 13 or above" count={guests.adults}
                onAdd={() => setGuests(g => ({...g, adults: g.adults+1}))}
                onSub={() => setGuests(g => ({...g, adults: Math.max(0,g.adults-1)}))}
                canSub={guests.adults > 0} />
              <GuestRow label="Children" sublabel="Ages 2–12" count={guests.children}
                onAdd={() => setGuests(g => ({...g, children: g.children+1}))}
                onSub={() => setGuests(g => ({...g, children: Math.max(0,g.children-1)}))}
                canSub={guests.children > 0} />
              <GuestRow label="Infants" sublabel="Under 2" count={guests.infants}
                onAdd={() => setGuests(g => ({...g, infants: g.infants+1}))}
                onSub={() => setGuests(g => ({...g, infants: Math.max(0,g.infants-1)}))}
                canSub={guests.infants > 0} />
              <GuestRow label="Pets" sublabel="Service animals always welcome" count={guests.pets}
                onAdd={() => setGuests(g => ({...g, pets: g.pets+1}))}
                onSub={() => setGuests(g => ({...g, pets: Math.max(0,g.pets-1)}))}
                canSub={guests.pets > 0} />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default HomeHeader
