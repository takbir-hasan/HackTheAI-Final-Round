import express from 'express';
import { askQuestion } from '../controllers/askController.js';

const router = express.Router();

/**
 * @openapi
 * /api/ask:
 *   post:
 *     summary: Ask a question to the agent
 *     tags:
 *       - Ask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: "How do I file a complaint?"
 *               notices:
 *                 type: object
 *                 example: {}
 *               faq:
 *                 type: object
 *                 example: {}
 *     responses:
 *       200:
 *         description: Agent response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agentResponse:
 *                   type: object
 *       400:
 *         description: Query required
 *       500:
 *         description: Server error
 */
router.post('/', askQuestion);

export default router;
