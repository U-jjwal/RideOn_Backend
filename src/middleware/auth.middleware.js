import { User }  from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const authMiddleware = async (req, res, next) => {
    try {
        const token =  req.cookies.token 
     
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

        const token = req.cookies.token

        if(!token) return res.status(401).json({ message: "Unauthorized" })

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(decoded.role != "captain") return res.status(401).json({ message: "Unauthorized" })

        req.captain = decoded
        
        next()

    } catch (err) {
        res.status(401).json({ message: "Unauthorized" })
    }
}