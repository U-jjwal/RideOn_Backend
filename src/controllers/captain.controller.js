import { Captain } from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerCaptain = async (req, res) => {
    try {
        const {firstname, lastname, email, password, vehicle } = req.body 
        console.log(req.body)

        if(!firstname || !lastname || !email || !password || !vehicle) return res.status(400).json({ message: "All fields are required"})

        const existingCaptain = await Captain.findOne({ email: email })

        if(existingCaptain) return res.status(400).json({ message: "Captain with this email already exists" })

        const hashPassword = await bcrypt.hash(password, 10)
        
        const captain = await Captain.create({
            fullname: {
                firstname,
                lastname
            },
            email,
            password: hashPassword,
            vehicle : {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType          
            }
        })

        const token = jwt.sign({ 
            id: captain._id,
            email: captain.email,
            role: "captain"
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            message: "Captain registered successfully"
        })
        
    } catch (err) {
        res.status(500).json({
            message: "Error registering captain"
        })
    }
}

