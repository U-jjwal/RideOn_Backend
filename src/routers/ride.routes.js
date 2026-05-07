import express from 'express'
import { body, query } from 'express-validator'
import { createride, getFare, confirmride, startRide, endRide } from '../controllers/ride.controller.js'
import { authMiddleware, authMiddlewareCaptain } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/create').post(
    authMiddleware,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup adderss'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
    createride
)

router.route('/get-fare').get(authMiddleware,getFare)

router.route('/confirm').post(
    authMiddlewareCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmride
)

router.route('/start-ride').get(
    authMiddlewareCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

router.route('/end-ride').post(
    authMiddlewareCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
)

export default router
