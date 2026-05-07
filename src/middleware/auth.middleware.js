import { User }  from "../models/user.model.js";
import { Captain } from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";


export const authMiddleware = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // fallback to cookie
        else if (req.cookies.token) {
            token = req.cookies.token;
        } 
     
        if(!token) return res.status(401).json({ message: "Unauthorized" })
            

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if(!user) return res.status(401).json({ message: "Unauthorized" })

        req.user = user
        
        next()
        
        
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" })
    }
}

export const authMiddlewareCaptain = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // fallback to cookie
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if(!token) return res.status(401).json({ message: "Unauthorized" })

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(decoded.role != "captain") return res.status(401).json({ message: "Unauthorized" })

        const captain = await Captain.findById(decoded.id)
        if(!captain) return res.status(401).json({ message: "Unauthorized" })

        req.captain = captain
        
        next()

    } catch (err) {
        res.status(401).json({ message: "Unauthorized" })
    }
}