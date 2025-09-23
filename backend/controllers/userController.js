import users from '../models/userModel.js';

// Get all users
export const getAllUsers = (req, res) => {
  res.json(users);
};

// Get single user by id
export const getUserById = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};
