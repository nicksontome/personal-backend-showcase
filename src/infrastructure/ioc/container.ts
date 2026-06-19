import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository'
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUserUseCase'
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUserUseCase'
import { GenerateWorkoutPlanUseCase } from '../../application/use-cases/onboarding/GenerateWorkoutPlanUseCase'
import { AuthController } from '../http/controllers/AuthController'
import { OnboardingController } from '../http/controllers/OnboardingController'

/**
 * Container — Dependency Injection
 *
 * Single location where concrete implementations are wired into abstractions.
 * Domain and application layers depend only on interfaces; infrastructure
 * knows about both interfaces and implementations.
 *
 * Swapping implementations (e.g., in-memory → Prisma) requires changes
 * here only, never in use cases or controllers.
 */

const jwtSecret = process.env.JWT_SECRET || 'showcase-demo-secret-not-for-production'

// ── Repositories ──────────────────────────────────────────────────────────
const userRepository = new InMemoryUserRepository()

// ── Use Cases ─────────────────────────────────────────────────────────────
const registerUserUseCase = new RegisterUserUseCase(userRepository)
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtSecret)
const generateWorkoutPlanUseCase = new GenerateWorkoutPlanUseCase()

// ── Controllers ───────────────────────────────────────────────────────────
const authController = new AuthController(registerUserUseCase, loginUserUseCase)
const onboardingController = new OnboardingController(generateWorkoutPlanUseCase)

export {
  userRepository,
  registerUserUseCase,
  loginUserUseCase,
  generateWorkoutPlanUseCase,
  authController,
  onboardingController,
}