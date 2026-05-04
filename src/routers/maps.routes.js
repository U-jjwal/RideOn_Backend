import express from "express";
import { authMiddlewareCaptain } from "../middleware/auth.middleware.js";
import { getAutoCompletesuggestions, getCoordinates, getDistanceTime } from '../controllers/map.controller.js'
import { authMiddleware } from "../middleware/auth.middleware.js";
import { query } from 'express-validator'
import { getDistancetime } from "../services/maps.service.js";

const router = express.Router()

router.route('/get-coordinates').get(
    query('address').isString().isLength({ min: 3 }),
    authMiddleware,
    getCoordinates
)

router.route('/get-distance-time').get(
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware,
    getDistanceTime
)

router.route('/get-suggestions').get(
    query('input').isString().isLength({ min: 3 }),
    authMiddleware,
    getAutoCompletesuggestions
)


export default router 