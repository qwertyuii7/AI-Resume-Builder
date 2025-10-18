import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";


const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10d' })
    return token;
}


// Controller for user register
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        // Check if user is exist or not
        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "User is already exist" })
        }

        // Create new User
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        //Generate token
        const token = generateToken(newUser._id);

        newUser.password = undefined;

        return res.status(201).json({ message: "User created successfully", token, user: newUser })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}


// Controller for user Login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user is exist or not
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User Not found Invalid Credencials" })
        }

        // Check if password is correct
        if (!user.comparePassword(password)) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // Return success message
        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({ message: "Login successfully", token, user: user })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}


// controller for geting user by ID
// GET: /api/user/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if user exist
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Return user
        user.password = undefined;
        return res.status(200).json({ user })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUsersResumes = async (req, res) => {
    try {
        const userId = req.userId;

        // Return user resumes
        const resumes = await Resume.find({ userId })
        return res.status(200).json({ resumes });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}