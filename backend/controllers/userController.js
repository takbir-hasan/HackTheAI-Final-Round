import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
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

/**
 * @desc    Update authenticated user's information (name, email)
 * @route   PUT /api/users/update
 * @access  Private (Requires Bearer token)
 * 
 * Frontend usage:
 * - Send PUT request to /api/users/update
 * - Body can contain { name, email }
 * - Include Authorization header: "Bearer <accessToken>"
 * - Response returns updated user (excluding password)
 */

export const updateUserInfo = async (req, res) => {
  try {
    // Get user id from logged-in user 
    const userId = req.user.id; 

    // Check id userId is a valid 
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Get name and email from request body
    const { name, email } = req.body;

    // If Nothing is given
    if (!name && !email) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    // if email is privided, check id=f it already exists
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }



    // Make update objects
    const updateFields = {
      ...(name && { name }),
      ...(email && { email }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,                 
      { $set: updateFields }, // dynamic update fields
      { new: true, runValidators: true, context: 'query' } // return updated doc + schema validation
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Success response 
    res.json({
      message: 'User info updated successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


/**
 * Change Password
 * Requires: Old Password + New Password
 * Must be authenticated with JWT token
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // alidation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }

    // User find
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Old password verify
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // New password hash save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error" });
  }
};