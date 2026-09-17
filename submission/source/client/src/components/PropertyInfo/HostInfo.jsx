import { Star, Award, MessageSquare, Shield } from 'lucide-react'
import styles from './HostInfo.module.css'

function HostInfo({ host }) {
  return (
    <section className={styles.hostSection} aria-label="Host information">
      <h3 className={styles.title}>Meet your host</h3>
      <div className={styles.hostCard}>
        {/* Avatar */}
        <div className={styles.avatarCol}>
          <div className={styles.avatarWrapper}>
            <img
              src={host.avatar}
              alt={`Host ${host.name}`}
              className={styles.avatar}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'flex'
              }}
            />
            <div className={styles.avatarFallback} style={{ display: 'none' }} aria-hidden="true">
              {host.name[0]}
            </div>
            {host.isSuperhost && (
              <div className={styles.superhostBadge} aria-label="Superhost">
                <Award size={14} aria-hidden="true" />
              </div>
            )}
          </div>
          <div className={styles.hostNameGroup}>
            <span className={styles.hostName}>{host.name}</span>
            {host.isSuperhost && <span className={styles.superhostLabel}>Superhost</span>}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsCol}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{host.reviewCount}</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
          <div className={styles.statItem}>
            <Star size={14} className={styles.statStarIcon} fill="currentColor" aria-hidden="true" />
            <span className={styles.statValue}>{host.rating}</span>
            <span className={styles.statLabel}>Rating</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{host.yearsHosting}</span>
            <span className={styles.statLabel}>Years hosting</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className={styles.hostDetails}>
        {host.isSuperhost && (
          <div className={styles.detailItem}>
            <Award size={16} aria-hidden="true" />
            <div>
              <span className={styles.detailTitle}>{host.name} is a Superhost</span>
              <p className={styles.detailDesc}>
                Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
              </p>
            </div>
          </div>
        )}
        <div className={styles.detailItem}>
          <MessageSquare size={16} aria-hidden="true" />
          <div>
            <span className={styles.detailTitle}>Response rate: {host.responseRate}%</span>
            <p className={styles.detailDesc}>Responds {host.responseTime}</p>
          </div>
        </div>
        <div className={styles.detailItem}>
          <Shield size={16} aria-hidden="true" />
          <div>
            <span className={styles.detailTitle}>To protect your payment, never transfer money or communicate outside of StayGallery.</span>
          </div>
        </div>
      </div>

      <button
        className={styles.contactBtn}
        id="contact-host-btn"
        aria-label={`Contact ${host.name}`}
      >
        Contact host
      </button>
    </section>
  )
}

export default HostInfo
