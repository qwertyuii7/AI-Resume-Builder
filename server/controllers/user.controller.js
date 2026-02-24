import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";


const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10d' })
    return token;
}


import { OAuth2Client } from 'google-auth-library';
import { sendOTP } from '../configs/nodemailer.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Controller for sending OTP to email
// POST: /api/users/send-otp
export const sendLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        let user = await User.findOne({ email });

        if (!user) {
            // Create user placeholder (name will be updated on first successful login if needed)
            user = await User.create({
                email,
                name: email.split('@')[0], // Default name
                otp,
                otpExpires
            });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        // Send Email
        await sendOTP(email, otp);

        return res.status(200).json({ message: "OTP sent successfully to your email" });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Controller for verifying OTP
// POST: /api/users/verify-otp
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful login
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user._id);

        return res.status(200).json({ message: "Login successfully", token, user });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Controller for Google Login
// POST: /api/users/google-login
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub: googleId, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                image: picture
            });
        } else {
            // Update googleId if not present (email match but first time google login)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        }

        const token = generateToken(user._id);

        return res.status(200).json({ message: "Login successfully", token, user });

    } catch (error) {
        return res.status(400).json({ message: "Google login failed: " + error.message });
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

        // Return user resumes (exclude drafts)
        const resumes = await Resume.find({ userId, isDraft: false }).sort({ updatedAt: -1 });
        return res.status(200).json({ resumes });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Controller for tracking resume downloads
// POST: /api/users/track-download
export const trackDownload = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.downloadCount >= user.resumeLimit) {
            return res.status(403).json({
                message: "Download limit reached. Please upgrade your plan.",
                limitReached: true
            });
        }

        user.downloadCount += 1;
        await user.save();

        return res.status(200).json({
            message: "Download tracked successfully",
            downloadCount: user.downloadCount,
            user
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}