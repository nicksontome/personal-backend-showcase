import { Goal } from '../../../domain/value-objects/Goal'
import { WorkoutPlan, WorkoutDay } from '../../../domain/entities/WorkoutPlan'
import { OnboardingDTO } from '../../dto/onboarding/OnboardingDTO'

export interface GenerateWorkoutPlanOutput {
  goal: string
  days: WorkoutDay[]
}

/**
 * GenerateWorkoutPlanUseCase
 *
 * Generates a complete Push/Pull/Legs workout plan based on the user's
 * chosen goal. The exercise list is fixed; reps, sets, and rest time
 * are derived from the goal's evidence-based guidelines (see Goal value object).
 */
export class GenerateWorkoutPlanUseCase {
  async execute(userId: string, input: OnboardingDTO): Promise<GenerateWorkoutPlanOutput> {
    const goal = Goal.create(input.goal)
    const guidelines = goal.getGuidelines()

    const plan = WorkoutPlan.generate(userId, goal.type, guidelines)

    return {
      goal: plan.goal,
      days: plan.days,
    }
  }
}