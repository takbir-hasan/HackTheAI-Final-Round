import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Complaint from '../models/complaint.js';

const router = express.Router();

/**
 * @openapi
 * /api/complaints:
 *   get:
 *     summary: Get all complaints
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.get('/', protect, async (req, res) => {
  const complaints = await Complaint.find();
      res.json(complaints);
});

export default router;