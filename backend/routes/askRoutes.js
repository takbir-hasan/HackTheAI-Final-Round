import express from 'express';
import { askQuestion } from '../controllers/askController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/ask:
 *   post:
 *     summary: Ask a question to the agent (Smart University Helpdesk Agent)
 *     description: |
 *       This endpoint allows users to send a query to the **AI Agent**.  
 *       The agent can handle multiple tasks:
 *       
 *       - **Complaint Resolver** → Detects complaints, classifies them (e.g., IT) and generates an answer.  
 *       - If the query is a complaint, it is **automatically saved** in the database with the user ID.  
 *       - **Notice/Info Assistant** → Retrieves notices, schedules, or university updates from the system.  
 *       - **FAQ Agent** → Responds to frequently asked questions with answers.  
 *       
 *       Internally, the request is forwarded to the **SmythOS Agent** along with supporting data (`notices`, `faq`).  
 *       The agent returns a structured response that may include category, type, answer, and original complaint text.
 *
 *       ### Workflow
 *       1. User sends a `query` (required).
 *       2. API forwards the query + notices + faq to the AI Agent.
 *       3. If the response category = `complaint`, it is saved to the Complaint collection in MongoDB.
 *       4. The final agent response is returned to the client.
 *       
 *       ⚠️ **Authentication required:** A valid JWT access token must be provided in the `Authorization` header as `Bearer <token>`.
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
router.post('/', protect, askQuestion);

export default router;
