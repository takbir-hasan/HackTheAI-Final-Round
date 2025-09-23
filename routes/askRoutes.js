import express from 'express';
import { askQuestion } from '../controllers/askController.js';

const router = express.Router();

/**
 * @openapi
 * /api/ask:
 *   post:
 *     summary: Ask a question
 *     tags:
 *       - Ask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is the capital of France?"
 *     responses:
 *       200:
 *         description: Returns the answer to the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 */
router.post('/', askQuestion);

export default router;
