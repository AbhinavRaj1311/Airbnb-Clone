import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './AuthModal.module.css'

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSwitchToSignup, onClose, onSuccess }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailRef = useRef(null)

  useEffect(() => { emailRef.current?.focus() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Email is required')
    if (!password) return setError('Password is required')

    setLoading(true)
    try {
      await login(email.trim(), password)
      onClose()
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2 className={styles.title}>Log in</h2>
      <p className={styles.subtitle}>Welcome back to StayGallery</p>

      {error && (
        <div className={styles.errorBanner} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>Email</label>
        <input
          ref={emailRef}
          id="login-email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading} id="login-submit-btn">
        {loading ? <Loader size={18} className={styles.spinner} /> : 'Log in'}
      </button>

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button type="button" className={styles.switchLink} onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </form>
  )
}

// ─── Signup Form ──────────────────────────────────────────────────────────────
function SignupForm({ onSwitchToLogin, onClose, onSuccess }) {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const nameRef = useRef(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!confirm) errs.confirm = 'Please confirm your password'
    else if (password !== confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      onClose()
      onSuccess?.()
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2 className={styles.title}>Create your account</h2>
      <p className={styles.subtitle}>Join millions of travellers on StayGallery</p>

      {apiError && (
        <div className={styles.errorBanner} role="alert" aria-live="assertive">
          {apiError}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="signup-name" className={styles.label}>Full name</label>
        <input
          ref={nameRef}
          id="signup-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Abhinav Raj"
          autoComplete="name"
        />
        {errors.name && <span className={styles.fieldError} role="alert">{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-email" className={styles.label}>Email</label>
        <input
          id="signup-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
        />
        {errors.email && <span className={styles.fieldError} role="alert">{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-password" className={styles.label}>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="signup-password"
            type={showPw ? 'text' : 'password'}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className={styles.fieldError} role="alert">{errors.password}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-confirm" className={styles.label}>Confirm password</label>
        <input
          id="signup-confirm"
          type={showPw ? 'text' : 'password'}
          className={`${styles.input} ${errors.confirm ? styles.inputError : ''}`}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          autoComplete="new-password"
        />
        {errors.confirm && <span className={styles.fieldError} role="alert">{errors.confirm}</span>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading} id="signup-submit-btn">
        {loading ? <Loader size={18} className={styles.spinner} /> : 'Create account'}
      </button>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <button type="button" className={styles.switchLink} onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  )
}

// ─── Auth Modal Container ──────────────────────────────────────────────────────
function AuthModal({ isOpen, mode = 'login', onClose, onSuccess }) {
  const [currentMode, setCurrentMode] = useState(mode)
  const overlayRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => { setCurrentMode(mode) }, [mode])

  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('modal-open')
    setTimeout(() => closeRef.current?.focus(), 50)

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  const handleOverlayClick = useCallback(
    (e) => { if (e.target === overlayRef.current) onClose() },
    [onClose]
  )

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={currentMode === 'login' ? 'Log in' : 'Create account'}
      id="auth-modal"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          id="auth-modal-close-btn"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {currentMode === 'login' ? (
          <LoginForm
            onSwitchToSignup={() => setCurrentMode('signup')}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setCurrentMode('login')}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default AuthModal
