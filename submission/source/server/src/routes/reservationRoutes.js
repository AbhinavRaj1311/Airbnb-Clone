import express from 'express'
import {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getPropertyAvailability,
} from '../controllers/reservationController.js'

const router = express.Router()

router.post('/', createReservation)
router.get('/', getMyReservations)
router.get('/property/:propertyId/availability', getPropertyAvailability)
router.get('/:id', getReservationById)
router.delete('/:id', cancelReservation)

export default router
