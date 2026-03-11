import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, default: "Member" },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;