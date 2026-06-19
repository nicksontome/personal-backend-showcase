import { Router } from 'express'
import { createAuthRoutes } from './auth.routes'
import { createOnboardingRoutes } from './onboarding.routes'
import { AuthController } from '../controllers/AuthController'
import { OnboardingController } from '../controllers/OnboardingController'

/**
 * Centralizes all route registration.
 *
 * Each domain has its own route module (auth, onboarding); this file
 * wires them together under their respective base paths.
 */
export function createRoutes(
  authController: AuthController,
  onboardingController: OnboardingController,
): Router {
  const router = Router()

  router.use('/auth', createAuthRoutes(authController))
  router.use('/onboarding', createOnboardingRoutes(onboardingController))

  return router
}