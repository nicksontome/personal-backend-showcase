import { randomUUID } from 'crypto'
import { WorkoutGoal } from '../../../domain/value-objects/WorkoutGoal'
import { WorkoutPlan } from '../../../domain/entities/WorkoutPlan'
import { IWorkoutPlanRepository } from '../../../domain/repositories/IWorkoutPlanRepository'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { OnboardingDTO } from '../../dto/onboarding/OnboardingDTO'
import { UserNotFoundError } from '../../errors/UseCaseError'

export interface OnboardingOutput {
  planId: string
  goal: WorkoutGoal
  exercises: Array<{ exerciseId: string; name: string; targetReps: number; restBetweenSetsSecs: number }>
}

/**
 * OnboardingUseCase
 *
 * Generates a fixed 3-exercise workout plan based on the user's goal.
 *
 * This is a deliberately simplified stand-in for the production onboarding
 * flow, which generates a full AI-driven 16-week periodized plan. Here,
 * only target reps and rest periods vary by goal — the exercise list is
 * hardcoded, intentionally, to demonstrate the same architectural flow
 * (validate input → orchestrate domain objects → persist) without
 * exposing the real plan-generation logic.
 */
export class OnboardingUseCase {
  constructor(
    private userRepository: IUserRepository,
    private workoutPlanRepository: IWorkoutPlanRepository,
  ) {}

  async execute(userId: string, input: OnboardingDTO): Promise<OnboardingOutput> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    const plan = WorkoutPlan.create({
      id: randomUUID(),
      userId,
      goal: input.goal as WorkoutGoal,
    })

    await this.workoutPlanRepository.save(plan)

    return {
      planId: plan.id,
      goal: plan.goal,
      exercises: plan.exercises,
    }
  }
}