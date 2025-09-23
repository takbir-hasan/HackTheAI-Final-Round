import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', protect, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

export default router;
