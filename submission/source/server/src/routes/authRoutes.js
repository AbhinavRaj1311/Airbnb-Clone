import express from 'express'
import { register, login, logout, getMe, updateProfile } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', getMe)
router.post('/update-profile', updateProfile)

export default router
