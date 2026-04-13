import express from "express";
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js";
import { authMiddlewareCaptain } from "../middleware/auth.middleware.js";

const router = express.Router();


router.route('/register').post(registerCaptain)
router.route('/login').post(loginCaptain)
router.route('/logout').post(authMiddlewareCaptain,logoutCaptain)

router.route('/profile').get(authMiddlewareCaptain, getCaptainProfile) 


export default router;