import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllUsers, getUserById, getProfile } from '../controllers/userController.js';

const router = express.Router();

/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Get current authenticated user's profile
 *     description: |
 *       Fetches the profile of the currently logged-in user.
 *       Frontend instructions:
 *         1. Send GET request to this endpoint.
 *         2. Include Authorization header: "Bearer <accessToken>".
 *         3. Response example:
 *            `{
 *              "message": "Profile fetched successfully",
 *              "user": {
 *                "_id": "64ff...",
 *                "name": "John Doe",
 *                "email": "john@example.com",
 *                "createdAt": "2025-09-23T12:34:56.789Z",
 *                "updatedAt": "2025-09-23T12:34:56.789Z"
 *              }
 *            }`
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's profile
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/profile', protect, getProfile);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: |
 *       Fetches all registered users from the database.
 *
 *       Frontend instructions:
 *       1. Send a GET request to this endpoint.
 *       2. Include Authorization header: "Bearer <accessToken>".
 *       3. Response example:
 *          `{
 *            "message": "Users fetched successfully",
 *            "users": [
 *              {
 *                "_id": "64ff...",
 *                "name": "John Doe",
 *                "email": "john@example.com",
 *                "createdAt": "2025-09-23T12:34:56.789Z",
 *                "updatedAt": "2025-09-23T12:34:56.789Z"
 *              }
 *            ]
 *          }`
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of users
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/', protect, getAllUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: |
 *       Fetches a single user by their unique ID.
 *
 *       Frontend instructions:
 *       1. Send a GET request to this endpoint.
 *       2. Include Authorization header: "Bearer <accessToken>".
 *       3. Replace `{id}` in the URL with the user's ID.
 *       4. Response example:
 *          `{
 *            "message": "User fetched successfully",
 *            "user": {
 *              "_id": "64ff...",
 *              "name": "John Doe",
 *              "email": "john@example.com",
 *              "createdAt": "2025-09-23T12:34:56.789Z",
 *              "updatedAt": "2025-09-23T12:34:56.789Z"
 *            }
 *          }`
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getUserById);


export default router;
