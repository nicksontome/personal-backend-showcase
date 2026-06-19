import { WorkoutGoal } from '../value-objects/WorkoutGoal'

export interface PlannedExercise {
  exerciseId: string
  name: string
  targetReps: number
  restBetweenSetsSecs: number
}

/**
 * WorkoutPlan Entity
 *
 * A fixed, 3-exercise plan generated from the user's goal.
 * This showcase uses a single hardcoded exercise list; only rep targets
 * and rest periods vary by goal. The production system generates a full
 * 16-week periodized plan via AI — this is a deliberately simplified
 * stand-in to demonstrate the same architectural pattern.
 */
export class WorkoutPlan {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly goal: WorkoutGoal,
    public readonly exercises: PlannedExercise[],
    public readonly createdAt: Date,
  ) {}

  static create(input: { id: string; userId: string; goal: WorkoutGoal }): WorkoutPlan {
    const exercises = WorkoutPlan.buildExercisesForGoal(input.goal)

    return new WorkoutPlan(input.id, input.userId, input.goal, exercises, new Date())
  }

  /**
   * Builds the fixed 3-exercise list, adjusting target reps and rest
   * periods based on the user's goal.
   *
   * Muscle gain: lower reps, longer rest (favors strength/hypertrophy load).
   * Fat loss: higher reps, shorter rest (favors metabolic conditioning).
   */
  private static buildExercisesForGoal(goal: WorkoutGoal): PlannedExercise[] {
    const isMuscleGain = goal === WorkoutGoal.MUSCLE_GAIN

    const targetReps = isMuscleGain ? 8 : 15
    const restBetweenSetsSecs = isMuscleGain ? 90 : 45

    return [
      { exerciseId: 'ex-1', name: 'Bench Press', targetReps, restBetweenSetsSecs },
      { exerciseId: 'ex-2', name: 'Squat', targetReps, restBetweenSetsSecs },
      { exerciseId: 'ex-3', name: 'Dumbbell Row', targetReps, restBetweenSetsSecs },
    ]
  }

  findExercise(exerciseId: string): PlannedExercise | undefined {
    return this.exercises.find((exercise) => exercise.exerciseId === exerciseId)
  }
}