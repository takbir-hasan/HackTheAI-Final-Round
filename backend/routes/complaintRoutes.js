import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllComplaints} from "../controllers/complaintController.js";

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
router.get("/", protect, getAllComplaints);


export default router;