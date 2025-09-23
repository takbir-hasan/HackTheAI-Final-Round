import User from '../models/userModel.js';
import mongoose from 'mongoose';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude Password
    res.json({ message: 'Users fetched successfully', users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User fetched successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get Profile

/**
 * @desc    Get current authenticated user's profile
 * @route   GET /api/users/profile
 * @access  Private (Requires Bearer token)
 * 
 * Frontend usage:
 * - Send GET request to /api/users/profile
 * - Include Authorization header: "Bearer <accessToken>"
 * - Response contains user details (name, email, etc.) excluding password
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile fetched successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};