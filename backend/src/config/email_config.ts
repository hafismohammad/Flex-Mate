import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const sendOTPmail = async (email: string, otp: string): Promise<boolean> => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.ServerEmail as string,
            pass: process.env.ServerPassword as string,
        },
    });

    const mailOptions = {
        from: process.env.ServerEmail as string,
        to: email,
        subject: 'Instant-Fix OTP Verification',
        html: `
        <div style="font-family: Arial, sans-serif; background: #f4f4f9; padding: 30px; text-align: center;">
          <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 24px; font-weight: bold; color: #333;">Flex Mate</h1>
            <p style="font-size: 16px; color: #555;">Hi,</p>
            <p style="font-size: 16px; color: #555;">Use the OTP below to complete your registration. This OTP is valid for two minutes.</p>
            
            <div style="margin: 20px auto; display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; border-radius: 8px; font-size: 24px; font-weight: bold;">
              ${otp}
            </div>
            
            <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
            <p style="font-size: 14px; color: #777;">Best regards,<br>Flex Mate Team</p>
          </div>
          <footer style="margin-top: 20px; font-size: 12px; color: #999;">&copy; 2024 Flex Mate. All rights reserved.</footer>
        </div>
      `
      
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent to email');
        return true
    } catch (error) {
        console.log('Error in sending OTP email', error)
        return false
    }
}

export default sendOTPmail