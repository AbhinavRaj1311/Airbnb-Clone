import { useState, useCallback } from 'react'
import { Globe, Menu, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../auth/AuthModal'
import ProfileMenu from '../auth/ProfileMenu'
import Avatar from '../auth/Avatar'
import styles from './Header.module.css'

function StayGalleryLogo() {
  return (
    <div className={styles.logo} aria-label="StayGallery home">
      <svg
        width="30"
        height="32"
        viewBox="0 0 30 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15 0C6.716 0 0 6.716 0 15c0 5.522 2.99 10.336 7.438 12.96L15 32l7.562-4.04C26.01 25.336 29 20.522 29 15 29 6.716 22.284 0 15 0z"
          fill="#FF385C"
        />
        <path
          d="M15 8c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 11.5c-2.485 0-4.5-2.015-4.5-4.5S12.515 10.5 15 10.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z"
          fill="white"
        />
      </svg>
      <span className={styles.logoText}>StayGallery</span>
    </div>
  )
}

function Header() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const openLogin = useCallback(() => openAuthModal('login'), [openAuthModal])
  const openSignup = useCallback(() => openAuthModal('signup'), [openAuthModal])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <header className={styles.header} role="banner">
      <div className={styles.headerInner}>
        {/* Logo */}
        <a href="/" className={styles.logoLink}>
          <StayGalleryLogo />
        </a>

        {/* Search Bar (desktop) */}
        <nav className={styles.searchBar} aria-label="Search">
          <button className={styles.searchButton} id="search-location" aria-label="Search by location">
            <span className={styles.searchText}>Anywhere</span>
          </button>
          <span className={styles.searchDivider} aria-hidden="true" />
          <button className={styles.searchButton} id="search-dates" aria-label="Search by dates">
            <span className={styles.searchText}>Any week</span>
          </button>
          <span className={styles.searchDivider} aria-hidden="true" />
          <button className={styles.searchButton} id="search-guests" aria-label="Search by guests">
            <span className={styles.searchTextMuted}>Add guests</span>
            <span className={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className={styles.rightControls}>
          <a href="#" className={styles.hostLink} id="airbnb-your-home-link" aria-label="Become a host">
            StayGallery your home
          </a>
          <button className={styles.globeButton} id="language-selector" aria-label="Choose a language and currency">
            <Globe size={16} aria-hidden="true" />
          </button>

          {/* Profile/Menu button */}
          <div className={styles.menuWrap}>
            <button
              className={styles.userMenuButton}
              id="header-menu-btn"
              aria-label="Open user menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={toggleMenu}
            >
              <Menu size={16} aria-hidden="true" />
              <span className={styles.userAvatar} aria-hidden="true">
                {isAuthenticated && user ? (
                  <Avatar user={user} size="sm" />
                ) : (
                  <User size={22} strokeWidth={1.5} />
                )}
              </span>
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
      </div>
    </header>
  )
}

export default Header
