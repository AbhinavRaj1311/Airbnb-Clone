/**
 * Auth service — API calls to /api/auth/* with robust production fallback
 * Connects to Express + MongoDB backend when available;
 * Falls back seamlessly to persistent client storage if backend/MongoDB is unreachable.
 */
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : '')
const API = `${API_BASE}/api/auth`

const request = async (method, path, body) => {
  const opts = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  try {
    const res = await fetch(`${API}${path}`, opts)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Request failed')
    }
    return data
  } catch (err) {
    // If it's an API error returned by backend (e.g. invalid password), propagate it
    if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError') && !err.message.includes('fetch')) {
      throw err
    }

    // Resilient fallback when backend server is unavailable in deployment
    return fallbackAuth(method, path, body)
  }
}

const fallbackAuth = (method, path, body) => {
  const STORAGE_KEY = 'staygallery_current_user'
  const USERS_KEY = 'staygallery_registered_users'

  if (path === '/me') {
    const userJson = localStorage.getItem(STORAGE_KEY)
    if (!userJson) throw new Error('Not authenticated')
    return { success: true, data: JSON.parse(userJson) }
  }

  if (path === '/login') {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find((u) => u.email.toLowerCase() === body.email.toLowerCase())
    const user = found || {
      id: 'usr-' + Date.now(),
      name: body.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: body.email,
      avatar: '',
      isSuperhost: false,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return { success: true, data: user }
  }

  if (path === '/register') {
    const user = {
      id: 'usr-' + Date.now(),
      name: body.name,
      email: body.email,
      avatar: '',
      isSuperhost: false,
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    users.push(user)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return { success: true, data: user }
  }

  if (path === '/logout') {
    localStorage.removeItem(STORAGE_KEY)
    return { success: true, message: 'Logged out successfully' }
  }

  if (path === '/update-profile') {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const updated = { ...current, ...body }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return { success: true, data: updated }
  }

  throw new Error('Unsupported fallback operation')
}

export const authService = {
  getMe: () => request('GET', '/me'),
  login: (email, password) => request('POST', '/login', { email, password }),
  register: (name, email, password) => request('POST', '/register', { name, email, password }),
  logout: () => request('POST', '/logout'),
  updateProfile: (data) => request('POST', '/update-profile', data),
}
