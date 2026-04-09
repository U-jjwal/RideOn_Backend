import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        const { firstname, lastname, email, passsword } = req.body

        if(!firstname || !lastname || !email || !passsword) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // check if user already exists
        const existingUser = await User.findOne({ email: email })

        if(existingUser) return res.status(400).json({ message: "User already exists" })
        
        //hash password
        const hashPassword = await bcrypt.hash(passsword, 10)
        
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