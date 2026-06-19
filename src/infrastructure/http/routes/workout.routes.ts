import { Router } from 'express'
import { WorkoutController } from '../controllers/WorkoutController'
import { authMiddleware } from '../middleware/auth.middleware'

/**
 * @swagger
 * tags:
 *   name: Workout
 *   description: Workout session flow — start, log sets, finish
 */

export function createWorkoutRoutes(controller: WorkoutController): Router {
  const router = Router()

  /**
   * @swagger
   * /workout/start:
   *   post:
   *     summary: Start a new workout session based on the user's active plan
   *     tags: [Workout]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Session started, returns the planned exercises
   *       400:
   *         description: No active plan, or a session is already in progress
   *       401:
   *         description: Missing or invalid token
   */
  router.post('/start', authMiddleware, (req, res) => controller.start(req, res))

  /**
   * @swagger
   * /workout/{sessionId}/log-set:
   *   post:
   *     summary: Log a single set and calculate its estimated 1RM
   *     tags: [Workout]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [exerciseId, weight, reps]
   *             properties:
   *               exerciseId:
   *                 type: string
   *                 example: "ex-1"
   *               weight:
   *                 type: number
   *                 example: 80
   *               reps:
   *                 type: integer
   *                 example: 8
   *     responses:
   *       200:
   *         description: Set logged, returns estimated 1RM
   *       401:
   *         description: Missing or invalid token
   *       404:
   *         description: Session not found
   */
  router.post('/:sessionId/log-set', authMiddleware, (req, res) => controller.logSet(req, res))

  /**
   * @swagger
   * /workout/{sessionId}/finish:
   *   post:
   *     summary: Finish the session and get the next-session weight summary
   *     tags: [Workout]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Session completed, returns summary with suggested next weights
   *       401:
   *         description: Missing or invalid token
   *       404:
   *         description: Session not found
   */
  router.post('/:sessionId/finish', authMiddleware, (req, res) => controller.finish(req, res))

  return router
}