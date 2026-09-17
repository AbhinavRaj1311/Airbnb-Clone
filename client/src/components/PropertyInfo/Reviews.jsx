import { Star } from 'lucide-react'
import styles from './Reviews.module.css'

function StarRating({ rating, max = 5 }) {
  return (
    <div className={styles.starRating} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}
          fill={i < Math.round(rating) ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  // Generate initials avatar
  const initials = review.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className={styles.reviewCard} aria-label={`Review by ${review.author}`}>
      <div className={styles.reviewHeader}>
        <div className={styles.avatar} aria-hidden="true">
          {initials}
        </div>
        <div className={styles.reviewerInfo}>
          <span className={styles.reviewerName}>{review.author}</span>
          <span className={styles.reviewerLocation}>{review.location}</span>
        </div>
      </div>
      <div className={styles.reviewMeta}>
        <StarRating rating={review.rating} />
        <span className={styles.reviewDate}>{review.date}</span>
      </div>
      <p className={styles.reviewText}>{review.text}</p>
    </article>
  )
}

function ScoreBar({ label, score }) {
  return (
    <div className={styles.scoreItem}>
      <div className={styles.scoreLabelRow}>
        <span className={styles.scoreLabel}>{label}</span>
        <span className={styles.scoreValue}>{score.toFixed(1)}</span>
      </div>
      <div className={styles.scoreBarTrack} role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={5}>
        <div className={styles.scoreBarFill} style={{ width: `${(score / 5) * 100}%` }} />
      </div>
    </div>
  )
}

function Reviews({ property }) {
  const { rating, reviewCount, reviews = [], reviewScores = {} } = property

  const scoreCategories = [
    { label: 'Cleanliness', score: reviewScores.cleanliness || 4.8 },
    { label: 'Accuracy', score: reviewScores.accuracy || 4.8 },
    { label: 'Check-in', score: reviewScores.checkin || 4.9 },
    { label: 'Communication', score: reviewScores.communication || 4.9 },
    { label: 'Location', score: reviewScores.location || 4.8 },
    { label: 'Value', score: reviewScores.value || 4.7 },
  ]


  return (
    <section id="reviews" className={styles.reviewsSection} aria-label="Guest reviews">
      {/* Summary */}
      <div className={styles.reviewSummary}>
        <div className={styles.overallRating}>
          <Star size={20} className={styles.summaryStarIcon} fill="currentColor" aria-hidden="true" />
          <span className={styles.overallScore}>{rating}</span>
          <span className={styles.totalReviews}>{reviewCount} reviews</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className={styles.scoreGrid} aria-label="Rating breakdown">
        {scoreCategories.map((cat) => (
          <ScoreBar key={cat.label} label={cat.label} score={cat.score} />
        ))}
      </div>

      {/* Review Grid */}
      <div className={styles.reviewGrid}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <button
        className={styles.showMoreBtn}
        id="show-more-reviews-btn"
        aria-label={`Show all ${reviewCount} reviews`}
      >
        Show all {reviewCount} reviews
      </button>
    </section>
  )
}

export default Reviews
