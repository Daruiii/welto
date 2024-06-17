// User without password schema
/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithoutPassword:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         establishmentName:
 *           type: string
 *         establishmentType:
 *           type: string
 *         phone:
 *           type: string
 */

// User schema
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The unique email address of the user.
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password.
 *           example: "password123"
 *         firstName:
 *           type: string
 *           description: User's first name.
 *           example: John
 *         lastName:
 *           type: string
 *           description: User's last name.
 *           example: Doe
 *         establishmentName:
 *           type: string
 *           description: Name of the user's establishment.
 *           example: "John's Hotel"
 *         establishmentType:
 *           type: string
 *           description: Type of the user's establishment.
 *           example: "Hotel"
 *         phone:
 *          type: string
 *          description: User's phone number.
 *          example: "1234567890"
 */

// Login schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The unique email address of the user.
 *           example: davidmgr93@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password.
 *           example: "password123"
 */

// JWT security definition
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
// Register route
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request data
 */

// Login route
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Invalid email or password
 *                       param:
 *                         type: string
 *                         example: email/password
 *                       location:
 *                         type: string
 *                         example: body
 */

// Get user by ID route
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found (password not included in the response)
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/UserWithoutPassword'
 */

// Update user route
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               establishmentName:
 *                 type: string
 *               establishmentType:
 *                 type: string
 *               phone:
 *                 type: string
 *               isVerified:
 *                 type: boolean
 *               isPaid:
 *                 type: boolean
 *               role:
 *                 type: string
 *             example:
 *               firstName: ChangeName
 *               lastName: ChangeLastName
 *               establishmentName: ChangeEstablishmentName
 *               establishmentType: Hotel
 *               phone: '1234567890'
 *               isVerified: true
 *               isPaid: false
 *               role: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/UserWithoutPassword'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

// Delete user route
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

// Change password route
/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password of the user.
 *                 example: "currentPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password for the user.
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Current password is required"
 *                       param:
 *                         type: string
 *                         example: "currentPassword"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */

// Get all users route
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: A list of all users (passwords not included in the response)
 *         content:
 *           application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/UserWithoutPassword'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving users"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
