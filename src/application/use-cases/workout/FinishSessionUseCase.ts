import { ISessionRepository } from '../../../domain/repositories/ISessionRepository'
import { IWorkoutPlanRepository } from '../../../domain/repositories/IWorkoutPlanRepository'
import { InvalidInputError } from '../../errors/UseCaseError'

export interface FinishSessionOutput {
  sessionId: string
  summary: Array<{
    exerciseId: string
    name: string
    bestEstimatedOneRepMax: number
    suggestedNextWeight: number
  }>
}

/**
 * FinishSessionUseCase
 *
 * Completes a session and returns a summary showing, for each exercise,
 * the best estimated 1RM achieved and the suggested working weight to
 * use next time — calculated from that 1RM and the plan's target reps.
 */
export class FinishSessionUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private workoutPlanRepository: IWorkoutPlanRepository,
  ) {}

  async execute(sessionId: string): Promise<FinishSessionOutput> {
    const session = await this.sessionRepository.findById(sessionId)

    if (!session) {
      throw new InvalidInputError(`Session "${sessionId}" not found.`)
    }

    const plan = await this.workoutPlanRepository.findById(session.workoutPlanId)

    if (!plan) {
      throw new InvalidInputError(`Workout plan for session "${sessionId}" not found.`)
    }

    const completedSession = session.complete()
    await this.sessionRepository.save(completedSession)

    const bestOneRepMaxByExercise = completedSession.getBestOneRepMaxByExercise()

    const summary = Object.entries(bestOneRepMaxByExercise).map(([exerciseId, oneRepMax]) => {
      const plannedExercise = plan.findExercise(exerciseId)

      return {
        exerciseId,
        name: plannedExercise?.name ?? exerciseId,
        bestEstimatedOneRepMax: oneRepMax,
        suggestedNextWeight: this.suggestNextWeight(oneRepMax, plannedExercise?.targetReps ?? 8),
      }
    })

    return {
      sessionId: completedSession.id,
      summary,
    }
  }

  /**
   * Suggests next session's working weight using the inverse Epley formula,
   * targeting the plan's prescribed rep range.
   */
  private suggestNextWeight(oneRepMax: number, targetReps: number): number {
    const suggested = oneRepMax / (1 + Math.min(targetReps, 12) / 30)
    return Math.round(suggested * 10) / 10
  }
}