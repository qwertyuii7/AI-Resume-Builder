import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, default: "Member" },
    downloadCount: { type: Number, default: 0 },
    isSubscribed: { type: Boolean, default: false },
    resumeLimit: { type: Number, default: 2 },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;