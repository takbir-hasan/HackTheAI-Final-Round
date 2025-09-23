import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

let refreshTokens = [];

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
