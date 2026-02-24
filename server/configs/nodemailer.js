import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `AI Resume Builder <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Login OTP - AI Resume Builder',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">AI Resume Builder</h2>
                <p>Hello,</p>
                <p>Use the following OTP to log in to your account. This OTP is valid for 10 minutes.</p>
                <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #F95200;">
                    ${otp}
                </div>
                <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 AI Resume Builder. All rights reserved.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};
