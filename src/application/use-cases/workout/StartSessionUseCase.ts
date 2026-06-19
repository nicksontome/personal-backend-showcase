import { randomUUID } from 'crypto'
import { Session } from '../../../domain/entities/Session'
import { ISessionRepository } from '../../../domain/repositories/ISessionRepository'
import { IWorkoutPlanRepository } from '../../../domain/repositories/IWorkoutPlanRepository'
import { InvalidInputError } from '../../errors/UseCaseError'

export interface StartSessionOutput {
  sessionId: string
  exercises: Array<{ exerciseId: string; name: string; targetReps: number; restBetweenSetsSecs: number }>
}

/**
 * StartSessionUseCase
 *
 * Starts a new workout session for the user, based on their active plan.
 * Requires the user to have completed onboarding first.
 */
export class StartSessionUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private workoutPlanRepository: IWorkoutPlanRepository,
  ) {}

  async execute(userId: string): Promise<StartSessionOutput> {
    const plan = await this.workoutPlanRepository.findByUserId(userId)

    if (!plan) {
      throw new InvalidInputError('No workout plan found. Complete onboarding first.')
    }

    const existingSession = await this.sessionRepository.findActiveByUserId(userId)
    if (existingSession) {
      throw new InvalidInputError('User already has an active session in progress.')
    }

    const session = Session.start({
      id: randomUUID(),
      userId,
      workoutPlanId: plan.id,
    })

    await this.sessionRepository.save(session)

    return {
      sessionId: session.id,
      exercises: plan.exercises,
    }
  }
}