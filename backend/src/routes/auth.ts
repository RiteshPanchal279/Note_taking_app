import express, { Request, Response } from 'express';
import User from '../models/User';
import { generateOTP } from '../utils/otp';
import { sendOTP } from '../utils/mailer';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Wrapper
const asyncHandler = (fn: any) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Step 1 - Request OTP for Signup
router.post('/signup', asyncHandler(async (req: Request, res: Response) => {
  const { name, dob, email } = req.body;
  if (!email || !name || !dob) return res.status(400).json({ error: 'All fields are required' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: 'Email already registered' });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await User.create({ name, dob, email, otp, otpExpiry });

  await sendOTP(email, otp);
  res.json({ message: 'OTP sent to email' });
}));

// Step 2 - Verify OTP and Signup
router.post('/signup-verify', asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || new Date() > user.otpExpiry!) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token, user: { name: user.name, dob: user.dob, email: user.email } });
}));

// Step 1 - Request OTP for Login
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await sendOTP(email, otp);
  res.json({ message: 'OTP sent to email' });
}));

// Step 2 - Verify Login OTP
router.post('/login-verify', asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry!) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token, user: { name: user.name, dob: user.dob, email: user.email } });
}));

export default router;
