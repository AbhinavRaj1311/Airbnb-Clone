import styles from './Footer.module.css'

const FOOTER_LINKS = {
  Support: ['Help Center', 'Get help with a safety issue', 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report neighborhood concern'],
  Hosting: ['StayGallery your home', 'AirCover for hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly', 'Airbnb-friendly apartments'],
  StayGallery: ['Newsroom', 'New features', 'Careers', 'Investors', 'StayGallery.org emergency stays'],
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerInner}>
        {/* Link Columns */}
        <div className={styles.linkGrid}>
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>{category}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className={styles.footerLink}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottomDivider} />

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>© {year} StayGallery, Inc.</span>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href="#" className={styles.legalLink}>Privacy</a>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href="#" className={styles.legalLink}>Terms</a>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href="#" className={styles.legalLink}>Sitemap</a>
            <span className={styles.dot} aria-hidden="true">·</span>
            <a href="#" className={styles.legalLink}>Company details</a>
          </div>
          <div className={styles.localeControls}>
            <button className={styles.localeBtn} id="footer-language-btn" aria-label="Choose language and currency">
              🌐 English (US)
            </button>
            <button className={styles.localeBtn} id="footer-currency-btn" aria-label="Choose currency">
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
