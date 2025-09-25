import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllComplaints, updateComplaintStatus} from "../controllers/complaintController.js";

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

/**
 * @openapi
 * /api/complaints/{id}/status:
 *   patch:
 *     summary: Update complaint status
 *     tags:
 *       - Complaints
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Complaint ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Status to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, resolved]
 *                 example: resolved
 *     responses:
 *       200:
 *         description: Complaint status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Complaint'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Server error
 */
router.put("/:id/status", protect, updateComplaintStatus);



export default router;