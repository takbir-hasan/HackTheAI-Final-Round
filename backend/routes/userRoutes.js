import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllUsers, getUserById, getProfile, updateUserInfo, changePassword } from '../controllers/userController.js';

import { authLimiter } from '../config/rateLimit.js';

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


/**
 * @openapi
 * /api/users/update:
 *   put:
 *     summary: Update current user's info (name or email)
 *     description: |
 *       This endpoint allows the currently authenticated (logged-in) user to update 
 *       their personal information. The user can update only the **name**, 
 *       only the **email**, or both fields at the same time.
 *       
 *       **Usage Rules:**
 *       - You must be logged in and provide a valid **JWT Bearer token** in the `Authorization` header.
 *       - This endpoint is **protected** → requests without a valid token will be rejected.
 *       - If no fields are provided in the request body, the server will return an error.
 *       - If you provide a new **email**, it must be unique (not already used by another user).
 *       - If you provide a new **name**, it will replace the old name.
 *       - If both `name` and `email` are provided, both will be updated together.
 *
 *       **Rate Limiting:**
 *       - If the limit is exceeded, the API will return **429 Too Many Requests**.
 *
 *       **Error Cases:**
 *       - `400 Bad Request`: If no data is provided or email is already in use.
 *       - `401 Unauthorized`: If no or invalid JWT token is provided.
 *       - `404 Not Found`: If the user does not exist.
 *       - `429 Too Many Requests`: If the user exceeds the allowed request limit.
 *       - `500 Server Error`: If something goes wrong on the server.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Updated"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input or email already in use
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/update', protect, updateUserInfo);


/**
 * @openapi
 * /api/users/change-password:
 *   put:
 *     summary: Change current user's password
 *     description: |
 *       This endpoint allows the currently authenticated (logged-in) user to change 
 *       their account password. The user must provide the **old password** for 
 *       verification and a **new password** to replace it.
 *
 *       **Usage Rules:**
 *       - You must be logged in and provide a valid **JWT Bearer token** in the `Authorization` header.
 *       - This endpoint is **protected** → requests without a valid token will be rejected.
 *       - You must provide both `oldPassword` and `newPassword` in the request body.
 *       - The `oldPassword` must match the user's current password stored in the system.
 *       - The `newPassword` will replace the old password if validation passes.
 *
 *       **Rate Limiting:**
 *       - If the limit is exceeded, the API will return **429 Too Many Requests**.
 *
 *       **Error Cases:**
 *       - `400 Bad Request`: If oldPassword or newPassword is missing, or if old password is incorrect.
 *       - `401 Unauthorized`: If no or invalid JWT token is provided.
 *       - `404 Not Found`: If the user does not exist.
 *       - `429 Too Many Requests`: If the user exceeds the allowed request limit.
 *       - `500 Server Error`: If something goes wrong on the server.
 *
 *       **Example Request Body:**
 *       ```json
 *       {
 *         "oldPassword": "currentPass123",
 *         "newPassword": "newPass456"
 *       }
 *       ```
 *
 *       **Example Success Response:**
 *       ```json
 *       {
 *         "message": "Password changed successfully"
 *       }
 *       ```
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "currentPass123"
 *               newPassword:
 *                 type: string
 *                 example: "newPass456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or incorrect old password
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many password change attempts
 *       500:
 *         description: Server error
 */
router.put('/change-password', protect, authLimiter, changePassword);

export default router;
