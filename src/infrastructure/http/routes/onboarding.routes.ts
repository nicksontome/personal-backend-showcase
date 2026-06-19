import { Router } from 'express'
import { OnboardingController } from '../controllers/OnboardingController'
import { authMiddleware } from '../middleware/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: Onboarding
 *   description: Initial goal selection and workout plan generation
 */

export function createOnboardingRoutes(controller: OnboardingController): Router {
  const router = Router()

  /**
   * @swagger
   * /onboarding:
   *   post:
   *     summary: Complete onboarding and generate a workout plan
   *     tags: [Onboarding]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [goal]
   *             properties:
   *               goal:
   *                 type: string
   *                 enum: [muscle_gain, fat_loss]
   *                 example: "muscle_gain"
   *     responses:
   *       201:
   *         description: Plan generated successfully
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Missing or invalid token
   *       404:
   *         description: User not found
   */
  router.post('/', authMiddleware, (req, res) => controller.complete(req, res))

  return router
}