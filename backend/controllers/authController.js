import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

let refreshTokens = [];


// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Save user (password is hashed automatically)
    const newUser = new User({ name, email, password });
    const saveUser = await newUser.save();

    // Generate tokens
    const accessToken = jwt.sign(
      { id: saveUser._id, email: saveUser.email },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: saveUser._id, email: saveUser.email },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN }
    );

    refreshTokens.push(refreshToken);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: saveUser, accessToken, refreshToken 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

  const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user._id, email: user.email }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refreshAccessToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

  try {
    const user = jwt.verify(token, REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.json({ message: 'Logged out successfully' });
};



// --- Request OTP for password reset ---
export const requestPasswordOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  // HTML Email Template
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Password Reset OTP</title>
    <style>
      body { font-family: 'Helvetica', Arial, sans-serif; background-color: #f4f4f6; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 50px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px; }
      h2 { color: #004080; text-align: center; }
      p { font-size: 16px; color: #333; line-height: 1.5; }
      .otp { font-size: 32px; font-weight: bold; color: #FF4500; text-align: center; margin: 25px 0; letter-spacing: 3px; }
      .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; }
      .button { display: inline-block; padding: 10px 20px; background-color: #004080; color: #fff; border-radius: 5px; text-decoration: none; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Use the following OTP to proceed. This OTP is valid for <strong>10 minutes</strong>.</p>
      <div class="otp">${otp}</div>
      <p>If you did not request a password reset, please ignore this email or contact support.</p>
      <p>Best regards,<br/>Support Team</p>
      <div class="footer">&copy; 2025 Team RAFSANTAK. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;

  try {
    await sendEmail({ to: user.email, subject: 'Password Reset OTP', html });
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.status(500).json({ message: 'Email could not be sent', error: err.message });
  }
};

// Reset password with OTP
export const resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.otp !== otp || user.otpExpire < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  // Generate JWT token
  const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

  res.json({ message: 'Password reset successful', accessToken });
};