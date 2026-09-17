import { Router } from 'express'
import {
  getAllProperties,
  getPropertyById,
  getFeaturedProperty,
} from '../controllers/propertyController.js'

const router = Router()

router.get('/', getAllProperties)
router.get('/featured', getFeaturedProperty)
router.get('/:id', getPropertyById)

export default router
