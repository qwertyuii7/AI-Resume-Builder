import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Send contact message
export const sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Send email to admin
        const adminMailOptions = {
            from: process.env.SMTP_EMAIL,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                        <h2 style="margin: 0;">New Contact Message</h2>
                    </div>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #666; margin-top: 20px;">
                            Sent from Resume Builder Contact Form
                        </p>
                    </div>
                </div>
            `
        };

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: `We received your message - ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                        <h2 style="margin: 0;">Thank You for Contacting Us</h2>
                    </div>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
                        <p>Hi ${name},</p>
                        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                        <div style="background: white; padding: 15px; border-left: 4px solid #FF6B35; margin: 20px 0;">
                            <p><strong>Your Message:</strong></p>
                            <p style="margin: 10px 0; font-size: 14px; color: #666;">${message}</p>
                        </div>
                        <p>Our support team typically responds within 24 hours on business days.</p>
                        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                            Best regards,<br>
                            The Resume Builder Team
                        </p>
                    </div>
                </div>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
};
