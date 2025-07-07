import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Note App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<div style="font-family: Arial, sans-serif; padding: 10px;">
    <h2 style="color: #333;">Email Verification</h2>
    <p>Your OTP code is:</p>
    <h1 style="color: #007BFF;">${otp}</h1>
    <p>This code will expire in 5 minutes.</p>
    <p>If you didn’t request this, you can ignore this email.</p>
    <br>
    <p>— Note App Team</p>
  </div>`,
  });
};


