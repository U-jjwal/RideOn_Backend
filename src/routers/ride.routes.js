import express from 'express'
import { body } from 'express-validator'
import { createride } from '../controllers/ride.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()


router.route('/create').post(
    authMiddleware,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup adderss'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    createride
)





export default router

