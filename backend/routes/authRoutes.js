import express from 'express';
import { login, refreshAccessToken, logout, register, requestPasswordOTP, resetPasswordWithOTP } from '../controllers/authController.js';

const router = express.Router();


/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       This endpoint allows a **new user** to create an account. 
 *       
 *       ### Workflow
 *       1. User provides **name, email, and password**.  
 *       2. The system checks if the email is already registered.  
 *          - If yes → returns `400 User already exists`.  
 *       3. If not, a new user is created (password is **hashed automatically** in the model).  
 *       4. On success, the system generates and returns both **Access Token** and **Refresh Token**.  
 *       5. The refresh token is also stored in server memory for token rotation.  
 *
 *       ### Tokens
 *       - **Access Token** → Used for authentication in protected routes.  
 *       - **Refresh Token** → Used to generate new access tokens when expired.  
 *
 *       ⚠️ Passwords are never stored in plain text, only hashed.  
 *
 *       ⚠️ **Rate Limiting:** To prevent abuse, this endpoint is **limited to 5 requests per minute per IP**. Exceeding this will return a `429 Too Many Requests` response.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: saniul@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully and tokens returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: User already exists
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: |
 *       This endpoint allows a registered user to **log in** to the system.  
 *       
 *       ### Workflow
 *       1. User provides **email and password**.  
 *       2. The system checks if the email exists.  
 *          - If not → returns `401 Invalid email or password`.  
 *       3. If email exists, the password is verified using bcrypt.  
 *          - If invalid → returns `401 Invalid email or password`.  
 *       4. On success, **Access Token** and **Refresh Token** are generated and returned.  
 *       5. Refresh token is stored in server memory for token rotation.  
 *
 *       ### Tokens
 *       - **Access Token** → Used for authentication in protected routes.  
 *       - **Refresh Token** → Used to generate new access tokens when expired.  
 *
 *       ⚠️ **Rate Limiting:** To prevent abuse, this endpoint is **limited to 5 requests per minute per IP**. Exceeding this will return a `429 Too Many Requests` response.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: saniul@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Returns new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: No token provided
 *       403:
 *         description: Invalid refresh token
 */
router.post('/refresh', refreshAccessToken);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (invalidate refresh token)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token to invalidate
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: No token provided
 */
router.post('/logout', logout);


/**
 * @openapi
 * /api/auth/forgot-password-otp:
 *   post:
 *     summary: Request OTP for password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: saniul@example.com
 *     responses:
 *       200:
 *         description: OTP sent to user's email
 *       404:
 *         description: User not found
 *       500:
 *         description: Email sending failed
 */
router.post('/forgot-password-otp', requestPasswordOTP);

/**
 * @openapi
 * /api/auth/reset-password-otp:
 *   post:
 *     summary: Reset password using OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: saniul@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successful, returns access token
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post('/reset-password-otp', resetPasswordWithOTP);

export default router;
