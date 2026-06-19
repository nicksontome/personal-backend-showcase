import { Router } from 'express'
import { createAuthRoutes } from './auth.routes'
import { createOnboardingRoutes } from './onboarding.routes'
import { createWorkoutRoutes } from './workout.routes'
import { AuthController } from '../controllers/AuthController'
import { OnboardingController } from '../controllers/OnboardingController'
import { WorkoutController } from '../controllers/WorkoutController'

/**
 * Centralizes all route registration.
 *
 * Each domain has its own route module (auth, onboarding, workout);
 * this file wires them together under their respective base paths.
 */
export function createRoutes(
  authController: AuthController,
  onboardingController: OnboardingController,
  workoutController: WorkoutController,
): Router {
  const router = Router()

  router.use('/auth', createAuthRoutes(authController))
  router.use('/onboarding', createOnboardingRoutes(onboardingController))
  router.use('/workout', createWorkoutRoutes(workoutController))

  return router
}