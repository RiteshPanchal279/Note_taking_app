import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  dob: { type: String },
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  googleId: { type: String },
});

export default mongoose.model('User', userSchema);
