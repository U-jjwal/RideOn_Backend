import express from "express";
import { loginUser, logoutUser, registerUser, userProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(authMiddleware, logoutUser)

router.route('/profile').get(authMiddleware, userProfile)


export default router;