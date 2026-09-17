import styles from './Avatar.module.css'

/**
 * Avatar — shows uploaded image or initials fallback
 * size: 'sm' | 'md' | 'lg' | 'xl'
 */
function Avatar({ user, size = 'md', className = '' }) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user.name}'s avatar`}
        className={`${styles.avatar} ${styles[size]} ${className}`}
      />
    )
  }

  return (
    <span
      className={`${styles.avatar} ${styles.initials} ${styles[size]} ${className}`}
      aria-label={`${user?.name || 'User'} avatar`}
    >
      {initials}
    </span>
  )
}

export default Avatar
