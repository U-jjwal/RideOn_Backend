import express from "express";
import { registerCaptain } from "../controllers/captain.controller.js";

const router = express.Router();


router.route('/register').post(registerCaptain)




export default router;