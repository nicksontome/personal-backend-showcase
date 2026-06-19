import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router()

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password, name]
   *             properties:
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 example: "password123"
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userId:
   *                   type: string
   *       400:
   *         description: Invalid input
   *       409:
   *         description: Email already registered
   */
  router.post('/register', (req, res) => controller.register(req, res))

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                 userId:
   *                   type: string
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Invalid credentials
   */
  router.post('/login', (req, res) => controller.login(req, res))

  return router
}