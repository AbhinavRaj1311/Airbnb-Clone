import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { config } from '../config/index.js'

const COOKIE_NAME = 'staygallery_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

function signToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '7d' })
}

function sanitizeUser(user) {
  const obj = user.toJSON ? user.toJSON() : { ...user }
  delete obj.password
  return obj
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists' })
    }

    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password })
    const token = signToken(user._id)

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.status(201).json({ success: true, data: sanitizeUser(user) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists' })
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join('. ')
      return res.status(400).json({ success: false, error: msg })
    }
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.json({ success: true, data: sanitizeUser(user) })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' })
  }
}

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' })
  res.json({ success: true, message: 'Logged out successfully' })
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authenticated' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch {
      res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' })
      return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' })
      return res.status(401).json({ success: false, error: 'User not found' })
    }

    res.json({ success: true, data: sanitizeUser(user) })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Authentication check failed' })
  }
}

// POST /api/auth/update-profile
export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' })

    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch {
      return res.status(401).json({ success: false, error: 'Session expired' })
    }

    const { name } = req.body
    const updateData = {}
    if (name && name.trim()) updateData.name = name.trim()

    // Handle avatar upload (base64 encoded)
    if (req.body.avatar) {
      // Accept base64 data URL (max ~2MB)
      const avatarData = req.body.avatar
      if (avatarData.length > 3 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'Image too large. Maximum 2MB.' })
      }
      updateData.avatar = avatarData
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    res.json({ success: true, data: sanitizeUser(user) })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Profile update failed' })
  }
}
