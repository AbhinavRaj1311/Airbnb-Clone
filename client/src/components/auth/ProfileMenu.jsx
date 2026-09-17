import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Heart, MapPin, Settings, LogOut, Home, HelpCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from './Avatar'
import styles from './ProfileMenu.module.css'

function ProfileMenu({ onClose, onOpenLogin, onOpenSignup }) {
  const { user, isAuthenticated, logout } = useAuth()
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    // Slight delay so the button click that opened us doesn't immediately close us
    const t = setTimeout(() => {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    }, 10)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const handleLogout = async () => {
    onClose()
    await logout()
    navigate('/')
  }

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      role="menu"
      aria-label="User menu"
      id="profile-menu-dropdown"
    >
      {isAuthenticated && user ? (
        <>
          {/* User info header */}
          <div className={styles.userInfo}>
            <Avatar user={user} size="md" />
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <div className={styles.divider} />

          {/* Authenticated items */}
          <Link
            to="/profile"
            className={styles.menuItem}
            role="menuitem"
            onClick={onClose}
            id="profile-link"
          >
            <User size={16} />
            <span>Profile</span>
          </Link>
          <button
            className={styles.menuItem}
            role="menuitem"
            onClick={() => { onClose(); navigate('/') }}
            id="wishlist-menu-link"
          >
            <Heart size={16} />
            <span>Wishlist</span>
          </button>
          <Link
            to="/trips"
            className={styles.menuItem}
            role="menuitem"
            onClick={onClose}
            id="trips-link"
          >
            <MapPin size={16} />
            <span>Trips</span>
          </Link>
          <Link
            to="/profile"
            className={styles.menuItem}
            role="menuitem"
            onClick={onClose}
          >
            <Settings size={16} />
            <span>Account settings</span>
          </Link>
          <div className={styles.divider} />

          <button
            className={styles.menuItem}
            role="menuitem"
            onClick={handleLogout}
            id="logout-btn"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </>
      ) : (
        <>
          {/* Unauthenticated items */}
          <button
            className={`${styles.menuItem} ${styles.menuItemBold}`}
            role="menuitem"
            onClick={() => { onClose(); onOpenLogin() }}
            id="menu-login-btn"
          >
            Log in
          </button>
          <button
            className={styles.menuItem}
            role="menuitem"
            onClick={() => { onClose(); onOpenSignup() }}
            id="menu-signup-btn"
          >
            Sign up
          </button>
          <div className={styles.divider} />
          <button className={styles.menuItem} role="menuitem" onClick={onClose}>
            <Home size={16} />
            <span>StayGallery your home</span>
          </button>
          <button className={styles.menuItem} role="menuitem" onClick={onClose}>
            <HelpCircle size={16} />
            <span>Help Center</span>
          </button>
        </>
      )}
    </div>
  )
}

export default ProfileMenu
