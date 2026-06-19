import { GoalType, GoalGuidelines } from '../value-objects/Goal'

export interface WorkoutExercise {
  name: string
  reps: number
  sets: number
  restSeconds: number
}

export interface WorkoutDay {
  label: string
  exercises: WorkoutExercise[]
}

/**
 * WorkoutPlan Entity
 *
 * Represents a complete Push/Pull/Legs (PPL) split, generated for a
 * given goal. The exercise list is fixed; only reps, sets, and rest
 * vary, according to the goal's evidence-based guidelines.
 */
export class WorkoutPlan {
  private static readonly PUSH_EXERCISES = ['Bench Press', 'Dumbbell Shoulder Press', 'Triceps Pushdown']
  private static readonly PULL_EXERCISES = ['Lat Pulldown', 'Barbell Row', 'Bicep Curl']
  private static readonly LEGS_EXERCISES = ['Back Squat', 'Leg Press', 'Leg Extension']

  private constructor(
    public readonly userId: string,
    public readonly goal: GoalType,
    public readonly days: WorkoutDay[],
  ) {}

  static generate(userId: string, goal: GoalType, guidelines: GoalGuidelines): WorkoutPlan {
    const buildDay = (label: string, exerciseNames: string[]): WorkoutDay => ({
      label,
      exercises: exerciseNames.map((name) => ({
        name,
        reps: guidelines.reps,
        sets: guidelines.sets,
        restSeconds: guidelines.restSeconds,
      })),
    })

    const days: WorkoutDay[] = [
      buildDay('Push', WorkoutPlan.PUSH_EXERCISES),
      buildDay('Pull', WorkoutPlan.PULL_EXERCISES),
      buildDay('Legs', WorkoutPlan.LEGS_EXERCISES),
    ]

    return new WorkoutPlan(userId, goal, days)
  }
}