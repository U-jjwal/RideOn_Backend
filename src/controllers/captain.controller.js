import { Captain } from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerCaptain = async (req, res) => {
    try {
        const {firstname, lastname, email, password, vehicle } = req.body 
        

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


export const loginCaptain = async (req, res) => {
    try {

        const { email, password } = req.body

        if(!email || !password) return res.status(400).json({ message: "Email and password are required" })

        const captain = await Captain.findOne({ email: email }).select("+password")

        if(!captain) return res.status(400).json({ message: "Captain with this email does not exist" })

        const isPasswordValid = await bcrypt.compare(password, captain.password)

        if(!isPasswordValid) return res.status(400).json({ message: "Invalid password" })

        const token = jwt.sign({
            id: captain._id,
            email: captain.email,
            role: "captain"
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(200).json({
            message: "Captain logged in successfully"
        })
        
    } catch (err) {
        res.status(500).json({
            message: "Error logging in captain"
        })
    }
}

export const logoutCaptain = async (req, res) => {
    try {

        res.clearCookie("token")
        res.status(200).json({
            message: "Captain logged out successfully"
        })
        
    } catch (err) {
        res.status(500).json({
            message: "Error logging out captain"
        })
    }
}

export const getCaptainProfile = async (req, res) => {
    try {

        res.status(200).json({ captain: req.captain })
        
    } catch (err) {
        res.status(500).json({
            message: "Error getting captain profile"
        })
    }
}