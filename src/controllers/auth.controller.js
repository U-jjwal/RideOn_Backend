import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {

        const { firstname, lastname, email, password } = req.body

        if(!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // check if user already exists
        const existingUser = await User.findOne({ email: email })

        if(existingUser) return res.status(400).json({ message: "User already exists" })
        
        //hash password
        const hashPassword = await bcrypt.hash(password, 10)
        
        // create user
        const user = await User.create({
            fullname: {
                firstname,
                lastname
            },
            email,
            password: hashPassword,
        })

        // create token
        const token = jwt.sign({
            id: user._id,
            email: user.email, 
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully"
        })
        
        
        
    } catch (err) {
        res.status(500).json({ message: "Error registering user" })
    }
}


export const loginUser = async (req, res) => {
    try{

        const { email, password } = req.body

        if(!email || !password) return res.status(400).json({ message: "All fields are required" })
        const user = await User.findOne({ email: email }).select("+password")
        
        if(!user) return res.status(400).json({ message: "Invalid email or password"})
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        

        if(!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" })

        const token = jwt.sign({
            id: user._id,
            email: user.email, 
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(200).json({
            message: "User logged in successFully"
        })
        
    } catch (err) {
        res.status(500).json({ message: "Error logging in user "})
    }
}

export const logoutUser = async (req, res) => {
    try{
        res.clearCookie("token")
        res.status(200).json({ message: "User logged out successfully" })
    } catch (err) {
        res.status(500).json({ message: "Error logging out user" })
    }
}

export const userProfile = async (req, res) => {
    try {

        res.status(200).json(req.user)
        
    } catch (err) {
        res.status(500).json({ message: "Error fetching user profile" })
    }
}
