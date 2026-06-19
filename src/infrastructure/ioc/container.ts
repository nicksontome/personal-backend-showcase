import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository'
import { InMemoryWorkoutPlanRepository } from '../repositories/InMemoryWorkoutPlanRepository'
import { InMemorySessionRepository } from '../repositories/InMemorySessionRepository'
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUserUseCase'
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUserUseCase'
import { OnboardingUseCase } from '../../application/use-cases/onboarding/OnboardingUseCase'
import { StartSessionUseCase } from '../../application/use-cases/workout/StartSessionUseCase'
import { LogSetUseCase } from '../../application/use-cases/workout/LogSetUseCase'
import { FinishSessionUseCase } from '../../application/use-cases/workout/FinishSessionUseCase'
import { CalibrationService } from '../../domain/services/CalibrationService'
import { AuthController } from '../http/controllers/AuthController'
import { OnboardingController } from '../http/controllers/OnboardingController'
import { WorkoutController } from '../http/controllers/WorkoutController'

/**
 * Container — Dependency Injection
 *
 * Single location where concrete implementations are wired into abstractions.
 * Domain and application layers depend only on interfaces; infrastructure
 * knows about both interfaces and implementations.
 *
 * Swapping implementations (e.g., InMemoryUserRepository → PrismaUserRepository)
 * requires changes here only, never in use cases or controllers.
 */

const jwtSecret = process.env.JWT_SECRET || 'showcase-demo-secret-not-for-production'

// ── Repositories ──────────────────────────────────────────────────────────
const userRepository = new InMemoryUserRepository()
const workoutPlanRepository = new InMemoryWorkoutPlanRepository()
const sessionRepository = new InMemorySessionRepository()

// ── Domain Services ───────────────────────────────────────────────────────
const calibrationService = new CalibrationService()

// ── Use Cases ─────────────────────────────────────────────────────────────
const registerUserUseCase = new RegisterUserUseCase(userRepository)
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtSecret)

const onboardingUseCase = new OnboardingUseCase(userRepository, workoutPlanRepository)

const startSessionUseCase = new StartSessionUseCase(sessionRepository, workoutPlanRepository)
const logSetUseCase = new LogSetUseCase(sessionRepository, calibrationService)
const finishSessionUseCase = new FinishSessionUseCase(sessionRepository, workoutPlanRepository)

// ── Controllers ───────────────────────────────────────────────────────────
const authController = new AuthController(registerUserUseCase, loginUserUseCase)
const onboardingController = new OnboardingController(onboardingUseCase)
const workoutController = new WorkoutController(
  startSessionUseCase,
  logSetUseCase,
  finishSessionUseCase,
)

export {
  userRepository,
  workoutPlanRepository,
  sessionRepository,
  calibrationService,
  registerUserUseCase,
  loginUserUseCase,
  onboardingUseCase,
  startSessionUseCase,
  logSetUseCase,
  finishSessionUseCase,
  authController,
  onboardingController,
  workoutController,
}