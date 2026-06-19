import { Router } from 'express'
import { OnboardingController } from '../controllers/OnboardingController'
import { authMiddleware } from '../middleware/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: Onboarding
 *   description: Pick a training goal and receive a complete PPL workout plan
 */

export function createOnboardingRoutes(controller: OnboardingController): Router {
  const router = Router()

  /**
   * @swagger
   * /onboarding:
   *   post:
   *     summary: Complete onboarding and generate a workout plan
   *     description: >
   *       Pick a goal (muscle_gain or fat_loss) and receive a complete
   *       Push/Pull/Legs (PPL) plan. The exercises are fixed; reps, sets,
   *       and rest time are tailored to the chosen goal using evidence-based
   *       guidelines (hypertrophy: 8-12 reps / fat loss: 12-15 reps with shorter rest).
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
   *                 enum: ["muscle_gain", "fat_loss"]
   *                 example: "muscle_gain"
   *     responses:
   *       201:
   *         description: Workout plan generated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 goal:
   *                   type: string
   *                   example: "muscle_gain"
   *                 days:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       label:
   *                         type: string
   *                         example: "Push"
   *                       exercises:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             name:
   *                               type: string
   *                               example: "Bench Press"
   *                             reps:
   *                               type: integer
   *                               example: 10
   *                             sets:
   *                               type: integer
   *                               example: 4
   *                             restSeconds:
   *                               type: integer
   *                               example: 75
   *       400:
   *         description: Invalid or missing goal
   *       401:
   *         description: Missing or invalid auth token
   */
  router.post('/', authMiddleware, (req, res) => controller.complete(req, res))

  return router
}